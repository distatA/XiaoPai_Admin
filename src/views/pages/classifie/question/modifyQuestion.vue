<template>
    <el-main>
        <el-form :model="form" ref="form" size="mini" :rules="formrules" label-width="100px">
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
            <el-form-item label="所属栏目:" prop="cate_id">
                <el-cascader
                    :options="cate_list"
                    :props="treeProps "
                    clearable
                    v-model="form.cate_id"
                    placeholder="请选择所属栏目"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="标题:" prop="title">
                <el-input v-model="form.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
                <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="标签:" prop="tags">
                <el-input v-model="form.tags" placeholder="请输入真题标签"></el-input>
            </el-form-item>
            <el-form-item label="标签颜色:" prop="tags_color">
                <el-color-picker v-model="form.tags_color"></el-color-picker>
            </el-form-item>
            <el-form-item label="发布时间:" prop="addtime">
                <el-date-picker
                    v-model="form.addtime"
                    type="date"
                    placeholder="选择发布时间"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="timestamp"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="文件下载地址:" prop="tags_color">
                <el-upload
                    class="upload-demo"
                    :data="token"
                    action="http://new.schoolpi.net/admin/attach/file_class"
                    :on-remove="handleRemove"
                    :limit="1"
                    :file-list="fileList"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                    :on-exceed="handleExceed"
                >
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
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
            form: {
                file_url: []
            },
            region: [],
            cate_list: [],
            isAdd: "true",
            formrules: {},
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            },
            fileList: [],
            token: {
                token: window.localStorage.getItem("token")
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
        beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 60;

            console.log(isLt2M);
            if (!isLt2M) {
                this.$message.error("上传文件大小不能超过 50MB!");
            }
            return isLt2M;
        },
        loadOption() {
            this.$post("/admin/classifie/condition_question").then(res => {
                if (res.code === 1) {
                    this.region = res.region; //地区搜索
                    this.cate_list = res.cate_list;
                }
            });
        },
        //
        loadDetail() {
            this.$post("/admin/classifie/getone_question", {
                id: this.form.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                    this.form.addtime = this.form.addtime * 1000;
                    if (res.info.file_url.length > 0) {
                        let obj = {};
                        obj.name = res.info.title;
                        obj.url = res.info.file_url[0];
                        this.fileList.push(obj);
                    }

                    // this.form.desc = res.info.description;
                }
            });
        },
        handleSuccess(res, file, fileList) {
            if (res.errno === 0) {
                let obj = new Object();
                obj.name = this.form.title;
                obj.url = res.data.all_path;
                this.fileList.push(obj);
                this.form.file_url.push(res.data.all_path);
            } else {
                this.fileList = [];
                this.$message.error(res.data.msg);
            }
        },
        handleRemove(file, fileList) {
            this.form.file_url = [];
            this.fileList = fileList;
            fileList.forEach(item => {
                console.log(item);
                if (item.response) {
                    this.form.file_url.push(item.response.data.all_path);
                } else {
                    this.form.file_url.push(item.url);
                }
            });
        },
        handleExceed() {
            this.$message.error("超出文件上传限定个数!");
        },
        handleClose() {},
        handleAdd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.content = this.$refs.content.getHtml();
                    this.form.cate_id = this.form.cate_id[
                        this.form.cate_id.length - 1
                    ];
                    this.form.addtime = this.form.addtime / 1000;
                    this.$post("/admin/classifie/add_question", this.form).then(
                        res => {
                            if (res.code === 1) {
                                this.$router.push("/classifie/question");
                            } else {
                                this.$message.error(res.msg);
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
                    if (typeof this.form.cate_id != "number") {
                        this.form.cate_id = this.form.cate_id[
                            this.form.cate_id.length - 1
                        ];
                    }
                    this.form.addtime = this.form.addtime / 1000;
                    this.$post(
                        "/admin/classifie/edit_question",
                        this.form
                    ).then(res => {
                        if (res.code === 1) {
                            this.$router.push("/classifie/question");
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                }
            });
        }
    },
    mounted() {
        this.form = {
            content: " ",
            file_url: []
        };
    }
};
</script>
        
 <style>
.mt {
    margin-top: 10px;
}
</style>