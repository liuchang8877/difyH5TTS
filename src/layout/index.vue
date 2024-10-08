<script setup lang="ts">
import { ref, reactive, toRefs } from "vue";
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

//底部tab栏相关
const useTabBar = () => {
  const state = reactive({
    tabBar: [
      {
        title: "首页",
        to: {
          name: "Home",
        },
        icon: "home-o",
      },
      {
        title: "我",
        to: {
          name: "About",
        },
        icon: "user-o",
      },
    ],
  });
  return toRefs(state);
};
const { tabBar } = useTabBar();

// 是否显示 TabBar 的逻辑
const showTabBar = computed(() => {
  const hideTabBarRoutes = ['Login', 'Comm', 'Chat','ChatOne','Private','User']; // 定义需要隐藏 TabBar 的路由名称
  console.log('当前路由名称:', route.name); // 调试输出当前路由名称
  console.log('是否显示 TabBar:', !hideTabBarRoutes.includes(route.name as string));
  return !hideTabBarRoutes.includes(route.name as string); // 当路由名称不在 hideTabBarRoutes 中时显示 TabBar
});

// 处理 TabBar 的切换事件
const handleChange = (tab) => {
  router.push(tab.path); // 路由跳转
};

</script>

<template>
  <div class="app-container">
    <div class="layout-content">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
      <RequestLoading></RequestLoading>
    </div>

    <!-- <div class="layout-footer" v-if="showTabBar">
    <TabBar :data="tabBar" @change="handleChange"></TabBar>
  </div> -->
  </div>
</template>

<style lang="scss" scoped>
</style>