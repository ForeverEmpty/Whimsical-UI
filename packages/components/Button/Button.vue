<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { ButtonProps, ButtonEmits, ButtonInstance } from './types'
import { BUTTON_GROUP_CTX_KEY } from './contants'
import { throttle } from 'lodash-es'
import { WIcon } from '../Icon'

defineOptions({
  name: 'WButton'
})

const props = withDefaults(defineProps<ButtonProps>(), {
  tag: 'button',
  nativeType: 'button',
  throttleDuration: 300
})

const emit = defineEmits<ButtonEmits>()

const slots = defineSlots()

const ctx = inject(BUTTON_GROUP_CTX_KEY, null)

const size = computed(()=> ctx?.size ?? props.size ?? '')
const type = computed(()=> ctx?.type ?? props.type ?? '')
const disabled = computed(()=> ctx?.disabled || props.disabled || false)

const iconStyles = computed(() => ({
    marginRight: slots.default ? '6px' : '0'
}))

const handleBtnClick = (e: MouseEvent) => emit('click', e)
const handleBtnClickThrottle = throttle(handleBtnClick, props.throttleDuration)

const _ref = ref<HTMLButtonElement | null>(null)

defineExpose<ButtonInstance>({
    ref: _ref
})
</script>

<template>
    <component 
        ref="_ref"
        class="w-button"

        :is="tag"
        :autofocus="autofocus"
        :type="tag === 'button' ? nativeType : undefined"
        :disabled="disabled || loading ? true : undefined"
        :class="{
            [`w-button--${type}`]: type,
            [`w-button--${size}`]: size,
            'is-plain': plain,
            'is-round': round,
            'is-circle': circle,
            'is-disabled': disabled,
            'is-loading': loading,
        }"
        @click="(e: MouseEvent) => useThrottle ? handleBtnClickThrottle(e) : handleBtnClick(e)"
    >
        <template v-if="loading">
            <slot name="loading">
                <WIcon 
                    class="loading-icon" 
                    :icon="loadingIcon ?? 'spinner'" 
                    :style="iconStyles" 
                    spin 
                />
            </slot>      
        </template>
        <WIcon 
            v-if="icon && !loading" 
            :icon="icon"
            :style="iconStyles"
            size="1x"
        />
        <slot></slot>
    </component>
</template>

<style scoped>
@import './style.css';
</style>