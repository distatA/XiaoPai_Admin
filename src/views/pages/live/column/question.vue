<template>
    <el-main>
        <div class="mt">
            <el-button type="primary" size="mini" @click="add">添加问题</el-button>
        </div>
        <el-table border :data="policyList">
            <el-table-column prop="id" label="ID"></el-table-column>

            <el-table-column prop="user_nickname" label="用户昵称" align="center"></el-table-column>
            <el-table-column prop="question" label="问题内容" align="center"></el-table-column>
            <el-table-column prop="status" label="回答状态" align="center"></el-table-column>
            <el-table-column prop="number" label="想问人数" align="center"></el-table-column>
            <el-table-column prop="diamond_type" label="使用道具" align="center"></el-table-column>

            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="primary" size="mini">编辑</el-button>
                    <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :title="isAdd?'添加栏目':'编辑栏目'"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
        >
            <el-form :model="form" label-width="100px" size="small">
                <el-form-item label="提问者ID">
                    <el-input v-model="form.user_id" placeholder="请输入提问者ID"></el-input>
                </el-form-item>
                <el-form-item label="问题内容">
                    <el-input v-model="form.question" placeholder="请输入问题内容"></el-input>
                </el-form-item>
                <el-form-item label="回答状态 ">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="0">未回答</el-radio>
                        <el-radio :label="1">回答中</el-radio>
                        <el-radio :label="2">已回答</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="想问人数">
                    <el-input v-model="form.number" placeholder="请输入想问人数"></el-input>
                </el-form-item>

                <el-form-item label="想问人数">
                    <el-radio-group v-model="form.diamond_type">
                        <el-radio :label="1">道具一</el-radio>
                        <el-radio :label="2">道具二</el-radio>
                        <el-radio :label="3">道具三</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose" size="small">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="handleAdd" size="small">确 定</el-button>
                <el-button v-else type="primary" @click="handleEdit" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </el-main>
</template>
<script>
/*eslint-disable*/

import upload from "@/components/upload";
export default {
    components: {
        upload
    },
    data() {
        return {
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            policyList: [],
            optionsList: [],
            form: { image: [] },
            isAdd: true,
            dialogVisible: false,
            thumbList: [],
            token: {
                token: window.localStorage.getItem("token")
            }
        };
    },
    created() {
        this.loadPolicyList();
        this.loadOption();
    },
    methods: {
        loadOption() {
            //condition_column
            this.$post("/admin/live/condition_column").then(res => {
                if (res.code === 1) {
                    this.optionsList = res.column_type;
                }
            });
        },
        //加载政策列表
        loadPolicyList(pages) {
            this.page = pages;
            this.$post("/admin/live/index_question", {
                page: this.page,
                num: this.offset,
                room_id: this.$route.query.room_id
            }).then(res => {
                if (res.code === 1) {
                    this.policyList = res.list;
                    console.log(this.policyList);
                } else {
                    this.policyList = [];
                    this.totals = 0;
                }
            });
        }, //ajaxsort_column
        changeSort(id, value, dateSort) {
            console.log(value, dateSort);
            this.$post("/admin/live/ajaxsort_column", {
                id: id,
                dataSort: dateSort,
                sort: value
            }).then(res => {});
        },
        handleClose() {
            this.dialogVisible = false;
            this.form = {};
            this.thumbList = [];
        },
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        handleAdd() {
            this.form.room_id = this.$route.query.room_id;
            this.$post("/admin/live/add_question", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.handleClose();
                    this.dialogVisible = false;
                    this.loadPolicyList(1);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleRemoveThumb(file, fileList) {
            var path = file.url;
            this.thumbList = [];
            this.form.image.splice(
                this.form.image.findIndex(item => item === path),
                1
            );
        },
        handleSuccessThumb(res, file, fileList) {
            let obj = new Object();
            obj.url = res.data.all_path;
            this.thumbList.push(obj);
            this.form.image.push(res.data.all_path);
        },
        //超出上传个数
        handleExce() {
            this.$message.error("超出图片上传限定个数!");
        },
        edit(item) {
            this.$post("/admin/live/getone_question", {
                id: item.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;

                    this.isAdd = false;
                    this.dialogVisible = true;
                }
            });
        },
        handleEdit() {
            this.form.room_id = this.$route.query.room_id;
            this.$post("/admin/live/edit_question", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.handleClose();
                    this.loadPolicyList(1);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleDelete(item) {
            this.$confirm("此操作将永久删除该问题, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/live/delete_question", {
                        id: item.id
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            //删除后重新拉取
                            this.loadPolicyList(1);
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        }
    }
};
</script>
<style scoped>
.flex {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
.mt {
    margin-bottom: 10px;
}
.table {
    margin: 0 20px;
}
/* .el-input >>> .el-input__inner {
    text-align: center;
} */
.pagination {
    margin: 20px 0 0 -10px;
}
.logo {
    width: 60px;
    height: 60px;
    margin: 0 auto;
}
.logo img {
    width: 100%;
    height: 100%;
}
</style>