<template>
  <el-main>
    <div class="flex">
      <div>
        <el-button type="primary" size="mini" @click="handleJump('add','')">添加直播间</el-button>

        <el-button @click="handleHandleJump" type="primary" size="mini">红包记录</el-button>
        <el-button @click="handleColumn" type="primary" size="mini">栏目设置</el-button>
        <el-button @click="handleActivity" type="primary" size="mini">直播活动</el-button>

        <el-button
          type="danger"
          size="mini"
          v-if="batchDeleteList.length>0"
          @click="handleDelete"
        >批量删除</el-button>
      </div>
    </div>

    <el-table border :data="policyList" @selection-change="handleSelect">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="直播间封面" width="180">
        <template slot-scope="scope">
          <img class="thumb" :src="scope.row.thumb[0]" alt />
        </template>
      </el-table-column>
      <el-table-column prop="room_name" label="直播间名称" width="180"></el-table-column>
      <el-table-column prop="cate_name" label="房间类型" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.room_type ===1">本科</div>
          <div v-if="scope.row.room_type ===2">专科</div>
          <div v-if="scope.row.room_type ===3">其他</div>
        </template>
      </el-table-column>
      <el-table-column prop="admin_name" label="讲师" align="center"></el-table-column>
      <!-- <el-table-column prop="cate_name" label="房间类型" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.room_type ===1">本科</div>
          <div v-if="scope.row.room_type ===2">专科</div>
          <div v-if="scope.row.room_type ===3">其他</div>
        </template>
      </el-table-column> -->
      <el-table-column prop="orders" label="预约人数" align="center"></el-table-column>
      <!-- <el-table-column prop="online" label="在线人数" align="center"></el-table-column> -->
      <el-table-column label="创建时间" align="center" width="200">
        <template slot-scope="scope">{{scope.row.ctime|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="操作" width="550" align="center" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-button @click="handleJump('edit',scope.row)" type="primary" size="mini">编辑</el-button>
            <el-button
              @click="handleColumnJump('live-user',scope.row)"
              type="primary"
              size="mini"
            >用户列表</el-button>
            <el-button @click="handleColumnJump('live-video',scope.row)" type="primary" size="mini">精彩视频文字</el-button>
            <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
            <el-button @click="irrigation(scope.row)" type="primary" size="mini">灌水</el-button>
          </div>
          <div style="margin-top:20px;">
            <el-dropdown class="ml-l">
              <span class="el-dropdown-link">
                分类招生
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="handleColumnJump('live-schoolMajor',scope.row)"
                >学校专业</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleColumnJump('live-schoolScore',scope.row)"
                >学校分数</el-dropdown-item>
                <el-dropdown-item @click.native="handleColumnJump('live-scoreList',scope.row)">分数附表</el-dropdown-item>
                <el-dropdown-item @click.native="handleColumnJump('live-question',scope.row)">直播问题</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown class="ml">
              <span class="el-dropdown-link">
                秋季招生
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="handleColumnJump('live-schoolCollege',scope.row)"
                >学校专业</el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleColumnJump('live-schoolDepart',scope.row)"
                >学校院系</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
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
<script>
/*eslint-disable*/
export default {
  data() {
    return {
      page: 1, //当前页数
      offset: 15, //每页数量
      totals: 0, //总条数
      policyList: [],
      province: "",
      region: [], //地区搜索
      batchDeleteList: [] //批量删除按钮
    };
  },
  created() {
    this.loadPolicyList();
    this.loadOptions();
  },
  filters: {
    formatDate: function(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    }
  },
  methods: {
    loadOptions() {
      this.$post("/admin/classifie/condition_policy").then(res => {
        if (res.code === 1) {
          this.region = res.region; //地区搜索
        }
      });
    },
    //解决搜索之后，点击分页仍可以查询全部的bug
    getCurrentage(pages) {
      this.loadPolicyList(pages, this.province);
    },
    //加载政策列表
    loadPolicyList(pages, province) {
      this.page = pages;
      this.$post("/admin/live/index", {
        page: this.page,
        num: this.offset,
        province: province
      }).then(res => {
        if (res.code === 1) {
          this.policyList = res.list;
          this.totals = res.all_num;
        } else {
          this.policyList = [];
          this.totals = 0;
        }
      });
    },
    changeSort(item, value, dateSort) {
      this.$post("/admin/classifie/ajaxsort_policy", {
        id: item.id,
        dataSort: dateSort,
        sort: value
      }).then(res => {});
    },
    //点击多选
    handleSelect(val) {
      if (val.length === 0) {
        this.batchDeleteList = [];
      } else {
        //处理数组，将id遍历出来
        var arr = [];
        val.forEach(item => {
          arr.push(item.room_id);
          this.batchDeleteList = [...arr];
        });
      }
      console.log(this.batchDeleteList);
    },
    handleDelete(item) {
      if (item.room_id) {
        //如果item存在则是点击单个数据删除
        this.batchDeleteList.push(item.room_id);
      }
      this.$confirm("此操作将永久删除直播间, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/admin/live/delete", {
            room_id: this.batchDeleteList
          }).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.batchDeleteList = [];
              //删除后重新拉取
              this.loadPolicyList();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleJump(isAdd, item) {
      this.$router.push({
        name: "live-modifyLive",
        query: {
          state: isAdd,
          room_id: item.room_id
        }
      });
    },
    handleHandleJump(item) {
      this.$router.push({
        name: "live-redBag"
      });
    },
    handleColumnJump(url, item) {
      this.$router.push({
        name: url,
        query: {
          sid: item.school_id,
          type: item.room_type,
          room_id: item.room_id
        }
      });
    },
    handleColumn() {
      this.$router.push({
        name: "live-column"
      });
    },
    handleActivity(){
 this.$router.push({
        name: "live-activity"
      });
    },
    irrigation(item) {
      this.$router.push({
        name: "live-irrigation",
        query: {
          room_id: item.room_id
        }
      });
    }
  }
};
</script>
<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.search-item {
  width: 120px;
  margin-right: 10px;
}
/* .el-input >>> .el-input__inner {
    text-align: center;
} */
.pagination {
  margin: 20px 0 0 -10px;
}
.thumb {
  width: 100px;
  height: 80px;
}
.thumb img {
  width: 100%;
  height: 100%;
}
.ml {
  margin: 0 20px 0 0;
  border: 1px #ccc solid;
  padding: 2px 5px;
  border-radius: 3px;
  cursor: pointer;
}
.ml-l {
  margin: 0 20px;
  border: 1px #ccc solid;
  padding: 2px 5px;
  border-radius: 3px;
  cursor: pointer;
}
</style>