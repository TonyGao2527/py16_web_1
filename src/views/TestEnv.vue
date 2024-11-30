<!-- 测试环境 -->

<template>
	<!-- gutter 列之间的间距 -->
	<el-row :gutter="10">
		<!-- 左侧区域：环境列表 -->
		<el-col :span="4">
			<div class="list_box">
				<el-scrollbal height="calc(100vh - 144px);">
					<!-- 标题 -->
					<div class="top-title">测试环境</div>
					<!-- 添加按钮 -->
					<!-- <el-button @click="addEnv" type="success" plain size="small" style="width: 100%"> -->
					<el-button @click="addEnv" type="success" plain size="small" style="width: 100%;" icon="Plus">
						创建测试环境
					</el-button>
					<!-- 环境菜单列表 -->
					<!-- default-active 页面加载时默认激活菜单的 index -->
					<!-- active-text-color 活动菜单项的文本颜色 -->
					<el-menu :default-active="active" class="el-menu-vertical-demo" active-text-color="#00aa7f"
						text-color="#000000" style="background: none; border:none;">
						<el-menu-item>
							<el-icon>
								<Coin />
							</el-icon>
							<span>{{ }} 666</span>
						</el-menu-item>
						<el-menu-item>
							<el-icon>
								<Coin />
							</el-icon>
							<span>{{ }} 777</span>
						</el-menu-item>
					</el-menu>
				</el-scrollbal>
			</div>
		</el-col>

		<!-- 中间区域 信息、配置、变量 -->
		<el-col :span="8">
			<el-scrollbar height="calc(100vh - 70px)">

				<!-- 基本信息 -->
				<div class="title">基本信息</div>
				<!-- <el-input v-model="EnvInfo.name" palaceholder="环境名称"> -->
				<el-input palaceholder="环境名称">
					<!-- #prepend左侧显示 #append右侧显示 -->
					<template #prepend>
						环境名
					</template>
				</el-input>

				<!-- <el-input v-model="EnvInfo.host" palaceholder="hots地址" style="margin-top: 5px;"> -->
				<el-input palaceholder="hots地址" style="margin-top: 5px;">
					<template #prepend>
						服务器域名
					</template>
				</el-input>

				<!-- 基本配置 -->
				<div class="title">基本配置</div>
				<!-- 将 type 设置为 border-card。是带有边框的卡片-->
				<el-tabs type="border-card">
					<el-tab-pane label="全局请求头">
						<Editor height="250px"></Editor>
					</el-tab-pane>
					<el-tab-pane label="数据库配置">
						<Editor height="250px"></Editor>
					</el-tab-pane>
				</el-tabs>

				<!-- 全局变量 -->
				<div class="title">全局变量</div>
				<el-tabs type="border-card">
					<el-tab-pane label="全局变量">
						<Editor height="250px"></Editor>
					</el-tab-pane>
					<el-tab-pane label="调试运行变量">
						<Editor height="250px"></Editor>
					</el-tab-pane>
				</el-tabs>

				<!-- 底部固定的3个按钮 -->
				<!-- <el-affix position="bottom" :offset="20" style="text-align:center;" v-if="EnvInfo"> -->
				<el-affix position="bottom" :offset="20" style="text-align:center;">
					<el-button plain @click="saveEnv" type="success" icon="CircleCheck">保存编辑</el-button>
					<el-button plain @click="saveEnv" type="success" icon="CircleCheck">复制环境</el-button>
					<el-button plain @click="delEnv" type="danger" icon="Delete">删除环境</el-button>
				</el-affix>
			</el-scrollbar>

		</el-col>

		<!-- 右侧区域 全局工具函数 -->
		<el-col :span="12">
			<!-- <Editor v-model="EnvInfo.global_func" height="calc(100vh - 65px)" lang="python" theme="monokai"></Editor> -->
			<Editor height="calc(100vh - 65px)" lang="python" theme="monokai"></Editor>
		</el-col>
	</el-row>
</template>

<script>
import Editor from '../components/CodeEdit.vue';
export default {
	components: {
		Editor
	},
	data() {
		return {
			active: '1',
			EnvInfo: null,
		};
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
	font: bold 14px/28x 'microsoft yahei';
}
</style>