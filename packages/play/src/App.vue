<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  name: '',
  desc: ''
})
</script>

<template>
<w-input :modelValue="form.name" show-password type="password" @update:modelValue="form.name = $event"/>
<w-input v-model="form.desc" type="textarea"/>
<div>
  {{ form.name }} {{ form.desc }}
</div>
</template>

<style scoped>
</style>
