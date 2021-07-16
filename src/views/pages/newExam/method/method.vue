<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button
                    type="primary"
                    size="mini"
                    @click="add"
                    v-loading.fullscreen.lock="fullscreenLoading"
                >一键生成玩法</el-button>
                <el-button
                    type="danger"
                    size="mini"
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                >批量删除</el-button>
            </div>
        </div>

        <el-table border :data="algorithmList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="choose" label="学科" align="center"></el-table-column>
            <el-table-column label="玩法专业关联" width="200" align="center">
                <template slot-scope="scope">
                    <el-button
                        @click="handleJump(scope.row,'newExam-methodMajor')"
                        type="text"
                        size="mini"
                    >玩法专业关联</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <!-- <el-button @click="edit(scope.row)" type="primary" size="mini">编辑</el-button> -->
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
            fullscreenLoading: false,
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            algorithmList: [], //玩法列表
            batchDeleteList: [] //批量删除按钮
        };
    },
    created() {
        this.loadAreaList();
        this.loadOptions();
    },
    methods: {
        handleJump(item, url) {
            this.$router.push({
                name: url,
                query: {
                    mid: item.id
                }
            });
        },
        loadOptions() {
            this.$post("/admin/entrance/condition_algorithm", {
                province: this.$route.query.province
            }).then(res => {
                if (res.code === 1) {
                    this.configList = res.config_list;
                    this.subjectList = res.subject_list;
                }
            });
        },
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            console.log(pages);
            this.loadAreaList(pages);
        },
        //加载学校分数列表
        loadAreaList(pages) {
            this.page = pages;
            this.$post("/admin/entrance/index_method", {
                page: this.page,
                num: this.offset,
                config_id: this.$route.query.config_id
            }).then(res => {
                if (res.code === 1) {
                    this.algorithmList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.algorithmList = [];
                    this.totals = 0;
                }
            });
        },
        add() {
            this.fullscreenLoading = true;
            this.$post("/admin/entrance/add_method", {
                config_id: this.$route.query.config_id
            }).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.fullscreenLoading = false;
                    //删除后重新拉取
                    this.loadAreaList();
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
            this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/entrance/delete_method", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadAreaList();
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
.search {
    display: flex;
}
.search-item {
    width: 180px;
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