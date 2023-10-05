import { default as insertMedia } from './insert-media';
import type { insertMediaConfig } from "./insert-media.d";

declare module '@ckeditor/ckeditor5-core' {
  interface PluginsMap {
      ['insert-media']: insertMedia;
  }
  interface EditorConfig {
      insertMedia?: insertMediaConfig;
  }
}

export declare global {
  type MediaSelectEvent = { src: string, srcset: string, width: string }
  interface WindowEventMap {
    "media-selected": CustomEvent<MediaSelectEvent | null>;
  }
}

export { insertMedia, insertMediaConfig }