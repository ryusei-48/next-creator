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
      <Container>
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
                <h2>免責事項</h2>
                <p>
                  当ブログからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。<br/>
                  また当ブログのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。<br/>
                  当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
                </p>
                <h2>広告について</h2>
                <p>
                  当ブログでは、第三者配信の広告サービス（Googleアドセンス、A8.net）を利用しており、ユーザーの興味に応じた商品やサービスの広告を表示するため、クッキー（Cookie）を使用しております。
                  クッキーを使用することで当サイトはお客様のコンピュータを識別できるようになりますが、お客様個人を特定できるものではありません。<br/>
                  Cookieを無効にする方法やGoogleアドセンスに関する詳細は「<a className='inline-decoration' href="https://policies.google.com/technologies/ads?gl=jp" target="_blank">広告 – ポリシーと規約 – Google</a>」をご確認ください。<br/>
                  また、「RYUSEIWeb」は、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。
                </p>
                <h2>アクセス解析ツールについて</h2>
                <p>
                  当ブログでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにクッキー（Cookie）を使用しております。トラフィックデータは匿名で収集されており、個人を特定するものではありません。
                </p>
                <h2>著作権について</h2>
                <p>当ブログで掲載している文章や画像などにつきましては、無断転載することを禁止します。</p>
                <p>当ブログは著作権や肖像権の侵害を目的としたものではありません。著作権や肖像権に関して問題がございましたら、お問い合わせフォームよりご連絡ください。迅速に対応いたします。</p>
                <h2>リンクについて</h2>
                <p>当ブログは基本的にリンクフリーです。リンクを行う場合の許可や連絡は不要です。</p>
                <p>ただし、インラインフレームの使用や画像の直リンクはご遠慮ください。</p>
                <h2>コメント</h2>
                <p>訪問者がこのサイトにコメントを残す際、コメントフォームに表示されているデータ、そしてスパム検出に役立てるための IP アドレスとブラウザーユーザーエージェント文字列を収集します。</p>
                <p>メールアドレスから作成される匿名化された (「ハッシュ」とも呼ばれる) 文字列は、あなたが Gravatar サービスを使用中かどうか確認するため同サービスに提供されることがあります。同サービスのプライバシーポリシーは https://automattic.com/privacy/ にあります。コメントが承認されると、プロフィール画像がコメントとともに一般公開されます。</p>
                <h2>メディア</h2>
                <p>サイトに画像をアップロードする際、位置情報 (EXIF GPS) を含む画像をアップロードするべきではありません。サイトの訪問者は、サイトから画像をダウンロードして位置データを抽出することができます。</p>
                <h2>Cookie</h2>
                <p>サイトにコメントを残す際、お名前、メールアドレス、サイトを Cookie に保存することにオプトインできます。これはあなたの便宜のためであり、他のコメントを残す際に詳細情報を再入力する手間を省きます。この Cookie は1年間保持されます。</p>
                <p>ログインページを訪問すると、お使いのブラウザーが Cookie を受け入れられるかを判断するために一時 Cookie を設定します。この Cookie は個人データを含んでおらず、ブラウザーを閉じると廃棄されます。</p>
                <p>ログインの際さらに、ログイン情報と画面表示情報を保持するため、私たちはいくつかの Cookie を設定します。ログイン Cookie は2日間、画面表示オプション Cookie は1年間保持されます。「ログイン状態を保存する」を選択した場合、ログイン情報は2週間維持されます。ログアウトするとログイン Cookie は消去されます。</p>
                <p>もし投稿を編集または公開すると、さらなる Cookie がブラウザーに保存されます。この Cookie は個人データを含まず、単に変更した投稿の ID を示すものです。1日で有効期限が切れます。</p>
                <h2>他サイトからの埋め込みコンテンツ</h2>
                <p>このサイトの投稿には埋め込みコンテンツ (動画、画像、投稿など) が含まれます。他サイトからの埋め込みコンテンツは、訪問者がそのサイトを訪れた場合とまったく同じように振る舞います。</p>
                <p>これらのサイトは、あなたのデータの収集、Cookie の使用、サードパーティによる追加トラッキングの埋め込み、埋め込みコンテンツとのやりとりの監視を行うことがあります。アカウントを使ってそのサイトにログイン中の場合、埋め込みコンテンツとのやりとりのトラッキングも含まれます。</p>
                <h2>あなたのデータの共有先</h2>
                <p>パスワードリセットをリクエストすると、IP アドレスがリセット用のメールに含まれます。</p>
                <h2>データを保存する期間</h2>
                <p>あなたがコメントを残すと、コメントとそのメタデータが無期限に保持されます。これは、モデレーションキューにコメントを保持しておく代わりに、フォローアップのコメントを自動的に認識し承認できるようにするためです。</p>
                <p>このサイトに登録したユーザーがいる場合、その方がユーザープロフィールページで提供した個人情報を保存します。すべてのユーザーは自分の個人情報を表示、編集、削除することができます (ただしユーザー名は変更することができません)。サイト管理者もそれらの情報を表示、編集できます。</p>
                <h2>データに対するあなたの権利</h2>
                <p>このサイトのアカウントを持っているか、サイトにコメントを残したことがある場合、私たちが保持するあなたについての個人データ (提供したすべてのデータを含む) をエクスポートファイルとして受け取るリクエストを行うことができます。また、個人データの消去リクエストを行うこともできます。これには、管理、法律、セキュリティ目的のために保持する義務があるデータは含まれません。</p>
                <h2>どこにあなたのデータが送られるか</h2>
                <p>訪問者によるコメントは、自動スパム検出サービスを通じて確認を行う場合があります。</p>
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