<template>
    <el-main>
        <el-form
            class="form"
            label-position="right"
            :model="form"
            label-width="120px"
            size="mini"
            center
        >
            <el-form-item label="学校名称:">
                <el-input class="input" v-model="form.name" placeholder="请输入学校名称"></el-input>
            </el-form-item>
            <el-form-item label="本专科优选:">
                <el-radio-group v-model="form.selecting">
                    <el-radio :label="1">本科优选</el-radio>
                    <el-radio :label="2">专科优选</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="建校时间:">
                <el-input class="input" v-model="form.create_year" placeholder="请输入建校时间"></el-input>
            </el-form-item>
            <el-form-item label="理科录取分:">
                <el-input class="input" v-model="form.scoreline" placeholder="请输入录取分"></el-input>
            </el-form-item>
            <el-form-item label="文科录取分:">
                <el-input class="input" v-model="form.enrollment" placeholder="请输入录取分"></el-input>
            </el-form-item>
            <el-form-item label="百强学校:">
                <el-radio-group v-model="form.hundred">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="百强学校排序:">
                <el-input class="input" v-model="form.hundred_sort" placeholder="请输入百强学校排序"></el-input>
            </el-form-item>
            <el-form-item label="中外合作:">
                <el-radio-group v-model="form.cooperation">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="中外合作排序:">
                <el-input class="input" v-model="form.cooperation_sort" placeholder="请输入中外合作排序"></el-input>
            </el-form-item>
            <el-form-item label="口碑院校:">
                <el-radio-group v-model="form.praise">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="口碑院校排序:">
                <el-input class="input" v-model="form.praise_sort" placeholder="请输入口碑院校排序"></el-input>
            </el-form-item>
            <el-form-item label="设置院系:">
                <el-checkbox-group v-model="form.college">
                    <el-checkbox :label="2">学院</el-checkbox>
                    <el-checkbox :label="1">系部</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="解锁全景:">
                <el-radio-group v-model="form.vr_vip">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="学校排序:">
                <el-input class="input" v-model="form.sort" placeholder="请输入学校排序"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="handleAdd">确 定</el-button>
                <el-button v-else type="primary" @click="handleEdit">确 定</el-button>
            </el-form-item>
        </el-form>
    </el-main>
</template>
<script>
/* eslint-disable*/
export default {
    data() {
        return {
            optionsList: [],
            form: {
                selecting: 1,
                college: [],
                cooperation_sort: 50,
                cooperation: 0,
                praise_sort: 50,
                praise: 0,
                hundred_sort: 50,
                hundred: 0,
                sort: 50,
                vr_vip: 1
            },
            isAdd: true
        };
    },
    created() {
        this.isAdd = this.$route.query.isAdd;
        this.form.id = this.$route.query.id;
        if (this.form.id) {
            this.loadDetail();
        }
    },
    methods: {
        loadDetail() {
            this.$post("/admin/optimal/getone", { id: this.form.id }).then(
                res => {
                    if (res.code === 1) {
                        this.form = res.info;
                    }
                }
            );
        },
        handleAdd() {
            this.$post("/admin/optimal/add", this.form).then(res => {
                if (res.code === 1) {
                    this.$router.push("/optimal/index");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleEdit() {
            this.$post("/admin/optimal/edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$router.push("/optimal/index");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleClose() {
            this.$router.push("/optimal/index");
        }
    },
    mounted() {}
};
</script>
<style scoped>
.input {
    width: 500px;
}
</style>