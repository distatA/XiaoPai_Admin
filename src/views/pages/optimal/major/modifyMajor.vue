<template>
    <el-main>
        <el-form
            class="form"
            label-position="right"
            :model="form"
            label-width="100px"
            size="mini"
            center
        >
            <el-form-item label="上级菜单">
                <el-cascader
                    :options="optionList"
                    :props="treeProps "
                    clearable
                    v-model="form.depart"
                    placeholder="请选择上级菜单"
                ></el-cascader>
            </el-form-item>
            
            <el-form-item label="专业名称:">
                <el-input class="input" v-model="form.title" clearable placeholder="请输入专业名称"></el-input>
            </el-form-item>
            <el-form-item label="专业标签:">
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

            <el-form-item label="热门&推荐:">
                <!-- <el-radio-group v-model="form.is_top">
                    <el-radio :label="1">热门</el-radio>
                    <el-radio :label="2">推荐</el-radio>
                </el-radio-group> -->
                <el-select v-model="form.is_top" placeholder="请选择">
                    <el-option label="请选择" value="0"></el-option>
                    <el-option label="热门" value="1"></el-option>
                    <el-option label="推荐" value="2"></el-option>
                </el-select>

            </el-form-item>

            <el-form-item label="专业介绍:">
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
                content: "",
                is_top:"",
            },
            optionList: [],
            state: "add",
            inputVisible: false,
            inputValue: "",
            treeProps: {
                value: "id",
                label: "title",
                children: "child",
                checkStrictly: true
            }
        };
    },
    created() {
        this.loadOption();
        this.state = this.$route.query.state;
        this.form.sid = this.$route.query.sid;
        if (this.$route.query.mid) {
            this.form.mid = this.$route.query.mid;
            this.loadDetail();
        }
    },
    methods: {
        loadOption() {
            this.$post("/admin/optimal/school_department", {
                sid: this.$route.query.sid
            }).then(res => {
                if (res.code === 1) {
                    if(res.coll == 2){
                        let options = res.list;
                        options.forEach(e => {
                            if(e.child.length < 1){
                                this.optionList.push(Object.assign({},e,{disabled: true}))
                            }else{
                                this.optionList.push(Object.assign({},e,{disabled: false}))
                            }
                        });
                    }else{
                        this.optionList = res.list;
                    }
                }
                console.log(this.optionList);
            });
        },
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
            this.$post("/admin/optimal/major_getone", {
                mid: this.form.mid
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                    if(this.form.is_top == 0){
                        this.form.is_top = ""
                    }
                }
            });
        },
        handleAdd() {
            this.form.depart = this.form.depart[this.form.depart.length - 1];
            this.form.content = this.$refs.content.getHtml();
            this.$post("/admin/optimal/major_add", this.form).then(res => {
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
            if (typeof this.form.depart != "number") {
                this.form.depart = this.form.depart[
                    this.form.depart.length - 1
                ];
            }
            this.form.content = this.$refs.content.getHtml();
            this.$post("/admin/optimal/major_edit", this.form).then(res => {
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
                name: "optimal-major",
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