<template>
	<!-- 页面 整体框 -->
	<div class="projects_box">
		<!-- 	<div class="projects_box" v-for="item in project_list" :key="item.id"> -->
		<!-- 项目 顶部框 -->
		<div class="top_box">
			<span>项目列表</span>
			<el-button @click="logout" type="success" icon="UserFilled">退出登录</el-button>
			<el-button @click="addDialog = true" type="success" icon="CirclePlus">添加项目</el-button>
		</div>
		<!-- 项目 列表 -->
		<div class="project_list">
			<!-- 添加项目卡片标签 -->
			<el-card class="project" v-for="item in project_list" :key="item.id">

				<!-- 添加盒子，点击任意位置 跳转项目详情页-->
				<!-- <div @click="$router.push({ name: 'project'})" style="cursor: pointer;"> -->
				<!-- @click="selectPro(item)" 
						1 存储项目信息到 store-state-pro
						2 跳转到项目详情页 
				-->
				<div @click="selectPro(item)" style="cursor: pointer;">

					<!-- <el-card class="project"> -->
					<!-- 项目图标 -->
					<div class="project_icon">
						<el-icon>
							<Platform />
						</el-icon>
					</div>
					<!-- 项目名称 -->
					<div class="project_name">
						<!-- 判断长度，<=8正常展示 -->
						<span v-if="item.name.length <= 8">{{ item.name }}</span>
						<!-- 长度>8部分省略号替代 -->
						<!-- 要添加 鼠标悬浮，展示全文提示框 <el-tooltip -->
						<!-- element+官网-Totip 文字提示-主题-Dark- 拷贝代码el-tooltip闭合标签 -->
						<!-- 属性 :content 添加冒号：绑定内容 -->
						<!-- 属性 placement是悬浮显示的方向 -->
						<!-- 属性 effect 悬浮颜色，默认dark黑色，可改成light白色。API中可查 -->
						<!-- 添加class="project_name_tooltip" 类属性后面布局； -->
						<!-- e-else 应放在外层标签<el-tooltip 中 -->
						<el-tooltip v-else class="project_name_tooltip" :content="item.name" placement="top">
							<!-- 将>=8的span标签放在<el-tooltip>悬浮标签中显示 -->
							<!-- .slice是截取，从0到第8个 -->
							<span>{{ item.name.slice(0, 8) }}...</span>
						</el-tooltip>
					</div>
					<!-- 项目负责人 -->
					<div class="project_leader">
						<span v-if="item.leader.length <= 4">负责人：{{ item.leader }}</span>
						<el-tooltip v-else class="project_leader_tooltip" :content="item.leader" placement="top">
							<span>负责人：{{ item.leader.slice(0, 4) }}...</span>
						</el-tooltip>
					</div>

				</div>

				<!-- 项目操作按钮：编辑、删除 -->
				<div class="project_buttons">
					<!-- 使用tag替代button -->
					<!-- type指定颜色 -->
					<!-- style是css样式 -->
					<!-- float: left 是左对齐 -->
					<el-tag @click="clickEdit(item)" class="ml-2" type="info" style="float: left; " color="#efefef">
						<!-- 添加icon图标 在文案左侧 -->
						<!-- vertical-align垂直对齐 middle居中。但效果不好，页面放大就不居中了-->
						<el-icon style="vertical-align: middle;">
							<Edit />
						</el-icon>
						<span>编 辑</span>
					</el-tag>

					<el-tag @click="delPro(item.id)" class="ml-2" type="info" style="float: right;" color="#efefef">
						<el-icon>
							<Delete />
						</el-icon>
						<span>删 除</span>
					</el-tag>
				</div>
			</el-card>

			<!-- 添加显示➕加号的空标签，点击后可添加项目 -->
			<!-- text-align 水平对齐 -->
			<!-- line-height 文本间距 -->
			<!-- cursor 光标悬浮 手势 -->
			<el-card @click="addDialog = true" class="project"
				style="text-align: center; line-height: 250px; color: #d0d0d0; cursor: pointer">
				<!-- 添加 加好icon 设置大小 -->
				<el-icon size="50px">
					<Plus />
				</el-icon>
			</el-card>
		</div>
	</div>

	<!-- 创建项目按钮 点击弹窗 -->
	<!-- element+官网-Dialog 对话框-自定义内容-open a Form... -->
	<el-dialog v-model="addDialog" title="添加项目" width=30%>
		<el-form :model="addForm">
			<el-form-item label="项目名称">
				<el-input v-model="addForm.name" autocomplete="off" />
			</el-form-item>
			<el-form-item label="负责人">
				<el-input v-model="addForm.leader" autocomplete="off" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="addDialog = false">取消</el-button>
				<el-button type="primary" @click="clickAddPro">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>

	<!-- 编辑/更新项目按钮 点击弹窗 -->
	<!-- element+官网-Dialog 对话框-自定义内容-open a Form... -->
	<el-dialog v-model="editDialog" title="添加项目" width=30%>
		<el-form :model="editForm">
			<el-form-item label="项目名称">
				<el-input v-model="editForm.name" autocomplete="off" />
			</el-form-item>
			<el-form-item label="负责人">
				<el-input v-model="editForm.leader" autocomplete="off" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="editDialog = false">取消</el-button>
				<el-button type="primary" @click="editPro()">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import {
	// le官网-Message 消息提示-文字居中
	ElMessage,
	// elt+官网-搜索Message Box消息弹出框-确认消息
	ElMessageBox
} from 'element-plus'


export default {
	data() {
		return {
			project_list: [],
			// 添加 新增弹窗的属性，默认不弹
			addDialog: false,
			// 添加数组 用于接收用户输入的项目信息
			// 不用project_list: [] 因为字段太多了；每次新增也只是增加一个。
			// 名称最好与接口保持一致
			addForm: {
				name: '', // 项目名称
				leader: '' // 项目负责人
			},
			// 添加 编辑弹窗的属性，默认不弹
			editDialog: false, // 为true展示弹窗，false不展示
			// 用于接收用户编辑的项目信息
			editForm: {
				name: '', // 项目名称
				leader: '' // 项目负责人
			}

		}
	},
	methods: {
		// 定义获取项目列表信息的 异步方法
		async getAllproject() {
			// 1.向后端发起请求 变量接收
			const response = await this.$api.getProjects();
			// 2.处理相应数据
			if (response.status === 200) {
				// 如果响应200，则存储响应数据
				this.project_list = response.data;
			} else {
				// le官网-Message 消息提示-文字居中
				// 判断不是200 则显示错误信息
				ElMessage({
					showClose: true,
					message: '获取数据失败，请先登录',
					center: true,
					type: 'warning',
				})
			}
		},

		// 定义 新增项目的异步方法
		async clickAddPro() {
			// 1、向后端发起 新增项目请求，传参，变量接收响应
			// createProjects() 是在src/api/index.js中定义
			const responst = await this.$api.createProjects(this.addForm)
			// 判断响应状态码，201为成功是后端接口定义的；
			if (responst.status === 201)
				ElMessage({ // el+官网-Message 消息提示-文字居中
					showClose: true,
					message: '项目添加成功',
					center: true,
					type: 'success',
					duration: 2000 // 提示框停留时间
				})
			// 2、新增项目的弹窗关闭
			this.addDialog = false;
			// 3、向后端发起请求，获取所有的项目信息
			this.getAllproject();
		},

		// 删除项目
		delPro(id) {
			// 1 弹窗提示窗 用户是否删除项目
			// elt+官网-搜索Message Box消息弹出框-确认消息
			// 复制粘贴 import {ElMessageBox} from 'element-plus'
			ElMessageBox.confirm(
				'确认要删除该项目吗?',
				'提示', {
				// 	点击 OK 确认， 点击执行.then()
				confirmButtonText: '确认',
				// 点击 Cancle 取消， 点击执行.catch()
				cancelButtonText: '取消',
				type: 'warning',
			}
			)
				//2 如果用户点确定，开始删除项目
				// 箭头函数添加async 变成异步函数
				.then(async () => {
					// 因为ElMassageBox.config()是promise对象，所以也可以使用 await 设置成异步等待。
					// 	   否则将该方法delPor(id) 左侧添async变成异步；
					const response = await this.$api.deleteProject(id);
					if (response.status === 204) {
						//提示删除成功
						ElMessage({
							type: 'success', // 类型
							message: '删除成功', // 提示信息
							duration: 1000,
						});
						// 3 更新项目数据，重新请求项目数据。vue只有单页面							
						// 数据更新了，页面同时更新，vue是响应式。
						this.getAllproject();
					}
				})
				// 4 点击取消 操作执行.catch()消，不删除项目
				.catch(() => {
					ElMessage({
						type: 'info', // 样式
						message: '已取消操作', // 提示信息
						duration: 1000, // 停留时间
					})
				})
		},

		// 定义 编辑项目的异步方法
		async editPro() {
			// 1、向后端发起 编辑项目请求，传参，变量接收响应
			// createProjects() 是在src/api/index.js中定义
			const responst = await this.$api.updateProjects(this.editForm.id, this.editForm)
			// 判断响应状态码，201为成功是后端接口定义的；
			if (responst.status === 201)
				ElMessage({ // el+官网-Message 消息提示-文字居中
					showClose: true,
					message: '项目修改成功',
					center: true,
					type: 'success',
					duration: 2000 // 提示框停留时间
				})
			// 2、编辑项目的弹窗关闭
			this.editDialog = false;
			// 3、向后端发起请求，获取所有的项目信息
			this.getAllproject();
		},

		// 点击编辑
		clickEdit(item) {
			// 1.将当前待更新的项目赋值给editForm
			// this.editForm = item  // 这样不能复制，因为item包含id及更多属性是对不上的，
			// 所以要对item进行拆包 花括号、三个点
			this.editForm = {
				...item
			};
			// 等价于下面3行代码
			// this.editForm.id = item.id;
			// this.editForm.name = item.name;
			// this.editForm.leader = item.leader;
			// 赋值完成，显示编辑弹窗
			this.editDialog = true;
		},

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

		// 项目列表-选择项目
		selectPro(pro) {
			// 调用store- mutations- savePro存储项目信息
			this.$store.commit('savePro', pro)
			// 跳转到项目详情页
			this.$router.push({ name: 'project' })
		},

	},
	// 添加钩子，页面渲染前执行
	created() {
		// 调用获取项目列表的异步方法
		this.getAllproject();
	},
}
</script>

<style scoped>
/* 整个页面盒子样式 */
.projects_box {
	/* 整个页面宽度。加不加px效果不一样*/
	max-width: 1480px;
	/* 上下20px， 左右自动显示 */
	margin: 20px auto;
}

/* 顶部 盒子 样式 */
.top_box {
	/* 底部边框线，solid，宽度5px，颜色 */
	border-bottom: solid 5px #42b983;
	height: 40px;
	/* bold加粗 20px大小 40px字间距 微软雅黑字体 */
	font: bold 20px/40px 'microsoft yahei';
	color: #42b983;
	/* 内边距-底部 */
	/* padding-bottom: 5px; */
}

/* 顶部 盒子-按钮 样式  */
.top_box .el-button {
	/* float浮动，right靠右 */
	float: right;
	/* 外边距10px = 向左移动10px = 右边距10px; */
	/* margin: 10px; */
	margin-left: 10px;
	/* 预览 添加项目 按钮改到了右侧，如想改成左侧，需替换按钮标签上下位置*/
}

/* 列表 卡片 样式 */
.project {
	width: 200px;
	height: 250px;
	/* 左浮动 */
	float: left;
	/* 内边距：一个参数控制上下左右；两个参数分别上下、左右； */
	margin: 20px;
}

/* 列表 卡片-项目图标 央视 */
.project .project_icon {
	/* 颜色区域长款 */
	width: 60px;
	height: 60px;
	/* 背景颜色，方形，有颜色可知道范围。 */
	background: #d7f0e0;
	/* 水平对齐方式 居中。颜色区域里面的icon */
	text-align: center;
	/* 文字(icon)属性：是否加粗normal否 字号/行高 字体 */
	font: normal 30px/60px 'microsoft yahei';
	/* 文字(icon)颜色 */
	color: #42b983;
	/* 外边框圆角：大小是width、height一半，则是圆形  */
	border-radius: 30px;
	/* 外边距：上家0 ，左右自动。颜色区域有水平居中效果 */
	margin: 0 auto;
}

/* 预览-正常 */

/* 列表 卡片-项目名称 样式 */
.project .project_name {
	/* 外边距：顶部20px */
	margin-top: 20px;
	/* 文字(icon)属性：是否加粗normal否 bold加粗 字号/行高 字体 */
	font: bold 16px/40px 'microsoft yahe';
	/* 框的水平对齐：居中 */
	text-align: center;
}

/* 列表 卡片-项目负责人 样式 */
.project .project_leader {
	/* 文本对齐：居中 */
	text-align: center;
	/* 文字(icon)属性：是否加粗normal否 字号/行高 字体 */
	font: normal 14px/20px 'microsoft yahe';
	/* 偏浅灰色 */
	color: #ababab;
}

/* 列表 卡片-按钮 样式 */
.project .project_buttons {
	/* 顶部距离 */
	margin-top: 50px;
}

/* 列表 卡片 标签按钮 */
.project .project_buttons .el-tag {
	/* 鼠标悬停 光标类型：小手 */
	cursor: pointer;
}
</style>