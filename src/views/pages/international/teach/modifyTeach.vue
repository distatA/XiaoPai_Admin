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
            <el-form-item label="标题:" prop="name">
                <el-input v-model="form.name" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
                <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="内容:" prop="content">
                <el-input type="textarea" :rows="8" v-model="form.content" placeholder="请输入内容"></el-input>
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
export default {
    components: {
        upload
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
            this.$post("/admin/abroad/teaching_getOne", {
                id: this.form.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                }
            });
        },
        handleClose() {
            this.$router.push({
                name: "international-teach",
                query: {
                    sid: this.$route.query.sid
                }
            });
        },
        handleAdd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.sid = this.$route.query.sid;
                    this.$post("/admin/abroad/teaching_add", this.form).then(
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
                    this.$post("/admin/abroad/teaching_edit", this.form).then(
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
    mounted() {}
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