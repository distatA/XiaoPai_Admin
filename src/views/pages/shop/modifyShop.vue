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
            <el-form-item label="商品名称:" prop="title">
                <el-input v-model="form.title" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
                <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="兑换积分:" prop="price">
                <el-input v-model="form.price" placeholder="请输入兑换积分"></el-input>
            </el-form-item>
            <el-form-item label="库存:" prop="stock">
                <el-input v-model="form.stock" placeholder="请输入库存"></el-input>
            </el-form-item>
            <el-form-item label="是否上架:" prop="shelf">
                <el-radio-group v-model="form.shelf">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="封面图:" prop="thumb">
                <upload
                    ref="cover"
                    url="/image_abroad"
                    :limit="1"
                    :file="JSON.stringify(form.cover)"
                ></upload>
            </el-form-item>
            <el-form-item label="商品图片:" prop="thumb">
                <upload
                    ref="thumb"
                    url="/image_abroad"
                    :limit="4"
                    :file="JSON.stringify(form.thumb)"
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
            fullscreenLoading: false,
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
            this.$post("/admin/goods/getone", {
                id: this.form.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                }
            });
        },
        handleClose() {
            this.$router.push({
                name: "shop-shop"
            });
        },
        handleAdd() {
            // this.$refs.form.validate(valid => {
            //     if (valid) {
            console.log(this.$refs.thumb.getFileList());
            this.form.sid = this.$route.query.sid;
            this.form.thumb = this.$refs.thumb.getFileList();
            this.form.cover = this.$refs.cover.getFileList();
            this.form.content = this.$refs.content.getHtml();
            this.$post("/admin/goods/add", this.form).then(res => {
                if (res.code === 1) {
                    this.handleClose();
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: "error"
                    });
                }
            });
            //     }
            // });
        },
        handleEdit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.sid = this.$route.query.sid;
                    this.form.thumb = this.$refs.thumb.getFileList();
                    this.form.cover = this.$refs.cover.getFileList();
                    this.form.content = this.$refs.content.getHtml();
                    this.$post("/admin/goods/edit", this.form).then(res => {
                        if (res.code === 1) {
                            this.handleClose();
                        } else {
                            this.$message({
                                showClose: true,
                                message: res.msg,
                                type: "error"
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
.form {
    width: 700px;
}
.mt {
    margin-top: 10px;
}
</style>