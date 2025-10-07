<script setup lang="ts">
import { WIcon } from '../Icon';
import type { AlertProps, AlertEmits, AlertInstance } from './types';
import { typeIconMap } from '@whimsical-ui/utils';
import { computed, ref } from 'vue'

defineOptions({
    name: 'WAlert'
})

const props = withDefaults(defineProps<AlertProps>(), {
    effect: 'light',
    type: 'info',
    closable: true
})
const emits = defineEmits<AlertEmits>()
const slots = defineSlots()

const visible = ref(true)
const withDescription = computed(() => props.description || slots.default)
const iconName = computed(() => typeIconMap.get(props.type) ?? 'circle-info')

function close() {
    visible.value = false
    emits('close')
}

function open() {
    visible.value = true
}

defineExpose<AlertInstance>({
    open,
    close
})
</script>

<template>
    <transition name="w-alert-fade">
        <div
          v-show="visible"
          class="w-alert"
          role="alert"
          :class="{
            [`w-alert__${type}`]: type,
            [`w-alert__${effect}`]: effect,
            'text-center': center,
          }"
        >
            <WIcon
              v-if="showIcon"
              class="w-alert__icon"
              :class="{ 'big-icon': withDescription }"
              :icon="iconName"
            />
            <div class="w-alert__content">
                <span
                  class="w-alert__title"
                  :class="{ 'with-desc': withDescription }"
                  :style="{ display: center && !showIcon ? 'flow' : 'inline' }"
                >
                    <slot name="title">{{ title }}</slot>
                </span>
                <p class="w-alert__description">
                    <slot>{{ description }}</slot>
                </p>
                <div class="w-alert__close" v-if="closable">
                    <WIcon @click.stop="close" icon="xmark" />
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
@import './style.css';
</style>