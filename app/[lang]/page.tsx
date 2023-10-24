import Header from '@/components/header';
import Container from '@/components/container';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import style from './page.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getStrDatetime } from '@/lib/functions';
import myConfig from '@/public.config.json';
import dictionaries from '@/locales/dictionaries';
import Link from 'next/link';

export default async function Home({ params: { lang } }: {
  params: { lang: AcceptLocales }
}) {

  const localeStack = await dictionaries[ lang ].home()
  const localePathname = myConfig.locale.default === lang ? '' : lang;

  const postListRes = await fetch(`${ process.env.API_ACCESS_ADDRESS }/api/post/get-many`, {
    method: 'POST', body: JSON.stringify({
      orderBy: [{ register_date: 'desc' }], where: { status: 'publish' },
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
      <Header lang={ lang } />
      <Container>
        <main className={ style.post_entries }>
          <h2>{ localeStack['latest-post-heading2'] }</h2>
          {
            postList &&
            postList.result.map((post) => {
              return (
                <article>
                  <Link className={ style.link_wrap } href={ post.permalink ? `${ localePathname }/article/${ post.permalink }` : `${ localePathname }/article?id=${ post.id }` }>
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
        </main>
        <Sidebar
          useLang={ lang } defaultLang={ myConfig.locale.default }
          locales={ myConfig.locale['accept-lang'] }
          localeLabels={ myConfig.locale.labels }
        />
      </Container>
      <Footer />
    </>
  )
}
