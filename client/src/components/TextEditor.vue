<template>
  <div class="my-4">
    <el-tiptap
      v-model="textEditorContent"
      :extensions="extensions"
      placeholder="Saisir des informations"
      class="overflow-auto"
      style="height:450px"
    />
  </div>
</template>

<script>
import {
  ElementTiptap,
  // necessary extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  TextColor,
  FormatClear,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  TextAlign,
  Indent,
  HorizontalRule,
  Blockquote,
  Link,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from 'element-tiptap';

export default {
  name: 'TextEditor',
  components: {
    'el-tiptap': ElementTiptap,
  },
  props: ['value'],
  data() {
    return {
    // editor extensions
    // they will be added to menubar and bubble menu by the order you declare.
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // render command-button in bubble menu.
        new Underline(),
        new Italic(),
        new Strike(),
        new TextColor(),
        new FormatClear(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new TextAlign(),
        new Indent(),
        new HorizontalRule(),
        new Blockquote(),
        new Link(),
        new Table(),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
      ],
      pic_information: '',
    };
  },
  computed: {
    textEditorContent: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>
