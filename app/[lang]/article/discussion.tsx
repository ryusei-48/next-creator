'use client';
import style from './discussion.module.scss';
import React, { useState, useEffect } from 'react';
import { experimental_useFormState as useFormState } from 'react-dom';
import { createNewComment, getComments } from './discussion.actions';

export default function Discussion({ lang, postId }: { lang: string, postId: number }) {

  const [ createCommentState, createCommentFormAction ] = useFormState( createNewComment, null );
  const [ getCommentState, getCommentFormAction ] = useFormState( getComments, null );
  const [ commentView, setCommentView ] = useState<React.JSX.Element[]>([]);
  const [ formValues, setFormValue ] = useState<{
    nicname: string, email: string, body: string
  }>({
    nicname: '', email: '', body: ''
  });

  useEffect(() => {
    if ( createCommentState ) {
      setCommentView((jsx) => {
        return [ ...jsx, (
          <article className={ style.item } key={ createCommentState.id }>
            <header className={ style.meta }>
              <span className={ style.nicname }>送信者：{ createCommentState.nicname }</span>
              <span className={ style.id }>ID:{ createCommentState.id }</span>
            </header>
            <div className={ style.content } dangerouslySetInnerHTML={{ __html: createCommentState.body }}></div>
          </article>
        )]
      });

      setFormValue((values) => {
        values.nicname = '';
        values.email = '';
        values.body = '';
        return values;
      });
    }

    if ( !getCommentState ) {
      getCommentFormAction( postId );
    }else if ( getCommentState && !createCommentState ) {
      setCommentView( getCommentState.map(comment => {
        return (
          <article className={ style.item } key={ comment.id }>
            <header className={ style.meta }>
              <span className={ style.nicname }>送信者：{ comment.nicname }</span>
              <span className={ style.id }>ID:{ comment.id }</span>
            </header>
            <div className={ style.content } dangerouslySetInnerHTML={{ __html: comment.body }}></div>
          </article>
        )
      }))
    }
  }, [ createCommentState, getCommentState ]);

  return (
    <div className={ style.client }>
      { commentView }
      <hr />
      <form action={ createCommentFormAction } className={ style.comment_form }>
        <div className={ style.item }>
          <label htmlFor='comment-nicname-input'>ニックネーム*</label>
          <input type="text" name="nicname" id="comment-nicname-input"
            value={ formValues.nicname }
            onChange={(e) => setFormValue((values) => ({ ...values, nicname: e.target.value }))}
          />
        </div>
        <div className={ style.item }>
          <label htmlFor="comment-email-input">メールアドレス*</label>
          <input type="email" name="email" id="comment-email-input"
            value={ formValues.email }
            onChange={(e) => setFormValue((values) => ({ ...values, email: e.target.value }))}
          />
        </div>
        <div className={`${ style.item } ${ style.block }`}>
          <textarea name="body" placeholder='ここに内容を入力'
            value={ formValues.body }
            onChange={(e) => setFormValue((values) => ({ ...values, body: e.target.value }))}
          ></textarea>
        </div>
        <div className={ style.submit_wrap }>
          <input type="hidden" name="post_id" value={ postId } />
          <button type="submit" className={ style.submit }>送信</button>
        </div>
      </form>
    </div>
  )
}
