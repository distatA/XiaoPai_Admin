<template>
  <div class="index-contanier">
    <div class="nav-box">
      <div class="nav-logo">
        <div v-if="!isCollapse" class="logo"></div>
        <!-- <div class="logo"></div> -->
      </div>
      <el-menu
        :default-active="firstNavId"
        class="menu el-menu-vertical-demo"
        :collapse="isCollapse"
        background-color="#212121"
        active-text-color="#fff"
        text-color="#a8adaf"
        router
      >
        <el-menu-item
          :index="item.url"
          :class="item.id == firstNavId ? 'menu-item-on' : 'menu-item.off'"
          v-for="(item, index) in menu"
          :key="index"
          @click="selectFirstMenu(item)"
        >
          <i :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
      <div class="expand" @click="expand">
        <i v-if="!isCollapse" class="el-icon-d-arrow-left"></i>
        <i v-else class="el-icon-d-arrow-right"></i>
      </div>
      <div v-if="rightSideNav.child.length != 0">
        <div ref="sideIcon" class="side-expand" @click="sideExpand">
          <i v-if="!sideNavCollapse" class="el-icon-d-arrow-left"></i>
          <i v-else class="el-icon-d-arrow-right"></i>
        </div>
      </div>
      <div class="version" v-if="!isCollapse">校派3.0.0</div>
    </div>
    <div class="contanier">
      <div class="content">
        <div class="header">
          <navHeader></navHeader>
        </div>
        <div class="content-inside">
          <div class="content-box">
            <div
              ref="sideNav"
              class="side-nav"
              :style="
                rightSideNav.child.length === 0 ? 'width:0px' : 'width:150px'
              "
            >
              <div v-if="rightSideNav.child.length != 0">
                <div class="side-bar-title">{{ rightSideNav.name }}</div>
                <div
                  ref="sideNavItem"
                  v-for="(item, index) in rightSideNav.child"
                  :key="index"
                >
                  <div class="second-nav">
                    <div>{{ item.name }}</div>
                    <div class="arrow">
                      <i class="el-icon-arrow-right"></i>
                    </div>
                  </div>
                  <div v-for="(i, index) in item.child" :key="index">
                    <div
                      :class="
                        thirdNavId == i.url ? 'third-nav-on' : 'third-nav-off'
                      "
                      @click="selectMenuItem(i)"
                    >
                      {{ i.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-router">
              <div class="router-view">
                <router-view />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
import menuList from "../json/menu.json";
import navHeader from "../components/header";
export default {
  components: {
    navHeader,
  },
  data() {
    return {
      isCollapse: false,
      sideNavCollapse: false, //是否展开子菜单
      firstNavId: window.sessionStorage.getItem("firstNavId")
        ? window.sessionStorage.getItem("firstNavId")
        : "1", //父菜单id
      thirdNavId: window.sessionStorage.getItem("thirdNavId")
        ? window.sessionStorage.getItem("thirdNavId")
        : "0", //子菜单id
      menu: [],
      rightSideNav: JSON.parse(window.sessionStorage.getItem("rightNav"))
        ? JSON.parse(window.sessionStorage.getItem("rightNav"))
        : { child: [] },
    };
  },
  created() {
    this.thirdNavId = this.$route.path;
    this.$post("/admin/base/get_menu").then((res) => {
      if (res.code === 1) {
        this.menu = res.list;
      }
    });
  },
  methods: {
    //隐藏一级菜单
    expand() {
      this.isCollapse = !this.isCollapse;
    },
    //隐藏二三级菜单
    sideExpand() {
      if (!this.sideNavCollapse) {
        this.$refs.sideNav.style.width = "0px";
        this.$refs.sideIcon.style.right = "-16px";
        this.$refs.sideNav.style.color = "#fff";
        // this.$refs.sideNavItem.style.display = "none";
      } else {
        this.$refs.sideNav.style.width = "150px";
        this.$refs.sideIcon.style.right = "-150px";
        this.$refs.sideNav.style.color = "#222";
      }
      this.sideNavCollapse = !this.sideNavCollapse;
    },
    //选择一级菜单
    selectFirstMenu(item) {
      window.sessionStorage.setItem("rightNav", JSON.stringify(item));
      this.rightSideNav = item;
      this.firstNavId = item.id.toString();
      this.thirdNavId = item.url;
      this.$router.push(item.url);
      //存储父级菜单锚点
      window.sessionStorage.setItem("firstNavId", this.firstNavId);
      //默认选择子菜单第一个
      if (item.child.length > 0) {
        this.thirdNavId = this.$route.path; //item.child[0].id.toString();
        window.sessionStorage.setItem("thirdNavId", this.thirdNavId);
      }
    },
    //选择三级菜单
    selectMenuItem(item) {
      this.thirdNavId = item.url; //id.toString();
      this.$router.push(item.url);
      window.sessionStorage.setItem("thirdNavId", this.thirdNavId);
    },
  },
};
</script>
<style scoped>
.el-menu {
  border: none;
}
.el-menu-item {
  padding: 0 40px;
}
.index-contanier {
  display: flex;
}
.nav-box {
  height: 100vh;
  background: #212121;
  position: relative;
  display: flex;
  flex-direction: column;
}
.version {
  position: absolute;
  bottom: 10px;
  text-align: center;
  color: #666;
  margin: 0 auto;
  left: 0;
  right: 0;
  font-size: 12px;
}
.expand,
.side-expand {
  width: 16px;
  height: 24px;
  background: #3a3b43;
  box-shadow: 0 1px 3px 0 rgba(23, 23, 26, 0.1);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  right: 0;
  color: #fff;
  transition: 0.2s;
  z-index: 999;
}
.side-expand {
  top: 0px;
  right: -150px;
  background: #fff;
  color: #999;
  z-index: 999;
  box-shadow: 0 1px 3px 0 rgba(23, 23, 26, 0.1);
}
.expand:hover {
  right: 8px;
}
.side-expand:hover {
  right: -140px;
}
.nav-logo {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  height: 60px;
  background: #337eff;
}
.logo {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 31px;
  background: url("../assets/logo.png") no-repeat;
  background-position: 0;
  background-size: contain;
}
.menu {
  flex: 1;
}
.menu-item-on {
  border-right: 3px #4d70ff solid;
  z-index: 999;
  color: #fff !important;
  background: #000 !important;
}
.menu-item-on i {
  color: #fff;
}
/*二，三菜单*/
.second-nav {
  display: flex;
  padding-left: 20px;
  font-size: 14px;
  color: #333;
  letter-spacing: 0;
  height: 50px;
  line-height: 50px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
}
.arrow {
  position: absolute;
  right: 10px;
  line-height: 50px;
  font-size: 18px;
  font-weight: 800;
}
.third-nav-on,
.third-nav-off {
  padding-left: 48px;
  line-height: 35px;
  height: 35px;
  font-size: 14px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.third-nav-on {
  color: #337eff;
  border-right: 3px solid #337eff;
  background: #edeef0;
}
.side-bar-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: #222;
  padding: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.nav-item-on,
.nav-item-off {
  padding: 15px 20px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;
}
.nav-item-on {
  color: #337eff;
  border-right: 3px solid #337eff;
  background: #edeef0;
}
/*右侧内容*/
.contanier {
  flex: 1;
  position: relative;
}
/*头部*/
.header {
  height: 60px;
  box-sizing: border-box;
  border-bottom: 1px solid #e1e3e6;
  display: flex;
}
.content {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.content-inside {
  flex: 1;
}
.content-box {
  display: flex;
  width: 100%;
  height: 100%;
}
.side-nav {
  width: 150px;
  background: #f7f8fa;
  border-right: 1px solid #e9e9e9;
  position: relative;
  overflow: hidden;
}
.content-router {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.router-view {
  flex: 1;
  position: absolute;
  overflow-y: scroll;
  overflow: scroll;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
}
</style>
