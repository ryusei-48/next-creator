import { getServerSession } from 'next-auth/next';
import { options } from '@/lib/auth-options';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function GetMediaFirst( req: NextRequest ) {
  
  const session = await getServerSession( options );
  if ( !session ) return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });

  const { id } = await req.json() as { id: string };

  const mediaList = await prisma.media.findFirst({
    where: { id: Number( id ) }
  });

  return NextResponse.json( mediaList, { status: 200 });
}

export { GetMediaFirst as POST }