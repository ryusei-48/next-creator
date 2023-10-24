"use client";
import {signIn, signOut} from "next-auth/react";
import style from './auth-button.module.scss';

// ログインボタン
export const LoginButton = () => {
    return (
        <button className={ `${ style['button'] } ${ style['login-button'] }` } onClick={() => signIn()}>
            ログイン
        </button>
    );
};

// ログアウトボタン
export const LogoutButton = ({ lang, localStack }: {
    lang: AcceptLocales, localStack: { logout: string }
}) => {
    return (
        <button className={ `${ style['button'] } ${ style['logout-button'] }` } onClick={() => signOut()}>
            { localStack.logout }
        </button>
    );
};

// 登録ボタン
export const RegisterButton = () => {
    /*return (
        <button style={{marginRight: 10}} onClick={() => signOut()}>
            登録
        </button>
    )*/
    return (
        <button className={ `${ style['button'] } ${ style['register-button'] }` } onClick={() => signIn()}>
            登録
        </button>
    );
}