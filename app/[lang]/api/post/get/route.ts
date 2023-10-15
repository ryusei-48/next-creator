import { getServerSession } from 'next-auth/next';
import { options } from '@/lib/auth-options';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function GetPost( request: NextRequest ) {

  const session = await getServerSession( options );
  if ( !session ) return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });

  const postJson = await request.json() as Prisma.PostWhereInput;

  const result = await prisma.post.findFirst({
    where: postJson, select: {
      title: true, body: true, status: true, description: true,
      permalink: true, user: { select: { nameid: true } },
      media: { select: { id: true, url: true } },
      CategoryPost: { select: { category: { select: { id: true, name: true } } } }
    }
  });

  return NextResponse.json({ ...result }, { status: 200 });
}

export { GetPost as POST }