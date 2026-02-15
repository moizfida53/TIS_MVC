var year;
var Tname;
var monthno;
var Yearwisesale;
var selectedmonthforgrid;
//var getyeartostoreinarray;
var INTCNTstringtoarray = [];
var INTCNTarray = [];
var calltypedataaraay = [];
var displayALLcalltype = 'All';
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
var currentYear = 2026;
$(document).ready(function () {
    debugger;
    //if ($('#MainContent_hdnAccessValid').val() == "1") {
        $(document).ajaxStart($.blockUI({
            css: {
                border: 'none',
                padding: '10px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .3,
                color: '#fff'
            }
        })).ajaxStop($.unblockUI);

        //GetData(FromDate, ToDate);
        // $('#ddrYears').val("2019");
        // GetData();

        Getcalltypedatainarray(currentYear)

        GetINTCNTinarray(currentYear, displayALLcalltype)
        gettransactiontype();
        // ddbranch();
        yeardropdown();
        getcountryingrid(currentYear);
        function getExportServer() {
            return './export_server/export.php';
        }
        $("#pdfButtonTopBranchSalesChart").click(function () {
            // call the export server to create a PNG image
            $('#TopBranchSalesChart').jqxChart('saveAsPDF', 'monthwiseforselectedyearchrt.pdf', getExportServer());
        });


        $("#pdfButtonMonthwisetypebill").click(function () {
            // call the export server to create a PNG image
            $('#Monthwisetypebill').jqxChart('saveAsPDF', 'selectedmonthtranstype.pdf', getExportServer());
        });


        $("#pdfButtonTopBranchSalesChart2").click(function () {
            // call the export server to create a PNG image
            $('#TopBranchSalesChart2').jqxChart('saveAsPDF', 'selectedtranstypechart.pdf', getExportServer());
        });

        $("#pdfButtonCallTypeamountchart").click(function () {
            // call the export server to create a PNG image
            $('#CallTypeamountchart').jqxChart('saveAsPDF', 'calltypeamountchart.pdf', getExportServer());
        });

        $("#pdfButtonmonthwisecalltypeamount").click(function () {
            // call the export server to create a PNG image
            $('#monthwisecalltypeamount').jqxChart('saveAsPDF', 'monthwisecalltypeamount.pdf', getExportServer());
        });



        $("#pdfButtonINTCOUNTchart").click(function () {
            // call the export server to create a PNG image
            $('#INTCOUNTchart').jqxChart('saveAsPDF', 'INTCNTRYchart.pdf', getExportServer());
        });

        $("#pdfButtonmonthwisecountrybill").click(function () {
            // call the export server to create a PNG image
            $('#monthwisecountrybill').jqxChart('saveAsPDF', 'Countrymonthwisebillchart.pdf', getExportServer());
        });


        $("#pdfButtonjqxgridtest").click(function () {
            $("#jqxgridtest").jqxGrid('exportdata', 'xls', 'jqxGrid');
        });
    //}
    //else {
    //    //Access Denied
    //}
    
});
//function GetData(FromDate, ToDate) {
function GetData() {

    $.ajax({
        type: "GET",
        cache: false,
        data: {
            //FromDate: $('#FromDate').val(),
            //ToDate: $('#ToDate').val()
            //Year: $('#ddrYears').val(),
            //TRANS_TYPE: transactiontype,
        },
        url: "/Dashboard/GetDashboardData",
        success: function (result) {
            debugger
            if (result.Message == "Success") {
                //$('#divAllBranchTotalSales').html(result.noOfUnIdentifiedBills + " <small>KD</small>")
                $('#divAllBranchTotalSales').html(result.noOfUnIdentifiedBills)
                $('#divAllBranchTotalWaste').html(result.totalAmountofUnAssignedBills + " <small>KD</small>")
                $('#divAllBranchTotalCancellation').html(result.totalBillsinApprovalStage)
                $('#divAllBranchTotalDiscount').html(result.totalBillAmountforPOSTTOSAP + " <small>KD</small>")

                BindCharts(result);
            }

        }
    });
}

function BindCharts(resultData) {
    BindTopBranches(resultData.dashboardChart1);
    BindChart2Transtypewise(resultData.dashboardChart2);
    bindchart4calltypebillamount(resultData.dashboardChart3);
    bindchart6INTCNTchart(resultData.dashboardChart4)
}

function getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

function getMin(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
        if (max == null || parseInt(arr[i][prop]) < parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

function monthwise(e) {
    $("#chart1").hide();
    //$(document).ajaxStart(function () {
    //    $("#waitchart2").css("display", "block");
    //    $("#waitchart3").css("display", "none");
    //    $("#waitchart6").css("display", "none");
    //    $("#waitchart7").css("display", "none");
    //    $("#wait").css("display", "none");
    //});
    $(document).ajaxStart($.blockUI({
        css: {
            border: 'none',
            padding: '10px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .3,
            color: '#fff'
        }
    })).ajaxStop($.unblockUI);
    var selectedyear;
    if ($('#jqxyeardd').val() == "") {
        //alert("year not selected")
        //return;
        var selectedyear = currentYear;
    }
    else {
        selectedyear = $('#jqxyeardd').val();
    }
    console.log(e);

    monthno = e.elementIndex;
    //var eventData = '<div><b>Last Event: </b>' + e.event + '<b>, DataField: </b>' + e.serie.dataField + '<b>, Value: </b>' + e.elementValue + "</div>";
    //$('#eventText').html(eventData);
    //alert(eventData);
    monthname(monthno);
    monthno = monthno + 1;

    //var selectedyear = $('#jqxyeardd').val()


    gettpedetailfromonth(monthno, selectedyear)
    console.log(monthno);
    console.log(selectedyear);

    //$("#chart1").hide();
    //$(document).ajaxComplete(function () {
    //    $("#waitchart2").css("display", "none");
    //});

    $("#chart2").show();


    //$('#myModal').modal('show');
    //document.getElementById('yearwisebillchart').innerHTML = document.getElementById('monthwisetypebillchart').innerHTML;
}

function goback() {

    $("#chart2").hide();
    $("#chart1").show();
}

function monthname(monthno) {
    for (i = 0; i < monthNames.length; i++) {
        if (monthno == i) {
            //alert(monthNames[i])
            document.getElementById('monthname').innerHTML = monthNames[i];
        }

    }

}

function gettpedetailfromonth(month, year) {
    $.ajax({
        type: "GET",
        cache: false,
        data: {
            Month: month,
            Year: year,
            //TRANS_TYPE: transactiontype,
        },
        url: "/Dashboard/GetDashboardchart3data",
        success: function (result) {
            debugger
            if (result.Message == "Success") {
                console.log(result)
                // BindCharts(result);
                //BindTopBranches(result.TopBranchSales);
                BindChart3MonthlyTranstypewiseamount(result.monthTranstypewiseData)
            }

        }
    });

}

function ajaxstart() {
    $(document).ajaxStart(function () {
        $("#wait").css("display", "block");
    });

}

function ajaxstop() {
    $(document).ajaxComplete(function () {
        $("#wait").css("display", "none");
    });
}

function BindTopBranches(JsonData) {
    $("#wait").css("display", "block");
    debugger;
    var data = JSON.parse(JsonData);
    if (data.length == 0) {
        $('#TopBranchSalesChart').html("");
        return false;
    }
    var maxval = getMax(data, "amount");
    var Minval = getMin(data, "amount");
    var dataAdapter = new $.jqx.dataAdapter(data, {
        contentType: 'application/json; charset=utf-8',
        async: false,
        autoBind: true,
        loadError: function (xhr, status, error) {
            alert('loading "' + source.url + '" : ' + error);
        }
    });
    var TableT = {
        dataType: "json",
        //cache: false,
        dataFields: [{
            name: 'MonthName',
            type: 'string'
        },
        {
            name: 'amount',
            type: 'number'
        }
        ],
        //id: "StoreID",
        localdata: data,
        //sortcolumn: 'ITEM_NAME',
    };
    var dataAdapterTable = new $.jqx.dataAdapter(TableT);
    debugger;

    // prepare jqxChart settings
    var settings = {
        title: "Month Wise Bill Amount",
        description: "",

        enableAnimations: true,
        showLegend: false,
        padding: {
            left: 2,
            top: 2,
            right: 2,
            bottom: 2
        },
        titlePadding: {
            left: 5,
            top: 5,
            right: 0,
            bottom: 2
        },
        source: dataAdapterTable,
        colorScheme: 'scheme05',

        xAxis: {
            //dataField: 'Day',
            dataField: 'MonthName',
            unitInterval: 1,
            tickMarks: {
                visible: true,
                interval: 1
            },
            gridLinesInterval: {
                visible: true,
                interval: 1
            },
            valuesOnTicks: false,
            padding: {
                bottom: 2
            },
            gridLinesColor: 'white',
            textRotationAngle: 90
        },
        valueAxis: {
            flip: true,
            unitInterval: 3000,
            minValue: Minval,
            maxValue: maxval,
            axisSize: 'auto',
            gridLinesColor: 'white',
            visible: false,
            //  title: { text: 'Time in minutes<br><br>' },
            //labels: { horizontalAlignment: 'left' }
            //labels: { horizontalAlignment: 'left' }
        },
        seriesGroups: [{
            type: 'column',
            click: monthwise,
            //orientation: 'vertical',
            orientation: 'horizontal',
            series: [{
                //dataField: 'Swimming',
                dataField: 'amount',
                symbolType: 'square',
                color: '#66bb6a',
                labels: {
                    visible: true,
                    backgroundColor: '#FEFEFE',
                    backgroundOpacity: 0.2,
                    borderColor: '#7FC4EF',
                    borderOpacity: 0.7,
                    padding: {
                        left: 2,
                        right: 2,
                        top: 0,
                        bottom: 0
                    },

                }
            },]
        }]
    };
    // setup the chart
    $('#TopBranchSalesChart').jqxChart(settings);
    $("#wait").css("display", "none");

}



function BindChart2Transtypewise(JsonData) {
    debugger;
    $("#waitchart3").css("display", "block");
    var data = JSON.parse(JsonData);
    if (data.length == 0) {
        $('#TopBranchSalesChart2').html("");
        return false;
    }
    var maxval = getMax(data, "amount");
    var Minval = getMin(data, "amount");
    var dataAdapter = new $.jqx.dataAdapter(data, {
        contentType: 'application/json; charset=utf-8',
        async: false,
        autoBind: true,
        loadError: function (xhr, status, error) {
            alert('loading "' + source.url + '" : ' + error);
        }
    });
    var TableT = {
        dataType: "json",
        //cache: false,
        dataFields: [{
            name: 'MonthName',
            type: 'string'
        },
        {
            name: 'amount',
            type: 'number'
        }
        ],
        //id: "StoreID",
        localdata: data,
        //sortcolumn: 'ITEM_NAME',
    };
    var dataAdapterTable = new $.jqx.dataAdapter(TableT);
    debugger;

    // prepare jqxChart settings
    var settings = {
        title: "Month Wise Bill Amount",
        description: "",
        enableAnimations: true,
        showLegend: false,
        padding: {
            left: 2,
            top: 2,
            right: 2,
            bottom: 2
        },
        titlePadding: {
            left: 5,
            top: 5,
            right: 0,
            bottom: 2
        },
        source: dataAdapterTable,
        colorScheme: 'scheme05',

        xAxis: {
            //dataField: 'Day',
            dataField: 'MonthName',
            unitInterval: 1,
            tickMarks: {
                visible: true,
                interval: 1
            },
            gridLinesInterval: {
                visible: true,
                interval: 1
            },
            valuesOnTicks: false,
            padding: {
                bottom: 2
            },
            gridLinesColor: 'white',
            textRotationAngle: 90
        },
        valueAxis: {
            flip: true,
            unitInterval: 3000,
            minValue: Minval,
            maxValue: maxval,
            axisSize: 'auto',
            gridLinesColor: 'white',
            visible: false,
            //  title: { text: 'Time in minutes<br><br>' },
            //labels: { horizontalAlignment: 'left' }
            //labels: { horizontalAlignment: 'left' }
        },
        seriesGroups: [{
            type: 'column',
            //orientation: 'vertical',
            orientation: 'horizontal',
            series: [{
                //dataField: 'Swimming',
                dataField: 'amount',
                symbolType: 'square',
                color: '#66bb6a',
                labels: {
                    visible: true,
                    backgroundColor: '#FEFEFE',
                    backgroundOpacity: 0.2,
                    borderColor: '#7FC4EF',
                    borderOpacity: 0.7,
                    padding: {
                        left: 2,
                        right: 2,
                        top: 0,
                        bottom: 0
                    },

                }
            },]
        }]
    };
    // setup the chart
    $('#TopBranchSalesChart2').jqxChart(settings);
    $("#waitchart3").css("display", "none");
}

function BindChart3MonthlyTranstypewiseamount(JsonData) {
    $("#waitchart2").css("display", "block");
    debugger;
    var data = JSON.parse(JsonData);
    if (data.length == 0) {
        $('#Monthwisetypebill').html("");
        return false;
    }
    var maxval = getMax(data, "monthlytypesamount");
    var Minval = getMin(data, "monthlytypesamount");
    var dataAdapter = new $.jqx.dataAdapter(data, {
        contentType: 'application/json; charset=utf-8',
        async: false,
        autoBind: true,
        loadError: function (xhr, status, error) {
            alert('loading "' + source.url + '" : ' + error);
        }
    });
    var TableT = {
        dataType: "json",
        //cache: false,
        dataFields: [{
            name: 'TRANS_TYPE',
            type: 'string'
        },
        {
            name: 'monthlytypesamount',
            type: 'number'
        }
        ],
        //id: "StoreID",
        localdata: data,
        //sortcolumn: 'ITEM_NAME',
    };
    var dataAdapterTable = new $.jqx.dataAdapter(TableT);
    debugger;

    // prepare jqxChart settings
    var settings = {
        title: "Month Wise Bill Amount",
        description: "",
        enableAnimations: true,
        showLegend: false,
        padding: {
            left: 2,
            top: 2,
            right: 2,
            bottom: 2
        },
        titlePadding: {
            left: 5,
            top: 5,
            right: 0,
            bottom: 2
        },
        source: dataAdapterTable,
        colorScheme: 'scheme05',

        xAxis: {
            //dataField: 'Day',
            dataField: 'TRANS_TYPE',
            unitInterval: 1,
            tickMarks: {
                visible: true,
                interval: 1
            },
            gridLinesInterval: {
                visible: true,
                interval: 1
            },
            valuesOnTicks: false,
            padding: {
                bottom: 2
            },
            gridLinesColor: 'white',
            textRotationAngle: 90
        },
        valueAxis: {
            flip: true,
            unitInterval: 50,
            minValue: Minval,
            maxValue: maxval,
            axisSize: 'auto',
            gridLinesColor: 'white',
            visible: false,
            //  title: { text: 'Time in minutes<br><br>' },
            //labels: { horizontalAlignment: 'left' }
            //labels: { horizontalAlignment: 'left' }
        },
        seriesGroups: [{
            type: 'column',
            //orientation: 'vertical',
            orientation: 'horizontal',
            series: [{
                //dataField: 'Swimming',
                dataField: 'monthlytypesamount',
                symbolType: 'square',
                color: '#66bb6a',
                labels: {
                    visible: true,
                    backgroundColor: '#FEFEFE',
                    backgroundOpacity: 0.2,
                    borderColor: '#7FC4EF',
                    borderOpacity: 0.7,
                    padding: {
                        left: 2,
                        right: 2,
                        top: 0,
                        bottom: 0
                    },

                }
            },]
        }]
    };
    // setup the chart
    $('#Monthwisetypebill').jqxChart(settings);
    $("#waitchart2").css("display", "none");

}

function bindchart4calltypebillamount(JsonData) {
    $("#waitchart4").css("display", "block");
    debugger;
    var data = JSON.parse(JsonData);
    if (data.length == 0) {
        $('#CallTypeamountchart').html("");
        return false;
    }
    var maxval = getMax(data, "Call_amount");
    var Minval = getMin(data, "Call_amount");
    var dataAdapter = new $.jqx.dataAdapter(data, {
        contentType: 'application/json; charset=utf-8',
        async: false,
        autoBind: true,
        loadError: function (xhr, status, error) {
            alert('loading "' + source.url + '" : ' + error);
        }
    });
    var TableT = {
        dataType: "json",
        //cache: false,
        dataFields: [{
            name: 'Call_type',
            type: 'string'
        },
        {
            name: 'Call_amount',
            type: 'number'
        }
        ],
        //id: "StoreID",
        localdata: data,
        //sortcolumn: 'ITEM_NAME',
    };
    var dataAdapterTable = new $.jqx.dataAdapter(TableT);
    debugger;

    // prepare jqxChart settings
    var settings = {
        title: "Call type Bill Amount",
        description: "",

        enableAnimations: true,
        showLegend: false,
        padding: {
            left: 2,
            top: 2,
            right: 2,
            bottom: 2
        },
        titlePadding: {
            left: 5,
            top: 5,
            right: 0,
            bottom: 2
        },
        source: dataAdapterTable,
        colorScheme: 'scheme05',

        xAxis: {
            //dataField: 'Day',

            dataField: 'Call_type',
            unitInterval: 1,
            tickMarks: {
                visible: true,
                interval: 1
            },
            labels: {
                enabled: true,
                formatter: function () { return TableT[this.value][0]; },
            },
            gridLinesInterval: {
                visible: true,
                interval: 1
            },
            valuesOnTicks: false,
            padding: {
                bottom: 2
            },
            gridLinesColor: 'white',
            textRotationAngle: 90
        },
        valueAxis: {
            flip: true,
            unitInterval: 3000,
            minValue: Minval,
            maxValue: maxval,
            axisSize: 'auto',
            gridLinesColor: 'white',
            visible: false,
            //  title: { text: 'Time in minutes<br><br>' },
            //labels: { horizontalAlignment: 'left' }
            //labels: { horizontalAlignment: 'left' }
        },
        seriesGroups: [{
            type: 'column',
            click: monthwisecalltype,
            //orientation: 'vertical',
            orientation: 'horizontal',
            series: [{
                //dataField: 'Swimming',
                dataField: 'Call_amount',
                symbolType: 'square',
                color: '#66bb6a',
                labels: {
                    visible: true,
                    backgroundColor: '#FEFEFE',
                    backgroundOpacity: 0.2,
                    borderColor: '#7FC4EF',
                    borderOpacity: 0.7,
                    padding: {
                        left: 2,
                        right: 2,
                        top: 0,
                        bottom: 0
                    },

                }
            },]
        }]
    };
    // setup the chart
    $('#CallTypeamountchart').jqxChart(settings);
    $("#waitchart4").css("display", "none");
}

function bindchart5calltypebillamountmonthwise(JsonData) {
    $("#waitchart5").css("display", "block");
    debugger;
    var data = JSON.parse(JsonData);
    if (data.length == 0) {
        $('#monthwisecalltypeamount').html("");
        return false;
    }
    var maxval = getMax(data, "amount");
    var Minval = getMin(data, "amount");
    var dataAdapter = new $.jqx.dataAdapter(data, {
        contentType: 'application/json; charset=utf-8',
        async: false,
        autoBind: true,
        loadError: function (xhr, status, error) {
            alert('loading "' + source.url + '" : ' + error);
        }
    });
    var TableT = {
        dataType: "json",
        //cache: false,
        dataFields: [{
            name: 'MonthName',
            type: 'string'
        },
        {
            name: 'amount',
            type: 'number'
        }
        ],
        //id: "StoreID",
        localdata: data,
        //sortcolumn: 'ITEM_NAME',
    };
    var dataAdapterTable = new $.jqx.dataAdapter(TableT);
    debugger;

    // prepare jqxChart settings
    var settings = {
        title: "Call type Bill Amount month wise",
        description: "",

        enableAnimations: true,
        showLegend: false,
        padding: {
            left: 2,
            top: 2,
            right: 2,
            bottom: 2
        },
        titlePadding: {
            left: 5,
            top: 5,
            right: 0,
            bottom: 2
        },
        source: dataAdapterTable,
        colorScheme: 'scheme05',

        xAxis: {
            //dataField: 'Day',

            dataField: 'MonthName',
            unitInterval: 1,
            tickMarks: {
                visible: true,
                interval: 1
            },
            labels: {
                enabled: true,
                formatter: function () { return TableT[this.value][0]; },
            },
            gridLinesInterval: {
                visible: true,
                interval: 1
            },
            valuesOnTicks: false,
            padding: {
                bottom: 2
            },
            gridLinesColor: 'white',
            textRotationAngle: 90
        },
        valueAxis: {
            flip: true,
            unitInterval: 3000,
            minValue: Minval,
            maxValue: maxval,
            axisSize: 'auto',
            gridLinesColor: 'white',
            visible: false,
            //  title: { text: 'Time in minutes<br><br>' },
            //labels: { horizontalAlignment: 'left' }
            //labels: { horizontalAlignment: 'left' }
        },
        seriesGroups: [{
            type: 'column',
            // click: monthwisecalltype,
            //orientation: 'vertical',
            orientation: 'horizontal',
            series: [{
                //dataField: 'Swimming',
                dataField: 'amount',
                symbolType: 'square',
                color: '#66bb6a',
                labels: {
                    visible: true,
                    backgroundColor: '#FEFEFE',
                    backgroundOpacity: 0.2,
                    borderColor: '#7FC4EF',
                    borderOpacity: 0.7,
                    padding: {
                        left: 2,
                        right: 2,
                        top: 0,
                        bottom: 0
                    },

                }
            },]
        }]
    };
    // setup the chart
    $('#monthwisecalltypeamount').jqxChart(settings);
    $("#waitchart5").css("display", "none");
}


function bindchart6INTCNTchart(JsonData) {
    $("#waitchart6").css("display", "block");
    debugger;
    var data = JSON.parse(JsonData);
    if (data.length == 0) {
        $('#INTCOUNTchart').html("");
        return false;
    }
    var maxval = getMax(data, "Countrywisesum");
    var Minval = getMin(data, "Countrywisesum");
    var dataAdapter = new $.jqx.dataAdapter(data, {
        contentType: 'application/json; charset=utf-8',
        async: false,
        autoBind: true,
        loadError: function (xhr, status, error) {
            alert('loading "' + source.url + '" : ' + error);
        }
    });
    var TableT = {
        dataType: "json",
        //cache: false,
        dataFields: [{
            name: 'OUT_COUNTRY',
            type: 'string'
        },
        {
            name: 'Countrywisesum',
            type: 'number'
        }
        ],
        //id: "StoreID",
        localdata: data,
        //sortcolumn: 'ITEM_NAME',
    };
    var dataAdapterTable = new $.jqx.dataAdapter(TableT);
    debugger;

    // prepare jqxChart settings
    var settings = {
        title: "Top 10 internationational Call Type",
        description: "",

        enableAnimations: true,
        showLegend: false,
        padding: {
            left: 2,
            top: 2,
            right: 2,
            bottom: 2
        },
        titlePadding: {
            left: 5,
            top: 5,
            right: 0,
            bottom: 2
        },
        source: dataAdapterTable,
        colorScheme: 'scheme05',

        xAxis: {
            //dataField: 'Day',

            dataField: 'OUT_COUNTRY',
            unitInterval: 1,
            tickMarks: {
                visible: true,
                interval: 1
            },
            labels: {
                enabled: true,
                formatter: function () { return TableT[this.value][0]; },
                //click: CountrywiseLabelClick
            },
            gridLinesInterval: {
                visible: true,
                interval: 1
            },
            valuesOnTicks: false,
            padding: {
                bottom: 2
            },
            gridLinesColor: 'white',
            textRotationAngle: 90
        },
        valueAxis: {
            flip: true,
            unitInterval: 1,
            minValue: Minval,
            maxValue: maxval,
            axisSize: 'auto',
            gridLinesColor: 'white',
            visible: false,
            //  title: { text: 'Time in minutes<br><br>' },
            //labels: { horizontalAlignment: 'left' }
            //labels: { horizontalAlignment: 'left' }
        },
        seriesGroups: [{
            type: 'column',
            click: Countrywisecount,
            //orientation: 'vertical',
            orientation: 'horizontal',
            series: [{
                //dataField: 'Swimming',
                dataField: 'Countrywisesum',
                symbolType: 'square',
                color: '#66bb6a',
                labels: {
                    visible: true,
                    backgroundColor: '#FEFEFE',
                    backgroundOpacity: 0.2,
                    borderColor: '#7FC4EF',
                    borderOpacity: 0.7,
                    padding: {
                        left: 2,
                        right: 2,
                        top: 0,
                        bottom: 0
                    },

                }
            },]
        }]
    };
    // setup the chart
    $('#INTCOUNTchart').jqxChart(settings);
    $("#waitchart6").css("display", "none");
}


function bindchart7INTCNTchartmonthwise(JsonData) {
    $("#waitchart7").css("display", "block");
    debugger;
    var data = JSON.parse(JsonData);
    if (data.length == 0) {
        $('#monthwisecountrybill').html("");
        return false;
    }
    var maxval = getMax(data, "amount");
    var Minval = getMin(data, "amount");
    var dataAdapter = new $.jqx.dataAdapter(data, {
        contentType: 'application/json; charset=utf-8',
        async: false,
        autoBind: true,
        loadError: function (xhr, status, error) {
            alert('loading "' + source.url + '" : ' + error);
        }
    });
    var TableT = {
        dataType: "json",
        //cache: false,
        dataFields: [{
            name: 'MonthName',
            type: 'string'
        },
        {
            name: 'amount',
            type: 'number'
        }
        ],
        //id: "StoreID",
        localdata: data,
        //sortcolumn: 'ITEM_NAME',
    };
    var dataAdapterTable = new $.jqx.dataAdapter(TableT);
    debugger;

    // prepare jqxChart settings
    var settings = {
        title: "Month wise Call Type For selected country",
        description: "",

        enableAnimations: true,
        showLegend: false,
        padding: {
            left: 2,
            top: 2,
            right: 2,
            bottom: 2
        },
        titlePadding: {
            left: 5,
            top: 5,
            right: 0,
            bottom: 2
        },
        source: dataAdapterTable,
        colorScheme: 'scheme05',

        xAxis: {
            //dataField: 'Day',

            dataField: 'MonthName',
            unitInterval: 1,
            tickMarks: {
                visible: true,
                interval: 1
            },
            labels: {
                enabled: true,
                formatter: function () { return TableT[this.value][0]; },
            },
            gridLinesInterval: {
                visible: true,
                interval: 1
            },
            valuesOnTicks: false,
            padding: {
                bottom: 2
            },
            gridLinesColor: 'white',
            textRotationAngle: 90
        },
        valueAxis: {
            flip: true,
            unitInterval: 1,
            minValue: Minval,
            maxValue: maxval,
            axisSize: 'auto',
            gridLinesColor: 'white',
            visible: false,
            //  title: { text: 'Time in minutes<br><br>' },
            //labels: { horizontalAlignment: 'left' }
            //labels: { horizontalAlignment: 'left' }
        },
        seriesGroups: [{
            type: 'column',
            //click: Countrywisecount,
            //orientation: 'vertical',
            orientation: 'horizontal',
            series: [{
                //dataField: 'Swimming',
                dataField: 'amount',
                symbolType: 'square',
                color: '#66bb6a',
                labels: {
                    visible: true,
                    backgroundColor: '#FEFEFE',
                    backgroundOpacity: 0.2,
                    borderColor: '#7FC4EF',
                    borderOpacity: 0.7,
                    padding: {
                        left: 2,
                        right: 2,
                        top: 0,
                        bottom: 0
                    },

                }
            },]
        }]
    };
    // setup the chart
    $('#monthwisecountrybill').jqxChart(settings);
    $("#waitchart7").css("display", "none");
}





function monthwisecalltype(e) {
    $(document).ajaxStart(function () {
        $("#waitchart5").css("display", "block");
        $("#waitchart2").css("display", "none");
        $("#waitchart3").css("display", "none");
        $("#waitchart6").css("display", "none");
        $("#waitchart7").css("display", "none");
        $("#wait").css("display", "none");
    });
    $(document).ajaxStart($.blockUI({
        css: {
            border: 'none',
            padding: '10px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .3,
            color: '#fff'
        }
    })).ajaxStop($.unblockUI);
    var selectedyear;
    var calltypename;
    if ($('#jqxyearcalltypendd').val() == "") {
        //alert("year not selected")
        //return;
        selectedyear = currentYear;
        calltypename = "Local Calls";
    }
    else {
        selectedyear = $('#jqxyearcalltypendd').val();
    }

    console.log(e);
    var n = e.elementValue.toFixed(2);

    for (i = 0; i < calltypedataaraay.length; i++) {
        var ctamont = calltypedataaraay[i].Call_amount.toFixed(2);
        if (ctamont == n) {
            calltypename = calltypedataaraay[i].Call_type;

        }
    }
    console.log(calltypename);

    //var selectedyear = $('#jqxyearcalltypendd').val();
    getmonthwisecalltypeamount(calltypename, selectedyear);
    document.getElementById('calltypename').innerHTML = calltypename;
    $("#chart3").hide();
    $(document).ajaxComplete(function () {
        $("#waitchart5").css("display", "none");
    });
    $("#chart4").show();



}

function getmonthwisecalltypeamount(calltypename, year) {
    $.ajax({
        type: "GET",
        cache: false,
        data: {
            //FromDate: $('#FromDate').val(),
            //ToDate: $('#ToDate').val()
            Year: year,
            calltypename: calltypename,
        },
        url: "/Dashboard/GetDashboardchart5data",
        success: function (result) {
            debugger
            if (result.Message == "Success") {
                console.log(result)
                // BindCharts(result);
                //  BindChart2Transtypewise(result.TranstypewiseData)
                bindchart5calltypebillamountmonthwise(result.calltypemonthlysale);

            }

        }
    });
}

function goback1() {

    $("#chart4").hide();
    $("#chart3").show();
}

function GetyearswiseselectedData(year) {
    $.ajax({
        type: "GET",
        cache: false,
        data: {
            //FromDate: $('#FromDate').val(),
            //ToDate: $('#ToDate').val()
            Year: year,
            //TRANS_TYPE: transactiontype,
        },
        url: "/Dashboard/GetDashboardchart1data",
        success: function (result) {
            debugger
            if (result.Message == "Success") {
                console.log(result)
                // BindCharts(result);
                BindTopBranches(result.TopBranchSales);
                //var dataarray = $.parseJSON(result.TopBranchSales);
                //chart1injqxgrid(dataarray);


            }

        }
    });
}

function Getcalltypedata(year) {
    $.ajax({
        type: "GET",
        cache: false,
        data: {

            Year: year,

        },
        url: "/Dashboard/GetDashboardchart4data",
        success: function (result) {
            debugger
            if (result.Message == "Success") {
                console.log(result)

                bindchart4calltypebillamount(result.TopBranchSales);
            }

        }
    });
}




function Getcalltypedatainarray(year) {
    $.ajax({
        type: "GET",
        cache: false,
        data: {

            Year: year,

        },
        url: "/Dashboard/Getcalltypedetails",
        success: function (Chart) {
            debugger

            console.log(Chart)

            for (i = 0; i < Chart.length; i++) {
                calltypedataaraay[i] = Chart[i];
                console.log(calltypedataaraay)

            }
            console.log(calltypedataaraay)


        }
    });
}



function GetINTCNTinarray(year, calltype) {
    $.ajax({
        type: "GET",
        cache: false,
        data: {

            Year: year,
            Call_type: calltype,

        },
        url: "/Dashboard/GetINTCALLCNTdetails",
        success: function (Chart) {
            debugger

            console.log(Chart)

            for (i = 0; i < Chart.length; i++) {
                INTCNTarray[i] = Chart[i];


            }
            console.log(INTCNTarray)


        }
    });
}

function Getyearswiseselecttedtransaction(transactiontype, year) {
    $.ajax({
        type: "GET",
        cache: false,
        data: {
            //FromDate: $('#FromDate').val(),
            //ToDate: $('#ToDate').val()
            Year: year,
            TRANS_TYPE: transactiontype,
        },
        url: "/Dashboard/GetDashboardchart2data",
        success: function (result) {
            debugger
            if (result.Message == "Success") {
                console.log(result)
                // BindCharts(result);
                BindChart2Transtypewise(result.TranstypewiseData)
            }

        }
    });
}

function gettransactiontype() {
    debugger;
    
    $.ajax({
        type: "GET",
        url: "/Dashboard/Gettranstypedata",
        contentType: 'application/json',
        success: function (result) {
            debugger;
            ////Begin Bind Year Dropdown
            var providersTransaction = result;
            var $ddtransaction = $("#ddtransaction");
            $ddtransaction.empty();
            $ddtransaction.append('<option value="">Select type</option>');

            $.each(providersTransaction, function (i, p) {
                debugger
                $ddtransaction.append(
                    $('<option></option>')
                        .val(p.TRANS_TYPE)
                        .text(p.TRANS_TYPE)
                );
            });
            ////End Bind Year Dropdown
        }
    });
    GetData();
    // subscribe to the select event.
    $("#ddtransaction").on('change', function (event) {
        debugger;
        var selectedValue = $(this).val();
        if (selectedValue) {
            debugger;
            var item = selectedValue;
            if (item) {
                $(document).ajaxStart(function () {
                    $("#waitchart3").css("display", "block");
                    $("#wait").css("display", "none");
                    $("#waitchart2").css("display", "none");
                    $("#waitchart4").css("display", "none");
                    $("#waitchart5").css("display", "none");
                    $("#waitchart6").css("display", "none");
                    $("#waitchart7").css("display", "none");
                });

                var valueelement = $("<div></div>");
                valueelement.text("Value: " + item);
                debugger;
                var tyear = $("#jqxyeartransactiondd").val();
                if (tyear == "") {
                    alert("Year not selected");
                    //$("#ddtransaction").jqxDropDownList('clearSelection');
                    $("#ddtransaction").val('');

                    return;
                }
                Tname = item;
                $(document).ajaxStart($.blockUI({
                    css: {
                        border: 'none',
                        padding: '10px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        opacity: .3,
                        color: '#fff'
                    }
                })).ajaxStop($.unblockUI);
                Getyearswiseselecttedtransaction(Tname, tyear);
                $(document).ajaxComplete(function () {
                    $("#waitchart3").css("display", "none");
                });
            }
        }
    });
}


function GetInternationalcount(year, calltype) {
    //$("#waitchart6").css("display", "block");
    $.ajax({
        type: "GET",
        cache: false,
        data: {

            Year: year,
            Call_type: calltype,

        },
        url: "/Dashboard/GetDashboardchart6data",
        success: function (result) {
            //  $("#waitchart6").css("display", "block");
            debugger
            if (result.Message == "Success") {
                console.log(result)
                // var reusltdata = [];
                INTCNTstringtoarray = $.parseJSON(result.TopBranchSales);
                console.log(INTCNTstringtoarray)
                //var name = reusltdata.
                bindchart6INTCNTchart(result.TopBranchSales);
            }

        }
    });
}
//function CountrywiseLabelClick() {
//    debugger;
//    alert("asdfdsaf");
//}
function getmonthwisecountrybill(Cname, Year, calltypeselected) {
    debugger;
    $.ajax({
        type: "GET",
        cache: false,
        data: {
            //FromDate: $('#FromDate').val(),
            //ToDate: $('#ToDate').val()
            Year: Year,
            OUT_COUNTRY: Cname,
            Call_type: calltypeselected,
        },
        url: "/Dashboard/GetDashboardchart7data",
        success: function (result) {
            debugger
            if (result.Message == "Success") {
                console.log(result)
                // BindCharts(result);
                bindchart7INTCNTchartmonthwise(result.countrymonthlysale)
            }

        }
    });
}

function goback2() {

    $("#chart7").hide();
    $("#chart6").show();
}

function Countrywisecount(e) {
    debugger;
    $(document).ajaxStart(function () {
        $("#waitchart7").css("display", "block");
        $("#waitchart2").css("display", "none");
        $("#waitchart3").css("display", "none");
        $("#waitchart4").css("display", "none");
        $("#waitchart5").css("display", "none");
        $("#waitchart6").css("display", "none");
        $("#wait").css("display", "none");
    });

    $(document).ajaxStart($.blockUI({
        css: {
            border: 'none',
            padding: '10px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .3,
            color: '#fff'
        }
    })).ajaxStop($.unblockUI);
    var selectedyear;
    var calltypename;
    if ($('#jqxyearINTcountdd').val() == "") {
        //alert("year not selected")
        //return;
        selectedyear = currentYear;
        // countryname = "INDIA";
    }
    else {
        selectedyear = $('#jqxyearINTcountdd').val();
    }


    console.log(e);
    var n = e.elementValue.toFixed(3);

    for (i = 0; i < INTCNTarray.length; i++) {
        var countryamont = INTCNTarray[i].Countrywisesum.toFixed(3);
        if (countryamont == n) {
            countryname = INTCNTarray[i].OUT_COUNTRY;

        }
    }
    console.log(countryname);
    console.log(selectedyear);

    if ($("#ddtransactionforINTCNTRY").val() == '') {
        var calltype = 'All'
    }
    else {
        calltype = $("#ddtransactionforINTCNTRY").val();
    }




    getmonthwisecountrybill(countryname, selectedyear, calltype);
    document.getElementById('countryname').innerHTML = countryname;
    $("#chart6").hide();
    $(document).ajaxComplete(function () {
        $("#waitchart7").css("display", "none");
    });
    $("#chart7").show();

}
function yeardropdown() {

    var source = [
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
        "2025",
        "2026",
        "2027",
        "2028",
        "2029",
        "2030",
    ];


    var Monthname = [{
        text: "January",
        value: 1
    }, {
        text: "Febuary",
        value: 2
    }, {
        text: "march",
        value: 3
    }, {
        text: "april",
        value: 4
    }, {
        text: "may",
        value: 5
    }, {
        text: "June",
        value: 6
    }, {
        text: "July",
        value: 7
    }, {
        text: "August",
        value: 8
    }, {
        text: "September",
        value: 9
    }, {
        text: "October",
        value: 10
    }, {
        text: "November",
        value: 11
    }, {
        text: "December",
        value: 12
    }
    ];

    //$("#jqxyeardd,#jqxyeartransactiondd,#jqxyearcalltypendd,#jqxyearINTcountdd,#jqxyearselectioningriddd").jqxDropDownList({
    //    source: source,
    //    placeHolder: "Select Year",
    //    selectedIndex: -1,
    //    theme: 'start',
    //    width: 150,
    //    height: 25
    //});


    //Begin Bind year dropdowns for multiple controls
    var jqxYearControls = [
        "#jqxyeardd",
        "#jqxyeartransactiondd",
        "#jqxyearcalltypendd",
        "#jqxyearINTcountdd",
        "#jqxyearselectioningriddd"
    ];

    $.each(jqxYearControls, function (i, selector) {
        $(selector).empty();
        $(selector).attr('style', 'min-width:126px !important;');
        $(selector).append('<option value="">Select Year</option>');
        $.each(source, function (i, p) {
            $(selector).append($('<option></option>').val(p).text(p));
        });
    });
    //End Bind year dropdowns for multiple controls

    var transtype = ["Personal Call",
        "Business Call",
        "All",
    ];

    //$("#ddtransactionforINTCNTRY").jqxDropDownList({
    //    source: transtype,
    //    placeHolder: "Select Type",
    //    selectedIndex: -1,
    //    theme: 'start',
    //    width: 150,
    //    height: 25
    //});

    ////Begin Bind Year Dropdown
    var $ddtransactionforINTCNTRY = $("#ddtransactionforINTCNTRY");
    $ddtransactionforINTCNTRY.empty();
    $ddtransactionforINTCNTRY.append('<option value="">Select type</option>');

    $.each(transtype, function (i, p) {
        debugger
        $ddtransactionforINTCNTRY.append(
            $('<option></option>')
                .val(p)
                .text(p)
        );
    });
    ////End Bind Year Dropdown

    //$("#jqxmonthselectioningriddd").jqxDropDownList({
    //    source: Monthname,
    //    placeHolder: "Select month",
    //    selectedIndex: -1,
    //    theme: 'start',
    //    width: 150,
    //    height: 25,
    //    displayMember: 'text',
    //    valueMember: 'value'
    //});
    ////Begin Bind Year Dropdown
    var $jqxmonthselectioningriddd = $("#jqxmonthselectioningriddd");
    $jqxmonthselectioningriddd.empty();
    $jqxmonthselectioningriddd.append('<option value="">Select Month</option>');

    $.each(Monthname, function (i, p) {
        debugger
        $jqxmonthselectioningriddd.append(
            $('<option></option>')
                .val(p.value)
                .text(p.text)
        );
    });
    ////End Bind Year Dropdown


    $("#jqxyeardd").on('change', function (event) {
        debugger;
        var selectedValue = $(this).val();
        if (selectedValue) {
            debugger;
            var item = selectedValue;
            if (item) {
                $(document).ajaxStart(function () {
                    $("#wait").css("display", "block");
                    $("#waitchart3").css("display", "none");
                    $("#waitchart6").css("display", "none");
                    $("#waitchart4").css("display", "none");
                    $("#waitchart5").css("display", "none");
                    $("#waitchart7").css("display", "none");
                    //$("#TopBranchSalesChart").css("visibility", "hidden");
                    //$("#TopBranchSalesChart").hide();

                });
                $(document).ajaxStart($.blockUI({
                    css: {
                        border: 'none',
                        padding: '10px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        opacity: .3,
                        color: '#fff'
                    }
                })).ajaxStop($.unblockUI);
                var valueelement = $("<div></div>");
                valueelement.text("Value: " + item);
                Yearwisesale = item
                GetyearswiseselectedData(Yearwisesale);
                $(document).ajaxComplete(function () {
                    $("#wait").css("display", "none");
                    //$("#TopBranchSalesChart").css("visibility", "visible");
                    //$("#TopBranchSalesChart").show();
                });

            }
        }
    });
    $("#jqxyeartransactiondd").on('change', function (event) {
        var selectedValue = $(this).val();
        if (selectedValue) {
            debugger;
            var item = selectedValue;
            if (($("#ddtransaction").val() != '') && (($("#jqxyeartransactiondd").val() != ''))) {
                if (item) {
                    var valueelement = $("<div></div>");

                    var tyear = $("#jqxyeartransactiondd").val();
                    var Tname = $("#ddtransaction").val();
                    $(document).ajaxStart($.blockUI({
                        css: {
                            border: 'none',
                            padding: '10px',
                            backgroundColor: '#000',
                            '-webkit-border-radius': '10px',
                            '-moz-border-radius': '10px',
                            opacity: .3,
                            color: '#fff'
                        }
                    })).ajaxStop($.unblockUI);
                    Getyearswiseselecttedtransaction(Tname, tyear);
                }
            }
        }
    });
    $("#jqxyearcalltypendd").on('change', function (selectedValue) {
        var selectedValue = $(this).val();
        if (selectedValue) {
            debugger;
            var item = selectedValue;
            if (item) {
                $(document).ajaxStart(function () {
                    $("#waitchart4").css("display", "block");
                    $("#waitchart2").css("display", "none");
                    $("#waitchart3").css("display", "none");
                    $("#waitchart6").css("display", "none");
                    $("#waitchart7").css("display", "none");
                    $("#wait").css("display", "none");
                });
                $(document).ajaxStart($.blockUI({
                    css: {
                        border: 'none',
                        padding: '10px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        opacity: .3,
                        color: '#fff'
                    }
                })).ajaxStop($.unblockUI);
                var valueelement = $("<div></div>");
                valueelement.text("Value: " + item);
                Yearwisesale = item
                Getcalltypedata(Yearwisesale);

                Getcalltypedatainarray(Yearwisesale)
                $(document).ajaxComplete(function () {
                    $("#waitchart4").css("display", "none");
                });

            }
        }
    });

    $("#jqxyearINTcountdd").on('change', function (event) {
        var selectedValue = $(this).val();
        if (selectedValue) {
            debugger;
            var item = selectedValue;
            if (item) {
                $(document).ajaxStart(function () {
                    $("#waitchart6").css("display", "block");
                    $("#waitchart4").css("display", "none");
                    $("#waitchart2").css("display", "none");
                    $("#waitchart3").css("display", "none");
                    $("#waitchart5").css("display", "none");
                    $("#waitchart7").css("display", "none");
                    $("#wait").css("display", "none");
                });
                $(document).ajaxStart($.blockUI({
                    css: {
                        border: 'none',
                        padding: '10px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        opacity: .3,
                        color: '#fff'
                    }
                })).ajaxStop($.unblockUI);
                var valueelement = $("<div></div>");
                valueelement.text("Value: " + item);
                Yearwisesale = item

                if ($("#ddtransactionforINTCNTRY").val() == '') {
                    var calltype = 'All'
                }
                else {
                    calltype = $("#ddtransactionforINTCNTRY").val();
                }

                GetInternationalcount(Yearwisesale, calltype);

                GetINTCNTinarray(Yearwisesale, calltype)
                $(document).ajaxComplete(function () {
                    $("#waitchart6").css("display", "none");
                });

            }
        }
    });

    $("#ddtransactionforINTCNTRY").on('change', function (event) {
        var selectedValue = $(this).val();
        if (selectedValue) {
            debugger;
            var item = selectedValue;
            if (item) {
                $(document).ajaxStart(function () {
                    $("#waitchart6").css("display", "block");
                    $("#waitchart4").css("display", "none");
                    $("#waitchart2").css("display", "none");
                    $("#waitchart3").css("display", "none");
                    $("#waitchart5").css("display", "none");
                    $("#waitchart7").css("display", "none");
                    $("#wait").css("display", "none");
                });
                $(document).ajaxStart($.blockUI({
                    css: {
                        border: 'none',
                        padding: '10px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        opacity: .3,
                        color: '#fff'
                    }
                })).ajaxStop($.unblockUI);
                var valueelement = $("<div></div>");
                valueelement.text("Value: " + item);
                var selectedcalltype = item

                if ($("#jqxyearINTcountdd").val() == '') {
                    var selectedyear = currentYear
                }
                else {
                    selectedyear = $("#jqxyearINTcountdd").val();
                }

                GetInternationalcount(selectedyear, selectedcalltype);

                GetINTCNTinarray(selectedyear, selectedcalltype)
                $(document).ajaxComplete(function () {
                    $("#waitchart6").css("display", "none");
                });
            }
        }
    });

    $("#jqxyearselectioningriddd").on('change', function (event) {
        var selectedValue = $(this).val();
        if (selectedValue) {
            debugger;
            var item = selectedValue;
            if (item) {
                var valueelement = $("<div></div>");
                valueelement.text("Value: " + item);
                var selectedyear = item

                if ($("#jqxmonthselectioningriddd").val() == '') {
                    getcountryingrid(selectedyear);
                    return;
                }
                else {
                    getcountryingridbasedonmonthandyear(selectedyear, selectedmonthforgrid);
                }
            }
        }
    });


    $("#jqxmonthselectioningriddd").on('change', function (event) {
        var selectedValue = $(this).val();
        if (selectedValue) {
            debugger;
            var item = selectedValue;
            if (item) {

                if ($("#jqxyearselectioningriddd").val() == '') {
                    selectedmonthforgrid = item
                    alert("year not selected")
                    return;
                }

                else {
                    var selectedyear = $("#jqxyearselectioningriddd").val();
                }
                var valueelement = $("<div></div>");
                valueelement.text("Value: " + item);

                selectedmonthforgrid = item


                console.log(selectedmonthforgrid)
                getcountryingridbasedonmonthandyear(selectedyear, selectedmonthforgrid)


            }
        }
    });
}
function getcountryingrid(year) {
    // prepare the data
    var source =
    {
        datatype: "json",
        data: {
            year: year,


        },
        datafields: [
            { name: 'Countrywisesum', type: 'float' },
            { name: 'OUT_COUNTRY', type: 'string' },



        ],
        //root: "IteamID",
        //record: "IteamID",
        // id: 'TournamentID',
        url: "/Dashboard/Getallcountryingrid"
    };

    var dataAdapter = new $.jqx.dataAdapter(source)
    // initialize jqxGrid
    $("#jqxgridtest").jqxGrid(
        {
            width: "100%",
            source: dataAdapter,
            theme: 'energyblue',
            pageable: true,
            autoheight: true,
            sortable: true,
            altrows: true,
            pagesize: 10,
            enabletooltips: true,
            editable: false,
            selectionmode: 'singlerow',
            columns: [
                { text: 'Country name', datafield: 'OUT_COUNTRY', cellsalign: 'center', align: 'center', width: "65%" },
                { text: 'Total amount', datafield: 'Countrywisesum', cellsalign: 'center', align: 'center', width: "35%" },


            ],

        });
}
function getcountryingridbasedonmonthandyear(year, month) {
    // prepare the data
    var source =
    {
        datatype: "json",
        data: {
            year: year,
            month: month,
        },
        datafields: [
            { name: 'Countrywisesum', type: 'float' },
            { name: 'OUT_COUNTRY', type: 'string' },
        ],

        url: "/Dashboard/Getallcountryingridmonthwise"
    };

    var dataAdapter = new $.jqx.dataAdapter(source)
    // initialize jqxGrid
    $("#jqxgridtest").jqxGrid(
        {
            width: "100%",
            source: dataAdapter,
            theme: 'energyblue',
            pageable: true,
            autoheight: true,
            sortable: true,
            altrows: true,
            pagesize: 10,
            enabletooltips: true,
            editable: false,
            selectionmode: 'singlerow',
            columns: [
                { text: 'Country name', datafield: 'OUT_COUNTRY', cellsalign: 'center', align: 'center', width: "65%" },
                { text: 'Total amount', datafield: 'Countrywisesum', cellsalign: 'center', align: 'center', width: "35%" },


            ],

        });
}
//----------------------------------------------ALL chart GRID-----------------------------------------------------------------


//function chart1injqxgrid(dataarray) {
//    // prepare the data
//    var filteredarray = [] ;
//    for (i = 0; i < dataarray.length; i++)
//    {
//        filteredarray[i] = dataarray[i];
//        console.log(filteredarray)
//        //var ctamont = calltypedataaraay[i].Call_amount.toFixed(2);
//        filteredarray[i].amount = dataarray[i].amount.toFixed(3);
//        console.log(filteredarray)

//    }

//    var data = filteredarray;
//    var source =
//    {
//        localdata: data,
//        datatype: "array",

//        datafields: [
//             { name: 'amount', type: 'float' },
//            { name: 'MonthName', type: 'string' },
//        ],

//        //url: "/Dashboard/Getallcountryingridmonthwise"
//    };

//    var dataAdapter = new $.jqx.dataAdapter(source)
//    // initialize jqxGrid
//    $("#jqxgridchart1").jqxGrid(
//    {
//        width: "100%",
//        source: dataAdapter,
//        theme: 'energyblue',
//        pageable: true,
//        autoheight: true,
//        sortable: true,
//        altrows: true,
//        pagesize: 10,
//        enabletooltips: true,
//        editable: false,
//        selectionmode: 'singlerow',
//        columns: [
//             { text: 'monthname', datafield: 'MonthName', cellsalign: 'center', align: 'center', width: "65%" },
//             { text: 'Total amount', datafield: 'amount', cellsalign: 'center', align: 'center', width: "35%" },


//        ],

//    });




//}




