<template>
  <div class="upload">
    <el-upload
      :action="'https://new.schoolpi.net/admin/Attach'+url"
      :limit="limit"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-exceed="handleExce"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :data="token"
    >
      <!-- <i class="el-icon-plus"></i> -->
      <el-button size="small" type="primary">点击上传</el-button>
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
        console.log("222");
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
        this.$message.error("上传音乐大小不能超过 10MB!");
      }
      return isLt2M;
    },
    //删除list列表中的值
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    //上传成功
    handleSuccess(res, file, fileList) {
      console.log(res)
      if (res.errno == 1) {
        this.$message.error(res.data.msg);
      }
      if (res.errno == 0) {
        let obj = new Object();
        obj.url = res.data.all_path;
        obj.name = res.data.name;
        this.fileList.push(obj);
        console.log(this.fileList)
      }
    },
    //超出上传个数
    handleExce() {
      this.$message.error("超出音乐上传限定个数!");
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
    }
  }
};
</script>
<style scoped>
.upload {
  display: flex;
}
</style>