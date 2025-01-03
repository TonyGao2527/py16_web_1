<template>
	<!-- 添加定时任务 按钮 -->
	<el-button @click="dialogCron = true; updateBtn = false" type="success" icon="el-icon-plus" size="small"
		style="margin: 10px 5px;">
		添加定时任务
	</el-button>

	<!-- 定时任务列表 -->
	<el-table :data="cronList" style="width: 100%" size="small">
		<!-- <el-table style="width: 100%" size="small"> -->
		<el-table-column label="创建时间" min-width="180">
			<template #default="scope">
				<!-- 时间 -->
				{{ $date.rTime(scope.row.create_time) }}
			</template>
		</el-table-column>
		<el-table-column label="名  称" prop="name" min-width="140"></el-table-column>
		<el-table-column label="执行任务" prop="plan_name" min-width="140"></el-table-column>
		<el-table-column label="执行环境" prop="env_name" min-width="140"></el-table-column>
		<el-table-column label="执行规则" prop="rule" min-width="140"></el-table-column>
		<el-table-column label="是否开启" prop="name" min-width="120">
			<template #default="scope">
				<!-- 
					@change switch 状态发生变化时才触发回调函数
					@click 事件每次点击都会触发，并不一定意味着开关状态改变
				 -->
				<el-switch @change="switchCronStatus(scope.row)" v-model="scope.row.status" active-color="#13ce66"
					inactive-color="#000000" />
				<!-- <el-switch @change="switchCronStatus(scope.row)" v-model="scope.row.status"/> -->
			</template>
		</el-table-column>
		<el-table-column label="操  作" min-width="100">
			<template #default="scope">
				

			</template>
		</el-table-column>
	</el-table>

	<!-- 创建or修改 定时任务的弹窗 -->
	<el-dialog v-model="dialogCron" width="45%">
		<div>
			<!-- 弹窗标题，根据updateBtn是否是修改操作显示不同内容 -->
			<span style="font-size: 18px; font-weight: bold;" v-if="updateBtn">修改定时执行任务</span>
			<span style="font-size: 18px; font-weight: bold;" v-else>修改定时执行任务</span>
		</div>
		<el-form label-width="80px">
			<el-form-item label="名称">
				<el-input v-model="cronTabData.name"></el-input>
			</el-form-item>
			<el-form-item label="测试环境">
				<el-select>
					<el-option>666</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="执行计划">
			</el-form-item>
			<el-form-item label="是否开启">
			</el-form-item>
			<el-form-item label="定时规则">
			</el-form-item>
			<div>
				<el-button size="small" type="info" @click="dialogCron = false">取 消</el-button>
				<el-button size="small" type="success" @click="UpdateCron()" v-if="updateBtn">提交修改</el-button>
				<el-button size="small" type="success" @click="createCron()" v-else>创 建</el-button>
			</div>
		</el-form>
	</el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
	data() {
		return {
			cronList: null,  //定时任务列表
			dialogCron: false,  // 添加or修改定时任务的弹窗 开关
			updateBtn: true,  // 添加or修改定时任务的弹窗中的 “提交修改”按钮 开关
			// 添加定时任务
			cronTabData: {
				name: "冒烟测试定期执行",
				rule: "* * * * *",
				status: true,
				plan: null,
				env: null,
			},
		}
	},

	// 计算属性
	computed: {
		// 项目详情信息，当前项目所有环境，当前项目所有测试计划
		...mapState(['pro', 'testEnvs', 'testPlans'])
	},

	// 
	methods: {
		// 获取所有定时任务
		async getAllCron() {
			const response = await this.$api.getCrons(this.pro.id)
			if (response.status === 200) {
				this.cronList = response.data
			}
		},


		// 任务开启和关闭  定时任务开关(列表)
		async switchCronStatus(cron) {
			const response = await this.$api.updateCron(cron.id, cron)
			if (response.status === 200) {
				if (cron.status == true) {
					this.$message({
						type: 'success',
						message: '定时运行已开启',
						duration: 1000,
					})
				} else {
					this.$message({
						type: 'warning',
						message: '定时运行已关闭',
						duration: 1000,
					})
				}
			} else {
				this.$message({
					type: 'error',
					message: '修改状态失败',
					duration: 1000,
				})
			}
		},


		// 显示修改定时任务的窗口
		showUpdateCronDlg(cron) {
			this.cronTabData = { ...cron }
			this.dialogCron = true  // 添加or修改定时任务的弹窗 开关
			// 显示修改按钮
			this.updateBtn = true    // 添加or修改定时任务的弹窗中的 “提交修改”按钮 开关
		},
	},

	// 
	created() {
		this.getAllCron()  // 获取所有定时任务
	}
}

</script>

<style scoped>
/* 修改开启和关闭状态的颜色 */
/* .el-switch__core { */
/* --el-switch-on-color: #42b983;  开启状态的绿色 */
/* --el-switch-off-color: #000000;    关闭状态的灰色 */
/* } */
</style>