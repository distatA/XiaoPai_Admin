<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button type="primary" size="mini" @click="add">添加省份</el-button>
                <el-button type="primary" size="mini" @click="options">搜索配置</el-button>
                <el-button
                    type="danger"
                    size="mini"
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                >批量删除</el-button>
            </div>
            <div class="search">
                <el-select
                    class="search-item"
                    v-model="province"
                    size="mini"
                    clearable
                    placeholder="请选择地区"
                >
                    <el-option
                        v-for="item in area"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-input
                    class="search-item"
                    v-model="year"
                    size="mini"
                    clearable
                    placeholder="请输入年份"
                ></el-input>
                <el-button @click="loadAreaList(1,province,year)" type="primary" size="mini">搜索</el-button>
            </div>
        </div>

        <el-table border :data="areaList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="province_name" label="地区" align="center"></el-table-column>
            <el-table-column prop="year" label="年份" align="center"></el-table-column>
            <el-table-column label="配置算法" width="200" align="center">
                <template slot-scope="scope">
                    <el-button
                        @click="handleJump(scope.row,'newExam-algorithm')"
                        type="text"
                        size="mini"
                    >配置算法</el-button>
                </template>
            </el-table-column>
            <el-table-column label="配置学科" width="200" align="center">
                <template slot-scope="scope">
                    <el-button
                        @click="handleJump(scope.row,'newExam-subject')"
                        type="text"
                        size="mini"
                    >配置学科</el-button>
                </template>
            </el-table-column>
            <el-table-column label="配置玩法" width="200" align="center">
                <template slot-scope="scope">
                    <el-button
                        @click="handleJump(scope.row,'newExam-method')"
                        type="text"
                        size="mini"
                    >配置玩法</el-button>
                </template>
            </el-table-column>
            <el-table-column label="学校" width="200" align="center">
                <template slot-scope="scope">
                    <el-button
                        @click="handleJump(scope.row,'newExam-school')"
                        type="text"
                        size="mini"
                    >学校</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="primary" size="mini">编辑</el-button>
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
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-form :model="form" ref="form" size="mini" label-width="100px">
                <el-form-item label="省份:" prop="type">
                    <el-select v-model="form.province" placeholder="请选择省份">
                        <el-option
                            v-for="item in area"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年份:" prop="year">
                    <el-input v-model="form.year" placeholder="请输入年份"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleClose">取消</el-button>
                    <el-button v-if="status=='add'" type="primary" @click="handleAdd">确定</el-button>
                    <el-button v-else type="primary" @click="handleEdit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-main>
</template>
<script>
/*eslint-disable*/
export default {
    data() {
        return {
            province: "", //搜索
            year: "", //搜索
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            areaList: [],
            batchDeleteList: [], //批量删除按钮
            dialogVisible: false,
            area: [], //搜索和添加使用的地区列表
            status: "add",
            form: {}
        };
    },
    created() {
        this.loadAreaList();
        this.loadOptions();
    },
    methods: {
        handleJump(item, url) {
            this.$router.push({
                name: url,
                query: {
                    province: item.province,
                    config_id: item.id
                }
            });
        },
        options() {
            this.$router.push("/newExam/options");
        },
        loadOptions() {
            this.$post("/admin/entrance/condition").then(res => {
                if (res.code === 1) {
                    this.area = res.region; //地区搜索
                }
            });
        },
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            console.log(pages);
            this.loadAreaList(pages, this.province, this.year);
        },
        //加载学校分数列表
        loadAreaList(pages, province, year) {
            this.page = pages;
            this.$post("/admin/entrance/index", {
                page: this.page,
                num: this.offset,
                province: province,
                year: year
            }).then(res => {
                if (res.code === 1) {
                    this.areaList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.areaList = [];
                    this.totals = 0;
                }
            });
        },
        add() {
            this.status = "add";
            this.dialogVisible = true;
        },
        handleAdd() {
            this.$post("/admin/entrance/add", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.handleClose();
                    this.loadAreaList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        edit(item) {
            this.$post("/admin/entrance/getone", {
                id: item.id
            }).then(res => {
                this.form = res.info;
                this.dialogVisible = true;
                this.status = "edit";
            });
        },
        handleEdit() {
            this.$post("/admin/entrance/edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.handleClose();
                    this.loadAreaList();
                } else {
                    this.$message.error(res.msg);
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
                    this.$post("/admin/entrance/delete", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadAreaList();
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
            this.dialogVisible = false;
            this.form = {};
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
.search {
    display: flex;
}
.search-item {
    width: 180px;
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