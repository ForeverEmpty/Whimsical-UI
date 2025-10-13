<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { NotificationCompInstance, NotificationProps } from './types'
import { useOffset, useEventListener } from '@whimsical-ui/hooks'
import { addUnit, RenderVnode, typeIconMap } from '@whimsical-ui/utils';
import { bind, delay } from 'lodash-es';
import WIcon from '../Icon/Icon.vue';
import { getLastBottomOffset } from './methods';

defineOptions({
    name: 'WNotification'
})

const props = withDefaults(defineProps<NotificationProps>(), {
    type: 'info',
    duration: 30000,
    offset: 20,
    position: 'top-right',
    transitionName: 'fade',
    showClose: true
})

const visible = ref(false)
const notifyRef = ref<HTMLDivElement>()
const iconName = computed(() => typeIconMap.get(props.type) ?? 'circle-info')
const horizontalClass = computed(() => props.position.endsWith('right') ? 'right' : 'left')
const verticalProperty = computed(() => props.position.startsWith('top') ? 'top' : 'bottom')

const boxHeight = ref(0)

const { topOffset, bottomOffset } = useOffset({
    getLastBottomOffset: bind(getLastBottomOffset, props),
    offset: props.offset,
    boxHeight,
})

const customStyle = computed(() => ({
    [verticalProperty.value]: addUnit(topOffset.value),
    zIndex: props.zIndex
}))

let timer: number
function startTimer() {
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
    startTimer()
})

defineExpose<NotificationCompInstance>({
    close,
    bottomOffset
})
</script>

<template>
    <transition
        :name="`w-notification-${transitionName}`"
        @after-leave="!visible && onDestory()"
        @enter="boxHeight = notifyRef!.getBoundingClientRect().height"
    >
        <div
            ref="notifyRef"
            class="w-notification"
            :class="{
                [`w-notification--${type}`]: type,
                'show-close': showClose,
                [horizontalClass]: true,
            }"
            :style="customStyle"
            v-show="visible"
            role="alert"
            @click="onClick"
            @mouseenter="clearTimer"
            @mouseleave="startTimer"
        >
            <WIcon v-if="iconName" :icon="iconName" class="w-notification__icon" />

            <div class="w-notification__text">
                <div class="w-notification__title">{{ title }}</div>
                <div class="w-notification__content">
                    <slot>
                        <RenderVnode v-if="message" :vNode="message" />
                    </slot>
                </div>
            </div>
            <div class="w-notification__close" v-if="showClose">
                <WIcon icon="xmark" @click.stop="close" />
            </div>
        </div>
    </transition>
</template>

<style scoped>
@import './style.css';
</style>