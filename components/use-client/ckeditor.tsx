"use client";
import React, { useEffect, useRef, useState } from 'react';
import ClassicEditor, { type EditorConfig, ClassicEditor as Editor } from 'ckeditor5-custom-build';
import './ckeditor-override.scss';
import style from './ckeditor.module.scss';

export default function CkEditor({
  locales, defaultLang, localeLabels, titleInputRef,
  editorRef, mediaSelectDialog, descInputRef, setMediaInsertMode
}: {
  locales: string[], defaultLang: string,
  localeLabels: {[key: string]: {[key: string]: string}},
  titleInputRef: React.MutableRefObject<{[key: string]: HTMLInputElement}>,
  editorRef: React.MutableRefObject<{[key: string]: Editor}>,
  descInputRef: React.MutableRefObject<{[key: string]: HTMLTextAreaElement}>,
  mediaSelectDialog: React.MutableRefObject<HTMLDialogElement | null> ,
  setMediaInsertMode: React.Dispatch<React.SetStateAction<"ck" | "thumb">>
}) {

  const [ useLang, setUseLang ] = useState<string>( defaultLang );
  //const ckeditorRef = useRef<{[key: string]: Editor}>({});
  let ignore = false;

  useEffect(() => {
    async function startFetching() {
      if ( !ignore ) {
        if ( window.matchMedia('(prefers-color-scheme: dark)').matches ) {
          document.documentElement.classList.add('ck-theme-dark');
        }
      }
    }

    startFetching();
    return () => { ignore = true };
  }, []);

  const selectoMedia = () => {
    if ( mediaSelectDialog && mediaSelectDialog.current ) {
      mediaSelectDialog.current.showModal();
      setMediaInsertMode('ck');
    }
  }

  return (
    <div className={ style.ckeditor_wrapper }>
      <div className={ style.lang_tabs }>
        {
          locales.length > 1 && locales.map((lang, index) => {
            return (
              <button key={ index } className={ `${ style.tab } ${ useLang === lang && style.selected }` }
                data-lang={ lang }
                onClick={(e) => {
                  setUseLang( lang );
                }}
              >{ localeLabels[ defaultLang ][ lang ] }</button>
            );
          })
        }
      </div>
      <div className={ style.editors }>
        {
          locales.map((lang, index) => {
            return (
              <div key={ index } className={ `${ style.instance } ${ useLang === lang && style.show }` }>
                <input
                  type="text"
                  placeholder='記事タイトル'
                  className={ style.title }
                  ref={(element) => {
                    titleInputRef.current[ lang ] = element!;
                  }}
                />
                <CreateCkEditor
                  lang={ lang } editorRef={ editorRef }
                  selectoMedia={ selectoMedia }
                />
                <div className={ style.description }>
                  <label htmlFor={ `desc-text-${ index }` }>記事の説明・抜粋</label>
                  <textarea
                    ref={(element) => {
                      descInputRef.current[ lang ] = element!;
                    }}
                    id={ `desc-text-${ index }` }
                    placeholder='目安：スマホ７０文字、PC９０～１２０文字程度'
                    onChange={(e) => {
                      e.currentTarget.style.height = '0';
                      e.currentTarget.style.height = `max( ${ e.currentTarget.scrollHeight }px, 4em )`;

                      const count = e.currentTarget.value.length;
                      const showSpan = e.currentTarget.parentElement?.childNodes[2] as HTMLSpanElement;
                      showSpan.textContent = `文字数：${ count }`;
                    }}
                  ></textarea>
                  <span className={ style.text_count }>文字数：--</span>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export function CreateCkEditor({ lang, editorRef, selectoMedia }: {
  lang: string, editorRef: React.MutableRefObject<{[key: string]: Editor}>,
  selectoMedia: () => void
}) {

  const ckeditorRef = useRef<HTMLDivElement | null>( null );
  const textCountRef = useRef<HTMLSpanElement | null>( null );
  let ignore = false;

  useEffect(() => {
    async function startFetching() {
      if ( !ignore ) {
    
        ClassicEditor.create( ckeditorRef.current!, {
          ui: { viewportOffset: { top: 34, left: 0, right: 0, bottom: 0 } },
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
            ], supportAllValues: true
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
            ], shouldNotGroupWhenFull: true
          },
          wordCount: {
            onUpdate: ({ characters }) => {
              if ( textCountRef.current ) {
                textCountRef.current.textContent = `文字数：${ characters }`;
              }
            }
          },
          simpleUpload: { uploadUrl: `${ process.env.NEXT_PUBLIC_APP_URL }/api/upload`, withCredentials: false },
          updateSourceElementOnDestroy: true,
          mediaEmbed: { previewsInData: true }, language: 'ja',
          codeBlock: {
            languages: [
              { language: 'plaintext', label: 'Plain text', class: 'language-plaintext Plain Text' },
              { language: 'commandline', label: 'Commandline', class: 'language-plaintext Commandline' },
              { language: 'shell', label: 'Shell', class: 'language-shell Shell' },
              { language: 'c', label: 'C', class: 'language-c C' },
              { language: 'c++', label: 'C++', class: 'language-c++ C++' },
              { language: 'c#', label: 'C#', class: 'language-c# C#' },
              { language: 'css', label: 'CSS', class: 'language-css CSS' },
              { language: 'scss', label: 'SCSS', class: 'language-scss SCSS' },
              { language: 'html', label: 'HTML', class: 'language-html HTML' },
              { language: 'java', label: 'Java', class: 'language-java Java' },
              { language: 'javascript', label: 'JavaScript', class: 'language-javascript JavaScript' },
              { language: 'typescript', label: 'TypeScript', class: 'language-typescript TypeScript' },
              { language: 'php', label: 'PHP', class: 'language-php PHP' },
              { language: 'python', label: 'Python', class: 'language-python Python' },
              { language: 'ruby', label: 'Ruby', class: 'language-ruby Ruby' },
              { language: 'sql', label: 'SQL', class: 'language-sql SQL' },
              { language: 'swift', label: 'Swift', class: 'language-swift Swift' },
              { language: 'xml', label: 'XML', class: 'language-xml XML' }
            ]
          },
          link: {
            decorators: {
              openInNewTab: {
                  mode: 'manual',
                  label: '新規タブで開く',
                  defaultValue: true,
                  attributes: {
                      target: '_blank',
                      rel: 'noopener noreferrer'
                  }
              },
              addClass: {
                mode: 'manual',
                label: 'カード表示',
                defaultValue: false,
                attributes: {
                  'data-type': 'card'
                }
              }
            }
          }
        }).then((editor) => {

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

          editorRef.current[ lang ] = editor;
        });

        window.addEventListener('keydown', (e) => {
          if ( e.shiftKey && e.ctrlKey && e.code === 'KeyQ' ) {
            const codeToInsert = `
              <section class="simple-box">
                  <h1 class="simple-box-title">Box title</h1>
                  <div class="simple-box-description">
                      <p>The description goes here.</p>
                      <ul>
                          <li>It can contain lists,</li>
                          <li>and other block elements like headings.</li>
                      </ul>
                  </div>
              </section>
            `;
            const viewFragment = editorRef.current[ 'ja' ].data.processor.toView( codeToInsert );
            const modelFragment = editorRef.current[ 'ja' ].data.toModel( viewFragment );
            editorRef.current['ja'].model.insertContent( modelFragment, editorRef.current['ja'].model.document.selection );
          }
        });
      }
    }

    startFetching();
    return () => { ignore = true };
  }, []);

  return (
    <>
      <div ref={ ckeditorRef }></div>
      <span ref={ textCountRef } className={ style.count }>文字数：--</span>
    </>
  )
}