import Header from '@/components/header';
import Container from '@/components/container';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import style from '../../page.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getStrDatetime } from '@/lib/functions';
import myConfig from '@/public.config.json';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import type { RequestJson } from '@/app/[lang]/api/category/get/related-post/route';

const prisma = new PrismaClient();

export default async function Home({ params: { lang, slug } }: {
  params: { lang: AcceptLocales, slug: string }
}) {

  const postListRes = await prisma.category.findFirst({
    where: { slug }, select: {
      id: true, name: true, slug: true,
      CategoryPost: {
        where: { post: { is: { status: 'publish', type: 'post' } } },
        select: { post: { select: {
          id: true, title: true, body: true, status: true, description: true,
          permalink: true, user: { select: { nameid: true } },
          media: { select: { id: true, url: true } },
          register_date: true, update_date: true
      } } }, orderBy: { post: { register_date: 'desc' } }, take: 10 + 1 }
    }
  }) as Category.CategoryRelatedPost;

  const postList: { isNext: Boolean, result: Category.CategoryRelatedPost } = {
    result: postListRes, isNext: postListRes && ( postListRes.CategoryPost.length > 0 ) || false
  };

  const tipsListRes = await prisma.category.findFirst({
    where: { slug }, select: {
      id: true, name: true, slug: true,
      CategoryPost: {
        where: { post: { is: { status: 'publish', type: 'tips' } } },
        select: { post: { select: {
          id: true, title: true, body: true, status: true, description: true,
          permalink: true, user: { select: { nameid: true } },
          media: { select: { id: true, url: true } },
          CategoryPost: { select: { category: { select: { id: true, name: true } } } },
          register_date: true, update_date: true
      } } }, orderBy: { post: { register_date: 'desc' } }, take: 10 + 1 }
    }
  }) as Category.CategoryRelatedTips;

  const tipsList: { isNext: Boolean, result: Category.CategoryRelatedTips } = {
    result: tipsListRes, isNext: tipsListRes && ( tipsListRes.CategoryPost.length > 0 ) || false
  };

  return (
    <>
      <Header lang={ lang } />
      <Container type='div' styleInit>
        <main className={ style.post_entries }>
          <h2>Latest Articles - { postList.result?.name[ lang ] }</h2>
          {
            postList &&
            postList.result?.CategoryPost.map(({ post }, index) => {
              return (
                <article className={ `animate__animated animate__fadeIn ${ style.post }` }>
                  <Link className={ style.link_wrap } href={ post.permalink ? `/article/${ post.permalink }` : `/article?id=${ post.id }` }>
                    <div className={ style.thumbnail }>
                      <figure>
                        {
                          post.media ?
                          <img src={ `/api/media-stream?w=800&id=${ post.media.id }` } alt="サムネイル画像" loading="lazy" /> :
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
          { ( postList.result && postList.result.CategoryPost.length === 0 ) && <p>該当した投稿はありません。</p> }
          { tipsList.result && tipsList.result.CategoryPost.length > 0 && <h2>Latest Tips - { tipsList.result.name[ lang ] }</h2> }
          {
            tipsList.result &&
            tipsList.result.CategoryPost.map((tips) => {
              return (
                <article className={ `animate__animated animate__fadeIn ${ style.tips }` }>
                  <Link className={ style.link_wrap } href={ tips.post.permalink ? `/${ lang }/tips/${ tips.post.permalink }` : `/${ lang }/tips?id=${ tips.post.id }` }>
                    <div className={ style.meta_details }>
                      <div className={ style.categories }>
                        {
                          tips.post.CategoryPost.map((cat) => {
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
                          &nbsp;{ getStrDatetime( "y-m-d h:mi", tips.post.register_date ) }
                        </span>
                      </div>
                    </div>
                    <div className={ style.heading }>
                      <h3>{ tips.post.title[ lang ] }</h3>
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
