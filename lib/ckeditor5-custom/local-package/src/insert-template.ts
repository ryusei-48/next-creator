import { Plugin, Command } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor//ckeditor5-widget';
//import { ButtonView } from '@ckeditor/ckeditor5-ui';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

//import imageIcon from '../../../../public/static-icons/circle-chevron-right-solid.svg';

export default class InsertTemplate extends Plugin {

  static get pluginName() {
    return 'captureBox';
  }

  static get requires() {                                                    // ADDED
    return [ Widget ];
  }

  init() {

    console.log( 'InsertTemplate() got called' );

    this._defineSchema();    
    this._defineConverters();

    const editor = this.editor;
    const t = editor.t;
    const defaultTitle = t('Add image');
    const dropdownTooltip = t('Image');

    // Register UI component
    editor.ui.componentFactory.add('captureBox', locale => {

      const dropdownView = createDropdown( locale );

      dropdownView.buttonView.set({
        withText: true,
        label: "テンプレート",
        //icon: imageIcon,
        tooltip: true
      });

      // The collection of the list items.
      const items = new Collection();

      items.add( {
          type: 'button',
          model: new Model( {
            id: '1',
            label: 'アイコン付き捕捉',
            withText: true
            //icon: imageIcon
          })
      });

      items.add( {
          type: 'button',
          model: new Model( {
            id: '1',
            label: 'ラベル付き捕捉',
            withText: true
            //icon: imageIcon
          })
      });

      // Create a dropdown with a list inside the panel.
      addListToDropdown( dropdownView, items as any );

      dropdownView.on('execute', (eventInfo) => {
        const { id, label } = eventInfo.source as any;
    
        console.log(id, label);
      });

      return dropdownView;
    });
  }

  _defineSchema() {

    const schema = this.editor.model.schema;

    schema.register( 'capture_box', {
      // Behaves like a self-contained block object (e.g. a block image)
      // allowed in places where other blocks are allowed (e.g. directly in the root).
      inheritAllFrom: '$blockObject'
    } );

    schema.register( 'capture_box_icon', {
      // Cannot be split or left by the caret.
      isLimit: true,
      allowIn: 'capture_box',
      // Allow content which is allowed in blocks (i.e. text with attributes).
      allowContentOf: '$root'
    } );

    schema.register( 'capture_box_description', {
      // Cannot be split or left by the caret.
      isLimit: true,
      allowIn: 'capture_box',
      // Allow content which is allowed in the root (e.g. paragraphs).
      allowContentOf: '$root'
    });
  }

  _defineConverters() {    
    
    const conversion = this.editor.conversion;

    // <capture_box> converters
    conversion.for( 'upcast' ).elementToElement( {
      model: 'capture_box',
      view: {
          name: 'aside',
          classes: ["capture_box"]
      }
    } );
    conversion.for( 'dataDowncast' ).elementToElement( {
        model: 'capture_box',
        view: {
            name: 'aside',
            classes: ["capture_box"]
        }
    } );
    conversion.for( 'editingDowncast' ).elementToElement( {
        model: 'capture_box',
        view: ( modelElement, { writer: viewWriter } ) => {
            const section = viewWriter.createContainerElement( 'aside', { class: 'capture_box' } );

            return toWidget( section, viewWriter, { label: 'simple box widget' } );
        }
    } );

    // <capture_box_icon> converters
    conversion.for( 'upcast' ).elementToElement( {
        model: 'capture_box_icon',
        view: {
            name: 'div',
            classes: 'capture_box_icon'
        }
    } );
    conversion.for( 'dataDowncast' ).elementToElement( {
        model: 'capture_box_icon',
        view: {
            name: 'div',
            classes: 'capture_box_icon'
        }
    } );
    conversion.for( 'editingDowncast' ).elementToElement( {
        model: 'capture_box_icon',
        view: ( modelElement, { writer: viewWriter } ) => {
            // Note: You use a more specialized createEditableElement() method here.
            const icon = viewWriter.createEditableElement( 'div', { class: 'capture_box_icon' } );

            return toWidgetEditable( icon, viewWriter );
        }
    } );

    // <capture_box_description> converters
    conversion.for( 'upcast' ).elementToElement( {
        model: 'capture_box_description',
        view: {
            name: 'div',
            classes: 'capture_box_description'
        }
    } );
    conversion.for( 'dataDowncast' ).elementToElement( {
        model: 'capture_box_description',
        view: {
            name: 'div',
            classes: 'capture_box_description'
        }
    } );
    conversion.for( 'editingDowncast' ).elementToElement( {
        model: 'capture_box_description',
        view: ( modelElement, { writer: viewWriter } ) => {
            // Note: You use a more specialized createEditableElement() method here.
            const div = viewWriter.createEditableElement( 'div', { class: 'capture_box_description' } );

            return toWidgetEditable( div, viewWriter );
        }
    } );
  }
}