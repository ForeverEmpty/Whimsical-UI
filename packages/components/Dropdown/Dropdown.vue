<script setup lang="ts">
import type { 
    DropdownProps, 
    DropdownEmits, 
    DropdownInstance, 
    DropdownItemProps 
} from './types'
import { DROPDOWN_CTX_KEY } from './contants'
import DropdownItem from './DropdownItem.vue'
import WTooltip from '../Tooltip/Tooltip.vue'
import { WButton, WButtonGroup } from '../Button/index'
import { ref, provide, computed } from 'vue'
import type { TooltipInstance } from '../Tooltip/types'
import type { ButtonInstance } from '../Button/types'
import { omit, isNil } from 'lodash-es'

defineOptions({
    name: 'WDropdown',
    inheritAttrs: false
})

const props = withDefaults(defineProps<DropdownProps>(), {
    hideOnClick: true,
    items: () => [] as DropdownItemProps[]
})
const emits = defineEmits<DropdownEmits>()
const slots = defineSlots()

const tooltipRef = ref<TooltipInstance>()
const triggerRef = ref<ButtonInstance>()

const tooltipProps = computed(() => omit(props, ['items', 'hideOnClick', 'size', 'type', 'splitButton']))

function handleItemClick(e: DropdownItemProps) {
    props.hideOnClick && tooltipRef.value?.hide()
    !isNil(e.command) && emits('command', e.command)
}

provide(DROPDOWN_CTX_KEY, {
    handleItemClick,
    size: computed(() => props.size)
})

defineExpose<DropdownInstance>({
    open: () => tooltipRef.value?.show(),
    close: () => tooltipRef.value?.hide()
})
</script>

<template>
    <div class="w-dropdown" :class="{'isdisabled': props.disabled}">
        <WTooltip 
            ref="tooltipRef" 
            v-bind="tooltipProps" 
            :virtual-triggering="splitButton" 
            :virtual-ref="triggerRef"
            @visible-change="$emit('visible-change', $event)"
        >
            <WButtonGroup 
                v-if="splitButton" 
                :type="type" 
                :size="size" 
                :disabled="disabled"
            >
                <WButton @click="$emit('click', $event)">
                    <slot name="default"></slot>
                </WButton>
                <WButton ref="triggerRef" icon="angle-down" />
            </WButtonGroup>
            <slot name="default" v-else></slot>
            <template #content>
                <div class="w-dropdown__menu">
                    <slot name="dropdown">
                        <template v-for="item in items" :key="item.command">
                            <DropdownItem v-bind="item" />
                        </template>
                    </slot>
                </div>
            </template>
        </WTooltip>
    </div>
</template>

<style scoped>
@import './style.css';

:deep(.w-button-group) {
    & > :last-child{
        padding: 5px 7px;
    }
}
</style>