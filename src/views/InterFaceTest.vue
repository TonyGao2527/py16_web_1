<template>
	<!-- <h1>接口测试</h1> -->
	<!-- el-row 是一个大行 -->
	<el-row>
		<!-- 左列：接口-用例 菜单栏 -->
		<el-col :span="4">
			<div class="list_box">
				<!-- el官网 - Tabs 标签页 - 自定义标签页的内容 - 复制源码<el-tabs> 
				stretch 标签的宽度是否自撑开
				-->
				<el-tabs type="border-card" stretch>
					<!-- 接口管理 按钮
					width:100% 占满整个左侧列宽度 -->
					<el-button @click="$router.push({ name: 'interface' })" style="width:100%" plain type="success"
						icon="Link">
						接口管理
					</el-button>
					<!-- 项目接口 -->
					<el-tab-pane label="项目接口">
						<!-- 可滚动组建
							el+官网 - Scrollbar 滚动条 - 基础用法 - 复制 <el-scrollbar> -->
						<el-scrollbar height="calc(100vh - 142px)">							
						<!-- <el-scrollbar > -->
							<!-- 菜单组件 
								el+官网 - Menu 菜单 -侧栏 Default colors - 拷贝el-menu - 取这类One这一块 -->
							<el-menu class="el-menu-vertical-demo">
								<!-- 一级菜单-接口  
									v-for 遍历该项目 所有 项目接口
								-->
								<el-sub-menu v-for="iter in inters1" :index="iter.name + iter.id">
									<template #title>
										<el-icon>
											<Paperclip />
										</el-icon>
										<!--  接口名称 -->
										<span class="xiu_yu">{{ iter.name }}</span>
									</template>

									<!-- 二级菜单-用例 
										v-for遍历每一个接口中的所有用例
										提取当前点击的用例（用例id,title）
									-->
									<el-menu-item @click="selectCase(step)" v-for="step in iter.steps"
										:index="step.id.toString()">
										<el-icon>
											<Link />
										</el-icon>
										<!-- 用例标题 -->
										<span>{{ step.title }}</span>
									</el-menu-item>

									<!-- 添加用例 按钮-->
									<!-- <el-menu-item @click="clickAdd(iter.id)" :index="iter.id+'a'" style="color: #ffaa00;">
										<el-icon>
											<CirclePlus />
										</el-icon>
										<span> 添加用例 </span>
									</el-menu-item> -->

									<!-- 下面这种，文案和上面用例没有对齐 -->
									<el-menu-item @click="clickAdd(iter.id)" :index="iter.id+'a'">
										<span style="color: #ffaa00;">
											<el-icon>
												<CirclePlus />
											</el-icon>
											<span> 添加用例 </span>
										</span>
									</el-menu-item>
								</el-sub-menu>
							</el-menu>
						</el-scrollbar>
					</el-tab-pane>

					<!-- 外部接口 -->
					<el-tab-pane label="外部接口">
						<!-- 可滚动组建
								el+官网 - Scrollbar 滚动条 - 基础用法 - 复制 <el-scrollbar> -->
						<el-scrollbar height="calc(100vh - 142px)">
							<!-- 菜单组件 
									el+官网 - Menu 菜单 -侧栏 Default colors - 拷贝el-menu - 取这类One这一块 -->
							<el-menu class="el-menu-vertical-demo">
								<!-- 一级菜单-接口  
										v-for 遍历该项目 所有 项目接口
									-->
								<el-sub-menu v-for="iter in inters2" :index="iter.name + iter.id">
									<template #title>
										<el-icon>
											<Paperclip />
										</el-icon>
										<!--  接口名称 -->
										<span>{{ iter.name }}</span>
									</template>

									<!-- 二级菜单-用例 
											v-for遍历每一个接口中的所有用例
										-->
									<el-menu-item @click="selectCase(step)" v-for="step in iter.steps"
										:index="step.id.toString()">
										<el-icon>
											<Link />
										</el-icon>
										<!-- 用例标题 -->
										<span>{{ step.title }}</span>
									</el-menu-item>

									<!-- 添加用例 按钮-->
									<!-- <el-menu-item style="color: #ffaa00;">
											<el-icon>
												<CirclePlus />
											</el-icon>
											<span> 添加用例 </span>
										</el-menu-item> -->

									<!-- 这种写的 文案和上面用例没有对齐 -->
									<el-menu-item @click="clickAdd(iter.id)" :index="iter.id+'a'">
										<span style="color: #ffaa00;">
											<el-icon>
												<CirclePlus />
											</el-icon>
											<span> 添加用例 </span>
										</span>
									</el-menu-item>
								</el-sub-menu>
							</el-menu>
						</el-scrollbar>
					</el-tab-pane>

				</el-tabs>
			</div>
		</el-col>

		<!-- 右列：展示用例信息区域 -->
		<el-col :span="20">
			<!-- 右侧显示区 接口编辑
					el-scrollbar 滚动
			-->
			<el-scrollbar height="calc(100vh - 68px)">
				<!-- 父组建往子组建传值 传入点击的用例信息 -->
				<CaseEdit :edit-case='editCase'></CaseEdit>
			</el-scrollbar>
		</el-col>
	</el-row>

	<!-- 添加用例的弹框 -->
	<el-dialog v-model="addDlg" title="添加用例" width="40%">
		<el-from :model="addCaseForm">
			<el-from-item label="用例名称"><el-input v-model="addCaseForm.title" autocomplete="off"></el-input></el-from-item>
		</el-from>
		<template #footer>
			<span class="dialog-footer">
				<el-button size="small" @click="addDlg = false">取 消</el-button>
				<el-button size="small" @click="addCase" type="success">确 定</el-button>
			</span>
		</template>
	</el-dialog>

</template>

<script>
import {mapActions,	mapGetters,	mapState} from 'vuex';

// 导入右侧编辑区的子组件
import CaseEdit from '../components/CaseEdit.vue';

export default {
	components: {
		CaseEdit
	},

	data() {
		return {
			// 保存左侧点击的 当前用例信息 （只有id和title）
			editCase: null,  // 当前用例信息
			name: '',  // 接口名称
			addDlg: false, // 添加用例对话框
			addCaseForm: {  // 添加用例表单
				title: '',  // 用例标题
			}
		}
	},
	computed: {
		// 引入store - getters 方法
		...mapGetters(['inters1', 'inters2']),
		// ...mapState(['interfacesForPro', 'interfacesForThird']),
	},

	methods: {
		// 引入store - actions 方法
		...mapActions(['getAllInterFaces']),

		// 将左侧点击的用例信息，复制给右侧区域
		selectCase(onCase) {
			this.editCase = onCase;
		},

		// 点击添加用例按钮，传入当前接口id
		clickAdd(interId){
			this.addDlg = true;  // 显示添加用例对话框
			this.addCaseForm.interface = interId;  // 传入当前接口id
			this.addCaseForm.title = '';  // 清空用例标题
		},

		//
		async addCase(){
			const response = await this.$api.createTeststep(this.addCaseForm);
			if (response.status === 201){
				this.addDlg = false; // 隐藏添加用例对话框
				this.$message({
					type: 'success',
					message: '添加用例成功',
					duration: 2000
				});
				this.getAllInterFaces(); // 刷新接口列表
			}
		},
	},
	// // 添加钩子 页面渲染加载前执行
	// created() {
	// 	// 调用store - actions 方法
	// 	// 获取 项目详情-接口管理-数据
	// 	this.getAllInterFaces();
	// 	// 调用this.getAllInterFaces()后interfaces就有数据了， inters1和2自动更新就有数据了
	// 	console.log("日志 this.inters1：", this.inters1);
	// 	console.log("日志 this.inters2：", this.inters2);
	// 	console.log("日志 this.interfacesForPro：", this.interfacesForPro);
	// },
}
</script>

<style scoped>
/* 
	height 高度
	box-shadow 添加阴影
	上面两个都添加才有效果，单拿一个都没有效果
*/
.list_box {
	/* height: calc(100vh - 68px); */
	box-shadow: 0 0 5px #00aa7f;
}

/* 在这里设置没有用，需要在 main.css中设置 */
/* .list_box .el-tabs--border-card .el-tabs__content{
    padding: 0;
} */
</style>