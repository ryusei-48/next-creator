import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function SlugExist( req: NextRequest ) {

  const { slug } = await req.json() as { slug: string };

  const mediaList = await prisma.category.findFirst({ where: { slug }});

  return NextResponse.json({ isExist: mediaList ? true : false }, { status: 200 });
}

export { SlugExist as POST }