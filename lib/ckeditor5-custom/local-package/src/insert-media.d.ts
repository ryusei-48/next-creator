import { Plugin, type Editor } from 'ckeditor5/src/core';

export default class insertMedia extends Plugin {
  init(): void;
}

export declare interface insertMediaConfig {
  callback: () => Promise<{ url: string } | { urls: {[key: string]: string} } | null>;
}