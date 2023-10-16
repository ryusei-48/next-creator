import { getServerSession } from 'next-auth/next';
import { options } from '@/lib/auth-options';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';
//import { postBodyFormat } from '@/lib/functions';

const prisma = new PrismaClient();

async function GetPostMany( request: NextRequest ) {

  const session = await getServerSession( options );
  const access_token = request.headers.get('API_ACCESS_TOKEN');
  if ( !session && process.env.API_ACCESS_TOKEN !== access_token ) {
    return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });
  }

  const postJson = await request.json() as {
    orderBy: Prisma.PostOrderByWithRelationInput[],
    take: number, skip: number
  };

  const result = await prisma.post.findMany({
    orderBy: postJson.orderBy,
    take: postJson.take + 1, skip: postJson.skip, select: {
      id: true, title: true, status: true,
      user: { select: { nameid: true } }, description: true,
      permalink: true, media: { select: { id: true, url: true } },
      CategoryPost: { select: { category: { select: { id: true, name: true } } } },
      register_date: true, update_date: true
    }
  });

  let isNext = false;
  if ( result.length === postJson.take + 1 ) isNext = true;

  return NextResponse.json({ result, isNext }, { status: 200 });
}

export { GetPostMany as POST }