import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";
import styleImport, { VantResolve } from 'vite-plugin-style-import';
import fullReload from 'vite-plugin-full-reload';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	// 加载环境变量
	const env = loadEnv(mode, process.cwd());
	const apiTarget = env.VITE_API_TARGET || 'http://localhost:8000/v1';
	
	console.log('当前API目标:', apiTarget); // 调试输出

	return {
		// 静态资源基础路径 base: './' || '',
		base: '',

		resolve: {
			alias: {
				// 配置src目录
				"@": path.resolve(__dirname, "src"),
				// 导入其他目录
				"components": path.resolve(__dirname, "components")
			}
		},
		plugins: [
			vue(),
			// 配置后，Vant各组件才生效
			styleImport({
				resolves: [VantResolve()],
			}),
			fullReload(['src/**/*'], { // 监视 src 目录下的所有文件
				delay: 200, // 设置延迟时间
			}),
		],

		// 跨域代理
		server: {
			https: true,
			host: '0.0.0.0',
			proxy: {
				'/api': {
					target: apiTarget, // 使用环境变量中的API目标
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''), // 将匹配到的api替换成''
					secure: false, // 允许无效或自签名证书
					ws: true, // 支持websocket
				}
			},
			hmr: true, // 默认开启，不需要额外配置
			watch: {
				// 调整文件监听的性能参数
				usePolling: true, // 开启轮询方式监控文件变化
				interval: 1000, // 每秒检查一次文件变化
			},
			timeout: 60000, // 请求超时时间
		}
	}
});