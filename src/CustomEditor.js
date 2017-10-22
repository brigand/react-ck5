// @flow
import * as React from 'react';

import EditorCore, { type ChangeOpts } from './EditorCore';
import makeEditorClass from './makeEditorClass';
// import * as Els from './elements';

type Props = {
  value: string,
  onChange: (value: string, opts: ChangeOpts) => mixed,
  children?: ?React.Node,
};

type State = {
  loaded: boolean,
  keyedState: {[_: string]: any},
}

export default class CustomEditor extends React.Component<Props, State> {
  editorClass: typeof Object
  editor: ?Object
  editorPromise: ?Promise<Object>
  public: {
    editor: ?Object,
    editorPromise: Promise<Object>,
  }

  state = {
    loaded: false,
    keyedState: {},
  }

  editorClass = makeEditorClass();

  injectProps(elements: React.Node, stackKey: string) {
    if (!elements) return elements;

    if (typeof elements === 'function') {
      const newStack = `${stackKey}/_func`;
      return this.injectProps(elements(this.state.keyedState[newStack] || {}), newStack);
    }

    const result = React.Children.map(elements, (_element, i) => {
      let element = _element;

      // handles function children which should be called with some props
      // e.g. if the current command is active
      let _newStack: ?string = null;
      if (typeof element === 'function') {
        _newStack = `${stackKey}/func:${i}`;
        element = element(this.state.keyedState[_newStack] || {});
      } else {
        let typeName = element && element.type;
        if (typeName && typeName.name) typeName = typeName.name;

        _newStack = `${stackKey}/${typeName}:${i}`;
      }
      const newStack: string = _newStack || '';

      // handles strings, null, numbers
      const type = element && element.type;
      if (!type) return element;

      const elementsCount = React.Children.count(element);

      // arrays of arrays, not sure if this really happens
      if (elementsCount > 1) {
        return this.injectProps(element, newStack);
      }

      const ownChildren = element && element.props && element.props.children;
      const props = {};
      if (element && element.type && element.type.needsEditor) {
        props.editor = this.editor;
        props.shouldRender = true;
        props.setRenderCbProps = (data) => {
          const finalKey = `${newStack}/_func`;
          const current = this.state.keyedState[finalKey];
          this.setState({
            keyedState: {
              ...this.state.keyedState,
              [finalKey]: { ...current, ...data },
            },
          });
        };
      }
      const newChildren = this.injectProps(ownChildren, newStack);
      const updated = React.cloneElement(element, props, newChildren);
      return updated;
    });

    let final = result;
    while (Array.isArray(final) && final.length <= 1) {
      ([final] = final);
    }
    return final;
  }

  renderItems() {
    const items = this.injectProps(this.props.children, '_root');
    return items;
  }

  componentDidMount() {
    if (!this.editorPromise) return;
    this.editorPromise.then((editor) => {
      this.editor = editor;
      this.setState({ loaded: true });
    });
  }

  render() {
    let items = null;
    if (this.state.loaded) items = this.renderItems();
    const { children, ...props } = this.props;
    return (
      <div>
        {items}
        <EditorCore
          ref={(el: ?EditorCore) => {
            if (!el) return;

            this.public = el.public;
            this.editor = el.public.editor;
            this.editorPromise = el.public.editorPromise;
          }}
          editorClass={this.editorClass}
          plugins={this.editorClass.basePlugins}
          toolbar={[]}
          {...props}
        />
      </div>
    );
  }
}
