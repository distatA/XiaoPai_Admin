<template>
    <el-main>
        <el-form class="form" :model="form" ref="form" size="mini" label-width="100px">
            <el-form-item label="学校名称:" prop="title">
                <el-input v-model="form.name" placeholder="请输入学校名称"></el-input>
            </el-form-item>
            <el-form-item label="学校英文名:" prop="province">
                <el-input v-model="form.en_name" placeholder="请输入学校英文名"></el-input>
            </el-form-item>
            <el-form-item label="分类:" prop="cate_id">
                <el-select v-model="form.cate_id" placeholder="请选择学校分类">
                    <el-option
                        v-for="item in optionList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述:" prop="description">
                <el-input type="textarea" v-model="form.description" placeholder="请输入学校描述"></el-input>
            </el-form-item>
            <el-form-item label="学校logo:" prop="sort">
                <upload ref="logo" url="/image_abroad" :limit="1" :file="JSON.stringify(form.logo)"></upload>
            </el-form-item>
            <el-form-item label="学校背景图:" prop="tags">
                <upload
                    ref="background"
                    url="/image_abroad"
                    :limit="1"
                    :file="JSON.stringify(form.background)"
                ></upload>
            </el-form-item>
            <el-form-item label="学校官网:" prop="website">
                <el-input v-model="form.website" placeholder="请输入学校官网"></el-input>
            </el-form-item>
            <el-form-item label="地址:">
                <el-input v-model="form.address" placeholder="请输入地址"></el-input>
            </el-form-item>
            <el-form-item label="联系电话:" prop="telephone">
                <el-input v-model="form.telephone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <el-form-item label="关注数:" prop="focus">
                <el-input v-model="form.focus" placeholder="请输入关注数"></el-input>
            </el-form-item>
            <el-form-item label="排名:" prop="grade">
                <el-input v-model="form.grade" placeholder="请输入学校排名"></el-input>
            </el-form-item>
            <el-form-item label="排序:">
                <el-input v-model="form.sort" placeholder="请输入学校排序"></el-input>
            </el-form-item>
            <el-form-item label="热门专业:" prop="hot_major">
                <el-input v-model="form.hot_major" placeholder="请输入学校热门专业(逗号分隔开)"></el-input>
            </el-form-item>
            <el-form-item label="联系方式:" prop="contact">
                <el-input
                    v-model="form.contact"
                    placeholder="请输入联系方式(微信号在前 手机号在后用英文逗号隔开， 如：微信号,手机号)"
                ></el-input>
            </el-form-item>
            <el-form-item label="开设专业:" prop="开设专业 ">
                <editor editorId="major" :content="form.major" ref="major"></editor>
            </el-form-item>
            <el-form-item label="申请流程:" prop="process">
                <editor editorId="process" :content="form.process" ref="process"></editor>
            </el-form-item>
            <el-form-item label="教学设施:" prop="facility">
                <editor editorId="facility" :content="form.facility" ref="facility"></editor>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="isAdd=='true'" type="primary" @click="handleAdd">确 定</el-button>
                <el-button v-else type="primary" @click="handleEdit">确 定</el-button>
            </el-form-item>
        </el-form>
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
            form: {},
            region: [],
            optionList: [], //分类
            isAdd: "true",
            formrules: {
                //     province: [
                //         {
                //             required: true,
                //             message: "地区不能为空",
                //             trigger: "blur"
                //         }
                //     ],
                //     cate_id: [
                //         {
                //             required: true,
                //             message: "开始时间不能为空",
                //             trigger: "blur"
                //         }
                //     ],
                //     title: [
                //         {
                //             required: true,
                //             message: "背景图不能为空",
                //             trigger: "blur"
                //         }
                //     ],
                //     sort: [
                //         {
                //             required: true,
                //             message: "排序不能为空",
                //             trigger: "blur"
                //         }
                //     ],
                //     content: [
                //         {
                //             required: true,
                //             message: "背景图不能为空",
                //             trigger: "blur"
                //         }
                //     ]
            }
        };
    },
    created() {
        this.loadOption();
        this.isAdd = this.$route.query.isAdd;
        this.form.id = this.$route.query.id;
        if (this.form.id) {
            this.loadDetail();
        }
    },
    methods: {
        loadOption() {
            this.$post("/admin/abroad/cate").then(res => {
                if (res.code === 1) {
                    this.optionList = res.list; //地区搜索
                }
            });
        },
        //
        loadDetail() {
            this.$post("/admin/abroad/getone", {
                id: this.form.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                }
            });
        },
        handleClose() {
            this.$router.push({
                name: "international-index"
            });
        },
        handleAdd() {
            this.form.major = this.$refs.major.getHtml();
            this.form.process = this.$refs.process.getHtml();
            this.form.facility = this.$refs.facility.getHtml();
            this.form.logo = this.$refs.logo.getFileList();
            this.form.background = this.$refs.background.getFileList();
            this.$post("/admin/abroad/add", this.form).then(res => {
                if (res.code === 1) {
                    this.handleClose();
                }
            });
        },
        handleEdit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.major = this.$refs.major.getHtml();
                    this.form.process = this.$refs.process.getHtml();
                    this.form.facility = this.$refs.facility.getHtml();
                    this.form.logo = this.$refs.logo.getFileList();
                    this.form.background = this.$refs.background.getFileList();
                    this.$post("/admin/abroad/edit", this.form).then(res => {
                        if (res.code === 1) {
                            this.handleClose();
                        }
                    });
                }
            });
        }
    },
    mounted() {
        this.form = {
            major: " ",
            process: " ",
            facility: " ",
            sort: 0,
            grade: 0,
            focus: 0
        };
    }
};
</script>
        
 <style>
.form {
    width: 700px;
}
.mt {
    margin-top: 10px;
}
</style>