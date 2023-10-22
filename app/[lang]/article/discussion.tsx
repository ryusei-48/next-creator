'use client';
import style from './discussion.module.scss';
import { useState, useEffect } from 'react';
import { experimental_useFormState as useFormState } from 'react-dom';
import { createNewComment } from './discussion.actions';

const initialState = {
  message: null,
}

export default function Discussion() {

  const [state, formAction] = useFormState(createNewComment, initialState)

  useEffect(() => {
    console.log( state );
  }, [ state ]);

  return (
    <div className={ style.client }>
      <hr />
      <form action={ formAction } className={ style.comment_form }>
        <div className={ style.item }>
          <label htmlFor='comment-nicname-input'>ニックネーム</label>
          <input type="text" id="comment-nicname-input" />
        </div>
        <div className={ style.item }>
          <label htmlFor="comment-email-input">メールアドレス</label>
          <input type="email" id="comment-email-input" />
        </div>
        <div className={`${ style.item } ${ style.block }`}>
          <textarea placeholder='ここに内容を入力'></textarea>
        </div>
        <div className={ style.submit_wrap }>
          <button type="submit" className={ style.submit }>送信</button>
        </div>
      </form>
    </div>
  )
}
