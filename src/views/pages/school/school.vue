<template>
    <el-main>
        <div class="flex">
            <div>
                <el-button
                    type="primary"
                    size="mini"
                    @click="$router.push('/addSchool/addSchool')"
                >添加学校</el-button>
                <el-button type="danger" size="mini" v-if="batchDeleteList.length>0">批量删除</el-button>
            </div>
            <div>
                <el-cascader
                    :options="region_arr"
                    :props="treeProps "
                    clearable
                    v-model="province"
                    placeholder="请选择地区"
                    class="search-item"
                    size="mini"
                ></el-cascader>
                <el-select
                    class="search-item"
                    v-model="disciplinary_level"
                    placeholder="请选择批次"
                    size="mini"
                >
                    <el-option
                        v-for="item in disciplinary_arr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                    class="search-item"
                    v-model="school_nature"
                    placeholder="请选择院校性质"
                    size="mini"
                >
                    <el-option
                        v-for="item in school_nature_arr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                    class="search-item"
                    v-model="institution_type"
                    placeholder="请选择类型"
                    size="mini"
                >
                    <el-option
                        v-for="item in institution_type_arr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                    class="search-item"
                    v-model="feature_label"
                    placeholder="请选择标签"
                    size="mini"
                >
                    <el-option
                        v-for="item in feature_label_arr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-input v-model="name" class="search-item" placeholder="请输入学校名称" size="mini"></el-input>
                <el-button
                    type="primary"
                    size="mini"
                    @click="loadSchoolList(1,province,institution_type,feature_label,disciplinary_level,school_nature,name)"
                >搜索</el-button>
            </div>
        </div>

        <el-table border :data="schoolList">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="学校名称" align="center" fixed width="180"></el-table-column>
            <el-table-column prop="province" label="所在地区" align="center" width="120">
                <template slot-scope="scope">
                    <div>{{scope.row.province}}-{{scope.row.city}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="feature_label" width="300" label="特色标签" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.feature_label.length > 0">
                        <el-tag
                            style="margin-left:5px;"
                            v-for="(item,index) in scope.row.feature_label"
                            :key="index"
                        >{{item}}</el-tag>
                    </div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column prop="institution_type" label="院校类型" align="center"></el-table-column>
            <el-table-column prop="disciplinary_level" label="院校批次" align="center"></el-table-column>
            <el-table-column prop="school_nature" label="院校性质" align="center"></el-table-column>
            <el-table-column label="排序" align="center">
                <template slot-scope="scope">
                    <el-input
                        size="mini"
                        v-model="scope.row.sort"
                        @change="changeSort(scope.row,scope.row.sort,'sort')"
                    ></el-input>
                </template>
            </el-table-column>
            <!-- <el-table-column label="所需π豆" align="center">
                <template slot-scope="scope">
                    <el-input
                        size="mini"
                        v-model="scope.row.paidou"
                        @change="changeSort(scope.row,scope.row.paidou,'paidou')"
                    ></el-input>
                </template>
            </el-table-column>-->
            <el-table-column label="热门" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.is_hot"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                        @change="changeSort(scope.row,scope.row.is_hot,'is_hot')"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="是否是分类招生" align="center">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.is_fenlei"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                        @change="changeSort(scope.row,scope.row.is_fenlei,'is_fenlei')"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" width="200">
                <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row)" type="primary" size="mini">编辑</el-button>
                    <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
                    <el-dropdown class="ml">
                        <span class="el-dropdown-link">
                            下拉菜单
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                @click.native="handleJump(scope.row,'specialMajor-specialMajor')"
                            >特色专业</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJump(scope.row,'createMajor-createMajor')"
                            >开设专业</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJump(scope.row,'classmate-classmate')"
                            >知名校友</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJump(scope.row,'studentSection-studentSection')"
                            >招生简章</el-dropdown-item>
                            <el-dropdown-item
                                @click.native="handleJump(scope.row,'school-group')"
                            >设置群聊</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template> 
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totals"
                :page-size="offset"
                @current-change="getCurrentage"
            ></el-pagination>
        </div>
    </el-main>
</template>
<script>
/*eslint-disable*/
export default {
    data() {
        return {
            page: 1, //当前页数
            offset: 15, //每页数量
            totals: 0, //总条数
            schoolList: [],
            name: "",
            disciplinary_level: "",
            disciplinary_arr: [], //批次搜索
            feature_label: "",
            feature_label_arr: [], //标签搜索
            institution_type: "",
            institution_type_arr: [], //类型搜索
            province: "",
            region_arr: [], //地区搜索
            treeProps: {
                value: "id",
                label: "name",
                children: "child",
                checkStrictly: true
            },
            school_nature: "",
            school_nature_arr: [], //院校性质搜索
            batchDeleteList: [] //批量删除按钮
        };
    },
    created() {
        this.loadSchoolList();
        this.loadOptions();
    },
    methods: {
        loadOptions() {
            this.$post("/admin/school/condition_school").then(res => {
                if (res.code === 1) {
                    this.disciplinary_arr = res.disciplinary_arr; //, //批次搜索
                    this.feature_label_arr = res.feature_label; //标签搜索
                    this.institution_type_arr = res.institution_type; //类型搜索
                    this.region_arr = res.region; //地区搜索
                    this.school_nature_arr = res.school_nature; //院校性质搜索
                }
            });
        },
        //解决搜索之后，点击分页仍可以查询全部的bug
        getCurrentage(pages) {
            console.log(pages);
            this.loadSchoolList(
                pages,
                this.province,
                this.institution_type,
                this.feature_label,
                this.disciplinary_level,
                this.school_nature,
                this.name
            );
        },
        //加载学校列表
        loadSchoolList(
            pages,
            province,
            institution_type,
            feature_label,
            disciplinary_level,
            school_nature,
            name
        ) {
            if (province) {
                province = province[province.length - 1];
            }
            this.page = pages;
            this.$post("/admin/school/index", {
                page: this.page,
                num: this.offset,
                province: province,
                institution_type: institution_type,
                feature_label: feature_label,
                disciplinary_level: disciplinary_level,
                school_nature: school_nature,
                name: name
            }).then(res => {
                if (res.code === 1) {
                    this.schoolList = res.list;
                    this.totals = res.all_num;
                } else {
                    this.schoolList = [];
                    this.totals = 0;
                }
            });
        },
        changeSort(item, value, dateSort) {
            this.$post("/admin/school/ajaxsort", {
                id: item.id,
                dataSort: dateSort,
                sort: value
            }).then(res => {});
        },
        //编辑
        handleEdit(item) {
            this.$router.push({
                name: "editSchool-editSchool",
                query: {
                    id: item.id
                }
            });
        },
        //点击多选
        handleSelect(val) {
            if (val.length === 0) {
                this.batchDeleteList = [];
            } else {
                //处理数组，将id遍历出来
                var arr = [];
                val.forEach(item => {
                    arr.push(item.id);
                    this.batchDeleteList = [...arr];
                });
            }
            console.log(this.batchDeleteList);
        },
        handleDelete(item) {
            if (item.id) {
                //如果item存在则是点击单个数据删除
                this.batchDeleteList.push(item.id);
            }
            this.$confirm("此操作将永久删除学校, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$post("/admin/school/delete", {
                        id: this.batchDeleteList
                    }).then(res => {
                        if (res.code === 1) {
                            this.$message({
                                message: res.msg,
                                type: "success"
                            });
                            this.batchDeleteList = [];
                            //删除后重新拉取
                            this.loadSchoolList();
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        handleJump(item, url) {
            this.$router.push({
                name: url,
                query: {
                    sid: item.id
                }
            });
        }
    }
};
</script>
<style scoped>
.flex {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
.search-item {
    width: 120px;
    margin-right: 10px;
}
/* .el-input >>> .el-input__inner {
    text-align: center;
} */
.pagination {
    margin: 20px 0 0 -10px;
}
.thumb {
    width: 300px;
    height: 200px;
}
.thumb img {
    width: 100%;
    height: 100%;
}
.ml {
    margin-left: 20px;
    border: 1px #ccc solid;
    padding: 2px 5px;
    border-radius: 3px;
    cursor: pointer;
}
</style>