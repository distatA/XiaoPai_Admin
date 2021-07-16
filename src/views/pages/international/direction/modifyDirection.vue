<template>
    <el-main>
        <el-form
            :model="form"
            class="form"
            ref="form"
            size="mini"
            :rules="formrules"
            label-width="100px"
        >
            <el-form-item label="名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
                <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="服务费:" prop="fee">
                <el-input v-model="form.fee" placeholder="请输入服务费"></el-input>
            </el-form-item>
            <el-form-item label="询问数:" prop="ask">
                <el-input v-model="form.ask" placeholder="请输入询问数"></el-input>
            </el-form-item>
            <el-form-item label="描述:" prop="description">
                <el-input v-model="form.description" placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item label="背景图:" prop="backimg">
                <upload
                    ref="backimg"
                    url="/image_abroad"
                    :limit="1"
                    :file="JSON.stringify(form.backimg)"
                ></upload>
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
import upload from "@/components/upload";
import editor from "@/components/editor";
export default {
    components: {
        upload,
        editor
    },
    data() {
        return {
            form: {},
            isAdd: "true",
            formrules: {
                name: [
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
            this.$post("/admin/abroad/direction_getOne", {
                id: this.form.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                }
            });
        },
        handleClose() {
            this.$router.push({
                name: "international-direction",
                query: {
                    sid: this.$route.query.sid
                }
            });
        },
        handleAdd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.sid = this.$route.query.sid;
                    this.form.content = this.$refs.content.getHtml();
                    this.form.backimg = this.$refs.backimg.getFileList();
                    this.$post("/admin/abroad/direction_add", this.form).then(
                        res => {
                            if (res.code === 1) {
                                this.handleClose();
                            }
                        }
                    );
                }
            });
        },
        handleEdit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.sid = this.$route.query.sid;
                    this.form.content = this.$refs.content.getHtml();
                    this.form.backimg = this.$refs.backimg.getFileList();
                    this.$post("/admin/abroad/direction_edit", this.form).then(
                        res => {
                            if (res.code === 1) {
                                this.handleClose();
                            }
                        }
                    );
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
.form {
    width: 700px;
}
.mt {
    margin-top: 10px;
}
</style>