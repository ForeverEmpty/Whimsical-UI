<script setup>
import { ref } from "vue";
import { WSelect, WOption, WInput } from "whimsical-ui";

const options = ref([
  { value: "beijing", label: "Beijing" },
  { value: "shanghai", label: "Shanghai" },
  { value: "shenzhen", label: "Shenzhen", disabled: true },
  { value: "hangzhou", label: "Hangzhou" },
]);
const value = ref('')
</script>

<template>
  <w-select v-model="value" :options="options" filterable clearable />
  <w-select v-model="value" filterable clearable>
    <w-option value="beijing" label="Beijing" />
    <w-option value="shanghai" label="Shanghai" />
    <w-option value="shenzhen" label="Shenzhen" />
    <w-option value="hangzhou" label="Hangzhou" />
  </w-select>
  <w-input type="text"></w-input>
  <w-button>123131</w-button>
  <w-tooltip style="margin: 500px;" placement="right">
    <template #content> multiple lines1111<br />second line </template>
    <w-button>123</w-button>
  </w-tooltip>
</template>
