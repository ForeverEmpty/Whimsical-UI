<script setup lang="ts">
import type { MessageBoxProps, MessageBoxAction } from './types'
import { useZIndex, useId } from '@whimsical-ui/hooks'
import { typeIconMap } from '@whimsical-ui/utils';
import { computed, reactive, ref, watch, nextTick, type Ref } from 'vue'
import WIcon from '../Icon/Icon.vue';
import WOverlay from '../Overlay/Overlay.vue'
import WInput from '../Input/Input.vue';
import WButton from '../Button/Button.vue';
import type { InputInstance } from '../Input/types'
import { isFunction, isNil } from 'lodash-es';

defineOptions({
    name: 'WMessageBox',
    inheritAttrs: false
})

const props = withDefaults(defineProps<MessageBoxProps>(), {
    lockScroll: true,
    showClose: true,
    closeOnClickModal: true,
    confirmButtonType: "primary",
    roundButton: false,
    boxType: "",
    inputValue: "",
    inputPlaceholder:'Please input...',
    confirmButtonText: "Ok",
    cancelButtonText: "Cancel",
    showConfirmButton: true,
})

const { doAction } = props
const { nextZIndex } = useZIndex()
const state = reactive({
    ...props,
    zIndex: nextZIndex()
})
const headerRef = ref<HTMLElement>()
const inputRef = ref<InputInstance>()
const inputId = useId()
const hasMessage = computed(() => !!state.message)
const iconComponent = computed(() => state.icon ?? typeIconMap.get(props.type ?? ''))

watch(() => props.visible?.value, (val) => {
    if (val) state.zIndex = nextZIndex()
    if (props.boxType !== 'prompt') return

    if (!val) return

    nextTick(() => {
        inputRef.value && inputRef.value.focus()
    })
})

function handleWrapperClick() {
    props.closeOnClickModal && handleAction('close')
}

function handleInputEnter(e: KeyboardEvent) {
    if (state.inputType === 'textarea') return
    e.preventDefault()
    return handleAction('confirm')
}

function handleAction(action: MessageBoxAction) {
    isFunction(props.beforeClose) ? props.beforeClose(action, state, () => doAction(action, state.inputValue)) : doAction(action, state.inputValue)
}

function handleClose() {
    handleAction('close')
}
</script>

<template>
    <transition name="fade-in-linear" @after-leave="destroy">
        <WOverlay v-show="(visible as Ref).value" :z-index="state.zIndex" mask>
            <div
                role="dialog"
                class="w-overlay-message-box"
                @click="handleWrapperClick"
            >
                <div
                    ref="rootRef"
                    :class="[
                        'w-message-box',
                        {
                          'is-center': state.center,
                        },
                    ]"
                    @click.stop
                >
                    <div
                        v-if="!isNil(state.title)"
                        ref="headerRef"
                        class="w-message-box__header"
                        :class="{ 'show-close': state.showClose }"
                    >
                        <div class="w-message-box__title">
                            <WIcon
                                v-if="iconComponent && state.center"
                                :class="{
                                    [`w-icon-${state.type}`]: state.type,
                                }"
                                :icon="iconComponent"
                            />
                            {{ state.title }}
                        </div>
                        <button
                            v-if="showClose"
                            class="w-message-box__header-btn"
                            @click.stop="handleClose"
                        >
                            <WIcon icon="xmark" />
                        </button>
                    </div>
                    <div class="w-message-box__content">
                        <WIcon
                            v-if="iconComponent && !state.center && hasMessage"
                            :class="{
                                [`w-icon-${state.type}`]: state.type,
                            }"
                            :icon="iconComponent"
                        />
                        <div v-if="hasMessage" class="w-message-box__message">
                            <slot>
                                <component
                                    :is="state.showInput ? 'label' : 'p'"
                                    :for="state.showInput ? inputId : void 0"
                                >
                                    {{ state.message }}
                                </component>
                            </slot>
                        </div>
                    </div>
                    <div v-show="state.showInput" class="w-message-box__input">
                        <WInput
                            v-model="state.inputValue"
                            ref="inputRef"
                            :placeholder="state.inputPlaceholder"
                            :type="state.inputType"
                            @keyup.enter="handleInputEnter"
                        />
                    </div>
                    <div class="w-message-box__footer">
                        <WButton
                            v-if="state.showCancelButton"
                            class="w-message-box__footer-btn w-message-box__cancel-btn"
                            :type="state.cancelButtonType"
                            :round="state.roundButton"
                            :loading="state.cancelButtonLoading"
                            @click="handleAction('cancel')"
                            @keydown.prevent.enter="handleAction('cancel')"
                        >
                            {{ state.cancelButtonText }}
                        </WButton>
                        <WButton
                            v-show="state.showConfirmButton"
                            class="w-message-box__footer-btn w-message-box__confirm-btn"
                            :type="state.confirmButtonType ?? 'primary'"
                            :round="state.roundButton"
                            :loading="state.confirmButtonLoading"
                            @click="handleAction('confirm')"
                            @keydown.prevent.enter="handleAction('confirm')"
                        >
                            {{ state.confirmButtonText }}
                        </WButton>
                    </div>
                </div>
            </div>
        </WOverlay>
    </transition>
</template>

<style scoped>
@import './style.css';
</style>