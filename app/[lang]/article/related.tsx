import style from './related.module.scss';
import PostBeforeAfter from './postBeforeAfter';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

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

export default async function Related({ lang, categories, postId, postDate }: {
  lang: AcceptLocales, postId: number, postDate: string, categories: Post.Category
}) {

  const relatedPost = await prisma.post.findMany({
    where: { CategoryPost: {
      some: { categoryId: { in: categories.map((cat) => cat.category.id ) }}
    }, NOT: { id: postId }},
    select: {
      id: true, title: true, permalink: true,
      media: { select: { id: true, url: true } }
    }, take: 8, orderBy: { update_date: 'desc' }
  }) as RelatedPost;

  return (
    <aside className={ style.related_articles }>
      <h2>Related Articles</h2>
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
      <PostBeforeAfter lang={ lang } postDate={ postDate } />
    </aside>
  )
}