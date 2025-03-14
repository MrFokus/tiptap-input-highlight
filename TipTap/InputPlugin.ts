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
        .insertContentAt($anchor.end() + 1, NULLPTR)
        .updateAttributes("placeholderInput", {
          "data-textInit": NULLPTR + input.textContent + NULLPTR,
        })
        .setTextSelection($anchor.start() + 1)
        .run();
      this.storage.prevValue = NULLPTR + input.textContent + NULLPTR;
    }

    if (!input.textContent || !input.textContent.replaceAll(NULLPTR, "")) {
      editor
        .chain()
        .deleteRange({ from: $anchor.start(), to: $anchor.end() })
        .insertContentAt($anchor.start(), input.attrs["data-textInit"])
        .setTextSelection($anchor.start() + 1)
        .run();

      this.storage.prevValue = input.textContent;
      addClass(editor, input, "empty");
    }

    if (input.attrs["data-textInit"] === input.textContent) {
      editor
        .chain()
        .setTextSelection($anchor.start() + 1)
        .run();
        this.storage.prevValue = input.textContent;

      addClass(editor, input, "empty");
    }

    if (
      input.textContent === input.attrs["data-textInit"].replaceAll(NULLPTR, "")
    ) {
      editor.commands.deleteNode("placeholderInput");
    }
  },

  onCreate({ editor }) {
    editor.view.dom.addEventListener("paste", (ev) => {
      ev.preventDefault();
        const input = getCurrentInput(editor);
        if (!input) return; 
        setInput(editor,input,this.storage.prevValue, (ev.clipboardData || window.clipboardData).getData("text"))
        this.storage.prevValue = input.textContent;
    });

    editor.view.dom.addEventListener("input", (ev) => {
      setTimeout(() => {
        const input = getCurrentInput(editor);
        if (!input) return;
        setInput(editor,input,this.storage.prevValue,ev.data)
        this.storage.prevValue = input.textContent;
      }, 0);
    });
    editor.view.dom.addEventListener("keydown", function (event) {
      const input = getCurrentInput(editor);
      const { selection } = editor.state;

      if (!input) return;
      if (
        input.attrs.class.split(" ").includes("empty") &&
        ["ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        if (event.key == "ArrowLeft") {
          editor
            .chain()
            .setTextSelection(selection.$anchor.start() - 1)
            .run();
        }
        if (event.key == "ArrowRight") {
          editor
            .chain()
            .setTextSelection(selection.$anchor.end() + 2)
            .run();
        }
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
    class: `${node.attrs.class} ${className}`.trim(),
  });
}

function removeClass(editor, node, className) {
  editor.commands.updateAttributes(node.type.name, {
    class: node.attrs.class
      .split(" ")
      .filter((cls) => cls !== className)
      .join(" "),
  });
}
function setInput(editor, input, prevValue, data){
  if (
    (input.attrs["data-textInit"] === prevValue &&
      data) ||
    (!prevValue.replaceAll(NULLPTR, "") && data)
  ) {
    editor.commands.insertContentAt(
      { from: editor.state.selection.$anchor.start(), to: editor.state.selection.$anchor.end() },
      NULLPTR + data + NULLPTR
    );
    editor.chain().setTextSelection(editor.state.selection.from-1).run();
    removeClass(editor, input, "empty");
  }
  if (
    prevValue[0] !== input.textContent[0] &&
    input.textContent[0] !== NULLPTR
  ) {
    editor.commands.deleteNode("placeholderInput");
  }
}
