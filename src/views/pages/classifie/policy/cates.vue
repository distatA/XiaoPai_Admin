<template>
    <el-main>
        <el-row class="add">
            <el-col :span="3">
                <el-button @click="add" type="primary" size="mini">添加政策分类</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="cateList"
            size="small"
            border
            borderstripe
            row-key="id"
            :tree-props="{children: 'child',hasChildren:'child.length>=0'}"
        >
            <el-table-column label="菜单名称" prop="name" align="center"></el-table-column>
            <el-table-column label="适用地区" prop="province" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="removeMenu(scope.row)" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加分类对话框 -->
        <el-dialog :title="isAdd?'添加分类':'编辑分类'" :visible.sync="dialogVisible" width="50%">
            <el-form :model="form" label-width="100px" size="small">
                <el-form-item label="分类名称">
                    <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
                </el-form-item>
                <el-form-item label="地区">
                    <el-select v-model="form.province" placeholder="请选择省份">
                        <el-option
                            v-for="item in optionList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父级">
                    <el-select v-model="form.pid" placeholder="请选择父级">
                        <el-option
                            v-for="item in optionCateList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
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
            cateList: [], //分类列表
            dialogVisible: false,
            form: {}, //表单
            isAdd: true, //判断表单是添加还是编辑
            optionList: [],
            optionCateList: []
        };
    },

    created() {
        this.loadOption();
        this.loadCateList();
    },
    methods: {
        // 获取政策分类列表
        loadCateList() {
            this.$post("/admin/classifie/index_policy_cate").then(res => {
                if (res.code !== 1) return this.$message.error(res.msg);
                this.cateList = res.list;
            });
        },
        //获取所有菜单列表
        loadOption() {
            this.$post("/admin/classifie/condition_policy_cate").then(res => {
                if (res.code === 1) {
                    this.optionList = res.region;
                    this.optionCateList = res.cate_list;
                }
            });
        },

        //添加菜单对话框展示
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        // 确认添加菜单
        handleAdd() {
            this.$post("/admin/classifie/add_policy_cate", this.form).then(
                res => {
                    if (res.code !== 1) {
                        this.$message.error(res.msg);
                    }
                    this.$message.success(res.msg);
                    this.form = {};
                    // 隐藏添加用户的对话框;
                    this.dialogVisible = false;
                    // 重新获取菜单列表数据;
                    this.loadCateList();
                    this.loadOption();
                }
            );
        },
        // 点击编辑弹框
        edit(item) {
            this.$post("/admin/classifie/getone_policy_cate", {
                id: item.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                    if (this.form.pid === 0) {
                        this.form.pid = "";
                    }
                    this.dialogVisible = true;
                    this.isAdd = false;
                }
            });
        },
        //提交编辑确定按钮
        handleEdit() {
            this.$post("/admin/classifie/edit_policy_cate", this.form).then(
                res => {
                    if (res.code === 1) {
                        this.form = {};
                        this.$message.success(res.msg);
                        this.dialogVisible = false;
                        this.loadCateList();
                    }
                }
            );
        },
        // 点击删除弹框
        removeMenu(item) {
            console.log(item);
            this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/classifie/delete_policy_cate", {
                        id: item.id
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            //删除后重新拉取
                            this.loadCateList();
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
</style>
