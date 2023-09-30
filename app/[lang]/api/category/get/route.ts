import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function GetCategory( req: NextRequest ) {

  //const { id } = await req.json() as { id: string };

  const mediaList = await prisma.category.findMany();

  return NextResponse.json( mediaList, { status: 200 });
}

export { GetCategory as POST }