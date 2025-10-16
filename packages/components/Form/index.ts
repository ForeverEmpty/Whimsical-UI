import Form from './Form.vue'
import FormItem from './FormItem.vue'
import { withInstall } from '@whimsical-ui/utils'

export const WForm = withInstall(Form)
export const WFormItem = withInstall(FormItem)

export * from './types'