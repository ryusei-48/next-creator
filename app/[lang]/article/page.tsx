import Header from '@/components/header';
import Container from '@/components/container';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import style from './page.module.scss'
import myConfig from '@/public.config.json';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Article({ params: { lang } }: {
  params: { lang: string }
}) {

  const requestUrl = headers().get('x-url');
  if ( !requestUrl ) redirect( '/' );
  const postId = new URL( requestUrl! ).searchParams.get('id');
  if ( !postId ) redirect( '/' );

  const response = await fetch(`${ process.env.API_ACCESS_ADDRESS }/api/post/get`, {
    method: 'POST', body: JSON.stringify({ id: Number( postId ) }),
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
  }else return redirect('/');

  return (

    <>
      <Header />
      <Container>
        <div className={ style.post_title_wrap }>
          <h1>{ postData ? postData.title[ lang ] : '' }</h1>
        </div>
        <main className={ style.post_content }>
          <div
            className={ style.insert_html }
            dangerouslySetInnerHTML={{ __html: postData ?  postData!.body[ lang ] as string : '' }}
          ></div>
        </main>
        <Sidebar
          useLang={ lang } defaultLang={ myConfig.locale.default }
          locales={ myConfig.locale['accept-lang'] }
          localeLabels={ myConfig.locale.labels }
        />
      </Container>
      <Footer />
    </>
  )
}