import { getServerSession } from 'next-auth/next';
import { options } from '@/lib/auth-options';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function PostCreate( request: NextRequest ) {

  const session = await getServerSession( options );
  if ( !session ) return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });

  const postJson = await request.json() as Prisma.PostCreateInput;

  //console.log( postJson );

  const result = await prisma.post.create({
    data: postJson
    /*data: {
      title: postJson.title, body: postJson.body,
      CategoryPost: {
        create: [
          { category: { connect: { id: 11 } } },
          { category: { connect: { id: 24 } } },
        ]
      },
      status: postJson.status, user: { connect: { id: 1 } },
      media: { connect: { id: 50 } }
    }*/
  });

  return NextResponse.json({ result }, { status: 200 });
}

export { PostCreate as POST }