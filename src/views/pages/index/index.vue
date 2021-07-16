<template>
    <el-main>
        <img class="background" src="../../../assets/index.png" alt />
    </el-main>
</template>
 
<script>
/*eslint-disable */
import Column from "../../../components/Column";
import chinaMap from "../../../components/map";

export default {
    components: {
        Column,
        chinaMap
    },
    data() {
        return {
            time: 2,

            value: 30,
            echartObj: {},
            echartObj2: {},
            echartObj3: {},
            //实例对象
            fApi: {},
            //表单生成规则
            rule: [
                {
                    type: "input",
                    field: "goods_name",
                    title: "商品名称"
                },
                {
                    type: "datePicker",
                    field: "created_at",
                    title: "创建时间"
                }
            ]
        };
    },
    methods: {
        numberGrow(ele) {
            let _this = this;
            let step = (_this.value * 10) / (_this.time * 10);
            let current = 0;
            let start = 0;
            let t = setInterval(function() {
                start += step;
                if (start > _this.value) {
                    clearInterval(t);
                    start = _this.value;
                    t = null;
                }
                if (current === start) {
                    return;
                }
                current = start;
                ele.innerHTML = current
                    .toString()
                    .replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, "$1,");
            }, 1000);
        }
    },
    created() {},
    mounted() {
        // this.numberGrow(this.$refs.numberGrow);
    }
};
</script>
 
<style scoped>
.single {
    width: 10px;
    height: 20px;
    background: red;
    position: relative;
    transform: skew(-20deg);
}
.background {
    width: 100%;
}
</style>