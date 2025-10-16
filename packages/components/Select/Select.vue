<script setup lang="ts">
import type { SelectProps, SelectEmits, SelectContext, SelectInstance, SelectStates, SelectOptionProps } from './types'
import { SELECT_CTX_KEY, POPPER_OPTIONS } from './constants'
import type { TooltipInstance } from '../Tooltip'
import type { InputInstance } from '../Input'
import { useId, useFoucusControllers, useClickOutside } from '@whimsical-ui/hooks'
import { computed, ref, reactive, provide, type VNode, nextTick, watch, h, onMounted } from 'vue'
import { assign, debounce, each, eq, filter, find, get, includes, isBoolean, isFunction, isNil, map, noop, size } from 'lodash-es'

import WTooltip from '../Tooltip/Tooltip.vue'
import WInput from '../Input/Input.vue'
import WIcon from '../Icon/Icon.vue'
import WOption from './Option.vue'
import { debugWarn, RenderVnode } from '@whimsical-ui/utils'
import useKeyMap from './useKeyMap'

const COMPONENT_NAME = 'WSelect' as const

defineOptions({
    name: COMPONENT_NAME
})

const props = withDefaults(defineProps<SelectProps>(), {
    options: () => []
})
const emits = defineEmits<SelectEmits>()
const slots = defineSlots()

const selectRef = ref<HTMLElement>()
const tooltipRef = ref<TooltipInstance>()
const inputRef = ref<InputInstance>()
const filteredChilds = ref<Map<VNode, SelectOptionProps>>(new Map())
const filteredOptions = ref(props.options ?? [])

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
        const node = [...filteredChilds.value][selectStates.highlightedIndex]?.[0]
        result = filteredChilds.value.get(node!)
    } else {
        result = props.options[selectStates.highlightedIndex]
    }
    return result
})

const childrenOptions = computed(() => {
    if (!hasChildren.value) return []

    return map(children.value, (item) => ({
        vNode: h(item),
        props: assign(item.props, {
            disabled: item.props?.disabled === true || (!isNil(item.props?.disabled) && !isBoolean(item.props?.disabled))
        })
    }))
})

const hasData = computed(() => (hasChildren.value && filteredChilds.value.size > 0) || (!hasChildren.value && size(filteredOptions.value) > 0))
const isNoData = computed(() => {
    if (!props.filterable) return false

    if (!hasData.value) return true
    return false
})
const lastIndex = computed(() => hasChildren.value ? filteredChilds.value.size - 1 : size(filteredOptions.value) - 1)
const filterPlaceholder = computed(() => props.filterable && selectStates.selectedOption && isDropdownVisible.value ? selectStates.selectedOption.label : props.placeholder)

const timeout = computed(() => props.remote ? 300 : 100)
const handleFilterDebounce = debounce(handleFilter, timeout.value)

const inputId = useId().value
const {
    wrapperRef: inputWrapperRef,
    isFocused,
    handleBlur,
    handleFocus
} = useFoucusControllers(inputRef)

const keyMap = useKeyMap({
    isDropdownVisible,
    controlVisible,
    selectStates,
    highlightedLine,
    handleSelect,
    hasData,
    lastIndex
})

function handleKeyDown(e: KeyboardEvent) {
    keyMap.has(e.key) && keyMap.get(e.key)?.(e)
}

useClickOutside(selectRef, (e: MouseEvent) => handleClickOutSied(e))

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
    props.filterable && controlInputVal(visible)
    isDropdownVisible.value = visible
    emits('visible-change', visible)

    selectStates.highlightedIndex = -1
}

function controlInputVal(visible: boolean) {
    if (!props.filterable) return

    if (visible) {
        if (selectStates.selectedOption) selectStates.inputValue = ''
        handleFilterDebounce()
        return
    }

    selectStates.inputValue = selectStates.selectedOption?.label || ''
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

function handleFilter() {
    const searchKey = selectStates.inputValue
    selectStates.highlightedIndex = -1

    if (hasChildren.value) {
        genFilterChilds(searchKey)
        return
    }
    genFilterOptions(searchKey)
}

async function genFilterChilds(search: string) {
    if (!props.filterable) return

    if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
        await callRemoteMethod(props.remoteMethod, search)
        setFilteredChilds(childrenOptions.value)
        return
    }

    if (props.filterMethod && isFunction(props.filterMethod)) {
        const opts = map(props.filterMethod(search), 'value')
        setFilteredChilds(
            filter(childrenOptions.value, (item) => 
                includes(opts, get(item, ['props', 'value']))
            )
        )
        return
    }
    setFilteredChilds(
        filter(childrenOptions.value, (item) =>
            includes(get(item, ["props", "label"]), search)
        )
    );
}

function setFilteredChilds(opts: typeof childrenOptions.value) {
    filteredChilds.value.clear()
    each(opts, (item) => [
        filteredChilds.value.set(item.vNode, item.props as SelectOptionProps)
    ])

}

async function genFilterOptions(search: string) {
    if (!props.filterable) return

    if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
        filteredOptions.value = await callRemoteMethod(props.remoteMethod, search)
        return
    }

    if (props.filterMethod && isFunction(props.filterMethod)) {
       filteredOptions.value = props.filterMethod(search)
        return
    }

    filteredOptions.value = filter(props.options, (opt) => includes(opt.label, search))
}

async function callRemoteMethod(method: Function, search: string) {
    if (!method || !isFunction(method)) return

    selectStates.loading = true
    let result
    try {
        result = await method(search)
    } catch (error) {
        debugWarn(error as Error)
        debugWarn(COMPONENT_NAME, 'callRemoteMethod error')
        result = []
        return Promise.reject(error)
    }

    return result
    
}

watch(() => props.options, (newVal) => {
    filteredOptions.value = newVal ?? []
})

watch(() => childrenOptions.value, (newVal) => {
    setFilteredChilds(newVal)
}, { immediate: true })

watch(() => props.modelValue, () => {
    //表单校验
    setSelected()
})

onMounted(() => {
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
                            v-for="item in filteredOptions"
                            :key="item.value"
                            v-bind="item"
                        />
                    </template>
                    <template v-else>
                        <template v-for="[vNode, _props] in filteredChilds" :key="_props.value">
                            <RenderVnode :vNode="vNode" />
                        </template>
                    </template>
                </ul>
            </template>
        </WTooltip>
    </div>
</template>

<style scoped>
@import './style.css';
</style>