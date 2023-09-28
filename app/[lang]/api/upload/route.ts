import { getServerSession } from 'next-auth/next';
import { options } from '@/lib/auth-options';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';
import { fileTypeFromBuffer } from 'file-type';
import { mkdir } from 'fs/promises';
import { getStrDatetime, pathExist, randomString } from '@/lib/functions';
import sharp from 'sharp';

const APP_URL = process.env.APP_URL;
const APP_PATH = process.env.APP_ROOT_PATH;
const MEDIA_ROOT_PATH = `${ APP_PATH }/public/media`;

const prisma = new PrismaClient();

async function upload( req: NextRequest ) {

  const session = await getServerSession( options );
  const registerData = await req.formData();
  const file: File | null = registerData.get('upload') as unknown as File;

  if ( session && file ) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from( bytes );
    const fileType = await fileTypeFromBuffer( buffer );

    const year = getStrDatetime('y');
    const month = getStrDatetime('m');
    const day = getStrDatetime('d');
    const savePath = `${ MEDIA_ROOT_PATH }/${ year }/${ month }/${ day }`;
    const savePathRelative = `/media/${ year }/${ month }/${ day }`
    const prefix = randomString( 15 );
    //const mediaUrl = `http://ryuseiweb.localhost/media/${ year }/${ month }/${ day }/`;
    const mediaUrls: { urls: {[key: string]: string }} = { urls: {}}
    const mediaPaths: { paths: {[key: string]: string }} = { paths: {}}
    //const fileName = `${ prefix }_original_${ file.name.replace(/\..+$/, '') }`;

    process.umask(0);
    if ( !await pathExist( `${ MEDIA_ROOT_PATH }/${ year }` ) ) {
      await mkdir( `${ MEDIA_ROOT_PATH }/${ year }`, "0755" );
    }
    if ( !await pathExist( `${ MEDIA_ROOT_PATH }/${ year }/${ month }` ) ) {
      await mkdir( `${ MEDIA_ROOT_PATH }/${ year }/${ month }`, "0755" );
    }
    if ( !await pathExist( savePath ) ) {
      await mkdir( savePath, "0755" );
    }

    if ( fileType && fileType.mime.indexOf('image/') >= 0 ) {

      const imageConverter = sharp( buffer, { animated: true });
      const imageMeta = await imageConverter.metadata();
      const resizeWidth: number[] = []

      if ( imageMeta.width && imageMeta.width >= 800 ) resizeWidth.push( 800 );
      if ( imageMeta.width && imageMeta.width >= 1400 ) resizeWidth.push( 1400 );
      if ( imageMeta.width && imageMeta.width >= 1920 ) resizeWidth.push( 1920 );
      if ( imageMeta.width && imageMeta.width >= 2500 ) resizeWidth.push( 2500 );
      if ( imageMeta.width && imageMeta.width >= 3000 ) resizeWidth.push( 3000 );
      if ( imageMeta.width && imageMeta.width >= 3500 ) resizeWidth.push( 3500 );
      if ( imageMeta.width ) resizeWidth.push( imageMeta.width );

      await new Promise<void>((resolve) => {
        for ( let width of resizeWidth ) {
          let resized = imageConverter.resize( width );

          switch ( imageMeta.format ) {
            case 'jpg' || 'jpeg':
              resized = resized.jpeg({ quality: 80 }); break;
            case 'png':
              resized = resized.png({ compressionLevel: 9, quality: 80 }); break;
          }
          resized.toFile(`${ savePath }/${ prefix }_w${ width }_${ file.name }`, () => { resolve() });
          mediaPaths.paths[ width ] = savePathRelative + `/${ prefix }_w${ width }_${ file.name }`;
          mediaUrls.urls[ width ] = APP_URL + `/api/media-stream?w=${ width }&id=`
        }
      });

      if ( imageMeta.width ) {
        mediaPaths.paths['default'] = mediaPaths.paths[ imageMeta.width ];
        mediaUrls.urls['default'] = mediaUrls.urls[ imageMeta.width ];
      }

      const dbResult = await prisma.media.create({ data: {
        name: file.name, mime: fileType.mime, url: mediaPaths
      }});

      for ( let [ size, url ] of Object.entries( mediaUrls.urls ) ) {
        mediaUrls.urls[ size ] = url + `${ dbResult.id }`
      }

      return NextResponse.json( mediaUrls, { status: 200 });
    }
  }

  return NextResponse.json({
    error: {
      message: "アップロードに失敗しました。"
    }
  }, { status: 200 });
}

export { upload as POST }