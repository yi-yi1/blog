import { createApp } from 'vue'
import type { App as VueApp } from 'vue'
import './style.css'
import App from './App.vue'

// 创建 Vue 应用实例，带完整的类型检查
const app: VueApp = createApp(App)

// 挂载应用到 DOM
const mountElement = document.getElementById('app')
if (!mountElement) {
  throw new Error('Mount element #app not found in HTML')
}

app.mount(mountElement)
