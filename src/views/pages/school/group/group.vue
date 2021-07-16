<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button
                    type="primary"
                    size="mini"
                    @click="handleJump('school-modifyGroup',true,'')"
                    v-if="groupList.length === 0"
                >添加群聊</el-button>
            </div>
        </div>

        <el-table border :data="groupList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="nickname" label="群主" align="center"></el-table-column>
            <el-table-column prop="logo" label="群logo" align="center" width="200">
                <template slot-scope="scope">
                    <img class="thumb" :src="scope.row.logo" alt />
                </template>
            </el-table-column>
            <el-table-column prop="title" label="分享标题" align="center"></el-table-column>
            <el-table-column label="分享封面" align="center" width="200">
                <template slot-scope="scope">
                    <!-- {{scope.row.cover}}  -->
                    <img class="thumb" :src="scope.row.cover" alt />
                </template>
            </el-table-column>

            <el-table-column label="状态" align="center" width="80">
                <template slot-scope="scope">
                    <div v-if="scope.row.state === 1">启用</div>
                    <div v-if="scope.row.state === 2">停用</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="400" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button
                        @click="handleJump('school-user','',scope.row)"
                        type="primary"
                        size="mini"
                    >用户列表</el-button>
                    <el-button
                        @click="handleJump('school-userNotes','',scope.row)"
                        type="primary"
                        size="mini"
                    >聊天记录</el-button>
                    <el-button
                        @click="handleJump('school-modifyGroup',false,scope.row)"
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
/*eslint-disable*/
export default {
    data() {
        return {
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            groupList: [],
            keyword: "", //学校名称搜索
            selecting: "", //类型搜索
            selecting_arr: [
                { id: 0, name: "全部" },
                { id: 1, name: "本科优选" },
                { id: 2, name: "专科优选" }
            ],
            province: "",
            region_arr: [], //地区搜索
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            },
            batchDeleteList: [] //批量删除按钮
        };
    },
    created() {
        this.loadGroupList();
    },
    methods: {
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            console.log(pages);
            this.loadGroupList(
                pages,
                this.province,
                this.keyword,
                this.selecting
            );
        },
        //加载本专科优选资讯列表
        loadGroupList(pages, province, keyword, selecting) {
            if (province) {
                province = province[province.length - 1];
            }
            this.page = pages;
            this.$post("/admin/school/index_group", {
                sid: this.$route.query.sid
            }).then(res => {
                if (res.code === 1) {
                    this.groupList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.groupList = [];
                    this.totals = 0;
                }
            });
        },
        changeSort(item, value) {
            console.log(item);
            this.$post("/admin/school/group_edit", {
                id: item.id,
                sid: this.$route.query.sid,
                state: value
            }).then(res => {});
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
            this.$confirm("此操作将永久删除学校, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/optimal/news_del", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadGroupList();
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
        handleJump(url, isAdd, item) {
            this.$router.push({
                name: url,
                query: {
                    id: item.id,
                    sid: this.$route.query.sid,
                    isAdd: isAdd
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
    width: 100px;
    height: 100px;
    margin: 0 auto;
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