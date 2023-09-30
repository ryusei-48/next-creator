import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { createReadStream } from 'fs';
import { PrismaClient } from '@prisma/client';

const APP_PATH = process.env.APP_ROOT_PATH;
const MEDIA_ROOT_PATH = `${ APP_PATH }/public`;

const prisma = new PrismaClient();

async function MediaStreamIcon( request: NextRequest ) {

  const responseHeader = new Headers( request.headers );
  const requestUrl = new URL( request.url ).searchParams;
  const id = requestUrl.get('id');

  if ( id && id.match( /^[0-9]+$/g ) ) {
    const category = await prisma.category.findFirst({
      where: { id: Number( id ) }
    });

    if ( category && category.icon && category.icon_mime ) {
      responseHeader.set( 'Content-Type', category.icon_mime );
      const stream = createReadStream( MEDIA_ROOT_PATH + category.icon );

      return new Response( stream as any, { headers: responseHeader });
    }
  }

  return NextResponse.json({ message: 'メディアの取得に失敗しました。' }, { status: 401 });
}

export { MediaStreamIcon as GET }