import { Plugin } from '@ckeditor/ckeditor5-core';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
//import icon from './template.svg';

export default class insertMedia extends Plugin {

  init() {

    const config = this.editor.config.get('insertMedia');
    
    this.editor.ui.componentFactory.add('insertMedia', (local) => {
      const view = new ButtonView( local );

      view.set('label', 'メディア選択');
      view.set('tooltip', true);
      view.set('isEnabled', true);
      view.set('isVisible', true);
      view.set('isToggleable', true);
      //view.set('icon', icon);
      view.set('withText', true)
      //view.set('keystroke', '')

      view.on('execute', async () => {

        const urls = await config?.callback();

        let defaultUrl: String | null = null;
        let srcset: {[key: string]: string} | null = null;

        if ( urls && "url" in urls ) {
          defaultUrl = urls.url;
        }else if ( urls && "urls" in urls ) {
          defaultUrl = urls.urls.default;
        }

        if ( defaultUrl || ( defaultUrl && srcset ) ) {
          this.editor.model.change( writer => {
            const insertPosition = this.editor.model.document.selection.getFirstPosition();
            const imageElement = writer.createElement('imageBlock', {
              src: defaultUrl, srcset: srcset && srcset
              //srcset: {"data":"https://33333.cdn.cke-cs.com/rc1DFuFpHqcR3Mah6y0e/images/81c7dd4a263b4719ce5761fce9b4c1024b1a12a7bce1ad90.jpg/w_115 115w, https://33333.cdn.cke-cs.com/rc1DFuFpHqcR3Mah6y0e/images/81c7dd4a263b4719ce5761fce9b4c1024b1a12a7bce1ad90.jpg/w_195 195w, https://33333.cdn.cke-cs.com/rc1DFuFpHqcR3Mah6y0e/images/81c7dd4a263b4719ce5761fce9b4c1024b1a12a7bce1ad90.jpg/w_275 275w","width":275}
            });
            writer.insert( imageElement, insertPosition! );
          });
        }        
      });

      return view;
    });

    //console.log('myCustomConfigValue:', config?.callback());
  }
}