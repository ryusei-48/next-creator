import { PrismaClient } from '@prisma/client';
import sanitize from 'sanitize-html';
import { type NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

async function getComments( request: NextRequest ) {

  const { post_id } = await request.json() as { post_id: number };
  if ( !post_id ) return NextResponse.json({ message: 'Incorrect format.' }, { status: 401 });
  
  try {

    const result = await prisma.discussion.findMany({
      where: { post_id }
    });

    return NextResponse.json( result, { status: 200 });
  }catch (e) {
    return NextResponse.json({ message: 'Prisma Error.' }, { status: 401 });
  }
}

export { getComments as POST }