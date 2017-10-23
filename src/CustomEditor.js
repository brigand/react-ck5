// @flow
import * as React from 'react';

import EditorCore, { type EditorCoreProps } from './EditorCore';
import makeEditorClass from './makeEditorClass';
import * as t from './types';
// import * as Els from './elements';

type Props = {
  ...EditorCoreProps,
  children?: ?React.Node,
};

type State = {
  loaded: boolean,
}

export default class CustomEditor extends React.Component<Props, State> {
  editorClass: typeof t.Editor;
  editor: ?t.Editor;
  editorPromise: ?Promise<t.Editor>;
  public: {
    editor: ?t.Editor,
    editorPromise: Promise<t.Editor>,
  };

  editorClass = makeEditorClass();

  componentDidMount() {
    if (!this.editorPromise) return;
    this.editorPromise.then((editor) => {
      this.editor = editor;
    });
  }

  render() {
    const { children, ...props } = this.props;
    return (
      <div>
        {children}
        <EditorCore
          ref={(el: ?EditorCore) => {
            if (!el) return;

            this.public = el.public;
            this.editor = el.public.editor;
            this.editorPromise = el.public.editorPromise;
          }}
          {...props}
          config={{
            editorClass: this.editorClass,
            plugins: this.editorClass.basePlugins,
            toolbar: [],
            ...props.config,
          }}
        />
      </div>
    );
  }
}
