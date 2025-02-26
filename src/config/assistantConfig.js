// src/config/assistantConfig.js
import u13 from '@/assets/u13.png';
import u14 from '@/assets/u14.png';
import u201 from '@/assets/u201.png';
import u202 from '@/assets/u202.png';
import u203 from '@/assets/u203.png';

export const items = [
    {
        icon: u201,
        title: '知识库',
        description: '智能客服',
        APIKey: 'app-3Nh9mCTHArV6QeobOXFyjaiB' //此APIKey为Dify应用的key
    },
    {
        icon: u203,
        title: '身份规则查询',
        description: '人员身份转换的规则查询',
        APIKey: 'app-65r1OYxOSxGfGsP6XkBg987X'//此APIKey为Dify应用的key
    },
    {
        icon: u202,
        title: '身份规则新增',
        description: '人员身份转换的规则增加',
        APIKey: 'app-BpGVf8Mh8NyJYCtq9oYnomJi'//此APIKey为Dify应用的key
    }
];

export const APPID = "e744e845";//注意修改为自己的科大讯飞TTS APPID
export const API_SECRET = "NzNmYzZkNDE0ZjJmNTZjNjQyMGM2ZWI5";//注意修改为自己的科大讯飞TTS API_SECRET
export const API_KEY = "472fb85982b85765712ea7cefc0b7f95";//注意修改为自己的科大讯飞TTS API_KEY
// export const YOUR_SSE_ENDPOINT = "http://192.168.157.153/v1";
export const YOUR_SSE_ENDPOINT = "/api";
// export const YOUR_SSE_ENDPOINT = "http://meeting2023.newcapec.cn/v1";

