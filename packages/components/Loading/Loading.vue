<script setup lang="ts">
import { computed, type Ref } from 'vue'
import type { LoadingOptions } from './types'
import { isString } from 'lodash-es'
import WIcon from '../Icon/Icon.vue'

defineOptions({
    name: 'WLoading',
    inheritAttrs: false
})

const props = defineProps<LoadingOptions>()

const iconName = computed(() => {
    if (isString(props.spinner)) return props.spinner
    return 'spinner'
})

</script>

<template>
    <transition name="fade-in-linear" @after-leave="onAfterLeave">
        <div
            v-show="(props.visible as Ref).value"
            class="w-loading w-loading__mask"
            :class="{ 'is-fullscreen': fullscreen }"
        >
            <div class="w-loading__spinner">
                <WIcon v-if="props.spinner !== false" :icon="iconName" spin />
                <p v-if="text" class="w-loading-text">{{ text }}</p>
            </div>
        </div>
    </transition>
</template>

<style scoped>
@import './style.css';

.w-loading {
    --w-loading-bg-color: v-bind(background) !important;
    --w-loading-z-index: v-bind(zIndex) !important;
}
</style>