<template>
    <el-main>
        <el-form class="form" ref="form" :model="form" label-width="130px" size="mini">
            <el-form-item label="兑换规则">
                <editor editorId="rules" :content="form.rules" ref="rules"></editor>
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
                act: "integral_rules"
            }).then(res => {
                this.form = res.data;
            });
        },
        add() {
            this.form.act = "integral_rules";

            this.form.rules = this.$refs.rules.getHtml();
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
    mounted() {
        this.form.rules = "  ";
    }
};
</script>
<style scoped>
</style>