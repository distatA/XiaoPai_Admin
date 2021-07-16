<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button
                    type="primary"
                    size="mini"
                    @click="handleJump('optimal-modify-news',true,'')"
                >添加优选资讯</el-button>
                <el-button
                    type="danger"
                    size="mini"
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                >批量删除</el-button>
            </div>
            <div>
                <el-cascader
                    :options="region_arr"
                    :props="treeProps "
                    clearable
                    v-model="province"
                    placeholder="请选择地区"
                    class="search-item"
                    size="mini"
                ></el-cascader>
                <el-select
                    class="search-item"
                    clearable
                    v-model="selecting"
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
                    @click="loadNewsList(1, province, keyword, selecting)"
                >搜索</el-button>
            </div>
        </div>

        <el-table border :data="newsList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="subtitle" label="副标题" fixed></el-table-column>
            <el-table-column prop="title" label="文章标题" align="center"></el-table-column>
            <el-table-column prop="youxuan" label="优选分类" align="center"></el-table-column>
            <el-table-column prop="province" label="地区" align="center"></el-table-column>
            <el-table-column prop="create_time" label="发布时间" align="center"></el-table-column>
            <el-table-column label="浏览量" align="center" width="80">
                <template slot-scope="scope">
                    <el-input
                        size="mini"
                        v-model="scope.row.sort"
                        @change="changeSort(scope.row,scope.row.sort)"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button
                        @click="handleJump('optimal-modify-news',false,scope.row)"
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
            newsList: [],
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
        this.loadNewsList();
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
            this.loadNewsList(
                pages,
                this.province,
                this.keyword,
                this.selecting
            );
        },
        //加载本专科优选资讯列表
        loadNewsList(pages, province, keyword, selecting) {
            if (province) {
                province = province[province.length - 1];
            }
            this.page = pages;
            this.$post("/admin/optimal/news", {
                page: this.page,
                num: this.offset,
                province: province,
                selecting: selecting,
                keyword: keyword
            }).then(res => {
                if (res.code === 1) {
                    this.newsList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.newsList = [];
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
                            this.loadNewsList();
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
        },
        handleJump(url, isAdd, item) {
            this.$router.push({
                name: url,
                query: {
                    id: item.id,
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