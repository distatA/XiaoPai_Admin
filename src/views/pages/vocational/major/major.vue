<template>
    <el-main>
        <el-row class="add">
            <div>
                <el-button @click="add" type="primary" size="mini">添加专业</el-button>
                <el-button
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                    type="danger"
                    size="mini"
                >批量删除</el-button>
            </div>
        </el-row>
        <el-table border :data="hotMajorList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="专业名称" align="center"></el-table-column>
            <el-table-column prop="first" label="一级专业" align="center"></el-table-column>
            <el-table-column prop="second" label="二级专业" align="center"></el-table-column>
            <el-table-column prop="ranking" label="排名" align="center"></el-table-column>
            <el-table-column label="推荐指数" align="center">
                <template slot-scope="scope">
                    <el-rate
                        v-model="scope.row.recommend"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}"
                    ></el-rate>
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
                @current-change="getCurrentPage"
            ></el-pagination>
        </div>
        <!--添加表单弹窗-->
        <el-dialog
            :title="isAdd?'添加专业':'编辑专业'"
            :visible.sync="dialogVisible"
            center
            :before-close="handleClose"
        >
            <el-form label-position="right" :model="form" size="small" label-width="80px" center>
                <el-form-item label="专业:">
                    <el-cascader
                        :options="optionList"
                        :props="treeProps "
                        clearable
                        v-model="form.cid"
                        placeholder="请选择专业"
                        style="width:100%"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="排名:">
                    <el-input v-model="form.ranking" placeholder="请输入排名"></el-input>
                </el-form-item>
                <el-form-item label="推荐指数:">
                    <div class="mt">
                        <el-rate
                            v-model="form.recommend"
                            show-score
                            text-color="#ff9900"
                            score-template="{value}"
                        ></el-rate>
                    </div>
                </el-form-item>
                <el-form-item label="热门:">
                    <el-radio-group v-model="form.is_hot">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="handleAdd">保存</el-button>
                <el-button v-else type="primary" @click="handleEdit">编辑</el-button>
            </span>
        </el-dialog>
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
            optionList: [], //配置项（专业列表）
            hotMajorList: [], //热门专业列表
            dialogVisible: false, //添加弹窗
            form: {},
            isAdd: true, //判断表单是添加还是编辑
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
        this.loadHotMajorList();
        this.loadOption();
    },
    methods: {
        getCurrentPage(pages) {
            this.loadHotMajorList(pages);
        },
        //加载热门专业列表
        loadHotMajorList(pages) {
            this.page = pages;
            this.$post("/admin/vocational/index_career", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.hotMajorList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.hotMajorList = res.list;
                    this.totals = 0;
                }
            });
        },
        //加载所有的专业供添加编辑使用
        loadOption() {
            this.$post("/admin/vocational/condition_career").then(res => {
                if (res.code === 1) {
                    this.optionList = res.career_list;
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
                    arr.push(item.cid);
                    this.batchDeleteList = [...arr];
                });
            }
            console.log(this.batchDeleteList);
        },
        //添加角色
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        //确认添加
        handleAdd() {
            this.form.cid = this.form.cid[this.form.cid.length - 1];
            this.$post("/admin/vocational/add_career", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "添加成功",
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.form = {}; //清空表单
                    this.loadHotMajorList();
                }
            });
        },
        edit(item) {
            this.isAdd = false;
            this.form.cid = item.cid;
            this.$post("/admin/vocational/getone_career", {
                cid: item.cid
            }).then(res => {
                if (res.code === 1) {
                    this.dialogVisible = true;
                    this.form = res.info;
                }
            });
        },
        handleEdit() {
            this.$post("/admin/vocational/edit_career", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "修改成功",
                        type: "success"
                    });
                    this.dialogVisible = false;
                    this.form = {}; //清空表单
                    this.loadHotMajorList();
                }
            });
        },
        //批量删除结合单个删除
        handleDelete(item) {
            if (item.cid) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.cid);
            }
            this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/vocational/delete_career", {
                        cid: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadHotMajorList();
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
.add {
    margin-bottom: 20px;
}
.forbidden {
    color: red;
}
.usual {
    color: blue;
}
</style>