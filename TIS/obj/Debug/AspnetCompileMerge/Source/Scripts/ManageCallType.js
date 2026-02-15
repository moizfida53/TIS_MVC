
    $(document).ready(function () {
        $("#Panel1").css("border", "3px solid grey");
    $("#cmbTransType").jqxDropDownList({placeHolder: "Select TransType", width: 170, height: 25 });

    // FIX: Properly setup Description dropdown button
    $("#btnDesc").jqxDropDownButton({width: 170, height: 25 });
    $("#btnDesc").jqxDropDownButton('setContent', 'Select Description');
    $("#cmbDesc").jqxListBox({width: 200, height: 250 });

    $("#cmbLineType").jqxDropDownList({placeHolder: 'Select Line Type', selectedIndex: 2, width: '170px', height: '25px' });
    $("#cmbLineType").jqxDropDownList('loadFromSelect', 'Select');
    $("#Select").hide();
    $("#chkAllDesc").jqxCheckBox({width: 50, height: 45 });
    $("#chkAllDesc").bind('change', function (event) {
                var checked = event.args.checked;
    CheckChange(checked);
            });

    // FIX: Properly setup Employee dropdown button
    $("#btnEmployee").jqxDropDownButton({width: 170, height: 25 });
    $("#btnEmployee").jqxDropDownButton('setContent', 'Select Employee');

    $("#chkAllEmp").jqxCheckBox({width: 50, height: 45 });
    $("#chkAllEmp").bind('change', function (event) {
                var checked = event.args.checked;
    CheckChange2(checked);
            });
    $("#chkSupImp").jqxCheckBox({width: 50, height: 45 });
    $("#btnAdd").jqxButton({width: '50' });
    $("#btnAdd").on('click', function () {
        AddPolicy();
            });
    $("#btnUpdate").jqxButton({width: '50' });
    $("#btnUpdate").on('click', function () {
        UpdatePolicy();
            });
    $("#btnApply").jqxButton({width: '50' });
    $("#btnApply").on('click', function () {
        ApplyPolicy();
            });
    $("#btnCancel").jqxButton({width: '50' });
    $("#btnCancel").on('click', function () {
        Clear();
            });
    $("#jqxwindow").jqxWindow({height: 500, width: 420, theme: 'summer', isModal: true, autoOpen: false });
    $("#btnUpdate").hide();
    FillProvider();
    FillCallType();
    FillEmployee();
    FillGrid();
        })

    function FillProvider() {
        $.ajax({
            type: "GET",
            url: "../../Admin/GetProvider",
            success: function (result) {
                var Providers = result.ProviderList;
                var source =
                {
                    dataType: "json",
                    dataFields: [
                        { name: 'ID', type: 'string' },
                        { name: 'NAME', type: 'string' }
                    ],
                    id: 'ID',
                    localdata: Providers
                };
                var dataAdapterPr = new $.jqx.dataAdapter(source);
                // Create a jqxComboBox
                $("#cmbProvider").jqxDropDownList({ placeHolder: "Select Provider", selectedIndex: -1, source: dataAdapterPr, displayMember: "NAME", valueMember: "ID", width: 170, height: 25 });
            }
        });
    $('#cmbProvider').on('select', function (event) {
                var args = event.args;
    if (args) {
                    var item = args.item;
    // get item's label and value.
    var label = item.label;
    var value = item.value;


    var pro = {
        "ProviderID": value
                    };

    var obj = JSON.stringify(pro);
    $.ajax({
        type: "GET",
    url: "../../Setting/FillTransType",
    contentType: 'application/json',
    data: pro,
    success: function (result) {
        FillTransType(result.dtTransType);
                        }
                    });
                }
            });
        }

    function FillTransType(TransData) {

            var source =
    {
        dataType: "json",
    dataFields: [
    {name: 'TransType', type: 'string' }
    ],
    id: 'TransType',
    localdata: TransData
            };
    var dataAdapterPr = new $.jqx.dataAdapter(source);

    // FIX: Clear and rebind properly
    $('#cmbTransType').off('select');
    $("#cmbTransType").jqxDropDownList({
        selectedIndex: -1,
    source: dataAdapterPr,
    displayMember: "TransType",
    valueMember: "TransType",
    width: 170,
    height: 25
            });

    $('#cmbTransType').on('select', function (event) {
                var args = event.args;
    if (args) {

                    var item = args.item;
    var label = item.label;
    var value = item.value;
    var Provider = $("#cmbProvider").jqxDropDownList('getSelectedItem');

    var pro = {
        "TransType": label,
    "ProviderID": Provider.value
                    };

    var obj = JSON.stringify(pro);
    $.ajax({
        type: "GET",
    url: "../../Setting/FillDesc",
    contentType: 'application/json',
    data: pro,
    success: function (result) {
        FillDesc(result);
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
    {name: 'Description', type: 'string' }
    ],
    id: 'Description',
    localdata: DescData
            };
    var dataAdapter = new $.jqx.dataAdapter(source);

    // FIX: Update the listbox source
    $("#cmbDesc").jqxListBox({
        source: dataAdapter,
    displayMember: "Description",
    valueMember: "Description",
    multiple: true,
    checkboxes: true,
    filterable: true,
    width: 200,
    height: 250
            });
        }
    function CheckChange(checked) {
            if (checked) {
        // $("#cmbDesc").jqxListBox('checkAll');
        $('#btnDesc').jqxDropDownButton({ disabled: true });
            }
    else {
        // $("#cmbDesc").jqxListBox('uncheckAll');
        $('#btnDesc').jqxDropDownButton({ disabled: false });
            }

        }
    function CheckChange2(checked) {
            if (checked) {
        $('#btnEmployee').jqxDropDownButton({ disabled: true });
            }
    else {
        $('#btnEmployee').jqxDropDownButton({ disabled: false });
            }

        }
    function FillCallType() {
        $.ajax({
            type: "GET",
            url: "../../Setting/GetCallType",
            success: function (result) {
                var CallType = result.CallTypeList;
                var source =
                {
                    dataType: "json",
                    dataFields: [
                        { name: 'ID', type: 'string' },
                        { name: 'NAME', type: 'string' }
                    ],
                    id: 'ID',
                    localdata: CallType
                };
                var dataAdapterPr = new $.jqx.dataAdapter(source);
                // Create a jqxComboBox
                $("#cmbCallType").jqxDropDownList({ placeHolder: "Select CallType", selectedIndex: -1, source: dataAdapterPr, displayMember: "NAME", valueMember: "ID", width: 170, height: 25 });
            }
        });
        }
    function FillEmployee() {
        $.ajax({
            type: "GET",
            url: "../../Setting/GetEmployee",
            success: function (result) {
                var employees = result.dtEmp;
                var sourceEmp =
                {
                    dataType: "json",
                    dataFields: [
                        { name: 'UID', type: 'number' },
                        { name: 'EmployeeName', type: 'string' },
                        { name: 'SubNoID', type: 'number' },
                        { name: 'SubNo', type: 'string' },
                        { name: 'ORG', type: 'string' }
                    ],
                    id: 'SubNoID',
                    localdata: employees
                };
                var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);

                // FIX: Initialize grid properly with visible height
                $("#grdEmployee").jqxGrid({
                    width: '100%',
                    height: 300,
                    source: dataAdapterEmp,
                    columnsresize: true,
                    theme: 'dark-blue',
                    pageSize: 10,
                    sortable: true,
                    filterable: true,
                    showfilterrow: true,
                    pageable: true,
                    selectionmode: 'checkbox',
                    altrows: true,
                    columns: [
                        { dataField: 'UID', text: 'UID', hidden: true },
                        { dataField: 'EmployeeName', text: 'Name' },
                        { dataField: 'SubNoID', text: 'SubNoID', hidden: true },
                        { dataField: 'SubNo', text: 'SubNo', width: 80 },
                        { dataField: 'ORG', text: 'ORG' }

                    ]
                });

                $("#grdEmployee").on('rowselect', function (event) {
                    var args = event.args;
                    var row = $("#grdEmployee").jqxGrid('getrowdata', args.rowindex);
                });
            }
        });
        }
    function FillGrid() {
        $.ajax({
            type: "GET",
            url: "../../Setting/GetPolicy",
            cache: false,
            success: function (result) {
                var Policy = result.dtPolicy;
                var source =
                {
                    dataType: "json",
                    dataFields: [
                        { name: 'ID', type: 'number' },
                        { name: 'ProviderID', type: 'number' },
                        { name: 'ProviderName', type: 'string' },
                        { name: 'TransType', type: 'string' },
                        { name: 'Description', type: 'string' },
                        { name: 'CallTypeID', type: 'number' },
                        { name: 'CallType', type: 'string' },
                        { name: 'LineTypeID', type: 'number' },
                        { name: 'LineType', type: 'string' },
                        { name: 'IsAll', type: 'bool' },
                        { name: 'IsSupImp', type: 'bool' }
                    ],
                    id: 'ID',
                    localdata: Policy
                };

                var renderer = function (row, column, value) {
                    var row = $("#grdData").jqxGrid('getrowdata', row);
                    var IsAllEmp = row.IsAll;
                    if (IsAllEmp) {
                        return '<input type="button" disabled="true" value="All Employee"/>';
                    }
                    else {
                        return '<input id="button' + row + '" onClick="FillEmpList(' + row.ID + ')"  type="button" value="View List"/>';
                    }
                }

                var dataAdapter = new $.jqx.dataAdapter(source);
                $("#grdData").jqxGrid({
                    width: '100%',
                    source: dataAdapter,
                    columnsresize: true,
                    theme: 'dark-blue',
                    pageSize: 10,
                    sortable: true,
                    filterable: true,
                    showfilterrow: true,
                    pageable: true,
                    columns: [
                        {
                            datafield: 'Edit', text: 'Edit', columntype: 'button', width: 75, cellsrenderer: function () {
                                return "Edit";
                            }, buttonclick: function (row) {
                                Edit(row);
                            }
                        },
                        { dataField: 'ID', text: 'ID', hidden: true },
                        { dataField: 'ProviderID', text: 'ProviderID', hidden: true },
                        { dataField: 'ProviderName', text: 'ProviderName' },
                        { dataField: 'TransType', text: 'TransType' },
                        { dataField: 'Description', text: 'Description' },
                        { dataField: 'CallTypeID', text: 'CallTypeID', hidden: true },
                        { dataField: 'CallType', text: 'CallType' },
                        { dataField: 'LineTypeID', text: 'LineTypeID', hidden: true },
                        { dataField: 'LineType', text: 'LineType' },
                        { dataField: 'IsAll', text: 'IsAll' },
                        { dataField: 'IsSupImp', text: 'IsSupImp' },
                        { dataField: 'Employee', text: 'Employee', width: 140, cellsrenderer: renderer },

                        {
                            datafield: 'Delete', text: 'Delete', columntype: 'button', width: 75, cellsrenderer: function () {
                                return "Delete";
                            }, buttonclick: function (row) {
                                if (confirm("Are you sure?")) {
                                    var row = $("#grdData").jqxGrid('getrowdata', row);
                                    var File = {
                                        "ID": row.ID
                                    };
                                    $.ajax({
                                        type: "GET",
                                        url: "../../Setting/DeletePolicy",
                                        contentType: 'application/json',
                                        data: File,
                                        success: function (result) {
                                            alert(result.Message);
                                            $("#grdData").jqxGrid('clearselection');
                                            Clear();
                                            FillGrid();
                                        }
                                    })
                                }
                                return false;
                            }
                        }
                    ]
                });
            }
        });
        }
    function Edit(index) {

        $('#grdEmployee').jqxGrid('clearselection');
    var row = $("#grdData").jqxGrid('getrowdata', index);

    $("#hidID").val(row.ID);
    $("#cmbProvider").jqxDropDownList('selectItem', row.ProviderID);
    $("#cmbProvider").jqxDropDownList({disabled: true });
    $("#cmbCallType").jqxDropDownList('selectItem', row.CallTypeID);
    $("#cmbCallType").jqxDropDownList({disabled: true });
    $("#cmbLineType").jqxDropDownList('selectItem', row.LineTypeID);
    $("#cmbLineType").jqxDropDownList({disabled: true });
    $("#cmbTransType").jqxDropDownList({placeHolder: row.TransType });
    $("#cmbTransType").jqxDropDownList({disabled: true });
    if (row.Description.length == 0) {
        $('#chkAllDesc').jqxCheckBox({ checked: true });
            }
    else {
        $('#chkAllDesc').jqxCheckBox({ checked: false });
            }
    $('#chkAllDesc').jqxCheckBox({disabled: true });
    $("#btnDesc").jqxDropDownButton('setContent', row.Description);
    $('#btnDesc').jqxDropDownButton({disabled: true });
    $('#chkAllEmp').jqxCheckBox({checked: row.IsAll });
    $('#chkSupImp').jqxCheckBox({checked: row.IsSupImp });

    $("#btnUpdate").show();
    $("#btnAdd").hide();

    if (!row.IsAll) {
                var Indexes = [];
    var File = {
        "ID": row.ID
                };
    $.ajax({
        type: "GET",
    url: "../../Setting/GetPolicyDetail",
    contentType: 'application/json',
    data: File,
    success: function (result) {
                        var Ids = result.dtID;
    $.each(Ids, function (key, val1) {
                            var index = $('#grdEmployee').jqxGrid('getrowboundindexbyid', val1.ID);
    $('#grdEmployee').jqxGrid({selectedrowindex: index });
                        });

                    }
                })
            }
        }

    function AddPolicy() {
            var Num = [];
    var Emp = [];
    var Des = [];

    var Provider = $("#cmbProvider").jqxDropDownList('getSelectedItem');
    if (Provider == null) {
        alert('Please Select Provider');
    return;
            }
    var TransType = $("#cmbTransType").jqxDropDownList('getSelectedItem');
    if (TransType == null) {
        alert('Please Select TransType');
    return;
            }
    var CallType = $("#cmbCallType").jqxDropDownList('getSelectedItem');
    if (CallType == null) {
        alert('Please Select CallType');
    return;
            }
    var LineType = $("#cmbLineType").jqxDropDownList('getSelectedItem');

    var IsAllDesc = $('#chkAllDesc').jqxCheckBox('checked');
    if (IsAllDesc) { }
    else {
                var Desc = $("#cmbDesc").jqxListBox('getCheckedItems');
    for (var i = 0; i < Desc.length; i++) {
        Des.push(Desc[i].label)
    }
            }

    var IsAllEmp = $('#chkAllEmp').jqxCheckBox('checked');
    if (IsAllEmp) { }
    else {
                var Indexes = $('#grdEmployee').jqxGrid('getselectedrowindexes');
    for (var i = 0; i < Indexes.length; i++) {
                    var RowData = $('#grdEmployee').jqxGrid('getrowdata', Indexes[i]);
    var UID = RowData.UID;
    var SubNoID = RowData.SubNoID;
    Emp.push(UID);
    Num.push(SubNoID);
                }
            }
    var IsSupImp = $('#chkSupImp').jqxCheckBox('checked');

    var Policy = {
        "ProviderID": Provider.value,
    "TransType": TransType.label,
    "IsAllDesc": IsAllDesc,
    "Des": Des,
    "CallTypeID": CallType.value,
    "LineTypeID": LineType.value,
    "IsAll": IsAllEmp,
    "Emp": Emp,
    "Num": Num,
    "IsSupImp": IsSupImp
            };

    var obj = {Policy: Policy }
    $.ajax({
        type: "POST",
    url: "../../Setting/AddPolicy",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(obj),
    dataType: "json",
    success: function (result) {
        alert(result.Message);
    Clear();
    FillGrid();
                }
            });

        }
    function UpdatePolicy() {
            var Num = [];
    var Emp = [];



    var IsAllEmp = $('#chkAllEmp').jqxCheckBox('checked');
    if (IsAllEmp) { }
    else {
                var Indexes = $('#grdEmployee').jqxGrid('getselectedrowindexes');
    for (var i = 0; i < Indexes.length; i++) {
                    var RowData = $('#grdEmployee').jqxGrid('getrowdata', Indexes[i]);
    var UID = RowData.UID;
    var SubNoID = RowData.SubNoID;
    Emp.push(UID);
    Num.push(SubNoID);
                }
            }
    var IsSupImp = $('#chkSupImp').jqxCheckBox('checked');

    var Policy = {
        "ID": $("#hidID").val(),
    "IsAll": IsAllEmp,
    "Emp": Emp,
    "Num": Num,
    "IsSupImp": IsSupImp
            };

    var obj = {Policy: Policy }
    $.ajax({
        type: "POST",
    url: "../../Setting/UpdatePolicy",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(obj),
    dataType: "json",
    success: function (result) {
        alert(result.Message);
    Clear();
    FillGrid();
                }
            });

        }
    function ApplyPolicy() {
        $.ajax({
            type: "GET",
            url: "../../Setting/ApplyPolicy",
            success: function (result) {
                alert(result.Message);
            }
        });
        }
    function Clear() {
        $("#hidID").val('');
    $("#cmbProvider").jqxDropDownList('clearSelection');
    $("#cmbTransType").jqxDropDownList('clearSelection');
    $("#cmbDesc").jqxListBox('uncheckAll');
    $("#cmbCallType").jqxDropDownList('clearSelection');
    $("#cmbLineType").jqxDropDownList('clearSelection');
    $('#grdEmployee').jqxGrid('clearselection');
    $('#chkAllEmp').jqxCheckBox({checked: false });
    $('#chkAllDesc').jqxCheckBox({checked: false });
    $('#chkSupImp').jqxCheckBox({checked: false });
    $("#grdData").jqxGrid('clearselection');


    $("#cmbProvider").jqxDropDownList({disabled: false });
    $("#cmbCallType").jqxDropDownList({disabled: false });
    $("#cmbLineType").jqxDropDownList({disabled: false });
    $("#cmbTransType").jqxDropDownList({disabled: false });
    $('#chkAllDesc').jqxCheckBox({disabled: false });
    $('#btnDesc').jqxDropDownButton({disabled: false });
    $("#cmbTransType").jqxDropDownList({placeHolder: "Select TransType" });
    $("#btnDesc").jqxDropDownButton('setContent', 'Select Description');
    $("#btnAdd").show();
    $("#btnUpdate").hide();
        }
    function FillEmpList(PolicyID) {
            var ID = {
        "ID": PolicyID
            };

    var obj = JSON.stringify(ID);
    $.ajax({
        type: "GET",
    url: "../../Setting/GetEmpList",
    contentType: 'application/json',
    data: ID,
    success: function (result) {
                    var EmpList = result.dtEmp;
    var source =
    {
        dataType: "json",
    dataFields: [
    {name: 'EmpName', type: 'string' },
    {name: 'EmpNo', type: 'string' }
    ],
    localdata: EmpList
                    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#grdEmpList").jqxGrid({
        width: '400',
    height: '400',
    source: dataAdapter,
    columnsresize: true,
    theme: 'dark-blue',
    pageSize: 10,
    sortable: true,
    filterable: true,
    showfilterrow: true,
    pageable: true,

    selectionmode: 'none',
    columns: [
    {dataField: 'EmpName', text: 'Employee' },
    {dataField: 'EmpNo', text: 'EmployeeNo' }
    ]
                    });
    $("#jqxwindow").jqxWindow('open');
                }
            });
        }


