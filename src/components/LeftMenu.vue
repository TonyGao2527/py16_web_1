<!--
左侧菜单顶部用户名展示

 -->

<template>
	<!-- 用戶信息大盒子 -->
	<div class="user_box">
		<!-- logo图片 -->
		<img src="../assets/images/logo_xiu_yellow.png" alt="logo" width="45" />

		<!-- 用户信息 -->
		<div class="info">
			<!-- 用户图标 -->
			<el-icon>
				<User />
			</el-icon>

			<!-- el+官网 - DropDown 下拉菜单 - 基础用法- Dropdown List - <el-dropdown> -->
			<el-dropdown>
				<span class="el-dropdown-link">
					<!-- 用户名称 -->
					{{ username }}
					<el-icon class="el-icon--right">
						<arrow-down />
					</el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="$router.push({ name: 'allProject' })">
							选择项目
						</el-dropdown-item>
						<el-dropdown-item @click="logout">
							注销登录
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>

	</div>

	<!-- 菜单列表 -->
	<!-- el+官网 - Menu 菜单 - 侧栏 - 使用 Custom colors - 复制<el-menu标签 -->
	<el-menu router active-text-color="#ffd04b" background-color="#00aa7f" class="el-menu-vertical-demo"
		:default-active="$route.path" text-color="#fff">

		<!-- 项目首页 -->
		<el-menu-item index="/project/index">
			<el-icon>
				<HomeFilled />
			</el-icon>
			<span>项目首页</span>
		</el-menu-item>
		<!-- 接口管理页 -->
		<el-menu-item index="/project/interFace">
			<el-icon>
				<Paperclip />
			</el-icon>
			<span>接口管理</span>
		</el-menu-item>
		<!-- 接口测试页 -->
		<el-menu-item index="/project/test">
			<el-icon>
				<Connection />
			</el-icon>
			<span>接口测试</span>
		</el-menu-item>
		<!-- 测试场景页 -->
		<el-menu-item index="/project/testscent">
			<el-icon>
				<HelpFilled />
			</el-icon>
			<span>测试场景</span>
		</el-menu-item>
		<!-- 测试计划页 -->
		<el-menu-item index="/project/testplan">
			<el-icon>
				<CollectionTag />
			</el-icon>
			<span>测试计划</span>
		</el-menu-item>
		<!-- 测试环境页 -->
		<el-menu-item index="/project/testenv">
			<el-icon>
				<Coin />
			</el-icon>
			<span>测试环境</span>
		</el-menu-item>
		<!-- 定时任务页 -->
		<el-menu-item index="/project/crontab">
			<el-icon>
				<Clock />
			</el-icon>
			<span>定时任务</span>
		</el-menu-item>
		<!-- bug管理页 -->
		<el-menu-item index="/project/bugs">
			<el-icon>
				<Lightning />
			</el-icon>
			<span>bug管理</span>
		</el-menu-item>
		<!-- 测试报表 -->
		<el-menu-item index="/project/records">
			<el-icon>
				<Histogram />
			</el-icon>
			<span>测试报表</span>
		</el-menu-item>
		<!-- 测试报告 -->
		<el-menu-item index="/project/report">
			<el-icon>
				<Histogram />
			</el-icon>
			<span>测试报告</span>
		</el-menu-item>
	</el-menu>
</template>

<script>
	import {
		// elt+官网-搜索Message Box消息弹出框-确认消息
		ElMessageBox,
		ElMessage,
	} from 'element-plus'

	export default {
		methods: {
			// 退出登录
			logout() {
				// 1 弹窗提示窗 用户是否退出登录
				// elt+官网-搜索Message Box消息弹出框-确认消息
				// 复制粘贴 import {ElMessageBox} from 'element-plus'
				ElMessageBox.confirm(
						'确认要退出登录吗?',
						'提示', {
							// 	点击 OK 确认， 点击执行.then()
							confirmButtonText: '确认',
							// 点击 Cancle 取消， 点击执行.catch()
							cancelButtonText: '取消',
							type: 'warning',
						}
					)
					// 2 如果用户点确定，开始删除项目
					// 箭头函数添加async 变成异步函数
					.then(() => {
						// 1 删除浏览器会话中的用户信息、token
						window.sessionStorage.removeItem('token');
						window.sessionStorage.removeItem('username');
						// 2 编程式导航到登录页面
						this.$router.push({
							name: 'login'
						})
					})
					// 4 点击取消 操作执行.catch()
					.catch(() => {
						ElMessage({
							type: 'info', // 样式
							message: '已取消操作', // 提示信息
						})
					})
			},
		},

		computed: {
			username() {
				return window.sessionStorage.getItem('username')
			}
		},
	}
</script>

<style scoped>
	/* 整合盒子样式 */
	.user_box {
		/* 两个模块高度 */
		height: 62px;
		/*  下边框：实线、粗细、颜色 */
		border-bottom: solid 1px #fff;
		/* 弹性布局：元素从左到右排列 */
		display: flex;
		/* 上下居中对齐 */
		align-items: center;
	}

	/* logo样式 */
	.user_box img {
		/* 填充上、下、左、右的像素 */
		padding: 10px 40px 10px 10px;
	}

	/* 用户信息 */
	.info {
		/* 弹性距离 无效果 */
		flex: 1;
		/* 行高度：设置后上下不对齐了：icon居中、文字置顶 */
		line-height: 62px;
		/* 只对用户信息icon有影响 */
		color: #fff;
	}

	/* 用户信息 - 用户名称  */
	.user_box .el-dropdown-link {
		/* 鼠标悬浮 账户名 显示手势图标 */
		cursor: pointer;
		/* 字体颜色 */
		color: #fff;
		/* 行高度：设置后上下对齐了：文字又居中了 */
		line-height: 62px;
	}
</style>