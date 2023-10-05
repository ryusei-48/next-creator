import { Plugin, type Editor } from 'ckeditor5/src/core';

export default class insertMedia extends Plugin {
  init(): void;
}

export declare interface insertMediaConfig {
  mediaSelectModal: () => void;
}