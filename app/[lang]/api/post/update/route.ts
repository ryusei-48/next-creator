import { getServerSession } from 'next-auth/next';
import { options } from '@/lib/auth-options';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function PostUpdate( request: NextRequest ) {

  const session = await getServerSession( options );
  if ( !session ) return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });

  const postJson = await request.json() as { id: number, update: Prisma.PostUpdateInput };
  //console.log( "\n\n", postJson.id, "\n\n" );

  const result = await prisma.post.update({
    where: { id: postJson.id }, data: postJson.update,
    select: {
      title: true, body: true, status: true,
      user: { select: { nameid: true } },
      media: { select: { id: true, url: true } },
      CategoryPost: { select: { category: { select: { id: true, name: true } } } }
    }
  })

  return NextResponse.json({ ...result }, { status: 200 });
}

export { PostUpdate as POST }