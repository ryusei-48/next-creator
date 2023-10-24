import Header from '@/components/header';
import Footer from '@/components/footer';
import styles from './page.module.css'
import { options as authOptions } from '@/lib/auth-options';
import { getServerSession } from "next-auth";
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function PostManage({ params: { lang } }: {
  params: { lang: AcceptLocales }
}) {

  const session = await getServerSession(authOptions);

  if ( !session ) redirect( '/' );

  redirect('/admin/post-list');

  return (
    <>
      <Header lang={ lang } />
      <h1>投稿編集ページ</h1>
      <p>{ session?.user?.name }</p>
      <Footer />
    </>
  )
}