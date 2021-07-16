<template>
    <el-main>
        <div class="flex">
            <el-button type="primary" size="small" @click="add">添加院校类型</el-button>
            <el-button
                size="small"
                type="danger"
                @click="handleDelete"
                v-if="batchDeleteList.length>0"
            >批量删除</el-button>
        </div>

        <el-table border :data="schoolCategoryList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="type" label="类型" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click.native="edit(scope.row)" type="primary" size="mini">编辑</el-button>
                    <el-button @click.native="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totals"
                :page-size="offset"
                @current-change="loadSchoolCategoryList"
            ></el-pagination>
        </div>
        <el-dialog
            :title="isAdd?'添加类型':'编辑类型'"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
            <el-form
                ref="form"
                :model="form"
                label-position="right"
                size="small"
                :rules="rulesForm"
                label-width="80px"
            >
                <el-form-item label="类型名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入院校类型名称"></el-input>
                </el-form-item>
                <el-form-item label="标签类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择院校标签类型" style="width:100%;">
                        <el-option
                            v-for="item in typeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="handleAdd">确 定</el-button>
                <el-button v-else type="primary" @click="handleEdit">确 定</el-button>
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
            schoolCategoryList: [],
            typeList: [],
            dialogVisible: false,
            form: {},
            isAdd: true,
            rulesForm: {
                name: [
                    {
                        required: true,
                        message: "院校类型名称不能为空",
                        trigger: "blur"
                    }
                ],
                type: [
                    {
                        required: true,
                        message: "标签类型不能为空",
                        trigger: "blur"
                    }
                ]
            },
            batchDeleteList: []
        };
    },
    created() {
        this.loadSchoolCategoryList();
        this.loadOptions();
    },
    methods: {
        loadOptions() {
            this.$post("/admin/school/condition_type").then(res => {
                if (res.code === 1) {
                    this.typeList = res.school_type;
                }
            });
        },
        //加载文章列表
        loadSchoolCategoryList(pages) {
            this.page = pages;
            this.$post("/admin/school/index_type", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.schoolCategoryList = res.list;
                    this.totals = res.all_num;
                }
            });
        },
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        //添加
        handleAdd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$post("/admin/school/add_type", this.form).then(
                        res => {
                            if (res.code === 1) {
                                this.$message.success(res.msg);
                                // 隐藏添加类型的对话框;
                                this.dialogVisible = false;
                                // 重新获取院校类型列表数据;
                                this.loadSchoolCategoryList();
                            }
                        }
                    );
                } else {
                    return false;
                }
            });
        },
        edit(item) {
            this.$post("/admin/school/getone_type", { id: item.id }).then(
                res => {
                    if (res.code === 1) {
                        this.form = res.info;
                        this.dialogVisible = true;
                        this.isAdd = false;
                    }
                }
            );
        },
        //编辑
        handleEdit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$post("/admin/school/edit_type", this.form).then(
                        res => {
                            if (res.code === 1) {
                                this.$message.success(res.msg);
                                // 隐藏添加类型的对话框;
                                this.dialogVisible = false;
                                // 重新获取院校类型列表数据;
                                this.loadSchoolCategoryList();
                            }
                        }
                    );
                } else {
                    return false;
                }
            });
        },
        handleClose() {
            this.$refs.form.resetFields();
            this.dialogVisible = false;
            this.form = {};
        },
        //点击多选
        handleSelect(val) {
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
        handleDelete(item) {
            if (item.id) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.id);
            }
            this.$confirm("此操作将永久删除该篇类型, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/school/delete_type", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadSchoolCategoryList();
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
    margin-bottom: 20px;
}
.pagination {
    margin: 20px 0 0 -10px;
}
.thumb {
    width: 300px;
    height: 200px;
}
.thumb img {
    width: 100%;
    height: 100%;
}
</style>