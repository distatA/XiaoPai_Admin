<template>
    <el-main>
        <div class="add">
            <div>
                <el-button type="primary" size="mini" @click="add">添加封面</el-button>
                <el-button
                    v-if="batchDeleteList.length>0"
                    @click="handleDelete"
                    type="danger"
                    size="mini"
                >批量删除</el-button>
            </div>
        </div>
        <el-table border :data="coverList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="explain" label="图片简介" align="center"></el-table-column>
            <el-table-column prop="position" label="图片类型" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
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
        <el-dialog
            :title="isAdd?'添加封面':'编辑封面'"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
            <el-form :model="form" ref="form" label-width="100px" size="mini">
                <el-form-item label="封面类型:">
                    <el-select v-model="form.type" size="mini" placeholder="请选择封面类型">
                        <el-option
                            v-for="item in optionType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="位置">
                    <el-select v-model="form.position" size="mini" placeholder="请选择封面位置">
                        <el-option
                            v-for="item in optionPosition"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="省份">
                    <el-select v-model="form.province" size="mini" placeholder="请选择省份">
                        <el-option
                            v-for="item in optionRegion"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload
                        action="https://new.schoolpi.net/admin/attach/image_test"
                        :limit="1"
                        list-type="picture-card"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        :on-exceed="handleExce"
                        :file-list="imageFileList"
                        :data="token"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input type="textarea" v-model="form.explain" placeholder="请输入封面说明"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.remark" placeholder="请输入封面备注"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button v-if="isAdd === true" type="primary" @click="handleAdd">确 定1</el-button>
                    <el-button v-else type="primary" @click="handleEdit">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-main>
</template>
<script>
/* eslint-disable*/
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
            optionRegion: [], //地区筛选
            optionPosition: [], //位置筛选
            optionType: [], //类型筛选
            type: "",
            coverList: [], //心测试题封面
            batchDeleteList: [], //批量删除的ID数组
            dialogVisible: false,
            form: {
                image_url: []
            },
            isAdd: true,
            token: {
                token: window.localStorage.getItem("token")
            }, //上传所需
            imageFileList: [],
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {
        this.loadTestCoverList();
        this.loadOptions();
    },
    methods: {
        //加载心理测试题列表
        loadTestCoverList(pages) {
            this.page = pages;
            this.$post("/admin/test/index_image", {
                page: this.page,
                num: this.offset,
                type: this.type,
                type_id: this.$route.query.id
            }).then(res => {
                if (res.code === 1) {
                    this.coverList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.coverList = [];
                    this.totals = 0;
                }
            });
        },
        //加载添加的配置项
        loadOptions() {
            this.$post("/admin/test/condition_image").then(res => {
                if (res.code === 1) {
                    this.optionRegion = res.province;
                    this.optionType = res.test_type;
                    this.optionPosition = res.position_type;
                }
            });
        },
        //获取分页的页数
        getCurrentage(pages) {
            this.loadTestCoverList(pages);
        },
        add() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        handleAdd() {
            this.$post("/admin/test/add_image", this.form).then(res => {
                if (res.code === 1) {
                    this.dialogVisible = false;
                    this.form = {};
                    this.loadTestCoverList();
                }
            });
        },
        //编辑获取单条信息详情
        edit(item) {
            this.isAdd = false;
            this.$post("/admin/test/getone_image", { id: item.id }).then(
                res => {
                    if (res.code === 1) {
                        this.form = res.info;
                        let obj = new Object();
                        for (let i = 0; i < res.info.image_url.length; i++) {
                            obj.url = res.info.image_url[i];
                        }
                        this.imageFileList.push(obj);
                        this.dialogVisible = true;
                    }
                }
            );
        },
        handleEdit() {
            this.$post("/admin/test/edit_image", this.form).then(res => {
                if (res.code === 1) {
                    this.dialogVisible = false;
                    this.form = {};
                    this.loadTestCoverList();
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
        },
        //删除list列表中的值
        handleRemove(file, fileList) {
            this.form.image_url = [];
            console.log(fileList);
            this.imageFileList = fileList;
            fileList.forEach(item => {
                console.log(item);
                if (item.response) {
                    this.form.image_url.push(item.response.data.all_path);
                } else {
                    this.form.image_url.push(item.url);
                }
            });
        },
        //上传成功
        handleSuccess(res, file, fileList) {
            let obj = new Object();
            obj.url = res.data.all_path;
            this.imageFileList.push(obj);
            this.form.image_url.push(res.data.all_path);
            console.log(this.form.image_url);
        },
        //超出上传个数
        handleExce() {
            this.$message.error("超出图片上传限定个数!");
        },
        //批量删除结合单个删除
        handleDelete(item) {
            if (item.id) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.id);
            }
            this.$confirm("此操作将永久删除该测试结果, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/test/delete_image", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadTestCoverList();
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
            this.imageFileList = [];
        }
    },
    mounted() {}
};
</script>
<style  scoped>
.head_img img {
    width: 100%;
    height: 100%;
}
.pagination {
    margin: 20px 0 0 -10px;
}
.search {
    display: flex;
}
.ml {
    margin-left: 20px;
}
.add {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
</style>