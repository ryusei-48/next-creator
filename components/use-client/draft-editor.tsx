"use client";
import { useState } from 'react';
import { Editor, EditorState, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

export default function MyEditor() {

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const save = () => {
    console.log( convertToRaw( editorState.getCurrentContent() ) );
  }

  return (
    <>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        placeholder='ここから本文を入力してください。'
      />
      <div><button onClick={ save }>保存</button></div>
    </>
  )
}
