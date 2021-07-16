<template>
  <div>
    <el-button type="primary" class="add" @click="dialogVisible = true; isAdd = true;">添加</el-button>
    <div class="table">
      <el-table :data="tableData" border>
        <el-table-column label="ID" prop="id" align="center" width="200px"></el-table-column>
        <el-table-column label="名称" prop="name" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="getOne(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteCategory(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>     
    </div>
    <!-- 增加/编辑类别弹窗 -->
    <el-dialog
      :title="isAdd ? '增加类别' : '编辑类别'"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <div style="display: flex; align-items: center; ">
        <span style="margin-right: 10px; white-space:nowrap;">类别名称：</span>
        <el-input v-model="categoryName" placeholder="请输入类别名称"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <!-- 添加按钮 -->
        <el-button type="primary" v-show="isAdd" @click="addCategory">确 定</el-button>
        <!-- 编辑按钮 -->
        <el-button type="primary" v-show="!isAdd" @click="editorCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryId: null, // 类别ID
      tableData: [], // 类别列表数据
      dialogVisible: false, // 控制弹窗
      categoryName: '', // 类别名称
      isAdd: true // 判断是否为增加
    }
  },
  created() {
    // 获取类别列表
    this.getList()
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.categoryName = '';
      this.dialogVisible = false;
    },
    // 获取类别列表
    getList() {
      this.$post("/admin/chemistry/cate").then(res => {
        if (res.code === 1) {
          this.tableData = res.list
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    // 增加类别
    addCategory() {
      this.$post("/admin/chemistry/cate_add", {
        name: this.categoryName
      }).then(res => {
        if (res.code === 1) {
          this.getList();
          this.handleClose();
          this.$message.success(res.msg);
        }
      })
    },
    // 删除类别
    deleteCategory(id) {
      this.$confirm('此操作将永久删除该类别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post("/admin/chemistry/cate_del", {
          id: id
        }).then(res => {
          if (res.code === 1) {
            this.getList();
            this.$message.success(res.msg);
          } else {
            this.getList();
            this.$message.error(res.msg);
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 编辑类别
    // 获取单条数据
    getOne(id) {
      this.categoryId = id;
      this.$post("/admin/chemistry/cate_getone", {
        id: id
      }).then(res => {
        if (res.code === 1) {
          this.categoryName = res.info.name;
          this.isAdd = false;
          this.dialogVisible = true;
        }
      })
    },
    // 编辑类别提交
    editorCategory() {
      this.$post("/admin/chemistry/cate_edit", {
        id: this.categoryId,
        name: this.categoryName
      }).then(res => {
        if (res.code === 1) {
          this.getList();
          this.categoryName = '';
          this.categoryId = null;
          this.$message.success(res.msg);
          this.dialogVisible = false;        
        } else {
          this.$message.error(res.msg);
        }
      })
    }
  }
}
</script>

<style scoped>
.add {
  margin: 20px;
}
.table {
  margin: 0 20px;
}
</style>