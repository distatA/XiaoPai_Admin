<template>
    <el-main>
        <el-table :data="rightsList" border borderstripe>
            <el-table-column label="用户昵称" prop="nickname" align="center"></el-table-column>
            <el-table-column label="领取金额" prop="amount" align="center"></el-table-column>
            <el-table-column label="领取时间" prop="create_time" align="center"></el-table-column>
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
            totals: 0
        };
    },

    methods: {
        user() {},
        getCurrentage(pages) {
            this.getList(pages);
        },

        // 获取数据
        getList(pages) {
            this.page = pages;
            this.$post("/admin/popup/member", {
                page: this.page,
                num: this.offset
            }).then(res => {
                if (res.code !== 1) return this.$message.error(res.msg);
                this.rightsList = res.list;
                this.totals = res.all_num;
            });
        }
    },

    created() {
        this.getList();
    }
};
</script>

<style scoped>
.add {
    margin-bottom: 20px;
}
.pagination {
    margin: 20px 0 0 -10px;
}
</style>
