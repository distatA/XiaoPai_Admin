<template>
    <el-main>
        <el-table border :data="userList" @selection-change="handleSelect">
            <el-table-column prop="logo" label="头像" align="center" width="200">
                <template slot-scope="scope">
                    <img class="thumb" :src="scope.row.headimg" alt />
                </template>
            </el-table-column>
            <el-table-column prop="nickname" label="用户昵称" align="center"></el-table-column>

            <el-table-column label="在线状态" align="center" width="80">
                <template slot-scope="scope">
                    <div v-if="scope.row.is_online === 1">在线</div>
                    <div v-if="scope.row.is_online === 0">离线</div>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="创建时间" align="center">
                <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
            </el-table-column>
            <el-table-column prop="title" label="更新时间" align="center">
                <template slot-scope="scope">{{scope.row.update_time|dateFormat}}</template>
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
            userList: [],
            keyword: "", //学校名称搜索
            selecting: "", //类型搜索
            selecting_arr: [
                { id: 0, name: "全部" },
                { id: 1, name: "本科优选" },
                { id: 2, name: "专科优选" }
            ],
            province: "",
            region_arr: [], //地区搜索
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            },
            batchDeleteList: [] //批量删除按钮
        };
    },
    created() {
        this.loadUserList();
    },
    methods: {
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            console.log(pages);
            this.loadUserList(pages);
        },
        loadUserList(pages) {
            this.page = pages;
            this.$post("/admin/school/group_users", {
                gid: this.$route.query.id,
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.userList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.userList = [];
                    this.totals = 0;
                }
            });
        },
        changeSort(item, value) {
            console.log(item);
            this.$post("/admin/school/group_edit", {
                id: item.id,
                sid: this.$route.query.sid,
                state: value
            }).then(res => {});
        },
        //点击多选
        handleSelect(val) {
            console.log(val);
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
    width: 40px;
    height: 40px;
    margin: 0 auto;
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