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
            <el-form-item label="文章标题:">
                <el-input class="input" v-model="form.title" clearable placeholder="请输入文章标题"></el-input>
            </el-form-item>

            <el-form-item label="视频封面:" v-if="state == 'add'">
                <upload
                    ref="thumb"
                    url="/image_optimal"
                    :limit="1"
                    :file="JSON.stringify(form.thumb)"
                ></upload>
            </el-form-item>
            <el-form-item label="上传视频" v-if="state == 'add'">
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
            <el-form-item label="视频地址:" v-if="state == 'add'">
                <el-input class="input" v-model="form.video_url" disabled placeholder="请上传视频"></el-input>
            </el-form-item>
            <el-form-item label="是否推荐:">
                <el-radio-group v-model="form.is_hot">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否首页显示:">
                <el-radio-group v-model="form.is_index">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="内容:">
                <editor editorId="content" :content="form.content" ref="content"></editor>
            </el-form-item>

            <el-form-item>
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="state == 'add'" type="primary" @click="handleAdd">确 定</el-button>
                <el-button v-else type="primary" @click="handleEdit">确 定</el-button>
            </el-form-item>
        </el-form>
    </el-main>
</template>
<script>
/* eslint-disable*/
import TcVod from "vod-js-sdk-v6";
import axios from "axios";
function getSignature() {
    return axios
        .post("http://new.schoolpi.net/admin/video/signature")
        .then(function(response) {
            return response.data;
        });
}
import editor from "@/components/editor";
import upload from "@/components/upload";
export default {
    components: {
        editor,
        upload
    },
    data() {
        return {
            fullscreenLoading: false, //全屏加载
            optionsList: [],
            form: {
                content: "",
                thumb: []
            },
            state: "add",
            token: {
                token: window.localStorage.getItem("token")
            }
        };
    },
    created() {
        this.loadOptions();
        this.state = this.$route.query.state;
        this.form.sid = this.$route.query.sid;
        if (this.$route.query.id) {
            this.form.id = this.$route.query.id;
            this.loadDetail();
        }
    },
    methods: {
        loadOptions() {
            this.$post("/admin/region/get_regionlist").then(res => {
                if (res.code === 1) {
                    this.optionsList = res.list;
                }
            });
        },
        loadDetail() {
            this.$post("/admin/optimal/video_getOne", {
                id: this.form.id
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
            uploader.on("media_progress", function(info) {
                console.log("上传进度", info.percent);
            });
            uploader.on("media_upload", function(info) {
                console.log("成功嘛？？", info);
            });

            uploader
                .done(function(res) {})
                .then(function(doneResult) {
                    console.log("doneResult", doneResult.video.url);
                    console.log(that.form);
                    that.$message({
                        message: "视频上传成功",
                        type: "success"
                    });
                    that.form.video_url = doneResult.video.url;
                    that.fullscreenLoading = false;
                })
                .catch(function(err) {});
        },
        handleAdd() {
            this.form.content = this.$refs.content.getHtml();
            this.form.thumb = this.$refs.thumb.getFileList();
            this.$post("/admin/optimal/video_add", this.form).then(res => {
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
            this.form.content = this.$refs.content.getHtml();
            this.$post("/admin/optimal/video_edit", this.form).then(res => {
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
                name: "optimal-video",
                query: {
                    sid: this.$route.query.sid
                }
            });
        }
    },
    mounted() {
        this.form.content = " "; //改变content值才能显示富文本（bug，待修复）
    }
};
</script>
<style scoped>
.input {
    width: 500px;
}
</style>