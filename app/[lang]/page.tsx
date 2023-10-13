import Header from '@/components/header';
import Footer from '@/components/footer';
import style from './page.module.scss'
import Link from 'next/link';

export default async function Home() {

  const postListRes = await fetch(`http://172.28.120.84:8648/api/post/get-many`, {
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
    console.log( postList );
  }

  return (
    <>
      <Header />
      <div className={ style.wrapper }>
        <div className={ `container ${ style.container_over }` }>
          <article className={ style.post_entries }>
            <h2>最新記事</h2>
            {
              postList &&
              postList.result.map((post) => {
                return (
                  <section>
                    <div className={ style.thumbnail }>
                      {
                        post.media ?
                        <img src={ `./api/media-stream?w=800&id=${ post.media.id }` } alt="サムネイル画像" loading="lazy" /> :
                        <span className={ style.no_image }>No Image</span>
                      }
                    </div>
                    <div className={ style.details }>
                      <h3>{ post.title[ 'ja' ] }</h3>
                      { post.description && <aside>{ post.description[ 'ja' ] }</aside> }
                    </div>
                  </section>
                )
              })
            }
          </article>
        </div>
      </div>
      <Footer />
    </>
  )
}
