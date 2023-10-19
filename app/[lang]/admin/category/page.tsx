import Header from '@/components/header';
import Footer from '@/components/footer';
import { options as authOptions } from '@/lib/auth-options';
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';
import myConfig from '@/public.config.json';
import Content from './content';

export default async function Category({ params: { lang }}: { params: { lang: string }}) {

  const session = await getServerSession(authOptions);

  if ( !session ) redirect( '/' );

  return (
    <>
      <Header lang={ lang } />
      <Content
        lang={ lang } defaultLang={ myConfig.locale.default }
        locales={ myConfig.locale['accept-lang'] }
        localeLabels={ myConfig.locale.labels }
      />
      <Footer />
    </>
  )
}