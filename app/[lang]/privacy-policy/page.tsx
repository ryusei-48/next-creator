import Header from '@/components/header';
import Container from '@/components/container';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import style from '../article/page.module.scss';
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import myConfig from '@/public.config.json';
//import { redirect } from 'next/navigation';
import { getStrDatetime } from '@/lib/functions';
import Link from 'next/link';
import Image from 'next/image';
import thumbnail from './privacy-policy.jpg';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { lang: AcceptLocales }
  searchParams: { id: string | undefined }
}

export async function generateMetadata(
  { params: { lang }, searchParams }: Props, parent: ResolvingMetadata
): Promise<Metadata> {

  return {
    title: 'プライバシー・ポリシー',
    description: '当サイトのプライバシー・ポリシーを掲載するページです。',
    alternates: {
      canonical: '/' + ( myConfig.locale.default === lang ? `` : `${ lang }` )
    }
  }
}

export default async function PrivacyPolicy({ params: { lang }, searchParams }: Props ) {

  return (
    <>
      <Header lang={ lang } />
      <Container type='div' styleInit>
        <main className={ `${ style.main }` }>
          <article className={ style.post_container }>
            <header className={ `animate__animated animate__fadeInDown animate__fast ` +  style.post_title_wrap }>
              <h1>プライバシー・ポリシー</h1>
              <div className={ style.post_meta }>
                <div className={ style.datetime }>
                  <span className={ style.register_date }>
                    投稿日：<time dateTime='2023-11-11T08:35:52.000Z'>2023-11-11 8:35</time>
                  </span>
                </div>
              </div>
            </header>
            <section className={ `animate__animated animate__fadeIn ` + style.post_content }>
              <div className={ style.post_content_top }>
              <figure className={ style.thumbnail }>
                  <Image
                    src={ thumbnail } alt={`サムネイル画像`} loading="lazy"
                    style={{ width: '100%', height: '500px' }}
                  />
                </figure>
              </div>
              <div className={ style.insert_html }>
                <h2>当ブログについて</h2>
                <p>
                  当サイト「Ryusei.IO（https://ryusei.io）は、個人開発関連、技術メモ、お役立ち情報を配信します。
                </p>
                <h2>個人情報の利用目的</h2>
                <p>
                  当ブログでは、お問い合わせや記事へのコメントの際、名前やメールアドレス等の個人情報を入力いただく場合がございます。<br/>
                  取得した個人情報は、お問い合わせに対する回答や必要な情報を電子メールなどでご連絡する場合に利用させていただくものであり、これらの目的以外では利用いたしません。
                </p>
                <h2>広告について</h2>
                <p>
                  当ブログでは、第三者配信の広告サービス（Googleアドセンス、A8.net）を利用しており、ユーザーの興味に応じた商品やサービスの広告を表示するため、クッキー（Cookie）を使用しております。
                  クッキーを使用することで当サイトはお客様のコンピュータを識別できるようになりますが、お客様個人を特定できるものではありません。<br/>
                  Cookieを無効にする方法やGoogleアドセンスに関する詳細は「<a className='inline-decoration' href="https://policies.google.com/technologies/ads?gl=jp" target="_blank">広告 – ポリシーと規約 – Google</a>」をご確認ください。<br/>
                  また、「Ryusei.IO」は、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。
                </p>
                <h2>アクセス解析ツールについて</h2>
                <p>
                  当ブログでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにクッキー（Cookie）を使用しております。トラフィックデータは匿名で収集されており、個人を特定するものではありません。
                </p>
                <h2>著作権について</h2>
                <p>
                  当ブログで掲載している文章や画像などにつきましては、無断転載することを禁止します。
                  当ブログは著作権や肖像権の侵害を目的としたものではありません。著作権や肖像権に関して問題がございましたら、お問い合わせフォームよりご連絡ください。迅速に対応いたします。
                </p>
                <h2>コメント</h2>
                <p>
                  当ブログへのコメントを残す際に、IP アドレスを収集しています。
                  これはブログの標準機能としてサポートされている機能で、スパムや荒らしへの対応以外にこのIPアドレスを使用することはありません。
                  なお、全てのコメントは管理人が事前にその内容を確認し、承認した上での掲載となります。あらかじめご了承ください。
                </p>
                <h2>Cookie</h2>
                <p>
                  当サイトでのデザインテーマの切り替えと言語の切り替え機能を使用すると、Cookieに現在の状態が記録されます。
                </p>
                <h2>免責事項</h2>
                <p>
                  当ブログからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。<br/>
                  また当ブログのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。<br/>
                  当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
                </p>
                <h2>リンクについて</h2>
                <p>
                  当ブログは基本的にリンクフリーです。リンクを行う場合の許可や連絡は不要です。
                  ただし、インラインフレームの使用や画像の直リンクはご遠慮ください。
                </p>
              </div>
            </section>
            <Sidebar
              useLang={ lang } defaultLang={ myConfig.locale.default }
              locales={ myConfig.locale['accept-lang'] }
              localeLabels={ myConfig.locale.labels }
            />
          </article>
        </main>
      </Container>
      <Footer lang={ lang } />
    </>
  )
}