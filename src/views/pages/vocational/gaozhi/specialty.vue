<template>
  <div style="margin: 20px;">
    <el-button type="primary" size="mini" style="margin-bottom: 20px;" @click="add">添加专业</el-button>
    <el-button v-if="batchDeleteList.length>0" @click="deleteSpecialty" type="danger" size="mini">批量删除</el-button>
    <el-table :data="specialtyList" border style="width: 100%" @selection-change="handleSelect">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="name" label="专业" align="center"></el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <!-- slot-scope="scope" -->
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editor(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteSpecialty(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="allNum"
        :page-size="num"
        @current-change="getCurrentPage"
      ></el-pagination>
    </div>
    <!-- title="{{isAdd ? '添加专业' : '编辑专业'}}"  -->
    <el-dialog :title="isAdd ? '添加专业' : '编辑专业'" :visible.sync="dialogFormVisible" :before-close="closeDialog">
      <el-form :model="form">
        <el-form-item label="专业名称：" label-width="100px">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button v-if="isAdd" type="primary" @click="addSpecialty">确 定</el-button>
        <el-button v-if="!isAdd" type="primary" @click="editorSpecialty">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false, // 控制添加/编辑弹窗
      specialtyList: [], // 专业列表数据
      page: 1, // 当前页数
      pages: null, // 当前选中的页面
      num: 15, // 每页显示条数
      allNum: null, //总条数
      isAdd: true, // 是否为添加
      form: { // 表单数据
        name: null
      },
      school_id: null, //学校ID
      id: null, // 编辑的ID
      batchDeleteList: [], //批量删除的ID数组
    }
  },
  created() {
    let that = this
    // 获取学校ID
    that.school_id = that.$route.query.school_id
    // 获取专业列表
    that.getSpecialtyList(1)
  },
  methods: {
    // 获取专业列表
    getSpecialtyList(page) {
      let that = this
      that.page = page
      let school_id =  this.$route.query.school_id
      that.$post('/admin/vocational/list_school_major', {
        school_id: school_id,
        page: that.page,
        num: that.num
      }).then(res => {
        if (res.code === 1) {
          that.specialtyList = res.list
          that.allNum = res.all_num
        }
      })
    },
    // 分页
    getCurrentPage(pages) {
      let that = this
      that.pages = pages
      that.getSpecialtyList(pages)
    },
    //点击多选
    handleSelect(val) {
      //处理数组，将id遍历出来
      if (val.length === 0) {
        this.batchDeleteList = []
      } else {
        //处理数组，将id遍历出来
        let arr = []
        val.forEach(item => {
          arr.push(item.id)
          this.batchDeleteList = [...arr]
        });
      }
    },
    // 关闭弹窗
    closeDialog() {
      let that = this
      that.dialogFormVisible = false
      that.form.name = null
    },
    // 打开添加专业弹窗
    add() {
      let that = this
      that.dialogFormVisible = true
      that.isAdd = true
    },
    // 添加专业
    addSpecialty() {
      let that = this
      let school_id =  this.$route.query.school_id
      that.$post('/admin/vocational/write_school_major', {
        school_id: school_id,
        name: that.form.name
      }).then(res => {
        if (res.code === 1) {
          that.closeDialog()
          that.$message.success('添加成功')
          that.getSpecialtyList(that.pages)
        }
      })
    },
    // 打开编辑专业弹窗
    editor(item) {
      let that = this
      that.isAdd = false
      that.form.name = item.name
      that.id = item.id
      that.dialogFormVisible = true
    },
    // 编辑专业
    editorSpecialty() {
      let that = this
      that.$post('/admin/vocational/write_school_major', {
        id: that.id,
        school_id: that.school_id,
        name: that.form.name
      }).then(res => {
        if (res.code === 1) {
          that.closeDialog()
          that.$message.success('编辑成功')
          that.getSpecialtyList(that.pages)
        }
      })
    },
    // 删除专业
    deleteSpecialty(item) {
      let that = this
      if (item.id) {
        console.log('我是单独删除')
        that.batchDeleteList.push(item.id)
      }
      that.$confirm("此操作将永久删除该专业, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        that.$post('/admin/vocational/delete_school_major', {
          id: that.batchDeleteList
        }).then(res => {
          if (res.code === 1) {
            that.$message.success(res.msg)
            that.batchDeleteList = []
            that.getSpecialtyList(that.pages)
          }
        })
      }).catch(() => {
        that.$message.info('已取消删除')
        that.batchDeleteList = []
      })
    }
  }
}
</script>
