"use client";
import style from './content.module.scss';
import dynamic from 'next/dynamic';
//import CkEditor from '@/components/use-client/ckeditor';

const CkEditor = dynamic(() => import( '@/components/use-client/ckeditor' ));

export default function Content() {

  return (
    <div className={ style.wrapper }>
      <h2>新規作成</h2>
      <div className={ style.container }>
        <div className={ style.edit_control }><CkEditor /></div>
        <div className={ style.widgets }>
          <h3>サムネイル設定</h3>
        </div>
      </div>
    </div>
  )
}