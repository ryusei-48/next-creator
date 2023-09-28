import style from './header.module.scss';
import {
  LoginButton, LogoutButton, RegisterButton
} from "@/components/auth-button";
import { options } from '@/lib/auth-options';
import { getServerSession } from "next-auth";
import { headers } from 'next/headers';
import Link from 'next/link';
import ThemeChangeButton from '../components/small-parts/switch-theme-button';

export default async function header() {

  const headersList = headers();
  const session = await getServerSession(options);

  /*await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 30000);
  });*/

  return (
    <>
      {
        session &&
        <div className={ style.admin_toolbar }>
          <div className={ style.tool_links }>
            <nav>
              <ul>
                <li><Link href={ '/' }>トップ</Link></li>
                <li><Link href={ '/admin' }>投稿一覧</Link></li>
                <li><Link href={ '/admin/post-new' }>新規作成</Link></li>
                <li><Link href={ '/admin/media' }>メディア</Link></li>
                <li><Link href={ '/admin/category' }>カテゴリー</Link></li>
              </ul>
            </nav>
          </div>
          <div className={ style.status_box }>
            <ThemeChangeButton style={{ height: '100%', fontSize: '16px' }} />
          </div>
        </div>
      }
      <header className={ `${ style.header } ${ session && style.toolbar_enable }` }>
        <div className={ style.siteTitle }><span>Ryusei.IO</span></div>
        <div className={ style.navigations }><span>{ headersList.get("x-url") || "" }</span></div>
        <div className={ style.sessionControl }>
          { !session && <LoginButton/> }
          { !session && <RegisterButton/> }
          { session && <LogoutButton/> }
        </div>
      </header>
    </>
  )
}