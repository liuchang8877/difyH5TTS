import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// 创建应用实例
const app = createApp(App)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')

// 添加全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('应用错误:', err)
  console.error('错误信息:', info)
}

console.log('应用已启动，环境:', import.meta.env.MODE) 