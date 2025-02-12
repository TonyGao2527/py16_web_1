<template>

	<!-- bug统计标题 -->
	<div>
		<span style="color: #00aa7f;"><b>bug统计</b></span>

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
			<!-- 所有bug按钮 -->
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

			<!-- bug列表 -->
			<el-table :data="showBugs" style="width: 100%;" size="small">
				<!-- 
				show-overflow-tooltip 当内容过长被隐藏时显示 tooltip
				-->
				<el-table-column label="提交时间" min-width="120" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ $date.rTime(scope.row.create_time) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="bug描述" show-overflow-tooltip prop="desc" min-width="120"></el-table-column>
				<el-table-column label="所属接口" show-overflow-tooltip prop="interface_url"
					min-width="00"></el-table-column>
				<el-table-column label="bug状态" prop="status" min-width="80"></el-table-column>
				<el-table-column label="操作" width="180">
					<template #default="scope">
						<div>
							<!-- el - Tooltip 文字提示 -->
							<el-tooltip effect="dark" placement="top" content="查看bug详情">
								<el-button size="small" plain icon="View" type="success"
									@click="showBugInfo(scope.row)" />
							</el-tooltip>
							<el-tooltip effect="dark" placement="top" content="修改bug状态">
								<!-- click 示修改bug状态对话框；修改bug状态表单数据  -->
								<el-button size="small" plain icon="Edit" type="success"
									@click="updateBugDlg = true; updateBugForm = scope.row;" />
							</el-tooltip>
							<el-tooltip effect="dark" placement="top" content="删除bug">
								<el-button size="small" plain icon="Edit" type="success"
									@click="delBug(scope.row.id)" />
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
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

		};
	},

	// 计算属性
	computed: {
		// pro项目详情页-信息存储
		...mapState(['pro']),  // 从vuex中获取pro
		// 未处理的bug
		bugs1() {
			return this.bugs.filter((item, index, array) => {
				return item.status === '未处理';
			});
		},
		// 处理中的bug
		bugs2() {
			return this.bugs.filter((item, index, array) => {
				return item.status === '处理中';
			});
		},
		// 处理完的bug
		bugs3() {
			return this.bugs.filter((item, index, array) => {
				return item.status === '未处完';
			});
		},
		// 关闭bug / 无效的bug
		bugs4() {
			return this.bugs.filter((item, index, array) => {
				return item.status === '无效bug';
			});
		},
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

		// 显示bug详情
		showBugInfo(bug) {
			this.bugInfo = bug; // 当前显示的bug信息 赋值
			this.getBugAllLogs(bug.id); // 获取当前bug的处理记录
			this.showBug = true; // 是否显示bug详情抽屉 赋值
		},

		// 获取bug历史处理记录
		async getBugAllLogs(id) {
			const response = await this.$api.getBugLogs({ bug: id }); // 获取当前bug的处理记录
			if (response.status === 200 && response.data.length > 0) { // 如果获取成功 并且有数据
				this.bugLogs = response.data; // 当前bug的处理记录 赋值
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
		},

		// 删除bug
		delBug(id) {
			this.$confirm('此操作将永久删除该bug, 是否继续？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					const response = await this.$api.deleteBug(id);
					if (response.status === 204) {
						this.$message({
							type: 'success',
							message: '删除成功',
							duration: 1000
						});
						await this.getAllBug();  //获取所有的bug
						this.showBugs = this.bugs;  // 当前显示的bug列表 赋值为 所有bug的列表
					};
				})
				.catch(() => {
					this.$messge({
						type: 'info',
						message: '已取消删除',
						daration: 1000,
					});
				});  // 捕获异常

		},
	},

	// 生命周期钩子 data(){}数据有更新的时候会自动调用
	updated() {
		this.showTable();  // 调佣 渲染图标的方法
	},

	// 
	async created() {
		await this.getAllBug();  //获取所有的bug
		this.showBugs = this.bugs;  // 当前显示的bug列表 赋值为 所有bug的列表
		console.log('日志 this.showBugs: ', this.showBugs);
		this.showTable();  // 调用 渲染图表的方法
	}
};

</script>

<style>
/* 图标样式 
rgba 全称是 Red-Green-Blue-Alpha
	代表 红色 (Red)、绿色 (Green)、蓝色 (Blue) 和 透明度 (Alpha)
	0 表示完全透明。1 表示完全不透明。0.1 表示颜色有 10% 的透明度
*/
.chartBox {
	height: 200px;
	background: rgba(198, 198, 202, 0.1)
}

/* 
100vh 表示视口高度的100%
overflow-y: 垂直方向上的溢出行为。auto 表示如果内容超出元素的高度，浏览器会自动显示垂直滚动条
margin-top: 元素的上外边距为20像素
*/
.bug_list {
	height: calc(100vh - 290px);
	overflow-y: auto;
	margin-top: 5px;
}
</style>