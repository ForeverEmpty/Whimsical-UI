import { createApp } from 'vue'
import App from './App.vue'
import WhimsicalUI from 'whimsical-ui'

const app = createApp(App)
app.use(WhimsicalUI)
app.mount('#app')
