<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button type="primary" size="mini" @click="jump('add','')">添加类别</el-button>
                <el-button
                    type="danger"
                    size="mini"
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                >批量删除</el-button>
            </div>
            <div>
                <el-select
                    v-model="province"
                    size="mini"
                    placeholder="请选择省份"
                    @change="loadScoreList(1)"
                >
                    <el-option
                        v-for="item in typeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </div>
        </div>

        <el-table border :data="scoreList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="封面" width="200" align="center">
                <template slot-scope="scope">
                    <img class="cover" :src="scope.row.back_image[0]" alt />
                </template>
            </el-table-column>
            <el-table-column prop="name" label="标题" align="center"></el-table-column>
            <el-table-column prop="exam_time" label="考试时间" align="center"></el-table-column>
            <el-table-column prop="province" label="所属省份" align="center"></el-table-column>
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button @click="jump('edit',scope.row)" type="primary" size="mini">编辑</el-button>
                    <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
                    <el-button @click="viewQuestion(scope.row)" type="danger" size="mini">查看题目</el-button>
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
import upload from "@/components/upload";
export default {
    components: {
        upload
    },
    data() {
        return {
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            scoreList: [],
            batchDeleteList: [], //批量删除按钮
            dialogVisible: false,
            typeList: [],
            isAdd: true,
            form: {},
            province: ""
        };
    },
    created() {
        this.loadScoreList();
        this.loadOptions();
    },
    methods: {
        loadOptions() {
            this.$post("/admin/classifie/condition_exam").then(res => {
                if (res.code === 1) {
                    this.typeList = res.region; //地区搜索
                }
            });
        },
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            this.loadScoreList(pages);
        },
        //加载学校分数列表
        loadScoreList(pages) {
            this.page = pages;
            this.$post("/admin/classifie/index_exam_type", {
                page: this.page,
                num: this.offset,
                province: this.province
            }).then(res => {
                if (res.code === 1) {
                    this.scoreList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.scoreList = [];
                    this.totals = 0;
                }
            });
        },
        jump(type, item) {
            this.$router.push({
                name: "exam-modifyCates",
                query: {
                    state: type,
                    id: item.id
                }
            });
        },
        viewQuestion(item) {
            this.$router.push({
                name: "exam-exam",
                query: {
                    exam_type_id: item.id
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
        handleDelete(item) {
            if (item.id) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.id);
            }
            this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/classifie/delete_exam_type", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadScoreList();
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
        handleClose() {
            console.log("2");
            this.dialogVisible = false;
            this.form = {
                share_img: []
            };
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
    width: 240px;
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
.cover {
    width: 150px;
}
</style>