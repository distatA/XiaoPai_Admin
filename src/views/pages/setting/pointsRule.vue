<template>
    <el-main>
        <el-form class="form" ref="form" :model="form" label-width="130px" size="mini">
            <el-form-item label="首次登陆">
                <el-input v-model="form.inte_1" placeholder="请输入首次登陆积分"></el-input>
            </el-form-item>
            <el-form-item label="完善个人资料">
                <el-input v-model="form.inte_2" placeholder="请输入完善个人资料积分"></el-input>
            </el-form-item>
            <el-form-item label="首次邀请好友注册">
                <el-input v-model="form.inte_3" placeholder="请输入完善首次邀请好友注册积分"></el-input>
            </el-form-item>
            <el-form-item label="关注微信公众号">
                <el-input v-model="form.inte_4" placeholder="请输入完善关注微信公众号积分"></el-input>
            </el-form-item>
            <el-form-item label="每日签到">
                <el-input v-model="form.inte_5" placeholder="请输入完善每日签到积分"></el-input>
            </el-form-item>
            <el-form-item label="每日邀请好友注册">
                <el-input v-model="form.inte_6" placeholder="请输入完善每日邀请好友注册积分"></el-input>
            </el-form-item>
            <el-form-item label="每日分享">
                <el-input v-model="form.inte_7" placeholder="请输入完善每日分享积分"></el-input>
            </el-form-item>
            <el-form-item label="每日评论">
                <el-input v-model="form.inte_8" placeholder="请输入完善每日评论积分"></el-input>
            </el-form-item>
            <el-form-item label="每日收藏">
                <el-input v-model="form.inte_9" placeholder="请输入完善每日收藏积分"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="add">添加</el-button>
            </el-form-item>
        </el-form>
    </el-main>
</template>
<script>
/* eslint-disable*/
export default {
    data() {
        return {
            form: {}
        };
    },
    created() {
        this.loadDetail();
    },
    methods: {
        //获取地区列表
        loadDetail() {
            this.$post("/admin/setting/integral", { act: "integral" }).then(
                res => {
                    this.form = res.data;
                }
            );
        },
        add() {
            this.form.act = "integral";
            this.$post("/admin/setting/integral_edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: "success"
                    });
                }
            });
        }
    },
    mounted() {}
};
</script>
<style scoped>
.form {
    width: 500px;
}
</style>