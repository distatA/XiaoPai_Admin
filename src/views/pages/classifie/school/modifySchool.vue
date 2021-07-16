<template>
    <el-main>
        <el-form :model="form" ref="form" size="mini" label-width="100px">
            <!-- <el-form-item label="地区:" v-if="isAdd == 'true'">
                <el-cascader
                    :options="region"
                    :props="treeProps "
                    clearable
                    v-model="city"
                    placeholder="请选择地区"
                    @change="loadSchoolList"
                ></el-cascader>
            </el-form-item>-->

            <el-form-item label="学校名称:">
                <el-select v-model="form.sid" filterable placeholder="请选择学校">
                    <el-option
                        v-for="item in schoolList"
                        :key="item.id"
                        clearable
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <!-- <el-input v-else disabled v-model="form.school_name"></el-input> -->
            </el-form-item>
            <el-form-item label="人气:">
                <el-input type="number" v-model="form.mood" placeholder="请输入学校人气"></el-input>
            </el-form-item>
            <el-form-item label="是否热门:">
                <el-radio-group v-model="form.is_hot">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="热门排序:">
                <el-input type="number" v-model="form.hot_sort" placeholder="请输入热门排序"></el-input>
            </el-form-item>
            <el-form-item label="学校环境:">
                <upload
                    ref="img_url"
                    url="/image_class"
                    :limit="10"
                    :file="JSON.stringify(form.img_url)"
                ></upload>
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
import upload from "@/components/upload";
export default {
    components: {
        upload
    },
    data() {
        return {
            schoolList: [], //选择学校的列表
            form: {},
            city: "", //所选地区
            region: [], //地区列表
            cate_list: [],
            isAdd: "true",
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            },
            fileList: [],
            token: {
                token: window.localStorage.getItem("token")
            }
        };
    },
    created() {
        this.loadOption();
        this.isAdd = this.$route.query.isAdd;
        console.log(this.isAdd);
        if (this.$route.query.sid) {
            this.form.sid = this.$route.query.sid;
            this.loadDetail();
        }
    },
    methods: {
        loadOption() {
            this.$post("/admin/classifie/condition_school").then(res => {
                if (res.code === 1) {
                    this.region = res.region; //地区搜索
                    this.schoolList = res.school_list;
                }
            });
        },
        //加载学校列表
        loadSchoolList() {
            this.city = this.city[this.city.length - 1];
            this.$post("/admin/classifie/condition_school", {
                city: this.city
            }).then(res => {
                if (res.code === 1) {
                    // this.region = res.region; //地区搜索
                    this.schoolList = res.school_list;
                }
            });
        },
        //
        loadDetail() {
            this.$post("/admin/classifie/getone_school", {
                sid: this.form.sid
            }).then(res => {
                if (res.code === 1) {
                    this.form = res.info;
                    this.form.addtime = this.form.addtime * 1000;
                    // this.form.desc = res.info.description;
                }
            });
        },
        handleClose() {
            this.$router.push("/classifie/school");
        },
        handleAdd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.img_url = this.$refs.img_url.getFileList();
                    this.$post("/admin/classifie/add_school", this.form).then(
                        res => {
                            if (res.code === 1) {
                                this.$message({
                                    message: res.msg,
                                    type: "success"
                                });
                                this.$router.push("/classifie/school");
                            } else {
                                this.$message.error(res.msg);
                            }
                        }
                    );
                }
            });
        },
        handleEdit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.img_url = this.$refs.img_url.getFileList();
                    this.$post("/admin/classifie/edit_school", this.form).then(
                        res => {
                            if (res.code === 1) {
                                this.$message({
                                    message: res.msg,
                                    type: "success"
                                });
                                this.$router.push("/classifie/school");
                            } else {
                                this.$message.error(res.msg);
                            }
                        }
                    );
                }
            });
        }
    },
    mounted() {}
};
</script>
        
 <style>
.mt {
    margin-top: 10px;
}
</style>