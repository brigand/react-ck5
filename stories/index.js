import React from 'react';
import { update } from 'object-path-immutable';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import Btn from './Btn';
import FullCustomExample from './FullCustomExample.story';
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
          <hr />
          <span>Generic actions: </span>
          <Btn
            onClick={() => this.setState({
              x: `<p>${Math.random().toString().slice(2).replace(/^(.{3})(.{3})/g, '$1<strong>$2</strong>')}</p>`,
            })}
          >
            Random value
          </Btn>
          <Btn
            onMouseDown={e => e.preventDefault()}
            onClick={() => {
              this.setState(s => update(s, 'editorState.bold.value', value => !value));
            }}
          >
            Toggle Bold
          </Btn>
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

const SCClassicBasic1 = makeEditorWrapper(ClassicBasic, '<p><i>Hello</i>, <strong>World</strong>!</p>');
storiesOf('ClassicBasic')
  .add('Normal controlled', () => <SCClassicBasic1 />);

const CustomEditor1 = makeEditorWrapper(CustomEditor, '<p><i>Hello</i>, <strong>World</strong>!</p>');
storiesOf('CustomEditor')
  .add('Basic', () => (
    <CustomEditor1>
      My Editor
    </CustomEditor1>
  ));

storiesOf('FullCustomEditor')
  .add('Main', () => <FullCustomExample />);
