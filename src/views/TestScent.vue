<!-- 测试场景 -->
<template>
	<!-- 整个页面 一行两列4:20 
        :gutter 属性来指定列之间的间距
    -->
	<el-row :gutter="10">
		<!-- 第一列 左列是测试场景 -->
		<el-col :span="4">
			<div class="list_box">
				<!-- 标题 -->
				<div class="title">测试场景</div>
				<!-- 按钮 -->
				<el-button @click="addScent" icon="Plus" plain type="success" style="width:100%;">
					添加测试场景
				</el-button>
				<!-- Scrollbar 滚动条 -->
				<el-scrollbar height="calc(100vh - 162px)">
					<!-- 场景列表 Menu 菜单 
                        background-color、菜单的背景色
                        text-color和 菜单的文字颜色
                        active-text-color，当前激活菜单的文字颜色 
                    -->
					<el-menu :default-active="active" text-color="#000000" active-text-color="#00aa7f"
						style="background: none; border: none;">
						<el-menu-item @click="getScentData(item)" :index="item.id.toString()" v-for="item in testScents"
							style="height: 35px; line-height: 35px;">
							<el-icon>
								<HelpFilled />
							</el-icon>
							<span>{{ item.name }}</span>
						</el-menu-item>
					</el-menu>
				</el-scrollbar>
			</div>
		</el-col>

		<!-- 第二列 右列是 场景步骤、用例编辑 列表 -->
		<el-col :span="20">
			<el-scrollbar height="calc(100vh - 85px)">
				<div class="scent-data-box" v-if="steps">
					<el-divider content-position="left"><b>测试场景</b></el-divider>
					<el-row :gutter="5" style="margin-bottom: 20px;">
						<!-- 测试场景 -->
						<el-col :span="12">
							<el-input v-model="scentInfo.name" size="small">
								<template #prepend>
									场景名称
								</template>
								<template #append>
									<!-- 保存 编辑的场景名称 -->
									<el-button @click="saveScent" type="success" icon="CircleCheck">保存</el-button>
								</template>
							</el-input>
						</el-col>
						<!-- 测试场景右侧 运行、删除 
						 	text-align:right 设置文字水平居右
						-->
						<el-col :span="12" style="text-align: right;">
							<el-button @click="runScent" plain type="success" icon="Promotion">运行</el-button>
							<el-button @click="deleteScent" plain type="danger" icon="Delete">删除</el-button>
						</el-col>
					</el-row>

					<!-- 执行步骤 标题-->
					<el-divider content-position="left"><b>执行步骤</b></el-divider>
					<!-- 执行步骤 列表 ，滚动效果-->
					<el-scrollbar height="calc(100vh - 210px)">
						<!-- Table 表格 树形数据与懒加载 row-key 
                            row-key 在使用reserve-selection功能与显示树形数据时，该属性是必填的
                            show-header 是否显示表头 即便没有数据也占着空白高度位置，所以添加
                            margin-bottom 底部边距 展示的数据底边下边的空白区
                        -->
						<!-- <el-table :data="steps" row-key="id" :show-header="false" style="width: 100%; margin-bottom: 10px"> -->
						<el-table :data="steps" row-key="id" :show-header="false" style="width: 100%; margin-bottom: 10px">
							<!-- 左侧展示用例 -->
							<el-table-column>
								<template #default="scope">
									<!--  字体粗细 font-weight: 加粗bold -->
									<span style="font-weight: bold; font-size: 14px; color: #009A71;">
										{{ '步骤' + (scope.$index + 1) + ': ' }}
									</span>
									<span style="font-weight: bold; font-size: 14px;">
										{{ scope.row.stepInfo.title }}
									</span>
								</template>
							</el-table-column>
							<!-- 右侧展示按钮 编辑、删除 
							 	width="200px" 使两个按钮水平居右
							-->
							<el-table-column width="200px">
								<template #default="scope">
									<el-button @click="clickEditStep(scope.row.stepInfo)" plain type="success" icon="Edit">
										编辑
									</el-button>
									<el-button @click="clickDelete(scope.row.id)" plain type="danger" icon="Delete">
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>

						<!-- 新增步骤 -->
						<el-button @click="addStepDlg = true" plain type="success" icon="Plus">新增步骤</el-button>
					</el-scrollbar>
				</div>
			</el-scrollbar>
		</el-col>
	</el-row>


	<!-- 显示 测试场景 运行结果 弹窗
		drawer 抽屉 显示
		with-header 来控制是否显示标题
	-->
	<el-drawer v-model="ResultDlg" :with-header="false" size="60%">
		<div style="padding: 20px">
			<!-- 测试场景 执行结果
		 		Descriptions 描述列表 
					border 是否带边框 
			-->
			<el-descriptions title="执行结果" :column="4" border>
				<el-descriptions-item label="总数">{{ runScentResult.all }}</el-descriptions-item>
				<el-descriptions-item label="通过">{{ runScentResult.success }}</el-descriptions-item>
				<el-descriptions-item label="失败">{{ runScentResult.fail }}</el-descriptions-item>
				<el-descriptions-item label="错误">{{ runScentResult.error }}</el-descriptions-item>
			</el-descriptions>
			<!-- 测试场景 执行详情 标题-->
			<div style="height: 40px; line-height: 40px;"><b>执行详情</b></div>
			<!-- 测试场景 执行详情 列表 添加滚动-->
			<el-scrollbar height="calc(100vh - 180px)">
				<!-- Table 表格 - 展开行 -->
				<el-table :data="runScentResult.cases" style="width: 100%">
					<el-table-column type="expand">
						<template #default="props">
							<caseResult :result="props.row"></caseResult>
						</template>
					</el-table-column>
					<el-table-column label="用例名" prop="name" />
					<el-table-column label="请求方法" prop="method" />
					<el-table-column label="响应状态码" prop="status_cede" />
					<el-table-column label="执行结果" prop="state">
						<template #default="props">
							<span style="color: #00AA7F;" v-if="props.row.state == '成功'">成功</span>
							<span style="color: #F56C6C;" v-else>{{ props.row.state }}</span>
						</template>
					</el-table-column>
				</el-table>
			</el-scrollbar>
		</div>
	</el-drawer>

	<!-- 编辑用例的弹窗 -->
	<el-drawer v-model="editStepDlg" :with-header="false" size="65%">
		<EditCase :editCase="editCase" style="padding:0 10px; min-height: 500px;"></EditCase>
	</el-drawer>

	<!-- 添加测试步骤/用例 的弹窗 -->
	<el-drawer v-model="addStepDlg" :with-header="false">
		<!-- 为什么要放在这里 多一层这个包裹？？？ -->
		<template #default>
			<!-- Tabs 标签页 内外部接口 
                stretch 标签的宽度是否自撑开
             -->
			<el-tabs>
				<el-tab-pane label="内部接口">
					<!-- Tree 树形控件
                        show-checkbox 节点是否可被选择
                        props 配置选项 数的节点/子节点
                        node-key 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
                        default-expand-all 是否默认展开所有节点
                        highlight-current 是否高亮当前选中节点，默认值是 false。
						expand-on-click-node 如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
                    -->
					<!-- {{ inters1 }} -->
					<el-tree ref="treeM1" :data="inters1" show-checkbox :props="addTreeProps" node-key="id"
						default-expand-all highlight-current>
						<!-- 为什么是花括号 有两个值 node是做什么的？？ -->
						<template #default="{ node, data }">
							<!-- 不加span行不行？？没看出啥区别-->
							<span>
								<!-- 展示接口名称 -->
								<div v-if="data.name">
									<!-- 加粗加颜色 -->
									<b style="color: #00aa7f">
										<el-icon>
											<Paperclip />
										</el-icon>
										<!-- 展示接口名称 父选项 -->
										<span>{{ data.name }}</span>
									</b>
								</div>
								<!-- 展示用例名称 
								 	这里为什么判断data.title而不是data.steps.title？？
								-->
								<div v-if="data.title">
									<!-- icon 和 `用例` 文案 加粗加颜色 -->
									<b style="color: #00aa7f">
										<el-icon>
											<Link />
										</el-icon>
										<span>用例</span>
									</b>
									<!-- 展示接口名称 子选项 -->
									<span>{{ data.title }}</span>
								</div>
							</span>
						</template>
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="外部接口">
					<el-tree ref="treeM2" :data="inters2" show-checkbox :props="addTreeProps" node-key="id"
						default-expand-all highlight-current :expand-on-click-node="false">
						<!-- 为什么是花括号 有两个值 node是做什么的？？ -->
						<template #default="{ node, data }">
							<!-- 不加span行不行 -->
							<span>
								<!-- 展示接口名称 -->
								<div v-if="data.name">
									<!-- 加粗加颜色 -->
									<b style="color: #00aa7f">
										<el-icon>
											<Paperclip />
										</el-icon>
										<!-- 展示接口名称 父选项 -->
										<span>{{ data.name }}</span>
									</b>
								</div>
								<div v-if="data.title">
									<!-- icon 和 `用例` 文案 加粗加颜色 -->
									<b style="color: #00aa7f">
										<el-icon>
											<Link />
										</el-icon>
										<span>用例</span>
									</b>
									<!-- 展示接口名称 子选项 -->
									<span>{{ data.title }}</span>
								</div>
							</span>
						</template>
					</el-tree>
				</el-tab-pane>
			</el-tabs>

			<!-- Affix 固钉 底部 按钮 确认添加、关闭窗口
			 	offset 偏移量 距离底边距离
			 -->
			<el-affix position="bottom" :offset="40">
				<div style="text-align: center;">
					<!-- Tooltip 文字提示 -->
					<el-tooltip class="box-item" effect="dark" placement="top-start" content="将选择的用例,加入到测试场景中">
						<!-- addToScent('add')为什么要传参？？ 实践证明不传一样-->
						<el-button plain type="success" size="small" @click="addToScent('add')">
						<!-- <el-button plain type="success" size="small" @click="addToScent()"> -->
							确认添加
						</el-button>
					</el-tooltip>
					<el-tooltip class="box-item" effect="dark" placement="top-start" content="关闭当前窗口">
						<el-button plain type="danger" size="small" @click="addStepDlg = false">
							关闭窗口
						</el-button>
					</el-tooltip>
				</div>
			</el-affix>
		</template>


	</el-drawer>
</template>

<script>
// import Sortable from'
import Sortable from 'sortablejs';  // 引入手动排序方法
import { mapState, mapActions, mapGetters } from 'vuex';
import EditCase from '../components/CaseEdit.vue';  // 用例编辑模块
import caseResult from '../components/CaseResult.vue';  // 用例执行 响应结果模块
import { ElMessageBox, ElMessage } from 'element-plus'; // 消息提示
import { ElNotification } from 'element-plus'; // Notification 通知
export default {
	// 注册子组件
	components: {
		EditCase,
		caseResult
	},
	data() {
		return {
			// 当前选中的测试场景id
			active: '1',
			// 当前选中的测试场景对象，包含该场景所有信息
			scentInfo: null,
			// 测试场景中的测试步骤列表
			steps: null,

			// 添加测试步骤的弹窗 是否展示
			addStepDlg: false,
			// 树形数据子元素的字段
			addTreeProps: {
				// el+ 指定节点标签为节点对象的某个属性值
				// label	
				// el+ 指定子树为节点对象的某个属性值
				children: 'steps',
			},

			// 编辑用例的弹窗 是否展示
			editStepDlg: false,
			// 用例信息 赋值
			editCase: null,

			// 测试计划运行结果信息
			runScentResult: null,
			// 运行结果弹窗 是否展示
			ResultDlg: false,
		}
	},
	// 计算属性
	// computed: {
	// 	// 'pro'项目对象,'testScents'项目中所有测试场景,'envId'环境
	// 	...mapState(['pro', 'testScents', 'envId']),
	// 	// 'inters1'内部接口,'inters2'外部接口
	// 	...mapGetters(['inters1', 'inters2']),
	// },

	computed: {
		// 引入store - getters 计算方法
		...mapGetters(['inters1', 'inters2']),
		// 引入store - state 属性
		...mapState(['pro', 'testScents', 'envId']),
	},

	// 方法
	methods: {
		// 获取所有测试场景, 获取当前项目下的所有接口信息
		...mapActions(['getAllScent', 'getAllInterFaces']),

		// 添加测试场景
		async addScent() {
			const params = {
				name: 'New Scent',
				project: this.pro.id,
			};
			const response = await this.$api.createTestScent(params);
			if (response.status === 201) {
				this.$message({  // 参考写的
					type: 'success',
					message: '添加成功',
					duration: 1000,
				});
				// ElMessage({  // el组件
				//  type: 'success',
				//  message: '添加成功001',
				//  duration: 1000,
				// });
				this.getAllScent(); // 重新获取所有测试场景
			}
		},

		// 删除测试场景
		async deleteScent() {
			ElMessageBox.confirm(
				'确定要删除该场景吗?',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(async () => {
					const response = await this.$api.delTestScent(this.scentInfo.id);
					if (response.status === 204) {
						ElMessage({
							type: 'success',
							message: '删除成功',
							duration: 1000
						});
						// 
						this.getAllScent(); // 重新获取所有测试场景
					}
				})
				.catch(() => {
					ElMessage({
						type: 'info',
						message: '取消删除',
						duration: 1000,
					});
				});
		},

		// 保存编辑的场景名称 
		async saveScent() {
			const response = await this.$api.updateTestScent(this.scentInfo.id, this.scentInfo);
			if (response.status === 200) {
				this.$message({
					type: 'success',
					message: '保存成功',
					duration: 1000
				});
			};
			this.getAllScent(); // 重新获取所有测试场景
		},

		// 运行测试场景 按钮
		async runScent() {
			// 判断有场景ID
			if (this.envId) {
				const params = {
					env: this.envId,
					// 接口同一个，运行测试场景 就传场景id
					scent: this.scentInfo.id
				};
				this.$message({
					type: 'success',
					message: '开始运行场景！',
					duration: 1000
				});
				const response = await this.$api.runTest(params);
				console.log('日志运行测试场景接口响应信: ', response.data)
				if (response.status === 200) {
					// 赋值场景执行结果信息
					this.runScentResult = response.data;
					// 展示执行结果弹窗
					this.ResultDlg = true;
					console.log('日志运行测试场景接口响应信 this.runScentResult: ', this.runScentResult)
				}
			} else {
				this.$message({
					type: 'warning',
					message: '当前未选中测试场景！',
					duration: 1000
				})
			}
		},

		// 编辑测试场景中用例
		clickEditStep(editCase) {
			this.editStepDlg = true; // 展示编辑用例的弹窗
			this.editCase = editCase  // 选中的用例信息赋值
		},

		// 获取测试场景下的所有测试步骤
		// 传参测试场景
		async getScentData(scent) {
			this.scentInfo = { ...scent };  // 这一步不用也行 // 当前选中的测试场景
			console.log('日志 当前选中的测试场景this.scentInfo：', this.scentInfo)
			const response = await this.$api.getScentDatas(scent.id);
			if (response.status === 200) {
				// 测试场景中的测试步骤列表 赋值
				this.steps = response.data;
			}
		},

		// 删除测试场景中用例
		async clickDelete(id) {
			const response = await this.$api.delScentData(id);
			if (response.status === 204) {
				this.$message({
					type: 'success',
					message: '删除成功',
					duration: 1000,
				});
				this.getScentData(this.scentInfo) // 重新 获取测试场景下的所有测试步骤
			}
		},

		// 获取树形控件中被选中的用例
		getcheckedCase() {
			const Nodes1 = this.$refs.treeM1.getCheckedNodes();
			const Nodes2 = this.$refs.treeM2.getCheckedNodes();
			const Nodes = [...Nodes1, ...Nodes2];
			// 过滤出选择的用例 // 过滤出包含 title 属性的节点
			const result = Nodes.filter(function (item, index) {
				// 如果 item.title 存在（即返回一个真值），则该元素会被保留在新的数组 result 中。
				return item.title;
			});
			// 同上 gpt简化的
			// const result = Nodes.filter(item => item.title);
			return result;
		},

		// 往测试场景中添加用例数据
		async addToScent() {
			this.checkedCase = this.getcheckedCase();  // 获取树形控件中被选中的用例
			console.log('选中的所有测试用例this.checkedCase', this.checkedCase)
			let order_s = this.steps.length;
			for (let value of this.checkedCase) {
				console.log('let value of this.checkedCase中的 value', value)
				let item = { ...value }
				console.log('let item = { ...value }中的 item', item)
				order_s += 1;
				// sort 行顺序
				// step 步骤
				// scent 场景
				// 添加步骤到测试场景中 $api.addScentData()
				const response = await this.$api.addScentData({ sort: order_s, step: item.id, scene: this.scentInfo.id })
				if (response.status === 201) {
					// Notification 通知
					ElNotification({
						type: 'success',
						title: '成功',
						message: `用例-${item.title}-添加成功`,
						duration: 2000,
					});
				} else {
					ElNotification({
						type: 'success',
						title: '失败',
						message: `用例-${item.title}-添加失败`,
						duration: 2000,
					});
				}
			};
			this.getScentData(this.scentInfo);  // 调用 获取该场景下的所有测试步骤
			this.getAllInterFaces();  // 获取该项目所有接口

		},

		// 拖动套件中的用例顺序 仅前端有效，刷新后还原
		initSort() {
			// 获取元素的tbody部分，即表格主体
			// document 对象表示整个HTML文档。
			// querySelector 方法是 document 对象的方法，用于返回文档中匹配指定 CSS 选择器的第一个元素。如果找不到匹配项，则返回 null。
			// 
			// 具有 scent-data-box 类的元素。
			// 在该元素内部，查找具有 el-table__body-wrapper 类的元素。
			// 在 el-table__body-wrapper 元素内部，查找 tbody 元素，并返回这个 tbody 元素。

			// <el-table> 组件渲染过程中，会自动生成多个内部元素及其对应的类名
			// 	.el-table__body-wrapper 是包含表格主体（即所有数据行）的容器元素。
			// 		是包含表格主体内容（<tbody> 元素）的部分。
			// 	.el-table__header-wrapper 则是包含表格头部的容器元素。
			const tbody = document.querySelector('.scent-data-box .el-table__body-wrapper tbody');
			// 保存this的引用，以便在Sortable的回调函数中使用
			const _this = this;
			// 创建一个Sortable实例，使表格中的行可以拖动排序
			// Sortable.create(element, options);
			// 		Sortable/Sortablejs 这个库要提前安装、引入 cnpm install sortablejs 
			// 		element：要使其具有拖拽排序功能的DOM元素。
			// 		options：一个对象，包含了配置选项和事件回调，用于控制拖拽行为和处理拖拽事件
			// 			group：定义排序项目属于哪个组。可以是字符串或对象，用于设置不同列表之间的拖放行为。
			// 			sort：是否启用排序。默认为 true。
			// 			disabled：是否禁用拖拽功能。默认为 false。
			// 			handle：指定可拖拽的手柄（即只能通过某个子元素来拖动）。
			// 			animation：拖拽时的动画效果时间（以毫秒为单位）。
			// 			onEnd：拖拽结束时的回调函数。参数 evt 包含了拖拽事件的相关信息。
			Sortable.create(tbody, {
				// 定义拖动结束后的处理函数
				// 当拖拽操作结束时触发的回调函数
				onEnd(evt) {
					// .splice() 它会直接修改原数组，并返回一个包含被删除元素的新数组。
					// evt 参数：是一个事件对象，包含了拖拽事件的详细信息。

					// 从数组中删除一个元素，并返回该被删除的元素。
					// 		evt.oldIndex：元素在拖拽开始前的位置索引。
					// 			要删除的元素的索引位置。
					// 		1：要删除的元素数量。这里是删除一个元素。
					// 		[0]：因为 splice 返回的是一个数组，所以通过 [0] 获取被删除的第一个元素。
					const currRow = _this.steps.splice(evt.oldIndex, 1)[0];
					// 在数组的指定位置插入一个元素。
					// 		evt.newIndex：元素在拖拽结束后的位置索引。
					// 			要插入元素的位置索引。
					// 		0：表示不删除任何元素。
					// 		currRow：要插入的元素。
					_this.steps.splice(evt.newIndex, 0, currRow);
					// 更新排序后的顺序
					// 修改后端用例数据的顺序，暂时不用管这个函数，将后端时学
					// 调用更新顺序的方法
					_this.updateScentOrder();
				}
				// // 举例：
				// // 假设 this.steps 初始值为：
				// this.steps = ['step1', 'step2', 'step3', 'step4'];
				// // 拖拽 step2 从索引 1 到索引 3：
				// const evt = { oldIndex: 1, newIndex: 3 };
				// // 删除旧位置的元素并获取该元素
				// const currRow = this.steps.splice(evt.oldIndex, 1)[0]; // currRow = 'step2', this.steps = ['step1', 'step3', 'step4']
				// // 将获取的元素插入到新位置
				// this.steps.splice(evt.newIndex, 0, currRow); // this.steps = ['step1', 'step3', 'step4', 'step2']
				// // 最终结果：
				// this.steps = ['step1', 'step3', 'step4', 'step2'];

			});


		},
		// 修改后端套件内用例顺序
		async updateScentOrder() {
			// 修改 caseList 中的 order 顺序 字段
			// 遍历每一个步骤，更新排序顺序

			// item：当前正在处理的步骤对象。
			// index：当前步骤对象在数组中的索引。
			// array：被遍历的 this.steps 数组本身。
			this.steps.forEach((item, index, array) => {
				// 给 item 添加或修改 sort 属性，并不是一个函数
				item.sort = index + 1
			});
			// 发送请求后端修改测试场景中用例执行的顺序
			// 发送请求更新后端的数据顺序
			const response = await this.$api.updateScentDataOrder(this.steps);
			if (response.status === 200) {
				this.$message({
					type: 'success',
					message: '调整排序成功',
					duration: 1000,
				});
			}
		}
	},

	// 进入页面自动调用
	// 第一次见created左侧添加async，方法中已经实现异步了，不冲突么？
	async created() {
		await this.getAllScent();  //获取所有测试场景,testScents会有值	
		if (this.testScents.length > 0) {
			// 设置默认显示激活的测试场景
			// .id取到的是int类型
			// .toString()再转换成字符串
			// 默认选择场景列表中第一个场景
			this.active = this.testScents[0].id.toString();
			// 场景列表中第一个场景对象 解包赋值
			this.scentInfo = { ...this.testScents[0] }
			// 调用 获取该场景下的所有测试步骤
			await this.getScentData(this.scentInfo);
			// 拖动套件中的用例顺序
			// 初始化可拖动表格（拖动套件中的用例顺序）
			// 没有写html时调用该方法会报错
			this.initSort();
		};
	},
	// // 生命周期钩子
	// mounted() {
	//  this.initSort();
	// }
}
</script>

<style scoped>
/* 左侧模块样式 
box-shadow: 阴影效果
    水平偏移量  垂直偏移量 模糊半径 扩展半径 颜色
height: calc(100vh - 68px);  添加这个底部会多出一块
*/
.list_box {
	/* height: calc(100vh - 268px);  */
	box-shadow: 0 0 5px #00aa7f;
}

/* 左侧标题 测试场景 
font 加粗 大小/行高 雅黑
border-bottom 边框底部
*/
.list_box .title {
	text-align: center;
	font: bold 20px/40px 'microsoft yahei';
	border-bottom: solid 4px #b3b3b3;
}
</style>