$(document).ready(function () {
    $('#jqxTabs').jqxTabs({ width: '100%', position: 'top' });
    $("#cmbStartDate").jqxDateTimeInput({ width: '170px', height: '25px' });
    $("#cmbEndDate").jqxDateTimeInput({ width: '170px', height: '25px' });
    GetPage();

    $("#cmbStatus").jqxDropDownList({ width: '170px', height: '25px' });
    $("#cmbStatus").jqxDropDownList('loadFromSelect', 'Select');
    $("#cmbStatus").jqxDropDownList('selectIndex', 1);

    $("#cmbStartDate2").jqxDateTimeInput({ width: '170px', height: '25px' });
    $("#cmbEndDate2").jqxDateTimeInput({ width: '170px', height: '25px' });
    $("#cmbStatus2").jqxDropDownList({ width: '170px', height: '25px' });
    $("#cmbStatus2").jqxDropDownList('loadFromSelect', 'Select2 ');
    $("#cmbStatus2").jqxDropDownList('selectIndex', 1);


});

function GetPage() {
    $.ajax({
        type: "GET",
        cache: false,
        url: "../../EmailSMSReport/EmailSMSReport",
        success: function (result) {

        }
    });
}

function SearchEmail() {

    var date1 = $("#cmbStartDate").jqxDateTimeInput('getDate');
    var date2 = $("#cmbEndDate").jqxDateTimeInput('getDate');
    var formattedDate1 = $.jqx.dataFormat.formatdate(date1, 'yyyy-MM-dd');
    var formattedDate2 = $.jqx.dataFormat.formatdate(date2, 'yyyy-MM-dd 23:59:59');

    var Result = $("#cmbStatus").jqxDropDownList('getSelectedItem');

    var value = {
        "StartDate": formattedDate1,
        "EndDate": formattedDate2,
        "Status": Result.value
    };
    var obji = { Search: value }
    $.ajax({
        type: "POST",
        url: "../../EmailSMSReport/SearchEmail",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            var Report = result.dtEmailReport;
            FillEmailReport(Report)
        }
    });
}

function FillEmailReport(Report) {
    var Email =
    {
        dataType: "json",
        dataFields: [
            { name: 'Id', type: 'number' },
            { name: 'TemplateId', type: 'number' },
            { name: 'TemplateName', type: 'string' },
            { name: 'Subject', type: 'string' },
            { name: 'EmailText', type: 'string' },
            { name: 'EmailFrom', type: 'string' },
            { name: 'EmailTo', type: 'string' },
            { name: 'IsSent', type: 'number' },
            { name: 'senton', type: 'string' },
        ],
        id: 'Id',
        localdata: Report
    };
    var dataAdapterEmail = new $.jqx.dataAdapter(Email);
    $("#grdEmailReport").jqxGrid({
        width: '100%',
        source: dataAdapterEmail,
        columnsresize: true,
        theme: 'dark-blue',
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        editable: true,
        columns: [
            { dataField: 'Id', text: 'Id', hidden: 'true' },
            { dataField: 'TemplateId', text: 'Temp. Id', width: '80px', editable: false, hidden: 'true' },
            { dataField: 'TemplateName', text: 'Template', editable: false },
            { dataField: 'Subject', text: 'Subject', editable: false },
            { dataField: 'EmailText', text: 'Email Text' },
            { dataField: 'EmailFrom', text: 'Email From', editable: false },
            { dataField: 'EmailTo', text: 'Email To' },
            { dataField: 'IsSent', text: 'Sent', editable: false },
            { dataField: 'senton', text: 'Sent On', editable: false, hidden: 'true' }
        ]
    });

}

function SearchSMS() {

    var date1 = $("#cmbStartDate2").jqxDateTimeInput('getDate');
    var date2 = $("#cmbEndDate2").jqxDateTimeInput('getDate');
    var formattedDate1 = $.jqx.dataFormat.formatdate(date1, 'yyyy-MM-dd');
    var formattedDate2 = $.jqx.dataFormat.formatdate(date2, 'yyyy-MM-dd 23:59:59');

    var Result = $("#cmbStatus2").jqxDropDownList('getSelectedItem');

    var value = {
        "StartDate": formattedDate1,
        "EndDate": formattedDate2,
        "Status": Result.value
    };
    var obji = { Search: value }
    $.ajax({
        type: "POST",
        url: "../../EmailSMSReport/SearchSMS",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            var Report = result.dtSMSReport;
            FillSMSReport(Report)
        }
    });
}

function FillSMSReport(Report) {
    var SMS =
    {
        dataType: "json",
        dataFields: [
            { name: 'ID', type: 'number' },
            { name: 'SMSTemplateId', type: 'number' },
            { name: 'SMSTemplateName', type: 'string' },
            { name: 'SMSTo', type: 'string' },
            { name: 'Message', type: 'string' }
        ],
        id: 'ID',
        localdata: Report
    };
    var dataAdapterSMS = new $.jqx.dataAdapter(SMS);
    $("#grdSMSReport").jqxGrid({
        width: '100%',
        source: dataAdapterSMS,
        columnsresize: true,
        theme: 'dark-blue',
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        editable: true,
        columns: [
            { dataField: 'ID', text: 'Id', hidden: 'true' },
            { dataField: 'SMSTemplateId', text: 'Temp. Id', width: '80px', editable: false, hidden: 'true' },
            { dataField: 'SMSTemplateName', text: 'Template', editable: false },
            { dataField: 'SMSTo', text: 'Mobile', editable: false },
            { dataField: 'Message', text: 'Message' }
        ]
    });

}