<script setup lang="ts">
import type { FormProps, FormEmits, FormItemContext, FormInstance, FormContext } from './types'
import { FORM_CTX_KEY } from './constants'
import { provide, reactive, toRefs } from 'vue'
import { each, filter, includes, size } from 'lodash-es';
import type { ValidateFieldsError } from 'async-validator';

defineOptions({
    name: 'WForm'
})

const props = withDefaults(defineProps<FormProps>(), {
    showMessage: true,
    hideRequiredAsterisk: false,
    requiredAsteriskPosition: 'left',
    labelPosition: 'right'
})

const emits = defineEmits<FormEmits>()

const fields: FormItemContext[] = []

async function doValidateField(fields: FormItemContext[] = []) {
    let validateErrors: ValidateFieldsError = {}
    for (const field of fields) {
        try {
            await field.validate('')
        } catch (error) {
            validateErrors = {
                ...validateErrors,
                ...(error as ValidateFieldsError)
            }
        }
    }
    if (!size(Object.keys(validateErrors))) return true
    return Promise.reject(validateErrors)
}

const addField: FormContext['addField'] = function (filed) {
    if (!filed.prop) return
    fields.push(filed)
}
const removeField: FormContext['removeField'] = function (field) {
    if (!field.prop) return
    fields.splice(fields.indexOf(field), 1)
}

const validateField: FormInstance['validateField'] = async function (keys, callback) {
    try {
        const result = await doValidateField(filterFields(fields, keys ?? []))
        if (result === true) {
            callback?.(result)
        }
        return result
    } catch (error) {
        if (error instanceof Error) throw error
        const invalidFields = error as ValidateFieldsError
        callback?.(false, invalidFields)
        return Promise.reject(invalidFields)
    }
}

const validate: FormInstance['validate'] = async function (callback) {
    return validateField([], callback)
}

const resetFields: FormInstance['resetFields'] = function (keys) {
    each(filterFields(fields, keys ?? []), (field) => field.resetField())
}

const clearValidate: FormInstance['clearValidate'] = function (keys) {
    each(filterFields(fields, keys ?? []), (field) => field.clearValidate())
}

function filterFields (fields: FormItemContext[], keys: string[]) {
    return size(keys) ? filter(fields, (fields) => includes(keys, fields.prop)) : fields
}

const formCtx: FormContext = reactive({
    ...toRefs(props),
    emits,
    addField,
    removeField
})

provide<FormContext>(FORM_CTX_KEY, formCtx)

defineExpose<FormInstance>({
    validate,
    validateField,
    resetFields,
    clearValidate
})
</script>

<template>
    <form class="w-form">
        <slot></slot>
    </form>
</template>

<style scoped>
@import './style.css';
</style>