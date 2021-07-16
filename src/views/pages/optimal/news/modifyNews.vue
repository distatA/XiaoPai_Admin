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
            <el-form-item label="文章主标题:">
                <el-input class="input" v-model="form.main" placeholder="请输入文章主标题"></el-input>
            </el-form-item>
            <el-form-item label="文章副标题:">
                <el-input class="input" v-model="form.subtitle" placeholder="请输入文章副标题"></el-input>
            </el-form-item>
            <el-form-item label="文章标题:">
                <el-input class="input" v-model="form.title" placeholder="请输入文章标题"></el-input>
            </el-form-item>
            <el-form-item label="适用地区:">
                <el-select v-model="form.province" placeholder="请选择适用地区">
                    <el-option
                        v-for="item in optionsList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="优选分类:">
                <el-radio-group v-model="form.youxuan">
                    <el-radio :label="1">本科优选</el-radio>
                    <el-radio :label="2">专科优选</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="缩略图:">
                <upload
                    ref="upload_thumb"
                    url="/image_article"
                    :limit="1"
                    :file="JSON.stringify(form.thumb)"
                ></upload>
            </el-form-item>
            <el-form-item label="描述:">
                <el-input class="input" v-model="form.desc" placeholder="请输入文章描述"></el-input>
            </el-form-item>
            <el-form-item label="内容:">
                <editor editorId="editor_content" :content="form.content" ref="editor_content"></editor>
            </el-form-item>
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
import upload from "@/components/upload";
export default {
    components: {
        editor,
        upload
    },
    data() {
        return {
            optionsList: [],
            form: {
                content: "",
                thumb: []
            },
            isAdd: true
        };
    },
    created() {
        this.loadOptions();

        this.isAdd = this.$route.query.isAdd;
        this.form.id = this.$route.query.id;
        if (this.form.id) {
            this.loadDetail();
        }
    },
    methods: {
        loadOptions() {
            this.$post("/admin/region/get_regionlist").then(res => {
                if (res.code === 1) {
                    this.optionsList = res.list;
                }
            });
        },
        loadDetail() {
            this.$post("/admin/optimal/news_getOne", { id: this.form.id }).then(
                res => {
                    if (res.code === 1) {
                        this.form = res.info;
                        this.form.desc = res.info.description;
                    }
                }
            );
        },
        handleAdd() {
            this.form.content = this.$refs.editor_content.getHtml();
            this.form.thumb = this.$refs.upload_thumb.getFileList();
            this.$post("/admin/optimal/news_add", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.$router.push("/optimal/index");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleEdit() {
            this.form.content = this.$refs.editor_content.getHtml();
            this.form.thumb = this.$refs.upload_thumb.getFileList();
            this.$post("/admin/optimal/news_edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.$router.push("/optimal/index");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleClose() {
            this.$router.push("/optimal/index");
        }
    },
    mounted() {
        this.form.content = " "; //改变content值才能显示富文本（bug，待修复）
    }
};
</script>
<style scoped>
.input {
    width: 500px;
}
</style>