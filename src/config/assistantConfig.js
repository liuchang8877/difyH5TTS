// src/config/assistantConfig.js
import u13 from '@/assets/u13.png';
import u14 from '@/assets/u14.png';
import u201 from '@/assets/u201.png';
import u202 from '@/assets/u202.png';
import u203 from '@/assets/u203.png';

export const items = [
    {
        icon: u201,
        title: '个人知识库',
        description: '智能助理',
        APIKey: 'app-Ldb8XC7DRni6UMysWSmWrmGq' //此APIKey为Dify应用的key
    },
    {
        icon: u203,
        title: '专项问题',
        description: '专项问题智能助理',
        APIKey: 'app-gje3FPJLaCEc8mlBXO27EAU4'//此APIKey为Dify应用的key
    },
    {
        icon: u202,
        title: '全面报告',
        description: '全面报告智能助理',
        APIKey: 'app-BpGVf8Mh8NyJYCtq9oYnomJi'//此APIKey为Dify应用的key
    }
];

// 应用配置
export const APPID = 'your_app_id';
export const API_SECRET = 'your_api_secret';
export const API_KEY = 'your_api_key';

// 本地存储键名
export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_INFO_KEY = 'userInfo';

// API 端点配置
const isDevelopment = import.meta.env.DEV;

// 登录 API 使用 8000 端口
export const loginApiBaseUrl = isDevelopment 
  ? 'http://localhost:8000' 
  : window.location.origin;

// 聊天消息 API 使用默认 80 端口
export const chatApiBaseUrl = isDevelopment 
  ? 'http://localhost' 
  : window.location.origin;

export const LOGIN_ENDPOINT = `${loginApiBaseUrl}/login`;
export const YOUR_SSE_ENDPOINT = `${chatApiBaseUrl}/v1`;

console.log('登录 API 端点:', LOGIN_ENDPOINT);
console.log('聊天 API 端点:', YOUR_SSE_ENDPOINT);

// 检查用户是否已登录
export function isAuthenticated() {
  const userInfo = localStorage.getItem('userInfo');
  return !!userInfo;
}

// 获取用户信息
export function getUserInfo() {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
}

// 获取访问令牌
export function getAccessToken() {
  const userInfo = getUserInfo();
  return userInfo?.access_token || null;
}

// 登录函数
export async function loginUser(username, password) {
  try {
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
        username,
        password
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
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(data));
    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token || '');
    
    return true;
  } catch (error) {
    console.error('登录过程中出错:', error);
    throw error;
  }
}

// 登出函数
export function logout() {
  localStorage.removeItem(USER_INFO_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  console.log('用户已登出，本地存储已清除');
  
  // 重定向到登录页面
  window.location.href = '#/login';
}

