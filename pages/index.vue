<template>
  <editor-content class="editor" :editor="editor" />
</template>

<script setup lang="ts">
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Focus from "@tiptap/extension-focus";
import { PlaceholderInput } from "~/TipTap/PlaceholderInputNode";
import InputPlugin from "~/TipTap/InputPlugin";

const editor = ref();
const content = ref(
  "<p>Представь, что ты занимаешь должность <span class='input empty'>укажите должность</span> в <span class='input empty'>укажите орган власти</span> , твои цели заключаются в <span class='input empty'>укажите цели</span> . Твоя задача написать речь для выступления на <span class='input empty'>указать тип и название мероприятия</span> . Данное мероприятие приурочено к <span class='input empty'>укажите повод</span> . Твоя речь будет о <span class='input empty'>укажите тематику</span> \u200B</p>"
);

onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit, Focus, PlaceholderInput, InputPlugin],
    content: content.value,
    onUpdate: () => {
      content.value = editor.value.getHTML();
    },
  });
});
</script>

<style scoped>
.editor {
  max-width: 720px;
  width: 100%;
  max-height: 200px;
  overflow: auto;
  background-color: #f2f4f7;
  border-radius: 22px;
  padding: 12px 16px;
  line-height: 34px;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}
.editor:focus {
  outline: none;
  border: none;
}
::v-deep() {
  .tiptap:focus,
  span.input.focused {
    outline: none;
    border: none;
  }
  .tiptap {
    -moz-user-select: text;
    -khtml-user-select: text;
    -webkit-user-select: text;
    -o-user-select: text;
  }
  span.input {
    display: inline;
    border-radius: 8px;
    background: rgba(4, 92, 251, 0.12);
    color: #045cfb;
    padding: 2px 6px;
    cursor: pointer;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
  span.input.empty.has-focus {
    color: rgba(4, 92, 251, 0.4);
  }
}
</style>
<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Onest:wght@100..900&display=swap");
html,
#__nuxt,
body {
  min-height: 100dvh;
}
#__nuxt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
* {
  margin: 0;
  padding: 0;
}
</style>
