<template>
  <div style="margin: 20px;">
    <el-button type="primary" size="mini" style="margin-bottom: 20px;" @click="add">添加招生信息</el-button>
    <el-button v-if="batchDeleteList.length>0" @click="deleteMessage" type="danger" size="mini">批量删除</el-button>
    <el-table :data="messageList" border style="width: 100%" @selection-change="handleSelect">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="title" label="标题" align="center"></el-table-column>
      <el-table-column prop="school" label="学校名称" width="300" align="center"></el-table-column>
      <el-table-column label="排序" align="center" width="100">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.sort"
            @change="changeSort(scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteMessage(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div style="margin-top: 20px">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="allNum"
        :page-size="num"
        @current-change="getCurrentPage"
      ></el-pagination>
    </div>
    <!-- 添加/编辑弹窗 -->
    <el-dialog title="添加招生信息" :visible.sync="dialogFormVisible" width="55%" :before-close="closeDialog">
      <el-form :model="form">
        <el-form-item label="标题：" label-width="100px">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="排序：" label-width="100px">
          <el-input v-model="form.sort"></el-input>
        </el-form-item>
        <el-form-item label="内容：" label-width="100px">
          <editor v-model="form.content" @change="change"></editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button v-if="isAdd" type="primary" @click="addMessage">确 定</el-button>
        <el-button v-else type="primary" @click="editMessage">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import editor from "@/components/Editor1.vue"
export default {
  components: {
    editor
  },
  data() {
    return {
      isAdd: true, // 是否为添加
      dialogFormVisible: false, // 控制弹窗
      messageList: [], // 招生信息列表
      schoolId: null, // 学校ID
      page: 1, // 当前页数
      pages: 1, // 当前选中的页数
      num: 15, // 每页显示条数
      allNum: null, // 总条数
      form: { // 表单数据
        content: ''
      },
      batchDeleteList: [], //批量删除的ID数组
    }
  },
  created() {
    let that = this
    that.schoolId = that.$route.query.sid
    // 获取招生信息列表
    that.getMessageList(1)
  },
  methods: {
    // 获取招生信息列表
    getMessageList(page) {
      let that = this
      that.page = page
      that.$post('/admin/vocational/list_school_enroll', {
        school_id: that.schoolId,
        page: that.page,
        num: that.num
      }).then(res => {
        if (res.code === 1) {
          that.messageList = res.list
          that.allNum = res.all_num
        }
      })
    },
    // 分页
    getCurrentPage(pages) {
      let that = this
      that.pages = pages
      that.getMessageList(pages)
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

    // 切换排序
    // /admin/vocational/sort_school_enroll
    changeSort(item) {
      let that = this
      let id = item.id
      let sort = item.sort
      that.$post('/admin/vocational/sort_school_enroll', {
        id: id,
        sort: sort
      }).then(res => {
        if (res.code === 1) {
          that.$message.success(res.msg)
        } else {
          that.$message.success(res.msg)
        }
      })
    },

    // 关闭弹窗
    closeDialog() {
      let that = this
      that.dialogFormVisible = false
      that.form = { content: '' }
    },
    // 获取富文本编辑器内容
    change(val) {
      let that = this
      that.form.content = val
    },
    // 打开添加招生信息弹窗
    add() {
      let that = this
      that.dialogFormVisible = true
      that.isAdd = true
    },
    // 添加招生信息
    addMessage() {
      let that = this
      let model = {
        school_id: that.schoolId,
        ...that.form
      }
      that.$post('/admin/vocational/write_school_enroll', model).then(res => {
        if (res.code === 1) {
          that.closeDialog()
          that.$message.success('添加成功')
          // that.page = 1
          that.getMessageList(that.pages)
        }
      })
    },
    // 打开编辑招生信息弹窗
    edit(item) {
      let that = this
      that.dialogFormVisible = true
      that.isAdd = false
      that.$post('/admin/vocational/getone_school_enroll', {
        id: item.id
      }).then(res => {
        if (res.code === 1) {
          that.form = res.info
        }
      })
    },
    // 编辑招生信息
    editMessage() {
      let that = this
      that.$post('/admin/vocational/write_school_enroll', that.form).then(res => {
        if (res.code === 1) {
          that.closeDialog()
          that.$message.success('编辑成功')
          that.getMessageList(that.pages) 
        }
      })
    },
    // 删除招生信息
    deleteMessage(item) {
      let that = this
      if (item.id) {
        that.batchDeleteList.push(item.id)
      }
      that.$confirm("此操作将永久删除该专业, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        that.$post('/admin/vocational/delete_school_enroll', {
          id: that.batchDeleteList
        }).then(res => {
          if (res.code === 1) {
            that.$message.success(res.msg)
            that.batchDeleteList = []
            that.getMessageList(that.pages)
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

<style scoped>

</style>
