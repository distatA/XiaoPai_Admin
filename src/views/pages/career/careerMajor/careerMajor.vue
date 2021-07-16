<template>
    <el-main>
        <div class="add">
            <div>
                <el-button
                    type="primary"
                    size="mini"
                    @click="handleJump('modifyCareerMajor-modifyCareerMajor',true,'')"
                >添加专业库</el-button>
                <el-button
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                    type="danger"
                    size="mini"
                >批量删除</el-button>
            </div>
            <div style="width:300px;display:flex;">
                <el-input
                    class="mr-10"
                    clearable
                    v-model="three_name"
                    size="mini"
                    placeholder="请输入三级专业名称"
                ></el-input>
                <el-button size="mini" type="primary" @click="search">搜索</el-button>
            </div>
        </div>
        <el-table
            border
            :data="majorList"
            @selection-change="handleSelect"
            row-key="id"
            :tree-props="{children: 'child',hasChildren:'child.length>=0'}"
        >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="level" label="等级" align="center"></el-table-column>
            <el-table-column label="是否热门" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.is_hot"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                        @change="changeSort(scope.row)"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button
                        @click="handleJump('modifyCareerMajor-modifyCareerMajor',false,scope.row)"
                        type="primary"
                        size="mini"
                    >编辑</el-button>
                    <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <!-- <el-pagination
                background
                layout="prev, pager, next"
                :total="totals"
                :page-size="offset"
                @current-change="getCurrentage"
            ></el-pagination>-->
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
            majorList: [], //专业库列表
            three_name: "",
            batchDeleteList: [] //批量删除的ID数组
        };
    },
    created() {
        this.loadExpertList();
    },
    methods: {
        search() {
            this.$post("/admin/career/index_three", {
                three_name: this.three_name
            }).then(res => {
                if (res.code === 1) {
                    this.majorList = res.list;
                    // this.totals = res.list.length;
                }
            });
        },
        //加载专业库列表
        loadExpertList(pages) {
            this.page = pages;
            this.$post("/admin/career/index", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.majorList = res.list;
                    this.totals = res.all_num;
                }else{
                     this.majorList = [];
                    this.totals = 0;
                }
            });
        },
        getCurrentage(pages) {
            this.loadExpertList(pages);
        },
        //更改排序
        changeSort(item) {
            this.$post("/admin/career/ajaxsort", {
                id: item.id,
                dataSort: "is_hot",
                sort: item.is_hot
            }).then(res => {});
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
            this.$confirm("此操作将永久删除该专业, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/career/delete", {
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

.mr-10 {
    margin-right: 10px;
}
.add {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
}
</style>