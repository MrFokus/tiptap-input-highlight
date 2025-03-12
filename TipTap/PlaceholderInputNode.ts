import { Mark, Node } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";


export const PlaceholderInput = Node.create({
  name: "placeholderInput",
  selectable: true,
  group: "inline",
  inline: true,
  content: "text*",
  isolating: true,

  addKeyboardShortcuts() {
    return {
      'Mod-z': () => true,
    }
  },

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
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state) => {
            const { doc, selection } = state;
            const decorations = [];

            doc.descendants((node, pos) => {
              if (node.type.name === "placeholderInput") {
                const hasFocus = 
                  selection.from >= pos+1 && selection.to <= pos + node.nodeSize;
                node.attrs.class.replaceAll("has-focus")
                decorations.push(
                  Decoration.node(pos, pos + node.nodeSize, {
                    class: hasFocus ? node.attrs.class + " has-focus" : node.attrs.class,
                  })
                );
              }
            });
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});


