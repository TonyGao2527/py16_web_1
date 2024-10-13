/* 
1 创建路由
2 配置路由规则
3 配置路由页面
4 创建路由实例
5 路由导航守卫
    1 判断页面有无token是否可访问 
    2 调用 项目详情页添加展示tags标签的方法
    3 tag名字显示中文
6 导出路由实例
7 补充子路由
8 实现进入项目默认选择 “项目首页” 路由重定向

*/


// 1、导入 创建路由的方法
import {
    createRouter,
    createWebHashHistory,
    // createWebHistory
} from 'vue-router'


// 导入 vuex
import store from '../store/index.js'


// 2、配置路由规则
const routes = [
    // 配置路由首页 根目录
    {
        // 指定访问的路径
        // 必须指定
        paht: '/',
        // 指定该路由的名称
        name: 'root',
        // 指定当返回路径时，显示的组件
        // component: () => import('../views/Home.vue'),

        // 路由重定向，到第二个路由页面
        redirect: '/login',
    },

    // 配置第二个路由 同级路由 登录页面
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue') // 登录页面：有交互的
        // component: () => import('../views/Login.vue') // 登录页面：无交互，简易的，为了理解 <router-link>
    },

    // 所有项目列表页面
    {
        path: '/allProject',
        name: 'allProject',
        component: () => import('../views/AllProject.vue')
    },

    // 项目详情页
    {
        path: '/project',
        name: 'project',
        component: () => import('../views/Project.vue'),
        redirect: '/project/index',
        children: [
            {
                // 使用meta定义路由的元素信息
                // meta的值可以定义任意的属性，用于存储路由的额外信息
                // 使用方式：$route.meta.name
                meta: {
                    'name': '项目首页'
                },
                path: '/project/index',
                name: 'index',
                component: () => import('../views/ProjectIndex.vue'),
            },
            {
                meta: {
                    'name': '接口管理'
                },
                path: '/project/interface',
                name: 'interface',
                component: () => import('../views/InterFace.vue'),
            },
            {
                meta: {
                    'name': '接口测试'
                },
                path: '/project/test',
                name: 'test',
                component: () => import('../views/InterFaceTest.vue'),
            },
            {
                meta: {
                    'name': '测试场景'
                },
                path: '/project/testscent',
                name: 'testscent',
                component: () => import('../views/TestScent.vue'),
            },
            {
                meta: {
                    'name': '测试计划'
                },
                path: '/project/testplan',
                name: 'testplan',
                component: () => import('../views/TestPlan.vue'),
            },
            {
                meta: {
                    'name': '测试环境'
                },
                path: '/project/testenv',
                name: 'testenv',
                component: () => import('../views/TestEnv.vue'),
            },
            {
                meta: {
                    'name': '定时任务'
                },
                path: '/project/crontab',
                name: 'crontab',
                component: () => import('../views/CronTab.vue'),
            },
            {
                meta: {
                    'name': 'bug管理'
                },
                path: '/project/bugs',
                name: 'bugs',
                component: () => import('../views/BugManage.vue'),
            },          
            {
                meta: {
                    'name': '测试报表'
                },
                path: '/project/records',
                name: 'records',
                component: () => import('../views/Records.vue'),
            },
            {
                meta: {
                    'name': '测试报告'
                },
                path: '/project/report/:id',
                // path: '/project/report', // 页面调试报告页面id写死时用的
                name: 'report',
                component: () => import('../views/Report.vue'),
            },

        ]
    },

]

// 3、创建路由实例
const router = createRouter({
    // 设置路由模式
    // a. hash模式：会在url中带一个#，无需服务器进行额外配置、兼容性好、不利于SEO，搜索引擎不会抓取#后面的内容；
    history: createWebHashHistory(),

    // b. HTML5模式：url中不带#，需要服务器的额外配置(nginx)、兼容性不好、利于SEO；
    // history: createWebHistory(),

    // 指定2中创建的路由规则数组
    // routes: routes 完整写法
    routes
})


// 设置路由导航守卫：控制前端路由访问的权限
// beforeEach方法 是在点击之后，页面跳转之前执行
// to 待访问的路由页面
// from 从哪个路由对象跳转过来
// next 房型3函数，也类似if可加条件
//     a 必须调用否则路由无法访问
//     b 调用时可以传参数，参数为要访问的路由对象
router.beforeEach((to, from, next) => {
    // 实现：页面跳转之前 项目详情=右上方-添加tag标签
    // 将访问的路由添加到vuex中的tags里面
    //     调用store/index.js - mutations:{} - addTags
    // 只添加头meta属性的路径
    //     如果路由mate包含name 不为空，则添加tag ，排除掉登录、项目列表、项目详情页的tag
    if (to.meta.name) {
        store.commit('addTags', to)
    }


    // 判断当前用户是否登录
    // 1 如果登录了（有token），那么允许访问页面
    // 2 如果没有登录（没有token），那么重定向到登录页面
    const token = window.sessionStorage.getItem('token');
    // 只要有token就允许访问
    if (token) {
        next()
    }
    // 如没token，并且仿问的是登录页面，那么允许访问；
    else if (to.name === 'login') {
        next()
    }
    // 如没token，并且访问的不是登录页面，那么重定向到登录页面；
    else {
        next({
            name: 'login'
        })
    }
})

// 4、导出路由实例
export default router