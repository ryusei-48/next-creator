/**
 * @module insert-media
 */

import { Plugin, type Editor } from 'ckeditor5/src/core';

export default class InsertMedia extends Plugin {
  init(): void;
}

export interface InsertMediaConfig {
  mediaSelectModal: () => void;
}

export declare module '@ckeditor/ckeditor5-core' {
  interface PluginsMap {
      ['insert-media']: InsertMedia;
  }

  interface EditorConfig {
      insertMedia?: InsertMediaConfig;
  }
}

export declare global {
  type MediaSelectEvent = { src: string, srcset: string, width: string }
  interface WindowEventMap {
    "media-selected": CustomEvent<MediaSelectEvent | null>;
  }
}

export { InsertMedia, InsertMediaConfig }