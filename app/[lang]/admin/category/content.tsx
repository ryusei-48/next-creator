"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import style from './content.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import {
  useForm, Controller, type Control, type FieldValues,
  type ResolverResult
} from 'react-hook-form';
import Select, { type OptionsOrGroups } from 'react-select';

export default function Content({
  lang, defaultLang, locales, localeLabels
}: {
  lang: string, defaultLang: string,
  locales: string[], localeLabels: {[key: string]: {[key: string]: string}}
}) {

  const {
    register: register_new, handleSubmit: handleSubmit_new,
    getValues: getValues_new, reset: reset_new, setValue: setValue_new,
    trigger: trigger_new, formState: { errors: errors_new }, control: control_new
  } = useForm({ mode: 'onChange' });
  const {
    register: register_edit, handleSubmit: handleSubmit_edit,
    getValues: getValues_edit, reset: reset_edit, setValue: setValue_edit,
    trigger: trigger_edit, formState: { errors: errors_edit }, control: control_edit
  } = useForm({ mode: 'onChange' });
  const categoryData = useRef<CategoryData[] | null>( null );
  const categoryTree = useRef<CategoryNode | null>( null );
  const [ useLang_new, setUseLang_new ] = useState<string>( lang );
  const [ useLang_edit, setUseLang_edit ] = useState<string>( lang );
  const [ categoryNode, setCategoryNode ] = useState<React.JSX.Element | null>( null );
  const [ formSwitch, setFormSwitch ] = useState(0);
  const [ catEditDetails, setCatEditDetails ] = useState<CatEditDetails>(null);

  useEffect(() => { categoryTreeUpdate() }, []);

  async function categoryTreeUpdate() {

    categoryTree.current = await getCategory();
    setCategoryNode( getCategoryNode( categoryTree.current ) );
  }

  async function getCategory() {

    return new Promise<CategoryNode>((resolve) => {

      fetch('/api/category/get', { method: 'POST', cache: 'no-store' })
        .then( async (response) => {
          if ( response.ok ) {
            const categorys = await response.json() as CategoryData[];
            console.log( categorys );
            
            const searchEdit = ( categorys: CategoryData[], parent: number = 0 ) => {
              const children: CategoryNode = []
              for ( let [ index, category ] of categorys.entries() ) {
                if ( parent === category.parent ) {
                  children.push({ ...category, children: searchEdit( categorys, category.id ) });
                }
              }

              return children;
            }

            categoryData.current = categorys;

            resolve( searchEdit( categorys, 0 ) );
          }
        });
    });
  }

  function getCategoryNode( tree: CategoryNode ) {

    return (
      <ul role="tree" className={ style.category_group }>
        {
          tree.map((cat, index) => {
            return (
              <li role="treeitem" tabIndex={ 0 }>
                <div className={ style.item } onMouseOver={(e) => {
                    e.stopPropagation();
                    e.currentTarget.style.backgroundColor = 'var( --background-secondary-color )';
                    (e.currentTarget.childNodes[3] as HTMLSpanElement).style.opacity = "1";
                  }} onMouseOut={(e) => {
                    e.stopPropagation();
                    e.currentTarget.style.removeProperty('background-color');
                    (e.currentTarget.childNodes[3] as HTMLSpanElement).style.removeProperty('opacity');
                }}>
                  <span  className={ style.icon }>
                    {
                      cat.icon ?
                        <img src={ `../api/media-stream/icon?id=${ cat.id }` } aria-label='アイコン' loading="lazy" /> :
                        <FontAwesomeIcon icon={ faAngleDoubleRight }></FontAwesomeIcon>
                    }
                  </span>
                  { cat.name[ lang ] }
                  <span style={{ marginLeft: '15px', color: 'gray' }}>{ cat.slug }</span>
                  <span className={ style.control }>
                    <button
                      data-name={ cat.name[ lang ] } data-slug={ cat.slug } data-icon={ cat.icon || 'none' }
                      data-id={ cat.id } data-rank={ cat.rank } data-parent={ cat.parent }
                      onClick={(e) => {
                        const dataset = e.currentTarget.dataset;
                        if ( dataset.name && dataset.slug && dataset.rank && dataset.parent && dataset.id ) {
                          setFormSwitch( 1 );
                          setCatEditDetails({
                            name: dataset.name, slug: dataset.slug, rank: dataset.rank,
                            parent: dataset.parent, icon: dataset.icon || 'none', id: dataset.id
                          });
                          setValue_edit( 'category_id', dataset.id );
                          for ( let acceptLang of locales ) {
                            setValue_edit( `category_name_${ acceptLang }`, cat.name[ acceptLang ] );
                          }
                          setValue_edit( 'category_slug', dataset.slug );
                          setValue_edit( 'category_rank', dataset.rank );
                          reset_edit({ 'category_icon': null });

                          setValue_edit( 'category_parent', dataset.parent );
                        }
                      }}
                    >編集</button>
                    &nbsp;/&nbsp;
                    <button data-id={ cat.id }>削除</button>
                  </span>
                </div>
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

  function registerCategory( type: 'new' | 'edit', form: HTMLFormElement ) {

    const formData = new FormData( form );
    formData.set(
      'category_parent',
      type === 'new' ? getValues_new('category_parent') :
        getValues_edit('category_parent')
    )

    fetch( `/api/category/${ type === 'new' ? 'create' : 'update' }`, {
      method: 'POST', body: formData, cache: 'no-store'
    }).then( async (response) => {
      console.log( response.ok );
      if ( response.ok ) {
        alert(`⭕カテゴリーを${ type === 'new' ? '追加' : '更新' }しました。`);
        type === 'new' && reset_new();
        categoryTreeUpdate();
      }else alert(`❌カテゴリーの${ type === 'new' ? '追加' : '更新' }に失敗しました。`);
    });
  }

  function getParentSelectComponent(
    control: Control<FieldValues, any>, name: string,
    categorys: CategoryData[], label?: string, defaultValue?: string
    ) {

    const initialValue = { label: 'なし（ルート）', value: "0" }
    const options = [
      initialValue, ...categorys.map((cat) => {
      return { label: `${ cat.name[ lang ] } [${ cat.slug }]`, value: `${ cat.id }` };
    })];

    let selectedValue: { label: string, value: string } | undefined = undefined;
    if ( defaultValue ) {
      for ( let option of options ) {
        if ( option.value === defaultValue ) {
          selectedValue = option; break;
        }
      }
    }

    return (
      <Controller
        name={ name }
        rules={{ required: true }}
        defaultValue={ defaultValue ?? "0" }
        control={ control }
        render={({ field: { onChange, value }}) => (
          <Select
            options={ options }
            //defaultValue={ /*selectedValue ?? initialValue*/ }
            styles={{
              option: provided => ({ ...provided, color: 'var( --foreground-color )' }),
              control: provided => ({ ...provided, color: 'var( --foreground-color )' }),
              singleValue: provided => ({ ...provided, color: 'var( --foreground-color )' })
            }}
            value={ options.find((c) => c.value === value )}
            onChange={(val) => val && onChange(val.value)}
            maxMenuHeight={ 300 }
            menuPortalTarget={document.body}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary: 'var( --react-select-primary )',
                primary25: 'var( --react-select-primary25 )',
                neutral0: 'var( --react-select-neutral0 )',
                neutral80: 'white',
              }
            })}
            aria-labelledby={ label }
          />
        )}
      ></Controller>
    )
  }

  const slugValidater = useCallback( async ( value: FieldValues ) => {
    
    const response = await fetch('/api/category/slug-exist', {
      method: 'POST', body: JSON.stringify({ slug: value })
    });

    if ( response.ok ) {
      const { isExist } = await response.json() as { isExist: boolean };

      if ( !isExist ) return true
      else return '既に同名のスラグが存在します。';
    }

    return 'スラグの確認処理で、ネットワークエラーが発生しました。';
  }, []);

  return (
    <>
      <h2 className={ style.heading2 }>カテゴリー</h2>
      <div className={ style.category_manage_wrap }>
        <div className={ style.category_tree_wrap }>
          <h3>登録カテゴリー一覧</h3>
          <button className={ style.cat_new } onClick={() => {
            setFormSwitch( 0 ); setCatEditDetails(null); reset_edit();
          }}>新規追加</button>
          <div className={ style.tree }>{ categoryNode && categoryNode }</div>
        </div>
        <div className={ style.category_register_wrap }>
          <div className={ style.form_switch } hidden={ formSwitch === 0 ? false : true }>
            <h3>新規追加</h3>
            <form onSubmit={
              handleSubmit_new((_, e) => {
                registerCategory( 'new', e?.target )
              })
            }
            >
              <div className={ style.form_item }>
                <div className={ style.lang_tabs }>
                  {
                    locales.length > 1 && locales.map((acceptLang) => {
                      return (
                        <button
                          type="button"
                          className={ `${ style.tab } ${ useLang_new === acceptLang && style.selected }` }
                          onClick={() => {
                            setUseLang_new( acceptLang );
                          }}
                        >
                          { localeLabels[ lang ][ acceptLang ] }
                        </button>
                      )
                    })
                  }
                </div>
                <div className={ style.tab_content }>
                  {
                    locales.map((acceptLang) => {
                      return (
                        <div className={ `${ style.content } ${ useLang_new === acceptLang && style.show }` }>
                          <label htmlFor='category-name-input'>カテゴリー名</label>
                          <input type="text" id="category-name-input"
                            { ...register_new( `category_name_${ acceptLang }`, {
                              required: {
                                value: true, message: '入力必須項目です。'
                              },
                              maxLength: {
                                value: 50, message: '50文字以内で入力してください。'
                              }
                            })}
                          />
                          {
                            errors_new[`category_name_${ acceptLang }`]?.message &&
                            <span className={ style.error_message }>
                              { errors_new[`category_name_${ acceptLang }`]?.message as string }
                            </span>
                          }
                        </div>
                      )
                    })
                  }
                </div>
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
                    },
                    validate: async ( value ) => slugValidater( value )
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
                  defaultValue={ "0" }
                />
                {
                  errors_new.category_rank && errors_new.category_rank.message &&
                  <span className={ style.error_message }>
                    { errors_new.category_rank.message as string }
                  </span>
                }
              </div>
              <div className={ style.form_item }>
                <label id='category-parent-input'>親カテゴリー（表示専用）</label>
                { categoryNode &&
                  getParentSelectComponent(
                    control_new, 'category_parent',
                    categoryData.current!, 'category-parent-input'
                  ) 
                }
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
          <div className={ style.form_switch } hidden={ formSwitch === 1 ? false : true }>
            <h3>編集 - { catEditDetails && catEditDetails.name }</h3>
            <form onSubmit={
              handleSubmit_edit((_, e) => {
                registerCategory( 'edit', e?.target )
              })
            }
            >
              <div className={ style.form_item }>
              <div className={ style.lang_tabs }>
                  {
                    locales.length > 1 && locales.map((acceptLang) => {
                      return (
                        <button
                          type="button"
                          className={ `${ style.tab } ${ useLang_edit === acceptLang && style.selected }` }
                          onClick={() => {
                            setUseLang_edit( acceptLang );
                          }}
                        >
                          { localeLabels[ lang ][ acceptLang ] }
                        </button>
                      )
                    })
                  }
                </div>
                <div className={ style.tab_content }>
                  {
                    locales.map((acceptLang) => {
                      return (
                        <div className={ `${ style.content } ${ useLang_edit === acceptLang && style.show }` }>
                          <label htmlFor='category-name-input'>カテゴリー名</label>
                          <input type="text" id="category-name-input"
                            { ...register_edit( `category_name_${ acceptLang }`, {
                              required: {
                                value: true, message: '入力必須項目です。'
                              },
                              maxLength: {
                                value: 50, message: '50文字以内で入力してください。'
                              }
                            })}
                          />
                          {
                            errors_edit[`category_name_${ acceptLang }`]?.message &&
                            <span className={ style.error_message }>
                              { errors_edit[`category_name_${ acceptLang }`]?.message as string }
                            </span>
                          }
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <div className={ style.form_item }>
                <label htmlFor='category-slug-input'>スラッグ（半角英数字[A-Za-z0-9_-]）</label>
                <input type='text' id="category-slug-input"
                  { ...register_edit( 'category_slug', {
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
                  errors_edit.category_slug && errors_edit.category_slug.message &&
                  <span className={ style.error_message }>
                    { errors_edit.category_slug.message as string }
                  </span>
                }
              </div>
              <div className={ style.form_item }>
                <label htmlFor='category-rank-input'>ランク（数値）</label>
                <input type="number" id="category-rank-input"
                  { ...register_edit( 'category_rank', {
                    required: {
                      value: true, message: '入力必須項目です。'
                    }
                  })}
                />
                {
                  errors_edit.category_rank && errors_edit.category_rank.message &&
                  <span className={ style.error_message }>
                    { errors_edit.category_rank.message as string }
                  </span>
                }
              </div>
              <div className={ style.form_item }>
                <label id='category-parent-input'>親カテゴリー</label>
                { categoryNode &&
                  getParentSelectComponent(
                    control_edit, 'category_parent',
                    categoryData.current!, 'category-parent-input'
                  ) 
                }
              </div>
              <div className={ style.form_item }>
                <label htmlFor='category-icon-input'>アイコン</label>
                <input type="file" id="category-icon-input" accept="image/*" { ...register_edit('category_icon') } />
                <span>※推奨サイズ：50 X 50ピクセル程度</span>
              </div>
              <div className={ style.form_item } style={{ textAlign: 'center' }}>
                <input type="hidden" { ...register_edit( 'category_id', { required: true })} />
                <button type="submit" className={ style.add_category_btn }>更新</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}