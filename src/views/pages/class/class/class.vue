<template>
    <el-main>
        <div class="add">
            <div>
                <el-button type="primary" size="mini" @click="handleJump('','add')">添加课程</el-button>
                <el-button
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                    type="danger"
                    size="mini"
                >批量删除</el-button>
            </div>
            <div class="add">
                <el-select class="mr" v-model="genre" clearable placeholder="请选择学科" size="mini">
                    <el-option
                        v-for="item in optionList"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                    ></el-option>
                </el-select>
                <el-input class="mr" v-model="lecturer" clearable placeholder="请输入讲师" size="mini"></el-input>
                <el-button type="primary" size="mini" @click="loadClassList(1,genre,lecturer)">搜索</el-button>
            </div>
        </div>
        <el-table border :data="classList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="title" label="课程名称" align="center" width="200"></el-table-column>
            <el-table-column prop="genre" label="学科" align="center"></el-table-column>
            <el-table-column prop="periods" label="期数" align="center"></el-table-column>
            <el-table-column prop="lecturer" label="讲师" align="center"></el-table-column>
            <el-table-column prop="author" label="作者" align="center"></el-table-column>
            <el-table-column prop="create_time" label="添加时间" align="center" width="200"></el-table-column>
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleChapter(scope.row)" type="primary" size="mini">章节管理</el-button>
                    <el-button @click="handleJump(scope.row,'edit')" type="primary" size="mini">编辑</el-button>
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
            num: "",
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            genre: "", //搜索城市
            lecturer: "", //搜索学校名称
            optionList: [], //配置项（专业列表）
            classList: [], //课程列表
            batchDeleteList: [], //批量删除的ID数组
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {
        this.loadClassList();
        this.loadOption();
    },
    methods: {
        getCurrentPage(pages) {
            this.loadClassList(pages, this.genre, this.lecturer);
        },
        //加载学校列表
        loadClassList(pages, genre, lecturer) {
            this.page = pages;
            this.$post("/admin/course/index", {
                page: this.page,
                num: this.offset,
                lecturer: lecturer,
                genre: genre
            }).then(res => {
                if (res.code === 1) {
                    this.classList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.classList = res.list;
                    this.totals = 0;
                }
            });
        },
        //加载地区供添加编辑搜索使用
        loadOption() {
            this.$post("/admin/course/genre").then(res => {
                if (res.code === 1) {
                    this.optionList = res.list;
                }
            });
        },
        handleJump(item, isAdd) {
            this.$router.push({
                name: "class-modifyClass",
                query: {
                    id: item.id,
                    state: isAdd
                }
            });
        },
        handleChapter(item) {
            this.$router.push({
                name: "class-chapter",
                query: {
                    pid: item.id
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
                    arr.push(item.id);
                    this.batchDeleteList = [...arr];
                });
            }
            console.log(this.batchDeleteList);
        },

        //批量删除结合单个删除
        handleDelete(item) {
            if (item.id) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.id);
            }
            this.$confirm("此操作将永久删除该课程, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/course/delete", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadClassList();
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