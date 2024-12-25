<!-- 测试环境 -->

<template>
	<!-- gutter 列之间的间距 -->
	<el-row :gutter="10">
		<!-- 左侧区域：环境列表 -->
		<el-col :span="4">
			<div class="list_box">
				<el-scrollbar height="calc(100vh - 144px)">
					<!-- 标题 -->
					<div class="top-title">测试环境</div>
					<!-- 添加按钮，用于创建新的测试环境 -->
					<!-- <el-button @click="addEnv" type="success" plain size="small" style="width: 100%"> -->
					<el-button @click="addEnv" type="success" plain size="small" style="width: 100%;" icon="Plus">
						创建测试环境
					</el-button>
					<!-- 环境菜单列表，用于显示测试环境列表 -->
					<!-- default-active 页面加载时默认激活菜单的 index -->
					<!-- active-text-color 活动菜单项的文本颜色 -->
					<!-- background: none; 去除了元素的背景色、背景图片或背景图案。 -->
					<!-- border: none; 去除了元素的边框。 -->
					<el-menu :default-active="active" class="el-menu-vertical-demo" active-text-color="#00aa7f"
						text-color="#000000" style="background: none; border:none;">
						<!-- 循环显示每个测试环境 -->
						<el-menu-item @click="selectEnv(item)" :index="item.id.toString()" v-for="item in testEnvs"
							style="height: 35px; line-height: 35px;">
							<el-icon>
								<Coin />
							</el-icon>
							<span>{{ item.name }}</span>
						</el-menu-item>
					</el-menu>
				</el-scrollbar>
			</div>
		</el-col>

		<!-- 中间区域 信息、配置、变量。宽度占比8 -->
		<el-col :span="8" v-if="EnvInfo">
			<!-- 滚动条容器，高度计算为视口高度减去70px -->
			<el-scrollbar height="calc(100vh - 70px)">

				<!-- 基本信息 -->
				<div class="title">基本信息</div>
				<el-input v-model="EnvInfo.name" placeholder="环境名称">
					<!-- #prepend左侧显示 #append右侧显示 -->
					<template #prepend>
						环境名
					</template>
				</el-input>

				<el-input v-model="EnvInfo.host" placeholder="hots地址" style="margin-top: 5px;">
					<!-- <el-input placeholder="hots地址" style="margin-top: 5px;"> -->
					<template #prepend>
						服务器域名
					</template>
				</el-input>

				<!-- 基本配置 -->
				<div class="title">基本配置</div>
				<!-- 标签页，用于切换全局请求头和数据库配置 -->
				<!-- 将 type 设置为 border-card。是带有边框的卡片-->
				<el-tabs type="border-card" class="demo-tabs">
					<el-tab-pane label="全局请求头">
						<Editor v-model="EnvInfo.headers" height="250px"></Editor>
					</el-tab-pane>
					<el-tab-pane label="数据库配置">
						<Editor v-model="EnvInfo.db" height="250px"></Editor>
					</el-tab-pane>
				</el-tabs>

				<!-- 全局变量 -->
				<div class="title">全局变量</div>
				<!-- 标签页，用于切换全局变量和调试运行变量 -->
				<el-tabs type="border-card">
					<el-tab-pane label="全局变量">
						<Editor v-model="EnvInfo.global_variable" height="250px"></Editor>
					</el-tab-pane>
					<el-tab-pane label="调试运行变量">
						<Editor v-model="EnvInfo.debug_global_variable" height="250px"></Editor>
					</el-tab-pane>
				</el-tabs>

				<!-- 固定在底部的操作按钮，用于保存、复制和删除环境 -->
				<el-affix position="bottom" :offset="20" style="text-align:center;" v-if="EnvInfo">
					<!-- <el-affix position="bottom" :offset="20" style="text-align:center;"> -->
					<el-button plain @click="saveEnv" type="success" icon="CircleCheck">保存编辑</el-button>
					<el-button plain @click="copyEnv" type="success" icon="CircleCheck">复制环境</el-button>
					<el-button plain @click="delEnv" type="danger" icon="Delete">删除环境</el-button>
				</el-affix>
			</el-scrollbar>
		</el-col>

		<!-- 右侧区域 全局工具函数 ，宽度占比12-->
		<el-col :span="12" v-if="EnvInfo">
			<Editor v-model="EnvInfo.global_func" height="calc(100vh - 65px)" lang="python" theme="monokai"></Editor>
			<!-- <Editor height="calc(100vh - 65px)" lang="python" theme="monokai"></Editor> -->
		</el-col>
	</el-row>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Editor from '../components/CodeEdit.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Coin } from '@element-plus/icons-vue';
export default {
	// 注册子组建
	components: {
		Editor
	},
	data() {
		return {
			active: '1',  // 当前选中的测试环境ID
			EnvInfo: null,  // 当前选中的测试环境信息，展示环境详情信息
		};
	},
	computed: {
		...mapState(['pro', 'testEnvs']),  // 从vuex获取项目信息和测试环境列表
	},
	methods: {
		// 获取所有测试环境
		...mapActions(['getAllEnvs']),
		// 创建环境
		async addEnv() {
			const params = { project: this.pro.id, name: "New Env" };
			const response = await this.$api.createTestEnvs(params);
			if (response.status === 201) {
				this.$message({
					type: 'success',
					message: '添加成功',
					duration: 1000,
				});
				this.getAllEnvs(); // 刷新测试环境列表
			}
		},

		// 删除环境
		async delEnv() {
			ElMessageBox.confirm('确定要删除吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					const response = await this.$api.delTestEnvs(this.EnvInfo.id);
					if (response.status === 204) {
						ElMessage({
							type: 'success',
							message: '删除成功',
							duration: 1000,
						});
						this.getAllEnvs(); // 刷新测试环境列表
						// 重新选中环境
						if (this.testEnvs.length > 0) {
							// 设置默认显示激活的测试场景
							this.active = this.testEnvs[0].id.toString(); // 默认选中第一个环境
							// 选中环境
							this.selectEnv(this.testEnvs[0]);
						}
					}
				})
				.catch(() => {
					ElMessage({
						type: 'info',
						message: '取消删除',
						duration: 1000,
					});
				});
		},

		// 保存修改
		async saveEnv() {
			// 拷贝 环境信息详情
			let params = { ...this.EnvInfo }
			// 反序列化 将 JSON 字符串 转换回 JavaScript 对象。
			//   转换为可以在 JavaScript 中操作的对象
			params.headers = JSON.parse(this.EnvInfo.headers);
			params.db = JSON.parse(this.EnvInfo.db);
			params.debug_global_variable = JSON.parse(this.EnvInfo.debug_global_variable);
			params.global_variable = JSON.parse(this.EnvInfo.global_variable);
			const response = await this.$api.updateTestEnvs(params.id, params)
			if (response.status === 200) {
				this.$message({
					type: 'success',
					message: '保存成功',
					duration: 1000,
				});
				this.getAllEnvs(); // 刷新测试环境列表
			}
		},

		// 复制环境
		async copyEnv() {
			let params = { ...this.EnvInfo }
			params.name = params.name + '_COPY';   // 添加后缀标识复制的环境
			// 反序列化 将 JSON 字符串 转换回 JavaScript 对象。
			//   转换为可以在 JavaScript 中操作的对象
			params.headers = JSON.parse(this.EnvInfo.headers);
			params.db = JSON.parse(this.EnvInfo.db);
			params.debug_global_variable = JSON.parse(this.EnvInfo.debug_global_variable);
			params.global_variable = JSON.parse(this.EnvInfo.global_variable);
			// 调用创建环境
			const response = await this.$api.createTestEnvs(params);
			if (response.status === 201) {
				this.$message({
					type: "success",
					message: "复制成功",
					duration: 1000
				});
				this.getAllEnvs(); // 刷新测试环境列表
			}
		},

		// 选中环境
		selectEnv(env) {
			this.active = env.id.toString()
			// 相当于浅拷贝，修改不应该直接影响到 env，避免对原始数据的污染
			this.EnvInfo = { ...env }
			// 序列化 JSON.stringify 将 JavaScript 对象 转换为 JSON 字符串
			//   可以将其存储在文件、数据库，或通过网络发送
			this.EnvInfo.headers = JSON.stringify(this.EnvInfo.headers, null, 4);
			this.EnvInfo.db = JSON.stringify(this.EnvInfo.db, null, 4);
			this.EnvInfo.debug_global_variable = JSON.stringify(this.EnvInfo.debug_global_variable, null, 4);
			this.EnvInfo.global_variable = JSON.stringify(this.EnvInfo.global_variable, null, 4);

		},

	},

	// 页面加载时
	created() {
		this.getAllEnvs(); // 页面加载时获取所有测试环境
	},
	mounted() {
		if (this.testEnvs.length > 0) {
			// 设置默认选中的环境
			this.selectEnv(this.testEnvs[0]); // 默认选中第一个测试环境
		}
	},
}
</script>

<style>
/* 页面左侧区域 */
/* 水平偏移量, 垂直偏移量, 模糊半径, 阴影的颜色 */
.list_box {
	height: calc(100vh - 68px);
	box-shadow: 0 0 5px #00aa7f
}

/* 页面左侧区域 测试环境 标题*/
/* border-bottom底部的边框样式: solid 是实线宽, 宽度4像素 */
.list_box .top-title {
	text-align: center;
	font: bold 20px/40px 'microsoft yahei';
	border-bottom: solid 4px #b3b3b3;
}

/* 页面中间区域 信息、配置、变量 标题*/
/* border-bottom底部的边框样式: solid 是实线宽, 宽度4像素 */
.title {
	font: bold 14px/28px 'microsoft yahei';
}
</style>