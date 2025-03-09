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
        title: '专有诊断',
        description: '专有诊断智能助理',
        APIKey: 'app-gje3FPJLaCEc8mlBXO27EAU4'//此APIKey为Dify应用的key
    },
    {
        icon: u202,
        title: '全面报告',
        description: '全面报告智能助理',
        APIKey: 'app-BpGVf8Mh8NyJYCtq9oYnomJi'//此APIKey为Dify应用的key
    }
];

// 讯飞语音听写 WebAPI 接口参数
export const APPID = ''; // 在控制台-我的应用-语音听写（流式版）获取
export const API_SECRET = ''; // 在控制台-我的应用-语音听写（流式版）获取
export const API_KEY = ''; // 在控制台-我的应用-语音听写（流式版）获取

// 确定环境
const isDevelopment = process.env.NODE_ENV === 'development';

// 登录 API 配置 (使用 8000 端口)
let loginApiBaseUrl;
if (isDevelopment) {
  loginApiBaseUrl = 'http://localhost:8000';
} else {
  const apiTarget = import.meta.env.VITE_LOGIN_API_TARGET || '';
  if (apiTarget) {
    loginApiBaseUrl = apiTarget;
  } else {
    // 如果没有设置环境变量，使用默认的 8000 端口
    loginApiBaseUrl = window.location.protocol + '//' + window.location.hostname + ':8000';
  }
}

// 聊天消息 API 配置 (使用默认 80 端口)
let chatApiBaseUrl;
if (isDevelopment) {
  chatApiBaseUrl = 'http://localhost';
} else {
  const apiTarget = import.meta.env.VITE_CHAT_API_TARGET || '';
  if (apiTarget) {
    chatApiBaseUrl = apiTarget;
  } else {
    // 如果没有设置环境变量，使用默认的 80 端口
    chatApiBaseUrl = window.location.protocol + '//' + window.location.hostname;
  }
}

// 导出 API 端点
export const LOGIN_ENDPOINT = `${loginApiBaseUrl}/login`;
export const YOUR_SSE_ENDPOINT = `${chatApiBaseUrl}/v1`;

console.log('登录 API 端点:', LOGIN_ENDPOINT);
console.log('聊天 API 端点:', YOUR_SSE_ENDPOINT);

export const AUTH_TOKEN_KEY = 'userInfo';

// 检查用户是否已登录
export const isAuthenticated = () => {
  const userInfo = localStorage.getItem(AUTH_TOKEN_KEY);
  return !!userInfo;
};

// 获取用户信息
export const getUserInfo = () => {
  const userInfo = localStorage.getItem(AUTH_TOKEN_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

// 获取访问令牌
export const getAccessToken = () => {
  const userInfo = getUserInfo();
  return userInfo ? userInfo.access_token : null;
};

// 登出
export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  window.location.href = '#/login';
};

