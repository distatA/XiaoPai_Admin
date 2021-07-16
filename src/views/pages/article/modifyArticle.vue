<template>
    <el-main>
        <el-form class="form" ref="form" :model="form" label-width="100px" size="mini">
            <el-form-item label="文章类型">
                <el-radio-group v-model="form.type">
                    <el-radio :label="1">图文</el-radio>
                    <el-radio :label="2" v-if="status === 'mobile'">视频</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="显示平台">
                    <el-radio-group v-model="form.genre">
                        <el-radio :label="1">手机端</el-radio>
                        <el-radio :label="2">PC端</el-radio>
                    </el-radio-group>
            </el-form-item>-->
            <el-form-item label="是否热门" v-if="status === 'pc'">
                <el-radio-group v-model="form.is_hot">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否推荐" v-if="status === 'pc'">
                <el-radio-group v-model="form.is_recom">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否在首页" v-if="status === 'mobile'">
                <el-radio-group v-model="form.is_index">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否显示">
                <el-radio-group v-model="form.is_show">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="文章标题">
                <el-input v-model="form.title" placeholder="请输入文章标题(限32个字)"></el-input>
            </el-form-item>
            <el-form-item label="文章分类">
                <!-- <el-input v-model="form.cate_id" placeholder="请输入文章分类"></el-input> -->
                <el-select
                    v-model="form.cate_id"
                    filterable
                    placeholder="请选择文章分类"
                    style="width:100%"
                >
                    <el-option
                        v-for="item in cate_list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="省份">
                <el-select v-model="form.province" placeholder="请选择地区">
                    <el-option
                        v-for="item in areaList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发布时间">
                <el-date-picker
                    v-model="form.release_time"
                    value-format="timestamp"
                    type="datetime"
                    placeholder="选择日期时间"
                ></el-date-picker>
            </el-form-item>

            <el-form-item label="文章标签">
                <el-select v-model="form.tags" filterable style="width:100%" placeholder="请选择文章标签">
                    <el-option
                        v-for="item in   tagList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="排序">
                <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="form.desc" placeholder="请输入文章描述"></el-input>
            </el-form-item>
            <el-form-item label="浏览量" v-if="status === 'pc'">
                <el-input v-model="form.hits" placeholder="请输入文章浏览量"></el-input>
            </el-form-item>
            <!-- <el-form-item label="评论数">
                    <el-input v-model="form.comments" placeholder="请输入文章评论数"></el-input>
                </el-form-item>
                <el-form-item label="点赞数">
                    <el-input v-model="form.dianzan" placeholder="请输入文章点赞数"></el-input>
            </el-form-item>-->
            <el-form-item label="作者" v-if="status === 'pc'">
                <el-input v-model="form.author" placeholder="请输入文章作者"></el-input>
            </el-form-item>
            <el-form-item label="上传视频" v-if="form.type === 2">
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
            <el-form-item label="视频地址" v-if="form.type === 2">
                <el-input v-model="form.video_url" placeholder="请输入视频地址"></el-input>
            </el-form-item>
            <el-form-item label="视频时长" v-if="form.type === 2">
                <el-input v-model="form.video_time" placeholder="请输入视频时长"></el-input>
            </el-form-item>
            <el-form-item label="封面图" v-if="status === 'mobile'">
                <el-upload
                    accept=".jpg, .png"
                    action="http://new.schoolpi.net/admin/attach/image_article"
                    list-type="picture-card"
                    :data="token"
                    :on-remove="handleRemoveCover"
                    :on-success="uploadCover"
                    :file-list="coverList"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="缩略图">
                <el-upload
                    accept=".jpg, .png"
                    action="http://new.schoolpi.net/admin/attach/image_article"
                    list-type="picture-card"
                    :data="token"
                    :on-remove="handleRemoveThumb"
                    :on-success="uploadThumb"
                    :file-list="thumbList"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="内容">
                <div ref="toolbar" class="toolbar"></div>
                <div ref="editor" class="text"></div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="add">立即添加</el-button>
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
import E from "wangeditor";
let editor = null;
export default {
    data() {
        return {
            fullscreenLoading: false, //全屏加载
            dialogImageUrl: "",
            dialogVisible: false,
            active: 0,
            form: {
                thumb: [],
                cover_map: []
            },
            thumbList: [], //存储缩略图
            coverList: [], //存储封面图
            cate_list: [], //分类选项数组
            areaList: [], //地区选项
            tagList: [], //标签
            token: {
                token: window.localStorage.getItem("token")
            },
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            },
            status: "mobile"
        };
    },
    created() {
        this.status = this.$route.query.status;
        if (this.status === "mobile") {
            this.form.genre = 1;
            this.loadOptions(1);
        } else {
            this.form.genre = 2;
            this.loadOptions(2);
        }
    },
    methods: {
        //获取地区列表
        loadOptions(type) {
            this.$post("/admin/article/article_condition", { type: type }).then(
                res => {
                    this.areaList = res.province_list;
                    this.cate_list = res.cate_list;
                    this.tagList = res.tags_list;
                }
            );
        },
        next() {
            if (this.active++ > 2) this.active = 0;
            var that = this;
            setTimeout(function() {}, 100);
        },
        back() {
            if (this.active-- === 0) this.active = 1;
        },
        //添加
        add() {
            console.log(this.form);
            if (this.form.province) {
                this.form.province = this.form.province[
                    this.form.province.length - 1
                ];
            }
            this.form.release_time = this.form.release_time / 1000;
            this.$post("/admin/article/add", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: "success"
                    });
                    this.$router.push("/article/article");
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: "error"
                    });
                }
            });
        },
        handleRemoveThumb(file, fileList) {
            console.log(file);
            var path = file.url;
            this.form.thumb.splice(
                this.form.thumb.findIndex(item => item === path),
                1
            );
        },
        handleRemoveCover(file, fileList) {
            var path = file.url;
            this.form.cover_map.splice(
                this.form.cover_map.findIndex(item => item === path),
                1
            );
        },
        //上传缩略图
        uploadThumb(res, file, fileList) {
            let obj = new Object();
            obj.url = res.data.all_path;
            this.thumbList.push(obj);
            this.form.thumb.push(res.data.all_path);
        },
        //上传封面图
        uploadCover(res, file, fileList) {
            let obj = new Object();
            obj.url = res.data.all_path;
            this.coverList.push(obj);
            this.form.cover_map.push(res.data.all_path);
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
        //初始化富文本编辑器
        initEditor() {
            editor = new E(this.$refs.toolbar, this.$refs.editor);
            // 上传图片到服务器
            editor.customConfig.uploadFileName = "file"; //设置文件上传的参数名称
            editor.customConfig.uploadImgServer =
                "https://new.schoolpi.net/admin/attach/image_article"; //设置上传文件的服务器路径
            editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024; // 将图片大小限制为 3M
            editor.customConfig.uploadImgParams = {
                token: window.localStorage.getItem("token")
            };

            //自定义上传图片事件
            editor.customConfig.uploadImgHooks = {
                customInsert: function(insertImg, result, editor) {
                    console.log("---->", result);
                    var url = result.data.all_path;
                    insertImg(url);
                }
            };
            // 配置菜单
            editor.customConfig.menus = [
                "head", // 标题
                "bold", // 粗体
                "fontSize", // 字号
                "fontName", // 字体
                "italic", // 斜体
                "underline", // 下划线
                "strikeThrough", // 删除线
                "foreColor", // 文字颜色
                "backColor", // 背景颜色
                //'link',  // 插入链接
                "list", // 列表
                "justify", // 对齐方式
                //'quote',  // 引用
                "emoticon", // 表情
                "image", // 插入图片
                "table", // 表格
                // 'video',  // 插入视频
                // 'code',  // 插入代码
                "undo", // 撤销
                "redo" // 重复
            ];
            //获取富文本内的内容
            editor.customConfig.onchange = html => {
                this.form.content = html;
            };
            // 创建富文本编辑器
            editor.create();
            //初始化内容（很重要，否则v-modle绑定的数据，第一次渲染时不会回显，踩的一个大坑！！）
            editor.txt.html(this.form.content);
        }
    },
    mounted() {
        this.initEditor();
    }
};
</script>
<style scoped>
.m {
    width: 100px;
    margin: 0 auto;
}
.form {
    width: 1000px;
}

.editor {
    /*width: 100%;*/
}

.toolbar {
    /*height: 50px;*/
    border: 1px solid #ccc;
}

.text {
    width: 100%;
    border: 1px solid #ccc;
    height: 300px;
}

.w-e-toolbar,
.w-e-menu {
    z-index: -9999 !important;
}
.el-form >>> .el-from-item >>> .el-form-item__content {
    z-index: -1 !important;
}
.w-e-text-container {
    z-index: 1 !important;
    height: 600px !important;
}
</style>
