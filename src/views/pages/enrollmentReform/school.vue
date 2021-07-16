<template>
  <el-main>
    <el-form :model="form" ref="form" size="mini" label-width="100px">
      <el-form-item label="学校名称:">
        <el-col :span="3">
          <el-input type="text" v-model="form.name" placeholder="请输入学校名称"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="学校介绍:">
        <el-col :span="8">
          <el-input type="textarea" v-model="form.description" rows="5" placeholder="请输入学校介绍"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="学校图片:">
        <upload ref="img_url" url="/image_class" :limit="1" :file="JSON.stringify(form.img_url)"></upload>
      </el-form-item>
      <el-form-item label="招生人数:">
        <el-col :span="3">
          <el-input type="number" v-model="form.zsrs" placeholder="请输入招生人数"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="是否热门:">
        <el-radio-group v-model="form.is_hot">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="热门排序:">
        <el-col :span="3">
          <el-input type="number" v-model="form.sort" placeholder="请输入热门排序"></el-input>
        </el-col>
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
import upload from "@/components/upload";
export default {
  components: {
    upload
  },
  data() {
    return {
      form: {
        is_hot: 0
      },
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
      this.$post("/admin/reform/school_getone", {
        id: this.form.id
      }).then(res => {
        if (res.code === 1) {
          this.form = res.info;
        }
      });
    },
    handleClose() {
      this.$router.push("/enrollmentReform/enrollmentReform");
    },
    handleAdd() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.img_url = this.$refs.img_url.getFileList();
          this.$post("/admin/reform/school_add", this.form).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.$router.push("/enrollmentReform/enrollmentReform");
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
          this.form.img_url = this.$refs.img_url.getFileList();
          this.$post("/admin/reform/school_edit ", this.form).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.$router.push("/enrollmentReform/enrollmentReform");
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    }
  },
  mounted() {}
};
</script>
        
 <style>
.mt {
  margin-top: 10px;
}
</style>