import profileImage from '@/public/profile.jpeg';
import Image from 'next/image';
import style from './sidebar.module.scss';
import HeadingTable from './use-client/heading-table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { pageJudg } from '@/lib/functions';
import LocaleDict from '@/locales/dictionaries';

export default async function Sidebar({ useLang, defaultLang, locales, localeLabels }: {
  useLang: AcceptLocales, locales: string[], localeLabels: {[key: string]: {[key: string]: string}},
  defaultLang: string
}) {

  const localeStack = await LocaleDict[ useLang ].sidebar();

  return (
    <div className={ style.sidebar }>
      <aside className={ style.profile }>
        <h3>{ localeStack.profile }</h3>
        <div className={ style.card }>
          <figure className={ style.icon }>
            <Image className={ style.image } src={ profileImage } alt="プロフィール画像" />
          </figure>
          <span className={ style.author_name }>Ryusei</span>
          <div className={ style.author_description }>
            <p>
              フリーのごく普通のプログラマーです。
              ド田舎にに住みつつ、まったり個人開発・仕事受注などやって生活しています。
              普段使用している言語は、PHP、Python、JavaScript、Node.JS、SCSS、HTML、MySQLなど、
              Webフレームワークでは、Laravel、ネイティブアプリフレームワークでは、
              Electron、NW.jsを使用しています。このブログでは、日々経験したことのメモや、
              個人開発、PC関連、Web技術全般など、色々役立ち情報を書き綴っていきたいと思います。
            </p>
          </div>
          <div className={ style.author_sns }>
            <a href="https://x.com/ryusei__46" target="_blank" aria-label='X' title="X">
              <FontAwesomeIcon width={`20px`} icon={ faXTwitter }></FontAwesomeIcon>
            </a>
            <a href="https://github.com/ryusei-48" target="_blank" aria-label='github' title="GitHub">
              <FontAwesomeIcon width={`20px`} icon={ faGithub }></FontAwesomeIcon>
            </a>
          </div>
        </div>
      </aside>
      <div className={ style.sticky_content }>
        { pageJudg('post') && <HeadingTable /> }
      </div>
    </div>
  )
}