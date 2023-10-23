//import type { useFormState } from 'react-dom';

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

export declare module 'react-dom' {

  function experimental_useFormStForate<Result>(
    action: (formdata: FormData) => Promise<Result>,
    initialState: Result,
    permalink?: string,
  ): [state: Result, dispatch: () => void];
  function experimental_useFormState<Result, Data, Payload>(
    action: ( payload?: Payload, state?: Data ) => Promise<Result>,
    initialState: Result,
    permalink?: string,
  ): [state: Result, dispatch: (payload?: Payload) => void];
}