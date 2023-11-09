import { PrismaClient } from '@prisma/client';
import sanitize from 'sanitize-html';
import { type NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

async function createNewComment( request: NextRequest ) {

  const formData = await request.formData();
  const nicname = formData.get('nicname');
  const email = formData.get('email');
  const body = formData.get('body');
  const post_id = formData.get('post_id');
  if ( !nicname || !email || !body || !post_id ) {
    return NextResponse.json({ message: 'Incorrect format.' }, { status: 401 });
  }

  try {

    const result = await prisma.discussion.create({
      data: {
        nicname: nicname.toString(), body: sanitize( body.toString(), {
          allowedTags: []
        }).replaceAll("\n", "<br/>").replaceAll(/(<br\/>){3,}/g, '<br/><br/>'),
        sender_info: { email: email.toString() },
        Post: { connect: { id: Number( post_id?.toString() ) } }
      }
    });

    return NextResponse.json( result, { status: 200 });
  }catch (e) {
    return NextResponse.json({ message: 'Prisma Error.' }, { status: 401 });
  }
}

export { createNewComment as POST }