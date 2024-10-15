<template>
  <div class="assistant-list">
    <div class="assistant-item" v-for="(item, index) in items" :key="index" @click="clickItem(item, index)">
      <img :src="item.icon" alt="icon" class="icon" />
      <div class="content">
        <h3 class="title">{{ item.title }}</h3>
        <p class="description">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'; // 导入 Vue Router
const router = useRouter(); // 获取 router 实例// 当前为静态页面，无需额外逻辑

// 导入配置文件
import { items } from '@/config/assistantConfig.js';

const clickItem = (item, index) => {

  router.push({
    path: '/chat',
    query: { title: item.title, description: item.description,APIKey: item.APIKey }
  });

};

</script>


<style scoped>
.assistant-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.assistant-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  transition: box-shadow 0.3s ease;
}

.assistant-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 16px;
}

.content {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.description {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0 0;
}
</style>