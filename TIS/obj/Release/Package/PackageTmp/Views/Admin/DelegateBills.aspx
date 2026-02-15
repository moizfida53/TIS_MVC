

<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    DelegateBills
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <script src="../../Scripts/DelegateBills.js"></script>

    
    <div style="width: 100%">
        <table style="width: 100%">
            <tr>
                <td class="myButton3">Manage Delegation of Bills
                </td>
            </tr>
        </table>
    </div>
    <div>
        <div class="myButton1">
            <table>

                <tr style="height: 30px; padding-bottom: 20px">
                    <td style="text-align: right">
                        <input id="hidID" type="hidden" />

                        <input id="hidMan" type="hidden" />

                        <input id="hidSec" type="hidden" />
                        Select Bill Owner
                    </td>
                    <td>
                        <div id="btnMan">
                            <div id="grdMan">
                            </div>
                        </div>
                    </td>
                </tr>

                <tr style="height: 50px; padding-bottom: 20px">
                    <td style="text-align: right">Delegate To
                    </td>
                    <td>
                        <div id="btnSec">
                            <div id="grdSec">
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2"></td>

                </tr>
                <tr style="height: 50px; padding-bottom: 40px">
                    <td>
                        <input type="checkbox" id='chkIdt' />Identification of Bills
                    </td>
                    <td style="width: 20px"></td>
                    <td>
                        <input type="checkbox" id='chkApp' />Approve Bills
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type='button' value='Add' class="myButton" id='btnAdd' onclick='Add()' />

                        <input type='button' value='Update' class="myButton" id='btnUpdate' onclick='Update()' />
                    </td>

                    <td>
                        <input type='button' value='Cancel' class="myButton" onclick='Clear()' />
                    </td>
                    <td>
                        <input type='button' value='Delete' class="myButton" id='btnDel' onclick='Del()' />
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <div id="grdData">
    </div>

    <div>
        <table>
            <tr>
                <td>
                    <input id="excelExport" type="button" value="Export To Excel" />
                </td>
            </tr>
        </table>
    </div>


</asp:Content>

