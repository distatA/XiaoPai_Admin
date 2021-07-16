<template>
    <el-main>
        <el-form
            class="form"
            label-position="right"
            :model="form"
            label-width="80px"
            size="mini"
            center
        >
            <el-form-item label="专家姓名:">
                <el-input class="input" v-model="form.name" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="分类:">
                <el-select v-model="form.cate_id" placeholder="请选择分类排序">
                    <el-option
                        v-for="item in optionsList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="头像:">
                <upload
                    ref="upload_headpic"
                    :limit="1"
                    url="/image_expert"
                    :file="JSON.stringify(form.headpic)"
                ></upload>
            </el-form-item>
            <el-form-item label="手机号:">
                <el-input class="input" v-model="form.mobile" placeholder="请输入分类排序"></el-input>
            </el-form-item>
            <el-form-item label="排序:">
                <el-input class="input" v-model="form.sort" placeholder="请输入分类排序"></el-input>
            </el-form-item>
            <el-form-item label="擅长领域:">
                <el-input class="input" v-model="form.good_at" placeholder="请输入分类排序"></el-input>
            </el-form-item>
            <el-form-item label="介绍:">
                <el-input
                    class="input"
                    type="textarea"
                    :rows="7"
                    v-model="form.introduce"
                    placeholder="请输入分类排序"
                ></el-input>
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
import upload from "@/components/upload";
export default {
    components: {
        upload
    },
    data() {
        return {
            optionsList: [],
            form: {
                headpic: []
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
            this.$post("/admin/expert/condition_expert").then(res => {
                if (res.code === 1) {
                    this.optionsList = res.list;
                }
            });
        },
        loadDetail() {
            this.$post("/admin/expert/getone", { id: this.form.id }).then(
                res => {
                    if (res.code === 1) {
                        this.form = res.info;
                    }
                }
            );
        },
        handleAdd() {
            this.form.headpic = this.$refs.upload_headpic.getFileList();
            this.$post("/admin/expert/add", this.form).then(res => {
                if (res.code === 1) {
                    this.$router.push("/expert/expert");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleEdit() {
            this.form.headpic = this.$refs.upload_headpic.getFileList();
            this.$post("/admin/expert/edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$router.push("/expert/expert");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleClose() {
            this.$router.push("/expert/expert");
        }
    },
    mounted() {}
};
</script>
<style scoped>
.input {
    width: 500px;
}
</style>