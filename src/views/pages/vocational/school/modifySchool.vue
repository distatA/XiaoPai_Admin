<template>
    <el-main>
        <el-form
            class="form"
            label-position="right"
            :model="form"
            label-width="120px"
            size="mini"
            center
        >
            <div v-if="isAdd ==true">
                <el-form-item label="地区:">
                    <el-cascader
                        :options="optionList"
                        :props="treeProps "
                        clearable
                        v-model="city"
                        placeholder="请选择地区"
                        @change="loadSchoolList"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="学校:">
                    <el-select v-model="form.sid" placeholder="请选择学校">
                        <el-option
                            v-for="item in schoolList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div v-else>
                <el-form-item label="学校名称:">
                    <el-input v-model="form.name" disabled clearable></el-input>
                </el-form-item>
            </div>
            <!-- <el-form-item label="分享数:">
                <el-input v-model="form.share" placeholder="请输入分享数" clearable></el-input>
            </el-form-item> -->
            <el-form-item label="排序:">
                <el-input v-model="form.sort" placeholder="请输入排序" clearable></el-input>
            </el-form-item>
            <el-form-item label="是否显示:">
                <el-radio-group v-model="form.is_show">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="联系电话:">
                <el-input v-model="form.mobile" placeholder="请输入联系号码(不能超过15位)" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="招生简章名称:">
                <el-input v-model="form.enrollment_name" placeholder="请输入招生简章名称" clearable></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="招生简章内容:">
                <editor
                    editorId="editor_enrollment_content"
                    :content="form.enrollment_content"
                    ref="editor_enrollment_content"
                ></editor>
            </el-form-item> -->
            <el-form-item>
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="handleAdd">确 定</el-button>
                <el-button v-else type="primary" @click="handleEdit">确 定</el-button>
            </el-form-item>
        </el-form>
    </el-main>
</template>
<script>
/* eslint-disable*/
import editor from "@/components/editor";
export default {
    components: {
        editor
    },
    data() {
        return {
            city: [], //根据地区搜索学校
            optionList: [],
            schoolList: [],
            form: {},
            isAdd: true,
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {
        this.isAdd = this.$route.query.isAdd;
        this.form.sid = this.$route.query.sid;
        this.loadOption();
        if (this.form.sid) {
            this.loadDetail();
        }
    },
    methods: {
        //加载地区供添加编辑搜索使用
        loadOption() {
            this.$post("/admin/vocational/condition_school").then(res => {
                if (res.code === 1) {
                    this.optionList = res.region;
                }
            });
        },
        //根据地区搜索学校
        loadSchoolList() {
            this.city = this.city[this.city.length - 1];
            this.$post("/admin/vocational/condition_school", {
                city: this.city
            }).then(res => {
                if (res.code === 1) {
                    this.schoolList = res.school_list;
                }
            });
        },
        loadDetail() {
            this.$post("/admin/vocational/getone", { sid: this.form.sid }).then(
                res => {
                    if (res.code === 1) {
                        this.form = res.info;
                    }
                }
            );
        },
        handleAdd() {
            // this.form.enrollment_content = this.$refs.editor_enrollment_content.getHtml();
            this.$post("/admin/vocational/add", this.form).then(res => {
                if (res.code === 1) {
                    this.$router.push("/vocational/index");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleEdit() {
            // this.form.enrollment_content = this.$refs.editor_enrollment_content.getHtml();
            this.$post("/admin/vocational/edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$router.push("/vocational/index");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleClose() {
            this.$router.push("/vocational/index");
        }
    },
    mounted() {
        this.form = {
            enrollment_content: " "
        };
        // this.init();
        // this.$nextTick(function() {
        //     this.init();
        // });
    }
};
</script>
<style scoped>
.input {
    width: 500px;
}
</style>