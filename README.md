
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

## CustomEditor

Smaller bundle size, more customization options, fully controlled editor state.

TODO: write docs once api stabilizes.
