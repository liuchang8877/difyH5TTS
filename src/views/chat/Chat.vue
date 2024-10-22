<template>
  <div class="chat-app">
    <!-- 头部显示 -->
    <header class="chat-header">
      <div class="header-left">
        <button class="menu-button" @click="clickBack"><i class="fa-solid fa-angle-left"></i> </button>
        <div id="result">语音信息：</div>
      </div>
      <img src="../../assets/u13.png" class="avatar" />
      <span class="app-name">DifyH5</span>

    </header>
    <!-- 中间消息体 -->
    <div class="chat-interface">
      <div class="chat-messages" ref="chatMessages">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]"
          :style="{ maxWidth: message.text.length > 6 ? '90%' : '40%' }">
          <div v-if="message.type === 'bot'" class="message-container">
            <!-- <img src="../../assets/u13.png" alt="Bot Avatar" class="avatar" /> -->
            <div class="message-content">
              {{ message.text }}
            </div>
          </div>
          <div v-else class="message-container user-message">
            <!-- <img src="../../assets/u14.png" alt="User Avatar" class="avatar" /> -->
            <div class="message-content">
              {{ message.text }}
            </div>
          </div>
        </div>
      </div>
      <!-- 语音控制*/ -->
      <div class="overlay" v-show="isRecordingShow">
        <div class="slide-action">
          <div class="display-code">{{ displayCode }}</div>
          <div @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
            @mousedown="handleMouseDown" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave" class="instructions">
            松开发送，上滑取消</div>
          <div id="btn_control03" class="slider-bar">
            <canvas ref="waveformCanvas" width="150" height="30"></canvas>
          </div>
        </div>
      </div>
      <!-- 语音控制结束*/ -->

    </div>
    <!-- 底部输入框 -->
    <div class="chat-input">
      <div v-show="isRecording">
        <button id="btn_control02" aria-label="开始录音" class="talk-button" @touchstart="toggleSpeack">按住说话</button>
      </div>
      <button @click="toggleInput" class="toggle-icon-key" v-show="isRecording"></button>

      <!-- 输入框 -->
      <input v-show="!isRecording" v-model="inputMessage" @keyup.enter="sendMessage" placeholder="输入消息..." />
      <button @click="toggleInputSend" class="toggle-icon-send"
        v-show="inputMessage.length > 0 && !isRecording"></button>
      <button @click="toggleInput" class="toggle-icon" v-show="inputMessage.length == 0 && !isRecording"></button>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, onBeforeUnmount, watch, Ref } from 'vue';

// 导入配置文件
import { APPID, API_SECRET, API_KEY, YOUR_SSE_ENDPOINT } from '@/config/assistantConfig.js';

import { useRouter, useRoute } from 'vue-router'; // 导入 Vue Router
const router = useRouter(); // 获取 router 实例// 当前为静态页面，无需额外逻辑


const displayCode = ref(''); // 显示的编码值

// 用于触摸位置、波纹效果和长按检测的状态
const touchStartY = ref(0);
const touchEndY = ref(0);
const isSlidingUp = ref(false); // 标记是否为上滑动作
const rippleWidth = ref(100); // 波纹宽度百分比
let longPressTimer: NodeJS.Timeout | null = null; // 定时器用于检测长按
let isLongPress = ref(false); // 标记是否为长按

// 滑动判断的阈值，决定是否触发“上滑取消”操作
const slideUpThreshold = 50; // 调整此值来设置多少距离算为“上滑”


interface Message {
  text: string;
  type: 'user' | 'bot';
}

declare global {
  interface Window {
    IatRecorder: any;
    handleFileInput: (event: Event) => void;
    CryptoJS: any;
    APPID: string;
    API_SECRET: string;
    API_KEY: string;
  }
}

export default defineComponent({
  name: 'VoiceControl',
  mounted() {
    console.log(this.$route.query.title);  // 'DifyH5'
    console.log(this.$route.query.description);  // 'AI生活咨询，您可打开对话框向我提问'
    console.log(this.$route.query.APIKey);
  },
  methods: {
  },
  setup() {
    const route = useRoute();

    // 检查 route 是否已定义
    if (!route) {
      console.error('Route is undefined');
      return;
    }

    // 再检查 route.query 是否存在
    if (!route.query) {
      console.error('Route query is undefined');
      return;
    }

    const apiKey = route.query.APIKey || 'default_key';
    console.log('APIKey:', apiKey);

    // 获取 canvas 元素
    const canvasRef: Ref<HTMLCanvasElement | null> = ref(null);

    if (canvasRef.value) {
      canvasRef.value.addEventListener('contextmenu', function (e) {
        // 处理 contextmenu 事件
        e.preventDefault();
        console.log('右键菜单事件触发');
      });

      // 禁用长按菜单
      canvasRef.value.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });

      // 禁用多指触控
      canvasRef.value.addEventListener('touchstart', function (e) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });

      // 禁用缩放等手势操作
      canvasRef.value.addEventListener('gesturestart', function (e) {
        e.preventDefault();
      });

      // 禁用长按事件：通过touchend和touchmove来防止长按
      let longPressTimeout;
      canvasRef.value.addEventListener('touchstart', function (e) {
        longPressTimeout = setTimeout(function () {
          e.preventDefault();
        }, 500); // 定义长按时间为500毫秒
      }, { passive: false });

      canvasRef.value.addEventListener('touchend', function () {
        clearTimeout(longPressTimeout);
      });

      canvasRef.value.addEventListener('touchmove', function () {
        clearTimeout(longPressTimeout);
      });
      return {
        canvasRef,
      };
    };

    // 禁用长按事件
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    document.addEventListener('touchstart', function (e) {
      touchStartY.value = e.touches[0].clientY;

      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });

    document.addEventListener('touchend', function (e) {
      touchEndY.value = e.changedTouches[0].clientY;
      // e.preventDefault();
    });
    // 语音控制结束
    const isRecordingShow = ref(false);

    // 监听 touchend 事件
    const handleTouchEndGlobal = (event: TouchEvent) => {
      if (isRecordingShow.value) {
        console.log('手指离开屏幕 - global touchend');
        // 在这里处理手指离开屏幕时的逻辑
        // 例如，停止录音、发送消息等操作

        if (touchStartY.value - touchEndY.value > 50) {
          isRecordingShow.value = false;
          isRecording.value = false;
          console.log('上滑取消');
          inputMessage.value = '';
        } else {
          //设置延时
          setTimeout(function () {
            isRecordingShow.value = false;
            isRecording.value = false;
            sendMessage();
          }, 800);
        }
      }
    };

    // 监听 isRecordingShow 的变化
    watch(isRecordingShow, (newVal) => {
      if (newVal) {
        // 当 overlay 展示时，添加全局的 touchend 事件监听器
        document.addEventListener('touchend', handleTouchEndGlobal);
      } else {
        inputMessage.value = '';
        // 当 overlay 隐藏时，移除事件监听器
        document.removeEventListener('touchend', handleTouchEndGlobal);
      }
    });

    onBeforeUnmount(() => {
      // 在组件销毁前，移除事件监听器以防止内存泄漏
      document.removeEventListener('touchend', handleTouchEndGlobal);
    });

    // 禁用长按弹出菜单和文字选择
    document.documentElement.style.webkitTouchCallout = 'none';
    document.documentElement.style.webkitUserSelect = 'none';


    //音频
    const waveformCanvas = ref<HTMLCanvasElement | null>(null);
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array;

    const startRecording = async () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);
        drawWaveform();
      }
    };

    const stopRecording = () => {
      audioContext?.close();
      audioContext = null;
    };

    const drawWaveform = () => {
      if (!waveformCanvas.value || !analyser) return;

      const canvasCtx = waveformCanvas.value.getContext('2d');
      if (!canvasCtx) return;

      const draw = () => {
        if (!analyser) return;
        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        if (canvasCtx && waveformCanvas.value) {
          canvasCtx.clearRect(0, 0, waveformCanvas.value.width, waveformCanvas.value.height);
          const barWidth = 2; // 竖线的宽度更细
          const barGap = 8;   // 竖线之间的间隔
          const totalBars = Math.floor(waveformCanvas.value!.width / (barWidth + barGap));
          const startX = (waveformCanvas.value!.width - totalBars * (barWidth + barGap)) / 2; // 计算居中

          let x = startX;

          for (let i = 0; i < dataArray.length; i += Math.floor(dataArray.length / totalBars)) {
            const v = dataArray[i] / 128.0;
            const y = (v * waveformCanvas.value!.height) / 2;

            canvasCtx.fillStyle = '#000';
            canvasCtx.fillRect(x, waveformCanvas.value!.height / 2 - y / 2, barWidth, y);

            x += barWidth + barGap;
          }
        } else {
          console.error('Canvas context or waveformCanvas is not initialized');
        }
      };

      draw();
    };

    //音频结束

    // Event handlers
    const handleTouchStart = (event: TouchEvent) => {
      console.log('handleTouchStart');
      event.preventDefault();
      touchStartY.value = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      console.log('handleTouchMove');
      event.preventDefault();
      touchEndY.value = event.touches[0].clientY;
    };


    const handleTouchEnd = () => {
      console.log('handleTouchEnd');
      if (touchStartY.value - touchEndY.value > 50) {
        onSlideUp(); // 触发上滑取消事件
      } else if (isLongPress.value) {
        onLongPressEnd(); // 触发长按结束事件
      } else {
        onRelease(); // 触发松开事件
      }
      rippleWidth.value = 100; // 重置波纹宽度
      clearLongPressTimer(); // 松开时清除长按计时
      isSlidingUp.value = false; // 重置滑动状态
    };

    // 鼠标事件处理以支持桌面长按
    const handleMouseDown = (event: MouseEvent) => {
      console.log('handleMouseDown');

      event.preventDefault(); // 阻止右键菜单和其他默认行为

      startLongPressTimer();
    };

    const handleMouseUp = () => {
      console.log('handleMouseUp');

      if (isLongPress.value) {
        onLongPressEnd(); // 触发长按结束事件
      }
      clearLongPressTimer();
    };

    const handleMouseLeave = () => {
      console.log('handleMouseLeave');

      clearLongPressTimer();
      isRecordingShow.value = false;
      isRecording.value = false;
      // sendMessage();
    };

    // 根据滑动的距离动态更新波纹的长度
    const updateRippleWidth = () => {
      const distance = Math.abs(touchStartY.value - touchEndY.value);
      rippleWidth.value = Math.min(100, Math.max(10, distance)); // 控制波纹宽度在10%到100%之间
    };

    // 开始长按计时
    const startLongPressTimer = () => {
      isLongPress.value = false;
      longPressTimer = setTimeout(() => {
        isLongPress.value = true;
        onLongPress(); // 触发长按事件
      }, 800); // 长按时间设为800毫秒
    };

    // 清除长按计时
    const clearLongPressTimer = () => {
      //直接去除音波
      stopRecording();

      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      isLongPress.value = false;
    };

    // 预留的上滑事件
    const onSlideUp = () => {
      console.log('上滑取消操作已触发');
      isRecordingShow.value = false;
      isRecording.value = false;
      inputMessage.value = '';
    };

    // 预留的松开事件
    const onRelease = () => {
      console.log('发送操作已触发');
      isRecordingShow.value = false;
      isRecording.value = false;
      // sendMessage();
    };

    // 预留的长按事件
    const onLongPress = () => {
      console.log('长按操作已触发');
      isRecordingShow.value = false;
      isRecording.value = false;
      // sendMessage();
    };

    // 预留的长按结束事件
    const onLongPressEnd = () => {
      console.log('长按结束操作已触发');
      isRecordingShow.value = false;
      isRecording.value = false;
      // sendMessage();


    };


    const isRecording = ref(false);
    const isSending = ref(false);
    const messages = ref<Message[]>([]);
    const inputMessage = ref('');
    const chatMessages = ref(null);
    const recordingButtonText = ref('语音');
    let iatRecorder: any = null;

    const toggleSpeack = () => {
      console.log('toggleSpeack');
      isRecordingShow.value = true;
      displayCode.value = ''; //  清除显示的代码
      //音波
      startRecording(); // 开始录音

    };
    const toggleInputSend = () => {
      console.log('toggleInputSend');
      sendMessage(); // 发送消息
      // isRecording.value = !isRecording.value;
    };
    const toggleInput = () => {
      console.log('toggleInput');
      isRecording.value = !isRecording.value;
    };
    const clickBack = () => {
      window.location.assign('#/home');
    };

    onMounted(() => {

      const scripts = [
        '../../assets/js/crypto-js.js',
        '../../assets/js/index.umd.js',
        '../../assets/js/index.js',
        '../../assets/js/processor.worker.js',
        '../../assets/js/processor.worklet.js'
      ];

      const loadScript = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = false;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
          document.body.appendChild(script);
        });
      };

      const loadScriptsSequentially = async () => {
        for (const src of scripts) {
          await loadScript(src);
        }
      };

      loadScriptsSequentially().catch(error => {
        console.error('Failed to load scripts:', error);
      });


      // 设置全局变量
      window.APPID = APPID;
      window.API_SECRET = API_SECRET;
      window.API_KEY = API_KEY;

      //addMessage('欢迎来到聊天室！', 'bot');
      //设置SSE监听
      //setSSlisenter();
      // 监听 id="result" 的变化
      const resultElement = document.getElementById('result');
      if (resultElement) {
        const observer = new MutationObserver((mutationsList) => {
          mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
              inputMessage.value = resultElement.textContent || '';
              //接收到直接展示
              //receiveText(resultElement.textContent || '', 'user');
              //持续显示
              displayCode.value = resultElement.textContent || '';
            }
          });
        });

        observer.observe(resultElement, { childList: true, subtree: true, characterData: true });
      }

    });

    const toggleRecording = () => {
      if (recordingButtonText.value === '开始录音') {
        iatRecorder?.start();
        recordingButtonText.value = '停止录音';
      } else {
        iatRecorder?.stop();
        recordingButtonText.value = '开始录音';
      }
    };

    //发送消息
    const sendMessage = () => {
      if (inputMessage.value.trim()) {
        addMessageUser(inputMessage.value, 'user');
        //sendDataToServer(inputMessage.value);
        //setSSlisenter(inputMessage.value);
        //sendChatMessage('app-rgewKdvOXgc4cawdiShKp7sY');
        //initializeSSE(); // 初始化SSE

        // 调用 postData 发送 POST 请求并随后监听 SSE
        postData();
      }
    };

    const postData = async () => {
      const url = YOUR_SSE_ENDPOINT + '/chat-messages';
      const data = {
        "inputs": {},
        "query": inputMessage.value,
        "response_mode": "streaming",
        "conversation_id": "",
        "user": "abc-123",
        "files": [
          {
            "type": "image",
            "transfer_method": "remote_url",
            "url": "https://cloud.dify.ai/logo/logo-site.png"
          }
        ]
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      };
      //app-HLbiRQwvtpeu8uabPAPwqUVW
      //apiKey

      try {
        // 使用 fetch 发送 POST 请求
        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
        });

        // 检查响应是否成功
        if (!response.ok) {
          console.error('POST request failed:', response.statusText);
          return;
        }

        completeMessage(); // 完成后重置缓冲区ßß
        // 处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';  // 用于缓冲数据的字符串
        let done = false;

        while (!done) {
          // 读取流数据
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          const chunk = decoder.decode(value, { stream: true });

          // 拼接每个数据块
          buffer += chunk;

          // 处理 "data:" 前缀的数据块
          let parts = buffer.split('data: ');
          for (let i = 1; i < parts.length; i++) {
            const message = parts[i].trim();  // 获取实际的 JSON 字符串
            try {
              const parsedChunk = JSON.parse(message);
              console.log('Parsed chunk:', parsedChunk);

              if (parsedChunk.event === 'agent_message') {
                receiveText(parsedChunk.answer, 'bot');
              }
              //处理工作流
              else if (parsedChunk.event === 'node_finished') {
                if (parsedChunk.data.outputs.answer) {
                  receiveText(parsedChunk.data.outputs.answer, 'bot');
                }
              }

            } catch (err) {
              console.error('Error parsing chunk:', err);
            }
          }
          buffer = parts[parts.length - 1];  // 保留最后一个不完整的数据块
        }

        console.log('Stream complete');

      } catch (error) {
        console.error('Error during POST request:', error);
      }

    };

    let messageBuffer = ''; // Buffer to accumulate the received text

    const addMessage = (text: string, type: 'user' | 'bot') => {
      if (messages.value.length === 0 || messages.value[messages.value.length - 1].type !== type) {
        // If there are no messages or the last message is from a different type, add a new message
        messages.value.push({ text: '', type });
      }

      // Update the buffer with new text
      messageBuffer += text;

      // Update the last message's text with the accumulated buffer
      messages.value[messages.value.length - 1].text = messageBuffer;

      nextTick(() => {
        if (chatMessages.value) {
          const chatContainer = chatMessages.value;
          chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        }
      });

    };

    // Example function to reset the buffer when the message is complete
    const finalizeMessage = () => {
      messageBuffer = ''; // Reset the buffer after processing is complete
      inputMessage.value = ''; // 清空输入框

    };

    // 模拟持续接收消息的调用示例
    // 假设这是从某个数据流中接收到的新文本
    const receiveText = (text, type: 'user' | 'bot') => {
      addMessage(text, type); // 当收到新消息时调用 addMessage
    };

    // 当消息接收完毕时
    const completeMessage = () => {
      finalizeMessage(); // 当消息接收完毕时调用 finalizeMessage
    };

    const addMessageUser = (text: string, type: 'user' | 'bot') => {
      messages.value.push({ text, type });

      nextTick(() => {
        if (chatMessages.value) {
          const chatContainer = chatMessages.value;
          chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        }
      });

    };

    let chatReplyBuffer = '';

    const handleChatReply = (text: string) => {
      chatReplyBuffer += text;
      addMessage(chatReplyBuffer, 'bot');
    };

    return {
      messages,
      inputMessage,
      chatMessages,
      recordingButtonText,
      toggleRecording,
      sendMessage,
      isRecordingShow,
      isRecording,
      isSending,
      toggleSpeack,
      toggleInput,
      toggleInputSend,
      clickBack,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      updateRippleWidth,
      handleMouseDown,
      handleMouseUp,
      handleMouseLeave,
      startLongPressTimer,
      clearLongPressTimer,
      onSlideUp,
      onRelease,
      onLongPress,
      waveformCanvas,
      startRecording,
      stopRecording,
      displayCode,
      rippleWidth,
      isSlidingUp,
      longPressTimer,
      slideUpThreshold,
      touchStartY,
      touchEndY,
      isLongPress,



    };

  }
});
</script>

<style scoped>
#result {
  display: none;
}

.chat-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f6f6f6;
}

.chat-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: #f0f8ff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0 0;
  position: fixed;
  /* 固定在顶部 */
  height: 40px;
  top: 0;
  left: 0;
  right: 0;
}

.header-left {
  display: flex;
  align-items: center;
  position: absolute;
  /* 绝对定位，确保左侧显示 */
  left: 5px;
  /* 距离左侧一定距离 */
}

.menu-button {
  background: none;
  border: none;
  font-size: 16px;
  color: #4a93e5;
  /* 设置返回按钮为蓝色 */
  cursor: pointer;
  margin-right: 2px;
  text-decoration: none;
  /* 去除下划线 */
}

.app-name {
  font-size: 18px;
  margin-top: 6px;
  font-weight: bold;
  color: #333;
  /* 设置文字颜色为黑色 */
}

/* .chat-interface {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #fff;
  border-radius: 8px 8px 0 0;

  top: 10vh;
  bottom: 10vh;
} */

.chat-interface {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  flex-grow: 1;
  min-height: 0;
  /* 关键：允许子元素正确收缩 */
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  line-height: 1.6;
  min-height: 0;
  /* 允许在 flex 布局下正确滚动 */
  margin-top: 60px;
  margin-bottom: 60px;
}

/* .chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 8vh;
  padding: 10px;
  max-height: 100%;
  line-height: 1.6;
  margin-bottom: 12vh;
} */

/* max-width: 60%; */
.message {

  padding: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
  word-wrap: break-word;
}

.user {
  background-color: #ffffff;
  align-self: flex-end;
  margin-left: auto;
}

.bot {
  background-color: #ffffff;
  align-self: flex-start;
}

.chat-input {
  display: flex;
  align-items: center;
  /* 使按钮和输入框对齐 */
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #e3dfdf;
  /* 设置背景色为白色 */
  border-radius: 0 0 0px 0px;
  position: fixed;
  height: 40px;
  /* 确保高度固定 */
  /* 固定在顶部 */
  bottom: 0;
  left: 0;
  right: 0;
  /* z-index: 1000; 确保header在最前面 */
}


input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-right: 10px;
  font-size: 16px;
  /* 调整字体大小 */
}

button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: rgb(8, 8, 8);
  border: none;
  /* border-radius: 20px; */
  cursor: pointer;
  margin-left: 5px;
  font-size: 16px;
  /* 调整按钮字体大小 */
  transition: background-color 0.3s;
  /* 添加过渡效果 */
}

button:hover {
  background-color: #45a049;
}

/* .chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  line-height: 1.6;
  border: 1px solid #ccc;
} */

.message-container {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2px;
}

.message-content {
  background-color: #e6f7ff;
  padding: 10px;
  border-radius: 15px;
  /* max-width: 90%; */
  white-space: pre-wrap;
  /* 保留换行符并自动换行 */
  /* word-wrap: break-word; */
}

.bot .message-container {
  flex-direction: row;
}

.user-message {
  flex-direction: row-reverse;
  margin-right: 2px;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin: 0 10px;
}

.user .message-content {
  background-color: #e6f7ff;
  text-align: right;
  border: 1px solid #ccc;
}

.bot .message-content {
  background-color: #ffffff;
  text-align: left;
  border: 1px solid #ccc;
}

.toggle-icon {
  width: 30px;
  /* 根据需要调整大小 */
  height: 30px;
  background: url('../../assets/voice.png') no-repeat center;
  background-size: cover;
  border: none;
  cursor: pointer;
  /* z-index: 10;
  /* 设置更高的 z-index */
  /* position: relative; */
  /* 确保按钮层级正常 */
}

.toggle-icon-send {
  width: 30px;
  /* 根据需要调整大小 */
  height: 30px;
  background: url('../../assets/send.png') no-repeat center;
  background-size: cover;
  border: none;
  cursor: pointer;
}

.toggle-icon-key {
  width: 30px;
  /* 根据需要调整大小 */
  height: 30px;
  background: url('../../assets/key.png') no-repeat center;
  background-size: cover;
  border: none;
  cursor: pointer;
  /* z-index: 10; */
  /* 设置更高的 z-index */
  /* position: relative; */
  /* 确保按钮层级正常 */
}

.talk-button {
  min-width: 80px;
  /* 最小宽度 */
  padding: 10px;
  border: none;
  border-radius: 20px;
  background-color: #f0f0f0;
  cursor: pointer;
  width: 85vw;
  /* 宽度为视口的 80% */
}

/*语音录入*/
/* .slide-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
} */

/* 覆盖整个屏幕的灰色蒙层 */
.overlay {
  position: fixed;
  bottom: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  /* 灰色蒙层，透明度50% */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
}

.slide-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  /* 固定在屏幕上 */
  bottom: 0;
  /* 位置固定在页面底部 */
  width: 100vw;
  /* 占据整个视口的宽度 */
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 105px 105px 0 0;
  /* 仅上半部分弧形，底部直角 */
  box-shadow: 0 4px 8px rgba(7, 6, 6, 0.1);
  /* 阴影效果 */
  overflow: hidden;
  z-index: 1000;
  /* 确保其处于较高层级，盖住其他内容 */
}

.display-code {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  height: 100px;
  /* 固定高度 */
  overflow-y: auto;
  /* 垂直滚动 */
  word-wrap: break-word;
  /* 自动换行 */
  padding-top: 25px;
  /* 左侧留出20px的间距 */
  padding-left: 20px;
  /* 左侧留出20px的间距 */
  padding-right: 20px;
  /* 右侧留出20px的间距 */
}

.instructions {
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
}

.slider-bar {
  width: 80%;
  height: 40px;
  background: linear-gradient(to right, #80c3ff, #4a90e2);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.slider-track {
  height: 100%;
  background: linear-gradient(to right, #80c3ff, #4a90e2);
  border-radius: 20px;
  transition: width 0.3s;
  display: flex;
  justify-content: center;
  /* 确保内容居中 */
  align-items: center;
  /* 垂直居中 */
}

canvas {
  background-color: transparent;
  /* 背景透明 */
  display: block;
  margin: 0 auto;
  z-index: 1300;
  /* 水平居中 */
}

/* 禁用系统手势行为 */
html,
body {
  touch-action: none;
  /* 禁止所有手势 */
}

/*  */
</style>