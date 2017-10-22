// @flow
import * as React from 'react';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import List from '@ckeditor/ckeditor5-list/src/list';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Link from '@ckeditor/ckeditor5-link/src/link';

import EditorCore, { type ChangeOpts } from './EditorCore';

type Props = {
  value: string,
  onChange: (value: string, opts: ChangeOpts) => mixed,
  toolbar: Array<string>,
  plugins: Array<any>,
};

export default class CKClassicBasic extends React.Component<Props> {
  static defaultProps = {
    toolbar: ['bold', 'italic', 'link', 'numberedList', 'bulletedList', 'blockQuote', 'headings'],
    plugins: [Essentials, Paragraph, Bold, Italic, List, Heading, Autoformat, BlockQuote, Link],
  };

  editor: Object
  editorPromise: Promise<Object>
  public: {
    editor: ?Object,
    editorPromise: Promise<Object>,
  }

  componentDidMount() {
    this.public.editorPromise.then((editor) => {
      this.editor = editor;
    });
  }

  render() {
    return (
      <EditorCore
        editorClass={ClassicEditor}
        toolbar={this.props.toolbar}
        plugins={this.props.plugins}
        ref={(inst: ?EditorCore) => {
          if (inst) {
            this.public = inst.public;
          }
        }}
        value={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}
