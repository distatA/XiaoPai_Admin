<template>
    <el-main>
        <el-form :model="form" ref="form" size="mini" label-width="100px">
            <el-form-item label="省份:" prop="type">
                <el-select v-model="form.province" placeholder="请选择省份">
                    <el-option
                        v-for="item in region"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="year">
                <el-input v-model="form.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="背景图" prop="plan_num">
                <upload
                    ref="back_image"
                    url="/image_live"
                    :limit="1"
                    :file="JSON.stringify(form.back_image)"
                ></upload>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleClose">取消</el-button>
                <el-button v-if="state=='add'" type="primary" @click="handleAdd">确定</el-button>
                <el-button v-else type="primary" @click="handleEdit">确定</el-button>
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
            form: {},
            region: [],
            cate_list: [],
            state: "add",
           
        };
    },
    created() {
        this.loadOption();
        this.state = this.$route.query.state;
        this.form.id = this.$route.query.id;
        if (this.form.id) {
            this.loadDetail();
        }
    },
    methods: {
        loadOption() {
            this.$post("/admin/classifie/condition_exam").then(res => {
                if (res.code === 1) {
                    this.region = res.region; //地区搜索
                }
            });
        },
        //
        loadDetail() {
            this.$post("/admin/classifie/getone_exam", {
                id: this.form.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                    // this.form.desc = res.info.description;
                }
            });
        },
        handleClose() {},
        handleAdd() {
            this.form.back_image = this.$refs.back_image.getFileList();
            this.$post("/admin/classifie/add_exam", this.form).then(res => {
                if (res.code === 1) {
                    this.$router.push("/exam/setting");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleEdit() {
            this.form.back_image = this.$refs.back_image.getFileList();

            this.$post("/admin/classifie/edit_exam", this.form).then(res => {
                if (res.code === 1) {
                    this.$router.push("/exam/setting");
                } else {
                    this.$message.error(res.msg);
                }
            });
        }
    },
    mounted() {
        
    }
};
</script>
        
 <style>
</style>