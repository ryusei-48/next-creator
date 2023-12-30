import Header from '@/components/header';
import Container from '@/components/container';
import PostCardLazy from './post-card-lazy';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import style from './page.module.scss'
import { PrismaClient } from '@prisma/client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getStrDatetime, matchMedia } from '@/lib/functions';
import myConfig from '@/public.config.json';
import dictionaries from '@/locales/dictionaries';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';

const prisma = new PrismaClient();

function languageAdjustment( lang: string ): AcceptLocales {
  if ( !myConfig.locale['accept-lang'].includes( lang ) ) {
    lang = myConfig.locale.default;
  }
  return lang as AcceptLocales;
}

export async function generateMetadata(
  { params: { lang } }: { params: { lang: AcceptLocales } }, parent: ResolvingMetadata
): Promise<Metadata> {

  lang = languageAdjustment( lang );
  const localeStack = await dictionaries[ lang ].home();

  return {
    title: `${ localeStack['title-tag-text'] }`
  }
}

export default async function Home({ params: { lang } }: {
  params: { lang: AcceptLocales }
}) {

  lang = languageAdjustment( lang );
  const localeStack = await dictionaries[ lang ].home();
  const localePathname = myConfig.locale.default === lang ? '' : lang;

  const postData = await prisma.post.findMany({
    orderBy: { register_date: 'desc' }, where: { status: 'publish', type: 'post' },
    take: 10 + 1, skip: 0, select: {
      id: true, title: true, status: true,
      user: { select: { nameid: true } }, description: true,
      permalink: true, media: { select: { id: true, url: true } },
      CategoryPost: { select: { category: { select: { id: true, name: true } } } },
      register_date: true, update_date: true
    }
  }) as unknown as Post.GetPost[];

  const postList: { isNext: boolean, result: Post.GetPost[] } = {
    result: postData, isNext: postData.length === 11
  }

  const tipsData = await prisma.post.findMany({
    orderBy: { register_date: 'desc' }, where: { status: 'publish', type: 'tips' },
    take: 10 + 1, skip: 0, select: {
      id: true, title: true, status: true,
      user: { select: { nameid: true } }, description: true,
      permalink: true, media: { select: { id: true, url: true } },
      CategoryPost: { select: { category: { select: { id: true, name: true } } } },
      register_date: true, update_date: true
    }
  }) as unknown as Post.GetPost[];

  const tipsList: { isNext: boolean, result: Post.GetPost[] } = {
    result: tipsData, isNext: tipsData.length === 11
  }

  return (
    <>
      <Header lang={ lang } />
      <Container type='div' styleInit>
        <main className={ style.post_entries }>
          <h2>{ localeStack['latest-post-heading2'] }</h2>
          { /*<div className={ style.hero_articles }>
            <article className={ `animate__animated animate__fadeIn ` + style.first_card }>
              <Link className={ style.link_wrap } href={ postList.result[0].permalink ? `${ localePathname }/article/${  postList.result[0].permalink }` : `${ localePathname }/article?id=${  postList.result[0].id }` }>
                <div className={ style.thumbnail }>
                  <figure>
                    {
                      postList.result[0].media ?
                      <img src={ `/api/media-stream?w=800&id=${ postList.result[0].media.id }` } alt="thumbnail image" loading="lazy" /> :
                      <span className={ style.no_image }>No Image</span>
                    }
                  </figure>
                </div>
                <div className={ style.details }>
                  <h3>{ postList.result[0].title[ lang ] }</h3>
                  { postList.result[0].description && <aside className={ style.description }>{  postList.result[0].description[ lang ] }</aside> }
                  <span className={ style.datetime }>
                    <FontAwesomeIcon width={`11pt`} icon={ faClock }></FontAwesomeIcon>
                    &nbsp;{ getStrDatetime( "y-m-d h:mi", postList.result[0].register_date ) }
                  </span>
                </div>
              </Link>
            </article>
          </div> */ }
          {
            postList &&
            postList.result.map((post) => {
              return (
                <article className={ `animate__animated animate__fadeIn ${ style.post }` }>
                  <Link className={ style.link_wrap } href={ post.permalink ? `${ localePathname }/article/${ post.permalink }` : `${ localePathname }/article?id=${ post.id }` }>
                    <div className={ style.thumbnail }>
                      <figure>
                        {
                          post.media ?
                          <img src={ `/api/media-stream?w=800&id=${ post.media.id }` } alt="thumbnail image" loading="lazy" /> :
                          <span className={ style.no_image }>No Image</span>
                        }
                      </figure>
                    </div>
                    <div className={ style.details }>
                      <h3>{ post.title[ lang ] }</h3>
                      { post.description && <aside className={ style.description }>{ post.description[ lang ] }</aside> }
                      <span className={ style.datetime }>
                        <FontAwesomeIcon width={`11pt`} icon={ faClock }></FontAwesomeIcon>
                        &nbsp;{ getStrDatetime( "y-m-d h:mi", post.register_date ) }
                      </span>
                    </div>
                  </Link>
                </article>
              )
            })
          }
          <PostCardLazy
            access_token={ process.env.API_ACCESS_TOKEN! }
            isNext={ postList.isNext } skip={ 10 } type='post'
            localePathname={ localePathname } lang={ lang }
            localeStack={{ "more-post": localeStack['more-post'] }}
          />
          { tipsList.result.length > 0 && <h2>Latest Tips</h2> }
          {
            tipsList.result.map((tips) => {
              return (
                <article className={ `animate__animated animate__fadeIn ${ style.tips }` }>
                  <Link className={ style.link_wrap } href={ tips.permalink ? `${ localePathname }/tips/${ tips.permalink }` : `${ localePathname }/tips?id=${ tips.id }` }>
                    <div className={ style.meta_details }>
                      <div className={ style.categories }>
                        {
                          tips.CategoryPost.map((cat) => {
                            return (
                              <span>
                                { cat.category.name[ lang ] }
                              </span>
                            )
                          })
                        }
                      </div>
                      <div className={ style.time }>
                        <span>
                          <FontAwesomeIcon width={`11pt`} icon={ faClock }></FontAwesomeIcon>
                          &nbsp;{ getStrDatetime( "y-m-d h:mi", tips.register_date ) }
                        </span>
                      </div>
                    </div>
                    <div className={ style.heading }>
                      <h3>{ tips.title[ lang ] }</h3>
                    </div>
                  </Link>
                </article>
              )
            })
          }
        </main>
        <Sidebar
          useLang={ lang } defaultLang={ myConfig.locale.default }
          locales={ myConfig.locale['accept-lang'] }
          localeLabels={ myConfig.locale.labels }
        />
      </Container>
      <Footer lang={ lang } />
    </>
  )
}
