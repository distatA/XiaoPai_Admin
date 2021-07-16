<template>
  <div>
    <div class="editor" :id="editorId"></div>
  </div>
</template>
 
<script>
/* eslint-disable*/
import E from "wangeditor";
import axios from "axios"
export default {
  props: {
    //接受父组件传递来的数据
    editorId: {
      // type: Object,
      default() {
        //默认数据，没有数剧的情况下启用
      }
    },
    content: {}
  },
  watch: {
    content: function(now, old) {
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
      const _this = this;
      this.editor = new E("#" + id);
      this.setMenus(); //设置菜单
      this.editor.customConfig.pasteFilterStyle = false;
      this.editor.customConfig.pasteIgnoreImg = true;
      this.editor.customConfig.debug = true;


      this.editor.customConfig.uploadImgServer =
        "http://new.schoolpi.net/admin/Attach/image_school"; //上传URL
      this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
      this.editor.customConfig.uploadImgMaxLength = 5;
      this.editor.customConfig.uploadFileName = "file";
      this.editor.customConfig.uploadImgParams = {
        token: window.localStorage.getItem("token")
      };
      this.editor.customConfig.uploadImgHooks = {
        before: function(xhr, editor, files) {
          // console.log(files);
          // console.log("before",xhr, editor, files)
        },
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
          console.log("插入失败",xhr, editor, result);
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
          console.log("上传成功", xhr, editor);
          console.log("上传成功", result);
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
          console.log("超时",xhr, editor);
        },
        error: (xhr, editor) => {
          console.log(xhr, editor);
          // 图片上传错误的回调
        },
        customInsert: function(insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          var arr = [];
           arr.push(result.data.all_path);
          // console.log("----->result", result);
          console.log("all_path",result.data.all_path)

          // console.log("arr",arr)
          console.log("url",arr);
         
          insertImg(arr);
          // insertImg(result.data.all_path);


          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      };
      // =========================================
      this.editor.customConfig.onchange = html => {
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("change", this.info_); // 将内容同步到父组件中
      };
      this.editor.create(); //创建编辑器
      this.editor.change = function() {
        // 这里是change 不是官方文档中的 onchange
        // console.log(this.txt.html()); // 编辑区域内容变化时，实时打印出当前内容
        _this.$emit("changeHtml", this.txt.html());
      };
      this.editor.txt.html(this.content);
    },
    setMenus() {
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
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "image", // 插入图片
        "table", // 表格
        "undo", // 撤销
        "redo" // 重复
      ];
    },
    getHtml() {
      return this.editor.txt.html();
    },
    setHtml(txt) {
      var that = this;
      that.editor.txt.html(txt);
    }
  },
  mounted() {}
};
</script>
<style scoped>
.editor {
  z-index: -1 !important;
}
.editor >>> .w-e-text-container {
  z-index: 99 !important;
  height: 600px !important;
}
.editor >>> .w-e-menu {
  z-index: 999 !important;
}
</style>