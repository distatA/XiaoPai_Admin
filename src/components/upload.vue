<template>
  <div class="upload">
    <el-upload
      :action="'https://new.schoolpi.net/admin/Attach'+url"
      :limit="limit"
      list-type="picture-card"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-exceed="handleExce"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :data="token"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>
<script>
/* eslint-disable*/
export default {
  props: {
    limit: {},
    file: {},
    url: {}
  },
  watch: {
    file: function(now, old) {
      this.file = now;
      if (this.file) {
        let file = JSON.parse(this.file);
        file.forEach(item => {
          let obj = new Object();
          obj.url = item;
          this.fileList.push(obj);
        });
      } else {
        this.fileList = [];
      }
    }
  },
  data() {
    return {
      fileList: [],
      token: {
        token: window.localStorage.getItem("token")
      },
      list: []
    };
  },
  created() {
    //讲父组件的图片显示在list中:file="JSON.stringify(form.xiangqing)"
    // console.log(this.file);
  },
  methods: {
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
      }
      return isLt2M;
    },
    //删除list列表中的值
    handleRemove(file, fileList) {
      this.fileList = fileList;
      console.log(this.fileList)
    },
    //上传成功
    handleSuccess(res, file, fileList) {
      console.log(res);
      let obj = new Object();
      obj.url = res.data.all_path;
      this.fileList.push(obj);
      console.log(this.fileList)
    },
    //超出上传个数
    handleExce() {
      this.$message.error("超出图片上传限定个数!");
    },
    //获取上传列表
    getFileList() {
      let list = this.fileList;
      let fileArray = new Array();
      if (list.length > 0) {
        list.forEach(item => {
          fileArray.push(item.url);
        });
      }
      return fileArray;
    },
    clearFile() {
      this.fileList = [];
    }
  }
};
</script>
<style scoped>
.upload {
  display: flex;
}
</style>