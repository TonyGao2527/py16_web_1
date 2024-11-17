<template>
    <!-- 最外层添加滚动 -->
    <el-scrollbar height="calc(100vh - 70px)">
        <!-- <h1>项目首页</h1>
        项目列表页获取项目信息： <br>
        {{ pro }} <br>
        项目详情页通过项目id获取 单个项目详情信息： <br>
        {{ projectInfo }} <br> -->
        <!-- 显示项目信息 -->
        <div v-if="projectInfo">
            <div class="pro_name">
                <!-- 项目名称 -->
                {{ projectInfo.name }}
                <!-- {{ projectInfo.leader }} <br>
            {{ projectInfo.create_time }} <br> -->
            </div>


            <!-- 基本信息 -->
            <!-- 标题 -->
            <b style="line-height: 40px;">【基本信息】</b>
            <!-- 内容 -->
            <el-card body-style="padding:0px">
                <!-- 信息列表展示
                el官网-Description 描述列表-垂直列表-Vertical list with border(垂直列表&有边框) - 复制<el-descriptions>-粘贴
                :column="4" 一行 Descriptions Item 的数量
            -->
                <el-descriptions :column="4" border>
                    <!-- 
                标签对齐 label-align="center"
                内容对齐 align="center"
                :span="1" 列的数量，不太懂，也是调整列
                -->
                    <el-descriptions-item label-align="center" align="center" label="负责人">
                        {{ projectInfo.leader }}
                    </el-descriptions-item>
                    <el-descriptions-item label-align="center" align="center" label="创建时间">
                        {{ $date.rTime(projectInfo.create_time) }}
                    </el-descriptions-item>
                    <el-descriptions-item label-align="center" align="center" v-for="item in projectInfo.info"
                        :label="item.name">
                        {{ item.value }}
                    </el-descriptions-item>

                </el-descriptions>

                <!-- 2.2.2 信息图形展示（仪表进度条 一行六列 ） -->
                <!-- 
                el官网- Layout 布局 -
                使用<el-row>标签展示一行多列
                    gutter 栅格间距 
                    margin-top 向上边距
                粘贴el组件样式
             -->
                <el-row :gutter="20" style="margin-top: 3px; ">
                    <!-- 
                    <el-col>一个标签就是一列，也可以一个标签布局6列
                        API查看span 是栅格，默认24，每个el-col的span值=展示几列就除以几；             
                    查看接口文档-projects-read-搜索id=1-看返回值
                        info每个列的文本包含不同的name、value、单位。
                        使用for循环，在<el-col>添加，不添加就是一整列。v-for="item in projectInfo.info"
                    :span="4" 添加后6个仪表板右竖排变横排；
                        不加冒号: 不生效，不会居中显示
                -->
                    <el-col :span="4" v-for="item in projectInfo.info">

                        <div class="pre">
                            <!-- 
                            el+官网 - Progress 进度条 - 自定义内容 - 源码 - 复制全的el-progress
                            type="dashboard" API可查看属性值；
                                circle 从90°开始 圆圈样式 
                                dashboard 从225°开始 仪表盘样式
                            :percentage 是进度条进度百分比
                                在<el-progress>指定了，在<template>和<span>中可以调用，不用可以不写。
                            status="success" 颜色这个不用 删掉
                         -->
                            <el-progress type="dashboard" :percentage="100">
                                <!-- #default不添加不展示仪表盘中的值
                                    { percentage }不写没有变化
                            -->
                                <template #default="{ percentage }">
                                    <!-- 展示value -->
                                    <!-- v-if 判断单位为 条的 -->
                                    <span class="percentage-value" v-if="item.name === '执行记录'">
                                        <!-- 父标签span做判断，子标签span展示值、单位 -->
                                        <span style="color: #6fc79e;">{{ item.value }}</span>
                                        <span>条</span>
                                    </span>
                                    <!-- v-else 判断单位为 个的 -->
                                    <span class="percentage-value" v-else>
                                        <span style="color: aquamarine;">{{ item.value }}</span>
                                        <span>个</span>
                                    </span>
                                    <!-- 展示name -->
                                    <span class="percentage-label">{{ item.name }}</span>
                                </template>
                            </el-progress>
                        </div>
                    </el-col>
                </el-row>
            </el-card>


            <!-- bug统计 -->
            <!-- 标题 -->
            <b style="line-height: 40px;">【bug统计】</b>
            <!-- 内容 -->
            <el-card  body-style="padding:0px">
                <!-- 信息列表展示 -->
                <el-descriptions :column="4" border>
                    <el-descriptions-item label-align="center" align="center" v-for="item in projectInfo.bugs"
                        :label="item.name">
                        {{ item.value }}
                    </el-descriptions-item>
                </el-descriptions>

                <!-- 2.2.2 信息图形展示（仪表进度条 一行4列 ） -->
                <el-row :gutter="20" justify="space-between" style="margin-top: 3px;">
                    <el-col :span="6" v-for="item in projectInfo.bugs">
                        <div class="pre">
                            <el-progress type="dashboard" :percentage="100">
                                <template #default="{ percentage }">
                                    <!-- 展示value、单位个 -->
                                    <span class="percentage-value">
                                        <span style="color: #6fc79e;">{{ item.value }}</span>
                                        <span>个</span>
                                    </span>
                                    <!-- 展示name -->
                                    <span class="percentage-label">{{ item.name }}</span>
                                </template>
                            </el-progress>
                        </div>
                    </el-col>
                </el-row>
            </el-card>

            <!-- 执行记录 -->
            <!-- 标题 -->
            <b style="line-height: 40px;">【执行记录】</b>
            <Record></Record>
        </div>

    </el-scrollbar>
</template>

<script>

import { mapMutations, mapState } from 'vuex';
import Record from './Records.vue'
export default {
    data() {
        return {
            projectInfo: null,
        }
    },
    // 注册子组建
    components:{
        Record
    },

    // 计算属性
    computed: {
        // mapState映射store-state数组，通过项目列表存储的项目信息
        ...mapState(['pro'])
    },

    methods: {
        // 调用方法 api-index.js 获取单个项目详细信息，当前页面通过项目id获取
        async getProjectInfo() {
            // 变量接收返回 = 传参id，从当前组件...mapState(['pro'])
            const response = await this.$api.getProjectInfo(this.pro.id);
            // datda(){}-return{}数据赋值
            this.projectInfo = response.data;
            // 写死的数据
            // this.projectInfo = {"id":1,"create_time":"2022-10-19T19:37:03.050479+08:00","name":"测试12","leader":"musen","info":[{"name":"执行环境","value":31},{"name":"测试场景","value":14},{"name":"测试计划","value":13},{"name":"接口数量","value":19},{"name":"定时任务","value":8},{"name":"执行记录","value":98}],"bugs":[{"name":"未处理bug","value":0},{"name":"处理中bug","value":0},{"name":"处理完bug","value":0},{"name":"无效bug","value":0}]}

        },
    },
    // 钩子 页面渲染前执行
    created() {
        this.getProjectInfo();
    },
}
</script>

<style scoped>
/* 
el+官网 - Progress 进度条 - 自定义内容 - 源码 - el-progress - 样式
*/
.percentage-value {
    display: block;
    margin-top: 10px;
    font-size: 28px;
}

.percentage-label {
    display: block;
    margin-top: 10px;
    font-size: 12px;
}

/* 项目名称 样式 */
.pro_name {
    /* 文本居中对齐 */
    text-align: center;
    /* 背景颜色 */
    background: #f3f3f3;
    /* background-color: #f3f3f3; */
    /* 所在盒子的高度 */
    height: 50px;
    /* 字体 是否加粗 字号 /行高 字体 */
    font: bold 22px/50px 'microsoft yahei';
    /* 字体颜色 */
    color: #00aa7f;
}

/* 存放图形的盒子 样式 */
.pre {
    /* 背景 */
    background: #f3f3f3;
    /* 文本居中对齐 */
    text-align: center;
    /* width: 200px; */
}
</style>