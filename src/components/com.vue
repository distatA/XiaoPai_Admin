<template>
    <div>
        组件=>{{editorId}}--->{{content}}
        <div :id="editorId"></div>
    </div>
</template>
 
<script>
/* eslint-disable*/
import E from "wangeditor";
export default {
    props: {
        //接受父组件传递来的数据
        editorId: {},
        content: {}
    },
    watch: {
        content: function(now, old) {
            console.log("==>", this.editorId);
            console.log("-->", this.content);
            this.content = now;
            this.init(this.editorId);
        }
    },
    data() {
        return {
            editor: ""
        };
    },
    created() {
        // console.log("==>", this.editorId);
    },
    methods: {
        init(id) {
            const that = this;
            this.editor = new E("#" + id);
            this.initEditor(); //设置菜单
        },
        initEditor() {
            // 上传图片到服务器
            this.editor.customConfig.uploadFileName = "file"; //设置文件上传的参数名称
            this.editor.customConfig.uploadImgServer =
                "https://new.schoolpi.net/admin/Attach/image_article"; //设置上传文件的服务器路径
            this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024; // 将图片大小限制为 3M
            this.editor.customConfig.uploadImgParams = {
                token: window.sessionStorage.getItem("token")
            };

            //自定义上传图片事件
            this.editor.customConfig.uploadImgHooks = {
                customInsert: function(insertImg, result, editor) {
                    console.log("---->", result);
                    var url = result.data.all_path;
                    insertImg(url);
                }
            };
            // 配置菜单
            this.editor.customConfig.menus = [
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
            this.editor.customConfig.onchange = html => {
                this.content = html;
            };
            // 创建富文本编辑器
            this.editor.create();
            //初始化内容（很重要，否则v-modle绑定的数据，第一次渲染时不会回显，踩的一个大坑！！）
            this.editor.txt.html(this.content);
        },
        getHtml() {
            return this.editor.txt.html();
        },
        setHtml(txt) {
            var that = this;
            console.log("-------->", txt);
            that.editor.txt.html(txt);
        }
    },
    mounted() {}
};
</script>