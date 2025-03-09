<template>
  <div class="login-container">
    <div class="login-box">
      <h2>登录</h2>
      <div class="input-group">
        <label for="username">用户名</label>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          placeholder="请输入用户名"
          @keyup.enter="login"
        />
      </div>
      <div class="input-group">
        <label for="password">密码</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="请输入密码"
          @keyup.enter="login"
        />
      </div>
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      <button class="login-button" @click="login" :disabled="isLoading">
        {{ isLoading ? '登录中...' : '登录' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { LOGIN_ENDPOINT, AUTH_TOKEN_KEY, isAuthenticated } from '@/config/assistantConfig.js';

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const isLoading = ref(false);

    // 检查是否已登录
    onMounted(() => {
      if (isAuthenticated()) {
        // 已登录，直接跳转到 home 页面
        router.push('/home');
      }
      console.log('使用登录端点:', LOGIN_ENDPOINT);
    });

    const login = async () => {
      // 表单验证
      if (!username.value || !password.value) {
        errorMessage.value = '请输入用户名和密码';
        return;
      }

      try {
        isLoading.value = true;
        errorMessage.value = '';
        console.log('正在发送登录请求到:', LOGIN_ENDPOINT);

        // 构建登录请求
        const response = await fetch(LOGIN_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            'Connection': 'keep-alive'
          },
          body: JSON.stringify({
            username: username.value,
            password: password.value
          })
        });

        console.log('登录响应状态:', response.status);

        if (!response.ok) {
          let errorMsg = '登录失败，请检查用户名和密码';
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } catch (e) {
            console.error('解析错误响应失败:', e);
          }
          throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log('登录成功:', data);

        // 存储登录信息到本地存储
        localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(data));

        // 登录成功，跳转到 home 页面而不是聊天页面
        router.push('/home');
      } catch (error) {
        console.error('登录错误:', error);
        errorMessage.value = error.message || '登录失败，请稍后再试';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      username,
      password,
      errorMessage,
      isLoading,
      login
    };
  }
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f6f6f6;
}

.login-box {
  width: 90%;
  max-width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #4a90e2;
  outline: none;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 15px;
  font-size: 14px;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #3a7bc8;
}

.login-button:disabled {
  background-color: #a0c4e8;
  cursor: not-allowed;
}
</style> 