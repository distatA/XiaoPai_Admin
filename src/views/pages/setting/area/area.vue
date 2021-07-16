<template>
    <el-main>
        <el-row class="add">
            <el-col :span="3">
                <el-button @click="addArea" type="primary" size="mini">添加地区</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="areaList"
            border
            borderstripe
            row-key="id"
            :tree-props="{children: 'child',hasChildren:'child.length>=0'}"
        >
            <el-table-column label="名称" prop="name" align="center"></el-table-column>
            <el-table-column label="省份全称" prop="fullname" align="center"></el-table-column>
            <el-table-column label="等级" prop="level" align="center"></el-table-column>
            <el-table-column label="是否热门" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.ishot"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                        @change="changeAreaStatus(scope.row)"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editArea(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="handleDelete(scope.row)" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totals"
                :page-size="offset"
                @current-change="loadAreaList"
            ></el-pagination>
        </div>
        <!-- 添加菜单对话框 -->
        <el-dialog
            :title="isAdd?'添加地区':'编辑地区'"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
        >
            <el-form ref="form" :model="form" label-width="100px" size="small" :rules="formrules">
                <el-form-item label="地区名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="省份名称" prop="fullname">
                    <el-input v-model="form.fullname" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="上级地区">
                    <el-cascader
                        :options="totalAreaList"
                        :props="treeProps "
                        clearable
                        v-model="form.parent_id"
                        placeholder="请选择上级地区"
                        style="width:100%"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="地区拼音" prop="pinyin">
                    <el-input v-model="form.pinyin" placeholder="请输入地区拼音"></el-input>
                </el-form-item>
                <el-form-item label="地区等级" prop="level">
                    <el-radio-group v-model="form.level">
                        <el-radio :label="1">省</el-radio>
                        <el-radio :label="2">市</el-radio>
                        <el-radio :label="3">区/县</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否热门" prop="ishot">
                    <el-radio-group v-model="form.ishot">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="handleAddArea" size="small">确 定</el-button>
                <el-button v-else type="primary" @click="handleEdit" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </el-main>
</template>

<script>
/* eslint-disable*/
export default {
    data() {
        return {
            page: 1,
            offset: 10,
            totals: 0,
            areaList: [], //地区列表
            dialogVisible: false,
            form: {}, //表单
            isAdd: true, //判断表单是添加还是编辑
            totalAreaList: [], //所有地区列表
            // 添加用户的表单数据
            // 树形控件的属性绑定对象
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            },
            //表单的验证
            formrules: {
                name: [
                    {
                        required: true,
                        message: "菜单名称不能为空",
                        trigger: "blur"
                    }
                ],
                fullname: [
                    {
                        required: true,
                        message: "省份名称不能为空",
                        trigger: "blur"
                    }
                ],
                pinyin: [
                    {
                        required: true,
                        message: "地区拼音不能为空",
                        trigger: "blur"
                    }
                ],
                level: [
                    {
                        required: true,
                        message: "地区等级不能为空",
                        trigger: "blur"
                    }
                ],
                ishot: [
                    {
                        required: true,
                        message: "热门不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },

    created() {
        this.getArea();
        this.loadAreaList();
    },
    methods: {
        // 获取地区数据
        loadAreaList(pages) {
            this.page = pages;
            this.$post("/admin/region/index", {
                page: this.page,
                num: this.offset
            }).then(res => {
                console.log(res);
                if (res.code === 1) {
                    this.areaList = res.list;
                    this.totals = res.all_num;
                }
            });
        },
        //获取所有地区列表
        getArea() {
            this.$post("/admin/region/get_regionlist").then(res => {
                if (res.code === 1) {
                    this.totalAreaList = res.list;
                }
            });
        },
        // 监听 switch 开关状态的改变
        changeAreaStatus(item) {
            this.$post("/admin/region/change_status", {
                id: item.id,
                dataSort: "ishot",
                sort: item.ishot
            }).then(res => {
                if (res.code === 1) {
                    this.$message.success(res.msg);
                }
            });
        },
        handleClose() {
            this.dialogVisible = false;
            console.log("222");
            this.$refs.form.resetFields();
        },

        //添加地区对话框展示
        addArea() {
            this.isAdd = true;
            this.dialogVisible = true;
        },
        // 确认添加菜单
        handleAddArea() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (this.form.parent_id) {
                        this.form.parent_id = this.form.parent_id[
                            this.form.parent_id.length - 1
                        ];
                    } else {
                        this.form.parent_id = 0;
                    }
                    this.$post("/admin/region/add", this.form).then(res => {
                        if (res.code === 1) {
                            this.$message.success(res.msg);
                            // 隐藏添加用户的对话框;
                            this.dialogVisible = false;
                            // 重新获取菜单列表数据;
                            this.loadAreaList();
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        // 点击编辑地区弹框
        editArea(item) {
            this.$post("/admin/region/getone", { id: item.id }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                    this.dialogVisible = true;
                    this.isAdd = false;
                }
            });
        },
        //提交编辑确定按钮
        handleEdit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$post("/admin/region/edit", this.form).then(res => {
                        if (res.code === 1) {
                            this.$message.success(res.msg);
                            this.dialogVisible = false;
                            this.loadAreaList();
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        // 点击删除弹框
        handleDelete(item) {
            console.log(item);
            this.$confirm("此操作将永久删除该地区, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/region/delete", { id: item.id }).then(
                        res => {
                            if (res.code === 1) {
                                this.$message({
                                    message: res.msg,
                                    type: "success"
                                });
                                //删除后重新拉取
                                this.loadAreaList();
                            }
                        }
                    );
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
.add {
    margin-bottom: 20px;
}
.pagination {
    margin: 20px 0 0 -10px;
}
</style>
