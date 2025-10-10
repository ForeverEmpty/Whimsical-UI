<script setup lang="ts">
import { ja, ko, en, zhCn, zhTw, WConfigProvider, WPopconfirm, WButton } from 'whimsical-ui'
import { get } from "lodash-es";

import { computed, ref } from "vue";

const language = ref('');
const langMap = {
  ja,
  ko,
  en,
  zhCn,
  zhTw,
} as const;
const locale = computed(() => get(langMap, language.value));
const changelang = () => {
  const l = ["zhCn", "zhTw", "ko", "en", "ja"];
  language.value = l[(l.indexOf(language.value) + 1) % l.length] as string;
};
</script>

<template>
  <WButton @click="changelang" type="info" style="margin-right: 20px"
    >change language</WButton
  >
  <WConfigProvider :locale="locale">
    <WPopconfirm title="Are you shure to delete this item?">
      <WButton>Delete</WButton>
    </WPopconfirm>
  </WConfigProvider>
</template>

<style scoped>
</style>
