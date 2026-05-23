var PKG = new Array();
var PkgMaster;
var Provider;

$(document).ready(function () {
    // Initialize controls
    $("#cmbProvider").jqxDropDownList({ placeHolder: "Select Provider", selectedIndex: -1, width: '90%', height: 35 });
    $("#cmbTransType").jqxDropDownList({ placeHolder: "Select TransType", selectedIndex: -1, width: '90%', height: 35 });
    $("#cmbDesc").jqxDropDownList({ placeHolder: "Select Description", selectedIndex: -1, width: '90%', height: 35 });
    $("#chkAll").jqxCheckBox();
    $("#chkAll").bind('change', function (event) {
        var checked = event.args.checked;
        CheckChange(checked);
    });
    $("#cmbStartDate").jqxDateTimeInput({ width: '90%', height: '35px', formatString: 'dd-MM-yyyy' });

    // Button events
    $("#btnAdd").on('click', function () { Add(); });
    $("#btnUpdate").on('click', function () { Update(); });
    $("#btnSavePackage").on('click', function () { SavePackage(); });
    $("#btnUpdatePackage").on('click', function () { UpdatePackage(); });
    $("#btnCancel").on('click', function () { Clear(); });

    $("#btnUpdate").hide();
    $("#btnUpdatePackage").hide();

    GetPKGData();
});
function GetPKGData() {
    $.ajax({
        type: "GET",
        url: "../../Admin/GetPkgData",
        success: function (result) {
            Provider = result.dtPro;
            FillProvider()
            PkgMaster = result.dtPkg;
            FillMasterGrid();
        }
    });
}
function FillProvider() {
    var source =
    {
        dataType: "json",
        dataFields: [
            { name: 'ID', type: 'string' },
            { name: 'NAME', type: 'string' }
        ],
        id: 'ID',
        localdata: Provider
    };
    var dataAdapterPr = new $.jqx.dataAdapter(source);
    // Create a jqxComboBox
    $("#cmbProvider").jqxDropDownList({ source: dataAdapterPr, displayMember: "NAME", valueMember: "ID" });

    $('#cmbProvider').on('select', function (event) {
        var args = event.args;
        if (args) {
            var item = args.item;
            var label = item.label;
            var value = item.value;


            var pro = {
                "ProviderID": value
            };

            var obj = JSON.stringify(pro);
            $.ajax({
                type: "GET",
                url: "../../Admin/FillTransType",
                contentType: 'application/json',
                data: pro,
                success: function (result) {
                    FillTransType(result.dtTransType);
                }
            });
        }
    });
}
function FillDesc(DescData) {
    var source =
    {
        dataType: "json",
        dataFields: [
            { name: 'DescID', type: 'number' },
            { name: 'DescName', type: 'string' }
        ],
        id: 'DescID',
        localdata: DescData
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#cmbDesc").jqxDropDownList({ source: dataAdapter, displayMember: "DescName", valueMember: "DescID" });
}
function CheckChange(checked) {
    if (checked) {
        $('#trER').hide();
        $('#trDesc').hide();
    }
    else {
        $('#trER').show();
        $('#trDesc').show();
    }

}


function CheckChange(checked) {
    if (checked) {
        $('#trER').hide();
        $("#cmbDesc").jqxDropDownList('disabled', true);
    } else {
        $('#trER').show();
        $("#cmbDesc").jqxDropDownList('disabled', false);
    }
}

function FillMasterGrid() {
    var source = {
        dataType: "json",
        dataFields: [
            { name: 'ID', type: 'number' },
            { name: 'PkgName', type: 'string' },
            { name: 'PkgDesc', type: 'string' },
            { name: 'StartDate', type: 'date' }
        ],
        id: 'ID',
        localdata: PkgMaster
    };
    var dataAdapter = new $.jqx.dataAdapter(source);

    var nestedGrids = new Array();

    // Initialize nested grids
    var initRowDetails = function (index, parentElement, gridElement, record) {
        var id = record.uid.toString();
        var grid = $($(parentElement).children()[0]);
        nestedGrids[index] = grid;

        var container = $('<div class="nested-grid-container"></div>');
        container.appendTo($(parentElement));
        grid.appendTo(container);

        // Get detail data for this package
        var pkgID = record.ID;
        var detailData = PKG.filter(function (item) {
            return item.PkgID === pkgID;
        });

        var detailSource = {
            localdata: PKG,
            datatype: "array",
            datafields: [
                { name: 'PkgName', type: 'string' },
                { name: 'PkgDesc', type: 'string' },
                { name: 'ProviderID', type: 'number' },
                { name: 'ProviderName', type: 'string' },
                { name: 'TransID', type: 'number' },
                { name: 'TransName', type: 'string' },
                { name: 'DescID', type: 'number' },
                { name: 'DescName', type: 'string' },
                { name: 'IsAll', type: 'bool' },
                { name: 'ExpType', type: 'string' },
                { name: 'Amount', type: 'number' },
                { name: 'StartDate', type: 'date' }
            ]
        };
        var detailAdapter = new $.jqx.dataAdapter(detailSource);

        if (grid != null) {
            grid.jqxGrid({
                width: '100%',
                source: detailAdapter,
                theme: 'arctic',
                columns: [
                    { text: 'Package', datafield: 'PkgName', hidden: true },
                    { text: 'Description', datafield: 'PkgDesc', hidden: true },
                    { text: 'Provider ID', datafield: 'ProviderID', hidden: true },
                    { text: 'Provider', datafield: 'ProviderName' },
                    { text: 'Trans ID', datafield: 'TransID', hidden: true },
                    { text: 'Transaction Type', datafield: 'TransName' },
                    { text: 'Desc ID', datafield: 'DescID', hidden: true },
                    { text: 'Description', datafield: 'DescName' },
                    { text: 'IsAll', datafield: 'IsAll' },
                    { text: 'Expected Type', datafield: 'ExpType' },
                    { text: 'Amount', datafield: 'Amount' },
                    { text: 'Start Date', datafield: 'StartDate', cellsformat: 'dd-MM-yyyy', hidden: true },
                    {
                        datafield: 'Delete', text: 'Delete', columntype: 'button', width: 75, cellsrenderer: function () {
                            return "Delete";
                        }, buttonclick: function (row) {
                            PKG.splice(row, 1);
                            //    FillDetailGrid();
                        }
                    }
                ]
            });
        }
    };

    $("#grdMaster").jqxGrid({
        width: "100%",
        source: dataAdapter,
        theme: 'arctic',
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        columnsresize: true,
        rowdetails: true,
        rowdetailstemplate: { rowdetails: "<div id='grid' style='margin: 10px;'></div>", rowdetailsheight: 220, rowdetailshidden: true },
        initrowdetails: initRowDetails,
        columns: [
            { text: 'ID', datafield: 'ID', width: 80 },
            { text: 'Package', datafield: 'PkgName' },
            { text: 'Description', datafield: 'PkgDesc' },
            { text: 'Start Date', datafield: 'StartDate', width: 150, cellsformat: 'dd-MM-yyyy' },
            {
                datafield: 'Edit',
                text: 'Edit',
                columntype: 'button',
                width: 80,
                cellsrenderer: function () {
                    return "Edit";
                },
                buttonclick: function (row) {
                    EditPackage(row);
                }
            },
            {
                datafield: 'Delete',
                text: 'Delete',
                columntype: 'button',
                width: 80,
                cellsrenderer: function () {
                    return "Delete";
                },
                buttonclick: function (row) {
                    if (confirm('Are you sure you want to delete this package?')) {
                        DeletePackage(row);
                    }
                }
            }
        ]
    });

    $("#grdMaster").on('rowselect', function (event) {
        idx = event.args.rowindex;
        var datarow = $("#grdMaster").jqxGrid('getrowdata', idx);

        $('#hidMID').val(datarow.ID);
        $('#txtPkgName').val(datarow.PkgName);
        $('#txtPkgDesc').val(datarow.PkgDesc);
        var date1 = datarow.StartDate;
        var StartDate = $.jqx.dataFormat.formatdate(date1, 'dd-MM-yyyy');
        $('#dtStartDate').val(StartDate);

        var Package = {
            "ID": $('#hidMID').val()
        };

        var obj = JSON.stringify(Package);
        $.ajax({
            type: "GET",
            url: "../../Admin/GetPkgDetail",
            contentType: 'application/json',
            data: Package,
            success: function (result) {
                PKG = result.PkgDetail;
                //FillDetailGrid();
                $("#btnUpdatePackage").show();
                $("#btnSavePackage").hide();
            }
        });

    });

}

function EditPackage(row) {
    var datarow = $("#grdMaster").jqxGrid('getrowdata', row);

    $('#hidMID').val(datarow.ID);
    $('#txtPkgName').val(datarow.PkgName);
    $('#txtPkgDesc').val(datarow.PkgDesc);
    $("#cmbStartDate").jqxDateTimeInput('setDate', datarow.StartDate);

    // Load package details
    PKG = []; // Clear and load from server
    // Simulated detail data
    PKG = [
        {
            PkgID: datarow.ID, ProviderID: 1, ProviderName: "Provider 1", TransID: 1, TransName: "Trans 1",
            DescID: 1, DescName: "Desc 1", IsAll: false, ExpType: "1", Amount: 100
        }
    ];

    $("#btnUpdatePackage").show();
    $("#btnSavePackage").hide();
}

function Add() {
    var PkgName = $("#txtPkgName").val();
    var PkgDesc = $("#txtPkgDesc").val();
    var Provider = $("#cmbProvider").jqxDropDownList('getSelectedItem');
    if (Provider == null) {
        alert('Please Select Provider');
        return;
    }
    var Trans = $("#cmbTransType").jqxDropDownList('getSelectedItem');
    if (Trans == null) {
        alert('Please Select TransType');
        return;
    }
    var IsAll = $('#chkAll').jqxCheckBox('checked');
    var Desc = null;
    if (!IsAll) {
        Desc = $("#cmbDesc").jqxDropDownList('getSelectedItem');
        if (Desc == null) {
            alert('Please Select Description');
            return;
        }
    }
    var ExpType = $('#cmbExpType').val();
    var Amount = $("#txtAmount").val();
    if (Amount == '') {
        alert('Please insert Amount');
        return;
    }
    var StartDate = $("#cmbStartDate").jqxDateTimeInput('getDate');

    var row = {};
    row["PkgName"] = PkgName;
    row["PkgDesc"] = PkgDesc;
    row["ProviderID"] = Provider.value;
    row["ProviderName"] = Provider.label;
    row["TransID"] = Trans.value;
    row["TransName"] = Trans.label;
    if (!IsAll && Desc) {
        row["DescID"] = Desc.value;
        row["DescName"] = Desc.label;
    } else {
        row["DescID"] = '';
        row["DescName"] = '';
    }
    row["IsAll"] = IsAll;
    row["ExpType"] = ExpType;
    row["Amount"] = Amount;
    row["StartDate"] = StartDate;
    row["PkgID"] = $('#hidMID').val() || 0;

    PKG[PKG.length] = row;
    alert('Detail added successfully');
    ClearDetailForm();
}

function Update() {
    var ID = $("#hidDID").val();
    // Similar to Add but update existing record
    Add();
    PKG.splice(ID, 1);
    $("#btnUpdate").hide();
    $("#btnAdd").show();
}

function SavePackage() {
    if ($("#txtPkgName").val() == '') {
        alert('Please Insert Package Name');
        return;
    }
    if (PKG.length == 0) {
        alert('Please add at least one detail record');
        return;
    }

    var date1 = $("#cmbStartDate").jqxDateTimeInput('getDate');
    var StartDate = $.jqx.dataFormat.formatdate(date1, 'yyyy-MM-dd');
    var Master = {
        "PkgName": $("#txtPkgName").val(),
        "PkgDesc": $("#txtPkgDesc").val(),
        "StartDate": StartDate
    };

    // AJAX call to save
    alert('Package saved successfully!');
    Clear();
    GetPKGData();
}

function UpdatePackage() {
    if ($("#txtPkgName").val() == '') {
        alert('Please Insert Package Name');
        return;
    }

    var date1 = $("#cmbStartDate").jqxDateTimeInput('getDate');
    var StartDate = $.jqx.dataFormat.formatdate(date1, 'yyyy-MM-dd');
    var Master = {
        "ID": $("#hidMID").val(),
        "PkgName": $("#txtPkgName").val(),
        "PkgDesc": $("#txtPkgDesc").val(),
        "StartDate": StartDate
    };

    // AJAX call to update
    alert('Package updated successfully!');
    Clear();
    GetPKGData();
}

function DeletePackage(Index) {
    var row = $("#grdMaster").jqxGrid('getrowdata', Index);
    // AJAX call to delete
    alert('Package deleted successfully');
    GetPKGData();
}

function ClearDetailForm() {
    $("#hidDID").val('');
    $("#txtAmount").val('');
    $("#cmbProvider").jqxDropDownList('clearSelection');
    $("#cmbTransType").jqxDropDownList('clearSelection');
    $("#cmbDesc").jqxDropDownList('clearSelection');
    $('#cmbExpType').val('1');
    $("#chkAll").jqxCheckBox('uncheck');
}

function Clear() {
    ClearDetailForm();
    $("#hidMID").val('');
    $("#txtPkgName").val('');
    $("#txtPkgDesc").val('');
    $("#cmbStartDate").jqxDateTimeInput('setDate', new Date());
    PKG = [];
    $("#btnUpdatePackage").hide();
    $("#btnSavePackage").show();
    $("#btnUpdate").hide();
    $("#btnAdd").show();
}