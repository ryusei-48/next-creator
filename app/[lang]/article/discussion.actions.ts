'use server';
import { PrismaClient } from '@prisma/client';
import sanitize from 'sanitize-html';

const prisma = new PrismaClient();

export async function createNewComment( prestate?: any, formData?: FormData ) {

  const nicname = formData!.get('nicname');
  const email = formData!.get('email');
  const body = formData!.get('body');
  const post_id = formData!.get('post_id');
  if ( !nicname || !email || !body || !post_id ) return null;
  
  const result = prisma.discussion.create({
    data: {
      nicname: nicname.toString(), body: sanitize( body.toString(), {
        allowedTags: []
      }).replaceAll("\n", "<br/>").replaceAll(/(<br\/>){3,}/g, '<br/><br/>'),
      sender_info: { email: email.toString() },
      Post: { connect: { id: Number( post_id?.toString() ) } }
    }
  });

  return result;
}

export async function getComments( payload?: number, post_id?: number ) {

  if ( !post_id ) return null;
  const result = await prisma.discussion.findMany({
    where: { post_id }
  });

  return result;
}