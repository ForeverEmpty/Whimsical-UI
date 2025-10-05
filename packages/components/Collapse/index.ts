import Collapse from './Collapse.vue'
import CollapseItem from './CollapseItem.vue'
import { withInstall } from '@whimsical-ui/utils/install'

export const WCollapse = withInstall(Collapse)
export const WCollapseItem = withInstall(CollapseItem)

export * from './types'