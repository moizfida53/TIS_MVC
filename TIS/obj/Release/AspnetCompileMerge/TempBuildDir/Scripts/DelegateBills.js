var Employees;
var SecData;
$(document).ready(function () {
    $('#btnUpdate').hide();
    $('#btnDel').hide();

    var dropDownContent = '<div style="position: relative; margin: 3px; ">Select Employee</div>';
    $("#btnMan").jqxDropDownButton({ width: 150, height: 25 });
    $("#btnMan").jqxDropDownButton('setContent', dropDownContent);
    $('#btnMan').on('open', function () { FillManager(); });


    var dropDownContent1 = '<div style="position: relative; margin: 3px; ">Delegate To</div>';
    $("#btnSec").jqxDropDownButton({ width: 150, height: 25 });
    $("#btnSec").jqxDropDownButton('setContent', dropDownContent1);
    $('#btnSec').on('open', function () { FillSecretary(); });


    GetData();

})

// delegated handlers to replace inline onclicks from DelegateBills.aspx
$(document).on('click', '#btnAdd', function (e) {
    debugger;
    e.preventDefault();
    if (typeof Add === 'function') Add();
});

$(document).on('click', '#btnUpdate', function (e) {
    e.preventDefault();
    if (typeof Update === 'function') Update();
});

$(document).on('click', '#btnDel', function (e) {
    e.preventDefault();
    if (typeof Del === 'function') Del();
});

$(document).on('click', '#btnCancel', function (e) {
    e.preventDefault();
    if (typeof Clear === 'function') Clear();
});

// delegated handler for excel export (replaces direct .click binding)
$(document).on('click', '#excelExport', function (e) {
    e.preventDefault();
    if (typeof saveMyFile === 'function') {
        var exported = $("#grdData").jqxGrid('exportdata', 'xls');
        saveMyFile($('#SubmitForm'), "My Excel File.xls", exported, 'application/vnd.ms-excel');
    }
});

function GetData() {
    $.ajax({
        type: "GET",
        url: "../../Admin/GetDelegate",
        success: function (result) {
            Employees = result.EmpList;
            SecData = result.dtSec;
            FillGrid();
        }
    });
}
function GetGrid() {
    $.ajax({
        type: "GET",
        url: "../../Admin/GetSecretary",
        success: function (result) {
            SecData = result.dtSec;
            FillGrid();
        }
    });
}
function FillManager() {
    var sourceEmp =
    {
        dataType: "json",
        dataFields: [
            { name: 'EmpId', type: 'string' },
            { name: 'EmpName', type: 'string' },
            { name: 'EmpNo', type: 'string' }
        ],
        id: 'EmpId',
        localdata: Employees
    };
    var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
    $("#grdMan").jqxGrid({
        width: '100%',
        source: dataAdapterEmp,
        columnsresize: true,
        theme: 'dark-blue',
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        columns: [
            { dataField: 'EmpId', text: 'EID' },
            { dataField: 'EmpName', text: 'Emp Name' },
            { dataField: 'EmpNo', text: 'Emp No' }]
    });

    $("#grdMan").on('rowselect', function (event) {
        var args = event.args;
        var row = $("#grdMan").jqxGrid('getrowdata', args.rowindex);
        var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['EmpName'] + ' - ' + row['EmpNo'] + '</div>';
        $('#hidMan').val(row['EmpId']);
        $("#btnMan").jqxDropDownButton('setContent', dropDownct);
        $('#btnMan').jqxDropDownButton('close');
    });
}
function FillSecretary() {
    var sourceEmp =
    {
        dataType: "json",
        dataFields: [
            { name: 'EmpId', type: 'string' },
            { name: 'EmpName', type: 'string' },
            { name: 'EmpNo', type: 'string' }
        ],
        id: 'EmpId',
        localdata: Employees
    };
    var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
    $("#grdSec").jqxGrid({
        width: '100%',
        source: dataAdapterEmp,
        theme: 'dark-blue',
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        columns: [
            { dataField: 'EmpId', text: 'EID' },
            { dataField: 'EmpName', text: 'Emp Name' },
            { dataField: 'EmpNo', text: 'Emp No' }]
    });

    $("#grdSec").on('rowselect', function (event) {
        var args = event.args;
        var row = $("#grdSec").jqxGrid('getrowdata', args.rowindex);
        var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['EmpName'] + ' - ' + row['EmpNo'] + '</div>';
        $('#hidSec').val(row['EmpId']);
        $("#btnSec").jqxDropDownButton('setContent', dropDownct);
        $('#btnSec').jqxDropDownButton('close');
    });
}
function FillGrid() {
    var deptsource =
    {
        localdata: SecData,
        datafields:
            [
                { name: 'ID', type: 'number' },
                { name: 'secid', type: 'number' },
                { name: 'SecName', type: 'string' },
                { name: 'managerid', type: 'number' },
                { name: 'ManName', type: 'string' },
                { name: 'app', type: 'bool' },
                { name: 'idt', type: 'bool' },
            ],
        datatype: "json"
    };

    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
    $("#grdData").jqxGrid({
        width: '100%',
        source: dataAdapterCategory,
        theme: 'dark-blue',
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,

        selectionmode: 'singlerow',
        columns: [
            { dataField: 'ID', text: 'ID', hidden: 'false' },
            { dataField: 'secid', text: 'secid', hidden: 'false' },
            { dataField: 'SecName', text: 'Delegated To' },
            { dataField: 'managerid', text: 'Bill Owner', hidden: 'false' },
            { dataField: 'ManName', text: 'Bill Owner' },
            { dataField: 'app', text: 'Approval Rights' },
            { dataField: 'idt', text: 'Identification Rights' },

        ]
    });
    $("#grdData").on('rowselect', function (event) {
        idx = event.args.rowindex;
        var datarow = $("#grdData").jqxGrid('getrowdata', idx);
        var ID = datarow.ID;
        var secid = datarow.secid;
        var SecName = datarow.SecName;
        var managerid = datarow.managerid;
        var ManName = datarow.ManName;
        var app = datarow.app;
        var idt = datarow.idt;
        $('#hidID').val(ID);
        $("#hidMan").val(managerid);
        $("#hidSec").val(secid);
        var dropDownContent = '<div style="position: relative; margin: 3px; ">' + ManName + '</div>';
        $("#btnMan").jqxDropDownButton('setContent', dropDownContent);
        var dropDownContent1 = '<div style="position: relative; margin: 3px; ">' + SecName + ' To</div>';
        $("#btnSec").jqxDropDownButton('setContent', dropDownContent1);
        $("#chkIdt").prop('checked', idt);
        $("#chkApp").prop('checked', app);

        $('#btnAdd').hide();
        $('#btnUpdate').show();
        $('#btnDel').show();
    });
}
function Add() {
    debugger;
    if ($("#hidMan").val() == '') {
        alert('Please Select Manager');
        return;
    }
    if ($("#hidSec").val() == '') {
        alert('Please Select Secretary');
        return;
    }

    var DelG = {
        "secid": $('#hidSec').val(),
        "managerid": $('#hidMan').val(),
        "app": $("#chkApp").is(':checked'),
        "idt": $("#chkIdt").is(':checked')
    };
    var obj = JSON.stringify(DelG);
    $.ajax({
        type: "GET",
        url: "../../Admin/SaveDelegate",
        contentType: 'application/json',
        data: DelG,
        success: function (result) {
            alert(result.myMessage);
            Clear();
            GetGrid();
            GetData();
        }
    });
}
function Update() {

    if ($("#hidMan").val() == '') {
        alert('Please Select Manager');
        return;
    }
    if ($("#hidSec").val() == '') {
        alert('Please Select Secretary');
        return;
    }

    var DelG = {
        "ID": $('#hidID').val(),
        "secid": $('#hidSec').val(),
        "managerid": $('#hidMan').val(),
        "app": $("#chkApp").is(':checked'),
        "idt": $("#chkIdt").is(':checked')
    };
    var obj = JSON.stringify(DelG);
    $.ajax({
        type: "GET",
        url: "../../Admin/UpdateDelegate",
        contentType: 'application/json',
        data: DelG,
        success: function (result) {
            alert(result.myMessage);
            Clear();
            GetGrid()
        }
    });
}
function Del() {

    var Dlg = {
        "ID": $("#hidID").val()
    };

    var obj = JSON.stringify(Dlg);
    $.ajax({
        type: "GET",
        url: "../../Admin/DeleteDelegate",
        contentType: 'application/json',
        data: Dlg,
        success: function (result) {
            Clear();
            alert(result.myMessage);
            GetGrid();
        }
    });

}
function Clear() {
    $("#hidMan").val('');
    $("#hidSec").val('');
    var dropDownContent = '<div style="position: relative; margin: 3px; ">Select Employee</div>';
    $("#btnMan").jqxDropDownButton('setContent', dropDownContent);
    var dropDownContent1 = '<div style="position: relative; margin: 3px; ">Delegate To</div>';
    $("#btnSec").jqxDropDownButton('setContent', dropDownContent1);
    $("#chkIdt").prop('checked', false);
    $("#chkApp").prop('checked', false);
    $("#grdData").jqxGrid('clearselection');
    $('#btnUpdate').hide();
    $('#btnDel').hide();
    $('#btnAdd').show();
}



function saveMyFile(ref, fname, text, mime) {
    var blob = new Blob([text], { type: mime });
    saveAs(blob, fname);
    return false;
}



