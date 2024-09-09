// 导入creatApp
import {
	createApp
} from 'vue'
// 导入根组件
import App from './App.vue'
// 导入路由
import router from './router'


// 导入全局css样式
import './assets/css/main.css'


// 创建vue app对象
const app = createApp(App)



// 导入axios api
import api from './api/index.js'
// api注册vue全局属性
app.config.globalProperties.$api = api


// 导入element-plus
import ElementPlus from 'element-plus'
// 导入element-plus 全局css样式
import 'element-plus/dist/index.css'
// 导入中文翻译
import zhCN from 'element-plus/es/locale/lang/zh-cn'
// 注册element-plus插件，直接官网复制
app.use(ElementPlus, {
	locale: zhCN
})


// 引入element-plus的图标组建
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 将element-plus图标注册为全局组件
// 直接官网复制
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

// 导入vues
import store from './store'


// 导入日期处理对象
import dataH from './assets/js/dateHander.js'
// 定义全局属性
app.config.globalProperties.$date = dataH

// 将定义 echarts 图标对象绑定为全局属性
import chart from './assets/js/chart.js'
app.config.globalProperties.$chart = chart


// Vue.use方法是用于注册插件；
app.use(store).use(router).mount('#app')


// 项目详情-接口管理- 项目接口、外部接口 切换报错
// ResizeObserver loop completed with undelivered notifications.
// 解决地址 https://www.jianshu.com/p/2d55b30bb64f
// app.vue写在script里面  main.js写在app挂载完之后
// const debounce = (fn, delay) => {
// 	let timer
// 	return (...args) => {
// 		if (timer) {
// 			clearTimeout(timer)
// 		}
// 		timer = setTimeout(() => {
// 			fn(...args)
// 		}, delay)
// 	}
// }

// const _ResizeObserver = window.ResizeObserver;
// window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
// 	constructor(callback) {
// 		callback = debounce(callback, 200);
// 		super(callback);
// 	}
// }
// ==============报错修复结束===================


// 项目计划页面，浏览器宽度 拉大拉小时会报错
if (typeof ResizeObserver !== 'undefined') {
	const resizeObserverErrHandler = (e) => {
	  e.preventDefault();
	};
	window.addEventListener('error', resizeObserverErrHandler);
  }
  