<script setup lang="ts">
import { WButton, WMessage } from 'whimsical-ui'

const open1 = () => {
  WMessage({
    message: "Congrats, this is a success message.",
    type: "success",
  });
};
const open2 = () => {
  WMessage.success("Congrats, this is a success message.");
};
</script>

<template>
  <WButton @click="open1">插件式调用</WButton>
  <WButton @click="open2">函数式调用</WButton>
  <WButton @click="$message.success('Congrats, this is a success message.')"
    >全局方法调用</WButton>
</template>

<style scoped>
</style>
