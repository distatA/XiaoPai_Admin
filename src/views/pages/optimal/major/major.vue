<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button type="primary" size="mini" @click="handleJump('add','')">添加专业</el-button>
                <el-button
                    type="danger"
                    size="mini"
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                >批量删除</el-button>
            </div>
            <div>
                <el-input
                    class="search"
                    clearable
                    size="mini"
                    v-model="keyword"
                    placeholder="请输入学院名称"
                ></el-input>
                <el-button
                    class="ml"
                    type="primary"
                    size="mini"
                    @click="loadMajorList(1,keyword)"
                >搜索</el-button>
            </div>
        </div>

        <el-table border :data="majorList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="专业名称" align="center"></el-table-column>
            <el-table-column prop="college" label="所属学院" align="center"></el-table-column>
            <el-table-column prop="school_name" label="所属学校" align="center"></el-table-column>
            <el-table-column prop="create_time" label="添加时间" align="center"></el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleJump('edit',scope.row)" type="primary" size="mini">编辑</el-button>
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
            majorList: [],
            keyword: "",
            batchDeleteList: [] //批量删除按钮
        };
    },
    created() {
        this.loadMajorList();
    },
    methods: {
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            this.loadMajorList(pages, this.keyword);
        },
        //加载政策列表
        loadMajorList(pages, keyword) {
            this.page = pages;
            this.$post("/admin/optimal/major", {
                page: this.page,
                num: this.offset,
                sid: this.$route.query.sid,
                keyword: keyword
            }).then(res => {
                if (res.code === 1) {
                    this.majorList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.majorList = [];
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
                    arr.push(item.mid);
                    this.batchDeleteList = [...arr];
                });
            }
            console.log(this.batchDeleteList);
        },
        handleDelete(item) {
            if (item.mid) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.mid);
            }
            this.$confirm("此操作将永久删除专业, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/optimal/major_del", {
                        mid: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadMajorList();
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
                name: "optimal-modifyMajor",
                query: {
                    state: isAdd,
                    sid: this.$route.query.sid,
                    mid: item.mid
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
.search-item {
    width: 120px;
    margin-right: 10px;
}
/* .el-input >>> .el-input__inner {
    text-align: center;
} */
.pagination {
    margin: 20px 0 0 -10px;
}
.thumb {
    width: 150px;
    height: 100px;
}
.search {
    width: 200px;
}
.ml {
    margin-left: 10px;
}
</style>