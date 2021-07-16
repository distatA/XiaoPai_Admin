<template>
    <el-main>
        <div class="flex">
            <el-select v-model="type" placeholder="请选择类型" clearable size="mini">
                <el-option
                    v-for="item in typeList"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                ></el-option>
            </el-select>
            <el-button class="ml" size="mini" type="primary" @click="loadOrderList(1,type)">搜索</el-button>
        </div>
        <el-table border :data="orderList">
            <el-table-column prop="nickname" label="用户昵称" align="center"></el-table-column>
            <el-table-column prop="integral" label="积分" align="center"></el-table-column>
            <el-table-column prop="note" label="积分说明" align="center"></el-table-column>
            <el-table-column prop="create_time" label="订单时间" align="center"></el-table-column>
            <el-table-column prop="type" label="类型" align="center"></el-table-column>
            <el-table-column prop="state" label="状态" align="center"></el-table-column>
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
            orderList: [],
            typeList: [],
            type: ""
        };
    },
    created() {
        this.loadOrderList();
        this.loadTypeList();
    },
    methods: {
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            this.loadOrderList(pages, this.type);
        },
        //加载分类招生真题列表
        loadOrderList(pages, type) {
            this.page = pages;
            this.$post("/admin/goods/integral", {
                page: this.page,
                num: this.offset,
                type: type
            }).then(res => {
                if (res.code === 1) {
                    this.orderList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.orderList = [];
                    this.totals = 0;
                }
            });
        },
        loadTypeList(pages, province) {
            this.page = pages;
            this.$post("/admin/goods/integral_type").then(res => {
                if (res.code === 1) {
                    this.typeList = res.data;
                }
            });
        }
    },
    mounted() {}
};
</script>
<style scoped>
.form {
    margin-right: 50px;
}
.flex {
    margin-bottom: 20px;
}
.ml {
    margin-left: 10px;
}
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
</style>