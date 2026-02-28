<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Config
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <script src="../../Scripts/Config.js"></script>
     <div style="width: 100%">
        <table style="width: 100%">
            <tr>
                <td class="myButton3">Configuration
                </td>
            </tr>
        </table>
    </div>
    <div>
        <div class="data_table">
            <div class="top1">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Employee Reminder :</b>
                        </td>
                        <td>
                            <input id="txtEmpReminder" type="text" />
                            <span style="font-size: smaller;">in (Days)</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top2">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Manager Complaint Reminder :</b>
                        </td>
                        <td>
                            <input id="txtMgrReminder" type="text" />
                            <span style="font-size: smaller;">in (Days)</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top1">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Force Bill Reminder:</b>
                        </td>
                        <td>
                            <input id="txtFBReminder" type="text" />
                            <span style="font-size: smaller;">in (Days)</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top2">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Line Manager Approval Reminder :</b>
                        </td>
                        <td>
                            <input id="txtLMReminder" type="text" />
                            <span style="font-size: smaller;">in (Days)</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top1">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>SMTP Settings :</b>
                        </td>
                        <td>
                            <input id="txtSMTP" type="text" />
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top2">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Admin Email :</b>
                        </td>
                        <td>
                            <input id="txtAdminEmail" type="text" />
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top1">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Host Url :</b>
                        </td>
                        <td>
                            <input id="txtHostUrl" type="text" />
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top2">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Supervisor Grade :</b>
                        </td>
                        <td>
                            <input id="txtSupGrade" type="text" />
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top1">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Enable Grade :</b>
                        </td>
                        <td>
                            <div id="chkGrade">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top2">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Don't Send Email :</b>
                        </td>
                        <td>
                            <div id="chkEmail">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top1">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Hide Personal Calls :</b>
                        </td>
                        <td>
                            <div id="chkHidePerCalls">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top2">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Skip GM Approval :</b>
                        </td>
                        <td>
                            <div id="chkGM">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top1">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Enable Discrepancy :</b>
                        </td>
                        <td>
                            <div id="chkDiscrepancy">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top2">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Skip Approval if Business Charges is Zero :</b>
                        </td>
                        <td>
                            <div id="chkSkipAppBusZero">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top1">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Deduct Business Charges :</b>
                        </td>
                        <td>
                            <div id="chkDedBusCharges">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top2">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Consider Zero Bussiness limit as unlimited:</b>
                        </td>
                        <td>
                            <div id="chkZeroUnlimited">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top1">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Allow Waiver :</b>
                        </td>
                        <td>
                            <div id="chkAlwWav">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top2">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Enable Delete in Import :</b>
                        </td>
                        <td>
                            <div id="chkDelete">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top1">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Allow Train in ForceBill :</b>
                        </td>
                        <td>
                            <div id="chkAlwTrainFB">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top2">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Hide Allowance:</b>
                        </td>
                        <td>
                            <div id="chkAllowance">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top1">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Hide Personal:</b>
                        </td>
                        <td>
                            <div id="chkPersonal">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top2">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Version :</b>
                        </td>
                        <td>
                            16.1
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top1">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                            <b>Dated :</b>
                        </td>
                        <td>
                            1-March-2026
                        </td>
                    </tr>
                </table>
            </div>
            <div class="top1">
                <table width="100%">
                    <tr>
                        <td style="text-align: right; width: 350px">
                        </td>
                        <td>
                            <input id="btnSave" type="button" value="Save Configuration"  class="btn btn-primary"/>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</asp:Content>
