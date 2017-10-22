import * as React from 'react';

type ToolbarProps = {
  children: React.Node,
}

export class Toolbar extends React.Component<ToolbarProps> {
  static needsEditor = true;
  render() {
    return <div>{this.props.children}</div>;
  }
}

type ButtonProps = {
  children: React.Node,
  command: string,
  setRenderCbProps: (data: Object) => mixed,
  editor: ?Object,
}

export class Button extends React.Component<ButtonProps> {
  static needsEditor = true;
  componentDidMount() {
    const { editor } = this.props;
    if (!editor) return; // should never happen

    if (this.props.command) {
      const command = editor.commands.get(this.props.command);
      command.on('change:isEnabled', () => {
        this.props.setRenderCbProps({ disabled: !command.isEnabled });
      });
      command.on('change:value', () => {
        this.props.setRenderCbProps({ active: command.value });
      });
    }
  }

  render() {
    if (this.props.command) {
      const child = React.Children.only(this.props.children);
      return React.cloneElement(child, {
        onMouseDown: (e: React.SyntheticMouseEvent<HTMLElement>) => {
          e.preventDefault();
        },
        onClick: () => {
          this.props.editor.execute(this.props.command);
        },
      });
    }
    return this.props.children;
  }
}
