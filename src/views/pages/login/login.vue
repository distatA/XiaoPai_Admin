<template>
    <div class="login-contanier">
        <div class="login-header">
            <div class="header">
                <span>账号登录</span>
            </div>
        </div>
        <div class="login-content">
            <div class="login-form">
                <div class="form-title">登录校派</div>
                <el-form :model="loginForm">
                    <div ref="username" class="form-group">
                        <label class="label" for>账号</label>
                        <input
                            v-model="loginForm.uname"
                            class="form-field"
                            @focus="usernameChange"
                            type="text"
                            @keyup.enter="login"
                        />
                        <div ref="clearUsername" class="clear">
                            <i class="el-icon-close" @click="loginForm.username=''"></i>
                        </div>
                    </div>
                    <div ref="password" class="form-group">
                        <label class="label" for>密码</label>
                        <input
                            v-model="loginForm.upwd"
                            class="form-field"
                            @focus="passwordChange"
                            :type="inputType"
                            @keyup.enter="login"
                        />
                        <div ref="clearPassword" class="clear">
                            <i class="el-icon-view" @click="selectInputType"></i>
                            <i class="el-icon-close" @click="loginForm.password=''"></i>
                        </div>
                    </div>
                </el-form>

                <div
                    class="login-btn"
                    @click="login"
                    v-loading.fullscreen.lock="fullscreenLoading"
                    element-loading-text="登录中"
                    element-loading-spinner="el-icon-loading"
                >登录</div>
            </div>
        </div>
        <div class="login-bottom">
            <div class="footer">
                <p>© 1997- 2019 网易公司 浙ICP备17006647号-1 增值电信业务许可：B1-20180288 浙B2-20161040 浙江杭州滨江网商路599号网易大厦 4009-000-163</p>
                <div>浙公网安备 33010802002217号</div>
            </div>
        </div>
    </div>
</template>
<script>
/*eslint-disable */
export default {
    data() {
        return {
            fullscreenLoading: false,
            inputType: "password",
            loginForm: {}
        };
    },
    methods: {
        selectInputType() {
            if (this.inputType === "password") {
                this.inputType = "text";
            } else {
                this.inputType = "password";
            }
        },
        usernameChange(ref, subRef) {
            this.$refs.username.style.border = "1px #4291e6 solid";
            this.$refs.password.style.border = "1px #d7d8da solid";
            this.$refs.clearUsername.style.display = "block";
            this.$refs.clearPassword.style.display = "none";
        },
        passwordChange() {
            this.$refs.password.style.border = "1px #4291e6 solid";
            this.$refs.username.style.border = "1px #d7d8da solid";
            this.$refs.clearUsername.style.display = "none";
            this.$refs.clearPassword.style.display = "block";
        },
        login() {
            this.fullscreenLoading = true;
            this.$post("/admin/login/index", this.loginForm).then(res => {
                this.fullscreenLoading = false;
                if (res.code === 1) {
                    window.localStorage.setItem("token", res.info.token);
                    this.$store.commit("LOGIN", {
                        userInfo: res.info,
                        isLogin: true
                    });
                    this.$router.push("/index/index");
                } else {
                    this.$message.error(res.msg);
                }
            });
        }
    },
    mounted() {}
};
</script>
<style scoped>
.login-contanier {
    background: #f5f6f7;
}
.login-header {
    height: 70px;
    background: #fff;
}
.header {
    width: 1180px;
    margin: 0 auto;
    padding: 20px 0;
}
.header span {
    font-size: 18px;
    color: #686969;
    vertical-align: top;
    line-height: 30px;
    margin-left: 10px;
}
.login-content {
    width: 1180px;
    margin: 40px auto 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 720px;
}
.login-form {
    width: 680px;
    /* height: 100%; */
    background-color: #fff;
    box-sizing: border-box;
    padding: 120px 0 80px;
    position: relative;
    box-shadow: 0 4px 10px 0 rgba(60, 65, 71, 0.1);
    border-radius: 4px;
}
.form-title {
    font-size: 34px;
    color: #373d40;
    line-height: 1;
    padding: 35px 0;
    text-align: center;
}
.form-group {
    width: 400px;
    margin: 0 auto 20px auto;
    border: 1px solid #d7d8da;
    border-radius: 5px;
    font-size: 14px;
    display: flex;
    position: relative;
}
.clear {
    position: absolute;
    cursor: pointer;
    font-size: 20px;
    color: #d7d7db;
    right: 20px;
    top: 8px;
    display: none;
}
.label {
    position: relative;
    width: 70px;
    padding-top: 15px;
    padding-left: 20px;
    font-size: 14px;
    color: #373d40;
    text-align: left;
    z-index: 1;
    float: left;
    display: block;
    padding: 12px 0px 0px 20px;
}
.form-field {
    width: 255px;
    font-size: 14px;
    margin: 12px 0;
    border: none;
}
input:focus {
    outline: none;
}
.login-btn {
    width: 400px;
    margin: 50px auto;
    text-align: center;
    box-sizing: border-box;
    border-radius: 5px;
    padding: 17px 45px;
    color: #fff;
    background: #478bff;
    cursor: pointer;
}
.login-bottom {
    height: 100px;
}
.footer {
    font-size: 12px;
    color: #9898a2;
    letter-spacing: 0;
    line-height: 25px;
    text-align: center;
}
</style>