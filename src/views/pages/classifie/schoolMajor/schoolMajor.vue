<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button type="primary" size="mini" @click="add">添加学校专业</el-button>
                <el-button
                    type="danger"
                    size="mini"
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                >批量删除</el-button>
            </div>
            <div class="flex">
                <el-input
                    class="mr-10"
                    clearable
                    v-model="name"
                    size="mini"
                    placeholder="请输入三级专业名称"
                ></el-input>
                <el-button size="mini" type="primary" @click="loadMajorList(name,1)">搜索</el-button>
            </div>
        </div>

        <el-table border :data="majorList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="school_name" label="学校名称" width="180"></el-table-column>
            <el-table-column prop="type" label="分类类型" width="180"></el-table-column>
            <el-table-column prop="name" label="专业名称" width="180"></el-table-column>
            <el-table-column prop="first" label="一级专业" align="center"></el-table-column>
            <el-table-column prop="second" label="二级专业" align="center"></el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
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
            <el-form :model="form" ref="form" size="mini" :rules="formrules" label-width="100px">
                <el-form-item label="类型:" prop="type">
                    <el-select v-model="form.type" multiple clearable placeholder="请选择类型">
                        <el-option
                            v-for="item in typeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专业" prop="cid">
                    <el-select v-model="form.cid" filterable clearable placeholder="请选择专业">
                        <el-option
                            v-for="item in allMajorList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleClose">取消</el-button>
                    <el-button v-if="isAdd" type="primary" @click="handleAdd">确定</el-button>
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
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            majorList: [],
            name: "",
            province: "", //地区
            typeList: [], //添加时类型
            allMajorList: [], //所有专业列表
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            },
            batchDeleteList: [], //批量删除按钮
            dialogVisible: false,
            isAdd: true,
            form: {},
            formrules: {
                type: [
                    {
                        required: true,
                        message: "类型不能为空",
                        trigger: "blur"
                    }
                ],
                cid: [
                    {
                        required: true,
                        message: "专业不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {
        this.loadMajorList();
        this.loadOptions();
    },
    methods: {
        loadOptions() {
            this.$post("/admin/classifie/condition_school_career").then(res => {
                if (res.code === 1) {
                    this.typeList = res.career_type; //地区搜索
                    this.allMajorList = res.career_list;
                }
            });
        },
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            console.log(pages);
            this.loadMajorList(this.name, pages);
        },
        //加载学校列表
        loadMajorList(name, pages) {
            this.page = pages;
            this.$post("/admin/classifie/index_school_career", {
                page: this.page,
                num: this.offset,
                name: name,
                sid: this.$route.query.sid
            }).then(res => {
                if (res.code === 1) {
                    this.majorList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.majorList = [];
                    this.totals = 0;
                }
            });
        },
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        handleAdd() {
            this.form.sid = this.$route.query.sid;
            this.$post("/admin/classifie/add_school_career", this.form).then(
                res => {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.handleClose();
                    this.loadMajorList();
                }
            );
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
            this.$confirm("此操作将永久删除专业, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/classifie/delete_school_career", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadMajorList();
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
.mr-10 {
    margin-right: 20px;
}
.ml {
    margin-left: 20px;
    border: 1px #ccc solid;
    padding: 2px 5px;
    border-radius: 3px;
    cursor: pointer;
}
</style>