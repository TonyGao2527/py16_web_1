<template>
    <div class="bug_box">
        <!-- bug统计标题 -->
        <span class="el-icon-s-data" style="color: #00aa7f;"><b>bug统计</b></span>
        <!-- 图表行 -->
        <el-row :gutter="10">
            <!-- 左侧图表 -->
            <el-col :span="12"><div class="chartBox" ref="chart1Box"></div></el-col>
            <!-- 右侧图表 -->
            <el-col :span="12"><div class="chartBox" ref="chart2Box"></div></el-col>
        </el-row>
        <!-- bug列表卡片 -->
        <el-card class="bug_list">
            <el-row>
                <!-- 所有bug按钮 -->
                <el-button @click="showBugs = bugs" type="primary" plain size="small">所有bug</el-button>
                <!-- 未处理bug按钮 -->
                <el-badge :value="bugs1.length" :hidden="bugs1.length === 0" class="item" :max="99" style="margin: 0 10px;">
                    <el-button @click="showBugs = bugs1" type="danger" plain size="small">未处理bug</el-button>
                </el-badge>
                <!-- 处理中bug按钮 -->
                <el-button @click="showBugs = bugs2" type="warning" plain size="small">处理中bug</el-button>
                <!-- 处理完bug按钮 -->
                <el-button @click="showBugs = bugs3" type="success" plain size="small">处理完bug</el-button>
                <!-- 无效bug按钮 -->
                <el-button @click="showBugs = bugs4" type="info" plain size="small">无效bug</el-button>
            </el-row>
            <!-- bug表格 -->
            <el-table :data="showBugs" style="width: 100%;" size="small">
                <!-- 提交时间列 -->
                <el-table-column label="提交时间" min-width="120" show-overflow-tooltip>
                    <template #default="scope">
                        <span>{{ $date.rTime(scope.row.create_time) }}</span>
                    </template>
                </el-table-column>
                <!-- bug描述列 -->
                <el-table-column show-overflow-tooltip prop="desc" label="bug描述" min-width="120"></el-table-column>
                <!-- 所属接口列 -->
                <el-table-column show-overflow-tooltip prop="interface_url" label="所属接口" min-width="00"></el-table-column>
                <!-- bug状态列 -->
                <el-table-column prop="status" label="bug状态" min-width="80"></el-table-column>
                <!-- 操作列 -->
                <el-table-column min-width="180">
                    <template #default="scope">
                        <div style="text-align: right;">
                            <!-- 查看bug详情按钮 -->
                            <el-tooltip class="item" effect="dark" content="查看bug详情" placement="top">
                                <el-button icon="View" @click="showBugInfo(scope.row)" size="small" type="success" plain></el-button>
                            </el-tooltip>
                            <!-- 修改bug状态按钮 -->
                            <el-tooltip class="item" effect="dark" content="修改bug状态" placement="top">
                                <el-button
                                    icon="Edit"
                                    @click="
                                        updateBugDlg = true;
                                        updateBugForm = scope.row;
                                    "
                                    size="small"
                                    type="success"
                                    plain
                                ></el-button>
                            </el-tooltip>
                            <!-- 删除bug按钮 -->
                            <el-tooltip class="item" effect="dark" content="删除bug" placement="top">
                                <el-button icon="Delete" @click="delBug(scope.row.id)" size="small" type="danger" plain></el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>

    <!-- 查看bug信息抽屉 -->
    <el-drawer v-model="showBug" title="I am the title" :with-header="false" size="50%">
        <el-scrollbar height="calc(100vh - 20px)">
            <!-- bug信息卡片 -->
            <el-card>
                <b>bug信息</b>
                <div style="margin-top: 10px;">
                    <el-descriptions :column="4" direction="vertical" border>
                        <el-descriptions-item label="提交者">admin</el-descriptions-item>
                        <el-descriptions-item label="bug状态">{{ bugInfo.status }}</el-descriptions-item>
                        <el-descriptions-item label="所属接口">{{ bugInfo.interface_url }}</el-descriptions-item>
                        <el-descriptions-item label="提交时间">{{ $date.rTime(bugInfo.create_time) }}</el-descriptions-item>
                    </el-descriptions>
                </div>
            </el-card>
            <!-- 用例执行信息卡片 -->
            <el-card style="margin: 5px;min-height: 400px;">
                <b>用例执行信息</b>
                <div style="margin-top: 10px;"><Result :result="bugInfo.info" :showbtn="false"></Result></div>
            </el-card>
            <!-- bug处理记录卡片 -->
            <el-card style="min-height: 400px;" v-if="bugLogs">
                <b>bug处理记录</b>
                <div style="margin-top: 10px;">
                    <el-timeline>
                        <el-timeline-item v-for="(activity, index) in bugLogs" :key="index" :timestamp="$date.rDate(activity.create_time)" placement="top">
                            <el-card>
                                <h4>{{ activity.handle }}</h4>
                                <p>{{ activity.update_user }}操作于 {{ $date.rTime(activity.create_time) }}</p>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-card>
            <!-- 无bug处理记录时显示空状态 -->
            <el-empty v-else description="无" :image-size="400"></el-empty>
        </el-scrollbar>
    </el-drawer>

    <!-- 修改bug状态对话框 -->
    <el-dialog title="修改bug状态" v-model="updateBugDlg" width="30%">
        <el-form :model="updateBugForm">
            <el-form-item label="bug状态">
                <el-select style="width: 100%;" v-model="updateBugForm.status" placeholder="请选择bug状态">
                    <el-option label="未处理" value="未处理"></el-option>
                    <el-option label="处理中" value="处理中"></el-option>
                    <el-option label="处理完" value="处理完"></el-option>
                    <el-option label="无效bug" value="无效bug"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <!-- 取消按钮 -->
                <el-button size="small" @click="updateBugDlg = false">取 消</el-button>
                <!-- 确定按钮 -->
                <el-button size="small" type="success" @click="updateBug">确 定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import Result from '../components/caseResult.vue';
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            // 是否显示bug详情抽屉
            showBug: false,
            // 当前显示的bug信息
            bugInfo: null,
            // 当前bug的处理记录
            bugLogs: null,
            // 是否显示修改bug状态对话框
            updateBugDlg: false,
            // 修改bug状态表单数据
            updateBugForm: {},
            // 当前显示的bug列表
            showBugs: [],
            // 所有的bug列表
            bugs: []
        };
    },
    computed: {
        ...mapState(['pro']),
        // 未处理的bug列表
        bugs1() {
            return this.bugs.filter((item, index, array) => {
                return item.status === '未处理';
            });
        },
        // 处理中bug列表
        bugs2() {
            return this.bugs.filter((item, index, array) => {
                return item.status === '处理中';
            });
        },
        // 处理完的bug列表
        bugs3() {
            return this.bugs.filter((item, index, array) => {
                return item.status === '处理完';
            });
        },
        // 无效的bug列表
        bugs4() {
            return this.bugs.filter((item, index, array) => {
                return item.status === '无效bug';
            });
        }
    },
    components: {
        Result
    },
    methods: {
        // 获取所有的bug
        async getAllBug() {
            const response = await this.$api.getBugs({
                project: this.pro.id
            });
            if (response.status === 200) {
                this.bugs = response.data;
            }
        },
        // 显示bug详情
        showBugInfo(bug) {
            this.bugInfo = bug;
            this.getBugAllLogs(bug.id);
            this.showBug = true;
        },
        // 获取bug历史处理记录
        async getBugAllLogs(id) {
            const response = await this.$api.getBugLogs({ bug: id });
            if (response.status === 200 && response.data.length > 0) {
                this.bugLogs = response.data;
            }
        },
        // 修改bug状态
        async updateBug() {
            const reposne = await this.$api.updateBug(this.updateBugForm.id, this.updateBugForm);
            if (reposne.status === 200) {
                this.$message({
                    type: 'success',
                    message: '修改成功',
                    duration: 1000
                });
                this.getBugAllLogs(this.updateBugForm.id);
                this.updateBugDlg = false;
            }
        },
        // 渲染图表
        showTable() {
            const ele = this.$refs.chart1Box;
            const data = [this.bugs.length, this.bugs3.length, this.bugs2.length, this.bugs1.length, this.bugs4.length];
            const dataLabel = ['bug总数', '处理完', '处理中', '未处理', '无效bug'];
            this.$chart.chart1(ele, data, dataLabel);
            const ele2 = this.$refs.chart2Box;
            this.$chart.chart2(ele2, [
                { value: this.bugs3.length, name: '处理完' },
                { value: this.bugs2.length, name: '处理中' },
                { value: this.bugs1.length, name: '未处理' },
                { value: this.bugs4.length, name: '无效bug' }
            ]);
        },
        // 删除bug
        delBug(id) {
            this.$confirm('此操作将永久删除该bug, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    const reposne = await this.$api.deleteBug(id);
                    if (reposne.status === 204) {
                        this.$message({
                            type: 'success',
                            message: '删除成功',
                            duration: 1000
                        });
                        await this.getAllBug();
                        this.showBugs = this.bugs;
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        }
    },
    updated() {
        this.showTable();
    },
    async created() {
        await this.getAllBug();
        this.showBugs = this.bugs;
        this.showTable();
    }
};
</script>

<style scoped>
.bug_list {
    height: calc(100vh - 290px);
    overflow-y: auto;
    margin-top: 5px;
}

.chartBox {
    height: 200px;
    background: rgba(198, 198, 202, 0.1);
}
</style>
