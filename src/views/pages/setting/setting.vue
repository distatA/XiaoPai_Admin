<template>
    <el-main>
        <div class="content" @scroll="contentScroll">
            <div class="anchor">
                <div class="anchor-title">分类招生</div>
                <div class="category">
                    <div class="category-item" v-for="(item,index) in categoryList" :key="index">
                        <el-input
                            placeholder="请输入内容"
                            v-model="item.fenlei_name"
                            @change="changeCategory"
                        >
                            <template slot="prepend" style="width:90px;">{{item.name}}</template>
                        </el-input>
                    </div>
                </div>
            </div>
            <div class="anchor">
                <div class="anchor-title">用户服务协议</div>
                <div class="edit">
                    <editor editorId="serviceValue" :content="serviceValue" ref="serviceValue"></editor>
                    <div class="submit">
                        <el-button size="mini" type="primary" @click="saveService">保存</el-button>
                    </div>
                </div>
            </div>
            <div class="anchor">
                <div class="anchor-title">用户隐私申明</div>
                <div class="edit">
                    <editor editorId="privacyValue" :content="privacyValue" ref="privacyValue"></editor>
                    <div class="submit">
                        <el-button size="mini" type="primary" @click="savePrivacy">保存</el-button>
                    </div>
                </div>
            </div>
            <div class="anchor">
                <div class="anchor-title">关于校派</div>
                <div class="edit">
                    <editor editorId="aboutValue" :content="aboutValue" ref="aboutValue"></editor>
                    <div class="submit">
                        <el-button size="mini" type="primary" @click="saveAbout">保存</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="setting-list">
            <div
                :class="currentAnchor === index?'setting-list-item-on':'setting-list-item-off'"
                v-for="(item,index) in settingList"
                :key="item.id"
                @click="jumpAnchor(index,item)"
            >{{item.name}}</div>
        </div>
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
            categoryList: [],
            currentAnchor: 0,
            settingList: [
                { id: 1, name: "分类招生", anchor: 1 },
                { id: 2, name: "用户服务协议", anchor: 2 },
                { id: 3, name: "用户隐私申明", anchor: 3 },
                { id: 4, name: "关于校派", anchor: 4 }
            ],
            serviceValue: "", //服务协议配置
            privacyValue: "", //隐私配置
            aboutValue: "" //
        };
    },
    created() {
        this.loadList();
        this.loadConfig();
    },
    methods: {
        loadList() {
            this.$post("/admin/Config/get_fenlei").then(res => {
                if (res.code === 1) {
                    this.categoryList = res.list;
                }
            });
        },
        loadConfig() {
            this.$post("/admin/config/get_schoolpi").then(res => {
                if (res.code === 1) {
                    if (res.list.value != null) {
                        this.aboutValue = res.list.value;
                    } else {
                        this.aboutValue = " ";
                    }
                }
            });
            this.$post("/admin/config/get_privacy").then(res => {
                if (res.code === 1) {
                    if (res.list.value != null) {
                        this.privacyValue = res.list.value;
                    } else {
                        this.privacyValue = " ";
                    }
                }
            });
            this.$post("/admin/config/get_service").then(res => {
                if (res.code === 1) {
                    if (res.list.value != null) {
                        this.serviceValue = res.list.value;
                    } else {
                        this.serviceValue = " ";
                    }
                }
            });
        },
        saveService() {
            var value = this.$refs.serviceValue.getHtml();
            this.$post("/admin/config/edit_service", { value: value }).then(
                res => {
                    if (res.code === 1) {
                        this.$message({
                            message: res.msg,
                            type: "success"
                        });
                    }
                }
            );
        },
        savePrivacy() {
            var value = this.$refs.privacyValue.getHtml();
            this.$post("/admin/config/edit_privacy", { value: value }).then(
                res => {
                    if (res.code === 1) {
                        this.$message({
                            message: res.msg,
                            type: "success"
                        });
                    }
                }
            );
        },
        saveAbout() {
            var value = this.$refs.aboutValue.getHtml();
            this.$post("/admin/config/edit_schoolpi", { value: value }).then(
                res => {
                    if (res.code === 1) {
                        this.$message({
                            message: res.msg,
                            type: "success"
                        });
                    }
                }
            );
        },
        changeCategory() {
            let region_id = [];
            let fenlei_name = [];
            this.categoryList.forEach(item => {
                region_id.push(item.id);
                fenlei_name.push(item.fenlei_name);
            });
            this.$post("/admin/Config/edit_fenlei", {
                region_id: region_id,
                fenlei_name: fenlei_name
            }).then(res => {
                if (res.code === 1) {
                    // this.categoryList = res.list;
                }
            });
        },
        jumpAnchor(index, item) {
            this.currentAnchor = index;
            var items = document.querySelectorAll(".anchor");
            for (var i = 0; i < items.length; i++) {
                if (index === i) {
                    items[i].scrollIntoView({
                        block: "start", //默认跳转到顶部
                        behavior: "smooth" //滚动的速度
                    });
                }
            }
        },
        contentScroll(e) {
            let scrollItems = document.querySelectorAll(".anchor");
            for (let i = scrollItems.length - 1; i >= 0; i--) {
                // 判断滚动条滚动距离是否大于当前滚动项可滚动距离
                let judge =
                    e.target.scrollTop >=
                    scrollItems[i].offsetTop - scrollItems[0].offsetTop;
                if (judge) {
                    this.currentAnchor = i;
                    break;
                }
            }
        }
    },
    mounted() {
        this.serviceValue = " ";
        this.privacyValue = " ";
        this.aboutValue = " ";
    }
};
</script>
<style scoped>
.submit {
    width: 100px;
    margin: 20px auto;
}
.edit {
    margin-top: 20px;
}
.content {
    padding-right: 140px;
    padding-left: 10px;
    overflow: scroll;
    max-height: 800px;
}
.content::-webkit-scrollbar {
    display: none;
}
.category {
    width: 1000px;
    /* justify-content: space-around; */
    display: flex;
    flex-wrap: wrap;
}
.category-item {
    width: 230px;
    margin-top: 20px;
    margin-right: 20px;
}
.anchor-title {
    font-size: 18px;
    font-weight: bold;
    color: #222;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
}
.setting-list {
    width: 130px;
    position: fixed;
    right: 20px;
    top: 80px;
    box-sizing: border-box;
    font-size: 12px;
    color: #333;
}
.setting-list-item-on,
.setting-list-item-off {
    padding: 10px 0 10px 10px;
    border-left: 2px #dcdcdc solid;
    cursor: pointer;
}
.setting-list-item-on {
    border-left: 2px #337eff solid;
    color: #337eff;
}
</style>