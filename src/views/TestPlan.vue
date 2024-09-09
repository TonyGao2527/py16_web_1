<!-- 测试计划 -->
<template>
	<!-- 页面 布局 所有内容，分3列 
		gutter 列间距
		style="height:calc(100vh - 68px);" 越<68px 底部白色会越大
	-->
	<el-row :gutter="10" style="height:calc(100vh - 68px);">
		<!-- 第1列：测试计划 -->
		<el-col :span="4">
			<div class="list_box">
				<!-- 标题 -->
				<div class="title">测试计划</div>
				<!-- 按钮 添加测试计划 -->
				<el-button @click="addPlan" icon="Plus" plain type="success" style="width:100%">添加测试计划</el-button>
				<!-- 场景列表 -->
				<!-- Scrollbar 滚动条 -->
				<el-scrollbar height="calc(100vh - 152px)">
					<!-- el - Menu 菜单 
					:default-active  页面加载时默认激活菜单的 index ， el-menu-item中的哪一个
					active-text-color： 活动菜单项的文本颜色。菜单项被激活时，其文本颜色将设置为绿色
					text-color="#000000"：菜单的文字颜色。当菜单项未被激活时，其文本颜色将设置为黑色。默认黑色不加也行
					background: none; 背景颜色或背景图片设置为“无”
					border: none; 内边框设置为“无”
				-->
					<el-menu :default-active="active" active-text-color="#00aa7f" text-color="#000000"
						style="background: none; border: none;">
						<!-- planList  测试计划列表
						:index 唯一标识
						getPlanData(item)  // 获取测试计划下所有的测试场景
						height 改变行间距
						line-height: 5px; 没变化???						
					-->
						<el-menu-item v-for="item in planList" :index="item.id.toString()" @click="getPlanData(item)"
							style="height: 35px; line-height: 35px;">
							<el-icon>
								<CollectionTag />
							</el-icon>
							<span> {{ item.name }} </span>
						</el-menu-item>
					</el-menu>
				</el-scrollbar>
			</div>
		</el-col>

		<!-- 第2列：计划编辑：基本信息、测试场景 -->
		<el-col :span="10" v-if="planInfo">
			<!-- 基本信息 -->
			<!-- el - Divider 分割线 -->
			<el-divider content-position="left"><b>基本信息</b></el-divider>
			<!-- 布局：一行两列 
				margin-bottom: 20px; 下边距为20像素
			-->
			<el-row :gutter="5" style="margin-bottom: 20px;">
				<!-- <el-row :gutter="5"> -->
				<!-- 左列：输入框 -->
				<el-col :span="16">
					<el-input v-model="planInfo.name" size="small">
						<template #prepend> <!-- 输入框 左侧 -->
							场景名称
						</template>
						<template #append> <!-- 输入框 右侧 -->
							<!-- 保存修改场景名称 -->
							<el-button @click="savePlan" plain size="small" type="success" icon="CircleCheck">保存</el-button>
						</template>
					</el-input>
				</el-col>

				<!-- 运行、删除按钮 -->
				<el-col :span="8" style="text-align: right;">
					<el-button @click="runPlan" plain size="small" type="success" icon="Promotion">运行</el-button>
					<el-button @click="delPlan" plain size="small" type="danger" icon="Delete">删除</el-button>
				</el-col>
			</el-row>

			<!-- 测试场景 列表 -->
			<!-- 标题 -->
			<el-divider content-position="left"><b>测试场景</b></el-divider>
			<!-- 按钮 -->
			<el-button @click="drawer = true" plain size="small" type="success" icon="Plus">添加</el-button>

			<!-- 数据列表
				el-Table 表格-基础表格  
				row-key="id" 行数据的 Key，用来优化 Table 的渲染；
				:show-header="false"  是否显示表头. 表头及表头下划线小时；
				margin-bottom: 10px;" 属性设置元素的下外边距。
				width: 100%  宽度会占据其父元素宽度的100%。宽度能够随着浏览器窗口或父元素的大小变化而动态调整。
				margin-bottom: 10px 底部添加了10像素的外边距.与表格下方的其他元素保持一定的距离。
				scents // （选择的/某个）测试计划下所有测试场景
				-->
			<el-table :data="scents" row-key="id" :show-header="false" height="calc(100vh - 245px)"
				style="width: 100%; margin-bottom: 10px">
				<!-- 场景名称 -->
				<!-- <el-table :data="scents" style="width: 100%"> -->
				<el-table-column>
					<template #default="scope">
						<!-- font-weight: bold;：这个属性将文本设置为粗体。
						 	font-size: 14px;：这个属性设置了文本的字体大小为14像素。
						 -->
						<span style="font-weight: bold; font-size: 14px; color: #009A71">
							{{ '测试场景' + (scope.$index + 1 + ':') }}
						</span>
						<span style="font-weight: bold; font-size: 14px;">
							{{ scope.row.name }}
						</span>
					</template>
				</el-table-column>
				<!-- 场景名称 右侧 删除 -->
				<el-table-column width="100px">
					<template #default="scope">
						<el-button @click="delPlanInScent(scope.$index)" plain size="small" type="danger"
							icon="Delete">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

		</el-col>


		<!-- 第3列：通过率趋势图、执行记录 -->
		<el-col :span="10">
			<!-- 标题 -->
			<el-divider content-position="left"><b>通过率趋势图</b></el-divider>
			<!-- 通过率趋势图 -->
			<div ref="chartTable" class="char_box1"></div>

			<!-- 标题 -->
			<el-divider content-position="left"><b>执行记录</b></el-divider>
			<!-- 执行记录 
				records 测试计划中所有运行记录 
			-->

			<el-table :data="records" size="small" height="calc(100vh - 380px)">
				<el-table-column label="执行时间" prop="date" min-width="140">
					<template #default="scope">
						{{ $date.rTime(scope.row.create_time) }}
					</template>
				</el-table-column>
				<el-table-column label="测试环境" prop="env_name" min-width="110" />
				<el-table-column label="总用例" min-width="60">
					<template #default="scope">
						<span v-if="scope.row.statue !== '执行中'">{{ scope.row.all }}</span>
					</template>
				</el-table-column>
				<el-table-column label="通过数" min-width="60">
					<template #default="scope">
						<span v-if="scope.row.statue !== '执行中'">{{ scope.row.success }}</span>
					</template>
				</el-table-column>

				<el-table-column label="通过率" min-width="80">
					<template #default="scope">
						<span v-if="scope.row.statue !== '执行中'">{{ scope.row.pass_rate + '%' }}</span>
					</template>
				</el-table-column>

				<el-table-column label="测试报告" min-width="100">
					<template #default="scope">
						<span v-if="scope.row.statue === '执行中'">
							<el-tag>{{ scope.row.statue }}...</el-tag>
						</span>
						<el-button v-else @click="$router.push({ name: 'report', params: { id: scope.row.id } })" plain
							size="small" type="success" icon="View">
							报告
						</el-button>
					</template>
				</el-table-column>
			</el-table>

		</el-col>

	</el-row>

	<!-- 添加测试场景到测试计划中 
		el-Drawer 抽屉
			v-model="drawer" 是否显示 Drawer
			direction="rtl" Drawer 打开的方向 "rtl"右侧
			size="20%" Drawer 窗体的大小,
			:show-close	是否显示关闭按钮
	-->
	<el-drawer v-model="drawer" direction="rtl" size="20%" :show-close="false">
		<!-- 插槽 顶部标题 -->
		<template #header>
			<b style="color: #000000">添加测试流程</b>
		</template>

		<!-- 测试场景数据列表 -->
		<div>
			<!-- el - Table 表格 - 多选 
				selection-change	当选择项发生变化时会触发该事件
					selectTable // 将选中的测试场景id保存到addScentList中
				tooltip-effect	溢出的 tooltip 的 effect
				Scents2 在计算属性中computed // 可以添加到任务中的套件  (个人理解：可以添加到 测试计划 中的 测试场景)
			-->
			<el-table ref="addRef" :data="Scents2" @selection-change="selectTable" tooltip-effect="dark" size="small"
				style="width: 100%">
				<!-- 
					type 如果设置了selection则显示多选框
					min-width 会把剩余宽度按比例分配给设置了 min-width 的列
					label 属性来定义表格的列名
					当 el-table 元素中注入 data 对象数组后，在 el-table-column 中
						用 prop 属性来对应对象中的键名即可填入数据，
						用 label 属性来定义表格的列名。
				-->
				<el-table-column type="selection" min-width="40" />
				<!--  prop="name"就是Scwnrs2对象中的name场景名称 -->
				<el-table-column prop="name" label="全选" min-width="120" />
			</el-table>
		</div>

		<!-- 测试场景数据列表 底部的 操作按钮 
			margin: 10px; 表示该 div 元素四周的外边距均为 10 像素
			text-align: center; 则将该 div 内部的文本内容水平居中对齐
		-->
		<div style="margin: 10px; text-align: center;">
			<!-- el - Tooltip 文字提示 -->
			<el-tooltip effect="dark" placement="top-start" content="添加选中测试流程到任务中">
				<el-button plain size="small" type="success" @click="addScentToPlan">确认添加</el-button>
			</el-tooltip>

			<el-tooltip effect="dark" placement="top-start" content="清除选中选项">
				<!-- 
					$refs.addRef  代表标签 <el-table ref="addRef">，
        			.clearSelection()  <el-table> 组件的一个方法，用于清空表格中的所有选中项。
				-->
				<el-button plain size="small" type="warning" @click="$refs.addRef.clearSelection()">清除选中</el-button>
			</el-tooltip>

			<el-tooltip effect="dark" placement="top-start" content="关闭当前窗口">
				<el-button plain size="small" type="danger" @click="drawer = false">关闭窗口</el-button>
			</el-tooltip>
		</div>

	</el-drawer>
</template>

<script>
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { mapState } from 'vuex';

import cloneDeep from 'lodash/cloneDeep';

export default {
	data() {
		return {
			// 选中激活的测试计划id
			active: '1',
			// 测试计划列表
			planList: [],
			// 当前选中的测试计划信息。当前选中测试计划对象
			planInfo: null,  // [create_time:"", id:int, name:"", project:int, scent:[0:int, 1:int, 2:int]]
			// （选择的/某个）测试计划下所有测试场景
			scents: [],
			// 测试计划中所有运行记录
			records: [],
			// 是否展示 添加测试场景的弹窗
			drawer: false,
			// 存储勾选要添加到测试计划中的测试场景
			addScentList: [],
		}
	},


	// 方法
	methods: {
		// 获取所有测试计划
		async getAllPlan() {
			// 调用后端接口, 传参项目id 
			const response = await this.$api.getTestPlan(this.pro.id)
			if (response.status === 200) {
				// 测试计划列表 赋值
				// 没有放在store中 因为不是多个页面共用 所以不用放
				this.planList = response.data;
				// 设置默认激活的测试计划， 并获取数据
				// 在 this.planInfo 还没有被初始化或设置的情况下，才会去获取并显示第一个测试计划的数据。
				// 不加this.planInfo == null，每次调用时（比如页面刷新或其他情况），
				//     都会强制重置 this.active 为 planList 中的第一个计划，并且重新获取这个计划的数据。
				if (this.planList.length > 0 && this.planInfo == null) {
					// if (this.planList.length > 0) {
					// 计划列表中第一个赋值给展示计划的属性，转换成字符串
					this.active = this.planList[0].id.toString();
					// 获取测试计划下所有的测试场景
					this.getPlanData(this.planList[0]);
				}
			}

		},

		// 获取测试计划下所有的测试场景
		// plan this.planList遍历的item测试计划对象 ，默认显示this.planList[0]
		async getPlanData(plan) {
			// if (!plan || !plan.id) return;
			// 测试计划对象拆包
			this.planInfo = { ...plan }
			console.log("this.planInfo::", this.planInfo)
			// 获取测试计划下所有的测试场景。调用后端接口
			const response = await this.$api.getTestScent({
				testplan: plan.id
			});
			if (response.status === 200) {
				// 赋值(选择的计划的)测试场景
				this.scents = response.data;
			}
			// 获取测试计划所有的执行记录
			this.getAllRecord();
		},

		// 获取测试计划所有的执行记录
		async getAllRecord() {
			// 调用后端接口
			const response2 = await this.$api.getTestRecord({
				// 传参 当前选中测试计划id
				plan: this.planInfo.id
			});
			if (response2.status === 200) {
				// 赋值 测试计划中所有运行记录
				this.records = response2.data;
			}
		},

		// 添加测试计划
		async addPlan() {
			const params = {
				name: 'New Plan',  // 新命名
				project: this.pro.id,
			};
			// 调用后端接口 创建测试计划，传参params对象；
			const response = await this.$api.createTestPlan(params);
			if (response.status === 201) {
				this.$message({
					type: 'success',
					message: '添加成功',
					durantion: 1000,
				});
				// 获取所有测试计划
				this.getAllPlan();
			}
		},

		// 保存修改的测试计划名称
		async savePlan() {
			const response = await this.$api.updateTestPlan(this.planInfo.id, this.planInfo);
			if (response.status == 200) {
				this.$message({
					type: 'success',
					message: '保存成功',
					duration: 1000
				});
				// 获取所有测试计划
				this.getAllPlan();
			}
		},

		// 运行测试计划
		async runPlan() {
			if (this.envId) {  // 判断当前选则的环境Id
				const params = {  // 创建组装对象参数c
					env: this.envId,
					// 如果以测试计划运行就是测试计划id；
					// 如果以测试场景运行就是测试场景id；
					// 如果是以单条用例运行就是单条用例id；
					plan: this.planInfo.id
				};
				this.$message({  // 提示开始运行; 
					type: 'success',
					message: '开始运行！',
					duration: 1000,
				});
				// 调用后端接口
				const response = await this.$api.runTest(params);
				if (response.status === 200) {
					ElNotification({  // el - Notification 通知 - 右侧展示通知
						title: '提示',
						message: response.data.status,
						duration: 1000
					});
					// 再次 获取测试计划所有的执行记录
					this.getAllRecord();
				}
				console.log("测试计划点运行 且成功 response.data", response.data);
			} else {
				this.$message({
					type: 'warning',
					message: '当前未选中测试环境！',
					duration: 1000,
				});
			}
		},

		// 删除测试计划
		delPlan() {
			// 点击后先弹出提示窗
			// el- Message Box 消息弹出框
			ElMessageBox.confirm(
				'确定要删除吗？',  // 提示信息
				'提示',  // 弹框左上角 标题
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				// 点`确定`按钮执行这里
				.then(async () => {
					const response = await this.$api.delTestPlan(this.planInfo.id);
					if (response.status === 204) {
						ElMessage({
							type: 'success',
							message: '删除成功',
							duration: 1000,
						})
						// 再次 获取所有测试计划
						this.getAllPlan();
					}
				})
				// 点`取消`按钮执行这里
				.catch(() => {
					ElMessage({
						type: 'info',
						message: '已取消删除',
						duration: 1000,
					})
				})
		},

		// 将选中的测试场景id保存到 addScentList 中
		// Vue.js 的事件系统自动处理参数传递。将新的选择列表（一个包含被选中行的对象数组）作为参数 val 传递给 selectTable 函数。
		selectTable(val) {
			// 这一行代码清空了 this.addScentList 数组，
			//     确保每次调用 selectTable 函数时，
			//     都会从一个空数组开始填充数据。
			this.addScentList = []
			// forEach 是一个数组方法，用于遍历数组中的每个元素。
			val.forEach(item => {
				this.addScentList.push(item.id);
			});
		},

		// 添加选中的测试场景到测试计划中
		async addScentToPlan() {
			let params = { ...this.planInfo };
			// 勾选的选项addScentList push添加到 params.scent中
			params.scent.push(...this.addScentList);
			// 发送请求
			const response = await this.$api.updateTestPlan(params.id, params);
			if (response.status === 200) {
				this.$message({
					type: 'success',
					message: '添加成功',
					duration: 1000
				});
				// 更新页面数据
				// 当前选中的测试计划信息。当前选中测试计划对象
				this.planInfo = response.data;
				// 获取测试计划下所有的测试场景
				this.getPlanData(this.planInfo)
			}
			// 清空选中的选项
			this.$refs.addRef.clearSelection();
		},

		// 删除测试计划中的测试场景
		async delPlanInScent(index) {
			let params = { ...this.planInfo }
			// let params = cloneDeep(this.planInfo) // 深拷贝 不影响之前的数据
			console.log('params.scent.splice(index, 1)删除前的数据this.planInfo', this.planInfo)
			// splice() 方法：可以通过索引删除数组中的元素，也可添加，或者同时进行删除和添加。
			// array.splice(startIndex, deleteCount, item1, item2, ...)
			//     startIndex：表示从数组的哪个位置开始操作。它是一个索引值。
			//     deleteCount：表示要删除多少个元素。
			//     item1, item2, ...：表示要插入的新元素（可选）。
			params.scent.splice(index, 1);
			console.log('this.planInfo删除前的数据', this.planInfo)
			const response = await this.$api.updateTestPlan(params.id, params);
			if (response.status === 200) {
				this.$message({
					type: 'success',
					message: '删除成功',
					duration: 1000,
				});
				// 更新页面中当前测试假花的测试场景
				// 当前选中的测试计划信息。当前选中测试计划对象
				this.planInfo = response.data;
				console.log('this.planInfo删除后的数据', this.planInfo)
				console.log('response.data删除后的数据', response.data)
				// 获取测试计划下所有的测试场景
				this.getPlanData(this.planInfo);
			}
		}
	},

	// 钩子 页面渲染前执行 
	created() {
		// 获取所有的测试计划
		this.getAllPlan();
	},


	// 计算属性 
	computed: {
		// 映射VUES - store - state数据
		// testScents 项目中所有的测试场景
		...mapState(['pro', 'envId', 'testScents']),

		// Vue 会自动追踪 records 的变化，并在变化时重新计算 chartData，从而确保图表数据是最新的。
		// 构造折线图的数据
		chartData: function () {
			let runDate = [];  // 存放执行时间的数据
			let passRate = [];  //存放通过率的

			// 遍历 this.records 是执行历史记录，
			for (let item of this.records) {
				// item.create_time 取出执行时间
				// this.$date.rTime 格式化时间
				// push 存入到 let runDate中
				runDate.push(this.$date.rTime(item.create_time));
				// item.pass_rate 取出通过率 
				// parseFloat内置函数解析 Float类型
				// .toFixed(2)转化两位小数，
				// push 存入到 let passRate中；
				passRate.push(parseFloat(item.pass_rate).toFixed(2));
			}
			return {
				// 返回一个包含 label 和 value 属性的对象
				// .reverse()反转数组的顺序，使最近的日期及对应的数据显示在图标最左侧
				// 执行日期
				label: runDate.reverse(),
				// 通过率
				value: passRate.reverse()
			}
		},

		// 可以添加到任务中的套件
		Scents2: function () {
			// 获取计划中没有添加的所有测试场景
			// 项目中所有的测试场景
			// .filter() 返回一个新数组，其中包含原数组中所有使提供的函数返回 true 的元素。
			let newSuites = this.testScents.filter((item, index) => {
				// this.scents（选择的/某个）测试计划下所有测试场景
				// .find遍历数组，并返回第一个使提供的函数返回 true 的元素的值。如果没找到则返回 undefined。
				// 叹号是取反 目的是已经添加的测试场景不能再次选择
				return !this.scents.find(item2 => {
					return item2.id == item.id
				});
			});
			return newSuites
		}

	},

	// 侦听器 添加监听 当xxx改变的时候则进行调用
	// 解决 页面渲染前只能调用获取一次数据
	watch: {
		// 测试计划中所有运行记录
		// 执行记录数组
		// 最开始是空的，后面可能不为空
		records(val) {
			// if(val)判断不为空，调用通过率趋势图进行渲染this.$chart.chart3()，
			// $chart 全局属性，在main.js中定义
			if (val) {
				// 渲染通过率趋势图
				// 使用chart3()是折线图
				this.$chart.chart3(
					this.$refs.chartTable,  // 通过率趋势图<div ref="chartTable">
					this.chartData.value,  // 在计算属性 computed - chartdata 定义的值；
					this.chartData.label);  // 在计算属性 computed - chartdata 定义的值；
			}
		},
	},
}

</script>

<style>
/* 左侧菜单样式 
box-shadow: 阴影效果
    水平偏移量  垂直偏移量 模糊半径 扩展半径 颜色
height: calc(100vh - 68px);  添加这个底部会多出一块
*/
.list_box {
	/* height: calc(100vh - 68px); */
	box-shadow: 0 0 5px #00aa7f;
}

/* 左侧菜单 测试计划 标题
font 加粗 大小/行高 雅黑
border-bottom 边框底边线
*/
.list_box .title {
	text-align: center;
	font: bold 20px/40px 'microsoft yahei';
	border-bottom: solid 4px #b3b3b3;
}

/* 通过率趋势图 */
.char_box1 {
	height: 200px;
}
</style>