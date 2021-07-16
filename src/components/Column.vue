<template>
    <div class="echarts">
        <div ref="chart" id="echart"></div>
    </div>
</template>
 
<script>
export default {
    /*eslint-disable*/
    data() {
        return {};
    },
    props: {
        //接受父组件传递来的数据
        echartObj: {
            // type: Object,
            default() {
                //默认数据，没有数剧的情况下启用
            }
        }
    },
    created() {
        this.$nextTick(() => {
            this.loadEchart();
        });
    },
    mounted() {},
    methods: {
        loadEchart() {
            this.myChart = this.$echarts.init(this.$refs.chart);
            this.myChart.setOption({
                // title: {
                //     text: "222"
                // },
                tooltip: {},
                xAxis: {
                    data: this.echartObj.xAxis.data
                },
                yAxis: {},
                series: this.echartObj.series
            });
        }
    }
};
</script>
 
<style>
#echart {
    width: 50%;
    height: 300px;
}
</style>