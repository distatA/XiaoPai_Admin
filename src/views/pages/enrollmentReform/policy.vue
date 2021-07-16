<template>
  <el-main>
    <div class="btn">
      <el-button
        type="primary"
        size="mini"
        @click="handleJump('','enrollmentReform-policyDetails','true')"
      >添加</el-button>
      <div class="search">
        <el-input v-model="title" class="search-item" clearable placeholder="请输入标题" size="mini"></el-input>
        <el-button type="primary" size="mini" @click="search">搜索</el-button>
      </div>
    </div>
    <el-table border :data="infoList" class="list">
      <el-table-column align="center" type="index" width="55"></el-table-column>
      <el-table-column align="center" label="封面图" width="200">
        <template slot-scope="scope">
          <img class="thumb" :src="scope.row.thumb" alt />
        </template> 
      </el-table-column>
      <el-table-column align="center" prop="title" label="标题"></el-table-column>
      <el-table-column align="center" prop="tag" label="标签" width="280"></el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleJump(scope.row,'enrollmentReform-policyDetails','false')"
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
.search {
  display: flex;
}
.thumb {
  width: 150px;
  height: 130px;
}
.thumb img {
  width: 100%;
  height: 100%;
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
      title: "", //标题
      page: 1, //当前页数
      offset: 15, //每页数量
      totals: 0, //总条数
      infoList: [] //列表信息
    };
  },
  methods: {
    getInfo(title, page) {
      this.$post("/admin/reform/policy", {
        title: title,
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
    // 搜索
    search() {
      this.getInfo(this.title);
    },
    //
    getCurrentage() {
      this.getInfo("", this.page);
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
          this.$post("/admin/reform/policy_del", {
            id: arr
          }).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.arr = [];
              //删除后重新拉取
              this.getInfo();
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
    this.getInfo("", 1);
  }
};
</script>

