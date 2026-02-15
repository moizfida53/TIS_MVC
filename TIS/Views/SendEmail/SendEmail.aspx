<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    SendEmail
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <!-- Styles -->
    <link href="../../css/alert.css" rel="stylesheet" />
    <link href="../../css/theme.css" rel="stylesheet" />

    <!-- Scripts -->
    <script src="../../Scripts/alert.js"></script>
    <script src="../../Scripts/jqxgrid.grouping.js"></script>
    <script src="../../Scripts/SendEmail.js"></script>
    <div style="width: 100%">
        <table style="width: 100%">
            <tr>
                <td class="myButton3">Send Email</td>
            </tr>
        </table>
    </div>
    <div class="">
        <div class="employee-form-container">
            <br />
            <div id="grdSendEmail"></div>
            <div>
                <input id="btnSend" type="button" class="myButton" style="position: relative; left: 45%" value="Send Email" />
                <input id="btnDeleteEmail" type="button" class="myButton" style="position: relative; left: 45%" value="Delete" />
            </div>
        </div>
    </div>
</asp:Content>
