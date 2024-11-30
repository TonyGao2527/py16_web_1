<!-- 测试环境 -->

<template>
	<el-row>
		<el-col :span="4">
			<div class="list_box">
				<el-scrollbal>
					<div class="top-title">测试环境</div>
					<el-button>
						创建测试环境
					</el-button>

					<el-menu>
						<el-menu-item>
							<el-icon>
								<Coin/>
							</el-icon>
							<span>{{  }}</span>
						</el-menu-item>
					</el-menu>
				</el-scrollbal>
			</div>
		</el-col>
		<el-col :span="8"></el-col>
		<el-col :span="12"></el-col>
	</el-row>
</template>

<script>
</script>

<style>
/* 页面左侧区域 */
/* 水平偏移量, 垂直偏移量, 模糊半径, 阴影的颜色 */
.list_box {
	height: calc(100vh - 68px);
	box-shadow: 0 0 5px #00aa7f
}
</style>