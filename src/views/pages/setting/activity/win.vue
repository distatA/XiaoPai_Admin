<template>
    <el-main>
        <div class="panel">
            <!-- <el-button size="mini" type="primary">中奖用户</el-button> -->
            <!-- <div></div> -->
            <el-select
                class="mr"
                v-model="win"
                placeholder="请选择奖品类型"
                size="mini"
                clearable
                @change="search"
            >
                <el-option
                    v-for="item in optionList"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                ></el-option>
            </el-select>
            <el-button size="mini" type="primary">搜索</el-button>
        </div>
        <el-table :data="rightsList" border borderstripe>
            <el-table-column label="用户昵称" prop="nickname" align="center"></el-table-column>
            <el-table-column label="用户姓名" prop="name" align="center"></el-table-column>
            <el-table-column label="奖品" prop="prize" align="center"></el-table-column>
            <el-table-column label="年级" prop="grade" align="center"></el-table-column>
            <el-table-column label="就读学校" prop="school" align="center"></el-table-column>
            <el-table-column label="地址" prop="address" align="center"></el-table-column>
            <el-table-column label="状态" prop="address" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.audit === 1" type="success" effect="dark">已通过</el-tag>
                    <el-tag v-if="scope.row.audit === 0" type="info" effect="dark">未审核</el-tag>
                    <el-tag v-if="scope.row.audit === 2" type="danger" effect="dark">未通过</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.type === 1&&scope.row.audit === 0"
                        type="primary"
                        size="mini"
                        @click="handleCheck(scope.row)"
                    >审核</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next,total"
                :total="totals"
                :page-size="offset"
                @current-change="getCurrentage"
            ></el-pagination>
        </div>
        <el-dialog title="审核" :visible.sync="dialogVisible" center>
            <div class="dialog-content">
                <img class="card-img" :src="detailInfo.cardimg" />

                <div class="info">
                    <div>姓名:{{detailInfo.name}}</div>
                    <div>电话:{{detailInfo.tel}}</div>
                    <div>年级:{{detailInfo.grade}}</div>
                    <div>就读学校:{{detailInfo.school}}</div>
                    <div>收货地址:{{detailInfo.address}}</div>
                    <div class="check">
                        <div class="no-pass" @click="handlePass(2)">
                            <i class="el-icon-circle-close"></i>不通过
                        </div>
                        <div class="pass" @click="handlePass(1)">
                            <i class="el-icon-circle-check"></i>
                            通过
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </el-main>
</template>

<script>
/* eslint-disable*/
export default {
    data() {
        return {
            // 权限列表
            rightsList: [],
            dialogVisible: false,
            form: {}, //表单
            isAdd: true, //判断表单是添加还是编辑
            offset: 15,
            totals: 0,
            optionList: [],
            dialogVisible: false,
            detailInfo: {},
            win: "",
            keyword: ""
        };
    },
    created() {
        this.getList();
        this.loadOption();
    },
    methods: {
        //点击审核
        handleCheck(item) {
            this.$post("/admin/draw/getone", { id: item.id }).then(res => {
                if (res.code === 1) {
                    this.detailInfo = res.data;
                    this.dialogVisible = true;
                }
            });
        },
        search() {
            this.getList(1);
        },
        loadOption() {
            this.$post("/admin/draw//option_win").then(res => {
                if (res.code === 1) {
                    this.optionList = res.data;
                }
            });
        },
        getCurrentage(pages) {
            this.getList(pages);
        },
        // 获取数据
        getList(pages) {
            this.page = pages;
            this.$post("/admin/draw/address", {
                page: this.page,
                num: this.offset,
                type: this.win
            }).then(res => {
                if (res.code !== 1) {
                    this.$message.error(res.msg);
                    this.rightsList = [];
                } else {
                    this.rightsList = res.list;
                    this.totals = res.all_num;
                }
            });
        },
        handlePass(audit) {
            this.$post("/admin/draw/audit", {
                id: this.detailInfo.id,
                audit: audit
            }).then(res => {
                if (res.code !== 1) {
                    this.$message.error(res.msg);
                } else {
                    this.$message.success(res.msg);
                }
            });
        }
    }
};
</script>

<style scoped>
.panel {
    margin-bottom: 20px;
    display: flex;
    /* justify-content: space-between; */
}
.mr {
    width: 200px;
    margin-right: 10px;
}
.card-img {
    width: 300px;
    height: 450px;
    /* margin: 0 auto; */
}
.dialog-content {
    display: flex;
    /* flex-direction: column; */
}
.pagination {
    margin: 20px 0 0 -10px;
}
.info {
    padding: 20px 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.check {
    /* flex:1; */
    display: flex;
    justify-content: space-around;
    font-size: 24px;
    cursor: pointer;
}
.no-pass {
    color: red;
}
.pass {
    color: #07c160;
    padding-left: 90px;
}
</style>
