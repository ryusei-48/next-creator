import { Plugin, type Editor } from 'ckeditor5/src/core';

export default class InsertMedia extends Plugin {
  init(): void;
}

export declare interface InsertMediaConfig {
  mediaSelectModal: () => void;
}