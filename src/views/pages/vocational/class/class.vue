<template>
  <el-main>
    <div class="add">
      <div>
        <el-button @click="handleJump('', true)" type="primary" size="mini"
          >添加政策</el-button
        >
        <el-button
          v-if="batchDeleteList.length > 0"
          @click="handleDelete"
          type="danger"
          size="mini"
          >批量删除</el-button
        >
      </div>
    </div>
    <el-table border :data="classList" @selection-change="handleSelect">
      <el-table-column
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="province"
        label="地区"
        align="center"
      ></el-table-column>
      <el-table-column label="是否默认" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isdefault"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
            @change="changeSort(scope.row, scope.row.isdefault, 'isdefault')"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleJump(scope.row, false)"
            type="primary"
            size="mini"
            >编辑</el-button
          >
          <el-button @click="handleDelete(scope.row)" type="danger" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totals"
        :page-size="offset"
        @current-change="getCurrentPage"
      ></el-pagination>
    </div>
  </el-main>
</template>
<script>
export default {
  data() {
    return {
      page: 1, //当前页数
      offset: 15, //每页数量
      totals: 0, //总条数
      optionList: [], //配置项（专业列表）
      classList: [], //政策课堂列表
      batchDeleteList: [], //批量删除的ID数组
    };
  },
  created() {
    this.loadClassList();
    this.loadOption();
  },
  methods: {
    getCurrentPage(pages) {
      this.loadClassList(pages);
    },
    //加载学校列表
    loadClassList(pages) {
      this.page = pages;
      this.$post("/admin/vocational/index_policy", {
        page: this.page,
        num: this.offset,
      }).then((res) => {
        if (res.code === 1) {
          this.classList = res.list;
          this.totals = res.all_num;
        } else {
          this.classList = res.list;
          this.totals = 0;
        }
      });
    },
    //加载地区供添加编辑搜索使用
    loadOption() {
      this.$post("/admin/vocational/condition_school").then((res) => {
        if (res.code === 1) {
          this.optionList = res.region;
        }
      });
    },
    changeSort(item, value, dataSort) {
      this.$post("/admin/vocational/ajaxsort_policy", {
        id: item.id,
        dataSort: dataSort,
        sort: value,
      });
    },
    handleJump(item, isAdd) {
      this.$router.push({
        name: "vocational-modifyClass",
        query: {
          id: item.id,
          isAdd: isAdd,
        },
      });
    },
    //点击多选
    handleSelect(val) {
      //处理数组，将id遍历出来
      if (val.length === 0) {
        this.batchDeleteList = [];
      } else {
        //处理数组，将id遍历出来
        var arr = [];
        val.forEach((item) => {
          arr.push(item.id);
          this.batchDeleteList = [...arr];
        });
      }
    },

    //批量删除结合单个删除
    handleDelete(item) {
      if (item.id) {
        //如果item存在则是点击单个数据删除
        this.batchDeleteList.push(item.id);
      }
      this.$confirm("此操作将永久删除该学校, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("/admin/vocational/delete_policy", {
            id: this.batchDeleteList,
          }).then((res) => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success",
              });
              this.batchDeleteList = [];
              //删除后重新拉取
              this.loadClassList();
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
};
</script>
<style scoped>
.pagination {
  margin: 20px 0 0 -10px;
}
.mt {
  margin-top: 7px;
}
.mr {
  margin-right: 10px;
}
.add {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.forbidden {
  color: red;
}
.usual {
  color: blue;
}
</style>
