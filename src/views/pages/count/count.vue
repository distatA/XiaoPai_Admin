<template>
    <el-main>
        <el-row class="add">
            <el-button @click="add" type="primary" size="mini">添加统计管理用户</el-button>
            <el-button
                v-if="batchDeleteList.length>0"
                @click="handleDelete"
                type="danger"
                size="mini"
            >批量删除</el-button>
        </el-row>
        <el-table border :data="userList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="用户" align="center"></el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>

            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">{{scope.row.logintime|dateFormat}}</template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
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
                @current-change="loadUserList"
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
            <el-form label-position="right" :model="form" size="small" label-width="80px" center>
                <el-form-item label="地区:" v-if="isAdd">
                    <el-cascader
                        :options="optionList"
                        :props="treeProps "
                        clearable
                        v-model="city"
                        placeholder="请选择地区"
                        @change="loadSchoolList"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="学校:" v-if="isAdd">
                    <el-select v-model="form.sid" clearable placeholder="请选择学校">
                        <el-option
                            v-for="item in schoolList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="用户名称:">
                    <el-input v-model="form.name" clearable placeholder="请输入用户名称"></el-input>
                </el-form-item>
                <el-form-item label="手机号:">
                    <el-input v-model="form.mobile" clearable placeholder="请输入手机号"></el-input>
                </el-form-item>

                <el-form-item label="密码:">
                    <el-input v-model="form.pwd" type="password" clearable placeholder="请输入账号密码"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="addForm">保存</el-button>
                <el-button v-else type="primary" @click="editForm">编辑</el-button>
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
            optionList: [],
            schoolList: [],
            city: "",
            userList: [], //统计平台用户列表
            dialogVisible: false, //添加弹窗
            form: {},
            isAdd: true, //判断表单是添加还是编辑
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
        this.loadUserList();
        this.loadOption();
    },
    methods: {
        loadOption() {
            this.$post("/admin/statistics/condition").then(res => {
                if (res.code === 1) {
                    this.optionList = res.region;
                }
            });
        },
        loadSchoolList() {
            console.log(typeof this.city);
            if (typeof this.city === "object") {
                this.city = this.city[this.city.length - 1];
            } else {
                this.city = "";
            }
            this.$post("/admin/statistics/condition", {
                city: this.city
            }).then(res => {
                if (res.code === 1) {
                    // this.region = res.region; //地区搜索
                    this.schoolList = res.school_list;
                }
            });
        },
        //加载统计平台用户列表
        loadUserList(pages) {
            this.page = pages;
            this.$post("/admin/statistics/index", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.userList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.userList = res.list;
                    this.totals = 0;
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
        //添加角色
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        //确认添加
        addForm() {
            this.$post("/admin/statistics/add", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "添加成功",
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.form = {}; //清空表单
                    this.loadUserList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleEdit(item) {
            this.isAdd = false;
            this.form.id = item.id;
            this.$post("/admin/statistics/getone", { id: item.id }).then(
                res => {
                    if (res.code === 1) {
                        this.dialogVisible = true;
                        this.form = res.info; //清空表单
                    }
                }
            );
        },
        editForm() {
            this.$post("/admin/statistics/edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "修改成功",
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.form = {}; //清空表单
                    this.loadUserList();
                } else {
                    this.$message.error(res.msg);
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
                    this.$post("/admin/statistics/delete", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadUserList();
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
.head-img {
    width: 100px;
    height: 100px;
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