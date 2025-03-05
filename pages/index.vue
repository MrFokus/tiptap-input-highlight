<template>
  <div
    contenteditable="true"
    class="editor"
    ref="editor"
    v-html="content"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const content = ref(
  "<p>Представь, что ты занимаешь должность <span tabindex='0' class='input'>укажите должность</span> в <span class='input'>укажите орган власти</span> , твои цели заключаются в <span class='input'>укажите цели</span> . Твоя задача написать речь для</p><p>выступления на <span class='input'>указать тип и название мероприятия</span> . Данное мероприятие приурочено к <span class='input'>укажите повод</span> . Твоя речь будет о <span class='input'>укажите тематику</span></p>"
);

const editor = ref<HTMLElement | null>(null);
const currentInput = ref();
const highlightSpan = (event) => {
  if (editor.value) {
    const selection = window.getSelection();
    console.log(selection);

    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedNode = range.startContainer;
    if (selectedNode && selectedNode.nodeType === Node.TEXT_NODE) {
      const spans = editor.value.querySelectorAll("span.input");
      spans.forEach((span) => span.classList.remove("focused"));

      if (
        (selectedNode.parentNode as HTMLElement).tagName === "SPAN" &&
        (selectedNode.parentNode as HTMLElement).classList.contains("input")
      ) {
        currentInput.value = selectedNode.parentNode as HTMLElement;

        if (!currentInput.value.initialValue) {
          currentInput.value.initialValue = currentInput.value.innerText;
        }
        currentInput.value.classList.add("focused");
        if (!currentInput.value.innerText.startsWith("\u200B")) {
          currentInput.value.innerText =
            "\u200B" + currentInput.value.innerText;
        }
        if (
          currentInput.value.initialValue ==
          currentInput.value.innerText.replaceAll("\u200B", "")
        ) {
          moveCaretToStart(currentInput.value);
        }
        const blockedKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
        if (
          blockedKeys.includes(event.key) &&
          currentInput.value.initialValue ==
            currentInput.value.innerText.replaceAll("\u200B", "")
        ) {
          event.preventDefault();
        }
      } else {
        currentInput.value = null;
      }
    }
  }
};
const moveCaretToStart = (span) => {
  if (editor.value) {
    if (span) {
      const range = document.createRange();
      const selection = window.getSelection();

      range.setStart(span.firstChild!, 1);
      range.collapse(true);

      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }
};
const moveCaretToEnd = (span) => {
  if (editor.value) {
    if (span) {
      const range = document.createRange();
      const selection = window.getSelection();

      range.setStart(span.firstChild!, span.firstChild.length);
      range.collapse(true);

      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }
};

onMounted(() => {
  editor.value?.addEventListener("click", highlightSpan);
  editor.value?.addEventListener("keydown", highlightSpan);
  editor.value?.addEventListener("input", (ev) => {
    if (currentInput.value) {
      console.log(currentInput.value);

      if (
        ev.inputType == "deleteContentBackward" &&
        currentInput.value.innerText == currentInput.value.initialValue
      ) {
        currentInput.value.remove();
      }
      if (currentInput.value.innerText.length == 1) {
        currentInput.value.innerText =
          "\u200B" + currentInput.value.initialValue;
        moveCaretToStart(currentInput.value);
      } else if (currentInput.value.innerText.length == 0) {
      } else {
        currentInput.value.innerText = currentInput.value.innerText.replaceAll(
          currentInput.value.initialValue,
          ""
        );
        moveCaretToEnd(currentInput.value);
      }
    }
  });
});
</script>

<style scoped>
.editor {
  max-width: 720px;
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
  .editor:focus,
  span.input.focused {
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
  span.input.focused {
    color: rgba(4, 92, 251, 0.4);
  }
}
</style>
<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Onest:wght@100..900&display=swap");
html, #__nuxt, body{
  min-height: 100dvh;
}
#__nuxt{
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
