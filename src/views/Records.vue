<template>
	<!-- 测试报表页面 -->
	<div class="chart_box" ref="chart1"></div>

	<el-table :data="recordList" style="width: 100%" height="calc(100vh - 350px)">
		<!-- prop 属性来对应对象中的键名即可填入数据 -->
		<el-table-column label="执行时间" min-width="100px">
			<template #default="scope">
				{{ $date.rTime(scope.row.create_time) }}
			</template>
		</el-table-column>
		<el-table-column label="测试计划" prop="plan_name" />
		<el-table-column label="执行环境" prop="env_name" />
		<el-table-column label="通过" prop="success" />
		<el-table-column label="失败" prop="fail" />
		<el-table-column label="通过率" prop="pass_rate" />
		<el-table-column label="查看报告" width="100">
			<template #default="scope">
				<el-button size="small" type="success" plain
					@click="$router.push({ name: 'report', params: { id: scope.rou.id } })">
					测试报告
				</el-button>
			</template>
		</el-table-column>
	</el-table>

	<!-- 分液器使用的演示 -->
	<!-- 	
		v-model:currentPage="page"
		v-model:page-size="size"  	每页显示条目个数
		:page-sizes="[10, 20, 50, 100]"  每页显示个数选择器的选项设置
		layout="total, sizes, prev, pager, next, jumper"组件布局，子组件名用逗号分隔
			total 显示总条目数 ；
			sizes 显示每页显示条数的选择器 ；
			prev 显示上一页按 例如：上一页； 
			pager 显示分页按钮 例如：1 2 3 4 5 ... 90； 
			next 显示下一页按钮 例如：下一页 ；
			jumper 显示跳转输入框。例如：跳转到第 [输入框] 页。
		:total="count"  
			总页数， total 和 page-count 设置任意一个就可以达到显示页码的功能；
			如果要支持 page-sizes 的更改，则需要使用 total 属性	
		@size-change="updateData"  page-size 改变时触发
		@current-change="updateData"  current-page 改变时触发
	-->
	<el-pagination v-model:currentPage="page" v-model:page-size="size" :page-sizes="[10, 20, 50, 100]"
		layout="total, sizes, prev, pager, next, jumper" :total="count" @size-change="updateData"
		@current-change="updateData" />

</template>

<script>
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
		async updateData() {
			// 当页面或者每页显示的数量发生变化时，执行该方法发生请求，刷新页面数据
			const params = {
				page: this.page,  // 当前页码
				size: this.size,   // 每页显示的记录数
			}
			// 发生请求，获取数据
			// 获取完数据之后，将数据更新到页面上
			// 要显示的数据列表，赋值给 recordList
			// 数据总数：赋值给 count
			
			// try 里面是gpt写的
			try{
				// 发起请求获取分页数据
				const response = await this.$api.getTestRecord(params);

				if (response.status === 200) {
					// 更新记录列表
					this.recordList = response.data.records // 假设 API 返回的数据在 data.records 中
					// 更新总数
					this.count = response.data.total;  // 假设 API 返回的总记录数
				} else {
					console.error("和获取数据失败",response)
				}
			} catch (error){
				console.error("请求发生错误:", error)
			}
		},

		// 获取当前项目下所有record执行记录信息
		async getProjectrecords() {
			const response = await this.$api.getTestRecord({
				// 获取项目ID，没有用映射，
				// 直接$store也是可以的，this.$store.state.pro.id；
				project: this.$store.state.pro.id,
			});
			if (response.status === 200) {
				// 赋值 执行记录数据数组的列表 
				// this.recirdList 就不为空了，测试记录数据就是这里的每一个对象；
				this.recordList = response.data;
				console.log("this.recordList::", this.recordList)
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
	// 计算属性
	// 会缓存计算结果，值改变时改变时才重新计算。
	//    避免了不必要的重复计算，节省了性能开销。
	// methods 每次调用时都会重新执行，不会缓存结果。
	// computed 直接在模板中以 {{ chartData }} 的形式使用，
	//    而 methods 需要通过函数调用 this.getChartData()，显得不够简洁。
	computed: {
		// chartData 是一个计算属性（computed）。
		//    其作用是根据 recordList 中的数据动态生成图表所需要的 label 和 value 数组。
		chartData() {
			let lable = []; // 存放时间的数组
			let value = []; // 存放通过率的数组
			// 从this.recordList中for循环取出lable创建事件和value通过率
			this.recordList.forEach(item => {
				lable.push(this.$date.rTime(item.create_time)); // 将每个记录的时间格式化后放入 lable 数组
				value.push(item.pass_rate); // 将每个记录的通过率放入 value 数组
			});
			return {
				lable: lable,  // 标签；创建时间
				value: value,  // 值：通过率
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
};
</script>

<style scoped>
/* div.chart_box 元素 */
.chart_box {
	height: 250px;
	background: #f8f8f8;
}
</style>