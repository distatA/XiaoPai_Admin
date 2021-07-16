<template>
    <el-main>
        <el-form :model="form" ref="form" size="mini" :rules="formrules" label-width="100px">
            <el-form-item label="标题:" prop="title">
                <el-input v-model="form.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
                <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="内容:" prop="content">
                <editor editorId="content" :content="form.content" ref="content"></editor>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="isAdd=='true'" type="primary" @click="handleAdd">确 定</el-button>
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
            form: {},
            isAdd: "true",
            formrules: {
                title: [
                    {
                        required: true,
                        message: "标题不能为空",
                        trigger: "blur"
                    }
                ],
                sort: [
                    {
                        required: true,
                        message: "排序不能为空",
                        trigger: "blur"
                    }
                ],
                content: [
                    {
                        required: true,
                        message: "内容不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {
        this.isAdd = this.$route.query.isAdd;
        console.log(this.isAdd);
        this.form.id = this.$route.query.id;
        if (this.form.id) {
            this.loadDetail();
        }
    },
    methods: {
        //
        loadDetail() {
            this.$post("/admin/classifie/getone_school_enroll", {
                id: this.form.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                }
            });
        },
        handleClose() {
            this.$router.push({
                name: "classifie-section",
                query: {
                    sid: this.$route.query.sid
                }
            });
        },
        handleAdd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.content = this.$refs.content.getHtml();
                    this.form.sid = this.$route.query.sid;
                    this.$post(
                        "/admin/classifie/add_school_enroll",
                        this.form
                    ).then(res => {
                        if (res.code === 1) {
                            this.$router.push({
                                name: "classifie-section",
                                query: {
                                    sid: this.$route.query.sid
                                }
                            });
                        }
                    });
                }
            });
        },
        handleEdit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.content = this.$refs.content.getHtml();
                    this.form.sid = this.$route.query.sid;
                    this.$post(
                        "/admin/classifie/edit_school_enroll",
                        this.form
                    ).then(res => {
                        if (res.code === 1) {
                            this.$router.push({
                                name: "classifie-section",
                                query: {
                                    sid: this.$route.query.sid
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    mounted() {
        this.form = {
            content: " "
        };
    }
};
</script>
        
 <style>
.mt {
    margin-top: 10px;
}
</style>