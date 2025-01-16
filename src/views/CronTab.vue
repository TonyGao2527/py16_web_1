<template>
	<!-- 添加定时任务 按钮 -->

	<el-button @click='dialogCron = true; updateBtn = false' style="margin: 10px 5px;" type="success" icon="Plus"
		size="small">
		添加定时任务
	</el-button>

	<!-- 定时任务列表 -->
	<el-table :data="cronList" style="width: 100%" size="small">
		<el-table-column label="创建时间" min-width="180">
			<template #default="scope">
				{{ $date.rTime(scope.row.create_time) }}
			</template>
		</el-table-column>
		<el-table-column prop="name" label="名称" min-width="140"></el-table-column>
		<el-table-column prop="plan_name" label="执行任务" min-width="140"></el-table-column>
		<el-table-column prop="env_name" label="执行环境" min-width="140"></el-table-column>
		<el-table-column prop="rule" label="执行规则" min-width="140"></el-table-column>
		<el-table-column label="是否开启" min-width="120">
			<template #default="scope">
				<!-- 
					@change switch 状态发生变化时才触发回调函数
					@click 事件每次点击都会触发, 并不一定意味着开关状态改变
					inline-prompt 属性来控制文本是否显示在点内
				 -->
				<!-- 添加颜色: 方式一(弃用): active-color inactive-color-->
				<!-- <el-switch @change="switchCronStatus(scope.row)" v-model="scope.row.status" active-color="#13ce66"
					inactive-color="#000000" /> -->
				<!-- 添加颜色: 方式二: --el-switch-on-color --el-switch-off-color -->
				<!-- <el-switch @change="switchCronStatus(scope.row)" v-model="scope.row.status"
					style="--el-switch-on-color: #13ce66; --el-switch-off-color: #000000" inline-prompt active-text="开"
					inactive-text="关" /> -->
				<!-- 添加颜色: 方式三: 通过标签名 -->
				<!-- <el-switch @change="switchCronStatus(scope.row)" v-model="scope.row.status" /> -->
				<!-- 添加颜色: 方式四: 通过类名 -->
				<el-switch class="el_switch" @change="switchCronStatus(scope.row)" v-model="scope.row.status"
					inline-prompt active-text="开" inactive-text="关" />
			</template>
		</el-table-column>
		<el-table-column label="操作" min-width="100">
			<template #default="scope">
				<!-- el - Tooltip 文字提示 -->
				<el-tooltip class="item" effect="dark" content="编辑" placement="top">
					<el-button @click='showUpdateCronDlg(scope.row)' type="success" size="small"
						icon="Edit"></el-button>
				</el-tooltip>
				<el-tooltip class="item" effect="dark" content="删除" placement="top">
					<el-button @click="delCron(scope.row.id)" type="danger" size="small" icon="Delete"></el-button>
				</el-tooltip>
			</template>
		</el-table-column>
	</el-table>

	<!-- 创建or修改定时任务的窗口 -->
	<el-dialog v-model="dialogCron" width="45%">
		<!-- el - Dialog 对话框 - Slots - header -->
		<div style="text-align: center" slot='title'>
			<!-- 弹窗标题, 根据updateBtn是否是修改操作显示不同内容 -->
			<span v-if="updateBtn" style="font-size: 18px; font-weight: bold;">修改定时执行任务</span>
			<span v-else style="font-size: 18px; font-weight: bold;">创建定时执行任务</span>
		</div>
		<!-- status-icon属性为输入框添加了表示校验结果的反馈图标 -->
		<!-- <el-form :model="cronTabData" ref="cronTabData" label-width="80px" :rules="rules"> -->

		<!-- 表单 -->
		<!-- <el-form :model="cronTabData" ref="cronTabData" label-width="80px"> -->
		<el-form :model="cronTabData" ref="cronTabData" label-width="80px" :rules="rules">
			<el-form-item label="任务名称" prop="name">
				<el-input v-model="cronTabData.name" placeholder="请输入名称"></el-input>
			</el-form-item>
			<el-form-item label="测试环境" prop="env">
				<el-select v-model="cronTabData.env" placeholder="请选择环境" style="width: 100%;">
					<el-option v-for="item in testEnvs" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="执行计划" prop="plan">
				<el-select style="width: 100%;" v-model="cronTabData.plan" placeholder="请选择计划">
					<el-option v-for="item in testPlans" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否开启">
				<!-- <el-switch v-model="cronTabData.status" active-color="#13ce66" inactive-color="#c3c3c3"/> -->
				<el-switch class="el_switch" v-model="cronTabData.status" active-text="开" inactive-text="关"
					inline-prompt />
			</el-form-item>

			<el-form-item label="定时规则" prop="rule">
				<el-input v-model="cronTabData.rule" placeholder="请输入规则"></el-input>
				<el-row :gutter="20">
					<el-col :span="14">
						<h5>规则说明:</h5>
						<div class="explain_box">* * * * *
							<span>分别表示 minute hour week day month </span>
						</div>
						<div class="explain_box">minute：
							<span>表示分钟，可以是从0到59之间的任何整数。</span>
						</div>
						<div class="explain_box">hour：
							<span>表示小时，可以是从0到23之间的任何整数。</span>
						</div>
						<div class="explain_box">week：
							<span>表示星期几，可以是从0到7之间的任何整数，这里的0或7代表星期日。</span>
						</div>
						<div class="explain_box">day：
							<span>表示日期，可以是从1到31之间的任何整数。</span>
						</div>
						<div class="explain_box">month：
							<span>表示月份，可以是从1到12之间的任何整数。</span>
						</div>

					</el-col>
					<el-col :span="10">
						<h5>配置案例：</h5>
						<div class="explain_box">5 * * * * :
							<span>每小时的第5分钟执行一次任务</span>
						</div>
						<div class="explain_box">30 9 * * * :
							<span>每天上午的 9:30 执行一次任务</span>
						</div>
						<div class="explain_box">30 9 * 8 * :
							<span>每月8号上午的9:30执行一次任务</span>
						</div>
						<div class="explain_box">30 9 * 5 3 :
							<span> 每年的3月5日9:30执行一次任务</span>
						</div>
						<div class="explain_box">30 9 0 * * :
							<span>每星期日的上午9:30执行一次任务</span>
						</div>
					</el-col>
				</el-row>
			</el-form-item>
		</el-form>
		<!-- 对话框底部按钮
			el - Dialog 对话框 - Slots - footer -->
		<div slot="footer" class="dialog-footer" style="text-align: center;">
			<el-button @click="dialogCron = false" size="small">取 消</el-button>
			<!-- <el-button v-if="updateBtn" type="success" @click="UpdateCron()" size="small">提交修改</el-button>
			<el-button v-else type="success" @click="createCron()" size="small">创 建</el-button> -->
			<el-button v-if="updateBtn" type="success" @click="submitFrom('update')" size="small">提交修改</el-button>
			<el-button v-else type="success" @click="submitFrom('create')" size="small">创 建</el-button>
		</div>
	</el-dialog>

</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {

	data() {
		return {

			cronList: null,// 定时任务列表
			dialogCron: false, // 添加or修改定时任务的弹窗 开关
			updateBtn: true,// 添加or修改定时任务的弹窗中的 “提交修改”按钮 开关
			// 添加/修改弹窗 的 定时任务表单数据
			cronTabData: {
				name: "冒烟测试定期执行",
				rule: "* * * * *",
				status: true,
				plan: null,
				env: null
			},
			// 校验规则
			rules: {
				// trigger: 'blur' 是指在输入框失去焦点时触发校验，
				// trigger: 'change' 是指在选择框的值发生变化时触发校验。
				name: [
					{ required: true, message: '请输入任务名称', trigger: 'blur' }
				],
				env: [
					{ required: true, message: '请选择测试环境', trigger: 'change' }
				],
				plan: [
					{ required: true, message: '请选择执行计划', trigger: 'change' }
				],
				rule: [
					{ required: true, message: '请输入定时规则', trigger: 'blur' }
				]
			},
		}
	},

	// 计算属性
	computed: {
		...mapState(['pro', 'testEnvs', 'testPlans'])
	},

	// 方法
	methods: {
		// 获取所有定时任务
		async getAllCron() {
			const response = await this.$api.getCrons(this.pro.id)
			if (response.status === 200) {
				this.cronList = response.data
			}
		},

		// 删除列表中的某个定时任务
		delCron(id) {
			// this.$confirm 是 ElMessageBox.confirm 的简化调用方式
			this.$confirm(
				'此操作将永久删除该定时任务, 是否继续?',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
				.then(async () => {
					// 删除定时任务
					const response = await this.$api.delCron(id)
					if (response.status === 204) {
						this.$message({
							type: 'success',
							message: '删除成功!',
							duration: 1000,
						});
						// 刷新页面定时任务
						this.getAllCron()
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
						duration: 1000,
					});
				});
		},

		// 任务开启和关闭  定时任务开关(列表)
		async switchCronStatus(cron) {
			// cron是cronList中的某个定时任务
			const response = await this.$api.updateCron(cron.id, cron)
			if (response.status === 200) {
				if (cron.status == true) {
					this.$message({
						type: 'success',
						message: '定时运行已开启',
						duration: 1000
					})
				} else {
					this.$message({
						type: 'warning',
						message: '定时运行已关闭',
						duration: 1000
					})
				}
			} else {
				this.$message({
					type: 'error',
					message: '修改状态失败',
					duration: 1000
				})
			}
		},

		// 提交表单方法
		async submitFrom(action) {
			// 校验表单
				this.$refs.cronTabData.validate(async (valid) => {
					console.log('调试输出验证结果Form validation valid:', valid);  // 调试输出验证结果
				if (valid) {
					if (action === 'create') {
						console.log('创建Creating cron task...');  // 调试输出创建任务的日志
						await this.createCron();
					} else if (action === 'update') {
						console.log('更新Updating cron task...');  // 调试输出更新任务的日志
						await this.UpdateCron();
					}
				} else {
					this.$message({
						type: 'error',
						message: '表单验证失败，请填写必填项',
						duration: 1000
					});
				}
			});
		},

		// 添加定时任务
		async createCron() {
			const params = {
				project: this.pro.id,
				...this.cronTabData
			}
			const response = await this.$api.createCron(params)
			if (response.status === 201) {
				this.$message({
					type: 'success',
					message: '定时任务添加成功',
					duration: 1000
				})
				this.dialogCron = false  // 添加or修改定时任务的弹窗 开关，关闭
				this.getAllCron()  // 刷新页面 所有定时任务
			}
		},

		//显示修改定时任务的窗口
		showUpdateCronDlg(cron) {
			// cron从定时任务列表cronList取出当前定时任务数据
			//     赋值给 添加/修改弹窗 的 定时任务表单数据
			this.cronTabData = { ...cron }
			this.dialogCron = true // 添加or修改定时任务的弹窗 开关, 打开
			// 显示修改按钮
			this.updateBtn = true // 添加or修改定时任务的弹窗中的 “提交修改”按钮 开关, 显示
		},

		// 修改定时任务
		async UpdateCron() {
			const response = await this.$api.updateCron(this.cronTabData.id, this.cronTabData)
			if (response.status === 200) {
				this.$message({
					type: 'success',
					message: '修改成功',
					duration: 1000
				})
				this.dialogCron = false  // 添加or修改定时任务的弹窗 开关, 关闭
				this.getAllCron()   // 刷新页面 所有定时任务
			}
		},
	},

	// 生命周期 钩子函数 进入页面就调用
	created() {
		this.getAllCron() // 获取 所有定时任务
	}
}

</script>

<style scoped>
/* 通过设置el-switch组件类名class="el_switch" 设置样式 
	--el-switch-on-color: #42b983;  开启状态的颜色
	--el-switch-off-color: #bcf600;  关闭状态的颜色
*/
.el_switch {
	--el-switch-on-color: #42b983;
	--el-switch-off-color: #bcf600;
}

/* 方法四 通过标签名修改样式 */
/* ::v-deep .el-switch__core {
	--el-switch-on-color: #42b983 !important;
	--el-switch-off-color: #bcf600 !important;
} */


/* 弹窗说明 字段 */
.explain_box {
	font-size: 12px;
	line-height: 16px;
	color: #3d03b8
}

/* 弹窗说明 值 */
.explain_box span {
	color: #909399
		/* color:#0e56e6 */
}

/* 给必填项的label添加红色星号 */
.el-from-item[required] .el-from-item__label::after {
	content: '*';
	color: red;
	font-size: 18px;
}

</style>
