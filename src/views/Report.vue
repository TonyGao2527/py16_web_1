<template>
	<!-- 判断 运行测试记录信息record 是否有值  -->
	<div v-if="record">
		<!-- 判断 测试报告信息report 是否有值 
		 	el-col 第一列 测试报告
		 	el-col 第二列 测试场景执行详情
		-->
		<el-row v-if="report">
			<!-- 第一列 测试报告 -->
			<el-col :span="12">
				<!-- el官网 - Scrollbar 滚动条 
					加上 height 左右两列滑动不同步了
				-->
				<el-scrollbar height="calc(100vh - 65px)">
					<!-- 第一列 标题 -->
					<div class="report_title">测试报告</div>
					<!-- 以卡片形式展示 每一块区域 -->

					<!-- 执行信息 -->
					<el-card>
						<!-- el官网 - Descriptions 描述列表 
						 	direction	排列的方向
							column	一行 Descriptions Item 的数量
							border	是否带有边框
						-->
						<el-descriptions title="执行信息" direction="vertical" :column="4" border>
							<el-descriptions-item label="执行时间">
								{{ $date.rTime(record.create_time) }}
							</el-descriptions-item>
							<el-descriptions-item label="执行任务">{{ record.plan_name }}</el-descriptions-item>
							<el-descriptions-item label="测试环境">{{ record.env_name }}</el-descriptions-item>
							<el-descriptions-item label="通过率">{{ record.pass_rate + '%' }}</el-descriptions-item>
						</el-descriptions>
					</el-card>

					<!-- 图标 -->
					<!-- body-style	body 的 CSS 样式 
					 	padding 内边距 
					-->
					<el-card body-style="padding: 5px">
						<!-- el官网 - Layout 布局
							gutter	栅格间隔 
						-->
						<el-row :gutter="5">
							<el-col :span="14">
								<!--  -->
								<!-- 横向 条形图 用例信息 -->
								<div class="chartBox" ref="chart1"></div>
							</el-col>
							<el-col :span="10">
								<!-- 饼图 通过率 -->
								<div class="chartBox" ref="chart2"></div>
							</el-col>
						</el-row>
					</el-card>

					<!-- 测试场景统计 -->
					<el-card>
						<el-descriptions title="测试场景统计" direction="vertical" :column="4" border>
							<!-- report.results 接口返回的
								computed 计算属性中定义： successcent failscent errorscent
							-->
							<el-descriptions-item label="场景总数">{{ report.results.length }}</el-descriptions-item>
							<el-descriptions-item label="通过场景">{{ successscent.length }}</el-descriptions-item>
							<el-descriptions-item label="事变场景">{{ failscent.length }}</el-descriptions-item>
							<el-descriptions-item label="错误场景">{{ errorscent.length }}</el-descriptions-item>
						</el-descriptions>
					</el-card>

					<!-- 未通过场景 -->
					<el-card>
						<b style="line-height: 30px;">未通过场景</b>
						<div>
							<el-button size="small" plain type="danger" @click="showScentDatas = [su]"
								v-for="su in errorscent">{{ su.name }}</el-button>
							<el-button size="small" plain type="danger" @click="showScentDatas = [su]"
								v-for="su in failscent">{{ su.name }}</el-button>
						</div>
					</el-card>

					<!-- 通过场景 -->
					<el-card>
						<b style="line-height: 30px;">通过场景</b>
						<div>
							<el-button size="small" plain type="danger" @click="showScentDatas = [su]"
								v-for="su in successscent">{{ su.name }}</el-button>
						</div>

					</el-card>
				</el-scrollbar>
			</el-col>

			<!-- 页面右侧：测试场景执行详情 -->
			<el-col :span="12">
				<div>
					<!-- 4个type按钮 
						margin 外边距 
					-->
					<div style="margin: 5px;">
						<el-button size="small" plain type="primary" @click="showScentDatas = { ...report.results }">
							所有场景</el-button>
						<el-button size="small" plain type="success" @click="showScentDatas = successscent">
							成功场景</el-button>
						<el-button size="small" plain type="warning" @click="showScentDatas = failscent">
							失败场景</el-button>
						<el-button size="small" plain type="danger" @click="showScentDatas = errorscent">
							错误场景</el-button>
					</div>
					<!-- 4个type按钮 对应展示的 场景内容 -->
					<!-- <el-scrollbar height="calc(100vh - 117px)"> -->
					<el-scrollbar>
						<div class="right_box">
							<!-- 卡片展示顶部按钮对应内容 -->
							<el-card v-for="(scent, index) in showScentDatas" :key="index">
								<!-- 场景内容 标题 -->
								<div class="title" v-if="scent.state == 'success'">
									<!-- i对的class 不知道在哪里定义的 貌似没用-->
									<i class="el-icon-upload"></i>
									{{ '测试场景 : ' + scent.name + '【通过】' }}
								</div>
								<div class="title" v-else-if="scent.state == 'fail'" style="color: coral;">
									<i class="el-icon-upload"></i>
									{{ '测试场景 : ' + scent.name + '【失败】' }}
								</div>
								<div class="title" v-else style="color: red;">
									<i class="el-icon-upload"></i>
									{{ '测试场景 : ' + scent.name + '【错误】' }}
								</div>

								<!-- 场景内容 
									el - Table 表格 - 展开行 
									:show-header="false" 是否显示表头
								-->
								<el-table :data="scent.cases" style="width: 100%" :show-header="false">
									<!-- 通过设置 type="expand" 和 slot 可以开启展开行功能 
									 	show-overflow-tooltip 当内容太长时，它会分成多行。将其保留在一行中。
											多余的内容会在 hover 时以 tooltip 的形式显示出来
									-->
									<el-table-column type="expand">
										<template #default="scope">
											<caseRes :result="scope.row"></caseRes>
										</template>
									</el-table-column>
									<el-table-column label="用例名称" prop="name" min-width="100px" :show-overflow-tooltip="true"/>
									<el-table-column label="请求方法" prop="method" min-width="40px"/>
									<el-table-column label="状态码" prop="status_cede" min-width="40px"/>
									<el-table-column label="断言结果" prop="state" min-width="40px">
										<template #default="scope">
											<span style="color: #00AA7F;" v-if="scope.row.state =='成功'">成功</span>
											<span style="color: #ffaa00;" v-else-if="scope.row.state =='失败'">失败</span>
											<span style="color: #F56C6C;" v-else>错误</span>
										</template>
									</el-table-column>
								</el-table>
							</el-card>
						</div>
					</el-scrollbar>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import caseRes from '../components/CaseResult.vue';
export default {
	// 组件 注册子组件
	components: {
		caseRes
	},
	// 数据
	data() {
		return {
			// 运行测试记录信息
			record: null,
			// 测试报告信息
			report: null,
			// 显示的测试场景数据
			showScentDatas: null,
		}
	},

	// 方法
	methods: {

		// 获取测试报告
		async getReportInfo(id) {
			// 调后端接口 传参id
			const response = await this.$api.getTestReport(id);
			// 判断http响应状态
			if (response.status === 200) {
				// 赋值 报告信息
				// 响应结果 包含 执行历史记录日志信息 results.cases.log_data[]
				this.report = response.data.info;
				console.log("this.report::", this.report)
				// report.results 再赋值 给显示的测试场景数据
				this.showScentDatas = { ...this.report.results };
				console.log("this.showScentDatas::", this.showScentDatas)
			}
		},

		// 获取测试记录
		async getRecordInfo(id) {
			const response = await this.$api.getRecordInfo(id);
			if (response.status === 200) {
				// 赋值 运行测试记录信息
				// 响应结果 不包含 执行历史记录日志信息 results.cases.log_data[]
				this.record = response.data;
				console.log("this.record::", this.record)
			}
		},

		// 执行信息 条形图
		chart1() {
			const value = [this.report.all, this.report.success, this.report.fail, this.report.error];
			const label = ['用例总数', '通过用例', '失败用例', '错误用例'];
			this.$chart.chart1(this.$refs.chart1, value, label);
		},

		// 通过率 饼图
		chart2() {
			const datas = [
				{ value: this.report.success, name: '通过' },
				{ value: this.report.fail, name: '失败' },
				{ value: this.report.error, name: '错误' }
			];
			this.$chart.chart2(this.$refs.chart2, datas);
		}

	},

	// 计算属性
	computed: {
		// 通过场景数量
		successscent() {
			// filter 筛选出符合条件的元素，形成一个新的数组。
			// val 正在处理的当前元素
			// index 在处理的当前元素的索引（位置）。索引从 0 开始。
			// array 正在被处理的数组本身，即 this.report.results。
			return this.report.results.filter(function (val, index, array) {
				return val.state === 'success';
			});
		},

		// 未通过场景数量
		failscent() {
			return this.report.results.filter(function (val, index, array) {
				return val.state === 'fail';
			});
		},

		// 报错场景数量
		errorscent() {
			return this.report.results.filter(function (val, index, array) {
				return val.state === 'error';
			});
		}

	},

	// 钩子  页面渲染时调用
	async created() {
		// 路径参数方式获取id (当前页面的？)
		// const id = this.$route.params.id;
		const id = 367;
		// 路径参数获取id 页面地址上的id router/index.js - path: '/repory/:id/'
		console.log("this.$route.params.id::", this.$route.params.id)

		this.getReportInfo(id);  // 调用 获取报告 方法
		this.getRecordInfo(id);  // 调用 获取测试记录 方法

	},

	// 钩子 数据有更新的时候调用
	updated() {
		// 简写形式 去掉了{}
		// 如果 this.$refs.chart1 存在，则调用 this.chart1()
		if (this.$refs.chart1) this.chart1();  // 横向条形图
		if (this.$refs.chart2) this.chart2();  // 环形饼图
	},

};
</script>

<style>
/* 测试报告 标题 */
.report_title {
	font: bold 20px/50px 'microsoft yahei';
	text-align: center;
	color: #00aa7f;
}

/* 条形图、饼图 样式 */
.chartBox {
	height: 200px;
	background: rgba(198, 198, 202, 0.1);
}

/* 右侧盒子 标签展示内容中的标题样式 
具有类 right_box 的元素内的所有具有类 title 的子元素。
bold: 字体的粗细（weight），这里设置为粗体。
19px: 字体大小（font-size），设置为 19 像素。
20px: 行高（line-height），设置为 20 像素。
'microsoft yahei': 字体族（font-family）
text-indent 设置段落首行的缩进
color 设置文本的颜色
*/
.right_box .title {
	font: bold 19px/20px 'microsoft yahei';
	text-indent: 10px;
	color: #55aa7f
}
</style>