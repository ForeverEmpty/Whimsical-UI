import { makeInstall } from '@whimsical-ui/utils'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import components from './components'
import '@whimsical-ui/theme/index.css'

library.add(fas)
const installer = makeInstall(components)

export * from '@whimsical-ui/components'
export default installer