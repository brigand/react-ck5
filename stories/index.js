import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import ClassicBasic from '../src/ClassicBasic';
import CustomEditor from '../src/CustomEditor';

const makeEditorWrapper = (C, initial) => (
  class EditorWrapper extends React.Component {
    constructor(props) { super(props); this.state = { x: initial, editorState: null }; }
    render() {
      const ref = (inst) => {
        if (!inst) {
          window.top.editor = 'removed due to unmount';
          return;
        }
        inst.public.editorPromise.then((editor) => {
          window.top.editor = editor;
        });
      };
      // eslint-disable-next-line max-len
      const el = (
        <C
          ref={ref}
          value={this.state.x}
          onChange={x => this.setState({ x })}
          editorState={this.state.editorState}
          onStateChange={editorState => this.setState({ editorState })}
          {...this.props}
        />
      );
      return (
        <div>
          {el}
          <button
            onClick={() => this.setState({
              x: `<p>${Math.random().toString().slice(2).replace(/^(.{3})(.{3})/g, '$1<strong>$2</strong>')}</p>`,
            })}
          >
            Random value
          </button>
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={() => {
              if (!this.state.editorState) return;
              this.setState({
                editorState: {
                  ...this.state.editorState,
                  bold: {
                    isEnabled: true,
                    value: !this.state.editorState.bold.value,
                  },
                },
              });
            }}
          >
            Toggle Bold
          </button>
          <pre>
            {typeof this.state.x === 'string'
              ? this.state.x
              : JSON.stringify(this.state.x, null, 2)
            }
          </pre>
          <pre>
            {JSON.stringify(this.state.editorState, null, 2)}
          </pre>
        </div>
      );
    }
  }
);

const SCClassicBasic1 = makeEditorWrapper(ClassicBasic, 'test');
storiesOf('ClassicBasic')
  .add('Normal controlled', () => <SCClassicBasic1 />);

const CustomEditor1 = makeEditorWrapper(CustomEditor, 'test');
storiesOf('CustomEditor')
  .add('Basic', () => (
    <CustomEditor1>
      Test Button
    </CustomEditor1>
  ));
