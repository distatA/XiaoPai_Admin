<template>
  <div>
    <div class="operation">
      <div class="btn_box">
        <el-button class="btn" type="primary" @click="dialogVisible = true"
          >批量导入</el-button
        >
        <el-button class="btn" type="primary" @click="getRankListDetail(1)"
          >QS排名</el-button
        >
        <el-button class="btn" type="primary" @click="getRankListDetail(2)"
          >US排名</el-button
        >
        <el-button class="btn" type="primary" @click="getRankListDetail(3)"
          >软科排名</el-button
        >
        <el-button class="btn" type="primary" @click="getRankListDetail(4)"
          >校友会排名</el-button
        >
        <el-button class="btn" type="primary" @click="getRankListDetail(5)"
          >武书连排名</el-button
        >
      </div>
      <div class="inputbox">
        <el-select v-model="province" placeholder="请选择地区">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="name"
          class="input"
          placeholder="请输入学校名称"
          clearable
        >
        </el-input>
        <el-button type="primary" class="import" @click="search"
          >搜索</el-button
        >
      </div>
    </div>
    <div class="rank_title">{{ sum }}</div>
    <div class="table">
      <el-table :data="tableData" border>
        <el-table-column
          label="学校"
          prop="name"
          align="center"
        ></el-table-column>
        <!--  prop="rank"  -->
        <el-table-column label="排名" align="center" width="80">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.rank"
              @change="changeRank(scope.row.id, scope.row.rank)"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="类别"
          prop="cate"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totals"
        :page-size="num"
        @current-change="getCurrentage"
      ></el-pagination>
    </div>
    <!-- 批量导入弹框 -->
    <el-dialog
      title="批量导入"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <div class="stencil">
        <span style="margin-right: 20px;">模板下载：</span>
        <a href="http://new.schoolpi.net/admin/chemistry/download"
          >排行导入模板</a
        >
      </div>
      <div style="display: flex; align-items: center;">
        <span style="margin-right: 20px;">Excel导入：</span>
        <el-upload
          class="upload-demo"
          ref="upload"
          :data="token"
          show-file-list
          :file-list="fileList"
          :on-success="success"
          :before-upload="beforeImport"
          action="http://new.schoolpi.net/admin/import/import"
        >
          <el-button
            size="mini"
            type="primary"
            v-loading.fullscreen.lock="fullscreenLoading"
            >点击上传</el-button
          >
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="successImport">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 导入情况弹窗 -->
    <el-dialog title="提示" :visible.sync="importDialogVisible" width="30%">
      <h3>成功</h3>
      <span>{{ uploadInfo.msg }}</span>
      <h3 style="margin-top: 20px;">失败</h3>
      <div v-for="(item, index) in uploadInfo.fail" :key="index">
        {{ item }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      importDialogVisible: false, // 控制导入情况弹窗
      fullscreenLoading: false,
      dialogVisible: false, // 控制批量导入弹窗
      tableData: [],
      token: {
        token: window.localStorage.getItem("token"),
      },
      uploadInfo: {
        fail: [],
      },
      fileList: [],
      filePath: "",
      options: [], // 省份总数据
      type: 1, // 类别
      page: 1, // 页码
      num: 15, // 每页显示条数
      totals: 0, // 总条数
      name: "", // 学校名称
      province: "", // 选中的省份
      idList: [],
    };
  },
  created() {
    this.getRankList();
    this.getRegion();
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$refs.upload.clearFiles();
      this.dialogVisible = false;
    },
    // handleCloseImport() {
    //   this.importDialogVisible = false;
    // },
    // 获取排名列表
    getRankList(pages) {
      this.page = pages;
      this.$post("/admin/chemistry/index", {
        type: this.type,
        page: this.page,
        num: this.num,
        name: this.name,
        province: this.province,
      }).then((res) => {
        if (res.code === 1) {
          this.tableData = res.list;
          this.totals = res.all_num;
          this.name = "";
          this.province = "";
          console.log(this.totals);
        } else {
          this.name = "";
          this.province = "";
          // 没有搜索结果显示该类别所有排名
          // this.getRankList()
          this.tableData = [];
          this.$message.error(res.msg);
        }
      });
    },
    // 获取单独的排名
    getRankListDetail(type) {
      this.type = type;
      this.tableData = [];
      this.totals = 0;
      this.name = "";
      this.getRankList(1);
    },
    // 获取地区
    getRegion() {
      this.$post("/admin/school/condition_school").then((res) => {
        if (res.code === 1) {
          console.log(res.region);
          this.options = res.region;
        }
      });
    },
    // 搜索
    search() {
      this.getRankList();
    },
    // 翻页
    getCurrentage(pages) {
      this.getRankList(pages);
    },
    // 导入成功
    success(res) {
      this.filePath = res.data.path;
      this.fullscreenLoading = false;
    },
    successImport() {
      this.$post("/admin/chemistry/excel_school", {
        path: this.filePath,
      }).then((res) => {
        if (res.code === 1) {
          this.uploadInfo = res;
          console.log(res);
          this.dialogVisible = false;
          this.$refs.upload.clearFiles();
          this.importDialogVisible = true;
          this.getRankList(1);
        }
      });
    },
    beforeImport() {
      this.fullscreenLoading = true;
    },
    // 删除
    handleDelete(id) {
      this.idList.push(id);
      this.$confirm("此操作将永久删除该类别, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("/admin/chemistry/del", {
            id: this.idList,
          }).then((res) => {
            if (res.code === 1) {
              this.idList = [];
              this.$message.success(res.msg);
              this.getRankList(this.page);
            } else {
              this.idList = [];
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 切换排名
    changeRank(id, rank) {
      this.$post("/admin/chemistry/edit", {
        id: id,
        rank: rank,
      }).then((res) => {
        if (res.code === 1) {
          this.$message.success(res.msg);
          this.getRankList(this.page);
        }
      });
    },
  },
  computed: {
    sum: function() {
      if (this.type === 1) {
        return "QS排行";
      } else if (this.type === 2) {
        return "US排行";
      } else if (this.type === 3) {
        return "软科排行";
      } else if (this.type === 4) {
        return "校友会排行";
      } else {
        return "武书连排名";
      }
    },
  },
};
</script>

<style scoped>
a {
  /* text-decoration: none; */
  color: #333;
}
.operation {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  height: 40px;
  margin: 20px;
}
.btn {
  height: 40px;
}
.inputbox {
  height: 40px;
}
.input {
  width: 250px;
  margin-left: 20px;
  margin-right: 20px;
}
.stencil {
  margin-bottom: 30px;
}
.rank_title {
  margin: 0 20px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}
.table {
  margin: 0 20px;
}
.upload-demo {
  display: flex;
  align-items: center;
}
.page {
  margin: 20px;
}
</style>
