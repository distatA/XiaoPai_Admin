<template>
    <el-main>
        <div class="panel">
            <div class="panel-right">
                <el-button size="mini" type="primary" @click="$router.push('/setting/win')">中奖用户</el-button>
                <el-button
                    size="mini"
                    type="primary"
                    @click="$router.push('/setting/activityRecord')"
                >抽奖记录</el-button>
                <!-- @click="handleDownload" -->
                <el-button size="mini" type="primary">
                    <a
                        href="http://new.schoolpi.net/admin/draw/win_excel"
                        download
                        title="下载"
                        mce_href="#"
                        class="download"
                    >下载记录</a>
                </el-button>
                <el-button size="mini" type="primary" @click="setNumber">设置最大数量</el-button>
                <el-button size="mini" type="primary" @click="setTime">设置活动时间</el-button>
            </div>
            <div class="panel-right">
                <el-select
                    class="mr"
                    v-model="win"
                    placeholder="请选择奖品"
                    size="mini"
                    clearable
                    @change="search"
                >
                    <el-option
                        v-for="item in optionList"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                    ></el-option>
                </el-select>
                <el-input
                    class="mr"
                    size="mini"
                    v-model="keyword"
                    placeholder="请输入用户昵称"
                    clearable
                    @change="search"
                ></el-input>
                <el-button size="mini" type="primary">搜索</el-button>
            </div>
        </div>
        <el-table :data="rightsList" border borderstripe>
            <el-table-column label="用户昵称" prop="nickname" align="center"></el-table-column>
            <el-table-column label="是否中奖" prop="iswin" align="center"></el-table-column>
            <el-table-column label="奖品" prop="prize" align="center"></el-table-column>
            <el-table-column label="剩余抽奖次数" prop="num" align="center"></el-table-column>
            <el-table-column label="参与时间" prop="addtime" align="center"></el-table-column>
            <!-- <el-table-column label="操作" align="center"> -->
            <!-- <template>
                    <el-button type="primary" size="mini">审核</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
            </template>-->
            <!-- </el-table-column> -->
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next,total"
                :total="totals"
                :page-size="offset"
                @current-change="getCurrentage"
            ></el-pagination>
        </div>
        <el-dialog title="每日最大数量" :visible.sync="dialogVisible" center>
            <el-form ref="form" label-width="100px" :model="form" size="mini">
                <el-form-item label="口罩:">
                    <el-input v-model="form.draw_1" placeholder="请输入口罩数量"></el-input>
                </el-form-item>
                <el-form-item label="爱奇艺:">
                    <el-input v-model="form.draw_2" placeholder="请输入爱奇艺数量"></el-input>
                </el-form-item>
                <el-form-item label="腾讯:">
                    <el-input v-model="form.draw_3" placeholder="请输入腾讯数量"></el-input>
                </el-form-item>
                <el-form-item label="优酷:">
                    <el-input v-model="form.draw_4" placeholder="请输入优酷数量"></el-input>
                </el-form-item>
                <el-form-item label="积分500:">
                    <el-input v-model="form.draw_5" placeholder="请输入积分500数量"></el-input>
                </el-form-item>
                <el-form-item label="积分300:">
                    <el-input v-model="form.draw_6" placeholder="请输入积分300数量"></el-input>
                </el-form-item>
                <el-form-item label="积分100:">
                    <el-input v-model="form.draw_7" placeholder="请输入积分100数量"></el-input>
                </el-form-item>
                <el-form-item label="积分50:">
                    <el-input v-model="form.draw_8" placeholder="请输入积分50数量"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSave">保存</el-button>
                    <el-button @click="handleClose">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="每日最大数量" :visible.sync="timeDialogVisible" center>
            <el-form ref="form" label-width="100px" :model="timeForm" size="mini">
                <el-form-item label="开始时间:">
                    <!-- <el-input v-model="form.start_date" placeholder="请输入口罩数量"></el-input> -->
                    <el-date-picker
                        v-model="timeForm.start_date"
                        type="date"
                        placeholder="选择开始时间"
                        value-format="timestamp"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间:">
                    <el-date-picker
                        v-model="timeForm.end_date"
                        type="date"
                        placeholder="选择结束时间"
                        value-format="timestamp"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSaveTime">保存</el-button>
                    <el-button @click="handleCloseTime">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-main>
</template>

<script>
/* eslint-disable*/
export default {
    data() {
        return {
            // 权限列表
            rightsList: [],
            dialogVisible: false,
            form: {}, //表单
            isAdd: true, //判断表单是添加还是编辑
            offset: 15,
            totals: 0,
            optionList: [],
            keyword: "", //搜索
            win: "",
            dialogVisible: false,
            timeDialogVisible: false,
            form: {},
            timeForm: {
                start_date: "",
                end_date: ""
            }
        };
    },
    created() {
        this.getList();
        this.loadOption();
    },
    methods: {
        handleSaveTime() {
            this.$post("/admin/draw/draw_time_edit", {
                start_date: parseInt(this.timeForm.start_date / 1000),
                end_date: parseInt(this.timeForm.end_date / 1000)
            }).then(res => {
                if (res.code === 1) {
                    this.handleCloseTime();
                    // this.form = res.data;
                }
            });
        },
        handleCloseTime() {
            this.timeDialogVisible = false;
        },
        setTime() {
            this.$post("/admin/draw/draw_time").then(res => {
                if (res.code === 1) {
                    this.timeDialogVisible = true;
                    this.timeForm.start_date = res.data.start_date * 1000;
                    this.timeForm.end_date = res.data.end_date * 1000;
                }
            });
        },
        handleDownload() {
            this.$post("/admin/draw/win_excel").then(res => {
                if (res.code === 1) {
                    // this.dialogVisible = true;
                    // this.form = res.data;
                }
            });
        },
        setNumber() {
            this.$post("/admin/draw/daily").then(res => {
                if (res.code === 1) {
                    this.dialogVisible = true;
                    this.form = res.data;
                }
            });
        },
        search() {
            this.getList(1);
        },
        loadOption() {
            this.$post("/admin/draw//option_win").then(res => {
                if (res.code === 1) {
                    this.optionList = res.data;
                }
            });
        },
        getCurrentage(pages) {
            this.getList(pages);
        },
        // 获取数据
        getList(pages) {
            this.page = pages;
            this.$post("/admin/draw/users", {
                page: this.page,
                num: this.offset,
                win: this.win,
                keyword: this.keyword
            }).then(res => {
                if (res.code !== 1) {
                    this.$message.error(res.msg);
                    this.rightsList = [];
                    this.totals = 0;
                } else {
                    this.rightsList = res.list;
                    this.totals = res.all_num;
                }
            });
        },
        handleSave() {
            this.$post("/admin/draw/daily_edit  ", this.form).then(res => {
                if (res.code !== 1) {
                    this.$message.error(res.msg);
                } else {
                    this.handleClose();
                }
            });
        },
        handleClose() {
            this.dialogVisible = false;
        }
    }
};
</script>

<style scoped>
.panel {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
}
.panel-right {
    display: flex;
}
.mr {
    margin-right: 10px;
}
.pagination {
    margin: 20px 0 0 -10px;
}
.download {
    color: #fff;
    text-decoration: none;
}
</style>
