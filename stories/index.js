import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import ClassicBasic from '../src/ClassicBasic';

const stateContainer = (C, initial, value = 'value', onChange = 'onChange') => (
  class StateContainer extends React.Component {
    constructor(props) { super(props); this.state = { x: initial }; }
    render() {
      // eslint-disable-next-line max-len
      const el = <C {...{ [value]: this.state.x, [onChange]: x => this.setState({ x }) }} {...this.props} />;
      return (
        <div>
          {el}
          <pre>
            {typeof this.state.x === 'string'
              ? this.state.x
              : JSON.stringify(this.state.x, null, 2)
            }
          </pre>
        </div>
      );
    }
  }
);

storiesOf('ClassicBasic')
  .add('default', () => {
    const C = stateContainer(ClassicBasic, 'test');
    return <C />;
  });
