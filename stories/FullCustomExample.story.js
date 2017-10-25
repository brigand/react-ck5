// @flow
import * as React from 'react';
import { update } from 'object-path-immutable';

import Btn from './Btn';
import CustomEditor from '../src/CustomEditor';
import * as ec from '../src/EditorCore';

import './FullCustomExample.story.scss';

type Props = {

}

type State = {
  value: string,
  editorState: ?ec.DynamicEditorState,
}

export default
class FullCustomExample extends React.Component<Props, State> {
  state = {
    value: '',
    editorState: null,
  }

  handleChange(value: string) {
    this.setState({ value });
  }

  handleStateChange(editorState: ec.DynamicEditorState) {
    this.setState({ editorState });
  }

  toggleEs(path: string) {
    this.setState(s => update(s, `editorState.${path}`, value => !value));
  }

  render() {
    const containerProps = { className: 'FCE__Container' };
    const innerProps = { className: 'FCE__Inner' };
    const es = this.state.editorState;
    return (
      <div className="FCE">
        <CustomEditor
          containerProps={containerProps}
          innerProps={innerProps}
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
          editorState={this.state.editorState}
          onStateChange={this.handleStateChange.bind(this)}
        >
          <div className="FCE__Toolbar">
            <Btn
              active={es && es.bold.value}
              onMouseDown={e => e.preventDefault()}
              onClick={() => this.toggleEs('bold.value')}
            >
              B
            </Btn>
          </div>
        </CustomEditor>
      </div>
    );
  }
}
