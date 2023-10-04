import Image from 'next/image'
import Header from '@/components/header';
import Footer from '@/components/footer';
import styles from './page.module.css'
import { options as authOptions } from '@/lib/auth-options';
import { getServerSession } from "next-auth";
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function PostManage() {

  const session = await getServerSession(authOptions);

  if ( !session ) redirect( '/' );

  return (
    <>
      <Header />
      <h1>投稿編集ページ</h1>
      <p>{ session?.user?.name }</p>
      <div dangerouslySetInnerHTML={{
        __html: ``
      }}></div>
      <Footer />
    </>
  )
}