<template>
    <el-main>
        <el-row class="add">
            <el-col :span="3">
                <el-button @click="add" type="primary" size="mini">添加开设专业</el-button>
            </el-col>
            <el-col :span="3" v-if="batchDeleteList.length>0">
                <el-button @click="handleDelete" type="danger" size="mini">批量删除</el-button>
            </el-col>
        </el-row>
        <el-table border :data="majorList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="school_name" label="学校名称" align="center"></el-table-column>
            <el-table-column prop="name" label="专业名称" align="center"></el-table-column>
            <el-table-column prop="extra_name" label="专业名称(副)" align="center"></el-table-column>
            <el-table-column prop="first" label="一级分类" align="center"></el-table-column>
            <el-table-column prop="second" label="二级分类" align="center"></el-table-column>
            <el-table-column label="操作" width="400" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row)" type="primary" size="mini">编辑</el-button>
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
        <!--添加表单弹窗-->
        <el-dialog :title="isAdd?'添加专业':'编辑专业'" :visible.sync="dialogVisible" width="40%" center>
            <el-form label-position="right" :model="form" label-width="80px" size="mini" center>
                <el-form-item label="专业:">
                    <el-cascader
                        :options="allMajorList"
                        :props="treeProps "
                        clearable
                        v-model="form.cid"
                        placeholder="请选择专业"
                        style="width:100%"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.extra_name" placeholder="请输入专业名称()"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="addForm">保存</el-button>
                <el-button v-else type="primary" @click="editForm">保存</el-button>
            </span>
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
            allMajorList: [], //所有专业列表(三级)
            majorList: [], //专业列表(针对某个学校)
            dialogVisible: false, //添加弹窗
            isAdd: true,
            form: {
                status: 1
            },
            batchDeleteList: [], //批量删除的ID数组
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {
        this.form.sid = this.$route.query.sid;
        this.loadMajorList();
        this.loadOptions();
    },
    methods: {
        //加载开设专业列表
        loadMajorList(pages) {
            if (pages) {
                this.page = pages;
            }
            this.$post("/admin/school/index_college", {
                page: this.page,
                num: this.offset,
                sid: this.form.sid
            }).then(res => {
                if (res.code === 1) {
                    this.majorList = res.list;
                    this.totals = res.all_num;
                }
            });
        },
        getCurrentage(pages) {
            console.log(pages);
            this.loadMajorList(pages);
        },
        //加载搜索配置
        loadOptions() {
            this.$post("/admin/school/condition_special").then(res => {
                if (res.code === 1) {
                    this.allMajorList = res.career_list;
                }
            });
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
            console.log(this.batchDeleteList);
        },
        //添加特色专业
        add() {
            this.dialogVisible = true;
            this.isAdd = true;
        },
        //确认添加
        addForm() {
            this.form.cid = this.form.cid[this.form.cid.length - 1];
            this.$post("/admin/school/add_college", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "添加成功",
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.form = {}; //清空表单
                    this.loadMajorList();
                }
            });
        },
        handleEdit(item) {
            this.$post("/admin/school/getone_college", { id: item.id }).then(
                res => {
                    if (res.code === 1) {
                        this.form = res.info;
                        this.form.sid = this.$route.query.sid;
                        this.dialogVisible = true;
                        this.isAdd = false;
                    }
                }
            );
        },
        editForm() {
            this.$post("/admin/school/edit_college", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "编辑成功",
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.loadMajorList();
                    this.form = {}; //清空表单
                }
            });
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
                    this.$post("/admin/school/delete_college", {
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
        }
    }
};
</script>
<style  scoped>
.pagination {
    margin: 20px 0 0 -10px;
}
.add {
    margin-bottom: 20px;
}
.forbidden {
    color: red;
}
.usual {
    color: blue;
}
</style>