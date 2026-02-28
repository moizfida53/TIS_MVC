<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>
    " %>

    <asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
        Pivot
    </asp:Content>

    <asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

       <%-- jQuery UI --%>
<%-- Load jQuery UI here, specific to this page only --%>
    <script src="../../Scripts/jquery-ui.min.js"></script>
    <link href="../../css/jquery-ui.min.css" rel="stylesheet" />

    <link href="../../css/Pivot/c3.min.css" rel="stylesheet" />
    <link href="../../css/Pivot/pivot.css" rel="stylesheet" />
    <link href="../../css/Pivot/nrecopivottableext.css" rel="stylesheet" />

    <script src="../../Scripts/Pivot/d3.min.js"></script>
    <script src="../../Scripts/Pivot/c3.min.js"></script>
    <script src="../../Scripts/Pivot/pivot.js"></script>
    <script src="../../Scripts/Pivot/c3_renderers.js"></script>
    <script src="../../Scripts/Pivot/nrecopivottableext.js"></script>
    <script src="../../Scripts/Pivot/pivot-init.js"></script>

        <div style="width: 100%">
            <table style="width: 100%">
                <tr>
                    <td class="myButton3">Pivot Report</td>
                </tr>
            </table>
        </div>

        <div id="output" align="left"></div>

        <div class="mt-2">
            <input type="button" value="Save" id="save" style="font-size: 18px;" />
            <input type="button" value="Restore" id="restore" style="font-size: 18px;" />
        </div>

        

    </asp:Content>
