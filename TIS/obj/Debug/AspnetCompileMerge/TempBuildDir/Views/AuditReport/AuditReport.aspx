<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    AuditReport
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2>Audit Report</h2>
    <link href="../../Content/jqx.base.css" rel="stylesheet" type="text/css" />
    <meta name="viewport" content="width=device-width" />
    <script src="../../Scripts/jquery-1.11.1.min.js" type="text/javascript"></script>
    <script src="../../Scripts/jquery.blockUI.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxcore.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxbuttons.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxcalendar.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxdatetimeinput.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxdropdownbutton.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxcheckbox.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxmenu.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxlistbox.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxdropdownlist.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxtabs.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxscrollbar.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxgrid.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxgrid.selection.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxgrid.filter.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxgrid.columnsresize.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxgrid.pager.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxdata.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxgrid.sort.js" type="text/javascript"></script>
    <script src="../../Scripts/jsrender.min.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxfileupload.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxgrid.edit.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxcombobox.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxwindow.js" type="text/javascript"></script>
    <script src="../../Scripts/jqxswitchbutton.js" type="text/javascript"></script>
    <link href="../../Content/jqx.ui-redmond.css" rel="stylesheet" type="text/css" />
    <script src="../../Scripts/jqxgrid.grouping.js" type="text/javascript"></script>
    <script type="text/javascript">

        var Uid;

        $(document).ready(function () {
            $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
            $("#cmbStartDate").jqxDateTimeInput({ width: '180px', height: '25px', formatString: 'yyyy-MM-dd HH:mm:ss' });
            $("#cmbEndDate").jqxDateTimeInput({ width: '180px', height: '25px', formatString: 'yyyy-MM-dd HH:mm:ss' });

            $("#cmbEvents").jqxDropDownList({ placeHolder: 'Select Event', selectedIndex: -1, width: '170px', height: '25px' });
            $("#cmbEvents").jqxDropDownList('loadFromSelect', 'SelectEvents');
            $("#SelectEvents").hide();

            $("#cmbUser").jqxDropDownButton({ width: 170, height: 25 });
            var dropDownContent = '<div style="position: relative; margin: 3px;">Select User</div>';
            $("#cmbUser").jqxDropDownButton('setContent', dropDownContent);
            $('#cmbUser').on('open', function () { GetUserName(); });

            $("#cmbStatus").jqxDropDownList({ placeHolder: 'Select Status', selectedIndex: -1, width: '170px', height: '25px' });
            $("#cmbStatus").jqxDropDownList('loadFromSelect', 'SelectStatus');
            $("#SelectStatus").hide();


            $("#Window").jqxWindow({ height: '100%', width: '100%', theme: 'summer', isModal: true, autoOpen: false });

            GetUserName();

        });


        function Search() {

            var date1 = $("#cmbStartDate").jqxDateTimeInput('getDate');
            var date2 = $("#cmbEndDate").jqxDateTimeInput('getDate');

            var Event = $("#cmbEvents").val();
            var Status = $("#cmbStatus").text();

            if ((new Date(date1) <= new Date(date2))) { }
            else {
                alert('Start Date Cannot be more than End Date');
                return;
            }
            var formattedDate1 = $.jqx.dataFormat.formatdate(date1, 'yyyy-MM-dd HH:mm:ss');
            var formattedDate2 = $.jqx.dataFormat.formatdate(date2, 'yyyy-MM-dd HH:mm:ss');


            var File = {
                "StartDate": formattedDate1,
                "EndDate": formattedDate2,
                "Event": Event,
                "Uid": Uid,
                "Status": Status
            };

            $.ajax({
                type: "GET",
                url: "../../AuditReport/Search",
                contentType: 'application/json',
                data: File,
                success: function (result) {
                    var results = result.dtAuditReport;
                    FillGrid(results)
                }
            })

        }

        function FillGrid(result) {

            var deptsource =
            {
                localdata: result,
                datafields:
                    [
                        { name: 'ID', type: 'number' },
                        { name: 'ACTION_NAME', type: 'string' },
                        { name: 'RESULT', type: 'string' },
                        { name: 'USER', type: 'string' },
                        { name: 'USERID', type: 'string' },
                        { name: 'DATE1', type: 'string' },
                        { name: 'FORM_ID', type: 'number' }
                    ],
                datatype: "json"
            };

            var dataAdapterReport = new $.jqx.dataAdapter(deptsource);

            $("#grdReport").jqxGrid({
                width: '100%',
                source: dataAdapterReport,
                columnsresize: true,
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                groupable: true,
                theme: 'office',
                selectionmode: 'singlerow',
                columns: [
                    { dataField: 'ID', text: 'ID' },
                    { dataField: 'ACTION_NAME', text: 'Action' },
                    { dataField: 'RESULT', text: 'Result' },
                    { dataField: 'USER', text: 'User Name' },
                    { dataField: 'USERID', text: 'User Id' },
                    { dataField: 'DATE1', text: 'Date' },
                    { dataField: 'FORM_ID', text: 'Form' },
                    {
                        dataField: 'View', text: 'View', width: 100, columntype: 'button', cellsrenderer: function (row, column, value, defaultHtml, columnSettings, rowData) {

                            return "View Details";
                        }, buttonclick: function (row) {

                            var getselectedrowindexes = $('#grdReport').jqxGrid('getselectedrowindexes');
                            var row = $("#grdReport").jqxGrid('getrowdata', getselectedrowindexes[0]);

                            var ID = row.ID;

                            var File = {
                                "ID": ID
                            };

                            $.ajax({
                                type: "GET",
                                url: "../../AuditReport/Details",
                                contentType: 'application/json',
                                data: File,
                                success: function (result) {
                                    var results = result.dtDetails;
                                    FillDeatils(results)
                                }
                            })

                            function FillDeatils(result) {

                                var deptsource =
                                {
                                    localdata: result,
                                    datafields:
                                        [
                                            { name: 'ID', type: 'number' },
                                            { name: 'SNO', type: 'number' },
                                            { name: 'AT_ID', type: 'number' },
                                            { name: 'OLD_VALUE', type: 'string' },
                                            { name: 'NEW_VALUE', type: 'string' },
                                            { name: 'FIELD_NAME', type: 'string' }
                                        ],
                                    datatype: "json"
                                };

                                var dataAdapterReport = new $.jqx.dataAdapter(deptsource);

                                $("#grdDetails").jqxGrid({
                                    width: '100%',
                                    source: dataAdapterReport,
                                    columnsresize: true,
                                    pageSize: 10,
                                    sortable: true,
                                    filterable: true,
                                    showfilterrow: true,
                                    pageable: true,
                                    groupable: true,
                                    theme: 'office',
                                    selectionmode: 'singlerow',
                                    columns: [
                                        { dataField: 'ID', text: 'ID' },
                                        { dataField: 'SNO', text: 'SNo' },
                                        { dataField: 'AT_ID', text: 'Master ID' },
                                        { dataField: 'OLD_VALUE', text: 'Old Value' },
                                        { dataField: 'NEW_VALUE', text: 'New Value' },
                                        { dataField: 'FIELD_NAME', text: 'Field Name' }
                                    ]
                                });
                            }


                            $('#Window').jqxWindow('open');

                        }
                    }
                ]
            });

        }

        function GetUserName() {
            $.ajax({
                type: "GET",
                url: "../../AuditReport/getEmp",
                success: function (result) {
                    var Log = result.EmpList;
                    var sourceEmp =
                    {
                        dataType: "json",
                        dataFields: [
                            { name: 'UserName', type: 'string' },
                            { name: 'EmpName', type: 'string' },
                            { name: 'EmpNo', type: 'string' },
                            { name: 'Uid', type: 'number' }
                        ],
                        id: 'UserName',
                        localdata: Log
                    };
                    var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
                    $("#cmbUserName").jqxGrid({
                        width: '100%',
                        source: dataAdapterEmp,
                        columnsresize: true,
                        theme: 'arctic',
                        pageSize: 10,
                        sortable: true,
                        filterable: true,
                        showfilterrow: true,
                        pageable: true,
                        columns: [
                            { dataField: 'UserName', text: 'Username' },
                            { dataField: 'EmpName', text: 'Employee Name' },
                            { dataField: 'EmpNo', text: 'Employee No' },
                            { dataField: 'Uid', text: 'User Id' }
                        ]
                    });


                    $("#cmbUserName").on('rowselect', function (event) {
                        var args = event.args;
                        var row = $("#cmbUserName").jqxGrid('getrowdata', args.rowindex);
                        Uid = row.Uid;
                        var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['UserName'] + ' - ' + row['EmpNo'] + '</div>';
                        $("#cmbUser").jqxDropDownButton('setContent', dropDownct);
                        $('#cmbUser').jqxDropDownButton('close');
                    });

                }
            });

        }


        function Clear() {

            $("#grdReport").hide();
            $("#cmbUser").jqxDropDownButton('setContent', 'Select User');
            $("#cmbEvents").jqxDropDownList({ selectedIndex: -1 });
            $("#cmbStatus").jqxDropDownList({ selectedIndex: -1 });


        }





    </script>
    <div>
        <table>
            <tr>
                <td>
                    <b>Start Date:</b>
                </td>
                <td>
                    <div id="cmbStartDate">
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <b>End Date:</b>
                </td>
                <td>
                    <div id="cmbEndDate">
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <div>
        <table>
            <tr>
                <td>
                    <b>UserName:</b>
                </td>
                <td>
                    <div id="cmbUser">
                        <div id="cmbUserName">
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <b>Event Type:</b>
                </td>
                <td>
                    <div id="cmbEvents">
                    </div>
                    <select id="SelectEvents">
                        <option value="1" label="MANAGE EMPLOYEE"></option>
                        <option value="2" label="ADD NUMBER"></option>
                        <option value="3" label="ASSIGN NUMBER"></option>
                        <option value="4" label="DELEGATE BILLS"></option>
                        <%--<option value="5" label="SEND REMINDER"></option>--%>
                        <option value="9" label="IMPORT MOBILE BILLS"></option>
                        <option value="11" label="UNASSIGNED BILLS"></option>
                        <option value="12" label="FORCE BILLS"></option>
                        <option value="13" label="REIMBURSE BILLS"></option>
                        <option value="14" label="CHANGE BILL STATUS"></option>
                        <option value="15" label="REASSIGN BILLS"></option>
                        <option value="17" label="CONFIGURATION"></option>
                        <option value="18" label="MANAGE CALLTYPE "></option>
                        <option value="21" label="ANALYSE/LOGIN"></option>
                        <%--<option value="15" label="Deductable Report"></option>
                        <option value="16" label="Close Bills"></option>
                        <option value="17" label="Employee Profile Report"></option>
                        <option value="18" label="Manage Call Types"></option>--%>
                    </select>
                </td>
            </tr>
            <tr>
                <td>
                    <b>Status:</b>
                </td>
                <td>
                    <div id="cmbStatus">
                    </div>
                    <select id="SelectStatus">
                        <option value="1" label="Success"></option>
                        <option value="2" label="Fail"></option>
                    </select>
                </td>
            </tr>
        </table>
    </div>
    <div>
        <table>
            <tr>
                <td>
                    <input id="btnSearch" type="button" value="Search" onclick="Search()" />
                </td>
                <td>
                    <input id="btnCancle" type="button" value="Cancle" onclick="Clear()" />
                </td>
            </tr>
        </table>
    </div>
    <div>
        <div id="grdReport">
        </div>
    </div>
    <div id="Window">
        <div>
            <b>Audit Details</b>
        </div>
        <div id="grdDetails">
        </div>
    </div>
</asp:Content>
