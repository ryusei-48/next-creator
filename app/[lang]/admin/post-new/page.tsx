import Header from '@/components/header';
import { options as authOptions } from '@/lib/auth-options';
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';
//import dynamic from 'next/dynamic';
import Content from './content';

//const Content = dynamic(() => import( './content' ));

export default async function PostNewPage() {

  const session = await getServerSession(authOptions);

  if ( !session ) redirect( '/' );

  return (
    <>
      <Header />
      <Content />
    </>
  )
}