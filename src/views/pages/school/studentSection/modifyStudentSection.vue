<template>
    <el-main>
        <el-form
            class="form"
            label-position="right"
            :model="form"
            label-width="80px"
            size="mini"
            center
        >
            <el-form-item label="标题:">
                <el-input class="input" v-model="form.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="发行时间:">
                <el-input class="input" v-model="form.lssue_time" placeholder="请输入发行时间"></el-input>
            </el-form-item>
            <el-form-item label="排序:">
                <el-input class="input" v-model="form.sort" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="简介:">
                <editor editorId="addEdit" :content="form.content" ref="editor_profile"></editor>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleCancle">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="handleAdd">保存</el-button>
                <el-button v-else type="primary" @click="handleEdit">编辑</el-button>
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
            form: {
                content: ""
            },
            isAdd: true
        };
    },
    created() {
        this.form.sid = this.$route.query.sid;
        this.form.id = this.$route.query.id;
        this.isAdd = this.$route.query.isAdd;
    },
    methods: {
        //确认添加
        handleAdd() {
            this.form.content = this.$refs.editor_profile.getHtml();
            this.$post("/admin/school/add_enrollment", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "添加成功",
                        type: "success"
                    });
                    // this.$router.push("/classmate/classmate");
                    this.$router.push({
                        name: "studentSection-studentSection",
                        query: {
                            sid: this.$route.query.sid
                        }
                    });
                }
            });
        },
        handleEdit() {
            this.form.content = this.$refs.editor_profile.getHtml();
            this.$post("/admin/school/edit_enrollment", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "编辑成功",
                        type: "success"
                    });
                    this.$router.push({
                        name: "studentSection-studentSection",
                        query: {
                            sid: this.$route.query.sid
                        }
                    });
                }
            });
        },
        handleCancle() {
            this.$router.push({
                name: "studentSection-studentSection",
                query: {
                    sid: this.$route.query.sid
                }
            });
        }
    },
    mounted() {
        if (this.isAdd) {
            this.form.content = " ";
        } else {
            this.$post("/admin/school/getone_enrollment", {
                id: this.form.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                    this.form.sid = this.$route.query.sid;
                }
            });
        }
    }
};
</script>
<style  scoped>
.form {
    margin-right: 100px;
}
.input {
    width: 500px;
}
.pagination {
    margin: 20px 0 0 -10px;
}
.add {
    margin-bottom: 20px;
}
.forbidden {
    color: red;
}
.usual {
    color: blue;
}
</style>