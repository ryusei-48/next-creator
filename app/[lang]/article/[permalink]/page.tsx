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
import type { Metadata, ResolvingMetadata } from 'next';
//import Link from 'next/link';

type Props = {
  params: { lang: AcceptLocales, permalink: string | undefined }
  //searchParams: { id: string | undefined }
}

async function getPost( permalink: string ) {
  return fetch(`${ process.env.API_ACCESS_ADDRESS }/api/post/get`, {
    method: 'POST', body: JSON.stringify({ permalink }),
    headers: {
      "API_ACCESS_TOKEN": process.env.API_ACCESS_TOKEN!
    },
    next: { revalidate: 30 }
  });
}

export async function generateMetadata(
  { params: { lang, permalink } }: Props, parent: ResolvingMetadata
): Promise<Metadata> {

  if ( !permalink ) redirect( '/' );

  const response = await getPost( permalink );

  let postData: Post.GetPost | null = null;
  if ( response.ok ) {
    postData = await response.json();
    if ( !postData || Object.keys( postData ).length === 0 ) {
      redirect('/');
    }
  }else return redirect('/');

  const parentMeta = await parent;
  const previousImages = parentMeta.openGraph?.images || [];

  let ogpImage = '';
  if ( postData.media ) {
    delete postData.media.url.paths['default'];
    const size = Object.keys( postData.media.url.paths )[0];
    ogpImage = `${ process.env.APP_URL }/api/media-stream?id=${ postData.media.id }&w=${ size }`
  }

  const thisPathname = `${ postData.permalink ? `article/${ postData.permalink }` : `article?id=${ postData.id }` }`;
  const langParams: {[key: string]: string} = {}
  for ( let lang of myConfig.locale['accept-lang'] ) {
    langParams[ lang ] = `/${ lang }/${ thisPathname }`;
  }
  langParams['x-default'] = `/${ thisPathname }`;

  return {
    title: postData.title[ lang ],
    description: postData.description ? postData.description[ lang ]  : '',
    alternates: {
      languages: langParams,
      canonical: '/article' + ( postData.permalink ? `/${ postData.permalink }` : `?id=${ postData.id }` )
    },
    openGraph: {
      images: [ ...previousImages, ogpImage ],
      description: postData.description ? postData.description[ lang ]  : '',
      siteName: parentMeta.openGraph?.siteName,
      type: 'website'
    }
  }
}

export default async function Article({ params: { lang, permalink } }: {
  params: { lang: AcceptLocales, permalink: string }
}) {

  const response = await getPost( permalink );
  const postData = await response.json() as Post.GetPost;

  return (
    <ArticleCommon postData={ postData } lang={ lang } />
  )
}