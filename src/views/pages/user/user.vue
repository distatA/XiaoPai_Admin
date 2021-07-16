<template>
    <el-main>
        <div class="flex">
            <div>
                <el-input v-model="mobile" class="search-item" placeholder="请输入手机号" size="mini"></el-input>
                <el-input v-model="nickname" class="search-item" placeholder="请输入用户昵称" size="mini"></el-input>
                <el-button type="primary" size="mini" @click="loadGroupList(1, mobile, nickname)">搜索</el-button>
            </div>
        </div>

        <el-table border :data="userList">
            <el-table-column prop="id" label="ID" align="center"></el-table-column>
            <!-- <el-table-column prop="mobile" label="手机号" align="center"></el-table-column> -->
            <el-table-column prop="province" label="省份" align="center"></el-table-column>
            <el-table-column prop="city" label="城市" align="center"></el-table-column>
            <el-table-column prop="integral" label="用户积分" align="center"></el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">{{scope.row.createtime|dateFormat}}</template>
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
            mobile: "",
            nickname: ""
        };
    },
    created() {
        this.loadGroupList();
    },
    methods: {
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            this.loadGroupList(pages, this.mobile, this.nickname);
        },
        //加载本专科优选资讯列表
        loadGroupList(pages, mobile, nickname) {
            this.page = pages;
            this.$post("/admin/user/index", {
                sid: this.$route.query.sid,
                mobile: mobile,
                page: this.page,
                nickname: nickname
            }).then(res => {
                if (res.code === 1) {
                    this.userList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.userList = [];
                    this.totals = 0;
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
    height: 100px;
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