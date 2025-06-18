<!-- 
    项目详情-接口测试-右侧用例编辑区
 -->
<template>
	<!-- 用例信息：{{ editCase }} <br>
    用例详细信息：{{ caseInfo }} -->
	<div class="edit_box">
		<!-- 1 api信息 -->
		<!-- 
         标题
             添加水平线
             el+ - Divider 分割线 - 设置文案 - 源码 - 复制 el-divider
             属性content-position="'left' | 'right' | 'center'"设置文案在线的左、中、右；
         -->
		<el-divider content-position="left">
			<b>1 Api信息</b>
		</el-divider>
		<el-row>
			<!-- 左侧列 输入框 -->
			<el-col :span="18">
				<el-input placeholder="请输入接口地址" v-model="url">
					<!-- 添加插槽 左侧显示 -->
					<template #prepend>
						<!-- el+ - Select 选择器 - 基础用法 - el-select - 大小选择中间的 - 复制粘贴 -->
						<el-select v-model="method" placeholder="Select" style="width: 115px">
							<!-- label、value 取消:冒号绑定 写死 -->
							<el-option label="GET" value="get" />
							<el-option label="POST" value="post" />
							<el-option label="DELETE" value="delete" />
							<el-option label="PUT" value="put" />
							<el-option label="PATCH" value="patch" />
							<el-option label="OPTION" value="option" />
						</el-select>
					</template>
				</el-input>
			</el-col>
			<!-- 右侧列 选项 
                运行测试用例
                文本右对齐 style="text-align: right;"
            -->
			<el-col :span="6" style="text-align: right;">
				<el-button @click="runCase" type="success" icon="Position">
					Run
				</el-button>
			</el-col>
		</el-row>

		<!-- 2 用例信息 用例名称、操作按钮 -->
		<el-divider content-position="left">
			<b>2 用例信息</b>
		</el-divider>
		<el-row>
			<!-- 左侧列 输入框 -->
			<el-col :span="12">
				<el-input v-model="name" placeholder="请输入用例名称">
					<!-- 添加插槽 左侧显示 -->
					<template #prepend>
						用例名称
					</template>
				</el-input>
			</el-col>
			<!-- 右侧列 选项 操作按钮
             -->
			<el-col :span="12" style="text-align: right;">
				<el-button type="danger" @click="deleteCase" icon="Delete" plain>删除</el-button>
				<el-button type="success" @click="copyCase" icon="DocumentCopy" plain>复制</el-button>
				<el-button type="success" @click="saveCase" icon="CircleCheck">保存</el-button>
			</el-col>
		</el-row>


		<!-- 3 请求信息
            标题 
         -->
		<el-divider content-position="left">
			<b>3 请求信息</b>
		</el-divider>
		<!-- 
            内容
            el+ - tabs 标签页 - 带有边框的卡片风格 - 源码 - 复制<el-tabs> - 粘贴在 第3个模块 <el-divider> 下方 
            style="min-height: 350px;" 设置最小高度
            v-model="activeTab" 默认激活的标签页 请求信息tabs 默认body
         -->
		<el-tabs v-model="activeTab" type="border-card" style="min-height: 350px;">
			<!-- name 传值给父标签 v-model -->
			<el-tab-pane name="head" label="请求头(headers)">
				<CodeEdit height="280px" v-model="headers" lang="json"></CodeEdit>
			</el-tab-pane>

			<el-tab-pane name="params" label="查询参数(Params)">
				<CodeEdit height="280px" v-model="params" lang="json"></CodeEdit>
			</el-tab-pane>

			<el-tab-pane name="body" label="请求体(body)">
				<!-- el+ - Radio 单选框 - 单选框组 - 源码 - 复制<el-radio-group> 
                    3个el-radio单选 请求体类型
                -->
				<el-radio-group v-model="bodyType">
					<!-- <el-radio>单选后会将label的值传给父标签中的 bodyType -->
					<el-radio label="json" size="large">application/json</el-radio>
					<el-radio label="form" size="large">x-www-form-urlencode</el-radio>
					<el-radio label="file" size="large">form-data</el-radio>
				</el-radio-group>
				<!-- 根据选中参数的类型显示对应的内容 -->
				<div>
					<CodeEdit height="280px" v-model="jsonParams" lang="json" v-if="bodyType === 'json'"></CodeEdit>
					<CodeEdit height="280px" v-model="dataParams" lang="json" v-else-if="bodyType === 'form'">
					</CodeEdit>
					<!-- 判断选择的事form-data文件 -->
					<div v-else class="file_box">
						<el-row>
							<!-- 左侧 数据编辑-->
							<el-col :span="16">
								<!-- 左侧：第一行数据：每行多列
                                    el+ - Layout 布局 - 行提供 gutter 属性来指定列之间的间距，其默认值为0。
                                -->
								<el-row :gutter="5" v-for="item in editFiles" style="margin-bottom: 10px;">
									<!-- 第1列 输入 参数名称 -->
									<el-col :span="7">
										<!-- <el-input v-model="item[0]" aria-placeholder="参数名"></el-input> -->
										<el-input v-model="item[0]" placeholder="参数名"></el-input>
									</el-col>
									<!-- 第2列 参数类型：选 file或text -->
									<el-col :span="4">
										<el-select v-model="item[1]">
											<el-option lable="test" value="test"></el-option>
											<el-option lable="file" value="file"></el-option>
										</el-select>
									</el-col>
									<!-- 参数的内容(值)
                                        第3列 判断 参数值 上传文件 file
                                    -->
									<el-col :span="7" v-if="item[1] == 'file'">
										<!-- 
                                            选项框
                                            width: 100% 占满其父元素的宽度
                                         -->
										<el-select v-model="item[2]" placeholder="请选择上传的文件" style="width: 100%">
											<!-- el-option 每一个子选项
                                                fileList后台所有测试用的文件
                                                f是遍历后的每一个文件对象
                                                文件信息存在f.info中
                                                f.info[0] 文件名称
                                            -->
											<el-option v-for="f in fileList" :label="f.info[0]" :value="f.info" />
										</el-select>
									</el-col>
									<!-- 第3列 判断 参数值 输入文本 test 
                                        placeholder 输入框占位文本 
                                    -->
									<el-col :span="7" v-else>
										<el-input v-model="item[2]" placeholder="参数值" />
									</el-col>
									<!-- 第4列 删除按钮 -->
									<el-col :span="6" style="text-align: center;">
										<!-- 
                                            editFiles.splice(index, 1)
                                                删除editFiles中当前索引index
                                                从index开始，删除1个元素
                                         -->
										<el-button icon="Delete" type="danger" plain size="small"
											@click="editFiles.splice(index, 1)">
										</el-button>
									</el-col>
								</el-row>

								<!-- 左侧：第二行按钮：添加一行参数输入框 -->
								<el-button icon="Plus" type="success" plain size="small" style="margin-top: 10px;"
									@click="editFiles.push(['', 'test', ''])"></el-button>

							</el-col>

							<!-- 右侧 -->
							<el-col :span="8">
								<!-- 上传文件按钮
                                    el+ - Upload 上传 - API
                                    class="upload-demo"
                                    :action 请求url
                                    :headers 设置请求头
                                    method 请求方法
                                    name 用于指定要上传的文件在后端接收时的参数名
                                    :on-success="" 文件上传成功时的钩子

                                    multiple 是否支持多选文件               
                                    v-model:file-list="fileList"  默认上传文件
                                    :on-preview="handlePreview" 点击文件列表中已上传的文件时的钩子
                                    :on-remove="handleRemove" 文件列表移除文件时的钩子
                                    :before-remove="beforeRemove"
                                    :limit="3" 允许上传文件的最大数量
                                    :on-exceed="handleExceed"> 当超出限制时，执行的钩子函数
                                -->
								<el-upload class="upload-demo" :action="$api.uploadFile.url"
									:headers="$api.uploadFile.headers" method="post" name="file"
									:on-success="uploadSuccess">
									<el-button plain type="success">上传文件</el-button>

								</el-upload>

								<!-- 文件列表 
                                    el+ - Table 表格
                                -->
								<el-table :data="fileList" :height="250">
									<el-table-column label="已有文件" width="180">
										<template #default="scope">
											<!-- 显示文件名称 -->
											{{ scope.row.info[0] }}
										</template>
									</el-table-column>
									<el-table-column label="类型" width="180">
										<template #default="scope">
											<!-- 显示文件类型 -->
											{{ scope.row.info[2] }}
										</template>
									</el-table-column>
								</el-table>

							</el-col>
						</el-row>
					</div>
				</div>
			</el-tab-pane>

			<el-tab-pane label="前置脚本">
				<!-- 一行两列   gutter 列之间的间距-->
				<el-row :gutter="10">
					<!-- 左列 代码编辑框 CodeEdit 
                        span不添加冒号:不生效左右分裂
                    -->
					<el-col :span="18">
						<!-- theme="monokai" 代码编辑区改成黑色背景 -->
						<CodeEdit height="280px" v-model="setup_script" lang="python" theme="monokai"></CodeEdit>
					</el-col>
					<!-- 右列 模板 -->
					<el-col :span="6">
						<!-- 
                         标题
                             el+ - Divider 分割线 - 设置文案 - 源码 - 复制 el-divider
                             属性content-position="'left' | 'right' | 'center'"设置文案在线的左、中、右；
                         -->
						<el-divider content-position="center">脚本模板</el-divider>
						<!-- 模板按钮要统一样式，所以添加div -->
						<div class="add_script_box"> <el-button plain type="success" style="margin-top: 10px;"
								@click='add_setup_script("gv")'> 预设全局变量 </el-button> </div>
						<div class="add_script_box"> <el-button plain type="success" style="margin-top: 10px;"
								@click='add_setup_script("env")'> 预设局部变量 </el-button> </div>
						<div class="add_script_box"> <el-button plain type="success" style="margin-top: 10px;"
								@click='add_setup_script("func")'> 调用全局函数 </el-button> </div>
						<div class="add_script_box"> <el-button plain type="success" style="margin-top: 10px;"
								@click='add_setup_script("sql")'> 执行sql查询 </el-button> </div>
					</el-col>
				</el-row>
			</el-tab-pane>

			<el-tab-pane label="后置脚本">
				<el-row :gutter="10">
					<el-col :span="18">
						<CodeEdit height="280px" v-model="teardown_script" lang="python"></CodeEdit>
					</el-col>
					<!-- 右列 模板 -->
					<el-col :span="6">
						<el-divider>脚本模板</el-divider>
						<el-scrollbar height="250px">
							<div class="add_script_box"><el-button type="success" plain
									@click="addTearDownCodeMod('getBody')">获取响应体</el-button></div>
							<div class="add_script_box"><el-button type="success" plain
									@click="addTearDownCodeMod('JSextract')">jsonpath提取</el-button></div>
							<div class="add_script_box"><el-button type="success" plain
									@click="addTearDownCodeMod('REexrract')">正则提取响应体中的数据</el-button></div>
							<div class="add_script_box"><el-button type="success" plain
									@click="addTearDownCodeMod('ENV')">设置全局变量</el-button></div>
							<div class="add_script_box"><el-button type="success" plain
									@click="addTearDownCodeMod('env')">设置局部变量</el-button></div>
							<div class="add_script_box"><el-button type="success" plain
									@click="addTearDownCodeMod('func')">调用全局工具函数</el-button></div>
							<div class="add_script_box"><el-button type="success" plain
									@click="addTearDownCodeMod('sql')">执行sql语句</el-button></div>
							<div class="add_script_box"><el-button type="success" plain
									@click="addTearDownCodeMod('http')">断言http状态码</el-button></div>
							<div class="add_script_box"><el-button type="success" plain
									@click="addTearDownCodeMod('eq')">断言相等</el-button></div>
							<div class="add_script_box"><el-button type="success" plain
									@click="addTearDownCodeMod('contain')">断言包含</el-button></div>
						</el-scrollbar>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>

		<!-- 响应信息模块 -->
		<div class="result_test" v-if="runResult">
			<el-divider content-position="left"><b>响应信息</b></el-divider>
			<CaseResult :result="runResult"></CaseResult>
		</div>


	</div>
</template>

<script>

import { mapActions, mapState } from 'vuex'; // 引入映射方法
import { ElMessage, ElMessageBox } from 'element-plus'; // 提示信息
import CodeEdit from './CodeEdit.vue';  // 引入用例运行前请求信息的 json输入框
import CaseResult from './CaseResult.vue'; // 引入用例运行后的 响应信息 

export default {
	// 注册子组件
	components: {
		CodeEdit,
		CaseResult
	},

	// 指定接受父组件传递过来的值
	// editCase 为当前用户选择的用例对象 steps:[id:"用例id",title:"用例名称"]
	props: ['editCase'],

	data() {
		return {
			// 默认激活的标签页 请求信息tabs
			activeTab: 'body',

			// 当前获取的用例对象
			// 用例详情信息，file headers id interface{id method name steps url} request{} setup_script teardown_script title
			caseInfo: null,
			// 接口地址
			url: '',
			// 接口请求方法 默认get
			method: 'get',
			// 用例名称 caseInfo.title
			name: '',
			// 请求头
			headers: '{}',
			// 查询参数
			params: '{}',
			jsonParams: '',
			dataParams: '',
			// 前置脚本
			setup_script: '',
			// 后置脚本
			teardown_script: '',
			// 请求体(body) - 请求体参数的类型（3选1 单选）默認 'json'
			bodyType: 'json',

			// 文件上传的参数数组 | 请求体(body) - form-data 
			// item[0]是name item[1]是test/file item[2]如test就是""字符串/file就是[]数组
			editFiles: [],
			// 后台所有测试用的文件
			fileList: [],
			// 用例运行结果
			// runResult: null,
			// 用例运行结果 - 暂时让它都显示
			runResult: 1,
		}
	},

	// 计算属性
	computed: {
		// 映射 store/index.js/state
		...mapState(['envId']),

	},
	// computed: {
	//  // 引入store - getters 方法
	//  ...mapGetters(['inters1', 'inters2']),
	//  ...mapState(['interfacesForPro', 'interfacesForThird',]),
	// },


	methods: {

		// 映射 store/index.js/actions - 
		// getAllInterFaces项目详情-接口管理-(项目接口、外部接口)信息
		...mapActions(['getAllInterFaces']),

		// 获取测试用例详细信息
		// 项目详情-接口测试-点击左侧用例
		// http://42.192.110.51:18899/docs/#teststep-read
		async getCaseDesc() {
			const response = await this.$api.getCaseInfo(this.editCase.id);
			// 判断相应信息 如果响应200则赋值
			if (response.status === 200) {
				// 当前获取的用例对象 赋值
				this.caseInfo = response.data
				console.log('用例详情信息this.caseInfo = response.data：', response.data)
				// 赋值给data-return-用例信息
				this.initEditData();
			}
		},

		// 展示用例信息 - 给data-return-用例信息 属性赋值 
		initEditData() {
			// 拆包 当前获取的用例对象 赋值给 datas
			const datas = { ...this.caseInfo };
			this.method = datas.interface.method;
			this.url = datas.interface.url;
			this.name = datas.title;
			// JSON.stringify() 换成字符串
			// datas.headers || {} 非空则返回值，为空则返回{}空对象
			// null表示没有使用任何替代器或过滤函数
			// 2 表示每个层级都使用两个空格缩进。
			this.headers = JSON.stringify(datas.headers || {}, null, 2);
			this.params = JSON.stringify(datas.request.params || {}, null, 2);
			console.log('点击用例-用例参数 datas.request.params：', datas.request.params);
			console.log('点击用例-用例参数 JSON.stringify(datas.request.params || {}, null, 2)：', this.params);
			this.jsonParams = JSON.stringify(datas.request.json || {}, null, 2);
			console.log('点击用例-用例参数 datas.request.json：', datas.request.json);
			console.log('点击用例-用例参数 JSON.stringify(datas.request.json || {}, null, 2)：', this.jsonParams);
			this.dataParams = JSON.stringify(datas.request.data || {}, null, 2);
			this.setup_script = datas.setup_script;  // 前置脚本
			this.teardown_script = datas.teardown_script; // 后置脚本
			// 上传文件判断 | 请求体(body) - form-data
			// 在 Vue 中，forEach 方法通常用于遍历数组中的每个元素，并对每个元素执行相应的操作
			// item是文件中每一个对象
			datas.file.forEach(item => {
				// item[1].length === 3 
				// 如果是test item[1] 是""字符串 是text的值
				// 如果是file item[1] 是3个索引的数组 ["文件名","文件路径","文件类型"] 
				if (item[1].length === 3) {
					this.editFiles.push([item[0], 'file', item[1]]);
				} else {
					this.editFiles.push([item[0], 'text', item[1]]);
				}
			});
		},

		// 获取文件列表 后台所有测试用的文件
		async getAllFile() {
			const response = await this.$api.getFiles();
			this.fileList = response.data;
			console.log("后台所有测试用的文件 this.this.fileList = response.data;,", this.fileList)
		},

		// 文件上传成功之后执行的方法
		uploadSuccess() {
			// 获取后台所有的文件
			this.getAllFile();
			// 提示上传成功
			ElMessage({
				message: '文件上传成功',
				type: 'success'
			});
		},


		// 前置脚本 点击模板按钮填充 生成前置脚本
		add_setup_script(type) {
			if (type === 'gv') {
				this.setup_script += '# 预设全局变量\ntest.save_global_variable("变量名", "变量值")\n'
			} else if (type === 'env') {
				this.setup_script += '# 预设局部变量\ntest.save_env_variable("变量名", "变量值")\n'
			} else if (type === 'func') {
				this.setup_script += '# 调用全局工具函数\nrandom_mobile随机生成一个手机号码 \nmobile = global_func.random_mobile()\n'
			} else if (type === 'sql') {
				this.setup_script +=
					'# ---- 执行sql语句(需要在环境中配置数据库连接信息) ----\n# db.连接名.execute_all(sql语句) \nsql="SELECT count(*) as count From futureloan.member"\n res = db.aliyun.execute_all(sql)\n'
			}
		},

		// 后置脚本 点击模板按钮填充 生成后置脚本
		addTearDownCodeMod(tp) {
			switch (tp) {
				case 'getBody':
					this.teardown_script += '\n# Demo:获取响应体(json) \nbody = response.json()';
					this.teardown_script += '\n# Demo2:获取响应体(字符串) \nbody = response.text()';
					break;
				case 'JSextract':
					this.teardown_script += '\n# Demo:jsonpath提取response中的msg字段 \nmsg = test.json_extract(response.json(),"$..msg")';
					break;
				case 'REexrract':
					this.teardown_script += '\n# Demo:正则提取响应体中的数据 \nres = test.re_extract(response.text, "正则表达式",)';
					break;
				case 'ENV':
					this.teardown_script += '\n# 设置全局变量 \ntest.save_global_variable("变量名", "变量值")';
					break;
				case 'env':
					this.teardown_script += '\n# 设置局部变量 \ntest.save_env_variable("变量名", "变量值")';
					break;
				case 'func':
					this.teardown_script += '\n# 调用全局工具函数random_mobile随机生成一个手机号 \nmobile = global_func.random_mobile()';
					break;
				case 'sql':
					this.teardown_script += '\n# ----执行sql语句(需要在环境中配置数据库连接信息)---- \n# db.连接名。execute_all(sql语句)\nsql = "SELECT count(*) as count FROM futureloan.member"\nres = db.aliyun.execute_all(sql)';
					break;
				case 'http':
					this.teardown_script += '\n# 断言http状态码 \n# Demo:断言http状态码是否为200 \nText.assertion("相等", 200, response.status_code)';
					break;
				case 'eq':
					this.teardown_script += '\n# 断言相等 \ntest.assertion("相等","逾期结果","实际结果")';
					break;
				case 'contain':
					this.teardown_script += '\n# 断言包含：预期结果中的内容在实际结果中是否存在 \ntest.assertion("包含","逾期结果","实际结果")';
					break;
			}
		},

		// 删除 按钮 绑定事件
		deleteCase() {
			// 1 先弹窗 确认删除、取消删除
			// el+ - Feedback 反馈组件 - MessageBox 消息弹框
			ElMessageBox.confirm(
				'确定要删除该用例吗?',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(async () => {
					const response = await this.$api.delTeststep(this.caseInfo.id)
					if (response.status === 204) {
						ElMessage({
							type: 'success',
							message: '删除成功',
							// 停留时间1000毫秒
							duration: 1000,
						});
						// 获取项目所有内外部测试接口
						this.getAllInterFaces();
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

		// 转换数据格式
		// 运行、复制、保存按钮 的前置条件，需调用该方法，来转换数据的格式
		resetEditData() {
			// 将编辑完的数据，转换为后端所需的格式，赋值到caseInfo中

			// let声明常量还能修改
			// const声明常量不能修改
			// 拆包 当前获取的用例对象详细信息 赋值给 let caseData
			let caseData = { ...this.caseInfo };
			caseData.interface = this.caseInfo.interface.id;
			caseData.title = this.name; // 用例名称
			// JSON.parse() JSON格式的字符串转换为JavaScript对象
			// { name: 'John', age: 30, city: 'New York' } 对象
			// JSON.stringify() JavaScript对象转换为符合JSON格式的字符串
			// {"name":"John","age":30,"city":"New York"} 字符串
			caseData.headers = JSON.parse(this.headers);
			//  this.caseInfo.setup_script 是进入页面接口返回的数据
			//  this.setup_script 是经过 编辑/复制 后的数据
			caseData.setup_script = this.setup_script;
			caseData.teardown_script = this.teardown_script;
			// 这是清空的意思么？？？
			caseData.request = {};
			// 查询参数
			caseData.request.params = JSON.parse(this.params);
			// 请求参数 判断 转换格式
			if (this.bodyType === 'json') {
				caseData.request.json = JSON.parse(this.jsonParams);
			}
			// 待确认 是否用'data'，是否应改成'form'应与上面标签bodyType === 'form'对应
			else if (this.bodyType === 'data') {
				caseData.request.json = JSON.parse(this.dataParams);
			} else {
				const files = [];
				// this.editFiles页面当前用例form-data数组
				this.editFiles.file.forEach(item => {
						// 存入 参数名, 参数值
						// 这里为啥没判断参数类型？？？
						files.push([item[0], item[2]]);
					}
				);
				// 赋值
				caseData.file = files;
			};
			// 返回对象
			return caseData
		},

		// 保存 按钮 绑定事件
		async saveCase() {
			// 获取编辑/转化后的用例数据
			const params = this.resetEditData()
			// 调用后端修改接口 - 保存用例
			const response = await this.$api.updateTeststep(this.caseInfo.id, params);
			if (response.status === 200) {
				ElMessage(
					{
						type: 'success',
						message: '保存成功',
						duration: 1000,
					}
				);
				// 获取项目所有内/外部测试接口
				this.getAllInterFaces();
			}
		},

		// 复制 按钮 绑定事件
		async copyCase() {
			// 获取编辑/转化后的用例数据
			const params = this.resetEditData();
			// 复复制的用例 重命名
			params.title = params.title + '_copy';
			// 调后端接口-创建用例
			const response = await this.$api.createTeststep(params);
			if (response.status === 201) {
				ElMessage(
					{
						type: 'success',
						message: '复制成功',
						duration: 1000
					}
				);
				// 获取项目所有内/外部测试接口
				this.getAllInterFaces();
			}
		},

		// run按钮 绑定事件
		async runCase() {
			// 调用方法 收集用例数据
			const runData = this.resetEditData();
			// 对用例中的url、method赋值
			runData.interface = {
				url: this.caseInfo.interface.url,
				method: this.caseInfo.interface.method
			};
			// 创建请求参数对象，加入环境信息env
			// env: this.envId 当前参数所在环境的id
			// url只有路径没有ip/域名地址，所以页面选择环境env，自行拼接url;
			const params = {
				env: this.envId,
				// 接口同一个，运行测试场景 就传场景id
				data: runData
			};
			// 调后端接口-运行
			const response = await this.$api.runTest(params);
			console.log('日志 this.envId ：', this.envId);
			// 判断响应码
			if (response.status === 200) {
				// 保存到data属性 用例运行结果 中
				this.runResult = response.data;
				ElMessage(
					{
						type: 'success',
						message: '执行完毕',
						duration: 1000
					}
				);
			}
			// runData是运行参数，至于具体运行内容是什么，后面讲后端框架时会讲；
			//          前置：
			// 1、store/index.js/state添加 envId:136,
			// 2、CaseEdit.vue/script 添加 import { mapState } from 'vuex';
			// 3、CaseEdit.vue/computed 添加 ...mapState(['envId']),
			// 4、api/index.js/export default 添加 runTest(params){}
		},


	},


	// 钩子函数，进入页面就执行
	// 问题 页面渲染前只能给一次，后面再切换用例的时候不会获取用例信息
	created() {
		if (this.editCase) {
			// 获取测试用例详细信息
			this.getCaseDesc();
		}
		// 获取文件列表( 测试用例 )
		this.getAllFile();
		console.log('tableData:', this.tableData, Array.isArray(this.tableData))
	},


	// 添加监听 当this.editCase改变的时候则进行调用获取this.getCaseDesc
	// 解决 页面渲染前只能给一次，后面再切换用例的时候不会获取用例信息
	watch: {
		editCase(val) {
			if (this.editCase) {
				// 获取测试用例详细信息
				this.getCaseDesc();
			}
		}
	},

}
</script>

<style scoped>
/* 整个项目详情 div */
.edit_box {
	/* 简写属性控制元素所有四条边的内边距区域 */
	padding: 10px;
}

/* 前置脚本、后置交办 按钮 模板按钮 */
.add_script_box {
	/* 设置外边距。这里未看出生效 */
	margin-top: 5px;
	text-align: left;
}

/* 响应信息 */
.result_test {
	/* 不设置，测试结果选择日志tab时，测试结果框变宽，左侧菜单列变窄 */
	/* %针对父级扣除内边距的尺寸，vm针对浏览器窗口包含滚动条 */
	/* 下面的响应信息 与 上面的请求信息 有边框不能对齐 */
	/* width: calc((100vw - 230px) * 0.83) */
	/* 调整后可对其了 */
	width: calc((100vw - 230px) * 0.79)
}
</style>