import Header from '@/components/header';
import Container from '@/components/container';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import style from './page.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import myConfig from '@/public.config.json';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getStrDatetime } from '@/lib/functions';
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
    <ArticleCommon postData={ postData } lang={ lang } />
  )
}

export async function ArticleCommon({ postData, lang }: {
  postData: Post.GetPost, lang: string
}) {

  const register_date = getStrDatetime( "y-m-d h:mi", postData.register_date );
  const update_date = getStrDatetime( "y-m-d h:mi", postData.update_date );
  const isUpdad = register_date === update_date ? false : true;

  if ( postData && postData.media ) {
    delete postData.media.url.paths['default'];
  }

  return (

    <>
      <Header lang={ lang } />
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
            <div className={ style.datetime }>
              {
                isUpdad &&
                <span className={ style.update_date }>
                  更新日：<time dateTime={ postData.update_date }>{ update_date }</time>
                </span>
              }
              <span className={ style.register_date }>
                {
                  isUpdad ?
                  <>登校日：<span className={ style.view }>{ register_date }</span></> :
                  <>投稿日：<time dateTime={ postData.register_date }>{ register_date }</time></>
                }
              </span>
            </div>
          </div>
        </div>
        <main className={ style.post_content }>
          <div className={ style.post_content_top }>
            {
              postData.media &&
              <figure className={ style.thumbnail }>
                <img 
                  src={ `${ process.env.NEXT_PUBLIC_APP_URL }/api/media-stream?w=800&id=${ postData!.media!.id }` }
                  srcSet={
                    Object.keys( postData.media.url.paths ).map((size) => {
                      return `${ process.env.NEXT_PUBLIC_APP_URL }/api/media-stream?w=${ size }&id=${ postData!.media!.id } w${ size }`;
                    }).join(', ')
                  }
                  sizes='100vw' width={ Object.keys( postData.media.url.paths ).splice(-1)[0] }
                  alt={`記事のサムネイル画像`} loading="lazy"
                />
              </figure>
            }
          </div>
          <div
            id="insert_post_html"
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