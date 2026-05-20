$(document).ready(function () {
    GetEmail();
});

$(document).on('cellendedit', '#grdSendEmail', function (e) {
    debugger;
    var args = e.args;
    var columnDataField = args.datafield;
    var rowIndex = args.rowindex;
    var cellValue = args.value;
    Save(rowIndex, columnDataField, cellValue)
});

function GetEmail() {
    $.ajax({
        type: "GET",
        cache: false,
        url: "../../SendEmail/GetEmail",
        success: function (result) {
            var Email = result.dtSendEmail;
            FillEmail(Email);
        }
    });
}

function FillEmail(Email) {
    var Email =
    {
        dataType: "json",
        dataFields: [
            { name: 'Id', type: 'number' },
            { name: 'TemplateId', type: 'number' },
            { name: 'Bill_Id', type: 'number' },
            { name: 'BillDate', type: 'string' },   // ← NEW
            { name: 'Subject', type: 'string' },
            { name: 'EmailText', type: 'string' },
            { name: 'EmailFrom', type: 'string' },
            { name: 'EmailTo', type: 'string' },
            { name: 'CC', type: 'string' },
            { name: 'sent', type: 'bool' },
            { name: 'senton', type: 'string' },
        ],
        id: 'Id',
        localdata: Email
    };
    var dataAdapterEmail = new $.jqx.dataAdapter(Email);
    $("#grdSendEmail").jqxGrid({
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
        selectionmode: 'checkbox',
        columns: [
            { dataField: 'Id', text: 'Id', hidden: true },
            { dataField: 'TemplateId', text: 'Temp. Id', hidden: true },          // ← HIDDEN
            { dataField: 'Bill_Id', text: 'Bill Id', hidden: true },          // ← HIDDEN
            { dataField: 'BillDate', text: 'Bill Date', width: '110px', editable: false }, // ← NEW VISIBLE COLUMN
            { dataField: 'Subject', text: 'Subject', editable: false },
            { dataField: 'EmailText', text: 'Email Text' },
            { dataField: 'EmailFrom', text: 'Email From', editable: false },
            { dataField: 'EmailTo', text: 'Email To' },
            { dataField: 'CC', text: 'CC' },
            { dataField: 'sent', text: 'Sent', editable: false },
            { dataField: 'senton', text: 'Sent On', editable: false, hidden: true }
        ]
    });
}

function SendEmail() {
    debugger
    var Bill_Id = [];
    var Indexes = $('#grdSendEmail').jqxGrid('getselectedrowindexes');
    for (var i = 0; i < Indexes.length; i++) {
        var RowData = $('#grdSendEmail').jqxGrid('getrowdata', Indexes[i]);
        var BID = RowData.Bill_Id;
        Bill_Id.push(BID);
    }
    if (Bill_Id.length > 0) {
        var value = {
            "BID": Bill_Id
        };
        var obji = { value: value }
        $.ajax({
            type: "POST",
            url: "../../SendEmail/Send",
            data: JSON.stringify(obji),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                GetEmail();
                if (result.Message == 'Email Sent') {
                    $.alert.open('info', 'Success', 'Email Sent Successfully');
                    $('#grdSendEmail').jqxGrid('clearselection');
                }
                else {
                    $.alert.open('error', 'Error', 'Email Sending Fail...');
                }
            }
        });
    }
    else {
        alert("Please select at least one record.");
    }
}

function DeleteEmail() {
    var EmailID = [];
    var Indexes = $('#grdSendEmail').jqxGrid('getselectedrowindexes');
    for (var i = 0; i < Indexes.length; i++) {
        var RowData = $('#grdSendEmail').jqxGrid('getrowdata', Indexes[i]);
        var Id = RowData.Id;
        EmailID.push(Id);
    }

    var value = {
        "EmailID": EmailID
    };
    var obji = { value: value }
    $.ajax({
        type: "POST",
        url: "../../SendEmail/DeleteEmail",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            GetEmail();
            if (result.Message == 'Deleted') {
                $('#grdSendEmail').jqxGrid('clearselection');
                $.alert.open('info', 'Success', 'Email Deleted Successfully');
            }
            else {
                $.alert.open('error', 'Error', 'Cannot Delete, Please Try Again.');
            }
        }
    });
}

function Save(rowIndex, columnDataField, cellValue) {
    var RowData = $('#grdSendEmail').jqxGrid('getrowdata', rowIndex);

    var Bill_Id = (columnDataField == "Bill_Id") ? cellValue : RowData.Bill_Id;
    var EmailText = (columnDataField == "EmailText") ? cellValue : RowData.EmailText;
    var EmailTo = (columnDataField == "EmailTo") ? cellValue : RowData.EmailTo;
    var CC = (columnDataField == "CC") ? cellValue : RowData.CC;

    var value = {
        "Bill_Id": Bill_Id,
        "EmailText": EmailText,
        "EmailTo": EmailTo,
        "CC": CC,
    };
    var obji = { value: value }
    $.ajax({
        type: "POST",
        url: "../../SendEmail/Save",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            GetEmail();
        }
    });
}

$(document).on('click', '#btnSend', function (e) {
    e.preventDefault();
    if (typeof SendEmail === 'function') {
        SendEmail();
    }
});

$(document).on('click', '#btnDeleteEmail', function (e) {
    e.preventDefault();
    if (typeof DeleteEmail === 'function') {
        DeleteEmail();
    }
});