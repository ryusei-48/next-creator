import style from './postBeforeAfter.module.scss';
import { PrismaClient } from '@prisma/client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const prisma = new PrismaClient();

type PostData = {
  id: number,
  title: {[key in AcceptLocales]: string},
  permalink: string | null, type: string
} | null;

export default async function PostBeforeAfter({ lang, postDate}: {
  lang: AcceptLocales, postDate: string
}) {

  const previousPosts = await prisma.post.findFirst({
    where: { register_date: { lt: postDate }, status: 'publish' },
    orderBy: { register_date: 'desc' },
    select: { id: true, title: true, permalink: true, type: true }
  }) as PostData;

  const nextPost = await prisma.post.findFirst({
    where: { register_date: { gt: postDate }, status: 'publish' },
    orderBy: { register_date: 'asc' },
    select: { id: true, title: true, permalink: true, type: true }
  }) as PostData;

  return (
    <div className={ style.before_after_link }>
      {
        previousPosts &&
        <Link className={`${ style.link_bar } ${ style.left }`} href={`/${ ( previousPosts.type === 'tips' ? 'tips' : 'article' ) + ( previousPosts.permalink ? `/${ previousPosts.permalink }` : `?id=${ previousPosts.id }` ) }`}>
          <span className={ style.icon_angle }>
            <FontAwesomeIcon icon={ faAngleLeft }></FontAwesomeIcon>
          </span>
          <span className={ style.post_title }>{ previousPosts.title[ lang ] }</span>
      </Link>
      }
      {
        nextPost &&
        <Link className={`${ style.link_bar } ${ style.right }`} href={`/${ ( nextPost.type === 'tips' ? 'tips' : 'article' ) + ( nextPost.permalink ? `/${ nextPost.permalink }` : `?id=${ nextPost.id }` ) }`}>
          <span className={ style.post_title } style={{ textAlign: 'right' }}>
            { nextPost.title[ lang ] }
          </span>
          <span className={ style.icon_angle }>
            <FontAwesomeIcon icon={ faAngleRight }></FontAwesomeIcon>
          </span>
        </Link>
      }
    </div>
  )
}