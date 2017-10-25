// @flow
import * as React from 'react';
import './Btn.scss';

type Props = {
  children: React.Node,
  active?: boolean,
}

export default
class Btn extends React.Component<Props> {
  render() {
    const { active, ...props } = this.props;
    let className = 'DemoButton';
    if (this.props.active) {
      className = `${className} DemoButton--active`;
    }
    return (
      <button {...props} className={className} />
    );
  }
}
