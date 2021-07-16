<template>
  <el-main>
    <div class="search">
      <div class="mt">
        <el-button type="primary" size="mini" @click="add">添加活动</el-button>
        <el-button
          v-if="batchDeleteList.length>0"
          @click="handleDelete"
          type="danger"
          size="mini"
        >批量删除</el-button>
      </div>
      <div class="flex">
        <div class="mr">
          <el-input v-model="school_name" placeholder="请输入学校名称" size="mini"></el-input>
        </div>
        <div class="m">
          <el-button size="mini" type="primary" @click="search">搜索</el-button>
        </div>
      </div>
    </div>

    <el-table border :data="policyList" @selection-change="handleSelect">
      <el-table-column type="selection" width="55" align="center"></el-table-column>

      <el-table-column prop="name" label="学校名称" align="center"></el-table-column>
      <el-table-column prop="orders" label="预约人数" align="center"></el-table-column>
      <el-table-column prop="start_time" label="活动时间" align="center" :formatter="fmtStart"></el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="primary" size="mini">编辑</el-button>
          <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

     <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totals"
                :page-size="offset"
                @current-change="loadList"
            ></el-pagination>
        </div>



    <el-dialog
      :title="isAdd?'添加活动':'编辑活动'"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form :model="form" label-width="100px" size="small">
        <el-form-item label="学校">
          <el-select
            v-model="form.school_id"
            filterable
            placeholder="请选择学校"
            style="display:block;width:100%"
          >
            <el-option
              v-for="item in optionsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="预约人数">
          <el-input v-model="form.orders" placeholder="请输入预约人数"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间"
            style="display:block;width:100%"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="small">取 消</el-button>
        <el-button v-if="isAdd" type="primary" @click="handleAdd" size="small">确 定</el-button>
        <el-button v-else type="primary" @click="handleEdit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </el-main>
</template>
<script>
/*eslint-disable*/

function formatDate(now) {
  var year = now.getFullYear(); //取得4位数的年份
  var month =
    now.getMonth() + 1 > 9 ? now.getMonth() + 1 : "0" + (now.getMonth() + 1); //取得日期中的月份，其中0表示1月，11表示12月
  var date = now.getDate() > 9 ? now.getDate() : "0" + now.getDate(); //返回日期月份中的天数（1到31）
  var hour = now.getHours() > 9 ? now.getHours() : "0" + now.getHours(); //返回日期中的小时数（0到23）
  var minute = now.getMinutes() > 9 ? now.getMinutes() : "0" + now.getMinutes(); //返回日期中的分钟数（0到59）
  var second = now.getSeconds() > 9 ? now.getSeconds() : "0" + now.getSeconds(); //返回日期中的秒数（0到59）
  return (
    year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
  );
}
export default {
  data() {
    return {
      school_name: "",
      page: 1, //当前页数
      offset: 15, //每页数量
      totals: 0, //总条数
      policyList: [],
      optionsList: [],
      form: {},
      isAdd: true,
      dialogVisible: false,
      thumbList: [],
      token: {
        token: window.localStorage.getItem("token")
      },
      batchDeleteList: [] //批量删除的ID数组
    };
  },
  created() {
    this.loadPolicyList();
    this.loadOption();
  },
  methods: {
      loadList(page){
          this.page = page;
          this.loadPolicyList()

      },
    search() {
      this.page = 1;
      this.loadPolicyList();
    },
    fmtStart(row) {
      return formatDate(new Date(row.start_time * 1000));
    },
    loadOption() {
      //condition_column
      this.$post("/admin/live/condition_activity").then(res => {
        if (res.code === 1) {
          this.optionsList = res.list;
        }
      });
    },
    //加载政策列表
    loadPolicyList() {
      this.$post("/admin/live/index_activity", {
        page: this.page,
        num: this.offset,
        school_name: this.school_name
      }).then(res => {
        if (res.code === 1) {
          this.policyList = res.list;
          this.totals = res.all_num;
        } else {
          this.policyList = [];
          this.totals = 0;
        }
      });
    }, //ajaxsort_column
    changeSort(id, value, dateSort) {
      console.log(value, dateSort);
      this.$post("/admin/live/ajaxsort_column", {
        id: id,
        dataSort: dateSort,
        sort: value
      }).then(res => {});
    },
    handleClose() {
      this.dialogVisible = false;
      this.form = {};
      this.thumbList = [];
    },
    add() {
      this.isAdd = true;
      this.dialogVisible = true;
    },
    handleAdd() {
      let { school_id, orders, start_time } = this.form;
      var model = {
        school_id: school_id,
        orders: orders,
        start_time: start_time / 1000
      };
      this.$post("/admin/live/add_activity", model).then(res => {
        if (res.code === 1) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.handleClose();
          this.dialogVisible = false;
          this.loadPolicyList(1);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    edit(item) {
      this.$post("/admin/live/getone_activity", {
        id: item.id
      }).then(res => {
        if (res.code === 1) {
          this.form = res.info;
          this.form.start_time = res.info.start_time * 1000;

          this.isAdd = false;
          this.dialogVisible = true;
        }
      });
    },
    handleEdit() {
      let { school_id, orders, start_time, id } = this.form;
      var model = {
        id: id,
        school_id: school_id,
        orders: orders,
        start_time: start_time / 1000
      };
      this.$post("/admin/live/edit_activity", model).then(res => {
        if (res.code === 1) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.dialogVisible = false;
          this.handleClose();
          this.loadPolicyList(1);
        } else {
          this.$message.error(res.msg);
        }
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
        val.forEach(item => {
          arr.push(item.id);
          this.batchDeleteList = [...arr];
        });
      }
      console.log(this.batchDeleteList);
    },
    //批量删除结合单个删除
    handleDelete(item) {
      if (item.id) {
        //如果item存在则是点击单个数据删除
        this.batchDeleteList.push(item.id);
      }
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/admin/live/delete_activity", {
            id: this.batchDeleteList
          }).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.batchDeleteList = [];
              //删除后重新拉取
              this.loadPolicyList();
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
  }
};
</script>
<style scoped>
.search {
  display: flex;
  justify-content: space-between;
}
.flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.mt {
  margin-bottom: 10px;
}
.mr {
  margin-right: 10px;
}
.table {
  margin: 0 20px;
}
/* .el-input >>> .el-input__inner {
    text-align: center;
} */
.pagination {
  margin: 20px 0 0 -10px;
}
.logo {
  width: 60px;
  height: 60px;
  margin: 0 auto;
}
.logo img {
  width: 100%;
  height: 100%;
}
</style>