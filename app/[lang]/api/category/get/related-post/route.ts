import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

export type RequestJson = {
  where: { slug: string },
  take: number, skip: number
}

const prisma = new PrismaClient();

async function GetCategoruPost( req: NextRequest ) {

  const { where: { slug } } = await req.json() as RequestJson;

  const result = await prisma.category.findFirst({
    where: { slug }, select: {
      id: true, name: true, slug: true,
      CategoryPost: { select: { post: { select: {
        id: true, title: true, body: true, status: true, description: true,
        permalink: true, user: { select: { nameid: true } },
        media: { select: { id: true, url: true } },
        register_date: true, update_date: true
      } } }, orderBy: { post: { register_date: 'desc' } } }
    }
  });

  return NextResponse.json( result, { status: 200 });
}

export { GetCategoruPost as POST }