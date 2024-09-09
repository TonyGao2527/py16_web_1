<!--  

需求：实现一个登录的主页 Login.vue
	template 创建 div class=login_box 再创建子标签 div class=title
		1 添加文本 Lemon测试平台
		2 表单复制：element plus官网 -组建 - Form 表单 - 典型表单 - 复制代码 - 复制el-form表单及内容 。
			粘贴表单标签，与title的div并列不是包含，保留第一个el-form-item子标签，其他子标签都删掉。
		3 创建数据 script - export default - data - return 中创建对象 
			loginForm: {				
				username: '',
				password: '',
				status: false
			}
		4 修改 el-input表单 :model="loginFrom.username"
			或者在 el-form-item中指定也行，
			修改 el-form-item 中 label="用户名"
			再复制一份 el-form-item ，修改 label="密码" v-model="loginForm.password"
		5 添加记住账号，实际他是一个switch开关
			element plus官方文档 - 组件 - “Switch 开关” - 基础用法 - 复制 el-switch v-model="value1"
			修改 v-model="loginForm.status"
			复制 el-form-item 闭合标签，放入其中。
		6 添加登录按钮
			element plus官方文档 - 组件 - “Button 按钮” - 基础用法 - 复制 一个按钮 按钮的type是指定颜色 - 修改文案为登录
			复制 el-form-item 闭合标签，放入其中。
		7 导入父组件 - 注册 - template 使用 <Login></Login>
		8 查看
			a 用户名和密码添加默认文案，在el-input标签添加 
				placeholder="体验账号：test"
				placeholder="密码：123456"
			b 输入框、登录按钮 左侧的文案删掉 ， 删除el-input标签中的label；
			c 添加图标，需要在 element plus - 组件 - Icon 图标 - 需要安装 注册 才能使用
			d 修改 登录按钮宽度 - element plus - 组件 - Button 按钮 - 底部的 Button API 接口 - 可能没有
				那就通过样式表添加 el-button标签添加 style="width: 100%" 就是父元素el-from标签宽度的100% 120px * 100%
		9 设置box样式
		要设置局部样式：style标签添加 属性 scoped
			设置整体样式
				.login_box {
					设置大小 width: ; height:
					设置左右间隔：margin:
				}							
			设置标题演示	
				.title {
					/* bold加粗 28px字号/50字间距 字体 */
					font: bold 28px/50px "microsoft yahei";
					/* 文字 水平居中 */
					text-align: center;
				}
		10 添加背景 水纹波效果
			src/component - 新建LoginBack.vue
				直接粘贴老师给的现成的代码
			Login.vue - script - import 引入
			Login.vue - export default {}- compoent: {} - 注册
			Login.vue - template - 创建闭合标签
				<div class="login_box"> 放入闭合标签
			注意是 是该文件引入注册，不是在App.vue




登录逻辑：
	复制 AxiosDemo04.vue中引入、创建实例方法、拦截器(这个不必要)
	粘贴在Login.vue - script中。
	添加method:{} 添加异步请求方法 async login(){}
		方法内添加 try{}catch(e){} 异常捕获
			try{}内 使用请求实例发送post()请求，
			const response变量接收结果
			post(路径，参数)
				参数 使用 export default - data - return中的loginForm，
				参数 在上面按钮点击做的双向绑定，它也是个普通对象传参后自动变成json
			添加判断，响应为200则取响应token
			if else 添加 成功失败 alert标记
			catch(){} 添加 日志、alert("报错提示")
	export default-data-return-添加token: null 存储数据
	登录按钮添加绑定事件 @click="login"
	验证：进入浏览器页面 点击登录按钮

课件笔记：
	向后端发起请求，后面请求也会用 axios
	获取数据既可以使用 then和catch 也可以使用async
	await只能在 async 异步函数中使用，否则报错。



笔记21

// 存储token、用户账密，
	1 Login.vue - async loginRequest - if response.status === 200
		- 注释掉 this.token = response.data.token;
	2 存储在 浏览器 会话存储中：token和用户名的key,val，
		window.sessionStorage.setItem('token', response.data.token);
		window.sessionStorage.setItem('username', response.data.username)
			存token是为了给其他路由页面校验用的
			存用户名username是为了登录成功后页面展示用户信息
		response.data.token
		response.data.username
			是后端接口来的

	3 存储在 本地 会话存储中：用户名的key,val，
		// 判断是否记住账号，如果状态码 = true(勾选了记住密码)；
		if (this.loginForm.status) {
			// 对象转换成JSON字符串
			const strUserInfo = JSON.stringify(this.loginForm);
			// 存储 账密 到本地会话
			window.localStorage.setItem('userInfo', strUserInfo);
		}
		
		// 登录成功之后，导航跳转到项目列表页
		this.$router.push({
			name: 'allProject'
		});
	
		预览-勾选但没有记住账号密码，
			是因为代码只进行了存到本地存储中，没有进行取。
		methods:{} - 并列添加created(){}
			// 钩子函数，会在页面渲染之前进行调用
			created(){
				// 取出存入本地的用户信息，使用变量接受
				const strUserInfo = window.localStorage.getItem('userInfo')
				// 判断 如果提取出来的对象不是空的
				if (strUserInfo){
					// 字符串转化成对象，再赋值给this.loginForm
					this.loginForm = JSON.parse(strUserInfo)
				}
			},
		
	浏览器登录验证：输入用户名、密码，勾选记住密码，点登录。实现记住密码


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
		padding_bottom: 30px;
	}
</style>