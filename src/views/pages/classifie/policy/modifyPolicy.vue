<template>
    <el-main>
        <el-form :model="form" ref="form" size="mini" label-width="100px">
            <el-form-item label="地区:" prop="province">
                <el-select v-model="form.province" placeholder="请选择地区">
                    <el-option
                        v-for="item in region"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属栏目:">
                <el-cascader
                    :options="cate_list"
                    :props="treeProps "
                    clearable
                    v-model="form.cate_id"
                    placeholder="请选择所属栏目"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="标题:">
                <el-input v-model="form.name" placeholder="请输入政策标题"></el-input>
            </el-form-item>
            <el-form-item label="排序:">
                <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="缩略图:" prop="tags">
                <upload
                    ref="thumb"
                    url="/image_class"
                    :limit="1"
                    :file="JSON.stringify(form.thumb)"
                ></upload>
            </el-form-item>
            <el-form-item label="内容简介:" prop="tags">
                <el-input type="textarea" v-model="form.description" placeholder="请输入内容简介"></el-input>
            </el-form-item>
            <el-form-item label="内容:">
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
            isAdd: "true",
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {
        this.loadOption();
        this.isAdd = this.$route.query.isAdd;
        console.log(this.isAdd);
        this.form.id = this.$route.query.id;
        if (this.form.id) {
            this.loadDetail();
        }
    },
    methods: {
        loadOption() {
            this.$post("/admin/classifie/condition_policy").then(res => {
                if (res.code === 1) {
                    this.region = res.region; //地区搜索
                    this.cate_list = res.cate_list;
                }
            });
        },
        //
        loadDetail() {
            this.$post("/admin/classifie/getone_policy", {
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
            this.form.content = this.$refs.content.getHtml();
            this.form.thumb = this.$refs.thumb.getFileList();
            console.log(this.form);
            this.form.cate_id = this.form.cate_id[this.form.cate_id.length - 1];
            this.$post("/admin/classifie/add_policy", this.form).then(res => {
                if (res.code === 1) {
                    this.$router.push("/classifie/policy");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleEdit() {
            this.form.content = this.$refs.content.getHtml();
            this.form.thumb = this.$refs.thumb.getFileList();
            console.log(this.form);

            if (typeof this.form.cate_id != "number") {
                this.form.cate_id = this.form.cate_id[
                    this.form.cate_id.length - 1
                ];
            }
            this.$post("/admin/classifie/edit_policy", this.form).then(res => {
                if (res.code === 1) {
                    this.$router.push("/classifie/policy");
                } else {
                    this.$message.error(res.msg);
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
</style>