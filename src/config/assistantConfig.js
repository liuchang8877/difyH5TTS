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
        APIKey: 'app-3Nh9mCTHArV6QeobOXFyjaiB' //此APIKey为Dify应用的key
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

// 确保正确读取环境变量并处理HTTPS
const API_TARGET = import.meta.env.VITE_API_TARGET || '';
console.log('Raw API Target:', API_TARGET);

// 确保使用HTTPS并处理路径
let apiEndpoint;
if (API_TARGET) {
  // 确保使用HTTPS以避免混合内容问题
  apiEndpoint = API_TARGET.startsWith('https://') 
    ? API_TARGET 
    : API_TARGET.replace('http://', 'https://');
} else {
  // 如果没有设置API_TARGET，使用当前域名
  apiEndpoint = window.location.origin;
}

// 导出配置
export const YOUR_SSE_ENDPOINT = apiEndpoint;
export const APPID = import.meta.env.VITE_APPID || '';
export const API_SECRET = import.meta.env.VITE_API_SECRET || '';
export const API_KEY = import.meta.env.VITE_API_KEY || '';

console.log('Final API Endpoint:', YOUR_SSE_ENDPOINT);

// export const YOUR_SSE_ENDPOINT = "http://192.168.157.153/v1";
// export const YOUR_SSE_ENDPOINT = "http://meeting2023.newcapec.cn/v1";

