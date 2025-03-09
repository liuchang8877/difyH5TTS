import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/login'
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/chat/Chat.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home/Home.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 获取用户登录状态
  const userInfo = localStorage.getItem('userInfo');
  const isLoggedIn = !!userInfo;
  
  // 如果用户已登录且尝试访问登录页面或根路径，重定向到 home 页面
  if (isLoggedIn && (to.path === '/login' || to.path === '/')) {
    next({ path: '/home' });
    return;
  }
  
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      // 未登录，重定向到登录页面
      next({ name: 'login' });
    } else {
      // 已登录，允许访问
      next();
    }
  } else {
    // 不需要认证的路由，直接访问
    next();
  }
});

export default router 