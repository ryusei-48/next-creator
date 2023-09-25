import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { createReadStream } from 'fs';
import { PrismaClient } from '@prisma/client';

const APP_PATH = process.env.APP_ROOT_PATH;
const MEDIA_ROOT_PATH = `${ APP_PATH }/public`;

const prisma = new PrismaClient();

async function MediaStream( req: NextRequest ) {

  const responseHeader = new Headers( req.headers );

  const requestUrl = new URL( req.url ).searchParams;
  const size = requestUrl.get('w');
  const id = requestUrl.get('id');

  if ( size && id ) {
    const imageInfo = await prisma.media.findFirst({
      where: { id: Number( id ) }
    });

    if ( imageInfo ) {
      const urls = imageInfo.url as { paths: {[key: string]: string}};
      responseHeader.set( 'Content-Type', imageInfo.mime );
      
      if ( urls.paths[ size ] ) {
        const stream = createReadStream( MEDIA_ROOT_PATH + urls.paths[ size ] );
        return new Response( stream as any, { headers: responseHeader });
      }
    }
  }

  return NextResponse.json({ message: 'メディアの取得に失敗しました。' }, { status: 401 });
}

export { MediaStream as GET }