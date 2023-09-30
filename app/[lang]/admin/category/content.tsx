"use client";
import React, { useState, useEffect, useRef } from 'react';
import style from './content.module.scss';
import { useForm, type FieldValues } from 'react-hook-form';

type CategoryData = {
  id: number, name: string, slug: string,
  rank: number, parent: number, icon: string,
  icon_mime: string, register_date: string,
  update_date: string
}

type CategoryNode = ({
  children: CategoryNode
} & CategoryData)[]

export default function Content({ lang }: { lang: string }) {

  const {
    register: register_new, handleSubmit: handleSubmit_new,
    getValues: getValues_new, reset: reset_new,
    trigger: trigger_new, formState: { errors: errors_new }
  } = useForm({ mode: 'onChange' });
  const categoryTree = useRef<CategoryNode | null>( null );
  const [ categoryNode, setCategoryNode ] = useState<React.JSX.Element | null>( null );

  useEffect(() => {
    categoryTreeUpdate();
  }, []);

  async function categoryTreeUpdate() {

    categoryTree.current = await getCategory();
    setCategoryNode( getCategoryNode( categoryTree.current ) );
  }

  async function getCategory() {

    return new Promise<CategoryNode>((resolve) => {

      fetch('/api/category/get', { method: 'POST' })
        .then( async (response) => {
          if ( response.ok ) {
            const categoryData = await response.json() as CategoryData[];
            
            const searchEdit = ( categorys: CategoryData[], parent: number = 0 ) => {
              const children: CategoryNode = []
              for ( let [ index, category ] of categorys.entries() ) {
                if ( parent === category.parent ) {
                  children.push({ ...category, children: searchEdit( categorys, category.id ) });
                }
              }

              return children;
            }

            resolve( searchEdit( categoryData, 0 ) );
          }
        });
    });
  }

  function getCategoryNode( tree: CategoryNode ) {

    return (
      <ul className={ style.category_group }>
        {
          tree.map((cat, index) => {
            return (
              <li>
                { cat.name }
                {
                  cat.children.length > 0 && getCategoryNode( cat.children )
                }
              </li>
            )
          })
        }
      </ul>
    )
  }

  function registerCategory( form: HTMLFormElement ) {

    const formData = new FormData( form );
    fetch( '/api/category/create', {
      method: 'POST', body: formData
    }).then( async (response) => {
      if ( response.ok ) {
        alert('⭕カテゴリーを追加しました。'); reset_new();
        categoryTreeUpdate();
      }else alert('❌カテゴリーの追加に失敗しました。');
    });
  }

  return (
    <>
      <h2 className={ style.heading2 }>カテゴリー</h2>
      <div className={ style.category_manage_wrap }>
        <div className={ style.category_tree_wrap }>
          <div className={ style.tree }>{ categoryNode && categoryNode }</div>
        </div>
        <div className={ style.category_register_wrap }>
          <h3>新規追加</h3>
          <form onSubmit={
            handleSubmit_new((_, e) => {
              registerCategory( e?.target )
            })
          }
          >
            <div className={ style.form_item }>
              <label htmlFor='category-name-input'>カテゴリー名</label>
              <input type="text" id="category-name-input"
                { ...register_new( "category_name", {
                  required: {
                    value: true, message: '入力必須項目です。'
                  },
                  maxLength: {
                    value: 50, message: '50文字以内で入力してください。'
                  }
                })}
              />
              {
                errors_new.category_name && errors_new.category_name.message &&
                <span className={ style.error_message }>
                  { errors_new.category_name.message as string }
                </span>
              }
            </div>
            <div className={ style.form_item }>
              <label htmlFor='category-slug-input'>スラッグ（半角英数字[A-Za-z0-9_-]）</label>
              <input type='text' id="category-slug-input"
                { ...register_new( 'category_slug', {
                  required: {
                    value: true, message: '入力必須項目です。'
                  },
                  maxLength: {
                    value: 50, message: '50文字以内で入力してください。'
                  },
                  pattern: {
                    value: /^[A-Za-z0-9_-]+$/g, message: '形式が正しくありません。'
                  }
                })}
              />
              {
                errors_new.category_slug && errors_new.category_slug.message &&
                <span className={ style.error_message }>
                  { errors_new.category_slug.message as string }
                </span>
              }
            </div>
            <div className={ style.form_item }>
              <label htmlFor='category-rank-input'>ランク（数値）</label>
              <input type="number" id="category-rank-input"
                { ...register_new( 'category_rank', {
                  required: {
                    value: true, message: '入力必須項目です。'
                  }
                })}
                value={ "0" }
              />
              {
                errors_new.category_rank && errors_new.category_rank.message &&
                <span className={ style.error_message }>
                  { errors_new.category_rank.message as string }
                </span>
              }
            </div>
            <div className={ style.form_item }>
              <label htmlFor='category-parent-input'>親カテゴリー（表示専用）</label>
              <input type="text" value={ "プログラミング" } id="category-parent-input" data-id="0" readOnly />
            </div>
            <div className={ style.form_item }>
              <label htmlFor='category-icon-input'>アイコン</label>
              <input type="file" id="category-icon-input" accept="image/*" { ...register_new('category_icon') } />
              <span>※推奨サイズ：50 X 50ピクセル程度</span>
            </div>
            <div className={ style.form_item } style={{ textAlign: 'center' }}>
              <button type="submit" className={ style.add_category_btn }>追加</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}