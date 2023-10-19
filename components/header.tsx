import style from './header.module.scss';
import {
  LoginButton, LogoutButton, RegisterButton
} from "@/components/auth-button";
import Contactform from './use-client/contactform';
import { options } from '@/lib/auth-options';
import { getServerSession } from "next-auth";
import Link from 'next/link';
import ThemeChangeButton from '../components/small-parts/switch-theme-button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { pageJudg } from '@/lib/functions';

export default async function header({ lang }: { lang: string }) {

  const session = await getServerSession(options);
  const isAdminPage = pageJudg('admin');
  const isHome = pageJudg('home');

  return (
    <>
      {
        session &&
        <div className={ style.admin_toolbar }>
          <div className={ style.tool_links }>
            <nav>
              <ul>
                <li>{ process.env.NEXT_PUBLIC_SITE_TITLE }</li>
                <li><Link href={ '/' }>サイトを表示</Link></li>
                <li><Link href={ '/admin/post-list' }>投稿一覧</Link></li>
                <li><a href={ '/admin/post' }>新規作成</a></li>
                <li><Link href={ '/admin/media' }>メディア</Link></li>
                <li><Link href={ '/admin/category' }>カテゴリー</Link></li>
              </ul>
            </nav>
          </div>
          <div className={ style.status_box }>
            <ThemeChangeButton style={{ height: '100%', fontSize: '16px' }} />
            <LogoutButton/>
          </div>
        </div>
      }
      {
        !isAdminPage &&
        <header className={ `${ style.header } ${ session && style.toolbar_enable }` }>
          <div className={ `container ${ style.header }` }>
            <div className={ style.siteTitle }>
              <Link className={ style.text } href="/">
                {
                  isHome ? <h1>{ process.env.NEXT_PUBLIC_SITE_TITLE }</h1> : process.env.NEXT_PUBLIC_SITE_TITLE
                }
              </Link>
            </div>
            <nav className={ style.navigations }>
              <ul>
                <li><button id="open-contactform">お問い合わせ</button></li>
                <li>プロダクト</li>
                <li>カテゴリー</li>
                <li><Link href="/">ホーム</Link></li>
              </ul>
            </nav>
            <Contactform lang={ lang } />
            <div className={ style.author_sns }>
              <ThemeChangeButton style={{ height: 'auto', marginRight: '5px' }} />
              <a href="https://x.com/ryusei__46" target="_blank" aria-label='X' title="X">
                <FontAwesomeIcon width={`20px`} icon={ faXTwitter }></FontAwesomeIcon>
              </a>
              <a href="https://github.com/ryusei-48" target="_blank" aria-label='github' title="GitHub">
                <FontAwesomeIcon width={`20px`} icon={ faGithub }></FontAwesomeIcon>
              </a>
            </div>
          </div>
        </header>
      }
      {
        //isAdminPage && <span className={ style.toolbar_enable }></span>
      }
    </>
  )
}