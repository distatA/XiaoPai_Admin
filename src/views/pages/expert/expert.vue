<template>
    <el-main>
        <div class="add">
            <el-button
                type="primary"
                size="mini"
                @click="handleJump('modifyExpert-modifyExpert',true,'')"
            >添加专家</el-button>
            <el-button
                v-if="batchDeleteList.length>0"
                @click="handleDelete"
                type="danger"
                size="mini"
            >批量删除</el-button>
        </div>
        <el-table border :data="expertList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="专家头像" align="center">
                <template slot-scope="scope">
                    <div class="head_img">
                        <img :src="scope.row.headpic" alt />
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="专家姓名" align="center"></el-table-column>
            <el-table-column prop="mobile" label="手机号码" align="center"></el-table-column>
            <el-table-column label="添加时间" align="center">
                <template slot-scope="scope">{{scope.row.addtime|dateFormat}}</template>
            </el-table-column>
            <el-table-column label="操作" width="400" align="center">
                <template slot-scope="scope">
                    <el-button
                        @click="handleJump('modifyExpert-modifyExpert',false,scope.row)"
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
            expertList: [], //专家列表
            batchDeleteList: [] //批量删除的ID数组
        };
    },
    created() {
        this.loadExpertList();
    },
    methods: {
        //加载专家列表
        loadExpertList(pages) {
            this.page = pages;
            this.$post("/admin/expert/index", {
                page: this.page,
                num: this.offset,
                sid: this.$route.query.sid
            }).then(res => {
                if (res.code === 1) {
                    this.expertList = res.list;
                    this.totals = res.all_num;
                }
            });
        },
        getCurrentage(pages) {
            this.loadExpertList(pages);
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
            this.$router.push({
                name: url,
                query: {
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
            this.$confirm("此操作将永久删除该专家, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/expert/delete", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadExpertList();
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
.add {
    margin-bottom: 20px;
}
</style>