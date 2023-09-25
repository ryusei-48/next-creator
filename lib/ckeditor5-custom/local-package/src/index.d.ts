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

export { insertMedia, insertMediaConfig }