<template>
	<div>
		<span style="color: #00aa7f;"><b>bug统计</b></span>
	</div>
	<el-row :gutter="10">
		<el-col :span="12"><div class="chartBox" ref="chart1Box"></div></el-col>
		<el-col :span="12"><div class="chartBox" ref="chart2Box"></div></el-col>
	</el-row>
</template>

<script>
export default {
	data() {
		return {
			showBug: false, // 是否显示bug详情抽屉
			bugInfo: null, // 当前显示的bug信息
			bugLogs: null, // 当前bug的处理记录
			updateBugDlg: false, // 是否显示修改bug状态对话框
			updateBugForm: {}, // 修改bug状态表单数据
			showBugs: [], // 当前显示的bug列表
			bugs: [] // 所有的bug列表

		}
	},
}

</script>

<style>
</style>