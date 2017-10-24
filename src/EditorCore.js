// @flow
import * as React from 'react';
import equals from 'equals';
import * as t from './types';

export type ChangeOpts = {
  isInitial: boolean,
};

type EditorState = {
  bold: boolean,
  italic: boolean,
  ul: boolean,
  ol: boolean,
  blockquote: boolean,
  link: boolean,
  mainType: 'paragraph' | 'h1' | 'h2' | 'h3',
};

type DynamicEditorState = {[key: string]: any} | EditorState;

type EditorConfig = {
  plugins: Array<any>,
  toolbar: Array<string>,
  editorClass: typeof Object,
  decorateEditorState?: (state: EditorState, editor: t.Editor) => DynamicEditorState,
};

export type EditorCoreProps = {
  value: string,
  onChange: (value: string, opts: ChangeOpts) => mixed,
  config: EditorConfig,
  // $FlowFixMe
  editorState: ?DynamicEditorState,
  onStateChange?: (state: DynamicEditorState) => mixed,
  children?: ?React.Node,
};

export default class CKEditorCore extends React.Component<EditorCoreProps> {
  editor: Object
  el: ?HTMLElement
  el = null;
  public: {
    editor: ?Object,
    editorPromise: Promise<Object>,
  }

  // slight perf boost by only defining it once
  editorElement = (
    <div>
      <div ref={(el: ?HTMLElement) => { this.el = el; }} />
    </div>
  );

  editorPromiseResolve: (value: Object) => mixed;
  editorPromiseReject: (value: Object) => mixed;

  constructor(props: EditorCoreProps) {
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
    return this.props.config.plugins;
  }

  getToolbar() {
    return this.props.config.toolbar;
  }

  ignoreUpdatesUntil = 0;

  bindCommands() {
    for (const commandName of this.editor.commands.names()) {
      const command = this.editor.commands.get(commandName);
      command.on('change:isEnabled', () => this.maybeDispatchEditorStateUpdate());
      command.on('change:value', () => this.maybeDispatchEditorStateUpdate());
    }
  }

  getEditorState(): DynamicEditorState {
    let state: DynamicEditorState = {};
    for (const commandName of this.editor.commands.names()) {
      const command = this.editor.commands.get(commandName);
      state[commandName] = { value: command.value, isEnabled: command.isEnabled };
    }
    if (this.props.config.decorateEditorState) {
      state = this.props.config.decorateEditorState(state, this.editor) || state;
    }
    return state;
  }

  updateEditorState(s1: ?DynamicEditorState, s2: ?DynamicEditorState) {
    if (!s1 || !s2) return;
    const changed: Array<string> = [];
    Object.keys(s1).forEach((key) => {
      // $FlowFixMe
      if (s1[key] !== s2[key]) changed.push(key);
    });
    Object.keys(s2).forEach((key) => {
      // $FlowFixMe
      if (s1[key] !== s2[key] && changed.indexOf(key) === -1) changed.push(key);
    });

    changed.forEach((key) => {
      // $FlowFixMe
      const data = s2[key];
      const command = this.editor.commands.get(key);
      if (command) {
        if (data.value != null && data.value !== command.value) {
          command.execute({ forceValue: data.value });
        }
        if (data.isEnabled != null && data.isEnabled !== command.isEnabled) {
          command.set('isEnabled', !!data.isEnabled);
        }
      }
    });
  }

  maybeDispatchEditorStateUpdate() {
    const currentState = this.getEditorState();
    const hasPropsState = !!this.props.editorState;
    const stateControlled = hasPropsState || !!this.props.onStateChange;
    if (stateControlled && this.props.onStateChange && !equals(currentState, this.props.editorState)) {
      if (this.props.onStateChange) {
        this.props.onStateChange(currentState);
      }
    }
  }

  componentDidMount() {
    if (!this.el) return;

    console.log(this.props);
    this.props.config.editorClass.create(this.el, {
      plugins: this.getPlugins(),
      toolbar: this.getToolbar(),
    })
      .then((editor) => {
        this.editor = editor;
        this.public.editor = editor;
        this.initEditor();
        this.bindCommands();
        this.editorPromiseResolve(editor);
        this.maybeDispatchEditorStateUpdate();
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

  componentDidUpdate(prevProps: EditorCoreProps) {
    if (prevProps.value !== this.props.value) {
      const current = this.editor.getData();
      if (current !== this.props.value) {
        this.ignoreUpdatesUntil = Date.now() + 15;
        this.editor.setData(this.props.value);
      }
    }
    if (prevProps.editorState !== this.props.editorState) {
      this.updateEditorState(prevProps.editorState, this.props.editorState);
    }
  }

  componentWillUnmount() {
    if (!this.editor) return;

    this.editor.destroy();

    // clean up in case there are any refs holding onto this component
    // $FlowFixMe
    this.editor = null;
    // $FlowFixMe
    this.public.editor = null;
    // $FlowFixMe
    this.public.editorPromise = null;
  }

  render() {
    const { editorElement } = this;
    if (typeof this.props.children === 'function') {
      return this.props.children({
        editorElement,
      });
    }
    return (
      <div>
        {this.props.children}
        {editorElement}
      </div>
    );
  }
}
