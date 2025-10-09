<script setup lang="ts">
import { WButton } from 'whimsical-ui'
import { WPopconfirm } from 'whimsical-ui'

function confirm(e: MouseEvent) {
  console.log('confirm', e)
}

function cancel(e: MouseEvent) {
  console.log('cancel', e)
}
</script>

<template>
  <WPopconfirm title="TEST" @confirm="confirm" @cancle="cancel">
    <WButton type="primary" size="large" icon="search">TEST</WButton>
  </WPopconfirm>
</template>

<style scoped>
</style>
