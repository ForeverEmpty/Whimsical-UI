import makeInstall from './makeInstaller'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import components from './components'
import printLogo from './printLogo'

import '@whimsical-ui/theme/index.css'

library.add(fas)
const installer = makeInstall(components)
printLogo()

export * from '@whimsical-ui/components'
export * from '@whimsical-ui/locale'
export default installer