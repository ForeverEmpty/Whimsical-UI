<script setup lang="ts">
import { WDropdown, type DropdownItemProps } from 'whimsical-ui'

function confirm(e: MouseEvent) {
  console.log('confirm', e)
}

function cancel(e: MouseEvent) {
  console.log('cancel', e)
}

const items: DropdownItemProps[] = [
  { command: "1", label: "Action 1" },
  { command: "2", label: "Action 2" },
  { command: "3", label: "Action 3", disabled: true },
  { command: "4", label: "Action 4", divided: true },
];
</script>

<template>
  <WDropdown :items="items" type="primary" splitButton>
    123
  </WDropdown>
</template>

<style scoped>
</style>
