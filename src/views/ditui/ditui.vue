<template>
  <div class="ditui">
    <div class="daochu">
     <a href="http://new.schoolpi.net/admin/jianzhi/excel" target="_black">导出表单</a>
    </div>
    <el-table
      :data="sinlist"
      border>
      <el-table-column label="头像" align="center" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.headimg" class="headimg" v-if="scope.row.headimg !== ''">
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="姓名" align="center" width="150"></el-table-column>
      <el-table-column prop="create_time" label="签到时间" align="center" width="200"></el-table-column>
      <el-table-column prop="address" label="签到地点" align="center"></el-table-column>
      <el-table-column label="签到图片" align="center">
        <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.imgs" :key="index" >
              <a :href="item" target="_blank">
                <img :src="item" class="image">
              </a>
            </div>
        </template>
      </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleDelete(scope.row)" type="primary">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totals"
        :page-size="offset"
        @current-change="getCurrentage"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1, // 当前页数
      offset: 10, // 每页数量
      totals: 0, // 总条数
      sinlist: {}
    }
  },
  created() {
    this.getSinList()
  },
  methods: {
    /**
     * @function 获取数据
     * @description 获取签到列表数据
     * @param pages {number} 当前页数
     * @return sinlist {number} 当前页数的签到列表数据
     * @return totals {number} 签到列表数据总条数
     */
    getSinList(pages) {
      this.page = pages
      this.$post("/admin/jianzhi/index", {
        page: this.page,
        num: this.offset
      }).then(res => {
        this.sinlist = res.list
        this.totals = res.all_num
      })
    },
    getCurrentage(pages) {
      this.getSinList(pages)
    },
    handleDelete(item) {
      this.$post("/admin/jianzhi/del", {
        id: item.id,
        page: this.page
      }).then(res => {
        if (res.code === 1) {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getSinList(res.page)
        }
      })
    },
    daochu() {
      this.$post('/admin/jianzhi/excel')
    }
  }
}
</script>

<style scoped>
.ditui {
  padding: 20px;
}
.daochu {
  display: flex;
  margin-bottom: 20px;
}
.daochu a {
  text-decoration: none;
  width: 100px;
  height: 40px;
  ;line-height: 40px;
  text-align: center;
  color: #fff;
  background-color: #409EFF;
  border-radius: 4px;
}
.image {
  width: 50px;
  height: 50px;
}
.page {
  margin-top: 20px;
}
.headimg {
  width: 50px;
  height: 50px;
}
</style>
