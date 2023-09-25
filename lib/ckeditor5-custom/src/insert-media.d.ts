import { Plugin, type Editor } from 'ckeditor5/src/core';

declare module 'insert-media' {
  interface EditorConfig {
    insertMedia?: string;
  }
}