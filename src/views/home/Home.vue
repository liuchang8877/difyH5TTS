<template>
  <div class="home-container">
    <div class="header">
      <h1 class="title">应用列表</h1>
      <button class="logout-button" @click="logout">退出登录</button>
    </div>
    <div class="app-list">
      <div 
        v-for="(item, index) in items" 
        :key="index" 
        class="app-item"
        @click="navigateToChat(item)"
      >
        <img :src="item.icon" class="app-icon" />
        <div class="app-info">
          <h2 class="app-title">{{ item.title }}</h2>
          <p class="app-description">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { items, isAuthenticated, logout as logoutUser } from '@/config/assistantConfig.js';

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter();

    // 在组件挂载时检查登录状态
    onMounted(() => {
      if (!isAuthenticated()) {
        // 如果未登录，重定向到登录页面
        router.push('/login');
      }
    });

    const navigateToChat = (item) => {
      router.push({
        path: '/chat',
        query: {
          title: item.title,
          description: item.description,
          APIKey: item.APIKey
        }
      });
    };

    const logout = () => {
      // 使用 assistantConfig.js 中的 logout 函数
      logoutUser();
    };

    return {
      items,
      navigateToChat,
      logout
    };
  }
});
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.title {
  margin: 0;
  color: #333;
}

.logout-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #d32f2f;
}

.app-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.app-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.app-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.app-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  margin-right: 15px;
  object-fit: cover;
}

.app-info {
  flex: 1;
}

.app-title {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #333;
}

.app-description {
  margin: 0;
  color: #666;
  font-size: 14px;
}
</style>