<template>

	<!-- bug统计标题 -->
	<div>
		<span style="color: #00aa7f;"><b>bug统计</b></span>
	</div>
	<el-row :gutter="10">
		<!-- 左侧图表 条形图 -->
		<el-col :span="12">
			<div class="chartBox" ref="chart1Box"></div>
		</el-col>
		<!-- 右侧图表 饼图-->
		<el-col :span="12">
			<div class="chartBox" ref="chart2Box"></div>
		</el-col>
	</el-row>

	<!-- bug列表卡片 -->
	<el-card class="bug_list">
		<el-row>
			<el-button @click="showBugs = bugs" type="primary" plain size="small">所有bug</el-button>
			<!-- Badge 徽章 按钮和图标上的数字或状态标记。
			 	hidden 是否隐藏 Badge 值boolean 默认false。
				max 最大值，超过最大值会显示 {max}+
				margin: 0 10px;  上下为0 左右为10px 
			-->
			<!-- <el-badge :value="12" :hidden="bugs1.length === 0" class="item" :max="99" style="margin: 0 10px;"> -->
			<el-badge :value="12" class="item" :max="99" style="margin: 0 10px;">
				<el-button @click="showBugs = bugs1" type="danger" plain size="small">未处理bug</el-button>
			</el-badge>
			<el-button @click="showBugs = bugs2" type="warning" plain size="small">处理中bug</el-button>
			<el-button @click="showBugs = bugs3" type="success" plain size="small">处理完bug</el-button>
			<el-button @click="showBugs = bugs4" type="info" plain size="small">无效bug</el-button>

		</el-row>
	</el-card>

</template>

<script>
import { mapState } from 'vuex';

export default {
	data() {
		return {
			showBug: false, // 是否显示bug详情抽屉
			bugInfo: null, // 当前显示的bug信息
			bugLogs: null, // 当前bug的处理记录
			updateBugDlg: false, // 是否显示修改bug状态对话框
			updateBugForm: {}, // 修改bug状态表单数据
			showBugs: [], // 当前显示的 bug列表
			// bugs1 未处理bug; bugs2 处理中bug; bugs3 处理完bug; bugs4 无效bug;
			bugs: [] // 所有的 bug列表

		}
	},

	// 计算属性
	computed:{
		...mapState(['pro']),  // 从vuex中获取pro
	},

	// 
	methods: {
		// 获取所有的bug
		async getAllBug() {
			const response = await this.$api.getBugs({
				project: this.pro.id
			});
			if (response.status === 200) {
				this.bugs = response.data;  // 所有的bug列表 赋值
			}
		},

		// 渲染图标
		showTable() {
			const ele = this.$refs.chart1Box;
			// bugs1 未处理bug; bugs2 处理中bug; bugs3 处理完bug; bugs4 无效bug;
			const data = [this.bugs.length, this.bugs3.length, this.bugs2.length, this.bugs1.length, this.bugs4.length];
			const dataLabel = ['bug总数', '处理完', '处理中', '未处理', '无效bug'];
			// 调用js/chart.js中的chart1方法 条形图
			this.$chart.chart1(ele, data, dataLabel);
			const ele2 = this.$refs.chart2Box;
			// 调用js/chart.js中的chart1方法 饼图
			this.$chart.chart2(ele2, [
				{ value: this.bugs3.length, name: '处理完' },
				{ value: this.bugs2.length, name: '处理中' },
				{ value: this.bugs1.length, name: '未处理' },
				{ value: this.bugs4.length, name: '无效bug' },
			]);
		}
	},

	// 生命周期钩子 data(){}数据有更新的时候会自动调用
	updated() {		
		this.showTable();  // 调佣 渲染图标的方法
	},

	// 
	async created() {
		await this.getAllBug();  //获取所有的bug
		this.showBugs = this.bugs;  // 当前显示的bug列表 赋值为 所有bug的列表
		this.showTable();  // 调用 渲染图表的方法
	}
};

</script>

<style></style>