
The latest major iteration of CKEditor provides a class based, MVC, imperative API for creating and updating the editor.

While powerful, it doesn't fit well into a declarative React.js app.

react-ck5 provides two main apis for defining an editor:

- ClassicBasic: a basic editor with default styling and features
- CustomEditor: build your own editor, reuse components from your app

## ClassicBasic

This editor is very easy to use, and supports selecting the toolbar buttons.

```jsx
import ClassicBasic from 'react-ck5/lib/ClassicBasic';

class Editor extends React.Component {
  state = {
    html: `<p>Hello, <strong>world</strong>!</p>`,
  }
  render() {
    return (
      <ClassicBasic
        value={this.state.html}
        onChange={html => this.setState({ html })}
      />
    );
  }
}
```

You can pass a custom toolbar. This shows the default:

```jsx
<ClassicBasic
  toolbar={['bold', 'italic', 'link', 'numberedList', 'bulletedList', 'blockQuote', 'headings']]
```

`value` must be a string, but it can be the empty string.

Once the editor is loaded with the initial value if the editor interprets the value differently from the string you passed, `onChange` will be called - even before user interaction. In this special case, the second argument to `onChange` will be an object with the property `isIntial: true`.

```jsx
<ClassicBasic
  value={this.state.html}
  onChange={(html, event) => {
    if (event.isInitial) {
      // ignore the initial update
      return;
    }
    this.setState({ html });
  }}
```

It's recommended that you don't ignore the initial update, however you may wish to handle it specially, e.g. not setting a 'dirty' flag in state for this update.

`onChange` always receives an event object as the second argument, however currently it only has the one property mentioned above which will be `true` or `false`.

## CustomEditor

Smaller bundle size, more customization options, fully controlled editor state.

TODO: write docs once api stabilizes.

