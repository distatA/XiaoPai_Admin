<template>
  <el-main>
    <el-form :model="form" ref="form" size="mini" label-width="100px">
      <el-form-item label="学校id:">
        <el-col :span="3">
          <el-input type="text" v-model="form.sid" placeholder="请输入学校id"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="标题:">
        <el-col :span="8">
          <el-input type="text" v-model="form.title" placeholder="请输入简章标题"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="排序:">
        <el-col :span="3">
          <el-input type="number" v-model="form.sort" placeholder="请输入排序"></el-input>
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
export default {
  components: {
    editor
  },
  data() {
    return {
      form: {},
      cate_list: [],
      isAdd: "true",
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
      this.$post("/admin/reform/enroll_getone", {
        id: this.form.id
      }).then(res => {
        if (res.code === 1) {
          this.form = res.info;
        }
      });
    },
    handleClose() {
      this.$router.push({
        name: "enrollmentReform-admissionsGuide",
        query: { sid: this.form.sid }
      });
    },
    handleAdd() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.content = this.$refs.content.getHtml();
          this.$post("/admin/reform/enroll_add", this.form).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.$router.push({
                name: "enrollmentReform-admissionsGuide",
                query: { sid: this.form.sid }
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
          this.$post("/admin/reform/enroll_edit ", this.form).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.$router.push({
                name: "enrollmentReform-admissionsGuide",
                query: { sid: this.form.sid }
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