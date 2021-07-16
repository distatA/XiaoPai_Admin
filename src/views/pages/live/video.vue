<template>
  <el-main>
    <el-button type="primary" size="mini" @click="openDialog('add','')">添加文字</el-button>
    <el-table border class="list" :data="list">
      <el-table-column prop="id" label="序号" align="center" width="100"></el-table-column>
      <el-table-column prop="title" label="内容" align="center"></el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button @click="openDialog('edit',scope.row.id)" type="primary" size="mini">编辑</el-button>
          <el-button @click="select(scope.row.id)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="文字内容" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="content"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button v-if="state=='add'" type="primary" @click="add">确 定</el-button>
        <el-button v-else type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
  </el-main>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      content: "",
      state: "",
      list: [],
      room_id: "",
      id: ""
    };
  },
  methods: {
    // 获取列表信息
    getInfo() {
      this.$post("/admin/live/index_videoinfo", {
        room_id: this.room_id
      }).then(res => {
        if (res.code == 1) {
          this.list = res.list;
        } else if(res.code == 0){
          this.list = [];
        }
      });
    },
    // 打开对话框
    openDialog(isAdd, id) {
      this.state = isAdd;
      this.id = id;
      if (isAdd == "edit") {
        this.$post("/admin/live/getone_videoinfo", {
          id: id
        }).then(res => {
          this.content = res.info.title;
          this.dialogVisible = true;
        });
      } else {
        this.dialogVisible = true;
      }
    },
    handleClose() {
      (this.dialogVisible = false), (this.content = "");
    },
    // 添加
    add() {
      this.$post("/admin/live/add_videoinfo", {
        room_id: this.room_id,
        title: this.content
      }).then(res => {
        if (res.code == 1) {
          this.dialogVisible = false;
          this.content = "";
          this.$message.success(res.msg);
          this.getInfo();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 编辑
    edit() {
      this.$post("/admin/live/edit_videoinfo", {
        id: this.id,
        room_id: this.room_id,
        title: this.content
      }).then(res => {
        if (res.code == 1) {
          this.dialogVisible = false;
          this.content = "";
          this.$message.success(res.msg);
          this.getInfo();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 删除
    select(id) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/admin/live/delete_videoinfo", {
            id: id
          }).then(res => {
            if (res.code == 1) {
              this.dialogVisible = false;
              this.getInfo();
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    this.room_id = this.$route.query.room_id;
    if (this.room_id) {
      this.getInfo();
    }
  }
};
</script>
<style scoped>
.list {
  margin-top: 20px;
}
</style>