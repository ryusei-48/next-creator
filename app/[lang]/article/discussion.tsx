'use client';
import style from './discussion.module.scss';
import React, { useState, useEffect } from 'react';
//import { createNewComment, getComments } from './discussion.actions';

export default function Discussion({ lang, postId }: { lang: string, postId: number }) {

  const [ commentView, setCommentView ] = useState<React.JSX.Element[]>([]);
  const [ formValues, setFormValue ] = useState<{
    nicname: string, email: string, body: string
  }>({
    nicname: '', email: '', body: ''
  });

  useEffect(() => {

    ( async () => {
      const loadComments = await getCommentsFetch( postId );
      if ( loadComments ) {
        setCommentView( loadComments.map(comment => {
          return (
            <article className={ style.item } key={ comment.id }>
              <header className={ style.meta }>
                <span className={ style.nicname }>送信者：{ comment.nicname }</span>
                <span className={ style.id }>ID:{ comment.id }</span>
              </header>
              <div className={ style.content } dangerouslySetInnerHTML={{ __html: comment.body }}></div>
            </article>
          )
        }));
      }
    })();
  }, []);

  async function getCommentsFetch( post_id: number ) {

    return new Promise<Post.Comments | null>( async (resolve) => {
      fetch(`/api/discussion/get`, {
        method: 'POST', body: JSON.stringify({ post_id }),
        next: { revalidate: 30 }
      }).then( async (response) => {
        if ( response.ok ) {
          resolve( await response.json() );
        }else resolve( null );
      });
    });
  }

  async function postCommentFetch( data: FormData ) {

    return new Promise<Post.Comment | null>( async (resolve) => {
      fetch(`/api/discussion/create`, {
        method: 'POST', body: data
      }).then( async (response) => {
        if ( response.ok ) {
          resolve( await response.json() );
        }else resolve( null );
      });
    });
  }

  return (
    <div className={ style.client }>
      { commentView }
      <hr />
      <form /*action={ createCommentFormAction }*/
        className={ style.comment_form }
        onSubmit={ async (e) => {
          e.preventDefault();
          const formData = new FormData( e.currentTarget );
          const result = await postCommentFetch( formData );
          if ( result ) {
            setCommentView((jsx) => {
              return [ ...jsx, (
                <article className={ style.item } key={ result.id }>
                  <header className={ style.meta }>
                    <span className={ style.nicname }>送信者：{ result.nicname }</span>
                    <span className={ style.id }>ID:{ result.id }</span>
                  </header>
                  <div className={ style.content } dangerouslySetInnerHTML={{ __html: result.body }}></div>
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
        }}
      >
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
