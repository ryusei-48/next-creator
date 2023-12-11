/*import Header from '@/components/header';
import Container from '@/components/container';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import style from './page.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from '@fortawesome/free-solid-svg-icons';*/
import myConfig from '@/public.config.json';
import { redirect } from 'next/navigation';
//import { getStrDatetime } from '@/lib/functions';
import { ArticleCommon } from '../page';
import { PrismaClient } from '@prisma/client';
import { postBodyFormat } from '@/lib/functions';
import type { Metadata, ResolvingMetadata } from 'next';
//import Link from 'next/link';

type Props = {
  params: { lang: AcceptLocales, permalink: string | undefined }
  //searchParams: { id: string | undefined }
}

const prisma = new PrismaClient();

async function getPost( permalink: string ) {
  return await prisma.post.findFirst({
    where: { permalink }, select: {
      id: true, title: true, body: true, status: true, description: true,
      permalink: true, user: { select: { nameid: true } },
      media: { select: { id: true, url: true } },
      CategoryPost: { select: { category: { select: { id: true, name: true, slug: true, icon_mime: true } } } },
      register_date: true, update_date: true, type: true
    }
  });
}

export async function generateMetadata(
  { params: { lang, permalink } }: Props, parent: ResolvingMetadata
): Promise<Metadata> {

  if ( !permalink ) redirect( '/' );

  const postData: Post.GetPost = await getPost( permalink ) as any;

  if ( !postData ) {
    redirect('/');
  }

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

  const postData: Post.GetPost = await getPost( permalink ) as any;

  for ( let [ lang, bodey ] of Object.entries( postData.body ) ) {
    postData.body[ lang ] = postBodyFormat( bodey );
  }

  return (
    <ArticleCommon postData={ postData } lang={ lang } />
  )
}