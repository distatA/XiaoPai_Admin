<template>
  <el-main>
    <div class="flex">
      <div style="display:flex;">
        <div>
          <el-button
            type="primary"
            size="mini"
            @click="handleJump('','classifie-modifySchool','true')"
          >添加学校</el-button>
        </div>

        <div style="margin-left:10px;">
          <el-upload
            class="upload-demo"
            :data="token"
            :show-file-list="false"
            :on-success="successImport"
            :before-upload="beforeImport"
            action="http://new.schoolpi.net/admin/import/import"
          >
            <el-button size="mini" type="primary" v-loading.fullscreen.lock="fullscreenLoading">点击上传</el-button>
          </el-upload>
        </div>

        <div style="margin-left:10px;">
          <el-button
            type="danger"
            size="mini"
            v-if="batchDeleteList.length>0"
            @click="handleDelete"
          >批量删除</el-button>
        </div>
      </div>
      <div class="flex">
        <el-cascader
          class="search-item"
          :options="region"
          :props="treeProps "
          clearable
          v-model="province"
          placeholder="请选择地区"
          size="mini"
        ></el-cascader>
        <el-input v-model="name" class="search-item" clearable placeholder="请输入学校名称" size="mini"></el-input>
        <el-button type="primary" size="mini" @click="loadSchoolList(1,province,name)">搜索</el-button>
      </div>
    </div>

    <el-table border :data="schoolList" @selection-change="handleSelect">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="学校名称"></el-table-column>
      <el-table-column prop="province" label="所在地区" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.province}}-{{scope.row.city}}</div>
        </template>
      </el-table-column>
      <el-table-column label="热门排序" align="center" width="100">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.hot_sort"
            @change="changeSort(scope.row,scope.row.hot_sort,'hot_sort')"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="人气" align="center" width="100">
        <template slot-scope="scope">
          <el-input
            class="sort"
            size="mini"
            v-model="scope.row.mood"
            @change="changeSort(scope.row,scope.row.mood,'mood')"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="是否热门" align="center" width="100">
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
            @click="handleJump(scope.row,'classifie-modifySchool','false')"
            type="primary"
            size="mini"
          >编辑</el-button>
          <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
          <el-dropdown class="ml">
            <span class="el-dropdown-link">
              下拉菜单
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="handleJump(scope.row,'classifie-schoolQuestion')"
              >学校真题</el-dropdown-item>
              <el-dropdown-item @click.native="handleJump(scope.row,'classifie-schoolMajor')">学校专业</el-dropdown-item>
              <el-dropdown-item @click.native="handleJump(scope.row,'classifie-score')">学校分数</el-dropdown-item>
              <el-dropdown-item @click.native="handleJump(scope.row,'classifie-specialScore')">特定分数</el-dropdown-item>
              <el-dropdown-item @click.native="handleJump(scope.row,'classifie-section')">招生简章</el-dropdown-item>
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
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <div>
        <h3>成功:</h3>
        <div>{{uploadInfo.msg}}</div>
      </div>
      <div style="margin-top:20px;" v-if="uploadInfo.fail.length>0">
        <h3>失败:</h3>
        <div v-for=" (item,index) in uploadInfo.fail" :key="index">{{item}}</div>
      </div>
    </el-dialog>
  </el-main>
</template>
<script>
/*eslint-disable*/
export default {
  data() {
    return {
      fullscreenLoading: false,
      dialogVisible: false,
      page: 1, //当前页数
      offset: 15, //每页数量
      totals: 0, //总条数
      schoolList: [],
      name: "", //学校名称搜索
      province: "", //地区
      region: [], //地区搜索
      treeProps: {
        value: "id",
        label: "name",
        children: "child",
        checkStrictly: true
      },
      token: {
        token: window.localStorage.getItem("token")
      },
      uploadInfo: {
        fail: []
      },
      batchDeleteList: [] //批量删除按钮
    };
  },
  created() {
    this.loadSchoolList();
    this.loadOptions();
  },
  methods: {
    successImport(res, file, fileList) {
      this.$post("/admin/import/class_school_career", {
        fullpath: res.data.path
      }).then(res => {
        if (res.code === 1) {
          this.uploadInfo = res;
          this.fullscreenLoading = false;
          this.dialogVisible = true;
        }
      });
    },
    beforeImport() {
      this.fullscreenLoading = true;
    },
    loadOptions() {
      this.$post("/admin/classifie/condition_school").then(res => {
        if (res.code === 1) {
          this.region = res.region; //地区搜索
        }
      });
    },
    //解决搜索之后，点击分页仍可以查询全部的bug
    getCurrentage(pages) {
      console.log(pages);
      this.loadSchoolList(pages, this.province, this.name);
    },
    //加载学校列表
    loadSchoolList(pages, province, name) {
      if (province) {
        province = province[province.length - 1];
      }
      this.page = pages;
      this.$post("/admin/classifie/index_school", {
        page: this.page,
        num: this.offset,
        province: province,
        name: name
      }).then(res => {
        if (res.code === 1) {
          this.schoolList = res.list;
          this.totals = res.all_num;
        } else {
          this.schoolList = [];
          this.totals = 0;
        }
      });
    },
    //更改排序
    changeSort(item, value, dateSort) {
      this.$post("/admin/classifie/ajaxsort_school", {
        sid: item.sid,
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
          arr.push(item.sid);
          this.batchDeleteList = [...arr];
        });
      }
      console.log(this.batchDeleteList);
    },
    handleDelete(item) {
      if (item.sid) {
        //如果item存在则是点击单个数据删除
        this.batchDeleteList.push(item.sid);
      }
      this.$confirm("此操作将永久删除学校, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/admin/classifie/delete_school", {
            sid: this.batchDeleteList
          }).then(res => {
            if (res.code === 1) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.batchDeleteList = [];
              //删除后重新拉取
              this.loadSchoolList();
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
    handleJump(item, url, isAdd) {
      this.$router.push({
        name: url,
        query: {
          sid: item.sid,
          isAdd: isAdd
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
  width: 240px;
  margin-right: 10px;
}
.el-input >>> .el-input__inner {
  text-align: center;
}
/* .el-input--mini .el-input__inner */
.pagination {
  margin: 20px 0 0 -10px;
}
.thumb {
  width: 300px;
  height: 200px;
}
.thumb img {
  width: 100%;
  height: 100%;
}
.ml {
  margin-left: 20px;
  border: 1px #ccc solid;
  padding: 2px 5px;
  border-radius: 3px;
  cursor: pointer;
}
</style>