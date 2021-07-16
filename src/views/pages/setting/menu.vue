<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button type="primary" size="mini" @click="add">添加菜单</el-button>
                <el-button
                    type="danger"
                    size="mini"
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                >批量删除</el-button>
            </div>
        </div>

        <el-table border :data="configList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="菜单名称" align="center" width="120"></el-table-column>
            <el-table-column prop="province" label="适用地区" align="center" width="120"></el-table-column>
            <el-table-column prop="province" label="适用地区" align="center" width="120"></el-table-column>
            <el-table-column label="微信显示" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.wx_show"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                        @change="changeSort(scope.row,scope.row.wx_show,'wx_show')"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="QQ显示" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.qq_show"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                        @change="changeSort(scope.row,scope.row.qq_show,'qq_show')"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="H5显示" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.h5_show"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                        @change="changeSort(scope.row,scope.row.h5_show,'h5_show')"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="排序" align="center" width="80">
                <template slot-scope="scope">
                    <el-input
                        size="mini"
                        v-model="scope.row.sort"
                        @change="changeSort(scope.row,scope.row.sort,'sort')"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
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
                @current-change="getCurrentage"
            ></el-pagination>
        </div>
        <el-dialog
            :title="isAdd?'添加配置':'编辑配置'"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            top="7vh"
        >
            <el-form ref="form" label-width="150px" :model="form" size="mini" :rules="formrules">
                <el-form-item label="适用地区" prop="province">
                    <el-select v-model="form.province" placeholder="请选择">
                        <el-option
                            v-for="item in optionList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单名称">
                    <el-input v-model="form.name" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="微信地址">
                    <el-input v-model="form.wx_url" placeholder="请输入微信地址"></el-input>
                </el-form-item>
                <el-form-item label="QQ地址">
                    <el-input v-model="form.qq_url" placeholder="请输入QQ地址"></el-input>
                </el-form-item>
                <el-form-item label="H5地址">
                    <el-input v-model="form.h5_url" placeholder="请输入H5地址"></el-input>
                </el-form-item>
                <el-form-item label="跳转类型">
                    <el-select v-model="form.type" placeholder="请选择跳转类型">
                        <el-option
                            v-for="item in option"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form.sort" placeholder="请输入菜单排序"></el-input>
                </el-form-item>
                <el-form-item label="是否登陆">
                    <el-radio-group v-model="form.login">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="微信显示">
                    <el-radio-group v-model="form.wx_show">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="QQ显示">
                    <el-radio-group v-model="form.qq_show">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="H5显示">
                    <el-radio-group v-model="form.h5_show">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="LOGO">
                    <el-upload
                        :data="token"
                        :limit="1"
                        action="http://new.schoolpi.net/admin/attach/image_class"
                        list-type="picture-card"
                        :file-list="fileList"
                        :on-exceed="handleExce"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button v-if="isAdd" type="primary" @click="handleAdd">确 定</el-button>
                    <el-button v-else type="primary" @click="handleEdit">确 定</el-button>
                </el-form-item>
            </el-form>
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
            configList: [], //分类招生配置列表
            optionList: [], //搜索条件
            option: [],
            batchDeleteList: [], //批量删除按钮
            dialogVisible: false,
            token: {
                token: window.localStorage.getItem("token")
            },
            form: {
                logo: []
            },
            fileList: [], //
            isAdd: true, //表单的验证
            formrules: {}
        };
    },
    created() {
        this.loadConfigList();
        this.loadOptions();
    },
    methods: {
        loadOptions() {
            this.$post("/admin/column/condition").then(res => {
                if (res.code === 1) {
                    this.optionList = res.province_list; //, //批次搜索
                    this.option = res.type_arr;
                }
            });
        },
        changeSort(item, value, dataSort) {
            this.$post("/admin/column/ajaxsort", {
                id: item.id,
                dataSort: dataSort,
                sort: value
            }).then(res => {
                if (res.code === 1) {       
                }
            });
        },
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            this.loadConfigList(pages);
        },
        //加载配置列表
        loadConfigList(pages) {
            this.page = pages;
            this.$post("/admin/column/index", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.configList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.configList = [];
                    this.totals = 0;
                }
            });
        },
        //删除list列表中的值
        handleRemove(file, fileList) {
            this.form.logo = [];
            this.fileList = fileList;
            fileList.forEach(item => {
                console.log(item);
                if (item.response) {
                    this.form.logo.push(item.response.data.all_path);
                } else {
                    this.form.logo.push(item.url);
                }
            });
        },
        //上传成功
        handleSuccess(res, file, fileList) {
            let obj = new Object();
            obj.url = res.data.all_path;
            this.fileList.push(obj);
            this.form.logo.push(res.data.all_path);
        },
        //超出上传个数
        handleExce() {
            this.$message.error("超出图片上传限定个数!");
        },
        //添加
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        //确认添加
        handleAdd() {
            // this.$refs.form.validate(valid => {
            //     if (valid) {
            // this.form.start_time = this.form.start_time / 1000;
            this.$post("/admin/column/add", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.handleClose();
                    //删除后重新拉取
                    this.loadConfigList();
                }else{
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: "error"
                    });
                }
            });
            //     }
            // });
        },
        edit(item) {
            this.isAdd = false;
            this.$post("/admin/column/getone", { id: item.id }).then(res => {
                if (res.code === 1) {
                    this.form = res.info; //, //批次搜索
                    // this.form.start_time = this.form.start_time * 1000;
                    let obj = new Object();
                    obj.url = res.info.logo;
                    this.fileList.push(obj);
                    this.dialogVisible = true;
                }
            });
        },
        handleEdit() {
            this.$post("/admin/column/edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.handleClose();
                    //删除后重新拉取
                    this.loadConfigList();
                }else{
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: "error"
                    });
                }
            });
        },
        handleClose() {
            this.form = {};
            this.fileList = [];
            this.dialogVisible = false;
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
        handleDelete(item) {
            if (item.id) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.id);
            }
            this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/column/delete", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadConfigList();
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
    justify-content: space-between;
    margin-bottom: 20px;
}
.search-item {
    width: 120px;
    margin-right: 10px;
}
/* .el-input >>> .el-input__inner {
    text-align: center;
} */
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
.ml {
    margin-left: 20px;
    border: 1px #ccc solid;
    padding: 2px 5px;
    border-radius: 3px;
    cursor: pointer;
}
</style>