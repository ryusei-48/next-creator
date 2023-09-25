import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

async function userExist( req: NextRequest ) {

  const data = await req.json();
  let userId: string | null = null;
  
  const user = await prisma.user.findUnique({
      where: {
          nameid: data.userId
      },
  });

  if ( user && user.nameid ) userId = user.nameid;

  return NextResponse.json( { name: userId }, { status: 200 });
}

export { userExist as POST }