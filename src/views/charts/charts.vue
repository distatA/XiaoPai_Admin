<template>
    <div>
        <div class="charts" ref="chart" id="id"></div>
    </div>
</template>
<script>
/* eslint-disable*/
// import Echarts from "echarts/lib/echarts";
export default {
    data() {
        return {
            echartsData: {},
            id: {},
            data: [12, 321, 3213, 21321, 14, 32, 435]
        };
    },
    created() {},
    methods: {
        initWebsocket() {
            const wsurl = "wss://kf.schoolpi.net";
            this.websock = new WebSocket(wsurl);
            this.websock.onopen = this.websocketopen;
            this.websock.onmessage = this.websocketonmessage;
            this.websock.onclose = this.websocketclose;
            this.websock.onerror = this.websocketerror;
        },
        //连接成功后
        websocketopen() {},
        //向webscoket发送信息
        websocketsend() {},
        //监听websocket返回的信息
        websocketonmessage() {},
        //关闭websocket
        websocketclose() {},
        //连接出错
        websocketerror() {},
        randomData() {
            let num = Math.floor(Math.random() * 10 + 1);
            // let arr = []
            return num;
            // console.log("=====>", Math.floor(Math.random() * 10 + 1));
        },

        loadEcharts() {
            console.log("2");
            var that = this;
            that.myChart = that.$echarts.init(that.$refs.chart);
            that.myChart.setOption({
                xAxis: {
                    type: "category",
                    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                },
                tooltip: {
                    trigger: "axis",
                    formatter: function(params) {
                        console.log(params);
                    },
                    axisPointer: {
                        animation: false
                    }
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        data: this.data,
                        type: "line"
                    }
                ]
            });
        }
    },
    mounted() {
        var that = this;
        this.loadEcharts();
        // setInterval(function() {
        //     let a = Math.floor(Math.random() * 1000 + 1);
        //     that.data.shift();
        //     that.data.push(a);
        //     that.myChart.setOption({
        //         series: [
        //             {
        //                 data: that.data
        //             }
        //         ]
        //     });
        // }, 1000);
    }
};
</script>
<style scoped>
.charts {
    width: 100vw;
    height: 70vh;
}
</style>