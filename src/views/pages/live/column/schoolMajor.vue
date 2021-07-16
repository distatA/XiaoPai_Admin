<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button type="primary" size="mini" @click="add">添加学校专业</el-button>
            </div>
        </div>
        <el-table border :data="policyList">
            <el-table-column prop="first" label="一级专业" align="center"></el-table-column>
            <el-table-column prop="second" label="二级专业" align="center"></el-table-column>
            <el-table-column prop="name" label="三级专业" align="center"></el-table-column>
            <el-table-column prop="type" label="类型" align="center"></el-table-column>
            <el-table-column prop="school_name" label="学校名称" align="center"></el-table-column>
            <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
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
        <el-dialog
            title="添加专业"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
        >
            <el-form :model="form" label-width="100px" size="small">
                <el-form-item label="专业类别">
                    <el-select v-model="form.type" multiple placeholder="请选择专业类别">
                        <el-option
                            v-for="item in typeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="专业">
                    <el-select v-model="form.cid" filterable placeholder="请选择">
                        <el-option
                            v-for="item in majorList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose" size="small">取 消</el-button>
                <el-button type="primary" @click="handleAdd" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </el-main>
</template>
<script>
/*eslint-disable*/
export default {
    data() {
        return {
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            policyList: [],
            dialogVisible: false,
            isAdd: false,
            form: {},
            typeList: [],
            majorList: []
        };
    },
    created() {
        this.loadPolicyList();
        this.loadOption();
    },
    methods: {
        loadOption() {
            this.$post("/admin/live/condition_school_career").then(res => {
                if (res.code === 1) {
                    this.typeList = res.career_type;
                    this.majorList = res.career_list;
                }
            });
        },
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            this.loadPolicyList(pages);
        },
        //加载政策列表
        loadPolicyList(pages) {
            this.page = pages;
            this.$post("/admin/live/index_school_career", {
                sid: this.$route.query.sid,
                type: this.$route.query.type,
                num: this.offset,
                page:this.page
            }).then(res => {
                if (res.code === 1) {
                    this.policyList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.policyList = [];
                    this.totals = 0;
                }
            });
        },
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        handleClose() {
            this.dialogVisible = false;
            this.form = {};
        },
        handleAdd() {
            console.log(this.form);
            this.form.sid = this.$route.query.sid;
            this.$post("/admin/live/add_school_career", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.loadPolicyList(1);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleDelete(item) {
            this.$confirm("此操作将永久删除该专业, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/live/delete_school_career", {
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
.table {
    margin: 0 20px;
}
/* .el-input >>> .el-input__inner {
    text-align: center;
} */
.pagination {
    margin: 20px 0 0 -10px;
}
</style>