<template>
    <div class="header-box">
        <div class="swiper">
            <!-- <div class="horn">
                <i class="el-icon-message-solid"></i>
            </div>-->
            <!-- <el-carousel height="60px" direction="vertical" indicator-position="none">
                <el-carousel-item v-for="(item,index) in list" :key="index">
                    <div class="medium" style="line-height:60px;">{{ item }}</div>
                </el-carousel-item>
            </el-carousel>-->
        </div>
        <div class="status">
            <div>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <i class="el-icon-s-custom"></i>
                        {{$store.state.userInfo.nickname}}
                        <i
                            class="el-icon-arrow-down el-icon--right"
                        ></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-warning-outline" @click.native="edit">个人信息</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-switch-button" @click.native="loginOut">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-dialog title="修改个人信息" :visible.sync="dialogVisible" width="30%">
            <el-form ref="form" label-position="right" label-width="80px" :model="form" size="mini">
                <el-form-item label="昵称:">
                    <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="账号:">
                    <el-input v-model="form.uname" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="密码:">
                    <el-input v-model="form.upwd" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="handleEdit">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
/*eslint-disable*/
export default {
    data() {
        return {
            dialogVisible: false,
            form: {},
            list: [
                "【版本更新】校派3.0即将上线",
                "【版本更新】申达股份vr沟通",
                "【版本更新】当过兵突然给他人",
                "【版本更新】风热风格肉疼肉疼"
            ]
        };
    },
    created() {
        this.form = this.$store.state.userInfo;
    },
    methods: {
        edit() {
            this.dialogVisible = true;
        },
        handleEdit() {
            var that = this;
            this.$post("/admin/login/edit_admin", this.form).then(res => {
                if (res.code === 1) {
                    this.dialogVisible = false;
                    this.form = {};
                } else {
                    that.$message({
                        showClose: true,
                        message: res.msg,
                        type: "error"
                    });
                }
            });
        },
        handleClose() {
            this.dialogVisible = false;
            this.form = this.$store.state.userInfo;
        },
        loginOut() {
            this.$post("/admin/login/login_out").then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.$store.commit("LOGIN_OUT");
                    this.$router.push("/login");
                    window.localStorage.removeItem("token");
                }
            });
        }
    }
};
</script>
<style scoped>
.header-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 0 15px;
}
.swiper {
    width: 300px;
    font-size: 12px;
    color: #999;
    position: relative;
    padding-left: 20px;
}
.horn {
    width: 10px;
    height: 10px;
    position: absolute;
    margin: auto 0;
    top: -12px;
    left: 0;
    bottom: 0;
    font-size: 18px;
}
.status {
    /* width: 500px; */
    line-height: 60px;
    display: flex;
    cursor: pointer;
}
</style>