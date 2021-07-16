<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button
                    type="primary"
                    size="mini"
                    @click="handleJump('','international-modifySchool','true')"
                >添加学校</el-button>
                <el-button
                    type="danger"
                    size="mini"
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                >批量删除</el-button>
            </div>
        </div>

        <el-table border :data="schoolList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="学校名称" width="180" align="center"></el-table-column>
            <el-table-column prop="en_name" label="英文名" align="center" width="200"></el-table-column>
            <el-table-column prop="cate_name" label="分类" align="center"></el-table-column>
            <el-table-column prop="addtime" label="添加时间" align="center" width="200"></el-table-column>
            <el-table-column label="排序" align="center" width="100">
                <template slot-scope="scope">
                    <el-input
                        size="mini"
                        v-model="scope.row.sort"
                        @change="changeSort(scope.row,scope.row.sort,'sort')"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="400" align="center">
                <template slot-scope="scope">
                    <el-button
                        @click="handleJump(scope.row,'international-modifySchool','false')"
                        type="primary"
                        size="mini"
                    >编辑</el-button>
                    <el-button @click="handleDelete(scope.row,'')" type="danger" size="mini">删除</el-button>
                    <el-dropdown class="ml">
                        <span class="el-dropdown-link">
                            下拉菜单
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                @click.native="handleJump(scope.row,'international-introduce','')"
                            >院校简介</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJump(scope.row,'international-env','')"
                            >教学环境</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJump(scope.row,'international-major','')"
                            >开设专业</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJump(scope.row,'international-place','')"
                            >地理位置</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJump(scope.row,'international-feature','')"
                            >院校特点</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJump(scope.row,'international-teach','')"
                            >教学特色</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJump(scope.row,'international-direction','')"
                            >留学通道</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJump(scope.row,'international-video','')"
                            >学校视频</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
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
            schoolList: [],
            batchDeleteList: [] //批量删除按钮
        };
    },
    created() {
        this.loadSchoolList();
    },
    methods: {
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            this.loadSchoolList(pages);
        },
        //加载分类招生真题列表
        loadSchoolList(pages, province) {
            this.page = pages;
            this.$post("/admin/abroad/index", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.schoolList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.schoolList = [];
                    this.totals = 0;
                }
            });
        },
        changeSort(item, value, dateSort) {
            this.$post("/admin/abroad/sort", {
                id: item.id,
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
                    this.$post("/admin/abroad/delete", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadSchoolList();
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
        handleJump(item, url, isAdd) {
            this.$router.push({
                name: url,
                query: {
                    isAdd: isAdd,
                    id: item.id,
                    sid: item.id
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