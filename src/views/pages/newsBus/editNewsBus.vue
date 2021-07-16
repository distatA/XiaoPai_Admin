<template>
    <el-main>
        <el-form class="form" ref="form" :model="form" size="small" label-width="100px">
            <el-form-item label="封面图:">
                <el-upload
                    accept=".jpg, .png"
                    action="http://new.schoolpi.net/admin/attach/image_article"
                    list-type="picture-card"
                    :data="token"
                    :limit="1"
                    :on-exceed="exceed"
                    :on-remove="handleRemoveCover"
                    :on-success="uploadCover"
                    :file-list="cover"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="Banner图:">
                <el-upload
                    accept=".jpg, .png"
                    action="http://new.schoolpi.net/admin/attach/image_article"
                    list-type="picture-card"
                    :data="token"
                    :limit="1"
                    :on-exceed="exceed"
                    :on-remove="handleRemoveBanner"
                    :on-success="uploadBanner"
                    :file-list="banner"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="教育新闻标题:">
                <el-input
                    v-model="form.zbc_title"
                    @input="change($event)"
                    placeholder="请输入新闻标题(限32个字以内)"
                ></el-input>
            </el-form-item>
            <el-form-item label="描述:">
                <el-input v-model="form.desc" type="textarea" placeholder="请输入新闻描述(限200个字以内)"></el-input>
            </el-form-item>
            <el-form-item label="教育新闻:">
                <div ref="eduToolbar" class="toolbar"></div>
                <div ref="eduEditor" class="text"></div>
            </el-form-item>
            <el-form-item label="热点资讯:">
                <div ref="newsToolbar" class="toolbar"></div>
                <div ref="newsEditor" class="text"></div>
            </el-form-item>
            <el-form-item label="每日一语:">
                <el-input v-model="form.zbc_mryy" type="textarea" placeholder="请输入每日一语"></el-input>
            </el-form-item>
            <el-form-item label="排序:">
                <el-input v-model="form.sort" placeholder="请输入文章排序"></el-input>
            </el-form-item>
            <el-form-item label="访问数:">
                <el-input v-model="form.hits" placeholder="请输入访问数"></el-input>
            </el-form-item>
            <el-form-item label="发布时间">
                <el-date-picker
                    v-model="form.release_time"
                    value-format="timestamp"
                    type="datetime"
                    placeholder="选择日期时间"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button @click="edit">添加</el-button>
            </el-form-item>
        </el-form>
    </el-main>
</template>
<script>
/* eslint-disable*/
import E from "wangeditor";
let eduEditor = null;
let newsEditor = null;
export default {
    data() {
        return {
            form: {
                cover_map: [
                    "https://new.schoolpi.net/uploads/image/20190715/308982ba9fdb79c6bbe72ef0d2119256.png"
                ],
                thumb: []
            },
            token: {
                token: window.localStorage.getItem("token")
            },
            cover: [
                {
                    url:
                        "https://new.schoolpi.net/uploads/image/20190715/308982ba9fdb79c6bbe72ef0d2119256.png"
                }
            ],
            banner: []
        };
    },
    created() {
        this.form.id = this.$route.query.id;
        this.loadDetail();
        // this.form.zbc_title = "2121"; //res.row_data.zbc_title;
    },
    methods: {
        loadDetail() {
            this.$post("/admin/article/getone", { id: this.form.id }).then(
                res => {
                    this.form = res.info;
                    this.form.zbc_mryy = res.row_data.zbc_mryy;
                    this.form.zbc_title = res.row_data.zbc_title;
                    this.form.content = res.row_data.content; //: "<p>21</p>"
                    this.form.zbc_content = res.row_data.zbc_content; //: "<p>12</p>"
                    console.log(this.form);

                    this.form.release_time = this.form.release_time * 1000;
                    this.initNewsEditor();
                    this.initEduEditor();
                    let cover = this.form.thumb; //logo地址
                    cover.forEach(item => {
                        let obj = new Object();
                        obj.url = item;
                        this.banner.push(obj);
                    });
                }
            );
        },
        change(e) {
            this.$forceUpdate();
        },
        edit() {
            console.log(this.form);

            this.form.release_time = this.form.release_time / 1000;
            this.$post("/admin/article/edit_zbc", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: "success"
                    });
                    this.$router.push("/newsBus/newsBus");
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: "error"
                    });
                }
            });
        },
        exceed() {
            console.log("oversize");
        },
        //清空封面
        handleRemoveCover() {
            this.form.cover_map = [];
            this.cover = [];
        },
        uploadCover(res, file, fileList) {
            let obj = new Object();
            obj.url = res.data.all_path;
            this.cover.push(obj);
            this.form.cover_map.push(res.data.all_path);
        },

        handleRemoveBanner() {
            this.form.thumb = [];
            this.banner = [];
        },
        uploadBanner(res, file, fileList) {
            console.log(res);
            let obj = new Object();
            obj.url = res.data.all_path;
            this.banner.push(obj);
            this.form.thumb.push(res.data.all_path);
            console.log(this.form.thumb);
        },
        initNewsEditor() {
            newsEditor = new E(this.$refs.newsToolbar, this.$refs.newsEditor);
            // 上传图片到服务器
            let customConfigOptions = {
                uploadFileName: "file",
                uploadImgServer:
                    "https://new.schoolpi.net/admin/attach/image_article",
                uploadImgMaxSize: 3 * 1024 * 1024,
                uploadImgParams: {
                    token: window.localStorage.getItem("token")
                },
                uploadImgHooks: {
                    customInsert: function(insertImg, result, editor) {
                        var url = result.data.all_path;
                        insertImg(url);
                    }
                }
            };
            let menus = [
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
            newsEditor.customConfig = customConfigOptions;
            newsEditor.customConfig.menus = menus;
            //获取富文本内的内容
            newsEditor.customConfig.onchange = html => {
                this.form.content = html;
            };

            newsEditor.create();
            newsEditor.txt.html(this.form.content);
        },
        initEduEditor() {
            eduEditor = new E(this.$refs.eduToolbar, this.$refs.eduEditor);
            // 上传图片到服务器
            let customConfigOptions = {
                uploadFileName: "file",
                uploadImgServer:
                    "https://new.schoolpi.net/admin/attach/image_article",
                uploadImgMaxSize: 3 * 1024 * 1024,
                uploadImgParams: {
                    token: window.localStorage.getItem("token")
                },
                uploadImgHooks: {
                    customInsert: function(insertImg, result, editor) {
                        var url = result.data.all_path;
                        insertImg(url);
                    }
                }
            };
            let menus = [
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
            eduEditor.customConfig = customConfigOptions;
            eduEditor.customConfig.menus = menus;

            eduEditor.customConfig.onchange = html => {
                this.form.zbc_content = html;
            };

            // 创建富文本编辑器
            eduEditor.create();
            //初始化内容（很重要，否则v-modle绑定的数据，第一次渲染时不会回显，踩的一个大坑！！）
            eduEditor.txt.html(this.form.zbc_content);
        }
    },
    mounted() {}
};
</script>
<style scoped>
.form {
    width: 700px;
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
}
</style>