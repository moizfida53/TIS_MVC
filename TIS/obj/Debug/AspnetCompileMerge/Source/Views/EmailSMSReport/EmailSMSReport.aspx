<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    EmailSMSReport
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <link href="../../css/alert.css" rel="stylesheet" />
    <link href="../../css/theme.css" rel="stylesheet" />
    <script src="../../Scripts/alert.js"></script>
    <link href="../../css/jqx.darkblue.css" rel="stylesheet" />
    <script src="../../Scripts/jqxgrid.grouping.js"></script>
    <script type="text/javascript">

        $(document).ready(function () {
            $('#jqxTabs').jqxTabs({ width: '100%', position: 'top' });
            $("#cmbStartDate").jqxDateTimeInput({ width: '170px', height: '25px' });
            $("#cmbEndDate").jqxDateTimeInput({ width: '170px', height: '25px' });
            GetPage();

            $("#cmbStatus").jqxDropDownList({ width: '170px', height: '25px' });
            $("#cmbStatus").jqxDropDownList('loadFromSelect', 'Select');
            $("#cmbStatus").jqxDropDownList('selectIndex', 1);

            $("#cmbStartDate2").jqxDateTimeInput({ width: '170px', height: '25px' });
            $("#cmbEndDate2").jqxDateTimeInput({ width: '170px', height: '25px' });
            $("#cmbStatus2").jqxDropDownList({ width: '170px', height: '25px' });
            $("#cmbStatus2").jqxDropDownList('loadFromSelect', 'Select2 ');
            $("#cmbStatus2").jqxDropDownList('selectIndex', 1);


        });

        function GetPage() {
            $.ajax({
                type: "GET",
                cache: false,
                url: "../../EmailSMSReport/EmailSMSReport",
                success: function (result) {

                }
            });
        }

        function SearchEmail() {

            var date1 = $("#cmbStartDate").jqxDateTimeInput('getDate');
            var date2 = $("#cmbEndDate").jqxDateTimeInput('getDate');
            var formattedDate1 = $.jqx.dataFormat.formatdate(date1, 'yyyy-MM-dd');
            var formattedDate2 = $.jqx.dataFormat.formatdate(date2, 'yyyy-MM-dd 23:59:59');

            var Result = $("#cmbStatus").jqxDropDownList('getSelectedItem');

            var value = {
                "StartDate": formattedDate1,
                "EndDate": formattedDate2,
                "Status": Result.value
            };
            var obji = { Search: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSMSReport/SearchEmail",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    var Report = result.dtEmailReport;
                    FillEmailReport(Report)
                }
            });
        }

        function FillEmailReport(Report) {
            var Email =
            {
                dataType: "json",
                dataFields: [
                    { name: 'Id', type: 'number' },
                    { name: 'TemplateId', type: 'number' },
                    { name: 'TemplateName', type: 'string' },
                    { name: 'Subject', type: 'string' },
                    { name: 'EmailText', type: 'string' },
                    { name: 'EmailFrom', type: 'string' },
                    { name: 'EmailTo', type: 'string' },
                    { name: 'IsSent', type: 'number' },
                    { name: 'senton', type: 'string' },
                ],
                id: 'Id',
                localdata: Report
            };
            var dataAdapterEmail = new $.jqx.dataAdapter(Email);
            $("#grdEmailReport").jqxGrid({
                width: '100%',
                source: dataAdapterEmail,
                columnsresize: true,
                theme: 'dark-blue',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                editable: true,
                columns: [
                    { dataField: 'Id', text: 'Id', hidden: 'true' },
                    { dataField: 'TemplateId', text: 'Temp. Id', width: '80px', editable: false, hidden: 'true' },
                    { dataField: 'TemplateName', text: 'Template', editable: false },
                    { dataField: 'Subject', text: 'Subject', editable: false },
                    { dataField: 'EmailText', text: 'Email Text' },
                    { dataField: 'EmailFrom', text: 'Email From', editable: false },
                    { dataField: 'EmailTo', text: 'Email To' },
                    { dataField: 'IsSent', text: 'Sent', editable: false },
                    { dataField: 'senton', text: 'Sent On', editable: false, hidden: 'true' }
                ]
            });

        }

        function SearchSMS() {

            var date1 = $("#cmbStartDate2").jqxDateTimeInput('getDate');
            var date2 = $("#cmbEndDate2").jqxDateTimeInput('getDate');
            var formattedDate1 = $.jqx.dataFormat.formatdate(date1, 'yyyy-MM-dd');
            var formattedDate2 = $.jqx.dataFormat.formatdate(date2, 'yyyy-MM-dd 23:59:59');

            var Result = $("#cmbStatus2").jqxDropDownList('getSelectedItem');

            var value = {
                "StartDate": formattedDate1,
                "EndDate": formattedDate2,
                "Status": Result.value
            };
            var obji = { Search: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSMSReport/SearchSMS",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    var Report = result.dtSMSReport;
                    FillSMSReport(Report)
                }
            });
        }

        function FillSMSReport(Report) {
            var SMS =
            {
                dataType: "json",
                dataFields: [
                    { name: 'ID', type: 'number' },
                    { name: 'SMSTemplateId', type: 'number' },
                    { name: 'SMSTemplateName', type: 'string' },
                    { name: 'SMSTo', type: 'string' },
                    { name: 'Message', type: 'string' }
                ],
                id: 'ID',
                localdata: Report
            };
            var dataAdapterSMS = new $.jqx.dataAdapter(SMS);
            $("#grdSMSReport").jqxGrid({
                width: '100%',
                source: dataAdapterSMS,
                columnsresize: true,
                theme: 'dark-blue',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                editable: true,
                columns: [
                    { dataField: 'ID', text: 'Id', hidden: 'true' },
                    { dataField: 'SMSTemplateId', text: 'Temp. Id', width: '80px', editable: false, hidden: 'true' },
                    { dataField: 'SMSTemplateName', text: 'Template', editable: false },
                    { dataField: 'SMSTo', text: 'Mobile', editable: false },
                    { dataField: 'Message', text: 'Message' }
                ]
            });

        }


    </script>
    <style>
        .myButton {
            -moz-box-shadow: inset 0px 1px 0px 0px #54a3f7;
            -webkit-box-shadow: inset 0px 1px 0px 0px #54a3f7;
            box-shadow: inset 0px 1px 0px 0px #54a3f7;
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #007dc1), color-stop(1, #0061a7));
            background: -moz-linear-gradient(top, #007dc1 5%, #0061a7 100%);
            background: -webkit-linear-gradient(top, #007dc1 5%, #0061a7 100%);
            background: -o-linear-gradient(top, #007dc1 5%, #0061a7 100%);
            background: -ms-linear-gradient(top, #007dc1 5%, #0061a7 100%);
            background: linear-gradient(to bottom, #007dc1 5%, #0061a7 100%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#007dc1', endColorstr='#0061a7',GradientType=0);
            background-color: #007dc1;
            -moz-border-radius: 3px;
            -webkit-border-radius: 3px;
            border-radius: 3px;
            border: 1px solid #124d77;
            display: inline-block;
            cursor: pointer;
            color: #ffffff;
            font-family: Arial;
            font-size: 13px;
            padding: 5px 14px;
            text-decoration: none;
            text-shadow: 0px 1px 0px #154682;
        }

            .myButton:hover {
                background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #0061a7), color-stop(1, #007dc1));
                background: -moz-linear-gradient(top, #0061a7 5%, #007dc1 100%);
                background: -webkit-linear-gradient(top, #0061a7 5%, #007dc1 100%);
                background: -o-linear-gradient(top, #0061a7 5%, #007dc1 100%);
                background: -ms-linear-gradient(top, #0061a7 5%, #007dc1 100%);
                background: linear-gradient(to bottom, #0061a7 5%, #007dc1 100%);
                filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0061a7', endColorstr='#007dc1',GradientType=0);
                background-color: #0061a7;
            }
    </style>

    <div id="jqxTabs">
        <ul>
            <li>Email</li>
            <li>SMS</li>
        </ul>
        <div id="tbEmail">
            <div style="width: 100%">
                <table style="width: 100%">
                    <tr>
                        <td class="myButton3">Email Report
                        </td>
                    </tr>
                </table>
            </div>

            <table>
                <tr>
                    <td>Start Date:
                    </td>
                    <td>
                        <div id="cmbStartDate">
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>End Date:
                    </td>
                    <td>
                        <div id="cmbEndDate">
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Status:
                    </td>
                    <td>
                        <div id="cmbStatus">
                        </div>
                        <select id="Select" style="visibility: hidden">
                            <option value="0" label="Not Sent"></option>
                            <option value="1" label="Sent" selected="selected"></option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button id="btnSearchEmail" onclick="SearchEmail()">Search</button>
                    </td>
                </tr>
            </table>

            <div id="grdEmailReport"></div>

        </div>

        <div id="tbSMS">
            <div style="width: 100%">
                <table style="width: 100%">
                    <tr>
                        <td class="myButton3">SMS Report
                        </td>
                    </tr>
                </table>
            </div>

            <table>
                <tr>
                    <td>Start Date:
                    </td>
                    <td>
                        <div id="cmbStartDate2">
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>End Date:
                    </td>
                    <td>
                        <div id="cmbEndDate2">
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Status:
                    </td>
                    <td>
                        <div id="cmbStatus2">
                        </div>
                        <select id="Select2" style="visibility: hidden">
                            <option value="0" label="Not Sent"></option>
                            <option value="1" label="Sent" selected="selected"></option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button id="btnSearchSMS" onclick="SearchSMS()">Search</button>
                    </td>
                </tr>
            </table>

            <div id="grdSMSReport"></div>

        </div>
    </div>
</asp:Content>
