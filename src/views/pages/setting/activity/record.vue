<template>
    <el-main>
        <div class="panel">
            <div class="panel-right"></div>
            <div class="panel-right">
                <el-select
                    class="mr"
                    v-model="status"
                    placeholder="请选择状态"
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
                <!-- <el-select
                    class="mr"
                    v-model="win"
                    placeholder="请选择奖品"
                    size="mini"
                    clearable
                    @change="search"
                >
                    <el-option
                        v-for="item in winList"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                    ></el-option>
                </el-select>-->
                <el-input
                    class="mr"
                    size="mini"
                    v-model="keyword"
                    placeholder="请输入用户昵称"
                    clearable
                    @change="search"
                ></el-input>
                <el-button size="mini" type="primary">搜索</el-button>
            </div>
        </div>
        <el-table :data="rightsList" border borderstripe>
            <el-table-column label="用户昵称" prop="nickname" align="center"></el-table-column>
            <el-table-column label="状态" prop="status" align="center"></el-table-column>
            <el-table-column label="奖品" prop="prize" align="center"></el-table-column>
            <el-table-column label="参与时间" prop="addtime" align="center"></el-table-column>
            <!-- <el-table-column label="操作" align="center">
                <template>
                    <el-button type="primary" size="mini">审核</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>-->
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
            optionList: [
                { key: 0, name: "未领取" },
                { key: 1, name: "已领取" }
            ],
            winList: [],
            keyword: "", //搜索
            status: "",
            win: ""
        };
    },
    created() {
        this.getList();
        this.loadOption();
    },
    methods: {
        search() {
            this.getList(1);
        },
        loadOption() {
            this.$post("/admin/draw//option_win").then(res => {
                if (res.code === 1) {
                    this.winList = res.data;
                }
            });
        },
        getCurrentage(pages) {
            this.getList(pages);
        },
        // 获取数据
        getList(pages) {
            this.page = pages;
            this.$post("/admin/draw/record", {
                page: this.page,
                num: this.offset,
                status: this.status,
                win: this.win,
                keyword: this.keyword
            }).then(res => {
                if (res.code !== 1) {
                    this.rightsList = [];
                    this.$message.error(res.msg);
                } else {
                    this.rightsList = res.list;
                    this.totals = res.all_num;
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
    justify-content: space-between;
}
.panel-right {
    display: flex;
}
.mr {
    margin-right: 10px;
}

.pagination {
    margin: 20px 0 0 -10px;
}
</style>
