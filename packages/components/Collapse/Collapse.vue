<script setup lang="ts">
import type { CollapseProps, CollapseItemName, CollapseEmits } from './types'
import { COLLAPSE_CTX_KEY } from './contants'
import { ref, provide, watch, watchEffect } from 'vue'
import { debugWarn } from '../../utils'

const COMP_NAME = 'WCollapse' as const

defineOptions({
  name: 'WCollapse',
})

const props = defineProps<CollapseProps>()
const emits = defineEmits<CollapseEmits>()

const activeNames = ref(props.modelValue)

watchEffect(() => {
    if (props.accordion && activeNames.value.length > 1) debugWarn(COMP_NAME ,'accordion mode should only have one active item')
})

function handleItemClick(item: CollapseItemName) {
    let _activeNames = [...activeNames.value]

    if (props.accordion) {
        _activeNames = [_activeNames[0] === item ? '' : item]
        updateActiveNames(_activeNames)
        return
    }

    const index = _activeNames.indexOf(item)

    if (index > -1) _activeNames.splice(index, 1)
    else _activeNames.push(item)

    updateActiveNames(_activeNames)
}

function updateActiveNames(newNames: CollapseItemName[]) {
    activeNames.value = newNames
    emits('update:modelValue', newNames)
    emits('change', newNames)
}

watch(() => props.modelValue, (newNames) => updateActiveNames(newNames))

provide(COLLAPSE_CTX_KEY, {
    activeNames,
    handleItemClick
})

</script>

<template>
    <div class="w-collapse">
        <slot></slot>
    </div>
</template>

<style scoped>
@import './style.css';
</style>