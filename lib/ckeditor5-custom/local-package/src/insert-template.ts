import { Plugin, Command } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor//ckeditor5-widget';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class InsertTemplate extends Plugin {

  init() {

    console.log( 'InsertTemplate() got called' );

    this._defineSchema();    
    this._defineConverters();
  }

  _defineSchema() {

    const schema = this.editor.model.schema;

    schema.register( 'simpleBox', {
      // Behaves like a self-contained block object (e.g. a block image)
      // allowed in places where other blocks are allowed (e.g. directly in the root).
      inheritAllFrom: '$blockObject'
    } );

    schema.register( 'simpleBoxTitle', {
      // Cannot be split or left by the caret.
      isLimit: true,
      allowIn: 'simpleBox',
      // Allow content which is allowed in blocks (i.e. text with attributes).
      allowContentOf: '$block'
    } );

    schema.register( 'simpleBoxDescription', {
      // Cannot be split or left by the caret.
      isLimit: true,
      allowIn: 'simpleBox',
      // Allow content which is allowed in the root (e.g. paragraphs).
      allowContentOf: '$root'
    });
  }

  _defineConverters() {    
    
    const conversion = this.editor.conversion;

    conversion.elementToElement( {
      model: 'simpleBox',
      view: {
        name: 'section',
        classes: 'simple-box'
      }
    });

    conversion.elementToElement( {
      model: 'simpleBoxTitle',
      view: {
        name: 'h1',
        classes: 'simple-box-title'
      }
    });

    conversion.elementToElement( {
      model: 'simpleBoxDescription',
      view: {
        name: 'div',
        classes: 'simple-box-description'
      }
    });
  }
}