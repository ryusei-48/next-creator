"use client";
import { useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build';
//import '@ckeditor/ckeditor5-build-classic/build/translations/ja';
import './ckeditor-override.css';
import style from './ckeditor.module.scss';

export default function CkEditor({ mediaSelectDialog, setMediaInsertMode }: {
  mediaSelectDialog: React.MutableRefObject<HTMLDialogElement | null> 
  setMediaInsertMode: React.Dispatch<React.SetStateAction<"ck" | "thumb">>
}) {

  useEffect(() => {
    if ( window.matchMedia('(prefers-color-scheme: dark)').matches ) {
      document.documentElement.classList.add('ck-theme-dark');
    }
  });

  const selectoMedia = () => {
    if ( mediaSelectDialog && mediaSelectDialog.current ) {
      mediaSelectDialog.current.showModal();
      setMediaInsertMode('ck');
    }
  }

  return (
    <div className={ style.ckeditor_wrapper }>
      <input
        type="text"
        placeholder='記事タイトル'
        className={ style.title }
      />
      <CKEditor
        editor={ ClassicEditor }
        config={{
          ui: {
            viewportOffset: { top: 34, left: 0, right: 0, bottom: 0 }
          },
          placeholder: 'ここに本文を入力',
          insertMedia: { mediaSelectModal: selectoMedia },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h2', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h3', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h4', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
              { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' }
            ]
          },
          fontSize: {
            options: [
              "10pt", "11pt", "12pt", "13pt", "14pt", "15pt", "16pt", 'default',
              "17pt", "18pt", "19pt", "20pt", "21pt", "22pt", "24pt",
              "26pt", "28pt", "30pt", "34pt", "38pt"
            ],
            supportAllValues: true
          },
          toolbar: {
            items: [
              'sourceEditing', 'heading',
              '|',
              'fontFamily', 'fontColor', 'fontBackgroundColor',
              'findAndReplace', 'fontSize', 'bold', 'italic',
              'link', 'bulletedList', 'numberedList',
              '|',
              'outdent', 'indent',
              '|',
              'imageUpload', 'imageInsert', 'insertMedia',
              'blockQuote', 'insertTable', 'mediaEmbed', 'undo',
              'redo', 'alignment', 'code', 'codeBlock',
              'htmlEmbed', 'horizontalLine', 'highlight',
              'removeFormat', 'selectAll', 'specialCharacters',
              'strikethrough', 'subscript', 'superscript', 'todoList'
            ],
            shouldNotGroupWhenFull: true
          },
          simpleUpload: {
            uploadUrl: 'http://ryuseiweb.localhost/api/upload',
            withCredentials: false
          },
          updateSourceElementOnDestroy: true,
          mediaEmbed: { previewsInData: true },
          language: 'ja',
        }}
        //data={ '<p>Hello from CKEditor&nbsp;5!</p>' }
        onReady={(editor) => {
          //console.log( Array.from( editor.ui.componentFactory.names() ) );
          //editor.setData('<p>Hello from CKEditor&nbsp;5!</p>');
          //console.log( editor.getData() );
          //window.editor = editor;

          editor.model.schema.extend('imageBlock', { allowAttributes: 'loading' });
          editor.conversion.for('downcast').attributeToAttribute({
            model: 'loading',
            view: 'loading'
          });
          editor.conversion.for('downcast').add(dispatcher => {
            dispatcher.on('insert:imageBlock', (evt, data, conversionApi) => {
                const viewImage = conversionApi.mapper.toViewElement( data.item );
                const img = viewImage.getChild( 0 );
                conversionApi.writer.setAttribute( 'loading', 'lazy', img );
            });
          });
        }}
        onChange={(_, editor) => {
          //console.log( editor.getData() );
          console.log( editor.model.schema.getDefinitions() );
        }}
        onBlur={(_, editor) => {
          //       
        }}
      ></CKEditor>    
    </div>
  )
}