import { getServerSession } from 'next-auth/next';
import { options } from '@/lib/auth-options';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';
import { writeFile } from 'fs/promises';
import { getSavePath } from '@/lib/functions';

type InsertPost = {
  body: {[kkey: string]: string}, thumbnail: number, title: string,
  categorys: number[], status: 'draft' | 'publih' | 'trash'
}

const prisma = new PrismaClient();

async function PostCreate( request: NextRequest ) {

  const session = await getServerSession( options );
  if ( !session ) return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });

  //const postJson = await request.json() as InsertPost;
  const postJson: InsertPost = {
    title: 'test', body: { js: 'test' }, status: 'draft'
  }

  const result = await prisma.post.create({
    data: {
      title: postJson.title, body: postJson.body,
      CategoryPost: {
        create: [
          { category: { connect: { id: 11 } } },
          { category: { connect: { id: 24 } } },
        ]
      },
      status: postJson.status, user: { connect: { id: 1 } },
      media: { connect: { id: 50 } }
    }
  });

  return NextResponse.json({ result }, { status: 401 });
}

export { PostCreate as GET }