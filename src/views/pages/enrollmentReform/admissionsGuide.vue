<template>
  <el-main>
    <div class="btn">
      <el-button
        type="primary"
        size="mini"
        @click="handleJump('','enrollmentReform-guideDetails','true')"
      >添加招生简章</el-button>
    </div>
    <el-table border :data="infoList" class="list">
      <el-table-column align="center" type="index" width="55"></el-table-column>
      <el-table-column align="center" prop="school_name" label="学校名称"></el-table-column>
      <el-table-column align="center" prop="title" label="标题"></el-table-column>
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
          <el-button
            @click="handleJump(scope.row,'enrollmentReform-guideDetails','false')"
            type="primary"
            size="mini"
          >编辑</el-button>
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
  </el-main>
</template>
<style scoped>
.btn {
  display: flex;
  justify-content: space-between;
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
      sid:'',//学校id
      page: 1, //当前页数
      offset: 15, //每页数量
      totals: 0, //总条数
      infoList: [] //列表信息
    };
  },
  methods: {
    getInfo(sid, page) {
      this.$post("/admin/reform/enroll", {
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
      this.getInfo(this.sid,this.page);
    },
    // 页面跳转
    handleJump(item, url, isAdd) {
      this.$router.push({
        name: url,
        query: {
          id: item.id,
          sid: item.sid,
          isAdd: isAdd
        }
      });
    },
    //更改排序
    changeSort(item, value) {
      this.$post("/admin/reform/enroll_sort", {
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
          this.$post("/admin/reform/enroll_del", {
            id: arr
          }).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.arr = [];
              //删除后重新拉取
              this.getInfo(this.sid);
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
    this.getInfo(this.$route.query.sid, 1);
  }
};
</script>
