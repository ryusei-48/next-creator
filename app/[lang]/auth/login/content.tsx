'use client'
import { useState, useEffect } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import style from './content.module.scss';

export default function LoginPage({ useLang, defaultLang, locales, localeLabels, userCount }: {
  useLang: string, locales: string[], localeLabels: {[key: string]: {[key: string]: string}},
  defaultLang: string, userCount: number
}) {

  const router = useRouter()
  const {
    register: register_rhf, handleSubmit, getValues,
    trigger, formState: { errors }
  } = useForm({ mode: 'onChange' });
  const {
    register: register_rhf_login, handleSubmit: handleSubmit_login,
    getValues: getValues_login, formState: { errors: errors_login
  } } = useForm({ mode: 'onChange' });
  const [ isUserIdExist, setIsUserIdExist ] = useState<boolean | null>( null );
  const [ loginErrorMessage, setLoginErrorMessage ] = useState<null | string>( null );
  const [ registerErrorMessage, setRegisterErrorMessage ] = useState<null | string>( null );
  const [ isRegisterd, setIsRegisterd ] = useState( false );

  const login = ( data: FieldValues ) => {

    try {
     signIn("credentials", {
        redirect: false,
        email: data.nameId, password: data.password
        //email: 'yamazakifinal77@gmail.com',
        //password: '123'
      }).then(res => {
        if (res?.error) {
          //console.log(res.error)
          setLoginErrorMessage('メールアドレスまたはパスワードが間違っています。');
        } else {
          router.push('/')
        }
      })
    } catch (err) {
      //console.log(err)
      setLoginErrorMessage('認証処理で予期せぬエラーが発生しました。');
    }
  }

  const userExist = ( username: string ) => {

    fetch('/api/userexist', {
      method: 'POST',
      body: JSON.stringify({ userId: username })
    }).then( async (response) => {
      if ( response.status === 200 ) {
        const userExist = await response.json();
        setIsUserIdExist( userExist.name ? true : false );
      } else console.log('faild.');
    })
  }

  const register = ( data: FieldValues ) => {

    fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        userId: data.nameId_b, password: data.password_b
      })
    }).then( async (response) => {
      if (response.status === 200) {
        //const result = await response.json();
        setIsRegisterd( true );
        setTimeout(() => {
          login({ nameId: data.nameId_b, password: data.password_b });
        }, 5000);
        //console.log(data);
      } else {
        setRegisterErrorMessage('問題が発生したため、ユーザー登録処理を完了できませんでした。');
        //console.error('Authentication error');
      }
    });
  }

  return (
    <>
      <div className={ style.wrapper }>
        { isRegisterd && <p className={ style['registerd-alert'] }>ユーザー登録が完了しました。５秒後に自動的にログインします。</p> }
        <div className={ style['login-area'] }>
          <h2>ログイン</h2>
          <form onSubmit={ handleSubmit_login((data) => { login(data) }) }>
            <div className={ style['input-box'] }>
              <label htmlFor="nameId">ユーザーID</label>
              <input type="text" id="nameId" {...register_rhf_login('nameId', { required: true })} />
              { errors_login.nameId && <p className={ style['erro-message'] }>ユーザーIDを入力してください</p> }
            </div>
            <div className={ style['input-box'] }>
              <label htmlFor="password">パスワード</label>
              <input type="password" id="password" {...register_rhf_login('password', { required: true })} />
              { errors_login.password && <p className={ style['erro-message'] }>パスワードを入力してください</p> }
            </div>
            { loginErrorMessage !== null && <p className={ style['erro-message'] }>{ loginErrorMessage }</p> }
            <button className={ style['login-btn'] } type="submit">ログイン</button>
          </form>
          <br/>
          <Link href="/">トップへ戻る</Link>
        </div>
        {
          userCount === 0 &&
          <div className={ style['login-area'] }>
            <h2>ユーザー登録</h2>
            <form onSubmit={ handleSubmit((data) => { register(data) }) }>
              <div className={ style['input-box'] }>
              <label htmlFor="nameId_b">ユーザーID</label>
                <input type="text" id="nameId_b" {...register_rhf(
                  'nameId_b', {
                    required: {
                      value: true, message: 'ユーザーIDを入力してください。'
                    },
                    maxLength: {
                      value: 20, message: 'ユーザーIDは20文字以内で入力してください。'
                    },
                    minLength: {
                      value: 7, message: 'ユーザーIDは7文字以上で入力してください。'
                    },
                    pattern: {
                      value: /^([0-9a-zA-Z]|_|-)+$/g,
                      message: '形式が正しくありません。使用可能な文字は、英数字、[_-」のみです。'
                    },
                    onChange: () => {
                      const isVarid = getValues('nameId_b').match(/^([0-9a-zA-Z]|_|-){7,20}$/g);
                      if ( isVarid ) {
                        userExist( getValues('nameId_b') );
                      }
                    }
                  }
                )} />
                { errors.nameId_b?.message && <p className={ style['erro-message'] }>{ errors.nameId_b.message.toString() }</p> }
                {
                  isUserIdExist === true && errors.nameId_b === undefined &&
                    <p className={ style['userid-exited'] }>✖このユーザーIDは既に使用されています。</p>
                }
                {
                  isUserIdExist === false && errors.nameId_b === undefined &&
                    <p className={ style['userid-no-exist'] }>◎使用可能なユーザーIDです。</p>
                }
                <p className={ style['validation-info'] }>使用できる文字は、a～z、A～Z、0～9、ハイフン(-)、アンダーライン(_)です。</p>
              </div>
              <div className={ style['input-box'] }>
                <label htmlFor="password_b">パスワード</label>
                <input type="password" id="password_b" {...register_rhf(
                  'password_b', {
                    required: {
                      value: true, message: 'パスワードを入力してください。'
                    },
                    maxLength: {
                      value: 20, message: 'パスワードは20文字以内で入力してください。'
                    },
                    minLength: {
                      value: 8, message: 'パスワードは8文字以上で入力してください。'
                    },
                    onChange: () => {
                      if ( getValues('password_b_confarm') ) {
                        trigger('password_b_confarm');
                      }
                    }
                  }
                )} />
                { errors.password_b?.message && <p className={ style['erro-message'] }>{ errors.password_b.message.toString() }</p> }
                <label htmlFor="password_b_confarm" style={{ margin: '10px auto' }}>パスワード（確認）</label>
                <input type="password" id="password_b_confarm" {...register_rhf(
                  'password_b_confarm', {
                    required: {
                      value: true, message: '確認用パスワードを入力してください。'
                    },
                    validate: ( value ) => {
                      return (
                        value === getValues("password_b") || "パスワードが一致しません"
                      );
                    }
                  }
                )} />
                { errors.password_b_confarm?.message && <p className={ style['erro-message'] }>{ errors.password_b_confarm.message.toString() }</p> }
                <p className={ style['validation-info'] }>
                  ・パスワードは、8文字以上20文字以下で設定してください。<br/>
                  ・できるだけ記号・数字・アルファベットを組み合わせて強固なものにしてください。
                </p>
              </div>
              { registerErrorMessage !== null && <p className={ style['erro-message'] }>{ registerErrorMessage }</p> }
              <button className={ style['login-btn'] } type="submit">登録</button>
            </form>
          </div>
        }
      </div>
    </>
  );
};