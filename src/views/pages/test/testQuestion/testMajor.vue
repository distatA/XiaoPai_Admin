<template>
    <el-main>
        <div class="add">
            <div>
                <el-button
                    type="primary"
                    size="mini"
                    @click="
            dialogVisible = true;"
                >添加适合专业</el-button>
                <el-button
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                    type="danger"
                    size="mini"
                >批量删除</el-button>
            </div>
            <div class="search">
                <!-- <el-select v-model="type" size="mini" placeholder="请选择测试题类型">
                    <el-option
                        v-for="item in optionMajorList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>-->
                <!-- <el-button class="ml" type="primary" size="mini" @click="loadTestMajorList(1)">搜索</el-button> -->
            </div>
        </div>
        <el-table border :data="testList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="专业名称" align="center"></el-table-column>
            <el-table-column prop="first" label="一级专业" align="center"></el-table-column>
            <el-table-column prop="second" label="二级专业" align="center"></el-table-column>
            <el-table-column prop="type" label="测试题类型" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
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
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <el-form :model="form" ref="form" label-width="100px" size="mini">
                <el-form-item label="适合专业:">
                    <el-cascader
                        :options="optionMajorList"
                        :props="treeProps "
                        clearable
                        v-model="form.cid"
                        placeholder="请选择专业"
                        style="width:100%"
                    ></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAdd">确 定</el-button>
                </el-form-item>
            </el-form>
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
            optionMajorList: [],
            type: "",
            testList: [], //心理测试题列表
            batchDeleteList: [], //批量删除的ID数组
            dialogVisible: false,
            form: {},
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {
        this.loadTestMajorList();
        this.loadOptions();
    },
    methods: {
        //加载心理测试题列表
        loadTestMajorList(pages) {
            this.page = pages;
            this.$post("/admin/test/index_career", {
                page: this.page,
                num: this.offset,
                type: this.type,
                type_id: this.$route.query.id
            }).then(res => {
                if (res.code === 1) {
                    this.testList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.testList = [];
                    this.totals = 0;
                }
            });
        },
        loadOptions() {
            this.$post("/admin/test/condition_career").then(res => {
                if (res.code === 1) {
                    this.optionList = res.test_type;
                    this.optionMajorList = res.list;
                }
            });
        },
        getCurrentage(pages) {
            this.loadTestMajorList(pages);
        },
        handleAdd() {
            this.form.cid = this.form.cid[this.form.cid.length - 1];
            this.form.type_id = this.$route.query.id;
            this.form.type = this.$route.query.type;
            this.$post("/admin/test/add_career", this.form).then(res => {
                if (res.code === 1) {
                    this.dialogVisible = false;
                    this.form = {};
                    this.loadTestMajorList();
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
            this.$confirm("此操作将永久删除该测试结果, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/test/delete_career", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadTestMajorList();
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
    },
    mounted() {}
};
</script>
<style  scoped>
.head_img img {
    width: 100%;
    height: 100%;
}
.pagination {
    margin: 20px 0 0 -10px;
}
.search {
    display: flex;
}
.ml {
    margin-left: 20px;
}
.add {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
</style>