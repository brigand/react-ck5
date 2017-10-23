// @flow
import * as React from 'react';
import './Btn.scss';

type Props = {
  children: React.Node,
}

export default
class Btn extends React.Component<Props> {
  render() {
    return (
      <button {...this.props} className="DemoButton" />
    );
  }
}
