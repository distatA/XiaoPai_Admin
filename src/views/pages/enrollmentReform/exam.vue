<template>
  <el-main>
    <el-form :model="form" ref="form" size="mini" label-width="100px">
      <el-form-item label="报名时间:">
        <el-col :span="8">
          <el-input type="text" v-model="form.bmsj" placeholder="请输入报名时间"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="报名方式:">
        <el-col :span="8">
          <el-input type="text" v-model="form.bmfs" placeholder="请输入报名方式"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="校考时间:">
        <el-col :span="8">
          <el-input type="text" v-model="form.xksj" placeholder="请输入校考时间"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="校考地址:">
        <el-col :span="8">
          <el-input type="text" v-model="form.xkdz" placeholder="请输入校考地址"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>
        
<script>
export default {
  data() {
    return {
      form: {}
    };
  },
  created() {
    if (this.$route.query.sid) {
      this.form.sid = this.$route.query.sid;
      this.loadDetail();
    }
  },
  methods: {
    loadDetail() {
      this.$post("/admin/reform/ksbm_getone", {
        sid: this.form.sid
      }).then(res => {
        if (res.code === 1) {
          this.form = res.info;
        }
      });
    },
    handleClose() {
      this.$router.push({
        name: "enrollmentReform-enrollmentReform"
      });
    },
    handleAdd() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$post("/admin/reform/ksbm_edit", this.form).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.$router.push({
                name: "enrollmentReform-enrollmentReform"
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
  }
};
</script>
        
 <style>
.mt {
  margin-top: 10px;
}
</style>