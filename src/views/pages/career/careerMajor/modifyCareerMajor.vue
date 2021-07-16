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
            <el-form-item label="专业姓名:">
                <el-input class="input" v-model="form.name" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="分类:">
                <el-cascader
                    :options="optionsList"
                    :props="treeProps "
                    clearable
                    v-model="form.parent_id"
                    placeholder="请选择上级菜单"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="类别:">
                <el-radio-group v-model="form.type">
                    <el-radio :label="1">本科</el-radio>
                    <el-radio :label="0">专科</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="等级:">
                <el-radio-group v-model="form.level">
                    <el-radio :label="1">一级</el-radio>
                    <el-radio :label="2">二级</el-radio>
                    <el-radio :label="3">三级</el-radio>
                </el-radio-group>
            </el-form-item>
            <div v-if="form.level === 3">
                <el-form-item label="热度:">
                    <el-input class="input" v-model="form.hits" placeholder="请输入专业热度"></el-input>
                </el-form-item>
                <el-form-item label="是否是分类招生:">
                    <el-radio-group v-model="form.is_fenlei">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否适合男生:">
                    <el-radio-group v-model="form.boy_majors">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否适合女生:">
                    <el-radio-group v-model="form.girl_majors">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否适合理科:">
                    <el-radio-group v-model="form.science_majors">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否适合文科:">
                    <el-radio-group v-model="form.arts_majors">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否适合工科:">
                    <el-radio-group v-model="form.engin_majors">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排名:">
                    <el-input class="input" v-model="form.ranking" placeholder="请输入专业排名"></el-input>
                </el-form-item>
                <el-form-item label="专业代码:">
                    <el-input class="input" v-model="form.professional_code" placeholder="请输入专业代码"></el-input>
                </el-form-item>
                <el-form-item label="授予学位:">
                    <el-input class="input" v-model="form.award_degree" placeholder="请输入授予学位"></el-input>
                </el-form-item>
                <el-form-item label="修学年限:">
                    <el-input class="input" v-model="form.study_years" placeholder="请输入修学年限"></el-input>
                </el-form-item>

                <el-form-item label="专业介绍:">
                    <el-input
                        class="input"
                        type="textarea"
                        :rows="7"
                        v-model="form.professional_introduction"
                        placeholder="请输入专业介绍"
                    ></el-input>
                </el-form-item>
                <el-form-item label="培养目标:">
                    <el-input
                        class="input"
                        type="textarea"
                        :rows="7"
                        v-model="form.training_target"
                        placeholder="请输入分类排序"
                    ></el-input>
                </el-form-item>
                <el-form-item label="培养要求:">
                    <el-input
                        class="input"
                        type="textarea"
                        :rows="7"
                        v-model="form.training_requirements"
                        placeholder="请输入培养要求"
                    ></el-input>
                </el-form-item>
                <el-form-item label="开设课程:">
                    <el-input
                        class="input"
                        type="textarea"
                        :rows="7"
                        v-model="form.courses"
                        placeholder="请输入开设课程"
                    ></el-input>
                </el-form-item>
                <el-form-item label="就业方向:">
                    <el-input
                        class="input"
                        type="textarea"
                        :rows="7"
                        v-model="form.sem"
                        placeholder="请输入就业方向"
                    ></el-input>
                </el-form-item>
                <el-form-item label="10年工资:">
                    <div class="flex">
                        <el-input class="input_flex" v-model="wages_one" placeholder="应届生"></el-input>
                        <el-input class="input_flex" v-model="wages_two" placeholder="1-3年"></el-input>
                        <el-input class="input_flex" v-model="wages_three" placeholder="3-5年"></el-input>
                        <el-input class="input_flex" v-model="wages_four" placeholder="5-10年"></el-input>
                    </div>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="isAdd === true" type="primary" @click="handleAdd">确 定</el-button>
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
            },
            wages_one: "",
            wages_two: "",
            wages_three: "",
            wages_four: ""
        };
    },
    created() {},
    methods: {
        //加载配置项
        loadOptions() {
            this.$post("/admin/career/career_condition").then(res => {
                if (res.code === 1) {
                    this.optionsList = res.career_list;
                }
            });
        },
        loadDetail() {
            this.$post("/admin/career/getone", { id: this.form.id }).then(
                res => {
                    if (res.code === 1) {
                        this.form = res.info;
                        this.form.award_degree = res.data.award_degree;
                        this.form.courses = res.data.courses;
                        this.form.professional_code =
                            res.data.professional_code;
                        this.form.professional_introduction =
                            res.data.professional_introduction;
                        this.form.sem = res.data.sem; //: "3";
                        this.form.study_years = res.data.study_years; //: "3";
                        this.form.training_requirements =
                            res.data.training_requirements; //: "3";
                        this.form.training_target = res.data.training_target;
                        this.wages_one = res.data.wages[0];
                        this.wages_two = res.data.wages[1];
                        this.wages_three = res.data.wages[2];
                        this.wages_four = res.data.wages[3];
                    }
                }
            );
        },
        handleAdd() {
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

            this.$post("/admin/career/add", this.form).then(res => {
                if (res.code === 1) {
                    this.$message.success(res.msg);
                    this.$router.push("/careerMajor/careerMajor");
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
            this.$post("/admin/career/edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message.success(res.msg);
                    this.$router.push("/careerMajor/careerMajor");
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