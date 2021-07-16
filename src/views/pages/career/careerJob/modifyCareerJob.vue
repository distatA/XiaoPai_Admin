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
            <el-form-item label="职业名称:">
                <el-input class="input" v-model="form.name" placeholder="请输入职业名称"></el-input>
            </el-form-item>
            <el-form-item label="分类:">
                <el-cascader
                    :options="optionsList"
                    :props="treeProps "
                    clearable
                    v-model="form.parent_id"
                    placeholder="请选择上级分类"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="等级:">
                <el-radio-group v-model="form.level">
                    <el-radio :label="1">一级</el-radio>
                    <el-radio :label="2">二级</el-radio>
                    <el-radio :label="3">三级</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否热门:">
                <el-radio-group v-model="form.is_hot">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <div v-if="form.level === 3">
                <el-form-item label="热度:">
                    <el-input class="input" v-model="form.hits" placeholder="请输入职业热度"></el-input>
                </el-form-item>
                <el-form-item label="是否适合男生:">
                    <el-radio-group v-model="form.boy_job">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否适合女生:">
                    <el-radio-group v-model="form.girl_job">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否适合理科:">
                    <el-radio-group v-model="form.science_job">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否适合文科:">
                    <el-radio-group v-model="form.arts_job">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否适合工科:">
                    <el-radio-group v-model="form.engin_job">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="职业简介:">
                    <el-input
                        class="input"
                        type="textarea"
                        :rows="7"
                        v-model="form.abstract"
                        placeholder="请输入职业简介"
                    ></el-input>
                </el-form-item>
                <el-form-item label="工作内容:">
                    <el-input
                        class="input"
                        type="textarea"
                        :rows="7"
                        v-model="form.job_content"
                        placeholder="请输入从左内容"
                    ></el-input>
                </el-form-item>
                <el-form-item label="职业技能:">
                    <el-input
                        class="input"
                        type="textarea"
                        :rows="7"
                        v-model="form.job_skill"
                        placeholder="请输入职业技能"
                    ></el-input>
                </el-form-item>
                <el-form-item label="知识背景:">
                    <el-input
                        class="input"
                        type="textarea"
                        :rows="7"
                        v-model="form.knowledge"
                        placeholder="请输入知识背景"
                    ></el-input>
                </el-form-item>
                <el-form-item label="常用工具:">
                    <el-input
                        class="input"
                        type="textarea"
                        :rows="7"
                        v-model="form.common_tools"
                        placeholder="请输入常用工具"
                    ></el-input>
                </el-form-item>
                <el-form-item label="发展前景:">
                    <el-input
                        class="input"
                        type="textarea"
                        :rows="7"
                        v-model="form.prospects_development"
                        placeholder="请输入发展前景"
                    ></el-input>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="isAdd == true" type="primary" @click="handleAdd">确 定11</el-button>
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
            form: {},
            isAdd: true,
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {},
    methods: {
        //加载配置项
        loadOptions() {
            this.$post("/admin/job/job_condition").then(res => {
                if (res.code === 1) {
                    this.optionsList = res.list;
                }
            });
        },
        loadDetail() {
            this.$post("/admin/job/getone", { id: this.form.id }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                    this.form.abstract = res.data.abstract; //: "职业";
                    this.form.common_tools = res.data.common_tools;
                    this.form.job_content = res.data.job_content;
                    this.form.job_skill = res.data.job_skill;
                    this.form.knowledge = res.data.knowledge;
                    this.form.prospects_development =
                        res.data.prospects_development;
                }
            });
        },
        handleAdd() {
            if (this.form.parent_id) {
                this.form.parent_id = this.form.parent_id[
                    this.form.parent_id.length - 1
                ];
            } else {
                this.form.parent_id = 0;
            }

            this.$post("/admin/job/add", this.form).then(res => {
                if (res.code === 1) {
                    this.$message.success(res.msg);
                    this.$router.push("/careerJob/careerJob");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleEdit() {
            if (this.form.parent_id) {
                this.form.parent_id = this.form.parent_id[
                    this.form.parent_id.length - 1
                ];
            } else {
                this.form.parent_id = 0;
            }
            if (
                this.wages_one ||
                this.wages_two ||
                this.wages_three ||
                this.wages_four
            ) {
                this.form.wages = [
                    this.wages_one,
                    this.wages_two,
                    this.wages_three,
                    this.wages_four
                ];
            }
            this.$post("/admin/job/edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message.success(res.msg);
                    this.$router.push("/careerJob/careerJob");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleClose() {}
    },
    mounted() {
        this.loadOptions();
        this.isAdd = this.$route.query.isAdd;
        console.log(this.isAdd);
        this.form.id = this.$route.query.id;
        if (this.form.id) {
            this.loadDetail();
        }
    }
};
</script>
<style scoped>
.input {
    width: 500px;
}
.flex {
    display: flex;
}
.input_flex {
    width: 120px;
    margin-right: 20px;
}
</style>