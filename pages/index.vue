<template>
  <div>
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { Editor, EditorContent, mergeAttributes } from "@tiptap/vue-3";
import { Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Focus from "@tiptap/extension-focus";

const InputSpan = Node.create({
  name: "inputSpan",
  inline: true,
  group: "inline",
  content: "text*",
  selectable: true,
  defining: true,


  addAttributes() {
    return {
      class: {
        default: "input",
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
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
});

const editor = ref();
const content = ref(
  "<p>Представь, что ты занимаешь должность <span class='input'>укажите должность</span> в <span class='input'>укажите орган власти</span> , твои цели заключаются в <span class='input'>укажите цели</span> . Твоя задача написать речь для</p><p>выступления на <span class='input'>указать тип и название мероприятия</span> . Данное мероприятие приурочено к <span class='input'>укажите повод</span> . Твоя речь будет о <span class='input'>укажите тематику</span></p>"
);

onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit, Focus, InputSpan],
    content: content.value,
    onUpdate: () => {
      content.value = editor.value.getHTML();
    },
  });
  const inputs = Array.from(
    editor.value.view.dom.querySelectorAll("span.input")
  );
  console.log(inputs);

  inputs.forEach((input) => {
    input.addEventListener("click", (ev) => {
      const observer = new MutationObserver((ev) => {
        console.log('sssgsgg');
        
        if(input.isUpdated){
          input.isUpdated = false
          return
        }
        if(!input.isUpdated){
          if(input.innerText.replaceAll("\u200B",'') != input.initialValue){
            input.innerText = input.innerText.replaceAll(input.initialValue,'')
            console.log(ev[0].oldValue?.length, input.innerText.length);
            setCaretPosition(input.innerText.length, input);
            input.isUpdated = true
          }
        }

      });
      if (!input.initialValue) {
        input.initialValue = input.innerText;
      }
      if (!input.innerText.startsWith("\u200B")) {
        input.innerText = "\u200B" + input.innerText;
      }
      observer.observe(input, {
        childList: true,
        subtree: true,
        characterDataOldValue: true,
      });
      if(input.innerText.replaceAll("\u200B",'') == input.initialValue){
        setCaretPosition(1, input);
      }
    });
  });
});

function setCaretPosition(position, el) {
  const range = document.createRange();
  const selection = window.getSelection();

  // Получаем первый дочерний элемент div (или можно выбрать другой)
  const childNode = el.firstChild;

  if (childNode) {
    range.setStart(childNode, position); // Устанавливаем позицию каретки
    range.setEnd(childNode, position); // Устанавливаем конец выделения (если нужно)
    selection.removeAllRanges();
    selection.addRange(range); // Применяем диапазон
  }
}
</script>

<style scoped>
:deep() {
  .tiptap {
    margin-top: 400px !important;
    max-width: 720px;
    max-height: 200px;
    overflow: auto;
    margin: auto;
    background-color: #f2f4f7;
    border-radius: 22px;
    padding: 12px 16px;
    line-height: 34px;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
  }
  .tiptap:focus,
  span.input:focus {
    outline: none;
    border: none;
  }
  span.input {
    border-radius: 8px;
    background: rgba(4, 92, 251, 0.12);
    color: #045cfb;
    padding: 2px 6px;
    cursor: pointer;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
  span.input:focus,
  span.input.has-focus {
    color: rgba(4, 92, 251, 0.4);
  }
}
</style>
<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Onest:wght@100..900&display=swap");
* {
  margin: 0;
  padding: 0;
}
</style>
