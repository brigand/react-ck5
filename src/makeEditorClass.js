// @flow

import StandardEditor from '@ckeditor/ckeditor5-core/src/editor/standardeditor';
import InlineEditableUIView from '@ckeditor/ckeditor5-ui/src/editableui/inline/inlineeditableuiview';
import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';
import ElementReplacer from '@ckeditor/ckeditor5-utils/src/elementreplacer';

// Basic features that every editor should enable.
import Clipboard from '@ckeditor/ckeditor5-clipboard/src/clipboard';
import Enter from '@ckeditor/ckeditor5-enter/src/enter';
import Typing from '@ckeditor/ckeditor5-typing/src/typing';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import UndoEngine from '@ckeditor/ckeditor5-undo/src/undoengine';

// Basic features to be associated with the edited content.
import BoldEngine from '@ckeditor/ckeditor5-basic-styles/src/boldengine';
import ItalicEngine from '@ckeditor/ckeditor5-basic-styles/src/italicengine';
import UnderlineEngine from '@ckeditor/ckeditor5-basic-styles/src/underlineengine';
import HeadingEngine from '@ckeditor/ckeditor5-heading/src/headingengine';

export default function makeEditorClass() {
  class CustomEditor extends StandardEditor {
    // eslint-disable-next-line max-len
    static basePlugins = [Clipboard, Enter, Typing, Paragraph, BoldEngine, ItalicEngine, UnderlineEngine, HeadingEngine, UndoEngine];

    constructor(element: HTMLElement, config: Object) {
      super(element, config);

      // Create the ("main") root element of the model tree.
      this.document.createRoot();

      // Use the HTML data processor in this editor.
      this.data.processor = new HtmlDataProcessor();

      // This editor uses a single editable view in DOM.
      this.editable = new InlineEditableUIView(this.locale);

      // A helper to easily replace the editor#element with editor.editable#element.
      this._elementReplacer = new ElementReplacer();
    }

    destroy() {
      // When destroyed, editor sets the output of editor#getData() into editor#element...
      this.updateEditorElement();

      // ...and restores editor#element.
      this._elementReplacer.restore();

      return super.destroy();
    }

    static create(element, config) {
      return new Promise((resolve) => {
        const editor = new this(element, config);
        const { editable } = editor;

        resolve(editor.initPlugins()
          // Initialize the editable view in DOM first.
          .then(() => editable.init())
          // Replace the editor#element with editor.editable#element.
          .then(() => editor._elementReplacer.replace(element, editable.element))
          // Handle the UI of the editor.
          .then(() => {
            // Create an editing root in the editing layer. It will correspond to the
            // document root created in the constructor().
            const editingRoot = editor.editing.createRoot('div');

            // Bind the basic attributes of the editable in DOM with the editing layer.
            editable.bind('isReadOnly').to(editingRoot);
            editable.bind('isFocused').to(editor.editing.view);
            editable.name = editingRoot.rootName;

            // Setup the external Bootstrap UI so it works with the editor.
            // Check out the code samples below to learn more.
            // setupButtons(editor);
            // setupHeadingDropdown(editor);

            // Tell the world that the UI of the editor is ready to use.
            editor.fire('uiReady');
          })
          // Bind the editor editing layer to the editable in DOM.
          .then(() => editor.editing.view.attachDomRoot(editable.element))
          .then(() => editor.loadDataFromEditorElement())
          // Fire the events that announce that the editor is complete and ready to use.
          .then(() => {
            editor.fire('dataReady');
            editor.fire('ready');
          })
          .then(() => editor));
      });
    }
  }

  return CustomEditor;
}
