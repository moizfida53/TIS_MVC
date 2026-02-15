<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic> " %>


<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Email Template
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <script src="../../Scripts/TemplatesJS.js"></script>
    <script>

        $(document).ready(function () {
            //$(document).ajaxStart($.blockUI({
            //    css: {
            //        border: 'none',
            //        padding: '10px',
            //        backgroundColor: '#000',
            //        '-webkit-border-radius': '10px',
            //        '-moz-border-radius': '10px',
            //        opacity: .3,
            //        color: '#fff'
            //    }
            //})).ajaxStop($.unblockUI);

            $("#jqxMenu").jqxMenu({ width: '100%', height: '30px' });
            LoadTemplates();
        });
    </script>

    <%--<div style="border-radius: 6px; background-image: url(../../Content/images/header-image-11.jpg);
        width: 100%">
            <table style="height: 62px; width: 100%;">
                <tr>
                    <td width="100px" align="left">
                        <img src="../../Content/images/Header1.png" border="0" style="height: 62px; width: 95px" />
                    </td>
                    <td align="left" style="padding-left: 0px; padding-bottom: 3px; color: #FFFFFF; font-weight: bold;
                    font-size: 16pt;">
                        Telecom Invoicing System
                    </td>

                    <td>
                        <div id="btnLoginAs">
                            <div id="grdLoginAs">
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">

                        <div id='jqxMenu'>
                            <ul>
                                <li><a href="../../User/Analyse">Personal Task</a></li>

                                <li>
                                    Admin
                                    <ul style='width: 250px;'>
                                        <li><a href="../../Admin/Index">Manage Employee</a></li>
                                        <li><a href="../../Admin/Telephone">Manage Telephone</a></li>
                                        <li><a href="../../Admin/Delegate">Delegate Bills</a></li>
                                    </ul>
                                </li>

                                <li>
                                    Bill Management
                                    <ul>
                                        <li><a href="../../Import/Index">Import Mobile Bills</a></li>
                                        <li><a href="../../Import/UnAssigned">UnAssigned Bills</a></li>
                                        <li><a href="../../Bill/Index">Force Bill</a></li>
                                        <li><a href="../../Bill/ChangeStatus">Change Bill Status</a></li>
                                        <li><a href="../../Bill/ReImburseBill">Re-Imburse Bill</a></li>
                                        <li><a href="../../Bill/ReAssignBill">Re-Assign Bill</a></li>
                                    </ul>
                                </li>
                                <li>
                                    Settings
                                    <ul>
                                        <li><a href="../../Setting/Index">Configuration</a></li>
                                        <li><a href="../../Email/Templates">Email Template</a></li>
                                        <li><a href="../../Setting/Policy">Manage Policy</a></li>
                                        <li><a href="../../Setting/Provider">Manage Provider</a></li>
                                    </ul>
                                </li>
                                <li>Reports </li>
                            </ul>
                        </div>
                    </td>
                </tr>
            </table>
        </div>--%>

    <div style="width: 100%">
        <table style="width: 100%">
            <tr>
                <td class="myButton3">Email Template
                </td>
            </tr>
        </table>
    </div>
    <input type="text" id="lblId" style="display: none" />
    <table class="myButton1">
        <tr>
            <td>Template Type</td>
            <td>
                <%--<div id='cmbTemplate'></div>--%>
                <select id="cmbTemplate" class="form-select">
                </select>
            </td>
        </tr>
        <tr>
            <td>Country</td>
            <td>
                <%--<div id='cmbCountry'></div>--%>
                <select id="cmbCountry" class="form-select">
                </select>
            </td>
        </tr>
        <tr>
            <td>Email Text</td>
            <td>
                <textarea id="txtTemplate" rows="7" cols="50"></textarea></td>
        </tr>
        <tr>
            <td>Email From</td>
            <td>
                <input type="text" id="txtEmailFrom" /></td>
        </tr>
        <tr>
            <td>Email BCC</td>
            <td>
                <input type="text" id="txtEmailBCC" /></td>
        </tr>
    </table>

    <table>
        <tr>
            <td>{0} = Employee Name
            </td>
            <td>, {1} = Bill Amount
            </td>
            <td>, {2} = Bill Date
            </td>
            <td>, {3} = Telephone Number
            </td>
            <td>, {4} = Manager
            </td>
            <td>, {5} = Provider
            </td>
            <td>, {6} = Link
            </td>
            <td>, {7} = Deductible Amount
            </td>


        </tr>

    </table>

    <table>
        <tr>
            <td>
                <button id="btnSave" onclick="TemplateSave()">Save</button>
            </td>
        </tr>
    </table>

    <div id="grdTemplates"></div>

</asp:Content>
