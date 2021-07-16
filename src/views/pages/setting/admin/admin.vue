<template>
    <el-main>
        <el-row class="add">
            <el-col :span="3">
                <el-button @click="add" type="primary" size="mini">添加系统用户</el-button>
            </el-col>
            <el-col :span="3" v-if="batchDeleteList.length>0">
                <el-button @click="handleDelete" type="danger" size="mini">批量删除</el-button>
            </el-col>
        </el-row>
        <el-table border :data="adminList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
            <el-table-column prop="uname" label="账号" align="center"></el-table-column>
            <el-table-column prop="rolename" label="角色" align="center"></el-table-column>
            <el-table-column prop="login_times" label="登录次数" align="center"></el-table-column>
            <el-table-column prop="login_ip" label="登录IP" align="center"></el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">{{scope.row.add_time|dateFormat}}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    <div class="usual" v-if="scope.row.status === 1">正常</div>
                    <div class="forbidden" v-else>禁止</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="400" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleData(scope.row)" size="mini">日志</el-button>
                    <el-button @click="clearData(scope.row)" type="danger" size="mini">清空日志</el-button>
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
                @current-change="loadList"
            ></el-pagination>
        </div>
        <!--添加表单弹窗-->
        <el-dialog
            :title="isAdd?'添加用户':'编辑用户'"
            :visible.sync="dialogVisible"
            width="40%"
            center
            :before-close="handleClose"
        >
            <el-form label-position="right" :model="form" label-width="80px" center>
                <el-form-item label="昵称:">
                    <el-input v-model="form.nickname" placeholder="请输入用户昵称" size="small"></el-input>
                </el-form-item>
                <el-form-item label="账号:">
                    <el-input v-model="form.uname" placeholder="请输入账号名称" size="small"></el-input>
                </el-form-item>
                <el-form-item label="角色:">
                    <el-select v-model="form.roleid" placeholder="请选择角色" size="small">
                        <el-option
                            v-for="item in roleList"
                            :key="item.role_id"
                            :label="item.role_name"
                            :value="item.role_id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否禁用:">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="0">是</el-radio>
                        <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="密码:">
                    <el-input
                        v-model="form.upwd"
                        type="password"
                        placeholder="请输入账号密码"
                        size="small"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="addForm">保存</el-button>
                <el-button v-else type="primary" @click="editForm">编辑</el-button>
            </span>
        </el-dialog>
        <!-- 日志 -->
        <el-drawer title="用户日志" :visible.sync="tableDrawr" direction="rtl" size="60%">
            <el-table :data="dataList">
                <el-table-column property="log_id" label="ID" align="center"></el-table-column>
                <el-table-column property="admin_name" label="系统用户" align="center"></el-table-column>
                <el-table-column property="log_ip" label="操作IP" align="center"></el-table-column>
                <el-table-column label="操作时间" align="center">
                    <template slot-scope="scope">{{scope.row.log_time|dateFormat}}</template>
                </el-table-column>
                <el-table-column property="log_info" label="备注" align="center"></el-table-column>
            </el-table>
        </el-drawer>
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
            roleList: [], //角色列表
            adminList: [], //用户列表
            dialogVisible: false, //添加弹窗
            form: {
                status: 1
            },
            isAdd: true, //判断表单是添加还是编辑
            dataList: [], //用户日志
            tableDrawr: false,
            batchDeleteList: [] //批量删除的ID数组
        };
    },
    created() {
        this.loadList();
        this.loadRoleList();
    },
    methods: {
        //加载列表
        loadList(pages) {
            this.page = pages;
            this.$post("/admin/admin/index", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.adminList = res.list;
                }
            });
        },
        //加载角色列表
        loadRoleList() {
            this.$post("/admin/admin/roleList").then(res => {
                if (res.code === 1) {
                    this.roleList = res.roleList;
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
        //加载用户日志
        handleData(item) {
            this.tableDrawr = true;
            this.$post("/admin/admin/log", { id: item.id }).then(res => {
                if (res.code === 1) {
                    this.dataList = res.list;
                }
            });
        },
        //清空日志
        clearData(item) {
            this.$confirm("此操作将永久清空所有用户的日志, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/admin/log_clear", { id: item.id }).then(
                        res => {
                            if (res.code === 1) {
                                this.$message({
                                    message: res.msg,
                                    type: "success"
                                });
                                //删除后重新拉取
                                this.loadList();
                            }
                        }
                    );
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        //添加角色
        add() {
            this.dialogVisible = true;
            this.isAdd = true;
        },
        //确认添加
        addForm() {
            this.$post("/admin/admin/add", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "添加成功",
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.form = {}; //清空表单
                    this.loadList();
                }
            });
        },
        handleEdit(item) {
            this.isAdd = false;
            this.form.id = item.id;
            this.$post("/admin/admin/getone", { id: item.id }).then(res => {
                if (res.code === 1) {
                    this.dialogVisible = true;
                    this.form = res.info; //清空表单
                    this.form.upwd = "";
                }
            });
        },
        editForm() {
            this.$post("/admin/admin/edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "修改成功",
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.form = {}; //清空表单
                    this.loadList();
                }
            });
        },
        //批量删除结合单个删除
        handleDelete(item) {
            if (item.id) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.id);
            }
            this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/admin/delete", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadList();
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
            this.dialogVisible = false;
            this.form = {};
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