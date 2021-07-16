<template>
    <el-main>
        <el-table border :data="orderList" @selection-change="handleSelect">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props" v-if="props.row.state === 1">
                    <div>快递公司：{{ props.row.express }}</div>
                    <div>快递单号：{{ props.row.express_num }}</div>
                    <div>收货人：{{ props.row.name }}</div>
                    <div>电话：{{ props.row.phone }}</div>
                    <div>收货地址：{{ props.row.address }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="nickname" label="用户" align="center"></el-table-column>
            <el-table-column prop="order_sn" label="订单号" align="center"></el-table-column>
            <el-table-column prop="title" label="商品名称" align="center"></el-table-column>
            <el-table-column label="商品详情" align="center">
                <template slot-scope="scope">
                    <img class="thumb" :src="scope.row.cover" alt />
                </template>
            </el-table-column>
            <el-table-column prop="order_amount" label="订单积分" align="center"></el-table-column>
            <el-table-column prop="create_time" label="订单时间" align="center">
                <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
            </el-table-column>
            <el-table-column prop="shelf" label="状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.state === 0" type="danger">未发货</el-tag>
                    <el-tag v-if="scope.row.state === 1" type="danger">已发货</el-tag>
                    <el-tag v-if="scope.row.state === 2" type="success">已完成</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.state === 0"
                        @click="handleSend(scope.row)"
                        type="primary"
                        size="mini"
                    >发货</el-button>
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
        <el-drawer title="我是标题" :visible.sync="drawer" size="50%" :with-header="false">
            <el-form class="form" :model="form" ref="form" size="mini" label-width="100px">
                <el-form-item label="订单编号">{{form.order_sn}}</el-form-item>
                <el-form-item label="订单数量">{{form.order_num}}</el-form-item>
                <el-form-item label="收件人">{{form.name}}</el-form-item>
                <el-form-item label="联系电话">{{form.phone}}</el-form-item>
                <el-form-item label="收货地址">{{form.address}}</el-form-item>
                <el-form-item label="快递公司">
                    <el-select v-model="form.express" placeholder="请选择快递公司">
                        <el-option
                            v-for="item in expressList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递单号">
                    <el-input v-model="form.express_num" placeholder="请输入快递单号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="send">确认发货</el-button>
                </el-form-item>
            </el-form>
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
            orderList: [],
            expressList: [],
            form: {},
            drawer: false
        };
    },
    created() {
        this.loadOrderList();
        this.loadExpressList();
    },
    methods: {
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            this.loadOrderList(pages);
        },
        //加载分类招生真题列表
        loadOrderList(pages, province) {
            this.page = pages;
            this.$post("/admin/goods/order", {
                page: this.page,
                num: this.offset
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
        loadExpressList(pages, province) {
            this.page = pages;
            this.$post("/admin/goods/express").then(res => {
                if (res.code === 1) {
                    this.expressList = res.data;
                }
            });
        },
        handleSend(item) {
            this.form.id = item.id;
            this.$post("/admin/goods/order_getOne", { id: item.id }).then(
                res => {
                    if (res.code === 1) {
                        this.form.order_sn = res.info.order_sn;
                        this.form.order_num = res.info.order_num;
                        this.form.address = res.info.address;
                        this.form.phone = res.info.phone;
                        this.form.name = res.info.name;
                        this.drawer = true;
                    }
                }
            );
        },
        send() {
            this.$post("/admin/goods/order_edit", this.form).then(res => {
                if (res.code === 1) {
                    this.drawer = false;
                    this.loadOrderList();
                }
            });
        },
        //点击多选
        handleSelect(val) {
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
        }
    },
    mounted() {
        let arr = [{ fbsj: "选项一" }, { fbsj: "选项二" }, { fbsj: "选项二" }];

        console.log(arr[0].fbsj);
    }
};
</script>
<style scoped>
.form {
    margin-right: 50px;
    margin-top: 50px;
}
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