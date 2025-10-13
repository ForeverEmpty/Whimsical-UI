import Notification from './methods'
import { withInstallFunction } from '@whimsical-ui/utils'

export const WNotification = withInstallFunction(Notification, '$notification')

export * from './types'