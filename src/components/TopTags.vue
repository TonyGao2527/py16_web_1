<!--  
项目页 右侧 顶部 标签

-->
<template>
	<!-- 菜单栏+环境 最外层 -->
	<div class="tags">
		<!-- 标签栏 -->
		<div class="tag_box">
			<!-- Scrollbar 滚动条 -->
			<el-scrollbar>
				<!--  :key绑定path路径或name都可以，一般都不重复。-->
				<span v-for="tag in tags" :key="tag.name">
					<!-- el＋官网 - Tag 标签 - 可移除标签 - 源码复制 el-tag - 粘贴
							里面的v-for和:key不需要了，放在父级span标签中；				
							:type="tag.type" 取消：冒号绑定 改成type="success"
							closeable 接口文档 标签是否可关闭
						需求：选中的背景颜色有加深效果
							el＋官网 - Tag标签 - 主题/接口 - effect="dack"
							复制<el-tag>分别添加判断
								如果取出来的路由ag.path 和 当前访问路由一致$route.path，
								则添加 effect="dack" 颜色属性，
								否则不加背景色；
						@close="popTags(tag)" 点击关闭按钮实现关闭标签
						@click="$router.push(tag)"	点击标签跳转对应菜单页面
					-->
					<el-tag v-if="tag.path === $route.path" type="success" @click="clickTag(tag)" effect="dark">
						{{ tag.meta.name }}
					</el-tag>
					<el-tag v-else type="success" @click="clickTag(tag)" @close="closeTag(tag)" closable>
						{{ tag.meta.name }}
					</el-tag>
				</span>
			</el-scrollbar>
		</div>

		<!-- 选择环境 -->
		<div class="select_env">
			<!-- 关闭其他菜单标签 -->
			<el-button @click="closeAllTag" type="success" plain style="margin-right: 10px;">关闭其他标签</el-button>
			<!-- 测试环境选项 -->
			<el-select v-model="env" placeholder="请选择环境" style="width: 180px;" placement="bottom-start">
				<el-option v-for="item in testEnvs" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
			<!-- Tooltip 文字提示 鼠标悬浮展示提示 
				placement="bottom" 展示在下方
				effect="dark" 提示信息背景黑色
			-->
			<!-- <el-tooltip v-if="env" class="box-item" content="查看环境信息" placement="bottom" effect="dark"> -->
			<!-- 这里有问题，还要改 -->
			<el-tooltip class="box-item" content="查看环境信息" placement="bottom" effect="dark">
				<el-button @click="clickShowEnv" icon="View"></el-button>
			</el-tooltip>
		</div>

	</div>

	<!-- 显示测试环境 
		Dialog 对话框 显示弹窗
	-->
	<el-dialog v-model="showEnv" title="环境变量">
		<!-- Descriptions 描述列表 -->
		<el-descriptions :column="1" :size="size" border label-align>
			<!-- 遍历 调试全局变量 
				不明白 :label="key" 加不加有什么区别 gpt说优先显示插槽内容 :label用做数据绑定、内部逻辑
			-->
			<el-descriptions-item :label="key" v-for="value, key in envInfo.debug_global_variable">
				<template #label>
					<el-tag type="warning">debug</el-tag>
					{{ key }}
				</template>
				{{ value }}
			</el-descriptions-item>
			<!-- 遍历 全局变量 -->
			<el-descriptions-item :label="key" v-for="(value, key) in envInfo.global_variable">
				<template #label>
					<el-tag>debug</el-tag>
					{{ key }}
				</template>
				{{ value }}
			</el-descriptions-item>
		</el-descriptions>
		<template #footer>
			<span>
				<el-button @click="editEnv" type="success" plain>编辑</el-button>
				<el-button @click="showEnv = false">关闭</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import {
	mapMutations,
	mapState
} from 'vuex';

export default {
	data() {
		return {
			// 查看环境信息弹窗，默认关闭
			showEnv: false,
			// 选中环境的详细信息
			envInfo: [],
			// 没用
			env_variable: [],

		}
	},
	// 计算属性
	computed: {
		// 使用 state 方式二 ...mapState  将stone.state与method方法一对一映射
		// testEnvs 当前项目所有环境列表
		...mapState(['username', 'age', 'tags', 'envId', 'testEnvs']),

		// 实现双向绑定
		env: {
			get() {
				return this.envId;
			},
			set(val) {
				this.selectEnv(val);
			}
		}
	},

	methods: {
		// 修改 state 方式二（更好用）：...mapMutations 将stone.mutations与method方法一对一映射
		...mapMutations(['popTags', 'selectEnv']),

		// 点击标签
		clickTag(tag) {
			// 跳转到对应的路由中
			this.$router.push(tag);
		},

		// 删除标签
		closeTag(tag) {
			this.popTags(tag);
			// 如果被激活的标签删除了，则跳转路由到前一个标签的路由
			if (this.$route === tag) {
				this.$router.push(this.tags[this.tags.length - 1].path);
			}
		},

		// 关闭其他标签
		closeAllTag() {
			this.tags.forEach(item => {
				if (this.$route.path !== item.path) {
					this.popTags(item);
				}
			});
		},

		// 获取单个环境信息
		async clickShowEnv() {
			const response = await this.$api.getEnvInfo(this.envId);
			if (response.status === 200) {
				this.envInfo = response.data;
			}
			this.showEnv = true;
			console.log("日志 环境信息this.envInfo: ", this.envInfo)
		},

		// 编辑环境
		editEnv(){
			this.showEnv = false;
			this.$router.push({ name: 'testenv'})
		}

	},

}
</script>

<style scoped>
/* 最外框盒子tags标签 
height 高度60px  div高度
line-height 行间距60px  设置后与顶部有距离了
display: flex; (比例布局) 与下面 flex: 1;配合使用，
	使标签栏div和选择环境div变成一行；
	且 标签栏div靠左 选择环境div靠右；
*/
.tags {
	background: #fff;
	height: 60px;
	line-height: 50px;
	display: flex;
}

/* 菜单栏整体 */
.tag_box {
	flex: 1;
}

/* 每个tag标签样式 
cursor 悬浮光标手势
margin-left 每个tag的左边边距10
*/
.tags .el-tag {
	cursor: pointer;
	margin-left: 10px;
}

/* 选择环境 
border-left做边框：
	边框样式
		solid: 定义实线边框
		dotted: 定义一个点线边框
		dashed: 定义一个虚线边框
	宽度
	颜色
width 整个div宽度
height: 100%; 与父级标签高度相同
*/
.select_env {
	border-left: solid 2px #55aa7f;
	width: 400px;
	height: 100%;
	text-align: center;
}
</style>