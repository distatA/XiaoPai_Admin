<template>
  <el-main>
    <el-form :model="form" ref="form" size="mini" label-width="100px">
      <el-form-item label="标题:">
        <el-col :span="8">
          <el-input type="text" v-model="form.title" placeholder="请输入标题"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="封面图:">
        <upload ref="img_url" url="/image_class" :limit="1" :file="JSON.stringify(form.thumb)"></upload>
      </el-form-item>
      <el-form-item label="标签:">
        <el-col :span="3">
          <el-input type="text" v-model="form.tag" placeholder="请输入标签"></el-input>
        </el-col>
        <span style="color:red;margin-left:10px;">*多个标签请用英文逗号","隔开（标签数量尽量少于三个）</span>
      </el-form-item>
      <el-form-item label="简介:">
        <el-col :span="8">
          <el-input type="textarea" v-model="form.description" rows="5" placeholder="请输入简介"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="内容:">
        <editor editorId="content" :content="form.content" ref="content"></editor>
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
      isAdd: "true"
    };
  },
  created() {
    this.isAdd = this.$route.query.isAdd;
    if (this.$route.query.id) {
      this.form.id = this.$route.query.id;
      this.loadDetail();
    }
  },
  methods: {
    loadDetail() {
      this.$post("/admin/reform/policy_getone", {
        id: this.form.id
      }).then(res => {
        if (res.code === 1) {
          this.form = res.info;
        }
      });
    },
    handleClose() {
      this.$router.push({
        name: "enrollmentReform-policy",
        query: { sid: this.form.sid }
      });
    },
    handleAdd() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.content = this.$refs.content.getHtml();
          this.form.thumb = this.$refs.img_url.getFileList();
          this.$post("/admin/reform/policy_add", this.form).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.$router.push({
                name: "enrollmentReform-policy"
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    handleEdit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.content = this.$refs.content.getHtml();
          this.form.thumb = this.$refs.img_url.getFileList();
          this.$post("/admin/reform/policy_edit ", this.form).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.$router.push({
                name: "enrollmentReform-policy"
              });
            } else {
              this.$message.error(res.msg);
            }
          });
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
.mt {
  margin-top: 10px;
}
</style>