import { getServerSession } from 'next-auth/next';
import { options } from '@/lib/auth-options';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';
import { postBodyFormat } from '@/lib/functions';

const prisma = new PrismaClient();

async function GetPost( request: NextRequest ) {

  const session = await getServerSession( options );
  const access_token = request.headers.get('API_ACCESS_TOKEN');
  if ( !session && process.env.API_ACCESS_TOKEN !== access_token ) {
    return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });
  }

  const postJson = await request.json() as Prisma.PostWhereInput;

  const result = await prisma.post.findFirst({
    where: postJson, select: {
      id: true, title: true, body: true, status: true, description: true,
      permalink: true, user: { select: { nameid: true } },
      media: { select: { id: true, url: true } },
      CategoryPost: { select: { category: { select: { id: true, name: true, slug: true, icon_mime: true } } } },
      register_date: true, update_date: true, type: true
    }
  });

  if ( result ) {
    const body = result.body as Prisma.JsonObject;
    for ( let lang of Object.keys( body ) ) {
      body[ lang ] = postBodyFormat( body[ lang ] as string );
    }
    result.body = body;
  }

  return NextResponse.json({ ...result }, { status: 200 });
}

export { GetPost as POST }