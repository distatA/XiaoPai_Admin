<template>
  <el-main>
    <el-form class="form" ref="form" label-width="130px" size="mini">
      <el-form-item label="增加人数">
        <el-input v-model="number" type="number" style="width:100px;"></el-input>
        <el-button class="btn" type="primary" @click="bindNumber">提交</el-button>
      </el-form-item>
      <el-form-item label="增加进群">
        <el-input v-model="group" style="width:400px;"></el-input>
        <el-button class="btn" type="primary" @click="bindGroup">提交</el-button>
      </el-form-item>
      <el-form-item label="增加弹幕">
        <div>
          人名：
          <el-input type="text" v-model="name" style="width:150px;"></el-input>
        </div>
        <div style="display:flex;">
          <div style="margin-top:20px;">内容：</div>
          <el-input
            type="textarea"
            :rows="3"
            v-model="content"
            style="width:300px;margin-top:20px;"
          ></el-input>
        </div>
        <el-button type="primary" style="margin-top:20px;" @click="bindContent">提交</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
export default {
  data() {
    return {
      number: 0,
      group: "",
      name: "",
      content: ""
    };
  },
  methods: {
    bindNumber() {
      this.$post("/admin/live/guan_peoples", {
        number: this.number,
        room_id: this.$route.query.room_id
      }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: res.msg,
            type: "success"
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    bindGroup() {
      this.$post("/admin/live/guan_tips", {
        username: this.group,
        room_id: this.$route.query.room_id
      }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: res.msg,
            type: "success"
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    bindContent(){
        this.$post("/admin/live/guan_danmus", {
        username: this.name,
        room_id: this.$route.query.room_id,
        content:this.content
      }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: res.msg,
            type: "success"
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    }
  },
  created() {}
};
</script>

<style scoped>
.btn {
  margin-left: 20px;
}
</style>>
