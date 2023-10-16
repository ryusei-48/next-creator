import Header from '@/components/header';
import Container from '@/components/container';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import style from './page.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import myConfig from '@/public.config.json';
import { redirect } from 'next/navigation';
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

    <>
      <Header />
      <Container>
        <div className={ style.post_title_wrap }>
          <h1>{ postData ? postData.title[ lang ] : '' }</h1>
          <div className={ style.post_meta }>
            <div className={ style.categorys }>
              {
                postData.CategoryPost.map((cat) => {
                  return (
                    <span className={ style.category }>
                      <span className={ style.icon }>
                        {
                          cat.category.icon_mime ?
                          <span className={ style.image_wrap }>
                            <img src={`../api/media-stream/icon?id=${ cat.category.id }`}
                              loading="lazy" alt={`${ cat.category.name[ lang ] } - アイコン`}
                            />
                          </span> :
                          <FontAwesomeIcon icon={ faHashtag }></FontAwesomeIcon>
                        }
                      </span>
                      <span className={ style.name }>
                        { cat.category.name[ lang ] }
                      </span>
                    </span>
                  )
                })
              }
            </div>
          </div>
        </div>
        <main className={ style.post_content }>
          <div
            className={ style.insert_html }
            dangerouslySetInnerHTML={{ __html: postData ? postData?.body[ lang ] as string : '' }}
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