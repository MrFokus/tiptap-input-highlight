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
          "data-textInit": NULLPTR + input.textContent,
        })
        .run();
    }
    if (input.attrs["data-textInit"] === input.textContent) {
      editor
        .chain()
        .setTextSelection($anchor.start() + 1)
        .run();
      addClass(editor, input, "empty");
    }
    if (input.textContent == NULLPTR) {
      editor
        .chain()
        .insertContentAt($anchor.start() + 1, input.attrs["data-textInit"])
        .setTextSelection($anchor.start() + 1)
        .deleteRange({ from: $anchor.start(), to: $anchor.start() + 1 })
        .run();
    }

    if (
      input.textContent === input.attrs["data-textInit"].replaceAll(NULLPTR, "")
    ) {
      editor.commands.deleteNode("placeholderInput");
    }
  },

  onCreate({ editor }) {
    editor.view.dom.addEventListener("input", (ev) => {
      console.log(ev);

      const input = getCurrentInput(editor);

      if (!input) return;
      const { selection } = editor.state;
      const { $anchor } = selection;

      if (input.attrs["data-textInit"] === input.textContent && ev.data) {
        editor.commands.insertContentAt(
          { from: $anchor.start(), to: $anchor.end() },
          NULLPTR + ev.data
        );
        removeClass(editor, input, "empty");
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
