<template>
	<div class="profile-page">
		<div class="user-info">
			<img class="avatar" :src="avatar" alt="User Avatar" />
			<div class="user-details">
				<p class="username">姓名：{{ username }}</p>
				<p class="phone-number">手机号：{{ phonenumber }}</p>
			</div>
		</div>
		<ul class="menu-list">
			<li class="menu-item" @click="priclick">服务协议</li>
			<li class="menu-item" @click="loginout">退出登录</li>
		</ul>
	</div>
</template>

<script>
import u17 from '@/assets/u17.jpg';
import { getInfo } from "@/api/about";
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router'; // 引入 useRouter

export default {
	name: "ProfilePage",
	setup() {
		const username = ref(''); // 替换为实际的用户名
		const phonenumber = ref(''); // 替换为实际的手机号
		const avatar = u17;
		const router = useRouter(); // 使用 useRouter 获取路由实例

		const priclick = () => {
			//alert("点击了《个人信息保护政策》");
			//localStorage.setItem('isAuthenticated', 'true');
			router.push('/user');
		};

		const loginout = () => {
			localStorage.removeItem('isAuthenticated');
			localStorage.removeItem('usertoken');
			router.push('/login'); // 使用 router.push 导航到登录页面
		};

		const getInfoData = async () => {
			const usertoken = localStorage.getItem('usertoken');

			let headers = {
				"Authorization": usertoken
			};

			console.log('getInfoData headers', JSON.stringify(headers));

			const result = await getInfo({}, headers);

			console.log('getInfoData result', JSON.stringify(result));

			if (result.code === 200) {
				username.value = result.user.nickName;

				phonenumber.value = result.user.phonenumber;
			}
		};

		onMounted(() => {
			console.log('onMounted');
			// 获取用户信息
			getInfoData();
		});

		return {
			username,
			phonenumber,
			avatar,
			loginout,
			priclick
		};
	}
};
</script>

<style scoped>
.profile-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #f5f5f5;
	height: 100vh;
	padding: 20px;
	box-sizing: border-box;
}

.user-info {
	display: flex;
	align-items: center;
	background-color: #eff6fb;
	padding: 20px;
	border-radius: 8px;
	width: 90%;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	margin-bottom: 20px;
	border: 1px solid #e0e0e0;
}

.avatar {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	margin-right: 15px;
	object-fit: cover;
	border: 2px solid #ffffff;
}

.user-details {
	display: flex;
	flex-direction: column;
}

.username {
	margin: 0;
	font-size: 18px;
	color: #333;
	font-weight: bold;
	/* Add this line to make the text bold */

}

.phone-number {
	margin-top: 20px;
	font-size: 16px;
	color: #333;
}

.menu-list {
	list-style: none;
	padding: 0;
	width: 100%;
}

.menu-item {
	background-color: #ffffff;
	padding: 15px;
	margin-bottom: 10px;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	font-size: 16px;
	color: #333;
	cursor: pointer;
	text-align: center;
	border: 1px solid #e0e0e0;
}
</style>