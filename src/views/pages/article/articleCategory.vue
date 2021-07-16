<template>
    <el-main>
        <el-row class="add">
            <el-col :span="3">
                <el-button @click="add" type="primary" size="mini">添加文章分类</el-button>
            </el-col>
        </el-row>
        <el-table :data="categoryList" size="small" border borderstripe>
            <el-table-column label="分类名称" prop="name" align="center"></el-table-column>
            <el-table-column label="分类排序" align="center">
                <template slot-scope="scope">
                    <el-input
                        class="sort-input"
                        v-model="scope.row.sort"
                        @change="changeSort(scope.row)"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editCategory(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="handleDelete(scope.row)" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加分类对话框 -->
        <el-dialog
            :title="isAdd?'添加分类':'编辑分类'"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
        >
            <el-form ref="form" :model="form" :rules="formrules" label-width="100px" size="small">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入文章分类名称"></el-input>
                </el-form-item>
                <el-form-item label="分类排序" prop="sort">
                    <el-input v-model="form.sort" placeholder="请输入分类排序"></el-input>
                </el-form-item>
                <el-form-item label="分类类别" prop="sort">
                    <el-select v-model="form.type" placeholder="请选择分类类别">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
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
/* eslint-disable*/
export default {
    data() {
        return {
            categoryList: [], // 权限列表
            dialogVisible: false,
            form: {}, //表单
            isAdd: true, //判断表单是添加还是编辑
            formrules: {
                name: [
                    {
                        required: true,
                        message: "文章分类名称不能为空",
                        trigger: "blur"
                    }
                ],
                sort: [
                    {
                        required: true,
                        message: "分类排序不能为空",
                        trigger: "blur"
                    }
                ]
            },
            options: [
                {
                    value: 1,
                    label: "手机端"
                },
                {
                    value: 2,
                    label: "PC端"
                }
            ]
        };
    },

    created() {
        this.getCategoryList();
    },
    methods: {
        //改变input框内的值
        changeSort(item) {
            this.$post("/admin/article/ajaxsort_cate", {
                id: item.id,
                dataSort: "sort",
                sort: item.sort
            }).then(res => {
                if (res.code !== 1) return this.$message.error(res.msg);
                this.$message.success(res.msg);
                this.getCategoryList();
            });
        },
        // 监听添加用户对话框的关闭事件
        handleClose() {
            this.dialogVisible = false;
            this.$refs.form.resetFields();
        },

        // 获取分类数据
        getCategoryList() {
            this.$post("/admin/article/index_cate").then(res => {
                if (res.code !== 1) return this.$message.error(res.msg);
                this.categoryList = res.list;
            });
        },
        //添加分类对话框展示
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        // 确认添加菜单
        handleAdd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$post("/admin/article/add_cate", this.form).then(
                        res => {
                            if (res.code !== 1) {
                                this.$message.error(res.msg);
                            }
                            this.$message.success(res.msg);
                            // 隐藏添加分类的对话框;
                            this.dialogVisible = false;
                            // 重新获取分类列表数据;
                            this.getCategoryList();
                        }
                    );
                }
            });
        },
        // 点击编辑弹框
        editCategory(item) {
            this.$post("/admin/article/getone_cate", { id: item.id }).then(
                res => {
                    if (res.code === 1) {
                        this.form = res.info;
                        this.dialogVisible = true;
                        this.isAdd = false;
                    }
                }
            );
        },
        //提交编辑确定按钮
        handleEdit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$post("/admin/article/edit_cate", this.form).then(
                        res => {
                            if (res.code === 1) {
                                this.$message.success(res.msg);
                                this.dialogVisible = false;
                                this.getCategoryList();
                            }
                        }
                    );
                }
            });
        },
        // 点击删除弹框
        handleDelete(item) {
            this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/article/delete_cate", {
                        id: item.id
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            //删除后重新拉取
                            this.getCategoryList();
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
.add {
    margin-bottom: 20px;
}
.sort-input >>> .el-input__inner {
    text-align: center;
}
</style>
