import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { computed } from 'vue';

// 通过Vite的import.meta.glob()方法实现自动化导入路由
const mainRouterModules = import.meta.glob('../layout/*.vue')
const viewRouterModules = import.meta.glob('../views/**/*.vue')

// 子路由
const childRoutes = Object.keys(viewRouterModules).map((path) => {
	const childName = path.match(/\.\.\/views\/(.*)\.vue$/)[1].split('/')[1];
	return {
		path: `/${childName.toLowerCase()}`,
		name: childName,
		component: viewRouterModules[path]
	}
})

// 根路由
const rootRoutes = Object.keys(mainRouterModules).map((path) => {
	const name = path.match(/\.\.\/layout\/(.*)\.vue$/)[1].toLowerCase();
	const routePath = `/${name}`;
	if (routePath === '/index') {
		return {
			path: '/',
			name: `${name}`,
			redirect: '/home',
			component: mainRouterModules[path],
			children: childRoutes
		};
	}
})


// 手动添加登录路由
const chatRoute: RouteRecordRaw = {
	path: '/chat',
	name: 'Chat',
	component: () => import('../views/chat/Chat.vue'), // 根据实际路径调整
	meta: { hideTabBar: true }, // 在登录页面设置 hideTabBar 元信息
};

// 合并所有路由
const routes: Array<RouteRecordRaw> = [ chatRoute,...rootRoutes].filter(Boolean);

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

// 修改 Layout.vue 中的 showTabBar 计算属性逻辑
const showTabBar = computed(() => {
	// 根据路由元信息判断是否显示 TabBar
	return !routes.meta.hideTabBar;
});

export default router;