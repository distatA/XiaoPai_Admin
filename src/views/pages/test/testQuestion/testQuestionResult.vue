<template>
    <el-main>
        <div class="add">
            <div>
                <el-button type="primary" size="mini" @click="add">添加测试题答案</el-button>
                <el-button
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                    type="danger"
                    size="mini"
                >批量删除</el-button>
            </div>
            <div class="search">
                <el-select v-model="type" size="mini" placeholder="请选择测试题类型">
                    <el-option
                        v-for="item in optionList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-button class="ml" type="primary" size="mini" @click="loadTestResultList">搜索</el-button>
            </div>
        </div>
        <el-table border :data="testList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="content" label="答案内容" align="center" width="500"></el-table-column>
            <el-table-column prop="class" label="答案说明" align="center"></el-table-column>
            <el-table-column prop="model" label="排序" align="center"></el-table-column>
            <el-table-column prop="type_name" label="测试题类型" align="center"></el-table-column>
            <el-table-column label="操作" width="400" align="center">
                <template slot-scope="scope">
                    <el-button @click="goMajor(scope.row)" type="primary" size="mini">相关专业</el-button>
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
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <el-form :model="form" ref="form" label-width="100px" size="mini">
                <el-form-item label="问题类型:">
                    <el-select v-model="form.type" size="mini" placeholder="请选择测试题类型">
                        <el-option
                            v-for="item in optionList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模型:">
                    <el-input v-model="form.model" placeholder="请输入问题名称"></el-input>
                </el-form-item>
                <el-form-item label="说明:">
                    <el-input type="textarea" v-model="form.class" placeholder="请输入答案A"></el-input>
                </el-form-item>
                <el-form-item label="内容:">
                    <el-input type="textarea" v-model="form.content" placeholder="请输入答案B"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button v-if="isAdd===true" type="primary" @click="handleAdd">确 定</el-button>
                    <el-button v-else type="primary" @click="handleEdit">确 定1</el-button>
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
            type: "",
            testList: [], //心理测试题列表
            batchDeleteList: [], //批量删除的ID数组
            dialogVisible: false,
            form: {},
            isAdd: true
        };
    },
    created() {
        this.loadTestResultList();
        this.loadOptions();
    },
    methods: {
        //加载心理测试题列表
        loadTestResultList(pages) {
            this.page = pages;
            this.$post("/admin/test/index_result", {
                page: this.page,
                num: this.offset,
                type: this.type
            }).then(res => {
                if (res.code === 1) {
                    this.testList = res.list;
                    this.totals = res.all_num;
                }
            });
        },
        loadOptions() {
            this.$post("/admin/test/condition_test").then(res => {
                if (res.code === 1) {
                    this.optionList = res.test_type;
                }
            });
        },
        getCurrentage(pages) {
            this.loadTestResultList(pages);
        },
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        handleAdd() {
            this.$post("/admin/test/add_result", this.form).then(res => {
                if (res.code === 1) {
                    this.dialogVisible = false;
                    this.form = {};
                    this.loadTestResultList();
                }
            });
        },
        edit(item) {
            this.$post("/admin/test/getone_result", { id: item.id }).then(
                res => {
                    if (res.code === 1) {
                        this.isAdd = false;
                        this.form = res.info;
                        this.dialogVisible = true;
                        // this.loadTestList();
                    }
                }
            );
        },
        handleEdit() {
            this.$post("/admin/test/edit_result", this.form).then(res => {
                if (res.code === 1) {
                    this.dialogVisible = false;
                    this.form = {};
                    this.loadTestResultList();
                }
            });
        },
        goMajor(item) {
            this.$router.push({
                name: "testMajor-testMajor",
                query: {
                    id: item.id,
                    type: item.type
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
                    this.$post("/admin/test/delete_result", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadTestResultList();
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
.head_img {
    width: 90px;
    height: 60px;
    margin: auto auto;
}
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