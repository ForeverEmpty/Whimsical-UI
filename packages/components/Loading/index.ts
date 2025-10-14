import { vLoading } from './directive'
import { Loading } from './service'
import type { App } from 'vue'

export const WLoading = {
    name: 'WLoading',
    install(app: App) {
        app.directive('loading', vLoading)
        app.config.globalProperties.$loading = Loading
    },
    directive: vLoading,
    service: Loading
}


export default WLoading

export {
    vLoading,
    Loading as WLoadingService,
    vLoading as WLoadingDirective
}

export * from './types'