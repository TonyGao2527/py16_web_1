<template>
	<!-- 测试报告页面 -->
	 <!-- <div ref="chart1"></div> -->

	<el-table>
		<!-- prop 属性来对应对象中的键名即可填入数据 -->
		<el-table-column label="执行时间" prop="">
			<!-- {{ $date.rTime(scope.row.create_time) }} -->
			{{ 时间}}
		</el-table-column>
		<el-table-column label="测试计划" prop=""></el-table-column>
		<el-table-column label="执行环境" prop=""></el-table-column>
		<el-table-column label="通过" prop=""></el-table-column>
		<el-table-column label="失败" prop=""></el-table-column>
		<el-table-column label="通过率" prop=""></el-table-column>
		<el-table-column label="查看报告" prop=""></el-table-column>
	</el-table>


</template>

<script>
import Project from './Project.vue';

export default {
	data() {
		return {
			// 执行记录数据数组的列表
			recordList: [],
			// 最多900页
			count: 900,
			// 第 1 页
			page: 1,
			// 每一页10条数据
			size: 10
		};
	},

	// 
	methods: {
		// 获取当前项目下所有record执行记录信息
		async getProjectrecords(){
			const response = await this.$api.getTestRecord({
				// 获取项目ID，没有用映射，
				// 直接$store也是可以的，this.$store.state.pro.id；
				Project: this.$store.state.pro.id,
			});
			if (response.status === 200){
				// 赋值 执行记录数据数组的列表 
				// this.recirdList 就不为空了，测试记录数据就是这里的每一个对象；
				this.recordList = response.data;
			}
		},
		// 这个方法用于显示图表
		// showChart(){
		// 	const ele = this.$refs.chart1
		// 	// chart3折线图（通过率趋势图）src/assets/js/chart.js
		// 	this.$chart.chart3(ele, this.chartData.value, this.chartData.label)
		// }
	},

	// 页面刷新时调用的钩子
	// 一进入页面就获取项目信息；
	created() {
		this.getProjectrecords();
	},
}
</script>

<style></style>