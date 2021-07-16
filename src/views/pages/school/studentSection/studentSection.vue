<template>
    <el-main>
        <el-row class="add">
            <el-col :span="3">
                <el-button
                    @click="handleJump('modifyStudentSection-modifyStudentSection',true,'')"
                    type="primary"
                    size="mini"
                >添加招生简章</el-button>
            </el-col>
            <el-col :span="3" v-if="batchDeleteList.length>0">
                <el-button @click="handleDelete" type="danger" size="mini">批量删除</el-button>
            </el-col>
        </el-row>
        <el-table border :data="sectionList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="school_name" label="学校名称" align="center"></el-table-column>
            <el-table-column prop="title" label="标题" align="center"></el-table-column>
            <el-table-column label="操作" width="400" align="center">
                <template slot-scope="scope">
                    <el-button
                        @click="handleJump('modifyStudentSection-modifyStudentSection',false,scope.row)"
                        type="primary"
                        size="mini"
                    >编辑</el-button>
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
/* eslint-disable*/
export default {
    data() {
        return {
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            sectionList: [], //知名校友列表(针对某个学校)
            batchDeleteList: [] //批量删除的ID数组
        };
    },
    created() {
        this.loadSectionList();
    },
    methods: {
        //加载招生简章列表
        loadSectionList(pages) {
            this.page = pages;
            this.$post("/admin/school/index_enrollment", {
                page: this.page,
                num: this.offset,
                sid: this.$route.query.sid
            }).then(res => {
                if (res.code === 1) {
                    this.sectionList = res.list;
                    this.totals = res.all_num;
                }
            });
        },
        getCurrentage(pages) {
            this.loadSectionList(pages);
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
        handleJump(url, isAdd, item) {
            console.log(isAdd);
            this.$router.push({
                name: url,
                query: {
                    sid: this.$route.query.sid,
                    id: item.id,
                    isAdd: isAdd
                }
            });
        },
        //批量删除结合单个删除
        handleDelete(item) {
            if (item.id) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.id);
            }
            this.$confirm("此操作将永久删除该招生简章, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/school/delete_enrollment", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadSectionList();
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
.form {
    margin-right: 50px;
}
.pagination {
    margin: 20px 0 0 -10px;
}
.add {
    margin-bottom: 20px;
}
.forbidden {
    color: red;
}
.usual {
    color: blue;
}
</style>