import Header from '@/components/header';
import Footer from '@/components/footer';
import { options as authOptions } from '@/lib/auth-options';
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import myConfig from '@/public.config.json';
import Content from './content';

const prisma = new PrismaClient();

export default async function Login({ params: { lang } }: {
  params: { lang: AcceptLocales }
}) {

  const session = await getServerSession(authOptions);

  if ( session ) redirect( '/' );

  const userCount = await prisma.user.count();

  return (
    <>
      <Header lang={ lang } />
      <Content
        locales={ myConfig.locale['accept-lang'] } defaultLang={ myConfig.locale.default }
        useLang={ lang } localeLabels={ myConfig.locale.labels } userCount={ userCount }
      />
      <Footer lang={ lang } />
    </>
  )
}