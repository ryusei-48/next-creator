"use client";
import style from './contactform.module.scss';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function Contactform({ lang }: {
  lang: string
}) {

  const dialogRef = useRef<HTMLDialogElement | null>( null );
  const [ isShow, setIsShow ] = useState<boolean>( false );
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });

  useEffect(() => {
    const openContactformTogle = document.getElementById('open-contactform')!;
    openContactformTogle.addEventListener('click', () => {
      dialogRef.current?.showModal();
      setTimeout(() => {
        setIsShow( true );
      }, 50);
    });
  }, []);

  return (
    <dialog className={ `${ style.contactform } ${ isShow ? 'show ' + style.show : '' }` } ref={ dialogRef }>
      <div className={ style.content }>
        <h2>お問い合わせ</h2>
        <form onSubmit={ handleSubmit((data) => {
          console.log( data );
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
            <button type="submit" className={ style.submit }>送信</button>
            <button className={ style.close } type="button" onClick={() => {
              setIsShow( false );
              setTimeout(() => {
                dialogRef.current?.close()
              }, 300);
            }}>閉じる</button>
          </div>
        </form>
      </div>
    </dialog>
  )
}