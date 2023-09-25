import { Plugin } from '@ckeditor/ckeditor5-core';

export default class insertMedia extends Plugin {
  init() {
      // エディタの設定から 'myCustomConfigValue' の値を取得
      const config = this.editor.config.get('insertMedia');

      // 値をコンソールに表示
      console.log('myCustomConfigValue:', config);
  }
}