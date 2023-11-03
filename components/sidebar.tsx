import profileImage from '@/public/profile.jpeg';
import Image from 'next/image';
import style from './sidebar.module.scss';
import HeadingTable from './use-client/heading-table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { pageJudg } from '@/lib/functions';
import LocaleDict from '@/locales/dictionaries';
import HeaderJson from '@/locales/ja/sidebar.json';
export type ArticleIndexLocales = typeof HeaderJson["headline-heading2"];

export default async function Sidebar({ useLang, defaultLang, locales, localeLabels }: {
  useLang: AcceptLocales, locales: string[], localeLabels: {[key: string]: {[key: string]: string}},
  defaultLang: string
}) {

  const localeStack = await LocaleDict[ useLang ].sidebar();

  return (
    <div className={ `${ style.sidebar }` }>
      <aside className={ 'animate__animated animate__fadeIn ' + style.profile }>
        <h3>{ localeStack.profile }</h3>
        <div className={ style.card }>
          <figure className={ style.icon }>
            <Image className={ style.image } src={ profileImage } alt="プロフィール画像" />
          </figure>
          <span className={ style.author_name }>Ryusei</span>
          <div className={ style.author_description }>
            {
              useLang === 'ja' ?
              <p>
                フリーのへっぽこプログラマーです。視覚障害があり、視力が弱いですが頑張っています。
                ド田舎にに住みつつ、まったり個人開発・仕事しながら生活しています。
                普段使用している言語は、PHP、Python、TypeScript、Node.JS、SCSS、HTML、MySQLなど、
                Webフレームワークでは、Next.JS、React、ネイティブアプリフレームワークでは、
                Electronを使用しています。このブログでは、日々経験したことのメモや、
                個人開発、PC関連、Web技術全般など、色々な役立ち情報を書き綴っていきたいと思います。
              </p> :
              <p>
                I am a freelance heckler programmer. I am visually impaired and my eyesight is weak, but I am doing my best.
                I live in the countryside and do my own personal development and work.
                I use PHP, Python, TypeScript, Node.JS, SCSS, HTML, MySQL, etc,
                For web frameworks, I use Next.JS and React, and for native app frameworks, I use Electron,
                JS and React for web frameworks, and Electron for native app frameworks. In this blog, I write about my daily experiences and notes,
                I would like to write a variety of useful information on personal development, PC-related topics, and web technology in general.
              </p>
            }
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
        { pageJudg('post') && <HeadingTable lang={ useLang } localeStack={ localeStack['headline-heading2'] } /> }
      </div>
    </div>
  )
}