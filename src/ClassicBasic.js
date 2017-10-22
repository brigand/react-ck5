// @flow
import * as React from 'react';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import List from '@ckeditor/ckeditor5-list/src/list';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';

import EditorCore from './EditorCore';

type ChangeOpts = {
  isInitial: boolean,
};

type Props = {
  value: string,
  onChange: (value: string, opts: ChangeOpts) => mixed,
  toolbar: Array<string>,
  plugins: Array<any>,
};

export default class CKClassicBasic extends React.Component<Props> {
  static defaultProps = {
    toolbar: ['bold', 'italic', 'numberedList', 'bulletedList', 'headings', 'blockQuote'],
    plugins: [Essentials, Paragraph, Bold, Italic, List, Heading, Autoformat, BlockQuote],
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
