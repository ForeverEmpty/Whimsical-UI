<script setup lang="ts">
import type { CollapseItemProps } from './types'
import { inject, computed } from 'vue'
import { COLLAPSE_CTX_KEY } from './contants'
import { WIcon } from '../Icon';
import transitionEvents from './transitionEvents'

defineOptions({
  name: 'WCollapseItem',
})

const props = defineProps<CollapseItemProps>()
const ctx = inject(COLLAPSE_CTX_KEY)

const isActive = computed(() => ctx?.activeNames.value.includes(props.name))

function handleClick() {
    if (props.disabled) return
    ctx?.handleItemClick(props.name)
}
</script>

<template>
    <div class="w-collapse-item"
        :class="{
            'is-disabled': disabled
        }"
    >
        <div
            class="w-collapse-item__header"
            :id="`item-header-${name}`"
            :class="{
                'is-disabled': disabled,
                'is-active': isActive
            }"
            @click="handleClick"
        >
            <span class="w-collapse-item__title">
                <slot name="title">{{ title }}</slot>
            </span>
            <WIcon icon="angle-right" class="header-angle" />
        </div>
        <transition name="slide" v-on="transitionEvents">
            <div class="w-collapse-item__wapper" v-show="isActive">
                <div class="w-collapse-item__content" :id="`item-conten-${name}`">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
@import './style.css';
</style>