<!--  
需求：实现一个登录的主页 Login.vue
登录逻辑：
-->

<template>
	<LoginBack>
		<!-- <div> -->
		<div class="login_box">
			<!-- <div> -->
			<div class="title">
				<img src="../assets/images/修宇测试平台.png" alt="测试平台" />
			</div>
			<el-form :model="loginForm" :rules="loginRules" ref="loginRef">
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" placeholder="体验账号：test">
						<!-- 图标在输入框 左侧 显示-->
						<template #prefix>
							<!-- 设置图标大小 -->
							<el-icon :size="24">
								<User />
							</el-icon>
						</template>
					</el-input>
				</el-form-item>

				<el-form-item prop="password">
					<el-input v-model="loginForm.password" placeholder="密码：test123456">
						<template #prefix>
							<el-icon :size="24">
								<Lock />
							</el-icon>
						</template>
					</el-input>
				</el-form-item>

				<!-- 记住密码，也就是switch开馆 -->
				<el-form-item label="记住密码">
					<el-switch v-model="loginForm.status" />
				</el-form-item>

				<!-- 登录按钮 -->
				<el-form-item>
					<!-- clickLogin方法传入表单<el-form ref的值loginRef -->
					<el-button style="width: 100%" type="danger" @click="clickLogin('loginRef')" color="#006b9d">
						登录
					</el-button>
				</el-form-item>
			</el-form>
		</div>
	</LoginBack>
</template>

<script>
	// 引入背景 模块
	import LoginBack from '../components/LoginBack.vue'

	// element+官网-组件-Message 消息提示-文字居中
	import {
		ElMessage
	} from 'element-plus'


	export default {
		data() {
			return {
				loginForm: {
					username: '',
					password: '',
					status: false
				},
				token: null,
				loginRules: {
					username: [{
							required: true, // 表示是否必须传值
							message: '账号不能为空', // 为传值的提示信息
							trigger: 'blur' // 何时触发，blur为光标移出输入框时触发
						},
						{
							min: 3, // 最小长度
							max: 5, // 最大长度
							message: '长度在 3 到 5 个字符',
							trigger: 'blur'
						}
					],
					password: [{
						required: true, // 表示是否必须传值
						message: '密码不能为空', // 为传值的提示信息
						trigger: 'blur' // 何时触发，blur为光标移出输入框时触发
					}, ],
				},
			}
		},
		methods: {
			// el官网 - 组件 - Form表单 -表单验证 -查看源码
			// 点击登录按钮表单校验+登录请求接口
			// 点击确认按钮之后，调用登录接口之前，进行校验表格
			clickLogin(formName) {
				// $refs 是vue实例提供的一个默认的全局属性，搜集所以组件中标签有设置ref的地方，统一存放在有key和value是map中；
				// validate ：是对整个表单进行校验的方法，参数为一个回调函数，(valid) => {} 箭头函数、匿名函数；
				// 该回调函数，会在表单校验结束后被调用，第一个参数布尔值，为表单校验是否通过；
				this.$refs[formName].validate((valid) => {
					// 校验是否通过
					if (valid) {
						// 请求登录接口
						this.loginRequest();
					}
				});
			},
			async loginRequest() {
				try {
					// const response = await httpDev.post('/login/', this.loginForm);
					const response = await this.$api.loginApi(this.loginForm);
					if (response.status == 200) {
						// 存储登录获取的token信息
						// this.token = response.data.token;

						// 获取token和用户名的key,val，存储在浏览器会话中
						window.sessionStorage.setItem('token', response.data.token);
						window.sessionStorage.setItem('username', response.data.username);

						// 判断是否记住账号，如果状态码 = true；
						if (this.loginForm.status) {
							// 转换成JSON字符串
							const strUserInfo = JSON.stringify(this.loginForm);
							// 存储 账密 到本地会话中
							window.localStorage.setItem('userInfo', strUserInfo);
						}

						// 登录成功之后，导航到项目列表页面
						this.$router.push({
							name: 'allProject'
						});

						// le+官网-Message 消息提示-文字居中
						ElMessage({
							// 是否可以关闭
							showClose: true,
							// 展示的消息
							message: '登录成功',
							// 是否居中
							center: true,
							type: 'success',
						})
					} else {
						// alert("登录失败");
						ElMessage({
							showClose: true,
							message: '登录失败',
							center: true,
							type: 'warning',
						})
					}
				} catch (e) {
					ElMessage({
						showClose: true,
						message: '登录报错',
						center: true,
						type: 'error',
					})
				}
			}
		},
		// 添加钩子，在页面渲染之前进行调用
		created(){
			// 取出用户信息，使用变量接受
			const strUserInfo = window.localStorage.getItem('userInfo')
			// 判断 如果提取出来的对象不是空的
			if (strUserInfo){
				// 字符串转化成对象，再赋值给this.loginForm
				this.loginForm = JSON.parse(strUserInfo)
			}
		},
		components: {
			// 注册的引入的组件
			LoginBack
		},
	}
</script>

<!-- scope 局部样式 -->
<style scoped>
	@import '../assets/css/main.css';

	/* 设置整体样式 */
	.login_box {
		width: 500px;
		height: 400px;
		/* 
		vh代表视口高度的百分比，100vh等于视口高度的100% 
		使用100vh可以确保元素的高度始终与视口高度相匹配，无论视口的大小如何变化。
		这对于创建全屏背景、占满整个屏幕的布局或者垂直居中元素等场景非常有用。
		
		margin 外边框
		calc((100vh - 200px)/2) 上下边距
			calc(100vh -); 贴在最左侧
			calc(100vh - 200px); 与左侧有边距
		auto 水平居中
		*/
		margin: calc((100vh - 400px)/2) auto;
	}

	/* 设置标题样式 */
	.title {
		/* bold加粗 28px字号/50字间距 字体 */
		/* font: bold 28px/50px "microsoft yahei"; */
		/* color: #00aaff; */
		/* 文字 水平居中 */
		text-align: center;
		/* 添加底部区域的高度 没啥效果 */
		padding-bottom: 30px;
	}
</style>