import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import ClassicBasic from '../src/ClassicBasic';

const stateContainer = (C, initial, value = 'value', onChange = 'onChange') => (
  class StateContainer extends React.Component {
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

const SCClassicBasic1 = stateContainer(ClassicBasic, 'test');
storiesOf('ClassicBasic')
  .add('Normal controlled', () => <SCClassicBasic1 />);
