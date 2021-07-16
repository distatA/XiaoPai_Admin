<template>
    <el-main>
        <div class="add">
            <div>
                <el-button type="primary" size="mini" @click="add">添加专业</el-button>
                <el-button
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                    type="danger"
                    size="mini"
                >批量删除</el-button>
            </div>
        </div>
        <el-table border :data="majorList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="专业名称" align="center"></el-table-column>
            <el-table-column prop="first" label="一级专业" align="center"></el-table-column>
            <el-table-column prop="second" label="二级专业" align="center"></el-table-column>
            <el-table-column label="操作" width="200" align="center">
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
                @current-change="getCurrentPage"
            ></el-pagination>
        </div>
        <el-dialog title="添加专业" :visible.sync="dialogVisible" width="30%" center>
            <el-form
                class="form"
                label-position="right"
                :model="form"
                label-width="120px"
                size="mini"
            >
                <el-form-item label="专业:">
                    <el-cascader
                        :options="optionList"
                        :props="treeProps "
                        clearable
                        v-model="form.cid"
                        placeholder="请选择专业"
                    ></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAdd">确 定</el-button>
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
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            optionList: [], //配置项（专业列表）
            majorList: [], //学校相关专业列表
            batchDeleteList: [], //批量删除的ID数组
            dialogVisible: false,
            form: {},
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {
        this.loadMajorList();
        this.loadOption();
    },
    methods: {
        getCurrentPage(pages) {
            this.loadMajorList(pages);
        },
        //加载学校相关专业列表
        loadMajorList(pages) {
            this.page = pages;
            this.$post("/admin/vocational/index_school_career", {
                page: this.page,
                num: this.offset,
                sid: this.$route.query.sid
            }).then(res => {
                if (res.code === 1) {
                    this.majorList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.majorList = res.list;
                    this.totals = 0;
                }
            });
        },
        //加载地区供添加编辑搜索使用
        loadOption() {
            this.$post("/admin/vocational/condition_school_career").then(
                res => {
                    if (res.code === 1) {
                        this.optionList = res.list;
                    }
                }
            );
        },
        add() {
            this.dialogVisible = true;
        },
        handleAdd() {
            this.form.cid = this.form.cid[this.form.cid.length - 1];
            this.form.sid = this.$route.query.sid;
            this.$post("/admin/vocational/add_school_career", this.form).then(
                res => {
                    if (res.code === 1) {
                        this.loadMajorList();
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            );
        },
        //点击多选
        handleSelect(val) {
            //处理数组，将id遍历出来
            if (val.length === 0) {
                this.batchDeleteList = [];
            } else {
                //处理数组，将id遍历出来
                var arr = [];
                val.forEach(item => {
                    arr.push(item.id);
                    this.batchDeleteList = [...arr];
                });
            }
        },

        //批量删除结合单个删除
        handleDelete(item) {
            if (item.id) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.id);
            }
            this.$confirm("此操作将永久删除该专业, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/vocational/delete_school_career", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadMajorList();
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
        handleClose() {
            this.form = {};
            this.imageFileList = [];
            this.dialogVisible = false;
        }
    }
};
</script>
<style  scoped>
.pagination {
    margin: 20px 0 0 -10px;
}
.mt {
    margin-top: 7px;
}
.mr {
    margin-right: 10px;
}
.add {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
}
.forbidden {
    color: red;
}
.usual {
    color: blue;
}
</style>