import style from './article-list.module.scss';
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import myConfig from '@/public.config.json';
import type { ArticleListLocale } from './sidebar';

const prisma = new PrismaClient();

export default async function ArticleList({ lang, localeStack }: {
  lang: AcceptLocales, localeStack: ArticleListLocale
}) {

  const postData = await prisma.post.findMany({
    orderBy: { register_date: 'desc' }, where: { status: 'publish', type: 'post' },
    take: 5, skip: 0, select: {
      id: true, title: true, status: true,
      user: { select: { nameid: true } }, description: true,
      permalink: true, media: { select: { id: true, url: true } },
      CategoryPost: { select: { category: { select: { id: true, name: true } } } },
      register_date: true, update_date: true
    }
  }) as unknown as Post.GetPost[];

  const localePathname = myConfig.locale.default === lang ? '' : lang;

  return (
    <aside className={ style.latest_articles }>
      <h3>{ localeStack.heading2 }</h3>
      <ul>
        {
          postData.map((post) => {
            return (
              <li>
                <Link href={ post.permalink ? `${ localePathname }/article/${ post.permalink }` : `${ localePathname }/article?id=${ post.id }` }>
                  <span className={ style.thumbnail }>
                    <Image width="160" height="90" src={ `/api/media-stream?w=800&id=${ post.media!.id }` } alt="thumbnail" />
                  </span>
                  <span className={ style.title }>{ post.title[ lang ] }</span>
                </Link>
              </li>
            )
          })
        }
      </ul>
      <Link href="/" className={ style.go_to_post_list }>{ localeStack['go-to-article-list'] }</Link>
    </aside>
  )
}