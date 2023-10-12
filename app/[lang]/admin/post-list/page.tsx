import Header from '@/components/header';
import Footer from '@/components/footer';
import styles from './page.module.css'
import { options as authOptions } from '@/lib/auth-options';
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';
import myConfig from '@/public.config.json';
import Content from './content';

export default async function PostManage({ params: { lang } }: {
  params: { lang: string }
}) {

  const session = await getServerSession(authOptions);

  if ( !session ) redirect( '/' );

  return (
    <>
      <Header />
      <Content
        locales={ myConfig.locale['accept-lang'] } defaultLang={ myConfig.locale.default }
        useLang={ lang } localeLabels={ myConfig.locale.labels }
      />
      <Footer />
    </>
  )
}