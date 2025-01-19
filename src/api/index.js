/* 
1 非登录接口，接口请求前，请求头中要添加token
	通过 请求拦截实现：如果请求URL不包含login，取token放在请求头中
2 标签显示 汉字

*/

import axios from 'axios'


// import {
// 	// elt+官网-搜索Message Box消息弹出框-确认消息
// 	ElMessageBox
// } from 'element-plus

import {
	ElMessage,
	ElMessageBox
} from 'element-plus'


// 创建公共请求url
// const base_url = 'http://42.192.110.51:18899'
const base_url = 'http://117.72.85.244:18899/api'
// const base_url = 'https://ck.lemonban.com/api'

// 创建axios请求实例对象：开发环境
const httpDev = axios.create({
	// 定义公共的base url
	baseURL: base_url,

	// 定义校验响应状态 处理
	validateStatus: function (status) {
		// if (status >= 200 & status < 300) {
		// 	return true;
		// } else {
		// 	return false;
		// }
		return true;
	},
	// 添加其他的，参考axios官方文档
})


// 1.请求拦截
// use的第一个参数为匿名参数，用于处理请求拦截信息
// use的第二个参数为匿名参数，用于请求出错时的策略
httpDev.interceptors.request.use(
	// 在向前端发起请求前先执行
	// config 包含所有的请求信息，包含URL。及更多信息；
	function (config) {
		console.log('----请求拦截器----')
		// 1 判断请求url中是否有/login/， 如不包含
		if (config.url !== '/login/') {
			//获取浏览器会话中token，存在data中的token
			const token = window.sessionStorage.getItem('token')
			// 判断token不为空，
			if (token) {
				// 就在当前请求header中存放token
				config.headers['Authorization'] = 'JWT ' + token;
				// 'JWT ' + token JWT右侧要加空格这是后端接口规范。有的公司不是JWT，可能是Bearer；
			}
		}
		// 最后将 config 返回
		return config
	},

	// 异常处理，当失败时做什么策略
	function (error) {
		console.log(erroer, 'error')
		return Promise.reject(error)
	}
);

// 2.响应拦截器
// httpDev.interceptors.response.use(
// 	// 在向后端发起请求前先执行
// 	// 后端数据返回给浏览器的时候，浏览器显示之前，进行处理
// 	function(response) {
// 		console.log('----响应拦截器----')
// 		return response
// 	},
// 	function(error) {
// 		// 当相应状态码超出2xx范围，会触发此函数
// 		return Promise.reject(error)
// 	}
// );


// 导出封装的所有后端api请求
export default {

	// 接口文档 http://42.192.110.51:18899/docs/


	// 登录接口
	loginApi(params) {
		return httpDev.post('/login/', params);
	},

	// ---------------项目相关的api-------------------------------------------------------
	// 获取项目列表接口
	getProjects() {
		return httpDev.get('/projects/')
	},

	// 新增项目接口 .post请求
	createProjects(params) {
		// 传参URL，params传入普通对象就是json传参，如果是parameter就是表单传参，自动转换
		return httpDev.post('/projects/', params)
	},

	// 修改项目 .patch请求
	// 接口文档-Authentication-Basic 登录- peoject-update-传参两个
	updateProjects(id, params) {
		// 使用反引号``能自动识别里面的$美元符号，将对应参数传进来。类似Python中的f"" 表达式；
		return httpDev.patch(`/projects/${id}/`, params)
	},

	// 删除项目 delete请求
	// 只传一个id，没有其他参数
	deleteProject(id) {
		return httpDev.delete(`/projects/${id}/`)
	},

	// 获取单个项目详细信息
	// http://42.192.110.51:18899/docs/#projects-read
	// 项目详情 - 项目主页
	// 接口文档提供。学习后端项目时候详细讲解。
	getProjectInfo(id) {
		return httpDev.get(`/projects/${id}/`)
	},

	// ----------------项目接口相关的api-----------------------
	// 获取项目接口信息
	// (这里用的这个)所有接口列表 http://42.192.110.51:18899/docs/#interface-list
	// 查看项目接口文档 - Interface - list - Interact - type=1(1项目2外部) - send request
	// 单个接口用例查询 http://42.192.110.51:18899/docs/#interface-read	
	// 查看项目接口文档 - Interface - read - id=steps外层id
	// 路径参数就是当前的项目id
	getInterFaces(parameters) {
		return httpDev.get('/interface/', {
			// Axios接口文档：github.com/axios/axios - Request Config 
			//     - params说明，实际就是查询对象，在URL后面加问号的参数
			// `params` are the URL parameters to be sent with the request
			// Must be a plain object or a URLSearchParams object
			// params的值parameters必须是一个纯粹对象 或 URLsessiom
			//     params: {
			//         ID: 12345
			//     },
			// Axios接口文档：github.com/axios/axios - Example
			// get('/user?ID=12345')
			// get('/user', {params:{ID:12345}})
			// 这两种等价
			params: parameters
		})
	},

	// 删除接口
	// 添加接口
	// 修改接口


	// ---------------测试用例相关的接口---------------------------------------------------------
	// 获取单个测试用例详细信息
	// 项目详情-接口测试-点击左侧用例
	// http://42.192.110.51:18899/docs/#teststep-read
	getCaseInfo(id) {
		return httpDev.get(`/teststep/${id}/`)
	},
	// 删除测试用例
	// http://42.192.110.51:18899/docs/#teststep-delete
	// 接口文档 - teststep - delete
	// 项目详情-接口测试-接口-用例-删除
	delTeststep(id) {
		return httpDev.delete(`/teststep/${id}/`)
	},
	// 创建测试用例

	// 修改测试用例
	// 应该是这个 测试步骤视图 http://42.192.110.51:18899/docs/#testenvs-partial_update
	// 接口测试 - 用例 - 保存按钮
	// params 当前用例信息对象{用例名，请求头，请求信息，file，前置数据，后置数据等}
	updateTeststep(id, params) {
		return httpDev.patch(`/teststep/${id}/`, params)
	},
	// 创建测试用例
	// http://42.192.110.51:18899/docs/#teststep-create
	// 接口测试 - 用例 - 复制按钮
	createTeststep(params) {
		return httpDev.post('/teststep/', params)
	},



	// ===============测试场景相关的接口=======================================================
	// 获取项目所有测试场景
	// store中调用该接口报错state,TestScent.vue-computed有引用映射
	// 传参：项目id  获取项目下所有测试场景
	// TestPlan.vue-method-中调用该接口
	// 传参：计划id  获取计划下所有测试场景
	getTestScent(params) {
		return httpDev.get(`/testscent/`, {
			params: params
		})
	},

	// 获取单个测试场景下的详细数据

	// 添加测试场景
	createTestScent(params) {
		return httpDev.post(`/testscent/`, params)
	},

	// 删除测试场景
	delTestScent(id) {
		return httpDev.delete(`/testscent/${id}/`)
	},

	// 修改测试场景
	updateTestScent(id, params) {
		return httpDev.patch(`/testscent/${id}/`, params)
	},


	// ===============测试场景中的数据========================================================
	// 修改测试场景中的执行步骤顺序
	// http://42.192.110.51:18899/docs/#testscent-order-update
	updateScentDataOrder(params) {
		return httpDev.put(`/testscent/order`, params)
	},

	// 获取测试场景中的数据
	// http://42.192.110.51:18899/docs/#scentdata-list
	getScentDatas(scentId) {
		return httpDev.get(`/scentdata/`, {
			params: {
				scent: scentId
			}
		})
	},

	// 添加步骤到测试场景中
	// sort行顺序
	// step 步骤
	// scent 场景
	addScentData(params) {
		return httpDev.post(`/scentdata/`, params)
	},

	// 删除测试场景中的用例/步骤
	delScentData(id) {
		return httpDev.delete(`/scentdata/${id}/`)
	},


	// ===============测试计划相关的接口=======================================================
	// 获取项目所有测试计划
	getTestPlan(project_id) {
		return httpDev.get(`/testplan/`, {
			params: {
				project: project_id
			}
		})
	},

	// 添加测试计划
	// http://42.192.110.51:18899/docs/#testscent-create
	createTestPlan(params) {
		return httpDev.post(`/testplan/`, params)
	},

	// 删除测试计划
	// http://42.192.110.51:18899/docs/#testplan-delete
	delTestPlan(id) {
		return httpDev.delete(`/testplan/${id}/`)
	},

	// 修改测试计划
	// http://42.192.110.51:18899/docs/#testplan-partial_update
	// params
	//   name      计划名
	//   project   项目id
	//   scent     包含的测试场景
	updateTestPlan(id, params) {
		return httpDev.patch(`/testplan/${id}/`, params)
	},



	// ---------------环境相关的api--------------------
	// 获取当前项目所有测试环境
	getTestEnvs(project_id) {
		return httpDev.get(`/testenvs/`, {
			params: {
				project: project_id
			}
		})
	},

	// 获取单个环境信息
	getEnvInfo(id) {
		return httpDev.get(`/testenvs/${id}/`)
	},

	// 删除测试环境
	delTestEnvs(id) {
		return httpDev.delete(`/testenvs/${id}/`)
	},

	// 添加测试环境
	createTestEnvs(params) {
		return httpDev.post(`/testenvs/`, params)
	},

	// 修改测试环境
	updateTestEnvs(id, params) {
		return httpDev.patch(`/testenvs/${id}/`, params)
	},



	// ===============定时任务接口==========================================================

	// 获取所有定时任务
	getCrons(project_id) {
		return httpDev.get(`/cron/`, {
			params: {
				project: project_id
			}
		})
	},

	// 删除定时任务
	delCron(id) {
		return httpDev.delete(`/cron/${id}/`)
	},

	// 添加定时任务
	createCron(params) {
		return httpDev.post(`/cron/`, params)
	},
	
	// 修改定时任务
	updateCron(id, params) {
		return httpDev.patch(`/cron/${id}/`, params)
	},

	// ===============测试记录=============================================================
	// 获取所有的测试记录	
	// http://42.192.110.51:18899/docs/#record-list
	// 测试计划 - 执行记录
	getTestRecord(params) {
		return httpDev.get(`/record/`, {
			params: params
		})
	},

	// 获取测试记录
	// http://42.192.110.51:18899/docs/#record-read
	getRecordInfo(id) {
		return httpDev.get(`/record/${id}/`)
	},

	// 获取测试报告信息
	// http://42.192.110.51:18899/docs/#report-read
	getTestReport(id) {
		return httpDev.get(`/report/${id}/`)
	},



	//================bug管理================================================================
	// 获取所有bug
	getBugs(params){
		return httpDev.get('/bugs/', {
			params:params
		})
	},

	// 添加bug记录
	createBugs(params) {
		return httpDev.post('/bugs/', params)
	},

	// 修改bug记录

	// 删除bug


	//================获取bug处理记录列表=======================================================


	// ===============用例运行=================================================================
	// 运行接口用例
	// 接口测试-接口-用例-run按钮
	// http://42.192.110.51:18899/docs/#runTest-create
	runTest(params) {
		// :param env: 测试环境,必填项 
		// :param plan: 测试计划id (运行测试计划)
		// :param scent: 测试场景id (运行测试场景)
		// :param data: 测试数据id (运行单条用例时使用) 
		return httpDev.post('/runTest/', params)
	},


	// ===============文件上传操作=================================================================
	// 上传文件  接口测试-请求信息-请求体- form-data - 上传文件
	uploadFile: {
		url: base_url + "/upload/file/",
		headers: {
			Authorization: 'JWT' + window.sessionStorage.getItem('token')
		}
	},

	// 获取文件列表( 测试用例 )
	getFiles() {
		return httpDev.get('/upload/file/')
	},

	// 删除文件
}