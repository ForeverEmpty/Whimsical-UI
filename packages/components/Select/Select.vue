<script setup lang="ts">
import type { SelectProps, SelectEmits, SelectContext, SelectInstance, SelectStates, SelectOptionProps } from './types'
import { SELECT_CTX_KEY, POPPER_OPTIONS } from './constants'
import type { TooltipInstance } from '../Tooltip'
import type { InputInstance } from '../Input'
import { useId, useFoucusControllers, useClickOutside } from '@whimsical-ui/hooks'
import { computed, ref, reactive, provide, type VNode, nextTick, watch } from 'vue'
import { each, eq, filter, find, get, isFunction, size } from 'lodash-es'

import WTooltip from '../Tooltip/Tooltip.vue'
import WInput from '../Input/Input.vue'
import WIcon from '../Icon/Icon.vue'
import WOption from './Option.vue'

defineOptions({
    name: 'WSelect'
})

const props = withDefaults(defineProps<SelectProps>(), {
    options: () => []
})
const emits = defineEmits<SelectEmits>()
const slots = defineSlots()

const selectRef = ref<HTMLElement>()
const tooltipRef = ref<TooltipInstance>()
const inputRef = ref<InputInstance>()

const isDropdownVisible = ref(false)

const initialOption = findOption(props.modelValue)

const selectStates = reactive<SelectStates>({
    inputValue: initialOption?.label ?? '',
    selectedOption: initialOption,
    mouseHover: false,
    loading: false,
    highlightedIndex: -1
})

const isDisabled = computed(() => props.disabled)
const children = computed(() => filter(slots?.default?.(), (child) => eq(child.type, WOption)))
const hasChildren = computed(() => size(children.value))
const showClear = computed(() => props.clearable && selectStates.mouseHover && selectStates.inputValue !== '')
const highlightedLine = computed(() => {
    let result: SelectOptionProps | void
    if (hasChildren.value) {
        const node = children.value[selectStates.highlightedIndex]
        result = node?.props?.value
    } else {
        result = props.options[selectStates.highlightedIndex]
    }
    return result
})
const inputId = useId().value
const {
    wrapperRef: inputWrapperRef,
    isFocused,
    handleBlur,
    handleFocus
} = useFoucusControllers(inputRef)

useClickOutside(selectRef, (e) => handleClickOutSied(e))

const focus: SelectInstance['focus'] = function () {
    inputRef.value?.focus()
}
const blur: SelectInstance['blur'] = function () {
    handleClickOutSied()
}

function handleClickOutSied(e?: Event) {
    if (isFocused.value) {
        nextTick(() => handleBlur(new FocusEvent('focus', e)))
    }
}

function controlVisible(visible: boolean) {
    if (!tooltipRef.value) return
    get(tooltipRef, ['value', visible ? 'show' : 'hide'])?.()
    isDropdownVisible.value = visible
    emits('visible-change', visible)

    selectStates.highlightedIndex = -1
}

function toggleVisible() {
    if (isDisabled.value) return

    controlVisible(!isDropdownVisible.value)
}

function handleClear() {
    inputRef.value?.clear()
    selectStates.inputValue = ''
    selectStates.selectedOption = null

    emits('clear')
    each(['change', 'update:modelValue'], (k) => emits(k as any, ''))
    //formItem clear
}

function renderLabel(opt: SelectOptionProps): VNode | string {
    if (isFunction(props.renderLabel)) {
        return props.renderLabel(opt)
    }
    return opt.label
}

function handleSelect(opt: SelectOptionProps) {
    if (opt.disabled) return

    selectStates.inputValue = opt.label
    selectStates.selectedOption = opt
    each(['change', 'update:modelValue'], (k) => emits(k as any, opt.value))
    controlVisible(false)
    inputRef.value?.focus()
}

function findOption(value: string) {
    return find(props.options, (opt) => opt.value === value)
}

function setSelected() {
    const opt = findOption(props.modelValue)
    if (!opt) return
    selectStates.inputValue = opt.label
    selectStates.selectedOption = opt
}

watch(() => props.modelValue, () => {
    //表单校验
    setSelected()
})

provide<SelectContext>(SELECT_CTX_KEY, {
    handleSelect,
    selectStates,
    renderLabel,
    highlightedLine
})

defineExpose<SelectInstance>({
    focus,
    blur
})
</script>

<template>
    <div
        ref="selectRef"
        class="w-select"
        :class="{
          'is-disabled': isDisabled,
        }"
        @click.stop="toggleVisible"
        @mouseenter="selectStates.mouseHover = true"
        @mouseleave="selectStates.mouseHover = false"
    >
        <WTooltip
            ref="tooltipRef"
            placement="bottom-start"
            :popper-options="POPPER_OPTIONS"
            @click-outside="controlVisible(false)"
            manual
        >
            <template #default>
                <div ref="inputWrapperRef">
                    <WInput
                        ref="inputRef"
                        v-model="selectStates.inputValue"
                        :id="inputId"
                        :disabled="isDisabled"
                        :placeholder="filterable ? filterPlaceholder : placeholder"
                        :readonly="!filterable || !isDropdownVisible"
                        @focus="handleFocus"
                        @blur="handleBlur"
                        @input="handleFilterDebounce"
                        @keydown="handleKeyDown"
                    >
                        <template #suffix>
                            <WIcon
                                v-if="showClear"
                                icon="circle-xmark"
                                class="w-input__clear"
                                @click.stop="handleClear"
                                @mousedown.prevent="noop"
                            />
                            <WIcon
                                v-else
                                class="header-angle"
                                icon="angle-down"
                                :class="{ 'is-active': isDropdownVisible }"
                            />
                        </template>
                    </WInput>
                </div>
            </template>
            <template #content>
                <div class="w-select__loading" v-if="selectStates.loading">
                    <WIcon icon="spinner" spin />
                </div>
                <div class="w-select__nodata" v-else-if="filterable && isNoData">
                    No data
                </div>
                <ul class="w-select__menu" v-else>
                    <template v-if="!hasChildren">
                        <WOption
                            v-for="item in options"
                            :key="item.value"
                            v-bind="item"
                        />
                    </template>
                    <template v-else>
                        <slot></slot>
                    </template>
                </ul>
            </template>
        </WTooltip>
    </div>
</template>

<style scoped>

</style>