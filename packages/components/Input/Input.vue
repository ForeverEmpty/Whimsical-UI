<script setup lang="ts">
import { ref, computed, watch, useAttrs, shallowRef, nextTick } from 'vue'
import type { InputProps, InputEmits, InputInstance } from './types'
import { useFoucusControllers } from '@whimsical-ui/hooks'
import Icon from '../Icon/Icon.vue'
import { noop, each } from 'lodash-es'
import { useFormItem, useFormDisabled, useFormItemInputId } from '../Form'
import { debugWarn } from '@whimsical-ui/utils'

defineOptions({
    name: 'WInput',
    inheritAttrs: false
})

const props = withDefaults(defineProps<InputProps>(), {
    type: 'text',
    autocomplete: 'off'
})
const emits = defineEmits<InputEmits>()
const attrs = useAttrs()

const innerValue = ref(props.modelValue)
const pwdVisible = ref(false)
const isDisabled = useFormDisabled()
const { formItem } = useFormItem()
const { inputId } = useFormItemInputId(props, formItem)

const inputRef = shallowRef<HTMLInputElement>()
const textareaRef = shallowRef<HTMLTextAreaElement>()

const _ref = computed(() => inputRef.value || textareaRef.value)

const { wrapperRef, isFocused, handleFocus, handleBlur } = useFoucusControllers(
    _ref, {
    afterBlur() {
        formItem?.validate('blur').catch((err) => debugWarn(err))
    },
})

const showClear = computed(() => 
    props.clearable && 
    !!innerValue.value && 
    !isDisabled.value && 
    isFocused.value
)

const showPwdArea = computed(() => 
    props.type === 'password' && 
    props.showPassword && 
    !isDisabled.value && 
    !!innerValue.value
)

const clear: InputInstance['clear'] = function () {
    innerValue.value = ''
    each(['input', 'change', 'update:modelValue'], (e) => {
        emits(e as any, '')
    })
    emits('clear')
    formItem?.clearValidate()
}

const focus: InputInstance['focus'] = async function () {
    await nextTick()
    _ref.value?.focus()
}

const blur: InputInstance['blur'] = function () {
    _ref.value?.blur()
}

const select: InputInstance['select'] = function () {
    _ref.value?.select()
}

function handleInput() {
    emits('input', innerValue.value)
    emits('update:modelValue', innerValue.value)
}

function handleChange() {
    emits('change', innerValue.value)
}

function togglePwdVisible() {
    pwdVisible.value = !pwdVisible.value
}

watch(() => props.modelValue, (newVal) => {
    innerValue.value = newVal
    formItem?.validate('change').catch((err) => debugWarn(err))
})

defineExpose<InputInstance>({
    ref: _ref,
    clear,
    focus,
    blur,
    select
})
</script>

<template>
    <div
        class="w-input"
        :class="{
            [`w-input--${type}`]: type,
            [`w-input--${size}`]: size,
            'is-disabled': isDisabled,
            'is-prepend': $slots.prepend,
            'is-append': $slots.append,
            'is-prefix': $slots.prefix,
            'is-suffix': $slots.suffix,
            'is-focus': isFocused,
        }"
    >
        <template v-if="type !== 'textarea'">
            <div v-if="$slots.prepend" class="w-input__prepend">
                <slot name="prepend"></slot>
            </div>
            <div class="w-input__wrapper" ref="wrapperRef">
                <span v-if="$slots.prefix" class="w-input__prefix">
                    <slot name="prefix"></slot>
                </span>
                <input
                    class="w-input__inner"
                    ref="inputRef"
                    :id="inputId"
                    :type="showPassword ? (pwdVisible ? 'text' : 'password') : type"
                    :disabled="isDisabled"
                    :readonly="readonly"
                    :autocomplete="autocomplete"
                    :placeholder="placeholder"
                    :autofocus="autofocus"
                    :form="form"
                    v-model="innerValue"
                    v-bind="attrs"
                    @input="handleInput"
                    @change="handleChange"
                    @focus="handleFocus"
                    @blur="handleBlur"
                />
                <span
                    v-if="$slots.suffix || showClear || showPwdArea"
                    class="w-input__suffix"
                >
                    <slot name="suffix"></slot>
                    <Icon
                        icon="circle-xmark"
                        v-if="showClear"
                        class="w-input__clear"
                        @click="clear"
                        @mousedown.prevent="noop"
                    />
                    <Icon
                        icon="eye"
                        class="w-input__password"
                        v-if="showPwdArea && pwdVisible"
                        @click="togglePwdVisible"
                    />
                    <Icon
                        icon="eye-slash"
                        class="w-input__password"
                        v-if="showPwdArea && !pwdVisible"
                        @click="togglePwdVisible"
                    />
                </span>
            </div>
            <div v-if="$slots.append" class="w-input__append">
                <slot name="append"></slot>
            </div>
        </template>
        <template v-else>
            <textarea
                class="w-textarea__wrapper"
                ref="textareaRef"
                :id="inputId"
                :disabled="isDisabled"
                :readonly="readonly"
                :autocomplete="autocomplete"
                :placeholder="placeholder"
                :autofocus="autofocus"
                :form="form"
                v-model="innerValue"
                v-bind="attrs"
                @input="handleInput"
                @change="handleChange"
                @focus="handleFocus"
                @blur="handleBlur"
            ></textarea>
        </template>
    </div>
</template>

<style scoped>
@import './style.css';
</style>