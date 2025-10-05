import { createApp } from 'vue'
import App from './App.vue'
import WhimsicalUI from 'whimsical-ui'
import 'whimsical-ui/dist/index.css'

const app = createApp(App)
app.use(WhimsicalUI)
app.mount('#app')
