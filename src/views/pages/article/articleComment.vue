<template>
    <el-main>
        <div class="delete">
            <el-button
                size="small"
                type="danger"
                @click="handleDelete"
                v-if="batchDeleteList.length>0"
            >批量删除</el-button>
        </div>
        <el-table border :data="commentList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="文章名称" width="400" fixed></el-table-column>
            <el-table-column prop="nickname" label="评论人" align="center"></el-table-column>
            <el-table-column prop="content" label="内容" align="center"></el-table-column>
            <el-table-column label="发布时间" align="center" width="200">
                <template slot-scope="scope">{{scope.row.addtime|dateFormat}}</template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center" fixed="right">
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
            commentList: [],
            batchDeleteList: []
        };
    },
    created() {
        this.loadArticleList();
    },
    methods: {
        //加载文章评论列表（province,tags,cate为搜索条件时所用）
        loadArticleList(pages) {
            this.page = pages;
            this.$post("/admin/article/index_comment", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.commentList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.articleList = [];
                    this.totals = 0;
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
            this.$confirm("此操作将永久删除该篇评论, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/article/delete_comment", {
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
.delete {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}
</style>