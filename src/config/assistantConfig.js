// src/config/assistantConfig.js
import u13 from '@/assets/u13.png';
import u14 from '@/assets/u14.png';

export const items = [
    {
        icon: u13,
        title: '授权与通知',
        description: '出入场景的授权与取消授权，并通知消息',
        APIKey: 'app-hILJDPrW83NhCkotiJOWjBSo' //此APIKey为Dify应用的key
    },
    {
        icon: u14,
        title: '身份规则查询',
        description: '人员身份转换的规则查询',
        APIKey: 'app-oKEYRW76oveX5dAfyFvynBfh'//此APIKey为Dify应用的key
    }
];

export const APPID = "";//注意修改为自己的科大讯飞TTS APPID
export const API_SECRET = "";//注意修改为自己的科大讯飞TTS API_SECRET
export const API_KEY = "";//注意修改为自己的科大讯飞TTS API_KEY
export const YOUR_SSE_ENDPOINT = "http://localhost/v1";