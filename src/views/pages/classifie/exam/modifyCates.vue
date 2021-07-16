<template>
  <el-main>
    <el-form :model="form" ref="form" size="mini" label-width="100px">
      <el-form-item label="省份:" prop="type">
        <el-select v-model="form.province" placeholder="请选择省份">
          <el-option v-for="item in region" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="测试时间">
        <el-input v-model="form.exam_time" placeholder="请输入测试时间"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
      </el-form-item>
      <el-form-item label="背景图" prop="plan_num">
        <upload
          ref="back_image"
          url="/image_live"
          :limit="1"
          :file="JSON.stringify(form.back_image)"
        ></upload>
      </el-form-item>
      <el-form-item label="答案" v-if="form.province==10808">
        <el-upload
          class="upload-demo"
          :data="token"
          action="http://new.schoolpi.net/admin/attach/file_class"
          accept=".pdf"
          :on-success="successUp"
          multiple
          :limit="1"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
        </el-upload>
        <div v-if="form.file_url!=null" style="font-size:10px;">{{form.file_url[0]}}</div>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleClose">取消</el-button>
        <el-button v-if="state=='add'" type="primary" @click="handleAdd">确定</el-button>
        <el-button v-else type="primary" @click="handleEdit">确定</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>
        
<script>
/* eslint-disable*/
import editor from "@/components/editor";

import upload from "@/components/upload";
export default {
  components: {
    editor,
    upload
  },
  data() {
    return {
      form: {},
      region: [],
      cate_list: [],
      state: "add",
      fileList: [],
      token: {
        token: window.localStorage.getItem("token")
      }
    };
  },
  created() {
    this.loadOption();
    this.state = this.$route.query.state;
    this.form.id = this.$route.query.id;
    if (this.form.id) {
      this.loadDetail();
    }
  },
  methods: {
    // 上传文件成功后
    successUp(res,file){
      this.form.file_url=res.data.all_path.split();
      console.log(this.form)
    },
    loadOption() {
      console.log(window.localStorage.getItem("token"));
      this.$post("/admin/classifie/condition_exam_type").then(res => {
        if (res.code === 1) {
          this.region = res.region; //地区搜索
        }
      });
    },
    //
    loadDetail() {
      this.$post("/admin/classifie/getone_exam_type", {
        id: this.form.id
      }).then(res => {
        if (res.code === 1) {
          this.form = res.info;
          // this.form.desc = res.info.description;
        }
      });
    },
    handleClose() {},
    handleAdd() {
      this.form.back_image = this.$refs.back_image.getFileList();
      this.$post("/admin/classifie/add_exam_type", this.form).then(res => {
        if (res.code === 1) {
          this.$router.push("/exam/cates");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleEdit() {
      this.form.back_image = this.$refs.back_image.getFileList();

      this.$post("/admin/classifie/edit_exam_type", this.form).then(res => {
        if (res.code === 1) {
          this.$router.push("/exam/cates");
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  mounted() {}
};
</script>
        
 <style>
 
</style>