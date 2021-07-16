<template>
  <div style="margin: 20px">
    <div class="butbox">
      <div>
        <el-button type="primary" size="mini" style="margin-bottom: 20px;" @click="add">添加文章</el-button>
        <el-button v-if="batchDeleteList.length>0" @click="deleteInformation" type="danger" size="mini">批量删除</el-button>
      </div>
      <div class="inputbox">
        <el-select v-model="province" placeholder="请选择地区" size="mini">
          <el-option
            v-for="item in regionList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="title"
          class="input"
          placeholder="请输入文章标题"
          clearable
          size="mini"
        >
        </el-input>
        <el-button size="mini" type="primary" class="import" @click="search"
          >搜索</el-button
        >
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelect">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="title" label="标题" width="450"></el-table-column>
      <el-table-column prop="province" label="适用地区" align="center"></el-table-column>
      <el-table-column label="排序" align="center" width="100">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.sort"
            @change="changeSort(scope.row)"
          ></el-input>
          </template>
      </el-table-column>
      <el-table-column label="是否显示" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            @change="switchShow(scope.row)"
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="发布时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteInformation(scope.row)">删除</el-button>
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
    <el-dialog title="添加文章" :visible.sync="dialogFormVisible" width="55%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="文章标题：">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="省份：">
          <el-select v-model="form.province_id" placeholder="请选择省份">
            <el-option
              v-for="item in regionList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间：">
          <el-date-picker
            v-model="form.create_time"
            value-format="timestamp"
            type="datetime"
            placeholder="请选择发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="form.sort" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="是否显示：">
          <el-radio v-model="form.status" label='1'>是</el-radio>
          <el-radio v-model="form.status" label='0'>否</el-radio>
        </el-form-item>
        <el-form-item label="内容：">
          <editor v-model="form.content" @change="change"></editor>
        </el-form-item>
      </el-form> 
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button v-if="isAdd" type="primary" @click="addInformation">确 定</el-button>
        <el-button v-else type="primary" @click="editInformation">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import editor from "@/components/Editor1.vue"
export default {
  data() {
    return {
      id: null, // 编辑文章的ID
      isAdd: true, // 是否为增加
      tableData: [], //表格数据
      dialogFormVisible: false, //添加/编辑弹窗
      form: {}, // 表单数据
      regionList: [], //地区
      province: null, // 省份ID
      title: null, // 文章标题
      batchDeleteList: [], //批量删除的ID数组
      page: 1, // 当前页数
      pages: null, // 当前选中页面
      num: 15, // 每页显示条数
      allNum: null // 总条数
    }
  },
  components: {
    editor, 
  },
  created() {
    let that = this
    // 获取资讯列表
    that.getInformationList()
    // 获取地区
    that.getRegion()
  },
  methods: {
    // 获取资讯列表
    getInformationList(pages) {
      let that = this
      that.page = pages
      that.$post("/admin/vocational/list_information", {
        province: that.province,
        title: that.title,
        page: that.page,
        num: that.num
      }).then(res => {
        if (res.code === 1) {
          console.log(res.list)
          that.allNum = res.all_num
          that.tableData = res.list
        }
      })
    },
    // 获取地区
    getRegion() {
      let that = this
      that.$post("/admin/vocational/condition_enroll").then(res => {
        if (res.code === 1) {
          console.log(res)
          that.regionList = res.region
        }
      });
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
    // 分页
    getCurrentPage(pages) {
      let that = this
      that.pages = pages
      that.getInformationList(pages)
    },
    // 获取富文本编辑器内容
    change(val) {
      let that = this
      that.form.content = val
    },
    // 关闭弹窗
    closeDialog() {
      let that = this
      that.form = {}
      that.dialogFormVisible = false
    },
    // 打开添加文章弹窗
    add() {
      let that = this
      that.isAdd = true
      that.dialogFormVisible = true
    },
    // 添加文章
    addInformation() {
      let that = this
      that.form.create_time = that.form.create_time/1000
      that.$post('/admin/vocational/write_information', that.form).then(res => {
        if (res.code === 1) {
          that.$message.success('添加成功')
          that.closeDialog()
          that.getInformationList(that.pages)
        }
      })
    },
    // 打开编辑文章弹窗
    edit(item) {
      console.log(item)
      let that = this
      that.dialogFormVisible = true
      that.isAdd = false
      that.id = item.id
      that.$post('/admin/vocational/getone_information', {
        id: that.id
      }).then(res => {
        if (res.code === 1) {
          that.form = res.info
          that.form.create_time = that.form.create_time * 1000
        }
      })
    },
    // 编辑文章
    editInformation() {
      let that = this
      that.form.create_time = that.form.create_time / 1000
      let model = {
        id: that.id,
        ...that.form
      }
      that.$post('/admin/vocational/write_information', model).then(res => {
        if (res.code === 1) {
          that.closeDialog()
          that.$message.success('编辑成功')
          that.getInformationList(that.pages)
        }
      })
    },
    // 删除文章
    deleteInformation(item) {
      let that = this
      if (item.id) {
        that.batchDeleteList.push(item.id)
      }
      that.$confirm("此操作将永久删除该专业, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        that.$post('/admin/vocational/delete_information', {
          id: that.batchDeleteList
        }).then(res => {
          if (res.code === 1) {
            that.$message.success(res.msg)
            that.batchDeleteList = []
            that.getInformationList(that.pages)
          }
        })
      }).catch(() => {
        that.$message.info('已取消删除')
        that.batchDeleteList = []
      })
    },

    // 切换是否显示
    switchShow(item) {
      let that = this
      let id = item.id
      let status = item.status
      that.$post('/admin/vocational/status_information', {
        id: id,
        status: status
      }).then(res => {
        console.log(res)
        if (res.code === 1) {
          that.$message.success(res.msg)
        } else {
          that.$message.success(res.msg)
        }
      })
    },

    // 切换排序
    changeSort(item) {
      // /admin/vocational/sort_information
      let that = this
      let id = item.id
      let sort = item.sort
      that.$post('/admin/vocational/sort_information', {
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

    // 搜索
    search() {
      let that = this
      that.tableData = []
      that.getInformationList(1)
    }
  }
}
</script>

<style scoped>
.butbox {
  display: flex;
  justify-content:space-between;
  width: 100%;
}

.inputbox {
  display: flex;
  height: 28px;
  /* align-items: center; */
}

.input {
  width: 250px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>