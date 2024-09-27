<!-- 
用例运行后的 响应信息 
 -->
<template>
    <!-- 响应信息 选项卡 -->
    <el-tabs model-value="rb" style="min-height: 300px; width: 100%;" type="border-card" value="rb" size="small">
        <!-- <el-tabs model-value="rb" style="min-height: 300px;width: 100%;" type="border-card" value="rb" size="small"> -->

        <el-tab-pane label="响应体" name="rb">
            <div v-if="result.response_header">
                <!-- 
                    'Content-Type' 中是否存在 'application/json'
                    !=-1 表示存在
                 -->
                <div v-if="result.response_header['Content-Type'].search('application/json') != -1">
                    <Editor :read-only="true" v-model="result.response_body" lang="json" theme="chrome"></Editor>
                </div>
                <div v-else>
                    <Editor :read-only="true" v-model="result.response_body" lang="html" theme="chrome" height="500px">
                    </Editor>
                </div>
            </div>
        </el-tab-pane>

        <el-tab-pane label="响应头" name="rh">
            <div class="tab-box-sli" v-if="result.response_header">
                <div v-for="(value, key) in result.response_header">
                    <el-tag style="margin-top: 3px;" type="info">
                        <b style="">{{ key + ' : ' }}</b>
                        <span>{{ value }}</span>
                    </el-tag>

                </div>
            </div>
        </el-tab-pane>

        <el-tab-pane label="请求信息" name="rq">
            <div v-if="result.requests_body">
                <!-- Collapse 折叠面板 -->
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item name="1">
                        <template #title>
                            <b>General</b>
                        </template>
                        <div>Request Method : {{ result.method }}</div>
                        <div>Request URL : {{ result.url }}</div>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                        <template #title>
                            <b>Request Headers</b>
                        </template>
                        <div v-for="(value, key) in result.requests_header">
                            <span>{{ key + ' : ' + value }}</span>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item name="3">
                        <template #title>
                            <b>Request Payload</b>
                        </template>
                        <span>{{ result.response_body }}</span>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-tab-pane>

        <el-tab-pane label="日志">
            <!-- scrollbar 滚动条 -->
            <!-- <el-scrollbar style="width:100%" height="350px"> -->
            <el-scrollbar style="width:100%" height="350px">
                <div v-for="(item, index) in result.log_data">
                    <el-tag style="margin-top: 3px;" v-if="item[0] === 'DEBUG'" type="info">{{ item[1] }}</el-tag>
                    <el-tag style="margin-top: 3px;" v-else-if="item[0] === 'WARNING'" type="warning">{{ item[1] }}</el-tag>
                    <el-tag style="margin-top: 3px;" v-else-if="item[0] === 'ERROR'" type="error">{{ item[1] }}</el-tag>
                    <el-tag style="margin-top: 3px;" v-else-if="item[0] === 'INFO'" type="success">{{ item[1] }}</el-tag>
                    <pre style="color: #d60000;" v-else-if="item[0] === 'EXCEPT'">{{ item[1] }}</pre>
                </div>
            </el-scrollbar>
        </el-tab-pane>

        <!-- Assert断言结果 -->
        <el-tab-pane disabled>
            <!-- #label 就是插槽显示tab的标题 -->
            <template #label>
                <span style="color: #00aa7f;" v-if="result.state === '成功'">{{ 'Assert : ' + result.state }}</span>
                <span style="color: #d18d17;" v-else-if="result.state === '失败'">{{ 'Assert : ' + result.state }}</span>
                <span style="color: #ff0000;" v-else>{{ 'Assert : ' + result.state }}</span>
            </template>
        </el-tab-pane>

        <!-- status响应状态码 -->
        <el-tab-pane disabled>
            <!-- #label 就是插槽显示tab的标题 -->
            <template #label>
                <span style="color: #00AA7F;" v-if="result.status_cede <= 300">{{ 'Status : ' + result.status_cede }}</span>
                <span style="color: #ff5500;" v-else>{{ 'Status : ' + result.status_cede }}</span>
            </template>
        </el-tab-pane>

        <!-- Time 响应时间 -->
        <el-tab-pane disabled>
            <!-- #label 就是插槽显示tab的标题 -->
            <template #label>
                {{ 'Time : ' + result.run_time }}
            </template>
        </el-tab-pane>
    </el-tabs>

    <!-- 添加bug的按钮 
        margin-top 外边距
        100% 相符父级元素100%
    -->
    <!-- <div v-if="result.state === '失败' && showbtn" style="margin-top:10px; width: 100%; text-align: center;"> -->
    <div style="margin-top:10px; width: 100%; text-align: center;">
        <el-button @click="addBugDlg = true" type="success" plain size="small">提交bug</el-button>
    </div>

    <!-- 点击提交bug的弹窗 
        title 弹窗左上角标题
        v-model="addBugDlg"双向绑定是否弹出的状态
    -->
    <el-dialog v-model="addBugDlg" title="提交bug" width="40%">
        <!-- 嵌套表单 -->
        <el-form :model="bugForm">
            <el-form-item label="所属接口">
                <!-- Select 选择器 
                    placeholder 占位符 默认显示信息
                -->
                <el-select placeholder="bug对应的接口" v-model="bugForm.interface" size="small" style="width: 100%">
                    <!-- 下拉选项 -->
                    <el-option v-for="iter in interfaces" :key="iter.id" :label="iter.name + ' ' + iter.url"
                        :value="iter.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="bug描述">
                <!-- :autosize 最少展示行，输入后最多展示行后显示滚动条
                    type="textarea" 设置了 autosize才生效
                    autocomplete="off 自动补充，如账号密码
                 -->
                <el-input v-model="bugForm.desc" :autosize="{ minRows: 3, maxRows: 4 }" type="textarea"
                    autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <!-- 插槽，展示底部两个按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addBugDlg = false">取 消</el-button>
                <el-button type="primary" @click="saveBug">确 定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import Editor from './CodeEdit.vue'; // yinru 
import { ElMessage } from 'element-plus';

export default {

    // 接收父组件传值
    // 简化版，不能指定类型、默认值，父组件为传值则为为 undefined
    // props: ['result', 'showbtn'],
    // 能指定类型、默认值
    props: {
        // 父组件传进来的：点击用例执行run后接口返回的响应信息对象
        result: {
            // type: Object,  // 期待 result 是一个对象
            default: {},
            // default: () => ({})  // 默认值是一个空对象
        },
        // 添加bug按钮
        showbtn: {
            type: Boolean,  // 期待 showbtn 是一个布尔值
            default: true  // 默认值是 true
        },
    },
    // 计算属性
    computed: {
        // 映射store/index.js/state
        ...mapState(['pro', 'interfaces']),
    },
    // 注册组件
    components: {
        Editor
    },
    data() {
        return {
            // ['1', '2', '3'] 是123默认都展开
            // ['1'] 默认只1的展开
            // activeNames: ['1'],
            activeNames: ['1', '2', '3'],
            // 提交bug的显示窗口
            addBugDlg: false,
            // 添加bug的表单
            // 调用后端创建bug接口时，需要传入的对象参数
            bugForm: {
                // 项目接口
                interface: null,
                // bug描述
                desc: '',
                // 测试报告，接收测试用用例run执行后接口返回的响应信息对象
                info: '',
                // bug状态
                status: '未处理',
            }
        };
    },
    methods: {
        async saveBug() {
            this.bugForm.project = this.pro.id;
            this.bugForm.info = this.result;
            const response = await this.$api.createBugs(this.bugForm);
            if (response.status === 201) {
                // 这个不清楚为什么能用，都没有引入，老师写的
                // this.$message({
                //     type: 'success',
                //     message: 'bug提交成功',
                //     duration: 1000, // 停留时长
                // });

                // 通常用这个
                ElMessage({
                    type: 'success',
                    message: 'bug提交成功',
                    duration: 1000,
                })

                // 关闭提交bug的弹窗
                this.addBugDlg = false;
            };
            console.log("日志 调用后端提交bug接口传参this.bugForm：", this.bugForm);
        },
        // // 老师写的
        // async saveBug() {
        // 	this.bugForm.project = this.pro.id;
        // 	this.bugForm.info = this.result;
        // 	const response = await this.$api.createBugs(this.bugForm);
        // 	if (response.status === 201) {
        // 		this.$message({
        // 			type: 'success',
        // 			message: 'bug提交成功',
        // 			duration: 1000
        // 		});
        // 		this.addBugDlg = false;
        // 	}
        // }

    }

}
</script>

<style></style>