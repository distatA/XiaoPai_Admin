<template>
    <el-main>
        <div class="role-form">
            <div class="role-list">
                <h2 class="title">用户权限</h2>
                <div class="tree">
                    <el-tree
                        ref="treeData"
                        :data="menuList"
                        default-expand-all
                        :default-checked-keys="checkedRole"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps"
                        :render-content="renderContent"
                        @check-change="handleSelect"
                    ></el-tree>
                </div>
            </div>
            <div class="form">
                <h2 class="title">用户信息</h2>
                <div>
                    <el-form
                        ref="form"
                        label-position="left"
                        label-width="80px"
                        :model="form"
                        :rules="formrules"
                    >
                        <el-form-item label="直属上级">
                            <el-select v-model="form.pid" placeholder="请选择直属上级">
                                <el-option
                                    v-for="item in roleList"
                                    :key="item.role_id"
                                    :label="item.role_name"
                                    :value="item.role_id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="角色名称" prop="role_name">
                            <el-input v-model="form.role_name" size="small" placeholder="请输入角色名称"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" prop="role_desc">
                            <el-input v-model="form.role_desc" size="small" placeholder="请输入角色描述"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                v-if="isAdd"
                                type="primary"
                                size="small"
                                @click="handleAdd"
                            >添加</el-button>
                            <el-button v-else type="primary" size="small" @click="handleEdit">添加</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </el-main>
</template>
<script>
/* eslint-disable*/
export default {
    data() {
        return {
            form: {},
            checkedRole: [], //默认选中的树状
            menuList: [], //菜单权限列表
            roleList: [], //直属上级列表
            defaultProps: {
                children: "child",
                label: "name"
            },
            // 树形控件的属性绑定对象
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            },
            //添加表单的验证
            formrules: {
                role_name: [
                    {
                        required: true,
                        message: "角色名称不能为空",
                        trigger: "blur"
                    }
                ],
                role_desc: [
                    {
                        required: true,
                        message: "角色描述不能为空",
                        trigger: "blur"
                    }
                ]
            },
            isAdd: true //判断表单是添加还是编辑
        };
    },
    created() {
        this.loadMenuList();
        var role_id = this.$route.query.role_id;
        if (role_id) {
            this.isAdd = false;
            this.form.role_id = role_id;
            this.loadDetail();
        }
        this.loadRole();
    },
    methods: {
        //加载角色列表供直属上级
        loadRole() {
            this.$post("/admin/role/get_rolelist").then(res => {
                if (res.code === 1) {
                    this.roleList = res.list;
                }
            });
        },
        //加载角色详情
        loadDetail() {
            if (this.form.role_id) {
                this.$post("/admin/role/getone", {
                    role_id: this.form.role_id
                }).then(res => {
                    if (res.code === 1) {
                        this.form = res.info;
                        console.log(res);
                        if (this.form.pid === 0) {
                            this.form.pid = null;
                        }
                        this.checkedRole = res.info.act_list;
                    }
                });
            }
        },
        //添加
        handleAdd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$post("/admin/role/add", this.form).then(res => {
                        if (res.code === 1) {
                            this.$message.success(res.msg);
                            this.$router.push("/role/role");
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        //编辑
        handleEdit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$post("/admin/role/edit", this.form).then(res => {
                        if (res.code === 1) {
                            this.$message.success(res.msg);
                            this.$router.push("/role/role");
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        //加载全部的菜单数据
        loadMenuList() {
            this.$post("/admin/role/menu_list").then(res => {
                if (res.code === 1) {
                    this.menuList = res.list;
                }
            });
        },
        //
        handleSelect(val) {
            this.form.act_list = [...this.$refs.treeData.getCheckedKeys()];
        },
        //渲染带icon的分列树
        renderContent(h, { node, data }) {
            if (data.icon) {
                return (
                    <span>
                        <i class={data.icon}></i>
                        <span> {node.label}</span>
                    </span>
                );
            } else {
                return (
                    <span>
                        <span> {node.label}</span>
                    </span>
                );
            }
        }
    }
};
</script>
<style  scoped>
.title {
    font-weight: 500;
    color: #383838;
    margin: 20px 0 20px 0;
}
.role-form {
    display: flex;
}
.tree {
    border: solid 1px #ddd;
    height: 78vh;
    box-sizing: border-box;
    padding: 20px;
    overflow: hidden;
    overflow-y: auto;
}
.role-list {
    width: 350px;
}
.form {
    flex: 1;
    max-width: 850px;
    padding-left: 20px;
}
</style>