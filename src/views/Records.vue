<template>
	<!-- 测试报告页面 -->
	<div ref="chart1"></div>

	<el-table :data="recordList">
		<!-- prop 属性来对应对象中的键名即可填入数据 -->
		<el-table-column label="执行时间" prop="">
			<!-- {{ $date.rTime(scope.row.create_time) }} -->
			{{ 时间 }}
		</el-table-column>
		<el-table-column label="测试计划" prop="">plan_name</el-table-column>
		<el-table-column label="执行环境" prop="env_name"></el-table-column>
		<el-table-column label="通过" prop="success"></el-table-column>
		<el-table-column label="失败" prop="fail"></el-table-column>
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
		async getProjectrecords() {
			const response = await this.$api.getTestRecord({
				// 获取项目ID，没有用映射，
				// 直接$store也是可以的，this.$store.state.pro.id；
				Project: this.$store.state.pro.id,
			});
			if (response.status === 200) {
				// 赋值 执行记录数据数组的列表 
				// this.recirdList 就不为空了，测试记录数据就是这里的每一个对象；
				this.recordList = response.data;
				console.log("this.recordList::",this.recordList)
			}
		},
		// 这个方法用于显示图表
		showChart() {
			const ele = this.$refs.chart1
			// chart3折线图（通过率趋势图）src/assets/js/chart.js
			// 参数：元素、数据、x轴刻度
			this.$chart.chart3(ele, this.chartData.value, this.chartData.label)
		}
	},
	// 计算
	computed: {
		chartData() {
			let lable = [];
			let value = [];
			this.recordList.forEach(item => {
				lable.push(this.$date.rTime(item.create_time));
				value.push(item.pass_rate);
			});
			return{
				lable: lable,
				value: value
			};
		}
	},

	// 页面刷新时调用的钩子
	// 一进入页面就获取项目信息；
	created() {
		this.getProjectrecords();
	},

	// created() 
	// 调用时机：会在 Vue 实例被创建后立即调用，但在 DOM 被渲染和挂载之前
	// 用途：通常用于初始化数据，设置计算属性，或者执行一些与 DOM 无关的逻辑
	// 如果将 this.showChart() 放在 created() 中，this.$refs.chart1 可能是 undefined
	// 因为 DOM 元素还没有渲染到页面上，所以无法通过 this.$refs.chart1 获取到图表的容器元素，也无法渲染图表。
	// mounted() 
	// 调用时机：会在 Vue 实例和其模板挂载到 DOM 后被调用。
	// 用途：通常用于涉及到 DOM 操作的逻辑，比如使用第三方库渲染图表、获取 DOM 元素尺寸、设置事件监听等。
	// 在 mounted() 中，this.$refs.chart1 已经指向真实的 DOM 元素，
	//     因此你可以安全地调用图表渲染方法，例如 this.$chart.chart3()。
	mounted() {
		this.showChart();
	},
	// 监听器，用于监听组件中数据的变化。

	watch: {
		// 当 recordList 数据发生变化时，
		// watch 中定义的函数会自动触发并执行相应的操作。
		recordList(value) {
			// 当 recordList 的数据长度大于 1 时，执行 this.showChart()。
			if (value.length > 1) {
				this.showChart();
			}
		}
	}
}
</script>

<style>
/* div.chart_box 元素 */
.chart_box {
	height: 250px;
	background: #f8f8f8;
}
</style>