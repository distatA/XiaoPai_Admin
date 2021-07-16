<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button
                    type="primary"
                    size="mini"
                    @click="handleJump('optimal-modify-school',true,'')"
                >添加学校</el-button>
                <el-button
                    type="danger"
                    size="mini"
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                >批量删除</el-button>
            </div>
            <div>
                <el-select
                    class="search-item"
                    v-model="province"
                    placeholder="请选择地区"
                    size="mini"
                    clearable
                >
                    <el-option
                        v-for="item in region_arr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                    class="search-item"
                    v-model="selecting"
                    clearable
                    placeholder="请选择类型"
                    size="mini"
                >
                    <el-option
                        v-for="item in selecting_arr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-input
                    v-model="keyword"
                    clearable
                    class="search-item"
                    placeholder="请输入学校名称"
                    size="mini"
                ></el-input>
                <el-button
                    type="primary"
                    size="mini"
                    @click="loadSchoolList(1, province, keyword, selecting)"
                >搜索</el-button>
            </div>
        </div>

        <el-table border :data="schoolList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="学校名称"></el-table-column>
            <el-table-column prop="province" label="所在地区" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.province}}-{{scope.row.city}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="selecting" label="类型" align="center"></el-table-column>
            <el-table-column label="排序" align="center" width="80">
                <template slot-scope="scope">
                    <el-input
                        size="mini"
                        v-model="scope.row.sort"
                        @change="changeSort(scope.row,scope.row.sort)"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="400" align="center">
                <template slot-scope="scope">
                    <el-button
                        @click="handleJump('optimal-modify-school',false,scope.row.id)"
                        type="primary"
                        size="mini"
                    >编辑</el-button>
                    <el-dropdown class="mr">
                        <span class="el-dropdown-link">
                            栏目管理
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                @click.native="handleJumpItem(scope.row,'optimal-article')"
                            >文章管理</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJumpItem(scope.row,'optimal-video')"
                            >视频管理</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJumpItem(scope.row,'optimal-college')"
                            >学院管理</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJumpItem(scope.row,'optimal-department')"
                            >系部管理</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJumpItem(scope.row,'optimal-major')"
                            >专业管理</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button
                        @click="handleJump('optimal-section',' ',scope.row.sid)"
                        type="primary"
                        size="mini"
                    >管理</el-button>
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
            schoolList: [],
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
        this.loadSchoolList();
        this.loadOptions();
    },
    methods: {
        loadOptions() {
            this.$post("/admin/school/condition_school").then(res => {
                if (res.code === 1) {
                    this.region_arr = res.region; //地区搜索
                }
            });
        },
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            console.log(pages);
            this.loadSchoolList(
                pages,
                this.province,
                this.keyword,
                this.selecting
            );
        },
        //加载本专科优选学校列表
        loadSchoolList(pages, province, keyword, selecting) {
            this.page = pages;
            this.$post("/admin/optimal/index", {
                page: this.page,
                num: this.offset,
                province: province,
                selecting: selecting,
                keyword: keyword
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
        changeSort(item, value) {
            console.log(item);
            this.$post("/admin/optimal/sort", {
                id: item.id,
                sort: value
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
                    this.$post("/admin/optimal/delete", {
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
        handleJump(url, isAdd, id) {
            this.$router.push({
                name: url,
                query: {
                    id: id,
                    isAdd: isAdd
                }
            });
        },
        handleJumpItem(item, url) {
            this.$router.push({
                name: url,
                query: {
                    sid: item.sid
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
.mr {
    margin-right: 10px;
    margin-left: 10px;
    border: 1px #ccc solid;
    cursor: pointer;
    padding: 2px 5px;
    border-radius: 3px;
}
</style>