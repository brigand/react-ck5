import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import ClassicBasic from '../src/ClassicBasic';
import CustomEditor from '../src/CustomEditor';
import * as Ck5 from '../src/elements';

const makeEditorWrapper = (C, initial, value = 'value', onChange = 'onChange') => (
  class EditorWrapper extends React.Component {
    constructor(props) { super(props); this.state = { x: initial }; }
    render() {
      const ref = (inst) => {
        if (!inst) {
          window.top.editor = 'removed due to unmount';
          return;
        }
        window.top.editor = inst.public.editorPromise.then((editor) => {
          window.top.editor = editor;
        });
      };
      // eslint-disable-next-line max-len
      const el = <C ref={ref} {...{ [value]: this.state.x, [onChange]: x => this.setState({ x }) }} {...this.props} />;
      return (
        <div>
          {el}
          <pre>
            {typeof this.state.x === 'string'
              ? this.state.x
              : JSON.stringify(this.state.x, null, 2)
            }
          </pre>
          <button
            onClick={() => this.setState({
              x: `<p>${Math.random().toString().slice(2).replace(/^(.{3})(.{3})/g, '$1<strong>$2</strong>')}</p>`,
            })}
          >
            Random value
          </button>
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
      <Ck5.Toolbar>
        <Ck5.Button command="bold">
          {({ active }) => (
            <button style={active ? { background: 'black', color: 'white' } : null}>
              Bold
            </button>
          )}
        </Ck5.Button>
        <span style={{ display: 'inline-block', marginRight: '0.4em' }} />
        <Ck5.Button command="italic">
          {({ active }) => (
            <button style={active ? { background: 'black', color: 'white' } : null}>
              Italics
            </button>
          )}
        </Ck5.Button>
      </Ck5.Toolbar>
    </CustomEditor1>
  ));
