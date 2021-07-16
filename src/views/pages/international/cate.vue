<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button type="primary" size="mini" @click="add">添加分类</el-button>
                <el-button type="danger" size="mini" v-if="batchDeleteList.length>0">批量删除</el-button>
            </div>
        </div>

        <el-table border :data="majorList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
            <el-table-column label="操作" width="400" align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="primary" size="mini">编辑</el-button>
                    <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totals"
                :page-size="offset"
                @current-change="getCurrentage"
            ></el-pagination>
        </div>-->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-form :model="form" ref="form" size="mini" :rules="formrules" label-width="100px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="form.sort" placeholder="请输入专业排序"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleClose">取消</el-button>
                    <el-button v-if="isAdd" type="primary" @click="handleAdd">确定</el-button>
                    <el-button v-else type="primary" @click="handleEdit">确定</el-button>
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
            majorList: [],
            batchDeleteList: [], //批量删除按钮
            dialogVisible: false,
            isAdd: true,
            form: {},
            formrules: {
                name: [
                    {
                        required: true,
                        message: "分类名称不能为空",
                        trigger: "blur"
                    }
                ],
                sort: [
                    {
                        required: true,
                        message: "排序不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {
        this.loadCateList();
    },
    methods: {
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            console.log(pages);
            this.loadCateList(pages, this.province);
        },
        //加载学校列表
        loadCateList(pages, province) {
            this.page = pages;
            this.$post("/admin/abroad/cate").then(res => {
                if (res.code === 1) {
                    this.majorList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.majorList = [];
                    this.totals = 0;
                }
            });
        },
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        handleAdd() {
            this.$post("/admin/abroad/cate_add", this.form).then(res => {
                this.$message({
                    message: res.msg,
                    type: "success"
                });
                this.handleClose();
                this.loadCateList();
            });
        },
        edit(item) {
            this.$post("/admin/abroad/cate_getOne", { id: item.id }).then(
                res => {
                    this.form = res.info;
                    this.isAdd = false;
                    this.dialogVisible = true;
                }
            );
        },
        handleEdit() {
            this.$post("/admin/abroad/cate_edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.handleClose();
                    this.loadCateList();
                } else {
                    this.$message.error(res.msg);
                }
            });
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
            this.$confirm("此操作将永久删除学校, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/abroad/cate_del", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
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
        },
        handleClose() {
            this.dialogVisible = false;
            this.form = {};
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
    width: 240px;
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