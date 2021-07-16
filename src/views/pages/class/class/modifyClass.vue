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
            <el-form-item label="学科:">
                <el-select v-model="form.genre" placeholder="请选择">
                    <el-option
                        v-for="item in optionList"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="课程标题:">
                <el-input v-model="form.title" placeholder="请输入课程标题" clearable></el-input>
            </el-form-item>
            <el-form-item label="课程封面:">
                <!-- <el-input v-model="form.cover" placeholder="请输入课程标题" clearable></el-input> -->
                <upload
                    ref="cover"
                    url="/image_course"
                    :limit="1"
                    :file="JSON.stringify(form.cover)"
                ></upload>
            </el-form-item>
            <el-form-item label="关键词:">
                <el-input v-model="form.keyword" placeholder="请输入关键词" clearable></el-input>
            </el-form-item>
            <el-form-item label="课程总期数:">
                <el-input v-model="form.periods" placeholder="请输入课程总期数" clearable></el-input>
            </el-form-item>
            <el-form-item label="讲师:">
                <el-input v-model="form.lecturer" placeholder="请输入讲师" clearable></el-input>
            </el-form-item>
            <el-form-item label="讲师头像:">
                <upload
                    ref="lecturer_head"
                    url="/image_course"
                    :limit="1"
                    :file="JSON.stringify(form.lecturer_head)"
                ></upload>
            </el-form-item>
            <el-form-item label="讲师简介:">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 8}"
                    v-model="form.lecturer_desc"
                    placeholder="请输入讲师简介"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="课程简介:">
                <editor editorId="description" :content="form.description" ref="description"></editor>
            </el-form-item>
            <el-form-item label="是否名师课堂 :">
                <el-radio-group v-model="form.famous">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="推荐 :">
                <el-radio-group v-model="form.is_top">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="state=='add'" type="primary" @click="handleAdd">确 定</el-button>
                <el-button v-else type="primary" @click="handleEdit">确 定</el-button>
            </el-form-item>
        </el-form>
    </el-main>
</template>
<script>
/* eslint-disable*/
import editor from "@/components/editor";
import upload from "@/components/upload";
export default {
    components: {
        editor,
        upload
    },
    data() {
        return {
            city: [], //根据地区搜索学校
            optionList: [],
            schoolList: [],
            form: {
                is_top: 0,
                famous: 0
            },
            state: "add",
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {
        this.state = this.$route.query.state;
        console.log(this.state);
        this.form.id = this.$route.query.id;
        this.loadOption();
        if (this.form.id) {
            this.loadDetail();
        }
    },
    methods: {
        //加载地区供添加编辑搜索使用
        loadOption() {
            this.$post("/admin/course/genre").then(res => {
                if (res.code === 1) {
                    this.optionList = res.list;
                }
            });
        },
        loadDetail() {
            this.$post("/admin/course/getone", { id: this.form.id }).then(
                res => {
                    if (res.code === 1) {
                        this.form = res.info;
                    }
                }
            );
        },
        handleAdd() {
            this.form.description = this.$refs.description.getHtml();
            this.form.lecturer_head = this.$refs.lecturer_head.getFileList();
            this.form.cover = this.$refs.cover.getFileList();
            this.$post("/admin/course/add", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.handleClose();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleEdit() {
            this.form.description = this.$refs.description.getHtml();
            this.form.lecturer_head = this.$refs.lecturer_head.getFileList();
            this.form.cover = this.$refs.cover.getFileList();
            this.$post("/admin/course/edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.handleClose();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleClose() {
            console.log(this.$route.query.id);
            this.$router.push({
                name: "class-chapter",
                query: {
                    pid: this.$route.query.id
                }
            });
        }
    },
    mounted() {
        this.form = {
            description: " ",
            is_top: 0,
            famous: 0
        };
    }
};
</script>
<style scoped>
.form {
    width: 800px;
}
.input {
    width: 500px;
}
</style>