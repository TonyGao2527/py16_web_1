<template>
    <!-- 添加定时任务按钮 -->
    <el-button @click='dialogCron = true; updateBtn = false' style="margin: 10px 5px;" type="success"
        icon="el-icon-plus" size="small">
        添加定时任务
    </el-button>

    <!-- 定时任务表格 -->
    <el-table :data="cronList" style="width: 100%" size="small">
        <!-- 创建时间列 -->
        <el-table-column label="创建时间" min-width="180">
            <template #default="scope">
                {{ $date.rTime(scope.row.create_time) }}
            </template>
        </el-table-column>
        <!-- 名称列 -->
        <el-table-column prop="name" label="名称" min-width="140"></el-table-column>
        <!-- 执行任务列 -->
        <el-table-column prop="plan_name" label="执行任务" min-width="140"></el-table-column>
        <!-- 执行环境列 -->
        <el-table-column prop="env_name" label="执行环境" min-width="140"></el-table-column>
        <!-- 执行规则列 -->
        <el-table-column prop="rule" label="执行规则" min-width="140"></el-table-column>
        <!-- 是否开启列 -->
        <el-table-column label="是否开启" min-width="120">
            <template #default="scope">
                <!-- 定时任务开关 -->
                <el-switch @change='switchCronStatus(scope.row)' v-model="scope.row.status" active-color="#13ce66"
                    inactive-color="#b1b1b1"></el-switch>
            </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" min-width="100">
            <template #default="scope">
                <!-- 编辑按钮 -->
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <el-button @click='showUpdateCronDlg(scope.row)' type="success" size="small"
                        icon="Edit"></el-button>
                </el-tooltip>
                <!-- 删除按钮 -->
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button @click="delCron(scope.row.id)" type="danger" size="small" icon="Delete"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>

    <!-- 创建或修改定时任务的弹窗 -->
    <el-dialog v-model="dialogCron" width="45%">
        <div style="text-align: center" slot='title'>
            <!-- 弹窗标题，根据是否是修改操作显示不同内容 -->
            <span v-if="updateBtn" style="font-size: 18px; font-weight: bold;">修改定时执行任务</span>
            <span v-else style="font-size: 18px; font-weight: bold;">创建定时执行任务</span>
        </div>

        <!-- 定时任务表单 -->
        <el-form :model="cronTabData" ref="cronTabData" label-width="80px">
            <!-- 任务名称 -->
            <el-form-item label="名称">
                <el-input v-model="cronTabData.name"></el-input>
            </el-form-item>

            <!-- 测试环境选择 -->
            <el-form-item label="测试环境">
                <el-select v-model="cronTabData.env" placeholder="请选择环境" style="width: 100%;">
                    <el-option v-for="item in testEnvs" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <!-- 执行计划选择 -->
            <el-form-item label="执行计划">
                <el-select style="width: 100%;" v-model="cronTabData.plan" placeholder="请选择">
                    <el-option v-for="item in testPlans" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <!-- 是否开启开关 -->
            <el-form-item label="是否开启">
                <el-switch v-model="cronTabData.status" active-color="#13ce66" inactive-color="#c3c3c3"></el-switch>
            </el-form-item>

            <!-- 定时规则输入框 -->
            <el-form-item label="定时规则">
                <el-input v-model="cronTabData.rule" placeholder="* * * * *"></el-input>
                <!-- 规则说明 -->
                <el-row :gutter="20">
                    <el-col :span="14">
                        <h5>规则说明:</h5>
                        <div style="font-size: 12px; line-height: 16px;">* * * * * <span style="color:#909399">分别表示
                                minute hour week day month </span></div>
                        <div style="font-size: 12px; line-height: 16px">minute： <span
                                style="color:#909399">表示分钟，可以是从0到59之间的任何整数。</span></div>
                        <div style="font-size: 12px; line-height: 16px">hour：<span
                                style="color:#909399">表示小时，可以是从0到23之间的任何整数。</span>
                        </div>
                        <div style="font-size: 12px; line-height: 16px">week：<span
                                style="color:#909399">表示星期几，可以是从0到7之间的任何整数，这里的0或7代表星期日。</span>
                        </div>
                        <div style="font-size: 12px; line-height: 16px">day：<span
                                style="color:#909399">表示日期，可以是从1到31之间的任何整数。</span></div>
                        <div style="font-size: 12px; line-height: 16px">month：<span
                                style="color:#909399">表示月份，可以是从1到12之间的任何整数。</span></div>
                    </el-col>

                    <!-- 配置案例 -->
                    <el-col :span="10">
                        <h5>配置案例：</h5>
                        <div style="font-size: 12px;line-height: 16px">5 * * * * : <span
                                style="color:#909399">每小时的第5分钟执行一次任务</span></div>
                        <div style="font-size: 12px;line-height: 16px">30 9 * * * : <span
                                style="color:#909399">每天上午的9:30执行一次任务</span></div>
                        <div style="font-size: 12px;line-height: 16px">30 9 * 8 * : <span
                                style="color:#909399">每月8号上午的9:30执行一次任务</span></div>
                        <div style="font-size: 12px;line-height: 16px">30 9 * 5 3 : <span
                                style="color:#909399">每年的3月5日9:30执行一次任务</span></div>
                        <div style="font-size: 12px;line-height: 16px">30 9 0 * * : <span
                                style="color:#909399">每星期日的上午9:30执行一次任务</span></div>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>

        <!-- 弹窗底部按钮 -->
        <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button @click="dialogCron = false" size="small">取 消</el-button>
            <!-- 提交修改或创建新任务 -->
            <el-button v-if="updateBtn" type="success" @click="UpdateCron()" size="small">提交修改</el-button>
            <el-button v-else type="success" @click="createCron()" size="small">创 建</el-button>
        </div>
    </el-dialog>

</template>

<script>
// 导入vuex的mapState和mapActions，方便获取状态和调用actions
import { mapState, mapActions } from 'vuex';
export default {

    data() {
        return {
            // 定时任务列表
            cronList: null,
            // 控制定时任务窗口显示/隐藏
            dialogCron: false,
            // 控制按钮文本：修改或创建
            updateBtn: true,
            // 添加定时任务表单数据
            cronTabData: {
                name: "冒烟测试定期执行",
                rule: "* * * * *", // 默认规则：每分钟
                status: true, // 默认开启
                plan: null,
                env: null
            },
        }
    },

    // 使用Vuex的状态映射
    computed: {
        ...mapState(['pro', 'testEnvs', 'testPlans'])  // 获取项目、测试环境和测试计划数据
    },

    methods: {
        // 获取所有定时任务列表
        async getAllCron() {
            // 调用 API 获取定时任务数据
            const response = await this.$api.getCrons(this.pro.id)
            // 如果请求成功，更新 cronList 数据
            if (response.status === 200) {
                this.cronList = response.data
            }
        },

        // 删除指定定时任务
        delCron(id) {
            // 弹出确认框，提示用户是否确定删除
            this.$confirm('此操作将永久删除该定时任务, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    // 用户确认删除，调用 API 删除定时任务
                    const response = await this.$api.delCron(id)
                    if (response.status === 204) {
                        // 删除成功后弹出成功提示消息
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        // 刷新定时任务列表
                        this.getAllCron()
                    }
                })
                // 如果用户取消删除，弹出提示消息
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },

        // 切换定时任务的开启/关闭状态
        async switchCronStatus(cron) {
            // 调用 API 更新定时任务状态
            const response = await this.$api.updateCron(cron.id, cron)
            // 如果请求成功，根据状态显示不同的提示消息
            if (response.status === 200) {
                if (cron.status == true) {
                    // 定时任务开启时弹出成功消息
                    this.$message({
                        type: 'success',
                        message: '定时运行已开启',
                        duration: 1000
                    })
                } else {
                    // 定时任务关闭时弹出警告消息
                    this.$message({
                        type: 'warning',
                        message: '定时运行已关闭',
                        duration: 1000
                    })
                }
            } else {
                // 更新状态失败时弹出错误消息
                this.$message({
                    type: 'error',
                    message: '修改状态失败',
                    duration: 1000
                })
            }
        },

        // 创建一个新的定时任务
        async createCron() {
            // 准备参数，包括项目 ID 和 cronTabData 中的数据
            const params = {
                project: this.pro.id,
                ...this.cronTabData
            }
            // 调用 API 创建定时任务
            const response = await this.$api.createCron(params)
            if (response.status === 201) {
                // 创建成功后弹出成功提示消息
                this.$message({
                    type: 'success',
                    message: '定时任务添加成功',
                    duration: 1000
                })
                // 关闭创建定时任务的对话框
                this.dialogCron = false
                // 刷新定时任务列表
                this.getAllCron()
            }
        },

        // 显示修改定时任务的对话框，并填充当前定时任务的数据
        showUpdateCronDlg(cron) {
            // 将选中的定时任务数据复制到 cronTabData，用于修改
            this.cronTabData = { ...cron }
            // 打开对话框
            this.dialogCron = true
            // 设置更新按钮为可见
            this.updateBtn = true
        },

        // 提交修改后的定时任务数据
        async UpdateCron() {
            // 调用 API 更新定时任务数据
            const response = await this.$api.updateCron(this.cronTabData.id, this.cronTabData)
            if (response.status === 200) {
                // 更新成功后弹出成功提示消息
                this.$message({
                    type: 'success',
                    message: '修改成功',
                    duration: 1000
                })
                // 关闭对话框
                this.dialogCron = false
                // 刷新定时任务列表
                this.getAllCron()
            }
        },
    },
    // 在组件创建时获取所有定时任务
    created() {
        this.getAllCron()
    }
}

</script>

<style></style>
