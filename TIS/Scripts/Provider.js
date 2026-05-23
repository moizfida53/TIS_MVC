$(document).ready(function () {
    $("#chkVoip").jqxCheckBox({ width: 30, height: 25 });
    $("#btnAdd").jqxButton({ template: 'primary' });
    $('#btnAdd').on('click', function () {
        Add();

    });
    $("#btnUpdate").jqxButton({ template: 'primary' });
    $('#btnUpdate').on('click', function () {
        Update();
    });
    $("#btnUpdate").hide();
    $("#btnDelete").jqxButton({ template: 'primary' });
    $('#btnDelete').on('click', function () {
        Delete();
    });
    $("#btnCancel").jqxButton({ template: 'primary' });
    $('#btnCancel').on('click', function () {
        Clear();
    });
    $("#btnDelete").hide();
    FillGrid();

})
function FillGrid() {

    $.ajax({
        type: "GET",
        cache: false,
        url: "../../Setting/GetProvider",
        success: function (result) {
            var Bills = result.ProviderList;
            var deptsource =
            {
                localdata: Bills,
                datafields:
                    [
                        { name: 'ID', type: 'number' },
                        { name: 'NAME', type: 'date' },
                        { name: 'CountryId', type: 'number' },
                        { name: 'IsVoip', type: 'bool' }
                    ],
                datatype: "json"
            };

            var DataAdapPdr = new $.jqx.dataAdapter(deptsource);
            $("#grdData").jqxGrid({
                width: '100%',
                source: DataAdapPdr,
                columnsresize: true,
                theme: 'dark-blue',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,

                selectionmode: 'singlerow',
                columns: [
                    { dataField: 'ID', text: 'ID' },
                    { dataField: 'NAME', text: 'NAME' },
                    { dataField: 'CountryId', text: 'Country Id' },
                    { dataField: 'IsVoip', text: 'Is Voip', columntype: 'checkbox' }
                ]
            });
            $("#grdData").on('rowselect', function (event) {
                idx = event.args.rowindex;
                var datarow = $("#grdData").jqxGrid('getrowdata', idx);
                var ID = datarow.ID;
                var NAME = datarow.NAME;
                var IsVoip = datarow.IsVoip;
                $('#hidID').val(ID);
                $("#txtProvider").val(NAME);
                $("#chkVoip").jqxCheckBox({ checked: IsVoip });
                $("#btnAdd").hide();
                $("#btnUpdate").show();
                $("#btnDelete").show();

            })
        }
    });
}
function Add() {

    if ($("#txtProvider").val() == '') {
        alert('Please Enter Provider Name');
        return;
    }

    var Pro = {

        "NAME": $("#txtProvider").val(),
        "IsVoip": $('#chkVoip').jqxCheckBox('checked')
    };
    var obji = { Provider: Pro }
    $.ajax({
        type: "POST",
        url: "../../Setting/AddProvider",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            alert(result.Message);
            Clear();
            FillGrid();
        }
    });
}
function Update() {

    if ($("#txtProvider").val() == '') {
        alert('Please Enter Provider Name');
        return;
    }

    var Pro = {
        "ID": $("#hidID").val(),
        "NAME": $("#txtProvider").val(),
        "IsVoip": $('#chkVoip').jqxCheckBox('checked')
    };
    var obji = { Provider: Pro }
    $.ajax({
        type: "POST",
        url: "../../Setting/UpdateProvider",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            alert(result.Message);
            Clear();
            FillGrid();
        }
    });
}
function Delete() {


    var Pro = {
        "ID": $("#hidID").val()
    };
    var obji = { Provider: Pro }
    $.ajax({
        type: "POST",
        url: "../../Setting/DeleteProvider",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            alert(result.Message);
            Clear();
            FillGrid();
        }
    });
}
function Clear() {
    $("#grdData").jqxGrid('clearselection');
    $("#hidID").val("");
    $("#txtProvider").val("");
    $("#chkVoip").jqxCheckBox({ checked: false });
    $("#btnAdd").show();
    $("#btnUpdate").hide();
    $("#btnDelete").hide();
}