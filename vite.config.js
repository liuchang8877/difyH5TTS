import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  console.log('Building with mode:', mode)
  console.log('API Target:', env.VITE_API_TARGET)
  
  return defineConfig({
    // 设置正确的基础路径
    base: './', // 使用相对路径，这样资源文件会以相对路径加载
    
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 如果有全局 SCSS 变量，可以在这里添加
          // additionalData: `@import "@/assets/scss/variables.scss";`
        }
      }
    },
    define: {
      // 确保环境变量在客户端代码中可用
      'import.meta.env.VITE_API_TARGET': JSON.stringify(env.VITE_API_TARGET),
      'import.meta.env.VITE_APPID': JSON.stringify(env.VITE_APPID),
      'import.meta.env.VITE_API_SECRET': JSON.stringify(env.VITE_API_SECRET),
      'import.meta.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY),
    },
    build: {
      sourcemap: false,
      // 自定义输出目录中的资源文件名格式
      assetsDir: 'assets', // 所有静态资源将放在 assets 目录下
      rollupOptions: {
        output: {
          // 自定义入口文件名
          entryFileNames: 'assets/js/[name].[hash].js',
          // 自定义块文件名
          chunkFileNames: 'assets/js/[name].[hash].js',
          // 自定义资源文件名
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            
            // 根据文件类型分类存放
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
              return `assets/images/[name].[hash].[ext]`;
            }
            
            if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
              return `assets/fonts/[name].[hash].[ext]`;
            }
            
            if (/\.(css)$/.test(assetInfo.name)) {
              return `assets/css/[name].[hash].[ext]`;
            }
            
            return `assets/[ext]/[name].[hash].[ext]`;
          },
          // 确保 CSS 文件正确输出
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'; // 将第三方库代码单独打包
            }
          }
        }
      }
    },
    server: {
      https: true, // 启用HTTPS开发服务器
      proxy: {
        '/api': {
          target: 'http://meeting2023.newcapec.cn',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/v1')
        }
      }
    },
  })
} 