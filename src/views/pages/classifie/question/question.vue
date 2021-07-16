<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button type="primary" size="mini" @click="handleJump('true','')">添加真题</el-button>
                <el-button
                    type="danger"
                    size="mini"
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                >批量删除</el-button>
            </div>
            <div class="search">
                <el-cascader
                    class="search-item"
                    size="mini"
                    :options="cate_list"
                    :props="treeProps "
                    v-model="cate_id"
                    clearable
                    placeholder="请选择所属栏目"
                ></el-cascader>
                <el-select
                    class="search-item"
                    v-model="province"
                    clearable
                    placeholder="请选择省份"
                    size="mini"
                >
                    <el-option
                        v-for="item in region"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-input
                    class="search-item"
                    v-model="title"
                    size="mini"
                    placeholder="请输入标题名称"
                    clearable
                ></el-input>
                <el-button type="primary" size="mini" @click="search">搜索</el-button>
            </div>
        </div>

        <el-table border :data="questionList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="标题" width="180"></el-table-column>
            <el-table-column prop="province" label="适用地区" align="center"></el-table-column>
            <el-table-column prop="cate_name" label="所属分类" align="center"></el-table-column>
            <el-table-column label="排序" align="center" width="80">
                <template slot-scope="scope">
                    <el-input
                        size="mini"
                        v-model="scope.row.sort"
                        @change="changeSort(scope.row,scope.row.sort,'sort')"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column label="添加时间" align="center">
                <template slot-scope="scope">{{scope.row.addtime|dateFormat}}</template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleJump('false',scope.row)" type="primary" size="mini">编辑</el-button>
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
            questionList: [],
            cate_list: [],
            cate_id: null, //搜索
            title: "", //标题名称
            province: "",
            region: [], //地区搜索
            batchDeleteList: [], //批量删除按钮
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {
        this.loadQuestionList();
        this.loadOptions();
    },
    methods: {
        loadOptions() {
            this.$post("/admin/classifie/condition_question").then(res => {
                if (res.code === 1) {
                    this.cate_list = res.cate_list;
                    this.region = res.region; //地区搜索
                }
            });
        },
        search() {
            if (this.cate_id != null) {
                this.cate_id = this.cate_id[this.cate_id.length - 1];
            }
            this.loadQuestionList(1, this.province, this.cate_id, this.title);
        },
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            this.loadQuestionList(
                pages,
                this.province,
                this.cate_id,
                this.title
            );
        },
        //加载分类招生真题列表
        loadQuestionList(pages, province, cate_id, title) {
            this.page = pages;
            this.$post("/admin/classifie/index_question", {
                page: this.page,
                num: this.offset,
                cate_id: cate_id,
                title: title,
                province: province
            }).then(res => {
                if (res.code === 1) {
                    this.questionList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.questionList = [];
                    this.totals = 0;
                }
            });
        },
        changeSort(item, value, dateSort) {
            this.$post("/admin/classifie/ajaxsort_question", {
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
            this.$confirm("此操作将永久删除真题, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/classifie/delete_question", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadQuestionList();
                        } else {
                            this.$message.error(res.msg);
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
        handleJump(isAdd, item) {
            this.$router.push({
                name: "classifie-modifyQuestion",
                query: {
                    isAdd: isAdd,
                    id: item.id
                }
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
.search {
    display: flex;
}
.search-item {
    width: 150px;
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