// @flow
import * as React from 'react';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import List from '@ckeditor/ckeditor5-list/src/list';

type ChangeOpts = {
  isInitial: boolean,
};

type Props = {
  value: string,
  onChange: (value: string, opts: ChangeOpts) => mixed,
  buttonTypes: Array<string>,
};

export default class CKClassicBasic extends React.Component<Props> {
  static defaultToolbar = ['bold', 'italic', 'numberedList', 'bulletedList'];

  editor: Object
  el: ?HTMLElement
  el = null;
  editorPromise: Promise<Object>
  ignoreUpdatesUntil = 0;

  componentDidMount() {
    if (!this.el) return;

    this.editorPromise = ClassicEditor.create(this.el, {
      plugins: [Essentials, Paragraph, Bold, Italic, List],
      toolbar: this.props.buttonTypes || CKClassicBasic.defaultToolbar,
    })
      .then((editor) => {
        this.editor = editor;
        window.top.editor = editor;
        this.initEditor();
        return editor;
      })
      .catch((err) => {
        console.error(`Component CKClassicBasic failed to initialize`, err);
      });
  }

  initEditor() {
    this.editor.setData(this.props.value);
    const initialData = this.editor.getData();
    if (initialData !== this.props.value) {
      if (this.ignoreUpdatesUntil > Date.now()) return;
      this.props.onChange(initialData, { isInitial: true });
    }
    this.editor.document.on('change', () => {
      console.log(this.editor.data);
      this.props.onChange(this.editor.getData(), { isInitial: false });
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.value !== this.props.value) {
      const current = this.editor.getData();
      if (current !== this.props.value) {
        this.ignoreUpdatesUntil = Date.now() + 15;
        this.editor.setData(this.props.value);
      }
    }
  }

  render() {
    return (
      <div>
        <div ref={(el: ?HTMLElement) => { this.el = el; }} />
      </div>
    );
  }
}
