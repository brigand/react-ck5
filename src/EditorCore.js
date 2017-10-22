// @flow
import * as React from 'react';

export type ChangeOpts = {
  isInitial: boolean,
};

type Props = {
  value: string,
  onChange: (value: string, opts: ChangeOpts) => mixed,
  plugins: Array<any>,
  toolbar: Array<any>,
  editorClass: typeof Object,
  children?: ?React.Node,
};

export default class CKEditorCore extends React.Component<Props> {
  editor: Object
  el: ?HTMLElement
  el = null;
  public: {
    editor: ?Object,
    editorPromise: Promise<Object>,
  }

  editorPromiseResolve: (value: Object) => mixed;
  editorPromiseReject: (value: Object) => mixed;

  constructor(props: Props) {
    super(props);
    this.public = {
      editor: null,
      editorPromise: new Promise((resolve, reject) => {
        this.editorPromiseResolve = resolve;
        this.editorPromiseReject = reject;
      }),
    };
  }

  getPlugins() {
    return this.props.plugins;
  }

  getToolbar() {
    return this.props.toolbar;
  }

  ignoreUpdatesUntil = 0;

  componentDidMount() {
    if (!this.el) return;

    this.props.editorClass.create(this.el, {
      plugins: this.getPlugins(),
      toolbar: this.getToolbar(),
    })
      .then((editor) => {
        this.editor = editor;
        this.public.editor = editor;
        this.initEditor();
        this.editorPromiseResolve(editor);
        return editor;
      })
      .catch((err) => {
        console.error(`Component CKClassicBasic failed to initialize`, err);
        this.editorPromiseReject(err);
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
        {this.props.children}
        <div>
          <div ref={(el: ?HTMLElement) => { this.el = el; }} />
        </div>
      </div>
    );
  }
}
