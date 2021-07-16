<template>
  <el-main>
    <div class="btn">
      <el-button type="primary" size="mini" @click="add">添加专业</el-button>
      <div class="search">
        <el-input v-model="name" class="search-item" clearable placeholder="请输入专业名称" size="mini"></el-input>
        <el-button type="primary" size="mini" @click="search">搜索</el-button>
      </div>
    </div>
    <el-table border :data="infoList" class="list">
      <el-table-column align="center" type="index" width="55"></el-table-column>
      <el-table-column align="center" prop="name" label="专业名称"></el-table-column>
      <el-table-column align="center" prop="zsrs" label="招生人数"></el-table-column>
      <el-table-column align="center" prop="school_name" label="学校名称"></el-table-column>
      <el-table-column label="排序" align="center" width="100">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.sort"
            @change="changeSort(scope.row,scope.row.sort)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row.id)">编辑</el-button>
          <el-button @click="handleDelete(scope.row.id)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totals"
        :page-size="offset"
        @current-change="getCurrentage"
      ></el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form :model="form" ref="form" size="mini" :rules="formrules" label-width="100px">
        <el-form-item label="专业" prop="name">
          <el-input v-model="form.name" clearable placeholder="请输入专业名称"></el-input>
        </el-form-item>
        <el-form-item label="招生人数" prop="zsrs">
          <el-input v-model="form.zsrs" clearable placeholder="请输入招生人数"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" clearable placeholder="请输入专业排序"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleClose">取消</el-button>
          <el-button v-if="isAdd" type="primary" @click="handleAdd">确定</el-button>
          <el-button v-else type="primary" @click="handleEdit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-main>
</template>
<style scoped>
.btn {
  display: flex;
  justify-content: space-between;
}
.search {
  display: flex;
}
.search-item {
  margin-right: 20px;
}
.list {
  margin-top: 20px;
}
.pagination {
  margin-top: 20px;
}
.select {
  margin-left: 20px;
  border: 1px #ccc solid;
  padding: 2px 5px;
  border-radius: 3px;
  cursor: pointer;
}
</style>
<script>
export default {
  data() {
    return {
      id: "", //列表id
      name: "", //专业名，搜索
      sid: "", //学校id
      page: 1, //当前页数
      offset: 15, //每页数量
      totals: 0, //总条数
      infoList: [], //列表信息
      form: {}, //添加编辑
      formrules: {
        name: [
          {
            required: true,
            message: "专业名称不能为空",
            trigger: "blur"
          }
        ],
        zsrs: [
          {
            required: true,
            message: "招生人数不能为空",
            trigger: "blur"
          }
        ]
      },
      dialogVisible: false, //添加编辑对话框
      isAdd: true
    };
  },
  methods: {
    // 搜索
    search() {
      this.getInfo(this.name, this.sid);
    },
    //  列表信息
    getInfo(name, sid, page) {
      this.$post("/admin/reform/major", {
        name: name,
        sid: sid,
        page: page
      }).then(res => {
        if (res.code == 1) {
          this.infoList = res.list;
          this.totals = res.all_num;
        } else if (res.code == 0) {
          this.infoList = [];
        }
      });
    },
    //
    getCurrentage() {
      this.getInfo("", this.sid, this.page);
    },
    // 添加编辑弹出对话框
    add() {
      this.isAdd = true;
      this.dialogVisible = true;
    },
    edit(id) {
      this.id = id;
      this.isAdd = false;
      this.dialogVisible = true;
      this.$post("/admin/reform/major_getone", {
        id: id
      }).then(res => {
        if (res.code == 1) {
          this.form = res.info;
        }
      });
    },
    // 添加专业
    handleAdd() {
      this.$post("/admin/reform/major_add", {
        sid: this.sid,
        name: this.form.name,
        zsrs: this.form.zsrs,
        sort: this.form.sort
      }).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.handleClose();
          this.getInfo("", this.sid);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 编辑专业
    handleEdit() {
      this.$post("/admin/reform/major_edit", {
        id: this.id,
        name: this.form.name,
        zsrs: this.form.zsrs,
        sort: this.form.sort
      }).then(res => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.handleClose();
          this.getInfo("", this.sid);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false;
      this.form = {};
    },
    //更改排序
    changeSort(item, value) {
      this.$post("/admin/reform/major_sort", {
        id: item.id,
        sort: value
      }).then(res => {
        if (res.code == 0) {
          this.$message.error(res.msg);
        } else {
          this.$message.success(res.msg);
        }
      });
    },
    // 删除
    handleDelete(id) {
      if (id) {
        var arr = [];
        arr.push(id);
      }
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/admin/reform/major_del", {
            id: arr
          }).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.arr = [];
              //删除后重新拉取
              this.getInfo("", this.sid);
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
    this.sid = this.$route.query.sid;
    this.getInfo("", this.$route.query.sid, 1);
  }
};
</script>
