"use client"
import style from '../header.module.scss';
import {
  LoginButton, LogoutButton, RegisterButton
} from "@/components/auth-button";
import { usePathname } from 'next/navigation';
import { useSession, getCsrfToken } from 'next-auth/react';

export default function header() {

  const pathname = usePathname();
  const { status } = useSession();

  return (
    <header className={ style.header }>
      <div className={ style.siteTitle }><span>UI-Hant</span></div>
      <div className={ style.navigations }><span>Tools ▼{ pathname } | { status }</span></div>
    </header>
  )
}