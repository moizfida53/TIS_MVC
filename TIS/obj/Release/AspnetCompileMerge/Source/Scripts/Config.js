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
    FillConfig();
})
$(document).on('click', '#btnSave', function (e) {
    e.preventDefault();
    if (typeof SaveConfig === 'function') {
        SaveConfig();
    }
});
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