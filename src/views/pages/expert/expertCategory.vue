<template>
    <el-main>
        <div class="add">
            <el-button type="primary" size="mini" @click="add">添加专家分类</el-button>
            <el-button
                v-if="batchDeleteList.length>0"
                @click="handleDelete"
                type="danger"
                size="mini"
            >批量删除</el-button>
        </div>
        <el-table border :data="expertCategoryList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
            <el-table-column label="排序" width="80" align="center">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.sort" @change="changeSort(scope.row)"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="400" align="center">
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
            :title="isAdd?'添加分类':'编辑分类'"
            :visible.sync="dialogVisible"
            width="30%"
            center
            :before-close="handleClose"
        >
            <el-form
                class="form"
                label-position="right"
                :model="form"
                label-width="80px"
                size="mini"
                center
            >
                <el-form-item label="分类名称:">
                    <el-input class="input" v-model="form.name" placeholder="请输入分类名称"></el-input>
                </el-form-item>
                <el-form-item label="分类排序:">
                    <el-input class="input" v-model="form.sort" placeholder="请输入分类排序"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="handleAdd">确 定</el-button>
                <el-button v-else type="primary" @click="handleEdit">确 定</el-button>
            </span>
        </el-dialog>
    </el-main>
</template>
<script>
/* eslint-disable*/
import editor from "@/components/com";
export default {
    components: {
        editor
    },
    data() {
        return {
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            expertCategoryList: [], //专家分类列表
            batchDeleteList: [], //批量删除的ID数组
            form: {},
            dialogVisible: false,
            isAdd: true
        };
    },
    created() {
        this.loadExpertList();
    },
    methods: {
        //加载专家分类列表
        loadExpertList(pages) {
            this.page = pages;
            this.$post("/admin/expert/index_cate", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.expertCategoryList = res.list;
                    this.totals = res.all_num;
                }
            });
        },
        getCurrentage(pages) {
            this.loadExpertList(pages);
        },
        //改变排序
        changeSort(item) {
            this.$post("/admin/expert/ajaxsort_cate", {
                id: item.id,
                dataSort: "sort",
                sort: item.sort
            }).then(res => {});
        },
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        handleAdd() {
            this.$post("/admin/expert/add_cate", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "添加成功",
                        type: "success"
                    });

                    this.dialogVisible = false;
                    this.form = {};
                    this.loadExpertList();
                }
            });
        },
        edit(item) {
            this.$post("/admin/expert/getone_cate", { id: item.id }).then(
                res => {
                    if (res.code === 1) {
                        this.form = res.info;
                        this.isAdd = false;
                        this.dialogVisible = true;
                    }
                }
            );
        },
        handleEdit() {
            this.$post("/admin/expert/edit_cate", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "添加成功",
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.form = {};
                    this.loadExpertList();
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
        },
        //批量删除结合单个删除
        handleDelete(item) {
            if (item.id) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.id);
            }
            this.$confirm("此操作将永久删除该专家分类, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/expert/delete_cate", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadExpertList();
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
    },
    mounted() {}
};
</script>
<style  scoped>
.add {
    margin-bottom: 20px;
}
.pagination {
    margin: 20px 0 0 -10px;
}
</style>