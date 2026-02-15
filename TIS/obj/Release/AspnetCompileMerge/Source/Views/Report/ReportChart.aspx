<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Report
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2>REPORT</h2>
    <link href="~/Content/jqx.base.css" rel="stylesheet" type="text/css" />
    <meta name="viewport" content="width=device-width" />

    <%--<script src="~/Scripts/jquery-1.11.1.min.js" type="text/javascript"></script>--%>
    <script src="../../Scripts/jquery-3.7.1.min.js"></script>

    <script src="~/Scripts/jquery.blockUI.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxcore.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxbuttons.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxcalendar.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxdatetimeinput.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxdropdownbutton.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxcheckbox.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxmenu.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxlistbox.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxdropdownlist.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxtabs.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxscrollbar.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.selection.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.filter.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.columnsresize.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.pager.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxdata.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.sort.js" type="text/javascript"></script>
    <script src="~/Scripts/jsrender.min.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxfileupload.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.edit.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxcombobox.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxwindow.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxswitchbutton.js" type="text/javascript"></script>
    <link href="~/Content/jqx.ui-redmond.css" rel="stylesheet" type="text/css" />
    <script src="~/Scripts/jqxchart.core.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxdraw.js" type="text/javascript"></script>


    <script type="text/javascript">


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
    </script>
    <div id="jqxGrid"></div>
    <div id='jqxChart' style="margin-top: 50px; width: 850px; height: 400px; position: relative; left: 0px; top: 0px;">
    </div>
</asp:Content>
