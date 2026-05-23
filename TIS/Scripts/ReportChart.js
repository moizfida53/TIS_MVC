var Year = [];
$(document).ready(function () {
    // prepare chart data as an array
    var sampleData = [
        { Day: 'Monday', Keith: 30, Erica: 15, George: 25 },
        { Day: 'Tuesday', Keith: 25, Erica: 25, George: 30 },
        { Day: 'Wednesday', Keith: 30, Erica: 20, George: 25 },
        { Day: 'Thursday', Keith: 35, Erica: 25, George: 45 },
        { Day: 'Friday', Keith: 20, Erica: 20, George: 25 },
        { Day: 'Saturday', Keith: 30, Erica: 20, George: 30 },
        { Day: 'Sunday', Keith: 60, Erica: 45, George: 90 }
    ];
    // prepare jqxChart settings
    var settings = {
        title: "Fitness & exercise weekly scorecard",
        description: "Time spent in vigorous exercise",
        enableAnimations: true,
        showLegend: true,
        padding: { left: 5, top: 5, right: 5, bottom: 5 },
        titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
        source: sampleData,
        xAxis:
        {
            dataField: 'Day',
            gridLines: { visible: true }
        },
        colorScheme: 'scheme01',
        seriesGroups:
            [
                {
                    type: 'column',
                    columnsGapPercent: 50,
                    seriesGapPercent: 0,
                    valueAxis:
                    {
                        visible: true,
                        unitInterval: 10,
                        minValue: 0,
                        maxValue: 100,
                        title: { text: 'Time in minutes' }
                    },
                    series: [
                        { dataField: 'Keith', displayText: 'Keith' },
                        { dataField: 'Erica', displayText: 'Erica' },
                        { dataField: 'George', displayText: 'George' }
                    ]
                }
            ]
    };
    // setup the chart
    $('#jqxChart').jqxChart(settings);
    var adapter = new $.jqx.dataAdapter({
        datafields: [
            { name: "Day", type: "string" },
            { name: "Keith", type: "number" },
            { name: "Erica", type: "number" },
            { name: "George", type: "number" }
        ],
        localdata: sampleData,
        datatype: 'array'
    });
    $("#jqxGrid").jqxGrid({
        width: 848,
        height: 232,
        filterable: true,
        showfilterrow: true,
        source: adapter,
        columnsresize: true,
        columns:
            [
                { text: "Day", width: '40%', datafield: "Day", filteritems: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], filtertype: "checkedlist" },
                { text: "Keith", width: '20%', datafield: "Keith" },
                { text: "Erica", width: '20%', datafield: "Erica" },
                { text: "George", width: '20%', datafield: "George" }
            ]
    });
    $("#jqxGrid").on('filter', function () {
        var rows = $("#jqxGrid").jqxGrid('getrows');
        var chart = $('#jqxChart').jqxChart('getInstance');
        chart.source = rows;
        chart.update();
    });
});