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
            <el-form-item label="专业名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入专业名称"></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
                <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="背景图:" prop="backimg">
                <upload
                    ref="backimg"
                    url="/image_abroad"
                    :limit="1"
                    :file="JSON.stringify(form.backimg)"
                ></upload>
            </el-form-item>
            <el-form-item label="培养目标:" prop="training">
                <el-input type="textarea" :rows="9" v-model="form.training" placeholder="请输入培养目标"></el-input>
            </el-form-item>
            <el-form-item label="就业方向:" prop="getjob">
                <el-input type="textarea" :rows="9" v-model="form.getjob" placeholder="请输入就业方向"></el-input>
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
                training: [
                    {
                        required: true,
                        message: "培养目标不能为空",
                        trigger: "blur"
                    }
                ],
                getjob: [
                    {
                        required: true,
                        message: "就业方向不能为空",
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
            this.$post("/admin/abroad/major_getOne", {
                id: this.form.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                }
            });
        },
        handleClose() {
            this.$router.push({
                name: "international-major",
                query: {
                    sid: this.$route.query.sid
                }
            });
        },
        handleAdd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.backimg = this.$refs.backimg.getFileList();
                    this.form.sid = this.$route.query.sid;
                    this.$post("/admin/abroad/major_add", this.form).then(
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
                    this.form.backimg = this.$refs.backimg.getFileList();
                    this.form.sid = this.$route.query.sid;
                    this.$post("/admin/abroad/major_edit", this.form).then(
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