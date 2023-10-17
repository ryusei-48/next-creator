import Header from '@/components/header';
import Container from '@/components/container';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import style from './page.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import myConfig from '@/public.config.json';
import { redirect } from 'next/navigation';
import { getStrDatetime } from '@/lib/functions';
import { ArticleCommon } from '../page';
import Link from 'next/link';

export default async function Article({ params: { lang, permalink } }: {
  params: { lang: string, permalink: string }
}) {

  const response = await fetch(`${ process.env.API_ACCESS_ADDRESS }/api/post/get`, {
    method: 'POST', body: JSON.stringify({ permalink }),
    headers: {
      "API_ACCESS_TOKEN": process.env.API_ACCESS_TOKEN!
    }
  });

  let postData: Post.GetPost | null = null;
  if ( response.ok ) {
    postData = await response.json();
    if ( !postData || Object.keys( postData ).length === 0 ) {
      redirect('/');
    }
  }else redirect('/');

  return (
    <ArticleCommon postData={ postData } lang={ lang } />
  )
}