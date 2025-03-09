import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { vuexStore, piniaStore } from './store';
import '@fortawesome/fontawesome-free/css/all.css';

// // 引入 vConsole
// import VConsole from 'vconsole';

// // 初始化 vConsole
// const vConsole = new VConsole();
// console.log('vConsole is ready');


// 移动端适配
import 'lib-flexible/flexible.js';

// 引入全局样式
import './assets/scss/index.scss';

// 全局引入按需引入UI库 vant
import { vantPlugins } from './plugins/vant.js';

//全局公共组件
import components from './plugins/components.js';

// 在应用启动时打印环境变量，帮助调试
console.log('Application environment:', import.meta.env.MODE);
console.log('API Target:', import.meta.env.VITE_API_TARGET);

createApp(App).use(vuexStore).use(piniaStore).use(router).use(vantPlugins).use(components).mount('#app');