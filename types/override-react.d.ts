export declare module 'react' {
  interface DOMAttributes<T> {
    inert?: '' | undefined;
  }
}

export declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      inert?: '' | undefined;
    }
  }
}

export declare module '@ckeditor/ckeditor5-core' {

  interface EditorConfig {
    insertMedia: { mediaSelectModal: () => void }
  }
}