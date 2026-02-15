<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Config
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    
    <script type="text/javascript">
        $(document).ready(function () {
            $('#chkGrade').jqxCheckBox({ width: "30px", height: "25px" });
            $('#chkEmail').jqxCheckBox({ width: "30px", height: "25px" });
            $('#chkHidePerCalls').jqxCheckBox({ width: "30px", height: "25px" });
            $('#chkGM').jqxCheckBox({ width: "30px", height: "25px" });
            $('#chkDiscrepancy').jqxCheckBox({ width: "30px", height: "25px" });
            $('#chkSkipAppBusZero').jqxCheckBox({ width: "30px", height: "25px" });
            $('#chkDedBusCharges').jqxCheckBox({ width: "30px", height: "25px" });
            $('#chkZeroUnlimited').jqxCheckBox({ width: "30px", height: "25px" });
            $('#chkAlwWav').jqxCheckBox({ width: "30px", height: "25px" });
            $('#chkDelete').jqxCheckBox({ width: "30px", height: "25px" });
            $('#chkAlwTrainFB').jqxCheckBox({ width: "30px", height: "25px" });

            $('#chkAllowance').jqxCheckBox({ width: "30px", height: "25px" });
            $('#chkPersonal').jqxCheckBox({ width: "30px", height: "25px" });



            $("#btnSave").jqxButton({ template: 'primary' });
            $('#btnSave').on('click', function () {
                SaveConfig();

            });
            FillConfig();
        })
        function FillConfig() {

            $.ajax({
                type: "GET",
                cache: false,
                  url: "../../Setting/GetConfig",
                success: function (result) {
                    var Data = result.dtConfig;
                    $('#txtEmpReminder').val(Data.EmpReminder);
                    $('#txtMgrReminder').val(Data.MgrReminder);
                    $('#txtFBReminder').val(Data.FBReminder);
                    $('#txtLMReminder').val(Data.LMReminder);
                    $('#txtSMTP').val(Data.SMTP);
                    $('#txtAdminEmail').val(Data.AdminEmail);
                    $('#txtHostUrl').val(Data.HostUrl);
                    $('#txtSupGrade').val(Data.SupGrade);
                    $('#chkGrade').jqxCheckBox({ checked: Data.EnableGrade });
                    $('#chkEmail').jqxCheckBox({ checked: Data.DntSndEmail });
                    $('#chkHidePerCalls').jqxCheckBox({ checked: Data.HidePerCalls });
                    $('#chkGM').jqxCheckBox({ checked: Data.GMApp });
                    $('#chkDiscrepancy').jqxCheckBox({ checked: Data.EnableDiscrepancy });
                    $('#chkSkipAppBusZero').jqxCheckBox({ checked: Data.SkipAppBusZero });
                    $('#chkDedBusCharges').jqxCheckBox({ checked: Data.DedBusCharges });
                    $('#chkZeroUnlimited').jqxCheckBox({ checked: Data.ZeroUnlimited });
                    $('#chkAlwWav').jqxCheckBox({ checked: Data.AlwWav });
                    $('#chkDelete').jqxCheckBox({ checked: Data.EnableDelete });
                    $('#chkAlwTrainFB').jqxCheckBox({ checked: Data.AlwTrainFB });


                    $('#chkAllowance').jqxCheckBox({ checked: Data.HideAllowanceLimit });
                    $('#chkPersonal').jqxCheckBox({ checked: Data.HidePersonalLimit });



                }
            });
        }

        function SaveConfig() {

            var Config = {
                "EmpReminder": $('#txtEmpReminder').val(),
                "MgrReminder": $('#txtMgrReminder').val(),
                "FBReminder": $('#txtFBReminder').val(),
                "LMReminder": $('#txtLMReminder').val(),
                "SMTP": $('#txtSMTP').val(),
                "AdminEmail": $('#txtAdminEmail').val(),
                "HostUrl": $('#txtHostUrl').val(),
                "SupGrade": $('#txtSupGrade').val(),


                "EnableGrade": $('#chkGrade').jqxCheckBox('val'),
                "DntSndEmail": $('#chkEmail').jqxCheckBox('val'),
                "HidePerCalls": $('#chkHidePerCalls').jqxCheckBox('val'),
                "GMApp": $('#chkGM').jqxCheckBox('val'),
                "EnableDiscrepancy": $('#chkDiscrepancy').jqxCheckBox('val'),
                "SkipAppBusZero": $('#chkSkipAppBusZero').jqxCheckBox('val'),
                "DedBusCharges": $('#chkDedBusCharges').jqxCheckBox('val'),



                "ZeroUnlimited": $('#chkZeroUnlimited').jqxCheckBox('val'),
                "AlwWav": $('#chkAlwWav').jqxCheckBox('val'),
                "EnableDelete": $('#chkDelete').jqxCheckBox('val'),
                "AlwTrainFB": $('#chkAlwTrainFB').jqxCheckBox('val'),
                "HideAllowanceLimit": $('#chkAllowance').jqxCheckBox('val'),
                "HidePersonalLimit": $('#chkPersonal').jqxCheckBox('val')


            };
            var obji = { Config: Config }
            $.ajax({
                type: "POST",
                cache: false,
                  url: "../../Setting/SaveConfig",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    alert(result.Message);
                }
            })
        }
    </script>
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
                            <input id="btnSave" type="button" value="Save Configuration" />
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</asp:Content>
