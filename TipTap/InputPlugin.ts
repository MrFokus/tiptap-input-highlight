import { Extension } from "@tiptap/core";

const NULLPTR = "\u200B";

export default Extension.create({
  onSelectionUpdate({ editor }) {
    const input = getCurrentInput(editor);
    if (!input) return;

    const { selection } = editor.state;
    const { $anchor } = selection;
    
    if (!input.attrs["data-textInit"]) {
      editor
        .chain()
        .insertContentAt($anchor.start(), NULLPTR)
        .updateAttributes("placeholderInput", {
          "data-textInit": NULLPTR + input.textContent + NULLPTR,
        })
        .run();
      this.storage.prevValue = NULLPTR + input.textContent + NULLPTR;
    }    
    if (!input.textContent || !input.textContent.replaceAll(NULLPTR,'')) {
      editor
        .chain()
        .deleteRange({ from: $anchor.start(), to: $anchor.end()})
        .insertContentAt($anchor.start(), input.attrs["data-textInit"])
        .setTextSelection($anchor.start() + 1)
        .run();
        this.storage.prevValue = input.textContent;
        console.log(input.textContent.split(''));
        
        addClass(editor, input, "empty");

    }
    if (input.attrs["data-textInit"] === input.textContent) {
      editor
        .chain()
        .setTextSelection($anchor.start() + 1)
        .run();
      addClass(editor, input, "empty");
    }
    if (
      input.textContent === input.attrs["data-textInit"].replaceAll(NULLPTR, "")
    ) {
      editor.commands.deleteNode("placeholderInput");
    }
  },

  onCreate({ editor }) {
    editor.view.dom.addEventListener("input", (ev) => {
      setTimeout(() => {
        const input = getCurrentInput(editor);
        if (!input) return;
        const { selection } = editor.state;
        const { $anchor } = selection;                
        if (
          input.attrs["data-textInit"] === this.storage.prevValue &&
          ev.data || !this.storage.prevValue.replaceAll(NULLPTR, "") && ev.data
        ) {          
          editor.commands.insertContentAt(
            { from: $anchor.start(), to: $anchor.end() },
            NULLPTR + ev.data + NULLPTR
          );
          editor.chain().setTextSelection(selection.from).run()
          removeClass(editor, input, "empty");
        }
        if (
          this.storage.prevValue[0] !== input.textContent[0] && input.textContent[0]!==NULLPTR
        ) {
          editor.commands.deleteNode("placeholderInput");
        }
        this.storage.prevValue = input.textContent;
      }, 0);
    });
    editor.view.dom.addEventListener("keydown", function (event) {
      const input = getCurrentInput(editor);
      const { selection } = editor.state;

      if(!input) return
      console.log(input.attrs.class.split(' ').includes('empty'),["ArrowLeft", "ArrowRight"].includes(event.key));
      
      if (input.attrs.class.split(' ').includes('empty') && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
        editor.chain().setTextSelection(selection.from).run()
        event.preventDefault();
      }
  });
  
  },
});

function getCurrentInput(editor) {
  const { selection } = editor.state;
  const { $anchor } = selection;
  const node = $anchor.node();
  return node.type.name === "placeholderInput" ? node : null;
}

function addClass(editor, node, className) {
  editor.commands.updateAttributes(node.type.name, {
    ...node.attrs,
    class: `${node.attrs.class} ${className}`.trim(),
  });
}

function removeClass(editor, node, className) {
  editor.commands.updateAttributes(node.type.name, {
    ...node.attrs,
    class: node.attrs.class
      .split(" ")
      .filter((cls) => cls !== className)
      .join(" "),
  });
}
