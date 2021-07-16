<template>
    <el-main>
        <el-table
            :data="sectionList"
            size="small"
            border
            borderstripe
            row-key="id"
            :tree-props="{children: 'child',hasChildren:'child.length>=0'}"
        >
            <el-table-column label="栏目名称" prop="name" align="center"></el-table-column>
            <el-table-column label="栏目排序" prop="sort" align="center">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.sort"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="是否在菜单显示" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.is_show"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                        @change="userStateChanged(scope.row)"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-edit"
                        @click="editMenu(scope.row)"
                    >编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加栏目对话框 -->
        <el-dialog title="编辑栏目" :visible.sync="dialogVisible" width="50%">
            <el-form :model="form" label-width="100px" size="small">
                <el-form-item label="栏目名称">
                    <el-input v-model="form.name" placeholder="请输入栏目名称"></el-input>
                </el-form-item>
                <el-form-item label="栏目排序">
                    <el-input v-model="form.sort" placeholder="请输入栏目排序"></el-input>
                </el-form-item>
                <el-form-item label="是否显示" prop="is_show">
                    <el-radio-group v-model="form.is_show">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleEdit" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </el-main>
</template>

<script>
/* eslint-disable*/
export default {
    data() {
        return {
            dialogVisible: false,
            form: {}, //表单
            sectionList: [],
            // 树形控件的属性绑定对象
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {
        this.getSectionList();
        // this.getMenuList();
    },
    methods: {
        //获取所有菜单列表
        getSectionList() {
            this.$post("/admin/optimal/cate", {
                sid: this.$route.query.id
            }).then(res => {
                if (res.code !== 1) return this.$message.error(res.msg);
                this.sectionList = res.list;
            });
        },
        // 监听 switch 开关状态的改变
        userStateChanged(item) {
            this.$post("/admin/optimal/cate_show", {
                id: item.id,
                show: item.is_show
            }).then(res => {
                if (res.code !== 1) return this.$message.error(res.msg);
                this.$message.success(res.msg);
            });
        },
        // 点击编辑弹框
        editMenu(item) {
            this.$post("/admin/optimal/cate_getOne", { id: item.id }).then(
                res => {
                    if (res.code === 1) {
                        this.form = res.info;
                        this.dialogVisible = true;
                    }
                }
            );
        },
        //提交编辑确定按钮
        handleEdit() {
            this.$post("/admin/optimal/cate_edit", this.form).then(res => {
                if (res.code === 1) {
                    this.form = {};
                    this.$message.success(res.msg);
                    this.dialogVisible = false;
                    this.getSectionList();
                }
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
