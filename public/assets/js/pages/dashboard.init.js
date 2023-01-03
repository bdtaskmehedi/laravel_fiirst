
(function () {
    var __webpack_exports__ = {};

    // get colors array from the string
    function getChartColorsArray(chartId) {
        if (document.getElementById(chartId) !== null) {
            var colors = document.getElementById(chartId).getAttribute("data-colors");

            if (colors) {
                colors = JSON.parse(colors);
                return colors.map(function (value) {
                    var newValue = value.replace(" ", "");

                    if (newValue.indexOf(",") === -1) {
                        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);

                        if (color) {
                            color = color.replace(" ", "");
                            return color;
                        } else return newValue;

                    } else {
                        var val = value.split(',');
                        if (val.length == 2) {
                            var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                            rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                            return rgbaColor;
                        } else {
                            return newValue;
                        }
                    }
                });
            }
        }
    } //  subscribe modal


    // stacked column chart
    var linechartBasicColors = getChartColorsArray("stacked-column-chart");

    if (linechartBasicColors) {

        var options = {
            chart: {
                height: 285, type: 'bar', stacked: true, toolbar: {
                    show: false
                }, zoom: {
                    enabled: true
                }
            }, plotOptions: {
                bar: {
                    horizontal: false, columnWidth: '40%',
                }
            }, dataLabels: {
                enabled: false
            }, series: [{
                name: 'Earned Points', data: monthlyPoints
            }], xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            }, colors: linechartBasicColors, legend: {
                position: 'bottom'
            }, fill: {
                opacity: 1
            }
        };

        console.log(ApexCharts)

        var barChart = new ApexCharts(document.querySelector("#stacked-column-chart"), options);
        barChart.render();
    } // Radial chart


    var radialbarColors = getChartColorsArray("radialBar-chart");

    if (radialbarColors) {
        var options = {
            chart: {
                height: 200, type: 'radialBar', offsetY: -10
            }, plotOptions: {
                radialBar: {
                    startAngle: -135, endAngle: 135, dataLabels: {
                        name: {
                            fontSize: '13px', color: undefined, offsetY: 60
                        }, value: {
                            offsetY: 22, fontSize: '16px', color: undefined, formatter: function formatter(val) {
                                return val + "%";
                            }
                        }
                    }
                }
            }, colors: radialbarColors, fill: {
                type: 'gradient', gradient: {
                    shade: 'dark',
                    shadeIntensity: 0.15,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 65, 91]
                }
            }, stroke: {
                dashArray: 4
            }, series: [pointProgress], labels: ['']
        };
        var chart = new ApexCharts(document.querySelector("#radialBar-chart"), options);
        chart.render();
    }
})();
