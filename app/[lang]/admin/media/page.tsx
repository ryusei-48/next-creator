import Image from 'next/image'
import Header from '@/components/header';
import Footer from '@/components/footer';
import styles from './page.module.css'
import { options as authOptions } from '@/lib/auth-options';
import { getServerSession } from "next-auth";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Content from './content';

export default async function Media({ params: { lang } }: {
  params: { lang: string }
}) {

  const session = await getServerSession(authOptions);

  if ( !session ) redirect( '/' );

  return (
    <>
      <Header lang={ lang } />
      <Content />
      <Footer />
    </>
  )
}