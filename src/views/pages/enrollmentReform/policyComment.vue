<template>
    <el-main>
        <div class="flex">
            <el-button
                type="danger"
                size="mini"
                v-if="batchDeleteList.length>0"
                @click="handleDelete"
            >批量删除</el-button>
        </div>

        <el-table border :data="commentsList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="文章标题" align="center"></el-table-column>
            <el-table-column prop="uid" label="评论人ID" align="center"></el-table-column>
            <el-table-column prop="nickname" label="评论人" align="center"></el-table-column>
            <el-table-column prop="content" label="评论内容" align="center"></el-table-column>
            <el-table-column prop="addtime" label="发布时间" align="center"></el-table-column>
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
            commentsList: [],
            batchDeleteList: [] //批量删除按钮
        };
    },
    created() {
        this.loadCommentList();
    },
    methods: {
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            this.loadCommentList(pages);
        },
        //加载评论列表
        loadCommentList(pages) {
            this.page = pages;
            this.$post("/admin/reform/comment", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.commentsList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.commentsList = [];
                    this.totals = 0;
                }
            });
        },
        //点击多选
        handleSelect(val) {
            console.log(val);
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
            this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/reform/comment_del", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadCommentList();
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
.pagination {
    margin: 20px 0 0 -10px;
}

</style>