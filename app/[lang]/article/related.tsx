import style from './related.module.scss';
import PostBeforeAfter from './postBeforeAfter';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getStrDatetime } from '@/lib/functions';

const prisma = new PrismaClient();

type RelatedPost = {
  id: number,
  title: {[key in AcceptLocales]: string},
  permalink: string | null,
  media: {
      id: number,
      url: { paths: {[key: string]: string}},
  } | null
}[];

type RelatedTips = {
  id: number,
  title: {[key in AcceptLocales]: string},
  permalink: string | null,
  media: {
      id: number,
      url: { paths: {[key: string]: string}},
  } | null,
  CategoryPost: {
    category: {
        id: number,
        name: {[key in AcceptLocales]: string}
    }
  }[],
  register_date: string
}[];

export default async function Related({ lang, categories, postId, postDate }: {
  lang: AcceptLocales, postId: number, postDate: string, categories: Post.Category
}) {

  const relatedPost = await prisma.post.findMany({
    where: { CategoryPost: {
      some: { categoryId: { in: categories.map((cat) => cat.category.id ) }}
    }, NOT: { id: postId }, type: 'post' },
    select: {
      id: true, title: true, permalink: true,
      media: { select: { id: true, url: true } }
    }, take: 8, orderBy: { update_date: 'desc' }
  }) as RelatedPost;

  const relatedTips = await prisma.post.findMany({
    where: { CategoryPost: {
      some: { categoryId: { in: categories.map((cat) => cat.category.id ) }}
    }, NOT: { id: postId }, type: 'tips' },
    select: {
      id: true, title: true, permalink: true,
      CategoryPost: { select: { category: { select: { id: true, name: true } } } },
      media: { select: { id: true, url: true } }, register_date: true
    }, take: 8, orderBy: { update_date: 'desc' }
  }) as unknown as RelatedTips;

  return (
    <aside className={ style.related_articles }>
      { relatedPost.length > 0 && <h2>Related Articles</h2> }
      <div className={ style.articles }>
        {
          relatedPost.map((post) => {
            const permalink = post.permalink ? `/article/${ post.permalink }` : `/article?id=${ post.id }`;
            return (
              <Link className={ style.permalink } href={ permalink }>
                <article className={ style.entry }>
                  <div className={ style.thumbnail }>
                    {
                      post.media ?
                      <img src={`/api/media-stream?id=${ post.media.id }&w=${ Object.keys( post.media.url.paths )[0] }`} alt="thumbnail" loading='lazy' /> :
                      <img src={`/static-img/no-image.svg`} alt="thumbnail" loading='lazy' />
                    }
                  </div>
                  <div className={ style.title }>
                    <h3>{ post.title[ lang ] }</h3>
                  </div>
                </article>
              </Link>
            )
          })
        }
      </div>
      { relatedTips.length > 0 && <h2>Related Tips</h2> }
      <div className={ style.tips_list }>
        {
          relatedTips.map((tips) => {
            return (
              <article className={ `animate__animated animate__fadeIn ${ style.tips }` }>
                <Link className={ style.link_wrap } href={ tips.permalink ? `/${ lang }/tips/${ tips.permalink }` : `/${ lang }/tips?id=${ tips.id }` }>
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
      </div>
      <PostBeforeAfter lang={ lang } postDate={ postDate } />
    </aside>
  )
}