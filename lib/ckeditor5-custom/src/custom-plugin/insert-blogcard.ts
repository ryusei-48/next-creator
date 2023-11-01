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
      allowIn: 'previewLink',
      //allowContentOf: '$root'
    });

    schema.register( 'thumbnail', {
      isLimit: true,
      allowIn: 'preview',
      //allowContentOf: '$root'
    });

    schema.register( 'imgWrap', {
      isLimit: true,
      allowIn: 'thumbnail',
      //allowContentOf: 'imageBlock'
    });

    schema.register( 'image', {
      isLimit: true,
      allowIn: ['imgWrap', "domainText"], allowAttributes: ["class", "src", "loading", "alt"]
      //allowContentOf: 'imageBlock'
    });

    schema.register( 'domain', {
      isLimit: true,
      allowIn: 'thumbnail'
      //allowContentOf: 'imageBlock'
    });

    schema.register( 'domainText', {
      isLimit: true,
      allowIn: 'domain'
      //allowContentOf: 'imageBlock'
    });

    schema.register( 'details', {
      isLimit: true,
      allowIn: 'preview',
      //allowContentOf: '$root'
    });

    schema.register( 'title', {
      isLimit: true,
      allowIn: 'details',
      allowContentOf: '$block'
    });

    schema.register( 'description', {
      isLimit: true,
      allowIn: 'details',
      allowContentOf: '$block'
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
          return toWidget( section, viewWriter, { label: 'Blog Card' } );
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
        return viewWriter.createContainerElement('a', {
          href, target: '_blank', class: 'preview-link'
        });
      }
    });

    conversion.for( 'editingDowncast' ).elementToElement( {
      model: { name: 'previewLink', attributes: ['data-href'] },
      view: ( modelElement, { writer: viewWriter } ) => {
        const section = viewWriter.createContainerElement( 'div', {
          class: 'preview-link', 'data-href': modelElement.getAttribute('data-href')
        });
        return toWidget( section, viewWriter, { label: 'previewLink', hasSelectionHandle: false } );
      }
    });

    conversion.for( 'upcast' ).elementToElement( {
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
          return toWidget( section, viewWriter, { label: 'preview', hasSelectionHandle: false } );
      }
    });

    conversion.for( 'upcast' ).elementToElement( {
      model: 'thumbnail',
      view: { name: 'div', classes: ["thumbnail"] }
    });

    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'thumbnail',
      view: { name: 'div', classes: ["thumbnail"]}
    });

    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'thumbnail',
      view: ( modelElement, { writer: viewWriter } ) => {
          const section = viewWriter.createContainerElement( 'div', { class: 'thumbnail' } );
          return toWidget( section, viewWriter, { label: 'thumbnail', hasSelectionHandle: false } );
      }
    });

    conversion.for( 'upcast' ).elementToElement( {
      model: 'imgWrap',
      view: { name: 'div', classes: ["img-wrap"] }
    });

    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'imgWrap',
      view: { name: 'div', classes: ["img-wrap"]}
    });

    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'imgWrap',
      view: ( modelElement, { writer: viewWriter } ) => {
          const section = viewWriter.createContainerElement( 'div', { class: 'img-wrap' } );
          return toWidget( section, viewWriter, { label: 'image wrapper', hasSelectionHandle: false } );
      }
    });

    conversion.for( 'upcast' ).elementToElement( {
      model: 'image', view: { name: 'img' }
    });

    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'image', view: { name: 'img' }
    });

    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'image',
      view: ( modelElement, { writer: viewWriter } ) => {
        const className = modelElement.getAttribute('class') as string | undefined;
        const section = viewWriter.createContainerElement( 'img', {
          src: modelElement.getAttribute('src'), loading: 'lazy',
          class: className || "", alt: modelElement.getAttribute('alt'),
        });
        return toWidget( section, viewWriter, { label: 'image', hasSelectionHandle: false  } );
      }
    });

    conversion.for( 'upcast' ).elementToElement( {
      model: 'domain',
      view: { name: 'div', classes: ["domain"] }
    });

    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'domain',
      view: { name: 'div', classes: ["domain"]}
    });

    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'domain',
      view: ( modelElement, { writer: viewWriter } ) => {
          const section = viewWriter.createContainerElement( 'div', { class: 'domain' } );
          return toWidget( section, viewWriter, { label: 'domain', hasSelectionHandle: false } );
      }
    });

    conversion.for( 'upcast' ).elementToElement( {
      model: 'domainText',
      view: { name: 'span', classes: ["domain-text"] }
    });

    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'domainText',
      view: { name: 'span', classes: ["domain-text"]}
    });

    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'domainText',
      view: ( modelElement, { writer: viewWriter } ) => {
          const section = viewWriter.createContainerElement( 'span', { class: 'domain-text' } );
          return toWidget( section, viewWriter, { label: 'domain text', hasSelectionHandle: false } );
      }
    });

    conversion.for( 'upcast' ).elementToElement( {
      model: 'details',
      view: { name: 'div', classes: ["details"] }
    });

    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'details',
      view: { name: 'div', classes: ["details"]}
    });

    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'details',
      view: ( modelElement, { writer: viewWriter } ) => {
          const section = viewWriter.createContainerElement( 'div', { class: 'details' } );
          return toWidget( section, viewWriter, { label: 'details', hasSelectionHandle: false } );
      }
    });

    conversion.for( 'upcast' ).elementToElement( {
      model: 'title',
      view: { name: 'span', classes: ["title"] }
    });

    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'title',
      view: { name: 'span', classes: ["title"]}
    });

    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'title',
      view: ( modelElement, { writer: viewWriter } ) => {
          const section = viewWriter.createEditableElement( 'span', { class: 'title' } );
          return toWidgetEditable( section, viewWriter, { label: 'title' } );
      }
    });

    conversion.for( 'upcast' ).elementToElement( {
      model: 'description',
      view: { name: 'span', classes: ["description"] }
    });

    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'description',
      view: { name: 'span', classes: ["description"]}
    });

    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'description',
      view: ( modelElement, { writer: viewWriter } ) => {
          const section = viewWriter.createEditableElement( 'span', { class: 'description' } );
          return toWidgetEditable( section, viewWriter, { label: 'description' } );
      }
    });
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
        
        this.editor.model.change((writer) => {
          const blogCard = writer.createElement('blogCard', { class: 'insert-blog-card' });
          const previewLink = writer.createElement('previewLink', {
            class: 'preview-link', 'data-href': previewA.href
          });
          const preview = writer.createElement('preview', { class: 'preview' });
          const thumbnail = writer.createElement('thumbnail', { class: 'thumbnail' });
          const imgWrap = writer.createElement('imgWrap', { class: 'img-wrap' });
          const image = writer.createElement('image', {
            src: previewThumbnail.src, alt: 'thumbnail'
          });
          const domain = writer.createElement('domain', { class: 'domain' });
          const domainText = writer.createElement('domainText', { class: 'domain-text' });
          const favicon = writer.createElement('image', {
            src: previewIcon.src, alt: 'icon'
          });
          const details = writer.createElement('details', { class: 'details' });
          const title = writer.createElement('title', { class: 'title' });
          const description = writer.createElement('description', { class: 'description' });
          writer.append( previewLink, blogCard );
          writer.append( preview, previewLink );
          writer.append( thumbnail, preview );
          writer.append( imgWrap, thumbnail );
          writer.append( details, preview );
          writer.append( domain, thumbnail );
          writer.append( favicon, domain );
          writer.append( domainText, domain );
          writer.append( title, details );
          writer.append( description, details );
          writer.insert( image, imgWrap );
          writer.insertText( previewDomain.textContent!, domainText );
          writer.insertText( previewTitle.textContent!, title );
          writer.insertText( previewDescription.textContent!, description );
          this.editor.model.insertObject( blogCard );
        });

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