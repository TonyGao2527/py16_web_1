<!--  
整个项目详情页 布局成左右
	左侧 上面logo + 下边菜单
	右侧 上面tag + 下面详情显示区*/
1
-->


<template>
	<div class="home">

		<!-- 页面左侧 菜单 -->
		<div class="left_box">
			<!-- <LeftMenu></LeftMenu> -->
			<el-scrollbar height="100vh"><LeftMenu></LeftMenu></el-scrollbar>
		</div>

		<!-- 页面右侧部分 -->
		<div class="right_box">

			<!-- 右侧 顶部 标签 -->
			<div class="top_box">
				<TopTags></TopTags>
			</div>

			<!-- 右侧 底部 详情数据 -->
			<!-- 主题内容显示区 -->
			<div class="main_box">
				<!-- 不加这个滚动，每个字页面都会出现上下、左右的滚动条 -->
				 <el-scrollbar height="calc(100vh - 66px)">
					<!-- 展示子路由 每个菜单详情页 -->
					<router-view></router-view>
				 </el-scrollbar>
			</div>
		</div>
	</div>
</template>

<script>
// 引入左侧菜单
import { mapActions } from 'vuex';
import LeftMenu from '../components/LeftMenu.vue';
// 引入右侧顶部标签
import TopTags from '../components/TopTags.vue';

export default {
	// 注册子组件
	components: {
		LeftMenu,
		TopTags,
	},
	methods:{
		...mapActions(['getAllEnvs','getAllInterFaces', 'getAllScent', 'getAllPlan'])
	},
	// 进入当前页面时调用
	created(){		
		this.getAllEnvs()  // 获取当前项目 所有测试环境
		this.getAllInterFaces()  // 获取当前项目 所有测试接口
		this.getAllScent()  // 获取当前项目 所有测试场景
		this.getAllPlan()  //获取当前项目 获取所有测试计划
		
	}
}
</script>

<style scoped>
/* 整个页面盒子：分左右两块 */
.home {
	/* 整个页面背景 */
	background: #00aa7f;
	height: 100vh;
	/* 弹性盒子：默认左对齐。
		页面分左右两块：
			左侧 上面logo + 下边菜单
			右侧 上面tag + 下面详情显示区*/
	display: flex;
}

/* 左侧菜单区域 */
.left_box {
	/* 宽度 */
	width: 200px;
	/* 右边框：实现、1像素、白色 */
	border-right: solid 1px #fff;
	height: 100vh;
}

/* 右侧区域 */
.right_box {
	/* 弹性布局-比例分布 */
	flex: 1;
	/* 所有外边距属性 */
	margin: 2px;
}

/* 右侧顶部标签 */
.top_box {
	height: 60px;
	/* 背景颜色 */
	background: #fff;
	/* 元素的下外边距 */
	margin-bottom: 2px;
}

/* 右侧主体内容展示区 */
.main_box {
	/* 高度：视口100% - 66px 。注意：减号左右空格不能省略*/
	/* height: 100vh; */
	height: calc(100vh - 66px);
	/* 背景颜色 */
	background: #fff;
	/* 圆角：4个角 5px */
	border-radius: 5px;
}
</style>
