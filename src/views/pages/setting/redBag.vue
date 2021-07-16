<template>
    <el-main>
        <el-row class="add">
            <el-col :span="3">
                <el-button @click="add" type="primary" size="mini">添加红包弹窗</el-button>
            </el-col>
            <el-col :span="3">
                <el-button @click="user" type="primary" size="mini">参与用户</el-button>
            </el-col>
        </el-row>
        <el-table :data="rightsList" border borderstripe>
            <el-table-column label="弹窗日期" prop="pop_date" align="center"></el-table-column>
            <el-table-column label="开始时间" prop="start_time" align="center"></el-table-column>
            <el-table-column label="结束时间" prop="end_time" align="center"></el-table-column>
            <el-table-column label="最小金额" prop="min_amount" align="center"></el-table-column>
            <el-table-column label="最大金额" prop="max_amount" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editMenu(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="removeMenu(scope.row)" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totals"
                :page-size="offset"
                @current-change="getCurrentage"
            ></el-pagination>
        </div>
        <!-- 添加菜单对话框 -->
        <el-dialog
            :title="isAdd?'添加红包':'编辑红包'"
            :visible.sync="dialogVisible"
            center
            :before-close="handleClose"
        >
            <el-form :model="form" label-width="100px" size="small">
                <el-form-item label="开始时间:">
                    <el-date-picker
                        v-model="form.start_time"
                        type="datetime"
                        placeholder="选择开始时间"
                        value-format="timestamp"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间:">
                    <el-date-picker
                        v-model="form.end_time"
                        type="datetime"
                        placeholder="选择开始时间"
                        value-format="timestamp"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="最小金额:">
                    <el-input v-model="form.min_amount" type="number" placeholder="请输入最小金额(分)"></el-input>
                </el-form-item>
                <el-form-item label="最大金额:">
                    <el-input v-model="form.max_amount" type="number" placeholder="请输入最大金额(分)"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleClose" size="small">取 消</el-button>
                    <el-button v-if="isAdd" type="primary" @click="handleAdd" size="small">确 定</el-button>
                    <el-button v-else type="primary" @click="handleEdit" size="small">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-main>
</template>

<script>
/* eslint-disable*/
export default {
    data() {
        return {
            // 权限列表
            rightsList: [],
            dialogVisible: false,
            form: {}, //表单
            isAdd: true, //判断表单是添加还是编辑
            offset: 15,
            totals: 0
        };
    },

    methods: {
        user() {
            this.$router.push("/setting/participator");
        },
        getCurrentage(pages) {
            console.log(pages);
        },

        // 获取数据
        getList() {
            this.$post("/admin/popup/index").then(res => {
                if (res.code !== 1) return this.$message.error(res.msg);
                this.rightsList = res.list;
                this.totals = res.all_num;
            });
        },
        //添加菜单对话框展示
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        // 确认添加菜单
        handleAdd() {
            console.log(this.form);
            this.form.start_time = this.form.start_time / 1000;
            this.form.end_time = this.form.end_time / 1000;
            this.$post("/admin/popup/add", this.form).then(res => {
                if (res.code === 1) {
                    this.$message.success(res.msg);
                } else {
                    this.$message.error(res.msg);
                }
                this.form = {};
                // 隐藏添加用户的对话框;
                this.dialogVisible = false;
                // 重新获取菜单列表数据;
                this.getList();
            });
        },
        // 点击编辑弹框
        editMenu(item) {
            this.$post("/admin/popup/getone", { id: item.id }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                    this.form.start_time = this.form.start_time * 1000;
                    this.form.end_time = this.form.end_time * 1000;
                    this.dialogVisible = true;
                    this.isAdd = false;
                }
            });
        },
        //提交编辑确定按钮
        handleEdit() {
            this.form.start_time = this.form.start_time / 1000;
            this.form.end_time = this.form.end_time / 1000;
            this.$post("/admin/popup/edit", this.form).then(res => {
                if (res.code === 1) {
                    this.form = {};
                    this.$message.success(res.msg);
                    this.dialogVisible = false;
                    this.getList();
                }
            });
        },
        handleClose() {
            this.form = {};
            this.dialogVisible = false;
        },
        // 点击删除弹框
        removeMenu(item) {
            console.log(item);
            this.$confirm("此操作将永久删除该红包, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/popup/delete", { id: item.id }).then(
                        res => {
                            if (res.code === 1) {
                                this.$message({
                                    message: res.msg,
                                    type: "success"
                                });
                                //删除后重新拉取
                                this.getList();
                            }
                        }
                    );
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        }
    },

    created() {
        this.getList();
    }
};
</script>

<style scoped>
.add {
    margin-bottom: 20px;
}
.pagination {
    margin: 20px 0 0 -10px;
}
</style>
