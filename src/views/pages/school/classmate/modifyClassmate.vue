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
            <el-form-item label="名称:">
                <el-input class="input" v-model="form.name" placeholder="请输入知名校友的名称"></el-input>
            </el-form-item>
            <el-form-item label="简介:">
                <editor editorId="addEdit" :content="form.profile" ref="editor_profile"></editor>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleCancel">取 消</el-button>
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
                profile: ""
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
            this.form.profile = this.$refs.editor_profile.getHtml();
            this.$post("/admin/school/add_alumni", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "添加成功",
                        type: "success"
                    });
                    // this.$router.push("/classmate/classmate");
                    this.$router.push({
                        name: "classmate-classmate",
                        query: {
                            sid: this.$route.query.sid
                        }
                    });
                }
            });
        },
        handleEdit() {
            this.form.profile = this.$refs.editor_profile.getHtml();
            this.$post("/admin/school/edit_alumni", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: "编辑成功",
                        type: "success"
                    });
                    this.$router.push({
                        name: "classmate-classmate",
                        query: {
                            sid: this.$route.query.sid
                        }
                    });
                }
            });
        },
        handleCancel() {
            this.$router.push({
                name: "classmate-classmate",
                query: {
                    sid: this.$route.query.sid
                }
            });
        }
    },
    mounted() {
        if (this.isAdd) {
            this.form.profile = " ";
        } else {
            this.$post("/admin/school/getone_alumni", {
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