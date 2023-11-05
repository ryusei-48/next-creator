"use client";
import style from './contactform.module.scss';
import loadingSvg from '@/public/static-icons/ball-triangle.svg';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import type { ContactResult } from '@/app/[lang]/api/contact/route';
import type { ContactFormLocales } from '../header';

export default function Contactform({ lang, localeStack }: {
  lang: AcceptLocales,
  localeStack: ContactFormLocales
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
    console.log('close');
    setIsShow( false );
    setTimeout(() => {
      dialogRef.current?.close()
    }, 300);
  }

  return (
    <dialog className={ `${ style.contactform } ${ isShow ? 'show ' + style.show : '' }` } ref={ dialogRef }>
      <div className={ style.content }>
        <h2>{ localeStack['contact-heading2'] }</h2>
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
                alert( localeStack['send-success-message'] );
                dialogClose();
              }else alert( localeStack['send-faild-message'] );
              setIsSending( false ); reset();
            }else alert( localeStack['send-server-error-message'] );
          });
        }) }>
          <label htmlFor='name-input'>{ localeStack['name-label'] }*</label>
          <input id="name-input" type='text' {...register('name', {
            required: { value: true, message: localeStack['name.error.message.required'] },
            maxLength: { value: 50, message: localeStack['name.error.message.maxLength'] }
          })} />
          {
            errors.name && <span className={ style.error_msg }>{ errors.name.message as string }</span>
          }
          <label htmlFor='email-input'>{ localeStack['email-label'] }*</label>
          <input id="email-input" type="email" {...register('email', {
            required: { value: true, message: localeStack['email.error.message.required'] },
            maxLength: { value: 100, message: localeStack['email.error.message.maxLength'] },
            pattern: { value: /^[a-zA-Z0-9-_\.]+@[a-zA-Z0-9-_\.]+$/, message: localeStack['email.error.message.pattern'] }
          })} />
          {
            errors.email && <span className={ style.error_msg }>{ errors.email.message as string }</span>
          }
          <label htmlFor='subject-input'>{ localeStack["subject-label"] }*</label>
          <select id="subject-input" {...register('subject', { required: true })}>
            <option value="job">{ localeStack['subject-option-job'] }</option>
            <option value="feedback">{ localeStack['subject-option-feedback'] }</option>
            <option value="other">{ localeStack['subject-option-other'] }</option>
          </select>
          <label htmlFor='body-input'>{ localeStack['body-label'] }*</label>
          <textarea id="body-input" {...register('body', {
            required: { value: true, message: localeStack['body.error.message.required'] }
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
                  alt={ localeStack['sending-image-alt'] }
                />
              }
              { localeStack['send-button'] }
            </button>
            <button className={ style.close } type="button" onClick={ dialogClose }>
              { localeStack['cancel-button'] }
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}