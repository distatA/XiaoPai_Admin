<template>
    <el-main>
        <div class="flex">
            <div>
                <!-- <el-button type="primary" size="mini" @click="add">添加学校分数</el-button> -->
            </div>
            <div class="flex">
                <el-input v-model="nickname" size="mini" placeholder="请输入用户昵称"></el-input>
                <el-button
                    style="margin-left:10px;"
                    type="primary"
                    size="mini"
                    @click="loadPolicyList(1)"
                >搜索</el-button>
            </div>
        </div>
        <el-table border :data="policyList">
            <el-table-column prop="nickname" label="昵称" align="center" width="200"></el-table-column>
            <el-table-column prop="year" label="用户状态" align="center">
                <template slot-scope="scope">
                    <div class v-if="scope.row.is_online === 1">在线</div>
                    <div class v-else>离线</div>
                </template>
            </el-table-column>

            <el-table-column prop="year" label="发言状态" align="center">
                <template slot-scope="scope">
                    <div class v-if="scope.row.status === 1">正常</div>
                    <div class v-else>禁言</div>
                </template>
            </el-table-column>
            <el-table-column label="禁言" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        active-color="#13ce66"
                        :active-value="0"
                        :inactive-value="1"
                        @change="forbidden(scope.row)"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button @click="kickout(scope.row)" type="primary" size="mini">踢人</el-button>
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
            nickname: ""
        };
    },
    created() {
        this.loadPolicyList();
        this.loadOption();
    },
    methods: {
        loadOption() {
            this.$post("/admin/live/condition_school_college_score").then(
                res => {
                    if (res.code === 1) {
                        this.typeList = res.region;
                        // this.majorList = res.career_list;
                    }
                }
            );
        },
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            this.loadPolicyList(pages);
        },
        //加载政策列表
        loadPolicyList(pages) {
            this.page = pages;
            this.$post("/admin/live/index_user", {
                room_id: this.$route.query.room_id,
                nickname: this.nickname,
                page: this.pages,
                num: this.offset
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
            this.form.cid = this.$route.query.cid;
            this.$post("/admin/live/add_school_college_score", this.form).then(
                res => {
                    if (res.code === 1) {
                        this.$message({
                            message: res.msg,
                            type: "success"
                        });
                        this.handleClose();
                        this.loadPolicyList(1);
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            );
        },
        edit(item) {
            this.$post("/admin/live/getone_school_college_score", {
                id: item.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                    this.isAdd = false;
                    this.dialogVisible = true;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleEdit() {
            this.$post("/admin/live/edit_school_college_score", this.form).then(
                res => {
                    if (res.code === 1) {
                        this.$message({
                            message: res.msg,
                            type: "success"
                        });
                        this.handleClose();
                        this.loadPolicyList(1);
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            );
        },
        handleDelete(item) {
            this.$confirm("此操作将永久删除该分数, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/live/delete_school_college_score", {
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
        },
        forbidden(item) {
            this.$post("/admin/live/forbidden_user", {
                room_id: this.$route.query.room_id,
                user_id: item.user_id
            }).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                }
            });
        },
        kickout(item) {
            this.$post("/admin/live/kickout_user", {
                room_id: this.$route.query.room_id,
                user_id: item.user_id
            }).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });

                    this.loadPolicyList(1);
                }
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