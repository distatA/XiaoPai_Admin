<template>
    <el-main>
        <div class="mt">
            <el-button type="primary" size="mini" @click="add">添加栏目</el-button>
        </div>
        <el-table border :data="policyList">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column label="栏目LOGO" align="center">
                <template slot-scope="scope">
                    <div class="logo">
                        <img :src="scope.row.image" alt />
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="栏目名称" align="center"></el-table-column>
            <el-table-column prop="type" label="栏目类型" align="center"></el-table-column>
            <el-table-column prop="url" label="栏目地址" align="center"></el-table-column>
            <el-table-column label="排序" align="center" width="60">
                <template slot-scope="scope">
                    <el-input
                        size="mini"
                        v-model="scope.row.sort"
                        @change="changeSort(scope.row.id,scope.row.sort,'sort')"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column label="是否显示" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.is_show"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                        @change="changeSort(scope.row.id,scope.row.is_show,'is_show')"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="primary" size="mini">编辑</el-button>
                    <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :title="isAdd?'添加栏目':'编辑栏目'"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
        >
            <el-form :model="form" label-width="100px" size="small">
                <el-form-item label="栏目类型">
                    <el-select v-model="form.type" placeholder="请选择栏目类型">
                        <el-option
                            v-for="item in optionsList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="栏目LOGO">
                    <el-upload
                        :limit="1"
                        accept=".jpg, .png"
                        action="http://new.schoolpi.net/admin/attach/image_live"
                        list-type="picture-card"
                        :data="token"
                        :on-exceed="handleExce"
                        :on-remove="handleRemoveThumb"
                        :on-success="handleSuccessThumb"
                        :file-list="thumbList"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="栏目名称">
                    <el-input v-model="form.name" placeholder="请输入栏目名称"></el-input>
                </el-form-item>
                <el-form-item label="栏目地址">
                    <el-input v-model="form.url" placeholder="请输入栏目地址"></el-input>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-radio-group v-model="form.is_show">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
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
/*eslint-disable*/

import upload from "@/components/upload";
export default {
    components: {
        upload
    },
    data() {
        return {
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            policyList: [],
            optionsList: [],
            form: { image: [] },
            isAdd: true,
            dialogVisible: false,
            thumbList: [],
            token: {
                token: window.localStorage.getItem("token")
            }
        };
    },
    created() {
        this.loadPolicyList();
        this.loadOption();
    },
    methods: {
        loadOption() {
            //condition_column
            this.$post("/admin/live/condition_column").then(res => {
                if (res.code === 1) {
                    this.optionsList = res.column_type;
                }
            });
        },
        //加载政策列表
        loadPolicyList(pages) {
            this.page = pages;
            this.$post("/admin/live/index_column", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.policyList = res.list;
                    console.log(this.policyList);
                } else {
                    this.policyList = [];
                    this.totals = 0;
                }
            });
        }, //ajaxsort_column
        changeSort(id, value, dateSort) {
            console.log(value, dateSort);
            this.$post("/admin/live/ajaxsort_column", {
                id: id,
                dataSort: dateSort,
                sort: value
            }).then(res => {});
        },
        handleClose() {
            this.dialogVisible = false;
            this.form = {};
            this.thumbList = [];
        },
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        handleAdd() {
            this.$post("/admin/live/add_column", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.handleClose();
                    this.dialogVisible = false;
                    this.loadPolicyList(1);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleRemoveThumb(file, fileList) {
            var path = file.url;
            this.thumbList = [];
            this.form.image.splice(
                this.form.image.findIndex(item => item === path),
                1
            );
        },
        handleSuccessThumb(res, file, fileList) {
            let obj = new Object();
            obj.url = res.data.all_path;
            this.thumbList.push(obj);
            this.form.image.push(res.data.all_path);
        },
        //超出上传个数
        handleExce() {
            this.$message.error("超出图片上传限定个数!");
        },
        edit(item) {
            this.$post("/admin/live/getone_column", {
                id: item.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                    res.info.image.forEach(item => {
                        let obj = new Object();
                        obj.url = item;
                        this.thumbList.push(obj);
                    });
                    this.isAdd = false;
                    this.dialogVisible = true;
                }
            });
        },
        handleEdit() {
            this.$post("/admin/live/edit_column", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.handleClose();
                    this.loadPolicyList(1);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleDelete(item) {
            this.$confirm("此操作将永久删除该栏目, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/live/delete_column", {
                        id: item.id
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            //删除后重新拉取
                            this.loadPolicyList(1);
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
.mt {
    margin-bottom: 10px;
}
.table {
    margin: 0 20px;
}
/* .el-input >>> .el-input__inner {
    text-align: center;
} */
.pagination {
    margin: 20px 0 0 -10px;
}
.logo {
    width: 60px;
    height: 60px;
    margin: 0 auto;
}
.logo img {
    width: 100%;
    height: 100%;
}
</style>