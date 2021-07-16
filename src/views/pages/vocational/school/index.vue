<template>
    <el-main>
        <div class="add">
            <div>
                <el-button @click="handleJump('',true)" type="primary" size="mini">添加学校</el-button>
                <el-button
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                    type="danger"
                    size="mini"
                >批量删除</el-button>
            </div>
            <div class="add">
                <el-cascader
                    :options="optionList"
                    :props="treeProps "
                    clearable
                    v-model="province"
                    placeholder="请选择地区"
                    class="mr"
                    size="mini"
                ></el-cascader>
                <el-input class="mr" v-model="name" placeholder="请输入报名点" size="mini"></el-input>
                <el-button type="primary" size="mini" @click="loadSchoolList(1,province,name)">搜索</el-button>
            </div>
        </div>
        <el-table border :data="schoolList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="学校名称" align="center"></el-table-column>
            <el-table-column label="地区" align="center">
                <template slot-scope="scope">{{scope.row.province}}-{{scope.row.city}}</template>
            </el-table-column>
            <el-table-column label="排序" align="center" width="80">
                <template slot-scope="scope">
                    <el-input
                        size="mini"
                        v-model="scope.row.sort"
                        @change="changeSort(scope.row,scope.row.sort,'sort')"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column label="是否展示" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.is_show"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                        @change="changeSort(scope.row,scope.row.is_show,'is_show')"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="400" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleMajor(scope.row,false)" type="primary" size="mini">招生专业</el-button>
                    <el-button @click="handleMessage(scope.row,false)" type="primary" size="mini">招生信息</el-button>
                    <el-button @click="handleJump(scope.row,false)" type="primary" size="mini">编辑</el-button>
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
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            province: "", //搜索城市
            name: "", //搜索学校名称
            optionList: [], //配置项（专业列表）
            schoolList: [], //热门专业列表
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
        this.loadSchoolList();
        this.loadOption();
    },
    methods: {
        getCurrentPage(pages) {
            this.loadSchoolList(pages, this.province, this.name);
        },
        //加载学校列表
        loadSchoolList(pages, province, name) {
            this.page = pages;
            if (province) {
                province = province[province.length - 1];
            }
            this.$post("/admin/vocational/index", {
                page: this.page,
                num: this.offset,
                province: province,
                name: name
            }).then(res => {
                if (res.code === 1) {
                    this.schoolList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.schoolList = res.list;
                    this.totals = 0;
                }
            });
        },
        //加载地区供添加编辑搜索使用
        loadOption() {
            this.$post("/admin/vocational/condition_school").then(res => {
                if (res.code === 1) {
                    this.optionList = res.region;
                }
            });
        },
        changeSort(item, value, dataSort) {
            this.$post("admin/vocational/ajaxsort", {
                sid: item.sid,
                dataSort: dataSort,
                sort: value
            }).then(res => {});
        },
        handleJump(item, isAdd) {
            this.$router.push({
                name: "vocational-modifySchool",
                query: {
                    sid: item.sid,
                    isAdd: isAdd
                }
            });
        },
        handleMajor(item) {
            // this.$router.push({
            //     name: "vocational-schoolMajor",
            //     query: {
            //         sid: item.sid
            //     }
            // });
            this.$router.push({
                name: 'vocational-specialty',
                query: {
                    school_id: item.sid
                }
            })
        },
        // 跳转至招生信息详情页
        handleMessage(item) {
            this.$router.push({
                name: 'vocational-message',
                query: {
                    sid: item.sid
                }
            })
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
                    arr.push(item.sid);
                    this.batchDeleteList = [...arr];
                });
            }
            console.log(this.batchDeleteList);
        },

        //批量删除结合单个删除
        handleDelete(item) {
            if (item.sid) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.sid);
            }
            this.$confirm("此操作将永久删除该学校, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/vocational/delete", {
                        sid: this.batchDeleteList
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
        handleClose() {
            this.form = {};
            this.imageFileList = [];
            this.dialogVisible = false;
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