import { Plugin, Command } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor//ckeditor5-widget';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import { add } from '@ckeditor/ckeditor5-utils/src/translation-service';

import Icon from './icons/up-right-from-square-solid.svg';

export default class InsertBlogCard extends Plugin {

  static get pluginName() {
    return 'InsertBlogCard';
  }

  static get requires() {                                                    // ADDED
    return [ Widget ];
  }

  init() {

    add('ja', {
      insertBlogCardButtonLabel: 'ブログカード',
      insertBlogCardInputPlaceholder: 'ここにURLを入力',
      insertBlogCardInsertButton: '挿入'
    });

    this._defineSchema();
    this._defineConverters();
    this._defineButtonView();
  }

  _defineSchema() {

    const schema = this.editor.model.schema;

    schema.register( 'blogCard', {
      inheritAllFrom: '$blockObject'
    });

    schema.register( 'previewLink', {
      isLimit: true,
      allowIn: 'blogCard', allowAttributes: ["data-href"]
      //allowContentOf: '$root'
    });

    schema.register( 'preview', {
      isLimit: true,
      allowIn: 'blogCard',
      //allowContentOf: '$root'
    });
  }

  _defineConverters() {

    const conversion = this.editor.conversion;
    
    conversion.for( 'upcast' ).elementToElement( {
      model: 'blogCard',
      view: { name: 'div', classes: ["insert-blog-card"] }
    });

    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'blogCard',
      view: { name: 'div', classes: ["insert-blog-card"] }
    });

    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'blogCard',
      view: ( modelElement, { writer: viewWriter } ) => {
          const section = viewWriter.createContainerElement( 'div', { class: 'insert-blog-card' } );
          return toWidget( section, viewWriter, { label: 'simple box widget' } );
      }
    });

    conversion.for( 'upcast' ).elementToElement( {
      model: 'previewLink',
      view: { name: 'div', classes: ["preview-link"],
      attributes: { 'data-href': true }}
    });

    conversion.for( 'dataDowncast' ).elementToElement( {
      model: { name: 'previewLink', attributes: ['data-href'] },
      view: ( modelElement, { writer: viewWriter } ) => {
        const href = modelElement.getAttribute('data-href') as string | undefined;
        console.log( modelElement.parent?.getChild(0) );
        return viewWriter.createContainerElement('a', {
          href, target: '_blank', class: 'preview-link'
        });
      }
    });

    conversion.for( 'editingDowncast' ).elementToElement( {
      model: { name: 'previewLink', attributes: ['data-href'] },
      view: ( modelElement, { writer: viewWriter } ) => {
        const section = viewWriter.createContainerElement( 'div', {
          class: 'preview-link', 'data-href': 'https://www.youtube.com'
        });
        return toWidget( section, viewWriter, { label: 'previewLink' } );
      }
    });

    /*conversion.for( 'upcast' ).elementToElement( {
      model: 'preview',
      view: { name: 'div', classes: ["preview"] }
    });

    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'preview',
      view: { name: 'div', classes: ["preview"]}
    });

    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'preview',
      view: ( modelElement, { writer: viewWriter } ) => {
          const section = viewWriter.createContainerElement( 'div', { class: 'preview' } );
          return toWidget( section, viewWriter, { label: 'simple box widget' } );
      }
    });*/
  }

  _defineButtonView() {

    this.editor.ui.componentFactory.add('insertBlogCard', ( locale ) => {

      const dropdownView = createDropdown( locale );

      dropdownView.buttonView.set({
        label: this.editor.t('insertBlogCardButtonLabel', 'Blog Card'),
        tooltip: true, icon: Icon
      });

      const panel = document.createElement('div');
      panel.classList.add('insert-blog-card');
      panel.innerHTML = `
        <div class="url-input-item">
          <input type="text" class="url-input" placeholder="${ this.editor.t('insertBlogCardInputPlaceholder', 'Enter URL here') }" />
          <button class="insert-editor">
            ${ this.editor.t('insertBlogCardInsertButton', 'Insert') }
          </button>
        </div>
        <a class="preview-link" href="#" target="_blank" rel="noopener noreferrer">
          <div class="preview">
            <div class="content">
              <div class="thumbnail">
                <div class="img-wrap">
                  <img src="#" alt="thumbnail" loading="lazy" />
                </div>
                <div class="domain">
                  <img class="icon" src="#" alt="icon" loading="lazy" />
                  <span class="domain-text"></span>
                </div>
              </div>
              <div class="details">
                <span class="title"></span>
                <span class="description"></span>
              </div>
            </div>
          </div>
        </a>
      `;
      const urlInput = panel.querySelector<HTMLInputElement>('input.url-input')!;
      const insertButton = panel.querySelector<HTMLButtonElement>('button.insert-editor')!;
      const previewA = panel.querySelector<HTMLLinkElement>('a.preview-link')!;
      const previewIcon = panel.querySelector<HTMLImageElement>('img.icon')!;
      const previewDomain = panel.querySelector<HTMLSpanElement>('span.domain-text')!;
      const previewThumbnail = panel.querySelector<HTMLImageElement>('div.thumbnail > div.img-wrap > img')!;
      const previewTitle = panel.querySelector<HTMLSpanElement>('span.title')!;
      const previewDescription = panel.querySelector<HTMLSpanElement>('span.description')!;

      urlInput.addEventListener('input', async () => {
        const response = await fetch(`/api/blogcard?url=${ urlInput.value }`, { method: 'GET' });
        if ( response.ok ) {
          const cardData: {
            title: string, description: string | null | undefined,
            thumbnail: string | null | undefined, icon: string,
            rootDmain: string, url: string
          } = await response.json();

          //console.log( cardData );
          previewA.href = cardData.url;
          previewIcon.src = cardData.icon;
          previewDomain.textContent = cardData.rootDmain;
          previewThumbnail.src = cardData.thumbnail || '#';
          previewTitle.textContent = cardData.title;
          previewDescription.textContent = cardData.description || "";
          
          if ( !previewA.classList.contains('show') ) {
            previewA.classList.add('show');
          }
        }
      });

      insertButton.addEventListener('click', () => {
        const elementString = `
          <div class="insert-blog-card">
            <div class="preview-link" data-href="https://www.youtube.com"></div>
          </div>
        `;
        const viewFragment = this.editor.data.processor.toView( elementString );
        const modelFragment = this.editor.data.toModel( viewFragment );
        this.editor.model.insertContent( modelFragment, this.editor.model.document.selection );
       this.editor.model.insertObject()

        urlInput.value = '';
        previewA.classList.remove('show');
        this.editor.editing.view.focus();
      });

      dropdownView.once('change:isOpen', () => {

        dropdownView.panelView.element?.append( panel );
      });

      dropdownView.on('change:isOpen', () => {

        setTimeout(() => {
          urlInput.focus();
        }, 200);
      });

      return dropdownView;
    });
  }
}