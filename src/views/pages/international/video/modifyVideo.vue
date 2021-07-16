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
            <el-form-item label="标题:" prop="title">
                <el-input v-model="form.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
                <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
            </el-form-item>

            <el-form-item label="视频封面:" prop="thumb" v-if="isAdd == 'true'">
                <upload
                    ref="thumb"
                    url="/image_abroad"
                    :limit="1"
                    :file="JSON.stringify(form.thumb)"
                ></upload>
            </el-form-item>
            <el-form-item label="上传视频:" prop="thumb" v-if="isAdd == 'true'">
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
            <el-form-item label="视频地址:" prop="description" v-if="isAdd == 'true'">
                <el-input v-model="form.video_url" disabled placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item label="视频时长:" prop="description">
                <el-input v-model="form.video_time" placeholder="请输入视频时长"></el-input>
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
import TcVod from "vod-js-sdk-v6";
import axios from "axios";
function getSignature() {
    return axios
        .post("http://new.schoolpi.net/admin/video/signature")
        .then(function(response) {
            return response.data;
        });
}
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
            this.$post("/admin/abroad/video_getOne", {
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
        handleClose() {
            this.$router.push({
                name: "international-video",
                query: {
                    sid: this.$route.query.sid
                }
            });
        },
        handleAdd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.sid = this.$route.query.sid;
                    this.form.thumb = this.$refs.thumb.getFileList();
                    this.$post("/admin/abroad/video_add", this.form).then(
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
                    this.$post("/admin/abroad/video_edit", this.form).then(
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