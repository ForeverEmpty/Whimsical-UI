import { makeInstall } from '@whimsical-ui/utils'
import components from './components'
import '@whimsical-ui/theme/index.css'

const installer = makeInstall(components)

export * from '@whimsical-ui/components'
export default installer