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
            <el-form-item label="学院名称:">
                <el-input class="input" v-model="form.title" clearable placeholder="请输入学院名称"></el-input>
            </el-form-item>
            <el-form-item label="学院标签:">
                <el-tag
                    :key="index"
                    v-for="(tag,index) in form.tags"
                    closable
                    :disable-transitions="false"
                    @close="close(tag)"
                >{{tag}}</el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="mini" @click="showInput">添加标签</el-button>
            </el-form-item>
            <el-form-item label="学院介绍:">
                <editor editorId="content" :content="form.content" ref="content"></editor>
            </el-form-item>

            <el-form-item>
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="state == 'add'" type="primary" @click="handleAdd">确 定</el-button>
                <el-button v-else type="primary" @click="handleEdit">确 定</el-button>
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
                tags: [],
                content: ""
            },
            state: "add",
            dynamicTags: ["标签一", "标签二", "标签三"],
            inputVisible: false,
            inputValue: ""
        };
    },
    created() {
        this.state = this.$route.query.state;
        this.form.sid = this.$route.query.sid;
        if (this.$route.query.id) {
            this.form.id = this.$route.query.id;
            this.loadDetail();
        }
    },
    methods: {
        close(tag) {
            this.form.tags.splice(this.form.tags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.form.tags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = "";
        },
        loadDetail() {
            this.$post("/admin/optimal/college_getOne", {
                id: this.form.id
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                }
            });
        },
        handleAdd() {
            this.form.content = this.$refs.content.getHtml();
            this.$post("/admin/optimal/college_add", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.handleClose();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleEdit() {
            this.form.content = this.$refs.content.getHtml();
            this.$post("/admin/optimal/college_edit", this.form).then(res => {
                if (res.code === 1) {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    this.handleClose();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleClose() {
            this.$router.push({
                name: "optimal-college",
                query: {
                    sid: this.$route.query.sid
                }
            });
        }
    },
    mounted() {
        this.form.content = " "; //改变content值才能显示富文本（bug，待修复）
    }
};
</script>
<style scoped>
.input {
    width: 500px;
}
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>