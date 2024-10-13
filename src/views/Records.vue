<template>
	<h1>测试报表</h1>
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
	// 页面刷新时调用的钩子
	// 一进入页面就获取项目信息；
	created() {
		this.getProjectrecords();
	},
}
</script>

<style></style>