import { getServerSession } from 'next-auth/next';
import { options } from '@/lib/auth-options';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';
import { unlink } from 'fs/promises';

const APP_PATH = process.env.APP_ROOT_PATH;
const MEDIA_ROOT_PATH = `${ APP_PATH }/public`;

const prisma = new PrismaClient();

async function removeMedia( req: NextRequest ) {

  const session = await getServerSession( options );
  const responseJson: { deleted: boolean, error?: string } = { deleted: false }

  if ( session ) {

    const { id: mediaId } = await req.json() as { id: string };

    try {
      const removeResult = await prisma.media.delete({
        where: { id: Number( mediaId ) }
      });

      const { paths } = removeResult.url as { paths: {[key: string]: string}};
      delete paths['default'];

      for ( let [ _, path ] of Object.entries( paths ) ) {
        await unlink( MEDIA_ROOT_PATH + path );
      }

      responseJson.deleted = true;

    }catch (e) {
      responseJson.error = (<any>e).code;
      console.log( e );
    }
  }

  return NextResponse.json( responseJson, { status: 200 });
}

export { removeMedia as POST }