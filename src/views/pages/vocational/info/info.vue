<template>
    <el-main>
        <div class="add">
            <div>
                <el-button @click="add" type="primary" size="mini">添加报名信息</el-button>
                <el-button
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                    type="danger"
                    size="mini"
                >批量删除</el-button>
            </div>
            <div class="add">
                <el-cascader
                    :options="optionList"
                    :props="treeProps "
                    clearable
                    v-model="province"
                    placeholder="请选择地区"
                    class="mr"
                    size="mini"
                ></el-cascader>
                <el-input class="mr" v-model="entry_point" placeholder="请输入报名点" size="mini"></el-input>
                <el-button
                    type="primary"
                    size="mini"
                    @click="loadInfoList(1,province,entry_point)"
                >搜索</el-button>
            </div>
        </div>
        <el-table border :data="infoList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="entry_point" label="报名点" align="center"></el-table-column>
            <el-table-column label="地区" align="center">
                <template
                    slot-scope="scope"
                >{{scope.row.province}}-{{scope.row.city}}-{{scope.row.district}}</template>
            </el-table-column>
            <el-table-column prop="telephone" label="联系电话" align="center"></el-table-column>
            <el-table-column label="添加时间" align="center">
                <template slot-scope="scope">{{scope.row.addtime|dateFormat}}</template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="primary" size="mini">编辑</el-button>
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
        <!--添加表单弹窗-->
        <el-dialog
            :title="isAdd?'添加报名信息':'编辑报名信息'"
            :visible.sync="dialogVisible"
            center
            :before-close="handleClose"
        >
            <el-form label-position="right" :model="form" size="small" label-width="80px" center>
                <el-form-item label="省份:">
                    <el-cascader
                        :options="optionList"
                        :props="treeProps "
                        clearable
                        v-model="form.province"
                        placeholder="请选择地区"
                        style="width:100%"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="报名点:">
                    <el-input v-model="form.entry_point" placeholder="请输入报名点"></el-input>
                </el-form-item>
                <el-form-item label="具体地址:">
                    <el-input v-model="form.address" placeholder="请输入报名点"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:">
                    <el-input v-model="form.telephone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="handleAdd">保存</el-button>
                <el-button v-else type="primary" @click="handleEdit">编辑</el-button>
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
            province: "", //搜索城市
            entry_point: "", //搜索报名点
            optionList: [], //配置项（专业列表）
            infoList: [], //热门专业列表
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
        this.loadInfoList();
        this.loadOption();
    },
    methods: {
        getCurrentPage(pages) {
            this.loadInfoList(pages, this.province, this.entry_point);
        },
        //加载热门专业列表
        loadInfoList(pages, province, entry_point) {
            this.page = pages;
            if (province) {
                province = province[province.length - 1];
            }
            this.$post("/admin/vocational/index_enroll", {
                page: this.page,
                num: this.offset,
                province: province,
                entry_point: entry_point
            }).then(res => {
                if (res.code === 1) {
                    this.infoList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.infoList = res.list;
                    this.totals = 0;
                }
            });
        },
        //加载地区供添加编辑搜索使用
        loadOption() {
            this.$post("/admin/vocational/condition_enroll").then(res => {
                if (res.code === 1) {
                    this.optionList = res.region;
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
        handleAdd() {
            this.form.province = this.form.province[
                this.form.province.length - 1
            ];
            this.$post("/admin/vocational/add_enroll", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "添加成功",
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.form = {}; //清空表单
                    this.loadInfoList();
                }
            });
        },
        edit(item) {
            this.isAdd = false;
            this.form.id = item.id;
            this.$post("/admin/vocational/getone_enroll", {
                id: item.id
            }).then(res => {
                if (res.code === 1) {
                    this.dialogVisible = true;
                    this.form = res.info;
                }
            });
        },
        handleEdit() {
            this.form.province = this.form.province[
                this.form.province.length - 1
            ];
            this.$post("/admin/vocational/edit_enroll", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "修改成功",
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.form = {}; //清空表单
                    this.loadInfoList();
                }
            });
        },
        //批量删除结合单个删除
        handleDelete(item) {
            if (item.id) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.id);
            }
            this.$confirm("此操作将永久删除该报名信息, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/vocational/delete_enroll", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadInfoList();
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