import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';
import { createTransport, type SentMessageInfo } from 'nodemailer';

export type SendToData = {
  name: string, email: string,
  subject: string, body: string
}

export type ContactResult = {
  success: true, message: SentMessageInfo
} | {
  success: false, message: string
}

async function Contact( request: NextRequest ) {

  const sendToData = await request.json() as SendToData;
  console.log( sendToData );

  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    secure: false, port: 587,
    tls: { ciphers:'SSLv3' },
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
  });

  const result = await new Promise<ContactResult>((resolve) => {

    let body = `◇氏名：${ sendToData.name }\n`;
    body += `◇email：${ sendToData.email }\n`;
    body += `◇件名：${ sendToData.subject }\n`;
    body += `◇問い合わせ内容：\n${ sendToData.body }\n`;

    transporter.sendMail({
      from: `"${ process.env.NEXT_PUBLIC_SITE_TITLE }" <${ process.env.USE_ADDRESS }>`,
      to: process.env.USE_ADDRESS,
      subject: 'ブログからのお問い合わせ',
      text: body
    }, (err, info) => {
      if ( err ) resolve({ success: false, message: err.message });
  
      resolve({ success: true, message: info });
    });
  });

  return NextResponse.json( result , { status: 200 });
}

export { Contact as POST }