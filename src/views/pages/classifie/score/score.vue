<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button type="primary" size="mini" @click="add">添加分数</el-button>
                <el-button
                    type="danger"
                    size="mini"
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                >批量删除</el-button>
            </div>
        </div>

        <el-table border :data="scoreList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="school_name" label="学校名称" fixed width="180"></el-table-column>
            <el-table-column prop="year" label="年份" align="center"></el-table-column>
            <el-table-column prop="type" label="类型" align="center"></el-table-column>
            <el-table-column prop="plan_num" label="计划招生" align="center"></el-table-column>
            <el-table-column prop="need_num" label="录取人数" align="center"></el-table-column>
            <el-table-column prop="max_score" label="最高分" align="center"></el-table-column>
            <el-table-column prop="min_score" label="最低分" align="center"></el-table-column>
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
                @current-change="getCurrentage"
            ></el-pagination>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-form :model="form" ref="form" size="mini" :rules="formrules" label-width="100px">
                <el-form-item label="类型:" prop="type">
                    <el-select v-model="form.type" placeholder="请选择类型">
                        <el-option
                            v-for="item in typeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年份" prop="year">
                    <el-input v-model="form.year" placeholder="请输入年份"></el-input>
                </el-form-item>
                <el-form-item label="计划招生人数" prop="plan_num">
                    <el-input v-model="form.plan_num" placeholder="请输入计划招生人数"></el-input>
                </el-form-item>
                <el-form-item label="录取人数" prop="need_num">
                    <el-input v-model="form.need_num" placeholder="请输入录取人数"></el-input>
                </el-form-item>
                <el-form-item label="最高分" prop="max_score">
                    <el-input v-model="form.max_score" placeholder="请输入最高分"></el-input>
                </el-form-item>
                <el-form-item label="最低分" prop="min_score">
                    <el-input v-model="form.min_score" placeholder="请输入最低分"></el-input>
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
            scoreList: [],
            batchDeleteList: [], //批量删除按钮
            dialogVisible: false,
            typeList: [],
            isAdd: true,
            form: {},
            formrules: {
                type: [
                    {
                        required: true,
                        message: "类型不能为空",
                        trigger: "blur"
                    }
                ],
                year: [
                    {
                        required: true,
                        message: "年份不能为空",
                        trigger: "blur"
                    }
                ],
                plan_num: [
                    {
                        required: true,
                        message: "计划招生人数不能为空",
                        trigger: "blur"
                    }
                ],
                need_num: [
                    {
                        required: true,
                        message: "录取人数不能为空",
                        trigger: "blur"
                    }
                ],
                max_score: [
                    {
                        required: true,
                        message: "最高分不能为空",
                        trigger: "blur"
                    }
                ],
                min_score: [
                    {
                        required: true,
                        message: "最低分人数不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {
        this.loadScoreList();
        this.loadOptions();
    },
    methods: {
        loadOptions() {
            this.$post("/admin/classifie/condition_school_score").then(res => {
                if (res.code === 1) {
                    this.typeList = res.score_type; //地区搜索
                }
            });
        },
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            console.log(pages);
            this.loadScoreList(pages);
        },
        //加载学校分数列表
        loadScoreList(pages) {
            this.page = pages;
            this.$post("/admin/classifie/index_school_score", {
                page: this.page,
                num: this.offset,
                sid: this.$route.query.sid
            }).then(res => {
                if (res.code === 1) {
                    this.scoreList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.scoreList = [];
                    this.totals = 0;
                }
            });
        },
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        handleAdd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.sid = this.$route.query.sid;
                    this.$post(
                        "/admin/classifie/add_school_score",
                        this.form
                    ).then(res => {
                        this.$message({
                            message: res.msg,
                            type: "success"
                        });
                        this.handleClose();
                        this.loadScoreList();
                    });
                }
            });
        },
        edit(item) {
            this.$post("/admin/classifie/getone_school_score", {
                id: item.id
            }).then(res => {
                this.form = res.info;
                this.dialogVisible = true;
                this.isAdd = false;
            });
        },
        handleEdit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.sid = this.$route.query.sid;
                    this.$post(
                        "/admin/classifie/edit_school_score",
                        this.form
                    ).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.handleClose();
                            this.loadScoreList();
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                }
            });
        },
        //更改排序
        changeSort(item, value, dateSort) {
            this.$post("/admin/classifie/ajaxsort_career", {
                id: item.id,
                dataSort: dateSort,
                sort: value
            }).then(res => {});
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
            this.$confirm("此操作将永久删除分数, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/classifie/delete_school_score", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadScoreList();
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