import ConfigProvider from './ConfigProvider.vue'
import { withInstall } from '@whimsical-ui/utils'

export const WConfigProvider = withInstall(ConfigProvider)

export * from './hooks'
export * from './type'