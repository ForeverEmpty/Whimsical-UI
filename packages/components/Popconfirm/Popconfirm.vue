<script setup lang="ts">
import type { PopconfirmProps, PopconfirmEmits } from './types'
import { ref, computed } from 'vue'
import { addUnit } from '@whimsical-ui/utils'
import { useLocale } from '@whimsical-ui/hooks'

import WTooltip from '../Tooltip/Tooltip.vue'
import WButton from '../Button/Button.vue'
import WICon from '../Icon/Icon.vue'
import type { TooltipInstance } from '../Tooltip'

defineOptions({
    name: 'WPopconfirm'
})

const props = withDefaults(defineProps<PopconfirmProps>(), {
    title: '',
    confirmButtonType: 'primary',
    icon: 'question-circle',
    iconColor: '#f90',
    hideAfter: 200,
    width: 150
})
const emits = defineEmits<PopconfirmEmits>()

const tooltipRef = ref<TooltipInstance>()
const style = computed(() => ({
    width: addUnit(props.width)
}))

const locale = useLocale()

function hidePooper() {
    tooltipRef.value?.hide()
}

function confim(e: MouseEvent) {
    emits('confirm', e)
    hidePooper()
}

function cancel(e: MouseEvent) {
    emits('cancel', e)
    hidePooper()
}
</script>

<template>
    <WTooltip ref="tooltipRef" trigger="click" :hide-timeout="hideAfter">
        <template #content>
            <div class="w-popconfirm" :style="style">
                <div class="w-popconfirm__main">
                    <WICon v-if="!hideIcon && icon" :icon="icon" :color="iconColor" />
                    {{ title }}
                </div>
            </div>
            <div class="w-popconfirm__action">
                <WButton size="small" :type="cancelButtonType" @click="cancel">
                    {{ cancelButtonText || locale.t('popconfirm.cancelButtonText') }}
                </WButton>
                <WButton size="small" :type="confirmButtonType" @click="confim">
                    {{ confirmButtonText || locale.t('popconfirm.confirmButtonText') }}
                </WButton>
            </div>
        </template>
        <template v-if="$slots.default" #default>
            <slot name="default"></slot>
        </template>
        <template v-if="$slots.reference" #default>
            <slot name="reference"></slot>
        </template>
    </WTooltip>
</template>

<style scoped>
@import './style.css';
</style>