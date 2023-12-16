import Header from '@/components/header';
import Container from '@/components/container';
import RelatedPost from '../article/related';
import GoogleAdsense from '@/components/use-client/advertisement/google-adsense';
import Discussion from '../article/discussion';
import Sidebar from '@/components/sidebar';
import ArticleScript from './article.script';
import FirstHeadingAd from '@/components/use-client/advertisement/insert-before-heading';
import Footer from '@/components/footer';
import style from './page.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import myConfig from '@/public.config.json';
import { redirect } from 'next/navigation';
import { getComments } from '../article/discussion.actions';
import { getStrDatetime, matchMedia } from '@/lib/functions';
import Link from 'next/link';
import Image from 'next/image';
import { PrismaClient } from '@prisma/client';
import { postBodyFormat } from '@/lib/functions';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { lang: AcceptLocales }
  searchParams: { id: string | undefined }
}

//export const revalidate = 5;
const prisma = new PrismaClient();

async function getPost( postId: string ) {
  return await prisma.post.findFirst({
    where: { id: Number( postId ) }, select: {
      id: true, title: true, body: true, status: true, description: true,
      permalink: true, user: { select: { nameid: true } },
      media: { select: { id: true, url: true } },
      CategoryPost: { select: { category: { select: { id: true, name: true, slug: true, icon_mime: true } } } },
      register_date: true, update_date: true, type: true
    }
  });
}

export async function generateMetadata(
  { params: { lang }, searchParams }: Props, parent: ResolvingMetadata
): Promise<Metadata> {

  const postId = searchParams.id;
  if ( !postId ) redirect( '/' );

  const postData: Post.GetPost = await getPost( postId ) as any;

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
    if ( postData.title[ lang ] !== "" ) {
      langParams[ lang ] = `/${ lang }/${ thisPathname }`;
    }
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

export default async function Article({ params: { lang }, searchParams }: Props ) {

  if ( !searchParams.id ) redirect('/');
  const postData: Post.GetPost = await getPost( searchParams.id ) as any;

  return (
    <ArticleCommon postData={ postData! } lang={ lang } />
  )
}

export async function ArticleCommon({ postData, lang }: {
  postData: Post.GetPost, lang: AcceptLocales
}) {

  const register_date = getStrDatetime( "y-m-d h:mi", postData.register_date );
  const update_date = getStrDatetime( "y-m-d h:mi", postData.update_date );
  const isUpdad = register_date === update_date ? false : true;

  for ( let [ lang, bodey ] of Object.entries( postData.body ) ) {
    postData.body[ lang ] = postBodyFormat( bodey );
  }

  if ( postData && postData.media && postData.media.url.paths.default ) {
    delete postData.media.url.paths['default'];
  }

  return (

    <>
      <Header lang={ lang } />
      <Container type='div' styleInit>
        <main className={ `${ style.main }` }>
          <article className={ style.post_container }>
            <header className={ `animate__animated animate__fadeInDown animate__fast ` +  style.post_title_wrap }>
              <h1>{ postData.title[ lang ] !== "" ? postData.title[ lang ] : postData.title[ myConfig.locale.default ] }</h1>
              <div className={ style.post_meta }>
                <ul className={ style.categorys }>
                  {
                    postData.CategoryPost.map((cat) => {
                      return (
                        <li key={ cat.category.id } className={ style.category }>
                          <Link className={ style.link_wrap } href={`/category/${ cat.category.slug }`}>
                            <span className={ style.icon }>
                              {
                                cat.category.icon_mime ?
                                <span className={ style.image_wrap }>
                                  <Image src={`/api/media-stream/icon?id=${ cat.category.id }`}
                                    loading="lazy" width={`50`} height={`50`} alt={`${ cat.category.name[ lang ] } - アイコン`}
                                  />
                                </span> :
                                <FontAwesomeIcon icon={ faHashtag }></FontAwesomeIcon>
                              }
                            </span>
                            <span className={ style.name }>
                              { cat.category.name[ lang ] }
                            </span>
                          </Link>
                        </li>
                      )
                    })
                  }
                </ul>
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
            </header>
            <section className={ `animate__animated animate__fadeIn ` + style.post_content }>
              <div className={ style.post_content_top }>
                {
                  postData.media &&
                  <figure className={ style.thumbnail }>
                    <img 
                      src={ `${ process.env.NEXT_PUBLIC_APP_URL }/api/media-stream?w=800&id=${ postData!.media!.id }` }
                      srcSet={
                        Object.keys( postData.media.url.paths ).map((size) => {
                          return `${ process.env.NEXT_PUBLIC_APP_URL }/api/media-stream?w=${ size }&id=${ postData!.media!.id } ${ size }w`;
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
                dangerouslySetInnerHTML={{
                  __html: postData.title[ lang ] !== "" ? postData?.body[ lang ] as string : postData?.body[ myConfig.locale.default ] as string
                }}
              ></div>
              { process.env.NODE_ENV === 'production' && <FirstHeadingAd /> }
              {
                process.env.NODE_ENV === "production" &&
                <aside className={ style.advertise_content }>
                  {
                    matchMedia("desktop") ?
                    <div className={ style.pc_double }>
                      <div className={ style.left }>
                        <GoogleAdsense />
                      </div>
                      <div className={ style.right }>
                        <GoogleAdsense />
                      </div>
                    </div> :
                    <div className={ style.sp_square }>
                      <GoogleAdsense />
                    </div>
                  }
                </aside>
              }
              <RelatedPost lang={ lang } postId={ postData.id } postDate={ postData.register_date } categories={ postData.CategoryPost } />
              <section className={ style.discussion_wrap }>
                <h2>Discussion</h2>
                <div className={ style.content }>
                  <DiscussionComponent lang={ lang } postId={ postData.id } />
                  <Discussion lang={ lang } postId={ postData.id } />
                </div>
              </section>
            </section>
            <Sidebar
              useLang={ lang } defaultLang={ myConfig.locale.default }
              locales={ myConfig.locale['accept-lang'] }
              localeLabels={ myConfig.locale.labels }
            />
          </article>
        </main>
      </Container>
      <ArticleScript />
      <Footer lang={ lang } />
    </>
  )
}

export async function DiscussionComponent({ postId, lang }: {
  postId: number, lang: AcceptLocales
}) {

  const comments = await getComments( undefined, postId );

  return (
    comments && comments.length > 0 ?
    <div style={{ display: 'none' }}>
      {
        comments.map((comment) => {
          return (
            <article className={ style.item } key={ comment.id }>
              <header className={ style.meta }>
                <span className={ style.nicname }>送信者：{ comment.nicname }</span>
                <span className={ style.id }>ID:{ comment.id }</span>
              </header>
              <div className={ style.content } dangerouslySetInnerHTML={{ __html: comment.body }}></div>
            </article>
          )
        })
      }
    </div> : <></>
  )
}