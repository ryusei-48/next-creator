import { getServerSession } from 'next-auth/next';
import { options } from '@/lib/auth-options';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function register( req: NextRequest ) {

  const session = await getServerSession( options );
  const registerData = await req.json();

  if (
    !session && typeof registerData.userId === 'string'
    && typeof registerData.password === 'string'
    && registerData.userId.match( /^([0-9a-zA-Z]|_|-){7,20}$/g )
  ) {

    const hashedPassword = await bcrypt.hash( registerData.password, 10 );

    try {
      await prisma.user.create({
        data: { nameid: registerData.userId, password: hashedPassword }
      });
  
      return NextResponse.json({ isRegistered: true }, { status: 200 });
    }catch ( e ) {
      console.log(e);
      return NextResponse.json({ isRegistered: false, message: 'Database request error.' }, { status: 401 });
    }
  }

  return NextResponse.json({ isRegistered: false, message: 'Access denied.' }, { status: 401 });
}

export { register as POST }