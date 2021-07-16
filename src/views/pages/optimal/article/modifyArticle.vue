<template>
    <el-main>
        <el-form :model="form" ref="form" size="mini" label-width="120px">
            <el-form-item label="栏目:">
                <el-cascader
                    :options="markList"
                    :props="treeProps "
                    clearable
                    v-model="form.mark"
                    placeholder="请选择栏目"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="标题:">
                <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
            </el-form-item>
            <el-form-item label="缩略图:" prop="sort">
                <upload
                    ref="thumb"
                    url="/image_optimal"
                    :limit="3"
                    :file="JSON.stringify(form.thumb)"
                ></upload>
            </el-form-item>
            <el-form-item label="描述:">
                <el-input v-model="form.desc" placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item label="是否推荐:">
                <el-radio-group v-model="form.is_hot">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否首页展示:">
                <el-radio-group v-model="form.is_index">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                </el-radio-group>
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
            form: {
                title: "212",
                is_index: "0",
                is_hot: 0,
                desc: "213edfre"
            },
            markList: [],
            cate_list: [],
            isAdd: "true",
            treeProps: {
                value: "mark",
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
        console.log(this.form);
    },
    methods: {
        loadOption() {
            this.$post("/admin/optimal/school_cate", {
                sid: this.$route.query.sid
            }).then(res => {
                if (res.code === 1) {
                    this.markList = res.list; //地区搜索
                }
            });
        },
        //
        loadDetail() {
            this.$post("/admin/optimal/article_getOne", {
                id: this.form.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                    // this.form.desc = res.info.description;
                }
            });
        },
        handleClose() {
            this.$router.push({
                name: "optimal-article",
                query: {
                    sid: this.$route.query.sid
                }
            });
        },
        handleAdd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.mark = this.form.mark[this.form.mark.length - 1];
                    this.form.sid = this.$route.query.sid;
                    this.form.content = this.$refs.content.getHtml();
                    this.form.thumb = this.$refs.thumb.getFileList();
                    this.$post("/admin/optimal/article_add", this.form).then(
                        res => {
                            if (res.code === 1) {
                                this.$message({
                                  message: '添加成功',
                                  type: 'success'
                                });
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
                    this.form.content = this.$refs.content.getHtml();
                    this.$post("/admin/optimal/article_edit", this.form).then(
                        res => {
                            if (res.code === 1) {
                                this.$message({
                                  message: '编辑成功',
                                  type: 'success'
                                });
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
            content: " ",
            is_index: 0,
            is_hot: 0
        };
    }
};
</script>
        
 <style>
</style>