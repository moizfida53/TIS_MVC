<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    AuditReport
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2>Audit Report</h2>
    <link href="../../Content/jqx.base.css" rel="stylesheet" type="text/css" />
    <meta name="viewport" content="width=device-width" />
   <%-- <script src="../../Scripts/jquery-1.11.1.min.js" type="text/javascript"></script>--%>
    <script src="../../Scripts/jquery-3.7.1.min.js"></script>

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
    <script src="../../scripts/AuditReport.js"></script>
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
