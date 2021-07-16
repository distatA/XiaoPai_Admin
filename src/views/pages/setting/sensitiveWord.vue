<template>
    <el-main>
        <el-form class="form" ref="form" :model="form" label-width="130px" size="mini">
            <el-form-item label="敏感词">
                <el-input type="textarea" rows="10" v-model="form.rules"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="add">添加</el-button>
            </el-form-item>
        </el-form>
    </el-main>
</template>
<script>
/* eslint-disable*/

import editor from "@/components/editor";
export default {
    components: {
        editor
    },
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
            this.$post("/admin/setting/integral", {
                act: "forbidden"
            }).then(res => {
                this.form = res.data;
            });
        },
        add() {
            this.form.act = "forbidden";

            this.$post("/admin/setting/integral_edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: "success"
                    });
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
</style>