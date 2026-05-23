<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Provider
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <script src="../../Scripts/Provider.js"></script>

    <div style="width: 100%">
        <table style="width: 100%">
            <tr>
                <td class="myButton3">Manage Provider
                </td>
            </tr>
        </table>
    </div>
    <div>
        <table>
            <tr>
                <td>
                    <input id="hidID" type="hidden" />
                </td>
            </tr>
            <tr>
                <td>
                    <b>Provider Name :</b>
                </td>
                <td>
                    <input id="txtProvider" type="text" />
                </td>
            </tr>
            <tr>
                <td>
                    <b>Is Voip </b>
                </td>
                <td>
                    <div id="chkVoip">
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <br />
    <div>
        <table>
            <tr>
                <td>
                    <input id="btnAdd" type="button" value="Add" />
                </td>
                <td>
                    <input id="btnUpdate" type="button" value="Update" />
                </td>
                <td>
                    <input id="btnDelete" type="button" value="Delete" />
                </td>
                <td>
                    <input id="btnCancel" type="button" value="Cancel" />
                </td>
            </tr>
        </table>
    </div>
    <br />
    <div>
        <div id="grdData">
        </div>
    </div>
</asp:Content>
