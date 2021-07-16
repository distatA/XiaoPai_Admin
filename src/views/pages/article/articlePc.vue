<template>
    <el-main style="overflow:hidden;">
        <div class="search">
            <!-- <div></div> -->
            <div class="left">
                <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-plus"
                    @click="$router.push({
                        name:'modifyArticle-modifyArticle',
                        query:{status:'pc'}
                    })"
                >添加文章</el-button>
                <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete"
                    v-if="batchDeleteList.length>0"
                >批量删除</el-button>
            </div>
            <div class="flex">
                <div class="mr">
                    <el-input v-model="title" placeholder="请输入搜索文章的标题" size="mini"></el-input>
                </div>
                <div class="mr">
                    <el-select size="mini" v-model="province" placeholder="请选择省份">
                        <el-option
                            v-for="item in provinceList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </div>
                <div class="mr">
                    <el-select size="mini" v-model="tags" placeholder="请选择标签">
                        <el-option
                            v-for="item in tagsList"
                            :key="item.tags"
                            :label="item.tags"
                            :value="item.tags"
                        ></el-option>
                    </el-select>
                </div>
                <div class="mr">
                    <el-select size="mini" v-model="cate" placeholder="请选择文章分类">
                        <el-option
                            v-for="item in cateList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </div>
                <div class="m">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="loadArticleList(1,title,province, tags, cate)"
                    >搜索</el-button>
                </div>
            </div>
        </div>

        <el-table border :data="articleList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="标题" width="400" fixed></el-table-column>
            <el-table-column prop="diqu" label="适用地区" align="center"></el-table-column>
            <el-table-column prop="tags" label="标签" align="center"></el-table-column>
            <el-table-column prop="catename" label="分类" align="center"></el-table-column>
            <el-table-column label="排序" align="center" width="60">
                <template slot-scope="scope">
                    <el-input
                        size="mini"
                        v-model="scope.row.sort"
                        @change="changeSort(scope.row.id,scope.row.sort,'sort')"
                    ></el-input>
                </template>
            </el-table-column>
           
            <el-table-column prop="login_ip" label="发布时间" align="center" width="200">
                <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
            </el-table-column>
            <el-table-column prop="author" label="作者" align="center"></el-table-column>
            <el-table-column label="操作" width="150" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row)" type="primary" size="mini">编辑</el-button>
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
            articleList: [],
            title: "", //搜索的文章标题
            province: "",
            provinceList: [], //省份搜索列表
            tags: "",
            tagsList: [], //标签搜索列表
            cate: "",
            cateList: [], //分类搜索列表
            batchDeleteList: [] //批量删除按钮
        };
    },
    created() {
        this.loadArticleList();
        this.loadSearchList();
    },
    methods: {
        //加载文章列表（province,tags,cate为搜索条件时所用）
        loadArticleList(pages, title, province, tags, cate) {
            this.page = pages;
            this.$post("/admin/article/index_pc", {
                page: this.page,
                num: this.offset,
                title: title,
                province: province,
                tags: tags,
                cate_id: cate
            }).then(res => {
                if (res.code === 1) {
                    this.articleList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.articleList = [];
                    this.totals = 0;
                }
            });
        },
        //加载搜索列表的选择框
        loadSearchList() {
            this.$post("/admin/article/article_condition").then(res => {
                if (res.code === 1) {
                    this.provinceList = res.province_list;
                    this.tagsList = res.tags_list;
                    this.cateList = res.cate_list;
                }
            });
        },
        //改变
        changeSort(id, value, dateSort) {
            console.log(value, dateSort);
            this.$post("/admin/article/ajaxsort", {
                id: id,
                dataSort: dateSort,
                sort: value
            }).then(res => {});
        },
        //前往编辑
        handleEdit(item) {
            this.$router.push({
                name: "editArticle-editArticle",
                query: {
                    id: item.id,
                    status: "pc"
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
            this.$confirm("此操作将永久删除该篇文章, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/article/delete", {
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
.flex {
    display: flex;
}
.m {
    margin: 0 auto;
}
.mr {
    width: 150px;
    margin-right: 10px;
}
.add,
.search {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}
.el-input >>> .el-input__inner {
    text-align: center;
    /* width: 60px; */
}
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
</style>