import { getServerSession } from 'next-auth/next';
import { options } from '@/lib/auth-options';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type requestParam = { take: number, skip: number, sort: 'asc' | 'desc' }

async function GetMedia( req: NextRequest ) {
  
  const session = await getServerSession( options );
  if ( !session ) return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });

  const { take, skip, sort } = await req.json() as requestParam;

  const mediaList = await prisma.media.findMany({
    orderBy: [{ register_date: sort }], take: take + 1, skip
  });

  let isNext = false;
  if ( mediaList.length === take + 1 ) {
    isNext = true; mediaList.pop();
  }

  return NextResponse.json({ mediaList, isNext }, { status: 200 });
}

export { GetMedia as POST }