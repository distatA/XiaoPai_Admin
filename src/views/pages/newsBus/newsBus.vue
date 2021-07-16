<template>
    <el-main>
        <div class="search">
            <!-- <div></div> -->
            <div class="left">
                <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-plus"
                    @click="$router.push('/addNewsBus/addNewsBus')"
                >添加文章</el-button>
                <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete"
                    v-if="batchDeleteList.length>0"
                >批量删除</el-button>
            </div>
        </div>

        <el-table border :data="articleList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="标题" width="400" fixed></el-table-column>
            <el-table-column prop="diqu" label="适用地区" align="center"></el-table-column>
            <el-table-column prop="catename" label="分类" align="center"></el-table-column>
            <el-table-column prop="login_ip" label="发布时间" align="center" width="200">
                <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
            </el-table-column>
            <el-table-column label="是否显示" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.is_index"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                        @change="changeSort(scope.row,scope.row.is_index,'is_index')"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row)" type="primary" size="mini">编辑</el-button>
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
                @current-change="loadArticleList"
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
            articleList: [],
            batchDeleteList: [] //批量删除按钮
        };
    },
    created() {
        this.loadArticleList();
    },
    methods: {
        changeSort(item, value, datasort) {
            this.$post("/admin/Article/ajaxSort", {
                id: item.id,
                sort: value,
                dataSort: datasort
            }).then(res => {});
        },
        //加载早班车列表（province,tags,cate为搜索条件时所用）
        loadArticleList(pages) {
            this.page = pages;
            this.$post("/admin/article/index_zbc", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.articleList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.articleList = [];
                    this.totals = 0;
                }
            });
        },
        //前往编辑
        handleEdit(item) {
            this.$router.push({
                name: "editNewsBus-editNewsBus",
                query: {
                    id: item.id
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
        //批量删除
        handleDelete(item) {
            if (item.id) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.id);
            }
            this.$confirm("此操作将永久删除该篇文章, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/article/delete", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadArticleList();
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
}
.m {
    margin: 0 auto;
}
.mr {
    width: 150px;
    margin-right: 10px;
}
.add,
.search {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}
.el-input >>> .el-input__inner {
    text-align: center;
    /* width: 60px; */
}
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
</style>