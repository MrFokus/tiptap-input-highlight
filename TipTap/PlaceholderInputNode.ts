import { Mark, Node } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";

export const PlaceholderInput = Node.create({
  name: "placeholderInput",
  selectable: true,
  group: "inline",
  inline: true,
  content: "text*",
  isolating: true,

  addAttributes() {
    return {
      class: {
        default: "input empty",
      },
      "data-textInit": {
        default: "",
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "span.input",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
});
