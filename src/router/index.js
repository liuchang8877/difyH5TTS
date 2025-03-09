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
  console.log('路由导航到:', to.path);
  
  // 获取用户登录状态
  const userInfo = localStorage.getItem('userInfo');
  const isLoggedIn = !!userInfo;
  
  console.log('用户登录状态:', isLoggedIn);
  
  // 如果用户已登录且尝试访问登录页面或根路径，重定向到 home 页面
  if (isLoggedIn && (to.path === '/login' || to.path === '/')) {
    console.log('已登录用户尝试访问登录页面，重定向到首页');
    next({ path: '/home' });
    return;
  }
  
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      // 未登录，重定向到登录页面
      console.log('未登录用户尝试访问需要认证的页面，重定向到登录页面');
      next({ name: 'login' });
    } else {
      // 已登录，允许访问
      console.log('已登录用户访问受保护页面，允许通过');
      next();
    }
  } else {
    // 不需要认证的路由，直接访问
    console.log('访问不需要认证的页面，允许通过');
    next();
  }
});

export default router 