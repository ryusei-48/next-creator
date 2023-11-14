import style from './header.module.scss';
import { LoginButton, LogoutButton, RegisterButton } from "@/components/auth-button";
import CategoriesDropdown from './use-client/categories-dropdown';
import Contactform from './use-client/contactform';
import LanguageSelector from './small-parts/lang-change';
import CustomScript from './header.script';
import { options } from '@/lib/auth-options';
import { getServerSession } from "next-auth";
import Link from 'next/link';
import ThemeChangeButton from '../components/small-parts/switch-theme-button';
import { config as FortawesomeConfig } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faChevronDown, faBars } from '@fortawesome/free-solid-svg-icons';
import { pageJudg } from '@/lib/functions';
import myConfig from '@/public.config.json';
import FlagsSVG from '@/locales/country-flags';
import LocaleDic from '@/locales/dictionaries';
import HeaderJson from '@/locales/ja/header.json';
export type ContactFormLocales = typeof HeaderJson["contact-form"];
export type LanguageDropdownLocales = typeof HeaderJson["language-dropdown"];
export type MobileMenuLocales = typeof HeaderJson["mobile-menu"];

FortawesomeConfig.autoAddCss = false;

export default async function header({ lang }: { lang: AcceptLocales }) {

  const localeStack = await LocaleDic[ lang ].header();
  const defaultLang = myConfig.locale.default as AcceptLocales;
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
                <li key={1}>{ process.env.NEXT_PUBLIC_SITE_TITLE }</li>
                <li key={2}><Link href={ '/' }>{ localeStack.adminbar['view-site'] }</Link></li>
                <li key={3}><Link href={ '/admin/post-list' }>{ localeStack.adminbar['post-list'] }</Link></li>
                <li key={4}><a href={ '/admin/post' }>{ localeStack.adminbar['create-post'] }</a></li>
                <li key={5}><Link href={ '/admin/media' }>{ localeStack.adminbar.media }</Link></li>
                <li key={6}><Link href={ '/admin/category' }>{ localeStack.adminbar.category }</Link></li>
              </ul>
            </nav>
          </div>
          <div className={ style.status_box }>
            { /*<ThemeChangeButton style={{ height: '100%', fontSize: '16px' }} />*/ }
            <LogoutButton lang={ lang } localStack={{ logout: localeStack.adminbar.logout }} />
          </div>
        </div>
      }
      {
        !isAdminPage &&
        <header className={ `${ style.header } ${ session && style.toolbar_enable }` }>
          <div className={ `container ${ style.header }` }>
            <div className={ style.menubar_mobile }>
              <button aria-label='menu open' data-open="false" id="menubar-mobile-togle">
                <FontAwesomeIcon icon={ faBars }></FontAwesomeIcon>
              </button>
            </div>
            <div className={ style.siteTitle }>
              <Link className={ style.text } href={`/${ lang === myConfig.locale.default ? '' : lang }`}>
                {
                  isHome ? <h1>{ process.env.NEXT_PUBLIC_SITE_TITLE }</h1> : process.env.NEXT_PUBLIC_SITE_TITLE
                }
              </Link>
            </div>
            <nav id="top-nav-elem" className={ style.navigations }>
              <ul>
                <li key={ 0 } style={{ position: 'relative' }}>
                  <button
                    id="language-change-toggle"
                    aria-label={ localeStack['language-selector-alt'] }
                    title={ localeStack['language-selector-alt'] }
                  >
                    <FontAwesomeIcon className={ style.default } icon={ faGlobe }></FontAwesomeIcon>
                    &nbsp;{ localeStack['language-selector'] }
                  </button>
                  <LanguageSelector lang={ lang } flagsSVG={ FlagsSVG } localeStack={ localeStack['language-dropdown'] } />
                </li>
                <li key={1}>
                  <button id="open-contactform">{ localeStack.contact }</button>
                </li>
                <li key={2}>
                  <button aria-label='プロダクトリスト' id="open-product-list">{ localeStack.product }</button>
                </li>
                <li style={{ position: 'relative' }}>
                  <button id="open-category-dropdown">
                    { localeStack.category }&nbsp;
                    <FontAwesomeIcon fontSize={`.7em`} icon={ faChevronDown }></FontAwesomeIcon>
                  </button>
                  <CategoriesDropdown lang={ lang } defaultLang={ defaultLang } />
                </li>
                <li key={3}><Link href="/">{ localeStack.home }</Link></li>
              </ul>
            </nav>
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
          <Contactform lang={ lang } localeStack={ localeStack['contact-form'] } />
          <CustomScript
            localeStack={ localeStack['mobile-menu'] } lang={ lang } defaultLang={ defaultLang }
            flagsSVG={ FlagsSVG } langChangeLocaleStack={ localeStack['language-dropdown'] }
          />
        </header>
      }
      {
        //isAdminPage && <span className={ style.toolbar_enable }></span>
      }
    </>
  )
}