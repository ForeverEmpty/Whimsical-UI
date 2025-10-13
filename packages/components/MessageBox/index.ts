import MessageBox from './methods'
import { set } from 'lodash-es'
import type { App } from 'vue'

export const WMessageBox = MessageBox

set(WMessageBox, 'install', (app: App) => {
    app.config.globalProperties.$msgbxo = MessageBox
    app.config.globalProperties.$message = MessageBox
    app.config.globalProperties.$alert = MessageBox.alert
    app.config.globalProperties.$confirm = MessageBox.confirm
    app.config.globalProperties.$prompt = MessageBox.prompt
})

export default WMessageBox
export * from './types'