<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-container">
        <img src="../../assets/logo.png" alt="Logo" class="logo" />
        <h1 class="app-title">知识库</h1>
      </div>
      
      <form @submit.prevent="login" class="input-group">
        <div class="input-container">
          <input 
            type="text" 
            v-model="username" 
            placeholder="请输入用户名" 
            class="login-input"
            @keyup.enter="focusPassword"
            ref="usernameInput"
          />
        </div>
        
        <div class="input-container">
          <input 
            type="password" 
            v-model="password" 
            placeholder="请输入密码" 
            class="login-input"
            @keyup.enter="login"
            ref="passwordInput"
          />
        </div>
        
        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
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
    const rememberMe = ref(false);
    const usernameInput = ref(null);
    const passwordInput = ref(null);

    // 检查是否已登录
    onMounted(() => {
      if (isAuthenticated()) {
        // 已登录，直接跳转到 home 页面
        router.push('/home');
      }
      console.log('使用登录端点:', LOGIN_ENDPOINT);
    });

    const focusPassword = () => {
      passwordInput.value?.focus();
    };

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
        localStorage.setItem('userInfo', JSON.stringify(data));
        localStorage.setItem(AUTH_TOKEN_KEY, data.access_token || '');
        
        // 确保登录状态已更新
        console.log('用户信息已保存，准备跳转到首页');
        
        // 登录成功，跳转到 home 页面
        setTimeout(() => {
          router.push('/home');
        }, 100);
      } catch (error) {
        console.error('登录错误:', error);
        errorMessage.value = error.message || '登录时出错，请稍后再试';
        
        // 登录失败时自动聚焦到密码输入框
        setTimeout(() => {
          passwordInput.value?.focus();
          passwordInput.value?.select();
        }, 100);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      username,
      password,
      errorMessage,
      isLoading,
      rememberMe,
      usernameInput,
      passwordInput,
      login,
      focusPassword
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
  background: linear-gradient(135deg, #4a90e2, #6a5acd);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 15px;
  background-color: white;
  padding: 10px;
  margin-bottom: 15px;
}

.app-title {
  color: white;
  font-size: 24px;
  font-weight: 500;
  margin: 0;
}

.input-group {
  width: 100%;
  margin-bottom: 30px;
}

.input-container {
  position: relative;
  margin-bottom: 15px;
  width: 100%;
}

.login-input {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 25px;
  background-color: white;
  font-size: 16px;
  box-sizing: border-box;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.login-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3);
}

.login-button {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 25px;
  background-color: #4a90e2;
  color: white;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
}

.login-button:hover:not(:disabled) {
  background-color: #3a80d2;
}

.login-button:disabled {
  background-color: #a0c4e8;
  cursor: not-allowed;
}

.error-message {
  color: #ff4d4f;
  margin-top: 10px;
  text-align: center;
  background-color: rgba(255, 77, 79, 0.1);
  padding: 8px;
  border-radius: 4px;
  width: 100%;
}

.remember-me {
  display: flex;
  align-items: center;
  margin-top: 15px;
  color: white;
}

.remember-me input {
  margin-right: 8px;
}
</style> 