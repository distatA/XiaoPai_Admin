<template>
    <el-main>
        <div>
            <el-form class="form" ref="form" :model="form" label-width="100px" size="small">
                <el-form-item label="群主:">
                    <el-input class="search" v-model="form.uid" placeholder="请输入用户ID"></el-input>
                </el-form-item>
                <el-form-item label="群LOGO">
                    <upload
                        ref="logo"
                        :limit="1"
                        url="/image_school"
                        :file="JSON.stringify(form.logo)"
                    ></upload>
                </el-form-item>
                <el-form-item label="群名称:">
                    <el-input v-model="form.name" placeholder="请输入群名称"></el-input>
                </el-form-item>
                <el-form-item label="分享封面">
                    <upload
                        ref="cover"
                        :limit="1"
                        url="/image_school"
                        :file="JSON.stringify(form.cover)"
                    ></upload>
                </el-form-item>
                <el-form-item label="分享标题:">
                    <el-input v-model="form.title" placeholder="请输入分享标题"></el-input>
                </el-form-item>

                <el-form-item label="状态:">
                    <el-radio-group v-model="form.state">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button @click="close">添加</el-button>
                    <el-button type="primary" @click="add">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-main>
</template>
<script>
/* eslint-disable*/
import editor from "@/components/editor";
import upload from "@/components/upload";
import { parse } from "path";
export default {
    components: {
        editor,
        upload
    },
    data() {
        return {
            limit: 2,
            form: {
                state: 1
            },
            name: "",
            searchList: [],
            isAdd: true
        };
    },
    created() {
        this.isAdd = this.$route.query.isAdd;
        if (this.$route.query.sid) {
            this.form.sid = this.$route.query.sid;
            this.loadDetail();
        }
        // this.loadOptions();
    },
    methods: {
        loadDetail() {
            this.$post("/admin/school/getone_group", {
                sid: this.form.sid
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        close() {},
        searchUser() {
            this.$post("/admin/school/find_user", { name: this.name }).then(
                res => {
                    if (res.code === 1) {
                        this.searchList = res.list;
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            );
        },
        add() {
            this.form.logo = this.$refs.logo.getFileList();
            this.form.cover = this.$refs.cover.getFileList();
            this.form.sid = this.$route.query.sid;
            this.$post("/admin/school/group_edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.$router.push({
                        name: "school-group",
                        query: {
                            sid: this.$route.query.sid
                        }
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
.search {
    width: 300px;
    position: relative;
}
.search-list {
    /* position: absolute;
    left: 0;
    right: 0;
    top: 70px; */
}
</style>