import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import style from './page.module.scss'
import myConfig from '@/public.config.json';
import Link from 'next/link';

export default async function Home({ params: { lang } }: {
  params: { lang: string }
}) {

  const postListRes = await fetch(`${ process.env.API_ACCESS_ADDRESS }/api/post/get-many`, {
    method: 'POST', body: JSON.stringify({
      orderBy: [{ register_date: 'desc' }],
      take: 20, skip: 0
    }), headers: {
      "API_ACCESS_TOKEN": process.env.API_ACCESS_TOKEN!
    }
  });

  let postList: { isNext: boolean, result: Post.GetPost[] } | null = null;
  if ( postListRes.ok ) {
    postList = await postListRes.json();
  }

  return (
    <>
      <Header />
      <div className={ style.wrapper }>
        <div className={ `container ${ style.container_over }` }>
          <main className={ style.post_entries }>
            <h2>最新記事</h2>
            {
              postList &&
              postList.result.map((post) => {
                return (
                  <article>
                    <div className={ style.thumbnail }>
                      <figure>
                        {
                          post.media ?
                          <img src={ `./api/media-stream?w=800&id=${ post.media.id }` } alt="サムネイル画像" loading="lazy" /> :
                          <span className={ style.no_image }>No Image</span>
                        }
                      </figure>
                    </div>
                    <div className={ style.details }>
                      <h3>{ post.title[ lang ] }</h3>
                      { post.description && <aside>{ post.description[ lang ] }</aside> }
                    </div>
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
        </div>
      </div>
      <Footer />
    </>
  )
}
