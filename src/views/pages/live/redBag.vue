<template>
    <el-main>
        <el-table border :data="policyList">
            <el-table-column prop="room_name" label="房间" width="180"></el-table-column>
            <el-table-column prop="nickname" label="发放人" align="center"></el-table-column>
            <el-table-column prop="total_amount" label="红包金额" align="center"></el-table-column>
            <el-table-column prop="number" label="红包个数" align="center"></el-table-column>
            <el-table-column prop="use_amount" label="已领金额" align="center"></el-table-column>
            <el-table-column prop="content" label="祝福语" align="center"></el-table-column>
            <el-table-column label="发放时间" align="center" width="200">
                <template slot-scope="scope">{{scope.row.ctime|dateFormat}}</template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleRecord(scope.row)" type="primary" size="mini">红包记录</el-button>
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
        <el-drawer title="红包领取记录" :visible.sync="drawer" size="60%">
            <div class="table">
                <el-table border :data="redBagRecordList">
                    <el-table-column prop="order_sn" label="ID" width="180"></el-table-column>
                    <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
                    <el-table-column prop="money" label="红包金额" align="center"></el-table-column>
                    <el-table-column label="发放时间" align="center" width="200">
                        <template slot-scope="scope">{{scope.row.update_time|dateFormat}}</template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="recordTotals"
                        :page-size="offset"
                        @current-change="getRecordCurrentage"
                    ></el-pagination>
                </div>
            </div>
        </el-drawer>
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
            drawer: false,
            redBagRecordList: [],
            currentRcordId: 0,
            recordPage: 1,
            recordTotals: 0
        };
    },
    created() {
        this.loadPolicyList();
    },
    methods: {
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            this.loadPolicyList(pages);
        },
        //加载政策列表
        loadPolicyList(pages) {
            this.page = pages;
            this.$post("/admin/live/index_redbag", {
                page: this.page,
                num: this.offset
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
        getRecordCurrentage(pages) {
            this.loadRecordList(pages);
        },
        handleRecord(item) {
            this.currentRcordId = item.id;
            this.$post("/admin/live/index_redbag_list", {
                redbagid: item.id,
                page: this.recordPage,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.drawer = true;
                    this.redBagRecordList = res.list;
                    this.recordTotals = res.all_num;
                } else {
                    this.redBagRecordList = [];
                    this.recordTotals = res.all_num;
                }
            });
        },
        loadRecordList(pages) {
            this.recordPage = pages;
            this.$post("/admin/live/index_redbag_list", {
                redbagid: this.currentRcordId,
                page: this.recordPage,
                num: this.offset
            }).then(res => {
                if (res.code === 1) {
                    this.redBagRecordList = res.list;
                    this.recordTotals = res.all_num;
                } else {
                    this.redBagRecordList = [];
                    this.recordTotals = 0;
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
.table {
    margin: 0 20px;
}
/* .el-input >>> .el-input__inner {
    text-align: center;
} */
.pagination {
    margin: 20px 0 0 -10px;
}
</style>