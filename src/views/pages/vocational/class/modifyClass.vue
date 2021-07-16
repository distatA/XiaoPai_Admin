<template>
    <el-main>
        <el-form class="form" :model="form" label-width="120px" size="mini" center>
            <el-form-item label="省份:">
                <el-select v-model="form.province" placeholder="请选择省份">
                    <el-option
                        v-for="item in optionList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="是否默认:">
                <el-radio-group v-model="form.isdefault">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="报名对象:">
                <editor
                    editorId="enrolment_object"
                    :content="form.enrolment_object"
                    ref="enrolment_object"
                ></editor>
            </el-form-item>
            <el-form-item label="报名条件:">
                <editor
                    editorId="entry_requirements"
                    :content="form.entry_requirements"
                    ref="entry_requirements"
                ></editor>
            </el-form-item>
            <el-form-item label="报名时间:">
                <editor
                    editorId="registration_time"
                    :content="form.registration_time"
                    ref="registration_time"
                ></editor>
            </el-form-item>
            <el-form-item label="报名流程:">
                <editor
                    editorId="registration_process"
                    :content="form.registration_process"
                    ref="registration_process"
                ></editor>
            </el-form-item>
            <el-form-item label="学费标准:">
                <editor
                    editorId="tuition_standard"
                    :content="form.tuition_standard"
                    ref="tuition_standard"
                ></editor>
            </el-form-item>
            <el-form-item label="授课模式:">
                <editor editorId="teaching_mode" :content="form.teaching_mode" ref="teaching_mode"></editor>
            </el-form-item>
            <el-form-item label="毕业证书:">
                <editor
                    editorId="graduation_certificate"
                    :content="form.graduation_certificate"
                    ref="graduation_certificate"
                ></editor>
            </el-form-item>
            <el-form-item label="政策减免:">
                <editor
                    editorId="policy_reduction"
                    :content="form.policy_reduction"
                    ref="policy_reduction"
                ></editor>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="handleAdd">确 定</el-button>
                <el-button v-else type="primary" @click="handleEdit">确 定1</el-button>
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
            city: [], //根据地区搜索学校
            optionList: [],
            schoolList: [],
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
    created() {
        this.isAdd = this.$route.query.isAdd;
        this.form.id = this.$route.query.id;
        this.loadOption();
        if (this.form.id) {
            this.loadDetail();
        }
    },
    methods: {
        //加载地区供添加编辑搜索使用
        loadOption() {
            this.$post("/admin/vocational/condition_policy").then(res => {
                if (res.code === 1) {
                    this.optionList = res.region;
                }
            });
        },
        loadDetail() {
            this.$post("/admin/vocational/getone_policy", {
                id: this.form.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                }
            });
        },
        handleAdd() {
            this.form.enrolment_object = this.$refs.enrolment_object.getHtml();
            this.form.entry_requirements = this.$refs.entry_requirements.getHtml();
            this.form.registration_time = this.$refs.registration_time.getHtml();
            this.form.registration_process = this.$refs.registration_process.getHtml();
            this.form.tuition_standard = this.$refs.tuition_standard.getHtml();
            this.form.teaching_mode = this.$refs.teaching_mode.getHtml();
            this.form.graduation_certificate = this.$refs.graduation_certificate.getHtml();
            this.form.policy_reduction = this.$refs.policy_reduction.getHtml();
            this.$post("/admin/vocational/add_policy", this.form).then(res => {
                if (res.code === 1) {
                    this.$router.push("/vocational/class");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleEdit() {
            this.form.enrolment_object = this.$refs.enrolment_object.getHtml();
            this.form.entry_requirements = this.$refs.entry_requirements.getHtml();
            this.form.registration_time = this.$refs.registration_time.getHtml();
            this.form.registration_process = this.$refs.registration_process.getHtml();
            this.form.tuition_standard = this.$refs.tuition_standard.getHtml();
            this.form.teaching_mode = this.$refs.teaching_mode.getHtml();
            this.form.graduation_certificate = this.$refs.graduation_certificate.getHtml();
            this.form.policy_reduction = this.$refs.policy_reduction.getHtml();
            this.$post("/admin/vocational/edit_policy", this.form).then(res => {
                if (res.code === 1) {
                    this.$router.push("/vocational/class");
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleClose() {
            this.$router.push("/vocational/index");
        }
    },
    mounted() {
        this.form = {
            enrolment_object: " ",
            entry_requirements: " ",
            registration_time: " ",
            registration_process: " ",
            tuition_standard: " ",
            teaching_mode: " ",
            graduation_certificate: " ",
            policy_reduction: " "
        };
        // this.init();
        // this.$nextTick(function() {
        //     this.init();
        // });
    }
};
</script>
<style scoped>
.input {
    width: 500px;
}
</style>