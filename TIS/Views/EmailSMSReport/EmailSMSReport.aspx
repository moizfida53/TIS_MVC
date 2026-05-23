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
    <script src="../../Scripts/EmailSmsReport.js"></script>

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
