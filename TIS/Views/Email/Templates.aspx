<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic> " %>


<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Email Template
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <script src="../../Scripts/TemplatesJS.js"></script>
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
                <%--<button id="btnSave" onclick="TemplateSave()">Save</button>--%>
                <button id="btnSaveEmailTemplate" type="button" class="btn btn-success h-fit"><i class="fas fa-plus-circle me-2"></i>Save</button>
            </td>
        </tr>
    </table>

    <div id="grdTemplates"></div>

</asp:Content>
