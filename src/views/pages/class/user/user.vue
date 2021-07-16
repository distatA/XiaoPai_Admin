<template>
    <el-main>
        <div class="add">
            <!-- <div class="add">
                <el-input class="mr" v-model="lecturer" placeholder="请输入讲师" size="mini"></el-input>
                <el-button type="primary" size="mini" @click="loadClassList(1,genre,lecturer)">搜索</el-button>
            </div>-->
        </div>
        <el-table border :data="userList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="title" label="课程名称" align="center"></el-table-column>
            <el-table-column prop="cata_chapter" label="章节期数" align="center"></el-table-column>
            <el-table-column prop="nickname" label="用户" align="center"></el-table-column>
            <el-table-column prop="last_time" label="学习时间" align="center"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totals"
                :page-size="offset"
                @current-change="getCurrentPage"
            ></el-pagination>
        </div>
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
            userList: [], //课程列表
            batchDeleteList: [] //批量删除的ID数组
        };
    },
    created() {
        this.loadUserList();
    },
    methods: {
        getCurrentPage(pages) {
            this.loadUserList(pages);
        },
        //加载学校列表
        loadUserList(pages) {
            this.page = pages;
            this.$post("/admin/course/learning", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.userList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.userList = res.list;
                    this.totals = 0;
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
                    arr.push(item.cid);
                    this.batchDeleteList = [...arr];
                });
            }
        },

        //批量删除结合单个删除
        handleDelete(item) {
            if (item.cid) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.cid);
            }
            this.$confirm("此操作将永久删除该章节, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/course/catalogue_delete", {
                        cid: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadUserList();
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
<style  scoped>
.pagination {
    margin: 20px 0 0 -10px;
}
.mt {
    margin-top: 7px;
}
.mr {
    margin-right: 10px;
}
.add {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
}
.forbidden {
    color: red;
}
.usual {
    color: blue;
}
</style>