/*
VUEX
添加顶部tag标签方法，并去重

*/


// 1 先import从 vuex 导入
import {
	createStore
} from 'vuex'

// 接口文档 - interface - list/read
// 项目列表 - 接口管理 - (项目接口、外部接口)信息
import api from '../api/index.js'

// 2 创建全局store对象 目的：可通过this.$store访问
export default createStore({
	// state用于定义 全局数据, 可以在任意的组建中使用
	// 数据是响应式的，当数据发生变化，组件会自动更新；
	// 在组件中 使用state方法的数据，通常两种：
	//     1 this.$store.state.全局数据名称
	//     2 使用 mapState 辅助函数，将state中的全局数据映射到组件中的computed计算属性，直接使用该计算属性
	state: {
		// 用这个会报错
		// tags: ['a', 'b'],
		tags: [],
		// 当前选择的项目 项目详情页-信息存储
		pro: null,
		// 项目详情-接口管理 数据
		interfaces: [],
		// 项目详情-接口管理-项目接口(type=1) 数据
		interfacesForPro: ['a', 'b', 'c'],
		// 项目详情-接口管理-外部接口(type=2) 数据
		interfacesForThird: [5, 6, 7, 8, 9],
		// 项目详情-接口测试-右上角选择的环境id
		// envId: 136,
		// envId: 429,
		envId: null, // 默认值
		// 保存当前项目的所有环境
		testEnvs: [],
		// 项目中所有的测试场景
		testScents: [],
		// 项目中所有的测试计划
		testPlans:[],
	},

	// 全局计算属性 类似vue-except default - computed 计算属性
	getters: {
		// 项目详情-接口管理-项目接口
		inters1(state) {
			// filter设置匿名函数，如果为真则取出数据
			// item是遍历的每一个项目信息小数组
			return state.interfaces.filter((item) => {
				return item.type === '1'
			})
		},
		// 项目详情-接口管理-外部接口
		inters2(state) {
			return state.interfaces.filter((item) => {
				return item.type === '2'
			})
		},
	},

	// 定义修改全局属性state:{}的方法
	// 错误 修改方式：this.$store.state.全局数据名称 = 新的数据
	// 错误 实例：this.$store.state.age = 80
	// 正确 调用mutations中定义的方法 两种：
	// 1 this.$store.commit('mutations中的方法名称', 参数)
	// 2 使用 mapMutations 辅助函数，将mutations中的方法与组件中method方法一对一映射
	// 一般第二种 更好用
	mutations: {
		// 必须设置两个参数，第一个参数为state对象，第二个参数为调用该方法时传递的参数；

		// item是要添加到state.tags:[]中的对象
		addTags(state, item) {
			// state.tags.push(item) // 多次点击同一个菜单时，会导致顶部tag重复。需做判断。
			// 如何去重 数组：判断item在tag中是否存在
			// find 可以设置匿名函数(箭头函数) 类似Python中reduce、map 
			//   (i) => {return i.path === item.path}
			//   i 是每次遍历迭代会取出的一个tag，
			//   任意相等则返回true，否则为false
			//   find 返回布尔值，如果为ture代表已存在, 为false则不存在
			// 实际就是传递了一个key然后指定了一个函数做过滤迭代的。
			// const bResult 接收返回值
			const bResult = state.tags.find((i) => {
				return i.path === item.path
			})
			// 判断是否 当前遍历的路由的i.path = 插入的item.path
			// 如果不存在则添加
			if (!bResult) {
				state.tags.push(item)
			}
		},

		// 删除state.tags中数据方法
		popTags(state, item) {
			// 遍历每个i的path != 传入的页面item的path
			// 箭头函数满足条件为真返回true，则取出保存到新数组，否则排除掉
			// 新数组覆盖原来的state.tags
			state.tags = state.tags.filter((i) => {
				return i.path !== item.path
			})
		},

		// 选中的环境
		selectEnv(state, value) {
			state.envId = value
		},

		// 项目列表 保存 当前选择的项目信息
		savePro(state, value) {
			state.pro = value
		},

		// 修改 Interfaces
		// 保存当前项目的接口信息 到Interfaces数组的方法
		// value 是新的接口信息
		saveInterface(state, value) {
			state.interfaces = value;
		},

		// 更新测试环境列表
		updateTestEnvs(state, value) {
			state.testEnvs = value
		},

		// 测试场景属性赋值
		updateTestScents(state, value) {
			state.testScents = value
		},

		// 项目中所有测试计划
		updateTestPlans(state, value){
			state.testPlans = value
		},

	},

	// 定义全局的异步方法，如果有后端接口请求，放在此处定义；
	actions: {
		// 获取所有测试环境
		// 在Project.vue - created(){}中调用
		async getAllEnvs(context) {
			const response = await api.getTestEnvs(context.state.pro.id);
			if (response.status === 200) {
				context.commit('updateTestEnvs', response.data)
			};
			console.log('日志 当前项目所有测试环境getTestEnvs: ', response.data);
		},

		// 获取选择的项目所有内外接口
		// 项目详情-接口管理-(项目接口、外部接口)信息
		// 第一个参数comtent实际是一个store对象，不是state；
		async getAllInterFaces(content) {
			// 使用真数据：
			// 获取项目下的所以接口信息
			// 获取api信息，这里不是组件不能用$美元符号，需要先导入
			//     import api from '../api/index.js'
			// Axios接口文档：github.com/axios/axios - Request Config 
			//     搜索 params：参数必须是纯粹的对象{key: val}，不是只传一个值。
			//     Must be a plain object or a URLSearchParams object
			// 使用变量接收 response
			console.log("日志 项目id content.state.pro.id：", content.state.pro.id);
			const response = await api.getInterfaces({
				// 这里是params，必须传对象 要有花括号{}
				// 项目接口文档 Interface-read-Interact-project输入1查询，
				//     接口路径问号右侧显示 ?project=1，那key就是project，值就是1是项目id
				//     {project=1} 就是aip/index.js接口定义中的参数 parameters
				project: content.state.pro.id
			})
			console.log("日志 后端接口返回该项目所有接口 response.data：", response.data);
			// 调用 保存信息 方法
			// 判断响应值为200 则为成功
			if (response.status === 200) {
				// 将项目接口数据保存
				// 错误 方式 不能直接等于
				// content.state.interfaces = response.data
				// 正确 方式
				content.commit('saveInterface', response.data)
			}
			console.log("日志 该项目所有接口this.state.interfaces：", this.state.interfaces);
		},

		// 获取所有测试场景
		async getAllScent(context) {
			const response = await api.getTestScent({ project: context.state.pro.id });
			if (response.status === 200) {
				context.commit('updateTestScents', response.data)
			}
		},

		// 获取所有测试计划
		async getAllPlan(context){
			const response = await api.getTestPlan(context.state.pro.id)
			if (response.status === 200){
				context.commit('updateTestPlans', response.data)
			}
		}, 
	},

	// 模块（当项目结构很大且复杂的时候，会对项目中的全局数据分模块管理）
	modules: {}
})