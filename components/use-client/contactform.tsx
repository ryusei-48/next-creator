"use client";
import style from './contactform.module.scss';
import loadingSvg from '@/public/static-icons/ball-triangle.svg';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import type { ContactResult } from '@/app/[lang]/api/contact/route';

export default function Contactform({ lang }: {
  lang: string
}) {

  const dialogRef = useRef<HTMLDialogElement | null>( null );
  const [ isShow, setIsShow ] = useState<boolean>( false );
  const [ isSending, setIsSending ] = useState<boolean>( false );
  const { register, reset, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });

  useEffect(() => {
    const openContactformTogle = document.getElementById('open-contactform')!;
    openContactformTogle.addEventListener('click', () => {
      dialogRef.current?.showModal();
      setTimeout(() => {
        setIsShow( true );
      }, 50);
    });
  }, []);

  function dialogClose() {
    setIsShow( false );
    setTimeout(() => {
      dialogRef.current?.close()
    }, 300);
  }

  return (
    <dialog className={ `${ style.contactform } ${ isShow ? 'show ' + style.show : '' }` } ref={ dialogRef }>
      <div className={ style.content }>
        <h2>お問い合わせ</h2>
        <form onSubmit={ handleSubmit((data) => {
          
          setIsSending( true );
          fetch('/api/contact', {
            method: 'POST', body: JSON.stringify({
              name: data.name, email: data.email,
              subject: data.subject, body: data.body
            })
          }).then( async (response) => {
            if ( response.ok ) {
              const result = await response.json() as ContactResult;
              if ( result.success ) {
                alert('送信しました。');
                dialogClose();
              }else alert('送信に失敗しました。');
              setIsSending( false ); reset();
            }else console.log( response.statusText );
          });
        }) }>
          <label htmlFor='name-input'>お名前*</label>
          <input id="name-input" type='text' {...register('name', {
            required: { value: true, message: '入力必須項目です。' },
            maxLength: { value: 50, message: '入力できる文字数は５０文字までです。' }
          })} />
          {
            errors.name && <span className={ style.error_msg }>{ errors.name.message as string }</span>
          }
          <label htmlFor='email-input'>メールアドレス*</label>
          <input id="email-input" type="email" {...register('email', {
            required: { value: true, message: '入力必須項目です。' },
            maxLength: { value: 100, message: 'メールアドレスが長すぎます。' },
            pattern: { value: /^[a-zA-Z0-9-_\.]+@[a-zA-Z0-9-_\.]+$/, message: '形式が正しくありません。' }
          })} />
          {
            errors.email && <span className={ style.error_msg }>{ errors.email.message as string }</span>
          }
          <label htmlFor='subject-input'>件名*</label>
          <select id="subject-input" {...register('subject', { required: true })}>
            <option value="job">仕事のご依頼</option>
            <option value="feedback">ご意見・ご要望</option>
            <option value="other">その他・連絡事項</option>
          </select>
          <label htmlFor='body-input'>本文*</label>
          <textarea id="body-input" {...register('body', {
            required: { value: true, message: '入力必須項目です。' }
          })}></textarea>
          {
            errors.body && <span className={ style.error_msg }>{ errors.body.message as string }</span>
          }
          <div className={ style.data_control }>
            <button type="submit" disabled={ isSending } className={ style.submit }>
              {
                isSending &&
                <Image src={ loadingSvg }
                  style={{
                    display: 'inline-block', width: '1em', marginRight: '10px',
                    height: '1em', transform: 'translateY( -4px )'
                  }}
                  alt='ローディング画像'
                />
              }
              送信
            </button>
            <button className={ style.close } type="button" onClick={ dialogClose }>閉じる</button>
          </div>
        </form>
      </div>
    </dialog>
  )
}