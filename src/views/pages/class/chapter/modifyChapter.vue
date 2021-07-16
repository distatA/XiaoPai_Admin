<template>
    <el-main>
        <el-form
            class="form"
            label-position="right"
            :model="form"
            label-width="120px"
            size="mini"
            center
        >
            <el-form-item label="章节标题:">
                <el-input v-model="form.title" placeholder="请输入章节标题" clearable></el-input>
            </el-form-item>
            <el-form-item label="章节:">
                <el-input v-model="form.chapter" type="number" placeholder="请输入章节" clearable></el-input>
            </el-form-item>
            <el-form-item label="视频封面:" v-if="isAdd">
                <upload
                    ref="video_cover"
                    url="/image_course"
                    :limit="1"
                    :file="JSON.stringify(form.video_cover)"
                ></upload>
            </el-form-item>
            <el-form-item label="上传视频:" v-if="isAdd">
                <el-upload
                    action
                    class="upload-demo"
                    ref="upload"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="uploadVideo"
                >
                    <el-button
                        slot="trigger"
                        size="small"
                        type="primary"
                        v-loading.fullscreen.lock="fullscreenLoading"
                    >选取视频文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="视频路径:" v-if="isAdd">
                <el-input v-model="form.video_path" disabled placeholder="请输入视频路径" clearable></el-input>
            </el-form-item>
            <el-form-item label="视频时长:" v-if="isAdd">
                <el-input v-model="form.video_duration" placeholder="请输入视频时长" clearable></el-input>
            </el-form-item>
            <el-form-item label="点击量:">
                <el-input v-model="form.hits" placeholder="请输入点击量" clearable></el-input>
            </el-form-item>
            <el-form-item label="章节内容:">
                <editor editorId="content" :content="form.content" ref="content"></editor>
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
import editor from "@/components/editor";
import upload from "@/components/upload";
import TcVod from "vod-js-sdk-v6";
import axios from "axios";
function getSignature() {
    return axios
        .post("http://new.schoolpi.net/admin/video/signature")
        .then(function(response) {
            return response.data;
        });
}
export default {
    components: {
        editor,
        upload
    },
    data() {
        return {
            city: [], //根据地区搜索学校
            optionList: [],
            schoolList: [],
            form: {},
            isAdd: true,
            fullscreenLoading: false,
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {
        this.form.cid = this.$route.query.cid;
        this.loadOption();
        if (this.form.cid) {
            this.isAdd = false;
            this.loadDetail();
        }
        console.log(this.isAdd);
    },
    methods: {
        //加载地区供添加编辑搜索使用
        loadOption() {
            this.$post("/admin/course/genre").then(res => {
                if (res.code === 1) {
                    this.optionList = res.list;
                }
            });
        },
        loadDetail() {
            this.$post("/admin/course/catalogue_getOne", {
                cid: this.form.cid
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                }
            });
        },
        //腾讯云上传视频
        uploadVideo(file, fileList) {
            var that = this;
            that.fullscreenLoading = true;
            // 初始化签名
            const tcVod = new TcVod({
                getSignature: getSignature
            });
            const uploader = tcVod.upload({
                mediaFile: file.raw // 媒体文件（视频或音频或图片），类型为 File
            });
            uploader
                .done(function(res) {})
                .then(function(doneResult) {
                    that.$message({
                        message: "视频上传成功",
                        type: "success"
                    });
                    that.form.video_path = doneResult.video.url;
                    that.fullscreenLoading = false;
                })
                .catch(function(err) {});
        },
        handleAdd() {
            this.form.content = this.$refs.content.getHtml();
            this.form.video_cover = this.$refs.video_cover.getFileList();
            this.form.pid = this.$route.query.pid;
            this.$post("/admin/course/catalogue_add", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.handleClose();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleEdit() {
            this.form.pid = this.$route.query.pid;
            this.$post("/admin/course/catalogue_edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.handleClose();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleClose() {
            this.$router.push({
                name: "class-chapter",
                query: {
                    pid: this.$route.query.pid,
                    cid: this.$route.query.cid
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
<style scoped>
.form {
    width: 700px;
}
.input {
    width: 500px;
}
.el-loading-mask.is-fullscreen {
    z-index: 14000 !important;
}
.el-form >>> .el-from-item >>> .el-form-item__content {
    z-index: -1 !important;
    margin-left: 10px !important;
}
.w-e-text-container {
    z-index: 1 !important;
}
</style>