<template>
  <el-main>
    <el-row class="add">
      <el-col :span="3">
        <el-button @click="add" type="primary" size="mini"
          >添加系统菜单</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="rightsList"
      border
      borderstripe
      row-key="id"
      :tree-props="{ children: 'child', hasChildren: 'child.length>=0' }"
    >
      <el-table-column
        label="菜单名称"
        prop="name"
        align="center"
      ></el-table-column>
      <el-table-column
        label="前端地址"
        prop="url"
        align="center"
      ></el-table-column>
      <el-table-column
        label="后台地址"
        prop="admin_url"
        align="center"
      ></el-table-column>
      <el-table-column label="是否在菜单显示" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_show"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
            @change="userStateChanged(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editMenu(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" @click="removeMenu(scope.row)" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加菜单对话框 -->
    <el-dialog
      :title="isAdd ? '添加菜单' : '编辑菜单'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="form" label-width="100px" size="small">
        <el-form-item label="菜单名称">
          <el-input v-model="form.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-cascader
            :options="menuList"
            :props="treeProps"
            clearable
            v-model="form.pid"
            placeholder="请选择上级菜单"
            style="width: 100%;"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="form.icon" placeholder="请输入菜单图标"></el-input>
        </el-form-item>
        <el-form-item label="前端地址">
          <el-input v-model="form.url" placeholder="请输入前端地址"></el-input>
        </el-form-item>
        <el-form-item label="后台链接">
          <el-input
            v-model="form.admin_url"
            placeholder="请输入后台链接"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="is_show">
          <el-radio-group v-model="form.is_show">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入菜单排序"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="small">取 消</el-button>
        <el-button v-if="isAdd" type="primary" @click="handleAdd" size="small"
          >确 定</el-button
        >
        <el-button v-else type="primary" @click="handleEdit" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-main>
</template>

<script>
/* eslint-disable*/
export default {
  data() {
    return {
      // 权限列表
      rightsList: [],
      dialogVisible: false,
      form: {}, //表单
      isAdd: true, //判断表单是添加还是编辑
      menuList: [],
      ArrList: [],
      // 添加用户的表单数据
      // 树形控件的属性绑定对象
      treeProps: {
        value: "id",
        label: "name",
        children: "child",
        checkStrictly: true,
      },
    };
  },
  methods: {
    //获取所有菜单列表
    getMenuManagement() {
      this.$post("/admin/menu/select_menu").then((res) => {
        if (res.code !== 1) return this.$message.error(res.msg);
        this.menuList = res.list;
      });
    },
    // 监听 switch 开关状态的改变
    userStateChanged(item) {
      this.$post("/admin/menu/change_status", {
        id: item.id,
        dataSort: "is_show",
        sort: item.is_show,
      }).then((res) => {
        if (res.code !== 1) return this.$message.error(res.msg);
        this.$message.success(res.msg);
      });
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 监听添加用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 获取菜单数据
    getMenuList() {
      this.$post("/admin/menu/index").then((res) => {
        if (res.code !== 1) return this.$message.error(res.msg);
        this.rightsList = res.list;
      });
    },
    //添加菜单对话框展示
    add() {
      this.isAdd = true;
      this.dialogVisible = true;
    },
    // 确认添加菜单
    handleAdd() {
      if (this.form.pid) {
        this.form.pid = this.form.pid[this.form.pid.length - 1];
      } else {
        this.form.pid = 0;
      }
      this.$post("/admin/menu/add", this.form).then((res) => {
        if (res.code === 1) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
        this.form = {};
        // 隐藏添加用户的对话框;
        this.dialogVisible = false;
        // 重新获取菜单列表数据;
        this.getMenuList();
      });
    },
    // 点击编辑弹框
    editMenu(item) {
      this.$post("/admin/menu/getone", { id: item.id }).then((res) => {
        if (res.code === 1) {
          this.form = res.info;
          this.dialogVisible = true;
          this.isAdd = false;
        }
      });
    },
    //提交编辑确定按钮
    handleEdit() {
      console.log(typeof this.form.pid);
      if (typeof this.form.pid != "number") {
        this.form.pid = this.form.pid[this.form.pid.length - 1];
      }
      this.$post("/admin/menu/edit", this.form).then((res) => {
        if (res.code === 1) {
          this.form = {};
          this.$message.success(res.msg);
          this.dialogVisible = false;
          this.getMenuList();
        }
      });
    },
    handleClose() {
      this.form = {};
      this.dialogVisible = false;
    },
    // 点击删除弹框
    removeMenu(item) {
      console.log(item);
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("/admin/menu/delete", { id: item.id }).then((res) => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success",
              });
              //删除后重新拉取
              this.getMenuList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },

  created() {
    this.getMenuManagement();
    this.getMenuList();
  },
};
</script>

<style scoped>
.add {
  margin-bottom: 20px;
}
</style>
