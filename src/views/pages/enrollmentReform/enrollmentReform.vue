<template>
  <el-main>
    <div class="btn">
      <el-button
        type="primary"
        size="mini"
        @click="handleJump('','enrollmentReform-school','true')"
      >添加学校</el-button>
      <div class="search">
        <el-input v-model="name" class="search-item" clearable placeholder="请输入学校名称" size="mini"></el-input>
        <el-button type="primary" size="mini" @click="search">搜索</el-button>
      </div>
    </div>
    <el-table border :data="schoolList" class="list">
      <el-table-column align="center" type="index" width="55"></el-table-column>
      <el-table-column align="center" prop="name" label="学校名称"></el-table-column>
      <el-table-column prop="province" label="所在地区" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.province}}-{{scope.row.province}}</div>
        </template>
      </el-table-column>
      <el-table-column label="热门排序" align="center" width="100">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.sort"
            @change="changeSort(scope.row,scope.row.sort,'sort')"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="是否热门" align="center" width="150">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_hot"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
            @change="changeSort(scope.row,scope.row.is_hot,'is_hot')"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleJump(scope.row,'enrollmentReform-school','false')"
            type="primary"
            size="mini"
          >编辑</el-button>
          <el-button @click="handleDelete(scope.row.id)" type="danger" size="mini">删除</el-button>
          <el-dropdown class="select">
            <span class="el-dropdown-link">
              下拉菜单
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="handleJump(scope.row,'enrollmentReform-admissionsGuide')"
              >招生简章</el-dropdown-item>
              <el-dropdown-item @click.native="handleJump(scope.row,'enrollmentReform-major')">招生专业</el-dropdown-item>
              <el-dropdown-item @click.native="handleJump(scope.row,'enrollmentReform-exam')">考试报名</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
      name: "",
      page: 1, //当前页数
      offset: 10, //每页数量
      totals: 0, //总条数
      schoolList: [] //学校列表信息
    };
  },
  methods: {
    // 搜索
    search() {
      this.getSchool(this.name);
    },
    getSchool(name, page) {
      this.$post("/admin/reform/school", {
        name: name,
        page: page,
        num:this.offset
      }).then(res => {
        if (res.code == 1) {
          this.schoolList = res.list;
          this.totals = res.all_num;
        } else if (res.code == 0) {
          this.schoolList = [];
        }
        window.console.log("totals",this.totals)
      });
    },
    //
    getCurrentage(page) {
      // console.log(e)
      this.getSchool('',page);
     
    },
    // 页面跳转
    handleJump(item, url, isAdd) {
      this.$router.push({
        name: url,
        query: {
          id: item.id,
          sid:item.sid,
          isAdd: isAdd
        }
      });
    },
    //更改排序
    changeSort(item, value, dateSort) {
      this.$post("/admin/reform/ajax_sort", {
        id: item.id,
        dataSort: dateSort,
        sort: value
      }).then(res => {
        if (res.code == 0) {
          this.$message.error(res.msg);
        }
      });
    },
    handleDelete(id) {
      if (id) {
        var arr = [];
        arr.push(id);
      }
      this.$confirm("此操作将永久删除学校, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/admin/reform/school_del", {
            id: arr
          }).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.arr = [];
              //删除后重新拉取
              this.getSchool();
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
    this.getSchool();
  }
};
</script>
