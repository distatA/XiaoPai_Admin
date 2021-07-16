<template>
    <el-main>
        <div>
            <el-form class="form" ref="form" :model="form" label-width="180px" size="small">
                <el-form-item label="* 学校名称:">
                    <el-input v-model="form.name" placeholder="请输入学校名称"></el-input>
                </el-form-item>
                <el-form-item label="* 学校英文名称:">
                    <el-input v-model="form.ename" placeholder="请输入学校英文名称"></el-input>
                </el-form-item>
                <el-form-item label="* LOGO">
                    <upload ref="upload_logo" url="/image_school" :limit="2"></upload>
                </el-form-item>
                <el-form-item label="* 批次:">
                    <el-select v-model="form.disciplinary_level" multiple placeholder="请选择学校批次">
                        <el-option
                            v-for="item in disciplinary_arr"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="* 类型:">
                    <el-select v-model="form.institution_type" multiple placeholder="请选择学校类型">
                        <el-option
                            v-for="item in institution_type"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="* 特色标签:">
                    <el-select v-model="form.feature_label" multiple placeholder="请选择学校特色标签">
                        <el-option
                            v-for="item in feature_label"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="* 隶属:">
                    <el-input v-model="form.subjection" placeholder="例如:教育部"></el-input>
                </el-form-item>
                <el-form-item label="* 综合排名:">
                    <el-input v-model="form.ranking" placeholder="请输入学校综合排名"></el-input>
                </el-form-item>
                <el-form-item label="热度排名:">
                    <el-input v-model="form.hits" placeholder="请输入学校热度排名"></el-input>
                </el-form-item>
                <el-form-item label="* 学校性质:">
                    <el-select v-model="form.school_nature" placeholder="请选择学校办学性质">
                        <el-option
                            v-for="item in school_nature"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="* 所在地区">
                    <el-cascader
                        :options="region"
                        :props="treeProps "
                        clearable
                        v-model="form.city"
                        placeholder="请选择地区"
                        style="width:100%"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="VR链接:">
                    <el-input v-model="form.linkurl" placeholder="请输入学校VR链接"></el-input>
                </el-form-item>
                <el-form-item label="排序:">
                    <el-input v-model="form.sort" placeholder="请输入学校排序"></el-input>
                </el-form-item>
                <el-form-item label="H5分享标题:">
                    <el-input v-model="form.share_title" placeholder="请输入H5分享标题"></el-input>
                </el-form-item>
                <el-form-item label="H5分享描述:">
                    <el-input v-model="form.share_description" placeholder="请输入H5分享描述"></el-input>
                </el-form-item>
                <el-form-item label="* 是否热门:">
                    <el-radio-group v-model="form.is_hot">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="查看所需π豆:">
                    <el-input v-model="form.paidou" placeholder="请输入查看所需π豆"></el-input>
                </el-form-item>
                <el-form-item label="* 列表图片">
                    <upload ref="upload_thumb" url="/image_school" :limit="2"></upload>
                </el-form-item>
                <el-form-item label="详情轮播图">
                    <upload ref="upload_banner" url="/image_school" :limit="2"></upload>
                </el-form-item>
                <el-form-item label="* 院校简介">
                    <editor
                        editorId="editor_description"
                        :content="form.description"
                        ref="editor_description"
                    ></editor>
                </el-form-item>
                <el-form-item label="城市特色">
                    <editor
                        editorId="editor_city_identity"
                        :content="form.city_identity"
                        ref="editor_city_identity"
                    ></editor>
                </el-form-item>
                <el-form-item label="师资力量">
                    <editor
                        editorId="editor_teacher_strength"
                        :content="form.teacher_strength"
                        ref="editor_teacher_strength"
                    ></editor>
                </el-form-item>
                <el-form-item label="奖助学金">
                    <editor
                        editorId="editor_scholarships"
                        :content="form.scholarships"
                        ref="editor_scholarships"
                    ></editor>
                </el-form-item>
                <el-form-item>
                    <el-button @click="add">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-main>
</template>
<script>
/* eslint-disable*/
import editor from "@/components/editor";
import upload from "@/components/upload";
export default {
    components: {
        editor,
        upload
    },
    data() {
        return {
            limit: 2,
            form: {
                logo: [],
                thumb: [],
                xiangqing: [],
                province: [],
            },
            feature_label: [], //特色标签
            disciplinary_arr: [], //批次
            institution_type: [], //学校类型
            region: [], //地区
            school_nature: [], //办学性质
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {
        this.loadOptions();
    },
    methods: {
        loadOptions() {
            this.$post("/admin/school/condition_school").then(res => {
                this.feature_label = res.feature_label;
                this.disciplinary_arr = res.disciplinary_arr;
                this.institution_type = res.institution_type;
                this.region = res.region;
                this.school_nature = res.school_nature;
            });
        },
        add() {
            this.form.description = this.$refs.editor_description.getHtml();
            this.form.city_identity = this.$refs.editor_city_identity.getHtml();
            this.form.teacher_strength = this.$refs.editor_teacher_strength.getHtml();
            this.form.scholarships = this.$refs.editor_scholarships.getHtml();
            this.form.logo = this.$refs.upload_logo.getFileList();
            this.form.thumb = this.$refs.upload_thumb.getFileList();
            this.form.xiangqing = this.$refs.upload_banner.getFileList();
            this.form.city = this.form.city[this.form.city.length - 1];
            console.log(this.form);
            this.$post("/admin/school/add", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: "success"
                    });
                    this.$router.push("/school/school");
                } else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: "error"
                    });
                }
            });
        }
    },
    mounted() {
        this.form = {
            city_identity: " ",
            description: " ",
            scholarships: " ",
            teacher_strength: " "
        };
    }
};
</script>
<style scoped>
</style>