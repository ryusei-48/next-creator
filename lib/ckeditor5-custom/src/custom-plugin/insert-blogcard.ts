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

    this._defineButtonView();
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
      `;
      const urlInput = panel.querySelector<HTMLInputElement>('input.url-input')!;

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