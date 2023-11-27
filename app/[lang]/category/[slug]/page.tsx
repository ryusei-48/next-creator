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
import type { RequestJson } from '@/app/[lang]/api/category/get/related-post/route';

export default async function Home({ params: { lang, slug } }: {
  params: { lang: AcceptLocales, slug: string }
}) {

  const requestJson: RequestJson = {  where: { slug }, take: 20, skip: 0 }

  const postListRes = await fetch(`${ process.env.API_ACCESS_ADDRESS }/api/category/get/related-post`, {
    method: 'POST', body: JSON.stringify( requestJson ), headers: {
      "API_ACCESS_TOKEN": process.env.API_ACCESS_TOKEN!
    }, next: { revalidate: 20 }
  });

  let postList: Category.CategoryRelatedPost = null;
  if ( postListRes.ok ) {
    postList = await postListRes.json();
    //console.log( 'postlist: ', JSON.stringify(postList, null, 2) );
  }

  return (
    <>
      <Header lang={ lang } />
      <Container type='div' styleInit>
        <main className={ style.post_entries }>
          <h2>最新記事 - { postList?.name[ lang ] }</h2>
          {
            postList &&
            postList.CategoryPost.map(({ post }, index) => {
              return (
                <article key={ index } className='animate__animated animate__fadeIn'>
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
          { postList?.CategoryPost.length === 0 && <p>該当した投稿はありません。</p> }
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
