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

        config?.mediaSelectModal();

        const mediaDitail = await new Promise<MediaSelectEvent | null>((resolve) => {

          const handleMediaDitail = (e: CustomEvent<MediaSelectEvent | null>) => {
            //console.log( 'Custom event: ', e.detail );
            window.removeEventListener('media-selected', handleMediaDitail );
            if ( e.detail ) {
              resolve({ src: e.detail?.src, srcset: e.detail?.srcset, width: e.detail.width });
            }else resolve( null );
          }

          window.addEventListener('media-selected', handleMediaDitail );
        });

        if ( mediaDitail ) {
          this.editor.model.change( writer => {
            const insertPosition = this.editor.model.document.selection.getFirstPosition();
            const imageElement = writer.createElement('imageBlock', {
              src: mediaDitail.src, srcset: { data: mediaDitail.srcset, width: mediaDitail.width, sizes: '100vw' }
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