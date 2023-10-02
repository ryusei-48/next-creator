import Image from 'next/image'
import Header from '@/components/header';
import styles from './page.module.css'
import { options as authOptions } from '@/lib/auth-options';
import { getServerSession } from "next-auth";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Content from './content';

export default async function Category({ params: { lang }}: { params: { lang: string }}) {

  const session = await getServerSession(authOptions);

  if ( !session ) redirect( '/' );

  return (
    <>
      <Header />
      <Content lang={ lang } />
    </>
  )
}