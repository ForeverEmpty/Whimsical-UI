import Message from './methods'
import { withInstallFunction } from '@whimsical-ui/utils'

export const WMessage = withInstallFunction(Message, '$message')
export * from './types'