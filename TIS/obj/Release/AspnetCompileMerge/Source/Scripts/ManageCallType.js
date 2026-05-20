
$(document).ready(function () {

    FillProvider();
    $("#cmbProvider").on("change", function () {
        var providerId = $(this).val();
        if (!providerId) return;

        $.ajax({
            type: "GET",
            url: "../../Setting/FillTransType",
            data: { ProviderID: providerId },
            dataType: "json",
            success: function (result) {
                console.log(result.dtTransType)
                FillTransType(result.dtTransType);
            }
        });
    });
    $("#cmbTransType").on("change", function () {
        var transType = $(this).val();
        var providerId = $("#cmbProvider").val();

        if (!transType || !providerId) return;

        $.ajax({
            type: "GET",
            url: "../../Setting/FillDesc",
            data: {
                TransType: transType,
                ProviderID: providerId
            },
            dataType: "json",
            success: function (result) {
                console.log("this is the desc data on transtype click", result.dtdesc);
                FillDesc(result.dtdesc);
            }
        });
    });
    FillLineType();
    FillCallType();
    FillEmployee();
    FillGrid();
    $(document).ready(function () {
        // PSEUDOCODE / PLAN (detailed):
        // 1. Make the #cmbDesc element behave as a multi-select:
        //    - Ensure the <select> has the multiple attribute at runtime (so select2 treats it as multi).
        //    - Initialize select2 with options suited for multi-select: placeholder, allowClear, width, and closeOnSelect: false
        //      so selecting one option does not close the dropdown immediately.
        // 2. Adjust FillDesc to avoid injecting a disabled single-option placeholder (that conflicts with multi-select).
        //    - Clear the container, then append only option elements for each description item.
        //    - Leave placeholder handling to select2 initialization.
        // 3. Keep behavior of other code unchanged; this change only affects initialization and FillDesc generation.
        // 4. Provide minimal, safe changes: set multiple attribute, init select2 with closeOnSelect:false, and update FillDesc.
        //
        // NOTE: This snippet is intended to replace the select2 initialization and the FillDesc function in ManageCallType.js.
        // Initialize #cmbDesc as multi-select using Select2
        $(document).ready(function () {
            // ensure the element is treated as multi-select
            $("#cmbDesc").attr('multiple', 'multiple');
            // initialize select2 for multi-select usage

            $('#cmbDesc').select2({
                placeholder: "Select Description",
                allowClear: true,
                width: '100%',
                closeOnSelect: false // keep dropdown open for multiple selections
            });

        });


        function FillDesc(descData) {
            var $container = $("#cmbDesc");
            $container.empty();
            // For multi-select, do not add a disabled single placeholder option.
            // select2 will show the placeholder configured during initialization when nothing is selected.
            console.log(descData);
            $.each(descData, function (i, t) {
                $container.append(
                    $('<option></option>')
                        .val(t.Description)
                        .text(t.Description)
                );
            });
            // If select2 is already initialized, refresh it so new options are reflected.
            if ($container.hasClass('select2-hidden-accessible')) {
                $container.trigger('change.select2');
            }
        }
    });

    $("#Select").hide();
    // FIX: Properly setup Employee dropdown button
    $("#btnEmployee").jqxDropDownButton({ width: 170, height: 25 });
    $("#btnEmployee").jqxDropDownButton('setContent', 'Select Employee');

    $("#chkAllDesc").on('change', function () {
        CheckChange(this.checked);
    });

    $("#chkAllEmp").on('change', function () {
        CheckChange2(this.checked);
    });

    $("#btnAdd").on('click', AddPolicy);
    $("#btnUpdate").on('click', UpdatePolicy);
    $("#btnApply").on('click', ApplyPolicy);
    $("#btnCancel").on('click', Clear);

    $("#btnUpdate").hide();
    $("#jqxwindow").jqxWindow({ height: 500, width: 420, theme: 'summer', isModal: true, autoOpen: false });
})


function FillLineType() {
    $.ajax({
        url: '/Telephone/GetLineTypes',
        type: 'GET',
        success: function (data) {
            var $ddl = $('#cmbLineType');
            $ddl.empty();
            $ddl.append('<option value="">-- Select Line Type --</option>');

            $.each(data, function (i, item) {
                $ddl.append(
                    $('<option></option>').val(item.Id).text(item.Name)
                );
            });
        },
        error: function (xhr, status, error) {
            console.error('AJAX error:', error);
        }
    });
}
function FillProvider() {
    $.ajax({
        type: "GET",
        url: "../../Admin/GetProvider",
        dataType: "json",
        success: function (result) {

            var providers = result.ProviderList;
            console.log(providers);
            var $cmbProvider = $("#cmbProvider");

            $cmbProvider.empty();
            $cmbProvider.append('<option value="">Select Provider</option>');

            $.each(providers, function (i, p) {
                $cmbProvider.append(
                    $('<option></option>')
                        .val(p.ID)
                        .text(p.NAME)
                );
            });
        }
    });


}
function FillTransType(transData) {
    var $cmbTransType = $("#cmbTransType");

    $cmbTransType.empty();
    $cmbTransType.append('<option value="">Select Transaction Type</option>');
    console.log(transData);
    $.each(transData, function (i, t) {
        $cmbTransType.append(
            $('<option></option>')
                .val(t.TransType)
                .text(t.TransType)
        );
    });
}
function FillDesc(descData) {
    var $container = $("#cmbDesc");
    $container.empty();

    $container.append('<option value="" disabled>Select Description</option>');
    console.log(descData);
    $.each(descData, function (i, t) {
        $container.append(
            $('<option></option>')
                .val(t.Description)
                .text(t.Description)
        );
    });
}
function CheckChange(checked) {
    // Disable/enable all checkboxes in Description
    $('#cmbDesc').prop('disabled', checked);

}

function CheckChange2(checked) {
    if (checked) {
        $('#btnEmployee').jqxDropDownButton({ disabled: true });
    } else {
        $('#btnEmployee').jqxDropDownButton({ disabled: false });
    }
}

function FillCallType() {
    $.ajax({
        type: "GET",
        url: "../../Setting/GetCallType",
        dataType: "json",
        success: function (result) {
            var CallType = result.CallTypeList;
            var $cmbCallType = $("#cmbCallType");

            $cmbCallType.empty();
            $cmbCallType.append('<option value="">Select CallType</option>');

            $.each(CallType, function (i, ct) {
                $cmbCallType.append(
                    $('<option></option>').val(ct.ID).text(ct.NAME)
                );
            });
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
                debugger;
                var args = event.args;
                //var row = $("#grdEmployee").jqxGrid('getrowdata', args.rowindex);
                //BindEmployeesDetails(row);
                Edit(args.rowindex);
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
                    //return '<input id="button' + row + '" onClick="FillEmpList(' + row.ID + ')"  type="button" value="View List"/>';
                    return '<input id="button' + row.ID + '" data-policyid="' + row.ID + '" class="clPolicyBtn" type="button" value="View List"/>';
                }
            }
            $(document).on('click', '.clPolicyBtn', function () {
                debugger;
                var policyId = $(this).data('policyid');
                if (policyId !== undefined) {
                    FillEmpList(policyId);
                }
            });
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
                        datafield: 'Edit', text: 'Edit', hidden: true, columntype: 'button', width: 75, cellsrenderer: function () {
                            return "Edit";
                        }, buttonclick: function (row) {
                            debugger;
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
//function Edit(index) {


//    if (!row.IsAll) {
//        var Indexes = [];
//        var File = {
//            "ID": row.ID
//        };
//        $.ajax({
//            type: "GET",
//            url: "../../Setting/GetPolicyDetail",
//            contentType: 'application/json',
//            data: File,
//            success: function (result) {
//                var Ids = result.dtID;
//                $.each(Ids, function (key, val1) {
//                    var index = $('#grdEmployee').jqxGrid('getrowboundindexbyid', val1.ID);
//                    $('#grdEmployee').jqxGrid({ selectedrowindex: index });
//                });

//            }
//        })
//    }
//}
function Edit(index) {
    debugger;
    $('#grdEmployee').jqxGrid('clearselection');
    var row = $("#grdData").jqxGrid('getrowdata', index);
    $("#hidID").val(row.ID);

    // Set dropdowns
    $("#cmbProvider").val(row.ProviderID).prop('disabled', true);
    $("#cmbCallType").val(row.CallTypeID).prop('disabled', true);
    $("#cmbLineType").val(row.LineTypeID).prop('disabled', true);
    $("#cmbTransType").val(row.TransType).prop('disabled', true);

    // Description
    if (!row.Description || row.Description.length === 0) {
        $("#chkAllDesc").prop('checked', true);
    } else {
        $("#chkAllDesc").prop('checked', false);
    }
    $("#chkAllDesc").prop('disabled', true);

    // Set description text (assuming #btnDesc shows selected descriptions)
    $("#btnDesc").text(row.Description || 'Select Description').prop('disabled', true);

    // Set employee & super impose checkboxes
    $('#chkAllEmp').jqxCheckBox({ checked: row.IsAll });
    $("#chkSupImp").prop('checked', row.IsSupImp);

    // Show/Hide buttons
    $("#btnUpdate").show();
    $("#btnAdd").hide();

    // Fill employee selection if not "All"
    if (!row.IsAll) {
        $.ajax({
            type: "GET",
            url: "../../Setting/GetPolicyDetail",
            data: { ID: row.ID },
            dataType: "json",
            success: function (result) {
                var Ids = result.dtID;
                $.each(Ids, function (key, val1) {
                    var index = $('#grdEmployee').jqxGrid('getrowboundindexbyid', val1.ID);
                    $('#grdEmployee').jqxGrid({ selectedrowindex: index });
                });

            },
            error: function (err) {
                console.error("Error loading policy details:", err);
            }
        });
    }
}

function AddPolicy() {
    var Num = [];
    var Emp = [];
    var Des = [];

    // Get selected values from Bootstrap <select> elements
    var Provider = $("#cmbProvider").val();
    if (!Provider) {
        alert('Please Select Provider');
        return;
    }

    var TransType = $("#cmbTransType").val();
    if (!TransType) {
        alert('Please Select TransType');
        return;
    }

    var CallType = $("#cmbCallType").val();
    if (!CallType) {
        alert('Please Select CallType');
        return;
    }

    var LineType = $("#cmbLineType").val();

    //// Description checkboxes
    //var IsAllDesc = $("#chkAllDesc").prop('checked');
    //if (!IsAllDesc) {
    //    $("#cmbDesc input[type='checkbox']:checked").each(function () {
    //        Des.push($(this).val());
    //    });
    //}

    // Description selection handling
    var IsAllDesc = $("#chkAllDesc").prop('checked');
    if (!IsAllDesc) {
        // PSEUDOCODE/PLAN:
        // 1. Read chkAllDesc state.
        // 2. If chkAllDesc is NOT checked, collect selected description values from #cmbDesc.
        //    - Try three strategies (in order) to support different UI widgets:
        //      a) If #cmbDesc is a <select> (including select2), use $cmbDesc.val() which returns an array or single value.
        //      b) If #cmbDesc is a jqxListBox, call getCheckedItems() and extract .value / .label.
        //      c) Fallback: find input[type='checkbox']:checked inside #cmbDesc and read their values.
        //    - Merge found values into Des array.
        // 3. Continue building the Policy object and send AJAX request as before.
        // Replaced AddPolicy function:
        var $cmbDesc = $("#cmbDesc");
        var values = [];
        // Strategy A: <select> (including select2)
        if ($cmbDesc.is('select')) {
            var sel = $cmbDesc.val();
            if (sel) {
                if ($.isArray(sel)) values = sel.slice(); // copy
                else values = [sel];
            }
        }
        // Strategy B: jqxListBox with checked items
        if (values.length === 0 && $.isFunction($cmbDesc.jqxListBox)) {
            try {
                var items = $cmbDesc.jqxListBox('getCheckedItems') || [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].value !== undefined) values.push(items[i].value);
                    else if (items[i].label !== undefined) values.push(items[i].label);
                }
            } catch (e) {
                // ignore and fall back
            }
        }
        // Strategy C: fallback to checked checkbox inputs inside container
        if (values.length === 0) {
            $cmbDesc.find("input[type='checkbox']:checked").each(function () {
                values.push($(this).val());
            });
        }
        // Ensure Des receives the collected values
        Des = Des.concat(values);
    }


    debugger
    // Employee selection (assuming a table with checkboxes or similar)
    //var IsAllEmp = $('#chkAllEmp').jqxCheckBox('checked');
    var IsAllEmp = $("#chkAllEmp").prop('checked');
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

    var IsSupImp = $("#chkSupImp").prop('checked');

    // Build policy object
    var Policy = {
        "ProviderID": Provider,
        "TransType": TransType,
        "IsAllDesc": IsAllDesc,
        "Des": Des,
        "CallTypeID": CallType,
        "LineTypeID": LineType,
        "IsAll": IsAllEmp,
        "Emp": Emp,
        "Num": Num,
        "IsSupImp": IsSupImp
    };

    // Send AJAX request
    $.ajax({
        type: "POST",
        url: "../../Setting/AddPolicy",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Policy: Policy }),
        dataType: "json",
        success: function (result) {
            alert(result.Message);
            //Clear();
            //FillGrid();
            location.reload();
        },
        error: function (err) {
            console.error(err);
            alert("An error occurred while saving the policy.");
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

    var obj = { Policy: Policy }
    $.ajax({
        type: "POST",
        url: "../../Setting/UpdatePolicy",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (result) {
            alert(result.Message);
            location.reload();
            //Clear();
            //FillGrid();
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
    debugger;
    $("#hidID").val('');
    // Clear select2 values and options for #cmbDesc


    $("#cmbCallType").jqxDropDownList('clearSelection');
    $("#cmbLineType").jqxDropDownList('clearSelection');
    $('#grdEmployee').jqxGrid('clearselection');
    //$('#chkAllEmp').jqxCheckBox({ checked: false });
    /*$('#chkAllDesc').jqxCheckBox({ checked: false });*/
    $('#chkSupImp').jqxCheckBox({ checked: false });
    $("#grdData").jqxGrid('clearselection');
    //$("#chkAllEmp").prop('checked', false);


    //$("#cmbProvider").jqxDropDownList({ disabled: false });
    $("#cmbCallType").jqxDropDownList({ disabled: false });
    $("#cmbLineType").jqxDropDownList({ disabled: false });
    $("#cmbTransType").jqxDropDownList({ disabled: false });
    //$('#chkAllDesc').jqxCheckBox({ disabled: false });
    $('#btnDesc').jqxDropDownButton({ disabled: false });
    $("#cmbTransType").jqxDropDownList({ placeHolder: "Select TransType" });
    $("#btnDesc").jqxDropDownButton('setContent', 'Select Description');
    $("#btnAdd").show();
    $("#btnUpdate").hide();
}

function Clear() {
    // Hidden ID
    $("#hidID").val('');

    // Clear selects
    $("#cmbProvider").val('');
    $("#cmbTransType").val('');
    //$("#cmbDesc").val('');
    var $cmbDesc = $("#cmbDesc");
    $cmbDesc.empty(); // remove all options
    if ($cmbDesc.hasClass('select2-hidden-accessible')) {
        $cmbDesc.val(null).trigger('change'); // clear selection
    }

    $("#cmbCallType").val('');
    $("#cmbLineType").val('');

    $('#grdEmployee').jqxGrid('clearselection');

    // Clear All/Sup Imp checkboxes
    $('#chkAllEmp').jqxCheckBox({ checked: false });
    $("#chkAllDesc").prop('checked', false);
    $("#chkSupImp").prop('checked', false);

    // Re-enable controls
    $("#cmbProvider").prop('disabled', false);
    $("#cmbTransType").prop('disabled', false);
    $("#cmbCallType").prop('disabled', false);
    $("#cmbLineType").prop('disabled', false);
    $("#chkAllDesc").prop('disabled', false);

    // Reset placeholder for TransType
    $("#cmbTransType").prop('selectedIndex', 0); // optional
    $("#btnDesc").text('Select Description');

    // Show/Hide buttons
    $("#btnAdd").show();
    $("#btnUpdate").hide();
}

function FillEmpList(PolicyID) {
    debugger;
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
                    { name: 'EmpName', type: 'string' },
                    { name: 'EmpNo', type: 'string' }
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
                    { dataField: 'EmpName', text: 'Employee' },
                    { dataField: 'EmpNo', text: 'EmployeeNo' }
                ]
            });
            $("#jqxwindow").jqxWindow('open');
        }
    });
}


