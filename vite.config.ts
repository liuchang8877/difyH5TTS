import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";
import styleImport, { VantResolve } from 'vite-plugin-style-import';
import fullReload from 'vite-plugin-full-reload';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	// 检查process.cwd()路径下.env.develeport.local、.env.development、.env.local、.env这四个环境文件
	loadEnv(mode, process.cwd());
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
					target: 'http://localhost/v1',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '') // 将匹配到的api替换成''
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
	};
});