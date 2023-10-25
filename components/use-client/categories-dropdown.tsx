'use client';
import style from './categories-dropdown.module.scss';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { getCategory } from '@/app/[lang]/admin/post/content';

export default function CategoriesDropdown({ lang, defaultLang }: {
  lang: string, defaultLang: string
}) {

  const [ categoriesJSX, setCategoriesJSX ] = useState<React.JSX.Element | null>( null );
  const [ isShow, setIsShow ] = useState( false );
  let ignore = false;

  useEffect(() => {
    async function startFetching() {
      if ( !ignore ) {
        const categoriesJSX = generateCategoryJSX( (await getCategory()).searchEdit );
        setCategoriesJSX( categoriesJSX );

        const triggerButton = document.getElementById('open-category-dropdown')!;
        triggerButton.parentElement!.addEventListener('mouseover', () => {
          setIsShow( true );
        });
        triggerButton.parentElement!.addEventListener('mouseout', () => {
          setIsShow( false );
        });
      }
    }

    startFetching();
    return () => { ignore = true };
  }, []);

  function generateCategoryJSX( categories: CategoryNode ) {

    return (
      <>
        {
          categories.map((cat) => {
            return (
              <li key={ cat.id }>
                <Link className={ style.cat_link } href={`${ lang === defaultLang ? '' : '/' + lang }/category/${ cat.slug }`}>
                  <div className={ style.cat_record }>
                    <span className={ style.icon } style={{ marginRight: cat.icon_mime ? '25px' : '10px' }}>
                      {
                        cat.icon_mime ?
                        <img
                          src={ `${ process.env.NEXT_PUBLIC_APP_URL }/api/media-stream/icon?id=${ cat.id }` }
                          alt='カテゴリーアイコン' loading="lazy"
                        /> :
                        <FontAwesomeIcon className={ style.fontawesome } icon={ faHashtag }></FontAwesomeIcon>
                      }
                    </span>
                    <span className={ style.name }>
                      { cat.name[ lang ] }
                    </span>
                  </div>
                </Link>
                {
                  cat.children.length > 0 &&
                  <ul className={ style.sub_tree }>{ generateCategoryJSX( cat.children ) }</ul>
                }
              </li>
            )
          })
        }
      </>
    )
  }

  return (
    <ul className={ `${ style.cate_tree } ${ isShow ? style.show : '' }` }>{ categoriesJSX }</ul>
  )
}