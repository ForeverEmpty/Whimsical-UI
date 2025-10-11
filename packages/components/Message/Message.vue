<script setup lang="ts">
import { bind, delay } from 'lodash-es';
import { WIcon } from '../Icon';
import type { MessageProps, MessageCompInstance } from './types'
import { getLastBottomOffset } from './methods'
import { computed, onMounted, ref, watch } from 'vue'
import { typeIconMap, RenderVnode, addUnit } from '@whimsical-ui/utils'
import { useOffset, useEventListener } from '@whimsical-ui/hooks'

defineOptions({
    name: 'WMessage'
})

const props = withDefaults(defineProps<MessageProps>(), {
    type: 'info',
    duration: 3000,
    offset: 10,
    transitionName: 'fade-up'
})

const visible = ref(false)
const messageRef = ref<HTMLDivElement>()
const iconName = computed(() => typeIconMap.get(props.type) ?? 'circle-info')

const boxHeight = ref(0)

const { topOffset, bottomOffset } = useOffset({
    getLastBottomOffset: bind(getLastBottomOffset, props),
    offset: props.offset,
    boxHeight,
})

const customStyle = computed(() => ({
    top: addUnit(topOffset.value)
}))

let timer: number
function startTimmer() {
    if (props.duration === 0) return
    timer = delay(close, props.duration)
}

function clearTimer() {
    clearTimeout(timer)
}

function close() {
    visible.value = false
}

watch(visible, (val) => {
    if (!val) boxHeight.value -= props.offset
})

useEventListener(document, 'keydown', (e: Event) => {
    const { code } = e as KeyboardEvent
    if (code === "Escape") close()
})

onMounted(() => {
    visible.value = true
    startTimmer()
})

defineExpose<MessageCompInstance>({
    close,
    bottomOffset
})
</script>

<template>
    <Transition 
        :name="transitionName" 
        @enter="boxHeight = messageRef!.getBoundingClientRect().height" 
        @after-leave="!visible && onDestory()"
    >
        <div
            ref="messageRef"
            class="w-message"
            :class="{
              [`w-message--${type}`]: type,
              'is-close': showClose,
              'text-center': center,
            }"
            :style="customStyle"
            v-show="visible"
            role="alert"
            @mouseenter="clearTimer"
            @mouseleave="startTimmer"
        >
          <WIcon class="w-message__icon" :icon="iconName" />
          <div class="w-message__content">
            <slot>
                <RenderVnode v-if="message" :vNode="message" />
            </slot>
          </div>
          <div class="w-message__close" v-if="showClose">
                <WIcon icon="xmark" @click.stop="close" />
          </div>
        </div>
    </Transition>
</template>

<style scoped>
@import './style.css';
</style>