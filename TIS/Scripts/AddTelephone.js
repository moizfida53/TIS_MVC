var Telephone
var AssignNo
var Providers
var Employees
var phoneNumber
$(document).ready(function () {
    

    var dropDownContent = '<div style="position: relative; margin: 3px; ">Select Employee</div>';
    $("#cmbEmployee").jqxDropDownButton({ width: "95%", height: 25 });
    $("#cmbEmployee").jqxDropDownButton('setContent', dropDownContent);
    $('#cmbEmployee').on('open', function () { FillEmployee(); });

    var dropDownContent1 = '<div style="position: relative; margin: 3px; ">Select Number</div>';
    $("#cmbNumber").jqxDropDownButton({ width: "95%", height: 25 });
    $("#cmbNumber").jqxDropDownButton('setContent', dropDownContent1);
    $('#cmbNumber').on('open', function () { FillNumber(); });

    $('#btnUpdate').hide();
    $('#btnDel').hide();
    $('#btnUpdateAsg').hide();
    $('#btnDelAsg').hide();

    $("#Window1").jqxWindow({ height: '70%', width: '70%', theme: 'summer', isModal: true, autoOpen: false });


    $("#txtSubNo").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    loadLineTypes(); // Populate dropdown as soon as page loads


    GetData();

})

$(document).ready(function () {
    // Initialize dropdown button
    var dropDownContent = '<div style="position: relative; margin: 3px;">Select Cost Center</div>';
    $("#cmbCostCenter").jqxDropDownButton({ width: "95%", height: 25 });
    $("#cmbCostCenter").jqxDropDownButton('setContent', dropDownContent);

    // Open event
    $('#cmbCostCenter').on('open', function () { FillCostCenter(); });
});

function FillCostCenter() {
    $.ajax({
        url: "../../Telephone/GetCostCenter",
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            var sourceCC = {
                dataType: "json",
                dataFields: [
                    { name: 'Id', type: 'number' },
                    { name: 'Code', type: 'string' },
                    { name: 'Name', type: 'string' }
                ],
                id: 'Id',
                localdata: data
            };
            var dataAdapterCC = new $.jqx.dataAdapter(sourceCC);

            $("#grdCostCenter").jqxGrid({
                width: '100%',
                height: '300px',
                source: dataAdapterCC,
                columnsresize: true,
                theme: 'dark-blue',
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                selectionmode: 'singlerow',
                columns: [
                    { dataField: 'Id', text: 'ID', width: '50%', hidden: true },
                    { dataField: 'Code', text: 'Code', width: '30%' },
                    { dataField: 'Name', text: 'Name', width: '70%' }
                ]
            });

            $("#grdCostCenter").on('rowselect', function (event) {
                var args = event.args;
                var row = $("#grdCostCenter").jqxGrid('getrowdata', args.rowindex);

                // Set hidden value and dropdown text
                $('#hidCostCenter').val(row.Id);
                var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row.Code + ' - ' + row.Name + '</div>';
                $("#cmbCostCenter").jqxDropDownButton('setContent', dropDownct);
                $('#cmbCostCenter').jqxDropDownButton('close');
            });
        },
        error: function (xhr, status, error) {
            console.error("Status:", status);
            console.error("Error:", error);
            console.error(xhr.responseText);
            alert("Failed to load Cost Centers: " + error);
        }

    });
}


function GetData() {
    $.ajax({
        type: "GET",
        cache: false,
        url: "../../Admin/GetTelData",
        success: function (result) {
            Telephone = result.dtTel;
            AssignNo = result.dtAsg;
            console.log("dtAsg:", result.dtAsg);
            phoneNumber = result.dtUnAsg;
            Providers = result.dtProvider || [];   // ✅ NOW DEFINED
            console.log("this is the provider data: " + JSON.stringify(Providers));

            Employees = result.dtEmp;
            FillTelephone();
            FillProvider();
            FillAssignNo();
        }
    });
}
function GetTelNo() {
    $.ajax({
        type: "GET",
        cache: false,
        url: "../../Admin/GetTelNo",
        success: function (result) {
            console.log("GetTelNo AJAX success result:", result);

            Telephone = result.dtTel;
            console.log("Telephone data (dtTel):", Telephone);
            phoneNumber = result.dtUnAsg;
            FillTelephone();
        }
    });
}
function GetAsgNo() {
    $.ajax({
        type: "POST",
        data: "",
        cache: false,
        url: "../../Admin/GetAsgNo?1=1",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            AssignNo = result.dtAsg;
            phoneNumber = result.dtUnAsg;
            Telephone = result.dtTel;
            FillAssignNo();
            FillTelephone();
        }
    });
}

function loadLineTypes() {
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

//$(document).ready(function () {
//    loadLineTypes();
//});

function FillEmployee() {
    var sourceEmp =
    {
        dataType: "json",
        dataFields: [
            { name: 'EmpId', type: 'string' },
            { name: 'EmpNo', type: 'string' },
            { name: 'EmpName', type: 'string' }
        ],
        id: 'EmpId',
        localdata: Employees
    };
    var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
    $("#grdEmployee").jqxGrid({
        width: '100%',
        height: '340px',
        source: dataAdapterEmp,
        columnsresize: true,
        theme: 'dark-blue',
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        columns: [
            { dataField: 'EmpId', text: 'UID', hidden: 'true' },
            { dataField: 'EmpNo', text: 'EmployeeNo', width: '50%' },
            { dataField: 'EmpName', text: 'Name', width: '50%' }
        ]
    });

    $("#grdEmployee").on('rowselect', function (event) {
        var args = event.args;
        var row = $("#grdEmployee").jqxGrid('getrowdata', args.rowindex);
        var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['EmpName'] + '</div>';
        $('#hidEmployee').val(row['EmpId']);
        $("#cmbEmployee").jqxDropDownButton('setContent', dropDownct);
        $('#cmbEmployee').jqxDropDownButton('close');

    });

}
function FillNumber() {
    var sourceEmp =
    {
        dataType: "json",
        cache: false,
        dataFields: [
            { name: 'ID', type: 'number' },
            { name: 'SUBNO', type: 'string' },
            { name: 'DESCRIPTION', type: 'string' }
        ],
        id: 'ID',
        localdata: phoneNumber
    };
    var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
    $("#grdNumber").jqxGrid({
        width: '100%',
        height: '340px',
        source: dataAdapterEmp,
        columnsresize: true,
        theme: 'dark-blue',
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        columns: [
            { dataField: 'ID', text: 'ID', hidden: 'true' },
            { dataField: 'SUBNO', text: 'Number', width: '40%' },
            { dataField: 'DESCRIPTION', text: 'Description', width: '60%' }
        ]
    });

    $("#grdNumber").on('rowselect', function (event) {
        var args = event.args;
        var row = $("#grdNumber").jqxGrid('getrowdata', args.rowindex);
        var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['SUBNO'] + '</div>';
        $('#hidNumber').val(row['ID']);
        $("#cmbNumber").jqxDropDownButton('setContent', dropDownct);
        $('#cmbNumber').jqxDropDownButton('close');

    });

}


function FillProvider(selectedProviderId) {
    if (!Array.isArray(Providers) || Providers.length === 0) {
        console.warn("Providers data not loaded yet");
        return;
    }

    var $ddl = $("#cmbProvider");
    $ddl.empty();
    $ddl.append('<option value="">Select Provider</option>');

    $.each(Providers, function (i, item) {
        $ddl.append(
            $('<option>', {
                value: item.ID,      // corrected from item.ProviderID
                text: item.NAME      // corrected from item.PROVIDER
            })
        );
    });

    if (selectedProviderId) {
        $ddl.val(String(selectedProviderId));
    }
}



function FillTelephone() {
    console.log(Telephone);
    var deptsource =
    {
        localdata: Telephone,
        datafields:
            [
                { name: 'ID', type: 'number' },
                { name: 'SUBNO', type: 'string' },
                { name: 'PROVIDER', type: 'number' },
                { name: 'PROVIDERNAME', type: 'string' },
                { name: 'DESCRIPTION', type: 'string' },
                { name: 'ACCOUNTNO', type: 'string' },
                { name: 'ISASSIGNED', type: 'bool' },
                { name: 'GENERALPHONE', type: 'bool' },
                { name: 'LINETYPE', type: 'number' },
                { name: 'LINETYPENAME', type: 'string' },
                { name: 'TYPE', type: 'string' },
            ],
        datatype: "json"
    };

    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
    $("#grdTelephone").jqxGrid({
        width: '100%',
        source: dataAdapterCategory,
        columnsresize: true,
        rowsheight: 30,
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        theme: 'dark-blue',
        selectionmode: 'singlerow',
        columns: [
            { dataField: 'ID', text: 'ID', hidden: 'true' },
            { dataField: 'SUBNO', text: 'Mobile No.', width: '10%' },
            { dataField: 'PROVIDER', text: 'Provider', hidden: 'true' },
            { dataField: 'PROVIDERNAME', text: 'Provider', width: '10%' },
            { dataField: 'DESCRIPTION', text: 'Telephone Description' },
            { dataField: 'ACCOUNTNO', text: 'Account No.', width: '10%' },
            { dataField: 'ISASSIGNED', text: 'Assigned Status', columntype: 'checkbox', width: '7%' },
            { dataField: 'GENERALPHONE', text: 'General Phone Status', hidden: 'true' },
            { dataField: 'TYPE', text: 'Business Type', columntype: 'checkbox', type: 'bool', width: '7%' },
            { dataField: 'LINETYPE', text: 'LINETYPE' ,hidden:'true'},
            { dataField: 'LINETYPENAME', text: 'Line Type', width: '7%' },

        ]
    });
    $("#grdTelephone").on('rowselect', function (event) {
        idx = event.args.rowindex;
        var datarow = $("#grdTelephone").jqxGrid('getrowdata', idx);
        var ID = datarow.ID;
        var SUBNO = datarow.SUBNO;
        var PROVIDER = datarow.PROVIDER;
        var DESCRIPTION = datarow.DESCRIPTION;
        var ACCOUNTNO = datarow.ACCOUNTNO;
        var TYPE = datarow.TYPE;
        var LINETYPE = datarow.LINETYPE;

        $('#hidID').val(ID);
        $("#txtSubNo").val(SUBNO);

        //$("#cmbProvider").jqxDropDownList('selectItem', PROVIDER);
        FillProvider(PROVIDER); // PROVIDER is the ID of the provider you want selected


        $("#txtSubDesc").val(DESCRIPTION);
        $("#txtAccountNo").val(ACCOUNTNO);
        $("#cmbLineType").val(LINETYPE);
        $("#cmbType").val(TYPE);
        $('#btnAdd').hide();
        $('#btnUpdate').show();
        $('#btnDel').show();
    });
}
function FillAssignNo() {
    var deptsource =
    {
        localdata: AssignNo,

        datafields:
            [
                { name: 'ID', type: 'number' },
                { name: 'SubNoId', type: 'number' },
                { name: 'SUBNO', type: 'string' },
                { name: 'UID', type: 'number' },
                { name: 'EMPLOYEENAME', type: 'string' },
                { name: 'EMPLOYEENO', type: 'string' },
                { name: 'DESCRIPTION', type: 'string' },
                { name: 'ALLOWANCELIMIT', type: 'number' },
                { name: 'BUSINESSLIMIT', type: 'number' },
                { name: 'LINESTATUS', type: 'number' },
                { name: 'LINESTATUSNAME', type: 'string' },
                { name: 'STARTDATE', type: 'date' },
                { name: 'ENDDATE', type: 'date' },
                { name: 'CostCenterID', type: 'number' },
                { name: 'CostCenterName', type: 'string' },

            ],
        datatype: "json"
    };

    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
    $("#grdAssignNo").jqxGrid({
        width: '100%',
        source: dataAdapterCategory,
        columnsresize: true,
        rowsheight: 30,
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        theme: 'dark-blue',
        selectionmode: 'singlerow',
        columns: [
            { dataField: 'ID', text: 'ID', hidden: 'true' },
            { dataField: 'SubNoId', text: 'SubNoId', hidden: 'true' },
            { dataField: 'SUBNO', text: 'Telephone No.' },
            { dataField: 'UID', text: 'UID', hidden: 'true' },
            { dataField: 'EMPLOYEENAME', text: 'Employee Name' },
            { dataField: 'EMPLOYEENO', text: 'Employee No.' },
            { dataField: 'CostCenerID', text: 'Cost Center ID', hidden: 'true' },
            { dataField: 'CostCenterName', text: 'Cost Center Name' },
            { dataField: 'DESCRIPTION', text: 'Telephone Description' },
            { dataField: 'ALLOWANCELIMIT', text: 'Allowance Limit' },
            { dataField: 'BUSINESSLIMIT', text: 'Business Limit' },
            { dataField: 'LINESTATUS', text: 'Line Status', hidden: 'true' },
            { dataField: 'LINESTATUSNAME', text: 'Line Status Name' },
            { dataField: 'STARTDATE', text: 'Start Date', cellsformat: 'dd-MM-yyyy' },
            { dataField: 'ENDDATE', text: 'End Date', cellsformat: 'dd-MM-yyyy' },

        ]
    });
    $("#grdAssignNo").on('rowselect', function (event) {

        var idx = event.args.rowindex;
        var datarow = $("#grdAssignNo").jqxGrid('getrowdata', idx);
        console.log(datarow);

        var ID = datarow.ID;
        var SubNoId = datarow.SubNoId;
        var SUBNO = datarow.SUBNO;
        var UID = datarow.UID;
        var EMPLOYEENAME = datarow.EMPLOYEENAME;
        var ALLOWANCELIMIT = datarow.ALLOWANCELIMIT;
        var BUSINESSLIMIT = datarow.BUSINESSLIMIT;
        var LINESTATUS = datarow.LINESTATUS;
        var STARTDATE = datarow.STARTDATE;
        var ENDDATE = datarow.ENDDATE;

        var CostCenterID = datarow.CostCenterID;
        var CostCenterName = datarow.CostCenterName; // 🔴 IMPORTANT

        $('#hidAID').val(ID);
        $('#hidEmployee').val(UID);
        $('#hidNumber').val(SubNoId);
        $('#hidCostCenter').val(CostCenterID); // for POST

        $("#txtAlwLimit").val(ALLOWANCELIMIT);
        $("#txtBusLimit").val(BUSINESSLIMIT);
        $("#cmbLineStatus").val(LINESTATUS);

        //$("#cmbStartDate").val(STARTDATE ? new Date(STARTDATE).toISOString().split('T')[0] : '');
        //$("#cmbEndDate").val(ENDDATE ? new Date(ENDDATE).toISOString().split('T')[0] : '');
        // New Code below written by Fida taken from chatgpt
        $("#cmbStartDate").val(formatDateForInput(STARTDATE));
        $("#cmbEndDate").val(formatDateForInput(ENDDATE));


        // Employee dropdown
        $("#cmbEmployee").jqxDropDownButton('setContent',
            '<div style="margin:3px;">' + EMPLOYEENAME + '</div>'
        );

        // Number dropdown
        $("#cmbNumber").jqxDropDownButton('setContent',
            '<div style="margin:3px;">' + SUBNO + '</div>'
        );

        // ✅ Cost Center dropdown (THIS WAS MISSING)
        if (CostCenterID && CostCenterID > 0) {
            $("#cmbCostCenter").jqxDropDownButton('setContent',
                '<div style="margin:3px;">' + CostCenterName + '</div>'
            );
        } else {
            $("#cmbCostCenter").jqxDropDownButton('setContent',
                '<div style="margin:3px;">Select Cost Center</div>'
            );
        }

        $('#btnAssign').hide();
        $('#btnUpdateAsg').show();
        $('#btnDelAsg').show();
    });

}

function AddTelephone() {
    if ($("#txtSubNo").val() == '') {

        $("#txtSubNo").notify('Please Fill Telephone Number', { position: "right" });

        return;
    }

    // Check For Duplicate telephone Number

    var filtergroup = new $.jqx.filter();
    var filter = filtergroup.createfilter('stringfilter', $("#txtSubNo").val(), 'EQUAL');
    filtergroup.addfilter(1, filter);
    $("#grdTelephone").jqxGrid('addfilter', 'SUBNO', filtergroup);
    $("#grdTelephone").jqxGrid('applyfilters');
    var Information = $("#grdTelephone").jqxGrid('getdatainformation');
    var Count = Information.rowscount;
    if (Count > 0) {
        $("#grdTelephone").jqxGrid('clearfilters');
        $("#txtSubNo").notify('Number already added', { position: "right" });
        return;
    }

    $("#grdTelephone").jqxGrid('clearfilters');
    ///////////////////////////////////////////

    //var Item = $("#cmbProvider").jqxDropDownList('getSelectedItem');
    //if (Item == null) {

    //    $("#cmbProvider").notify('Please Select Provider', { position: "right" });

    //    return;
    //}

    var Item = null;
    var $ddl = $("#cmbProvider");

    // Check if there are options
    if ($ddl.find('option').length > 0) {
        // Get the selected option
        var selectedOption = $ddl.find('option:selected');
        if (selectedOption.length > 0 && selectedOption.val() !== "") {
            Item = {
                value: selectedOption.val(),
                text: selectedOption.text()
            };
        }
    }

    console.log(Item);

    if (!Item) {
        $("#cmbProvider").notify('Please Select Provider', { position: "right" });
        return;
    }


    var Tel = {
        "SUBNO": $("#txtSubNo").val(),
        "PROVIDER": Item.value,
        "DESCRIPTION": $("#txtSubDesc").val(),
        "ACCOUNTNO": $("#txtAccountNo").val(),
        "TYPE": $("#cmbType").val(),
        "LINETYPE": $("#cmbLineType").val()
    };
    var obji = { Telephone: Tel }


    // ✅ Only show SweetAlert, AJAX inside .then
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to add this Telephone number?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, add!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: "../../Admin/AddTelephone",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    GetData();
                    ClearTelephone();
                    GetTelNo();
                    if (result.myMessage == 'succ') {
                        Swal.fire('Success!', 'Telephone number Added Successfully', 'success');
                    } else {
                        Swal.fire('Error!', 'Cannot complete transaction, contact Admin', 'error');
                    }
                }
            });
        }
    });

}
function UpdateTelephone() {
    debugger;
    if ($("#txtSubNo").val() == '') {
        $("#txtSubNo").notify('Please Fill Telephone Number', { position: "right" });
        return;
    }

    // Check For Duplicate telephone Number

    var filtergroup = new $.jqx.filter();
    var filter = filtergroup.createfilter('stringfilter', $("#txtSubNo").val(), 'EQUAL');
    filtergroup.addfilter(1, filter);
    $("#grdTelephone").jqxGrid('addfilter', 'SUBNO', filtergroup);

    var filtergroup1 = new $.jqx.filter();
    var filter1 = filtergroup1.createfilter('stringfilter', $("#hidID").val(), 'NOT_EQUAL');
    filtergroup1.addfilter(1, filter1);
    $("#grdTelephone").jqxGrid('addfilter', 'ID', filtergroup1);

    $("#grdTelephone").jqxGrid('applyfilters');
    var Information = $("#grdTelephone").jqxGrid('getdatainformation');
    var Count = Information.rowscount;
    if (Count > 0) {
        $("#grdTelephone").jqxGrid('clearfilters');
        $("#txtSubNo").notify('Number already added', { position: "right" });
        return;
    }

    $("#grdTelephone").jqxGrid('clearfilters');
    ///////////////////////////////////////////

    //var Item = $("#cmbProvider").jqxDropDownList('getSelectedItem');
    //if (Item == null) {

    //    $("#cmbProvider").notify('Please Select Provider', { position: "right" });
    //    return;
    //}

    var Item = null;
    var $ddl = $("#cmbProvider");

    // Check if there are options
    if ($ddl.find('option').length > 0) {
        // Get the selected option
        var selectedOption = $ddl.find('option:selected');
        if (selectedOption.length > 0 && selectedOption.val() !== "") {
            Item = {
                value: selectedOption.val(),
                text: selectedOption.text()
            };
        }
    }

    console.log(Item);

    if (!Item) {
        $("#cmbProvider").notify('Please Select Provider', { position: "right" });
        return;
    }


    var Tel = {
        "ID": $("#hidID").val(),
        "SUBNO": $("#txtSubNo").val(),
        "PROVIDER": Item.value,
        "DESCRIPTION": $("#txtSubDesc").val(),
        "ACCOUNTNO": $("#txtAccountNo").val(),
        "TYPE": $("#cmbType").val(),
        "LINETYPE": $("#cmbLineType").val()
    };
    var obji = { Telephone: Tel }

    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to update this Telephone number?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: "../../Admin/UpdateTelephone",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    GetData();
                    ClearTelephone();
                    GetTelNo();
                    if (result.myMessage == 'succ') {
                        Swal.fire('Success!', 'Telephone number Updated Successfully', 'success');
                    } else {
                        Swal.fire('Error!', 'Cannot complete transaction, contact Admin', 'error');
                    }
                }
            });
        }
    });

}
function DelTelephone() {

    var Tel = {
        "ID": $("#hidID").val()
    };

    var obj = JSON.stringify(Tel);
    $.ajax({
        type: "GET",
        cache: false,
        url: "../../Admin/DeleteTelephone",
        contentType: 'application/json',
        data: Tel,
        success: function (result) {
            ClearTelephone();

            GetTelNo();

            if (result.myMessage == 'succ') {
                $.alert.open('info', 'Success', 'Telephone Number deleted successfully');
            }
            else if (result.myMessage == 'Exist') {
                $.alert.open('error', 'Error', 'Cannot Delete this Number! Because there is a Bill Assigned to this Number');
            }




        }
    });

}
function ClearTelephone() {
    $("#hidID").val('');
    $("#txtSubNo").val('');
    $("#txtSubDesc").val('');
    $("#txtAccountNo").val('');
    $("#cmbType").val('True');
    $("#cmbLineType").val('0');

    //$("#cmbProvider").jqxDropDownList('clearSelection');
    var $ddl = $("#cmbProvider");
    if ($ddl.find('option').length > 0) {
        $ddl.val(''); // sets to the default empty option
    }

    $("#grdTelephone").jqxGrid('clearselection');
    $('#btnUpdate').hide();
    $('#btnDel').hide();
    $('#btnAdd').show();
}

function Assign() {
    debugger;
    if ($("#hidEmployee").val() == '') {
        $("#cmbEmployee").notify('Please Select Employee', { position: "right" });

        return;
    }
    if ($("#hidNumber").val() == '') {

        $("#cmbNumber").notify('Please Select Number', { position: "right" });
        return;
    }
    if ($("#cmbStartDate").val() == '') {

        $("#cmbStartDate").notify('Please Select Start Date', { position: "right" });
        return;
    }
    if ($("#cmbEndDate").val() == '') {

        $("#cmbEndDate").notify('Please Select End Date', { position: "right" });
        return;
    }
    //if ($("#hidCostCenter").val() == '') {
    //    $("#cmbCostCenter").notify('Please Select Cost Center', { position: "right" });
    //    return;
    //}
    var date1 = $("#cmbStartDate").val();
    var date2 = $("#cmbEndDate").val();


    if ((new Date(date1).getTime() <= new Date(date2).getTime())) { }
    else {

        $("#cmbStartDate").notify('Start Date Cannot be more than End Date', { position: "right" });
        return;
    }
    var formattedDate1 = date1;
    var formattedDate2 = date2;


    // Check For Dublicate AssignNo

    var filtergroup = new $.jqx.filter();
    var filter = filtergroup.createfilter('numericfilter', $("#hidNumber").val(), 'EQUAL');
    filtergroup.addfilter(1, filter);
    $("#grdAssignNo").jqxGrid('addfilter', 'SubNoId', filtergroup);

    var filtergroup1 = new $.jqx.filter();
    var filter1 = filtergroup1.createfilter('datefilter', formattedDate1, 'GREATER_THAN');
    filtergroup1.addfilter(1, filter1);
    $("#grdAssignNo").jqxGrid('addfilter', 'ENDDATE', filtergroup1);

    $("#grdAssignNo").jqxGrid('applyfilters');
    var Information = $("#grdAssignNo").jqxGrid('getdatainformation');
    var Count = Information.rowscount;
    if (Count > 0) {
        $("#grdAssignNo").jqxGrid('clearfilters');
        alert('');
        $.alert.open('error', 'Assign Cannot be done', 'Number Already Assigned to Someone Wthin this Date');
        return;
    }

    $("#grdAssignNo").jqxGrid('clearfilters');
    ////////////////////////////////////


    var item = {
        label: $("#cmbLineStatus option:selected").text(),
        value: $("#cmbLineStatus").val(),
        index: $("#cmbLineStatus")[0].selectedIndex
    };


    var Asg = {
        "UID": $("#hidEmployee").val(),
        "SubNoId": $("#hidNumber").val(),
        "ALLOWANCELIMIT": $("#txtAlwLimit").val(),
        "BUSINESSLIMIT": $("#txtBusLimit").val(),
        "STARTDATE": formattedDate1,
        "ENDDATE": formattedDate2,
        "LINESTATUS": item.value,
        "CostCenterID": $("#hidCostCenter").val(),
    };
    var obji = { Assign: Asg }
    //$.ajax({
    //    type: "POST",
    //    url: "../../Admin/Assign",
    //    data: JSON.stringify(obji),
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (result) {
    //        ClearAssign();

    //        GetAsgNo();
    //        //FillAssignNo();
    //        if (result.myMessage == 'succ') {
    //            $.alert.open('info', 'Success', 'Number Assigned Successfully');
    //        }
    //        else {
    //            $.alert.open('error', 'Error', 'Sorry cannot complete transaction, Please contact Administrator');
    //        }
    //    }
    //});

    // Show SweetAlert confirmation
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to Assign this Telephone number?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, add!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Proceed with AJAX call
            $.ajax({
                type: "POST",
                url: "../../Admin/Assign",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    ClearAssign();

                    GetAsgNo();
                    //FillAssignNo();
                    if (result.myMessage == 'succ') {
                        Swal.fire('Success!', 'Telephone number Assinged Successfully', 'success');
                    }
                    else {
                        Swal.fire('Error!', 'Cannot complete transaction, contact Admin', 'error');
                    }
                }
            });
        }
    });

}
function UpdateAssign() {
    debugger;
    if ($("#hidEmployee").val() == '') {


        $("#cmbEmployee").notify('Please Select Employee', { position: "right" });
        return;
    }
    if ($("#hidNumber").val() == '') {

        $("#cmbNumber").notify('Please Select Number', { position: "right" });
        return;
    }
    if ($("#hidCostCenter").val() == '') {
        $("#cmbCostCenter").notify('Please Select Cost Center', { position: "right" });
        return;
    }
    var date1 = $("#cmbStartDate").val();
    var date2 = $("#cmbEndDate").val();

    if ((new Date(date1).getTime() <= new Date(date2).getTime())) { }
    else {
        $("#cmbStartDate").notify('Start Date Cannot be more than End Date', { position: "right" });
        return;
    }
    var formattedDate1 = date1;
    var formattedDate2 = date2;


    // Check For Dublicate AssignNo

    var filtergroup = new $.jqx.filter();
    var filter = filtergroup.createfilter('numericfilter', $("#hidNumber").val(), 'EQUAL');
    filtergroup.addfilter(1, filter);
    $("#grdAssignNo").jqxGrid('addfilter', 'SubNoId', filtergroup);

    var filtergroup1 = new $.jqx.filter();
    var filter1 = filtergroup1.createfilter('datefilter', formattedDate1, 'GREATER_THAN');
    filtergroup1.addfilter(1, filter1);
    $("#grdAssignNo").jqxGrid('addfilter', 'ENDDATE', filtergroup1);

    var filtergroup2 = new $.jqx.filter();
    var filter2 = filtergroup2.createfilter('stringfilter', $("#hidAID").val(), 'NOT_EQUAL');
    filtergroup2.addfilter(1, filter2);
    $("#grdAssignNo").jqxGrid('addfilter', 'ID', filtergroup2);

    $("#grdAssignNo").jqxGrid('applyfilters');
    var Information = $("#grdAssignNo").jqxGrid('getdatainformation');
    var Count = Information.rowscount;
    if (Count > 0) {
        $("#grdAssignNo").jqxGrid('clearfilters');
        $.alert.open('error', 'Assign Cannot be done', 'Number Already Assigned to Someone Wthin this Date');
        return;
    }

    $("#grdAssignNo").jqxGrid('clearfilters');
    ////////////////////////////////////


    var item = {
        label: $("#cmbLineStatus option:selected").text(),
        value: $("#cmbLineStatus").val(),
        index: $("#cmbLineStatus")[0].selectedIndex
    };


    var Asg = {
        "ID": $("#hidAID").val(),
        "UID": $("#hidEmployee").val(),
        "SubNoId": $("#hidNumber").val(),
        "ALLOWANCELIMIT": $("#txtAlwLimit").val(),
        "BUSINESSLIMIT": $("#txtBusLimit").val(),
        "STARTDATE": formattedDate1,
        "ENDDATE": formattedDate2,
        "LINESTATUS": item.value,
        "CostCenterID": $("#hidCostCenter").val(),

    };
    var obji = { Assign: Asg }


    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to Update this Telephone number?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, add!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Proceed with AJAX call
            $.ajax({
                type: "POST",
                url: "../../Admin/UpdateAssign",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    ClearAssign();
                    GetAsgNo();
                    //FillAssignNo();
                    if (result.myMessage == 'succ') {
                        Swal.fire('Success!', 'Telephone number Updated Successfully', 'success');
                    }
                    else {
                        Swal.fire('Error!', 'Cannot complete transaction, contact Admin', 'error');
                    }
                }
            });
        }
    });

}
function DelTelephoneClick() {




    $.alert.open('confirm', 'Are You Sure you want to Delete?', function (button) {
        if (button == 'yes') {

            DelTelephone();
        }


    });
}
function DelAssignClick() {

    $.alert.open('confirm', 'Are You Sure you want to Delete?', function (button) {
        if (button == 'yes') {

            DelAssign();
        }


    });
}
function DelAssign() {

    var Asg = {
        "ID": $("#hidAID").val()
    };

    var obj = JSON.stringify(Asg);
    $.ajax({
        type: "GET",
        url: "../../Admin/DeleteAssign",
        contentType: 'application/json',
        data: Asg,
        success: function (result) {
            ClearAssign();
            GetAsgNo();
            if (result.myMessage == 'succ') {
                $.alert.open('info', 'Success', 'Assigned Record Deleted Successfully');
            }
            else {
                $.alert.open('error', 'Error', 'Sorry cannot complete transaction, Please contact Administrator');
            }

        }
    });

}
function ClearAssign() {
    $("#hidAID").val('');
    $("#hidEmployee").val('');
    var dropDownContent = '<div style="position: relative; margin: 3px; ">Select Employee</div>';
    $("#cmbEmployee").jqxDropDownButton('setContent', dropDownContent);
    $("#hidNumber").val('');
    var dropDownContent1 = '<div style="position: relative; margin: 3px; ">Select Number</div>';
    $("#cmbNumber").jqxDropDownButton('setContent', dropDownContent1);
    $("#txtAlwLimit").val('');
    $("#txtBusLimit").val('');
    $("#cmbLineStatus").val('0');
    $("#cmbLineStatus").jqxDropDownList('selectIndex', 1);
    $("#grdCostCenter").jqxGrid('clearselection');
    $("#grdAssignNo").jqxGrid('clearselection');
    $("#cmbStartDate").val('');
    $("#cmbEndDate").val('');
    $('#btnUpdateAsg').hide();
    $('#btnDelAsg').hide();
    $('#btnAssign').show();
    $("#cmbCostCenter").jqxDropDownButton('setContent',
        '<div style="margin:3px;">Select Cost Center</div>'
    );
}


function ExportToExcel() {
    saveMyFile($('#SubmitForm'), "'Telephone_List" + ".xls", $("#grdTelephone").jqxGrid('exportdata', 'xls'));
}
function saveMyFile(ref, fname, text, mime) {
    var blob = new Blob([text], { type: mime });
    saveAs(blob, fname);
    return false;
}
function Export_ToExcel() {
    saveMyFile($('#SubmitForm'), "'Assigned_Telephones" + ".xls", $("#grdAssignNo").jqxGrid('exportdata', 'xls'));
}
function saveMyFile(ref, fname, text, mime) {
    var blob = new Blob([text], { type: mime });
    saveAs(blob, fname);
    return false;
}

function formatDateForInput(dateValue) {
    if (!dateValue) return '';

    var d = new Date(dateValue);
    var month = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + d.getDate()).slice(-2);
    return d.getFullYear() + '-' + month + '-' + day;
}

// Delegated click handlers moved here so page markup contains no inline onclick attributes.
// Ensure this file is loaded after DOM and after functions like AddTelephone, UpdateTelephone, etc. are defined.
$(document).ready(function () {
    // Add / Update / Cancel for AddTelephone tab
    $(document).on('click', '#btnAdd', function (e) {
        e.preventDefault();
        if (typeof AddTelephone === 'function') {
            AddTelephone();
        }
    });

    $(document).on('click', '#btnUpdate', function (e) {
        e.preventDefault();
        if (typeof UpdateTelephone === 'function') {
            UpdateTelephone();
        }
    });

    $(document).on('click', '#btnCancel', function (e) {
        e.preventDefault();
        if (typeof ClearTelephone === 'function') {
            ClearTelephone();
        }
    });

    // Export buttons
    $(document).on('click', '#btnExportTelephone', function (e) {
        e.preventDefault();
        if (typeof ExportToExcel === 'function') {
            ExportToExcel();
        }
    });

    $(document).on('click', '#btnExportAssign', function (e) {
        e.preventDefault();
        if (typeof Export_ToExcel === 'function') {
            Export_ToExcel();
        }
    });

    // Assign tab: Assign / Update / Cancel
    $(document).on('click', '#btnAssign', function (e) {
        e.preventDefault();
        if (typeof Assign === 'function') {
            Assign();
        }
    });

    $(document).on('click', '#btnUpdateAsg', function (e) {
        e.preventDefault();
        if (typeof UpdateAssign === 'function') {
            UpdateAssign();
        }
    });

    $(document).on('click', '#btnCancelAsg', function (e) {
        e.preventDefault();
        if (typeof ClearAssign === 'function') {
            ClearAssign();
        }
    });

    // Provider window actions (Provider CRUD)
    $(document).on('click', '#btnAddCountry', function (e) {
        e.preventDefault();
        if (typeof AddCountry === 'function') {
            AddCountry();
        }
    });
    $(document).on('click', '#btnUpdateCountry', function (e) {
        e.preventDefault();
        if (typeof UpdateCountry === 'function') {
            UpdateCountry();
        }
    });
    $(document).on('click', '#btnDeleteCountry', function (e) {
        e.preventDefault();
        if (typeof DeleteCountry === 'function') {
            DeleteCountry();
        }
    });
    $(document).on('click', '#btnCancleCountry', function (e) {
        e.preventDefault();
        if (typeof ClearCountry === 'function') {
            ClearCountry();
        }
    });

    // Any grid-rendered "View / Open" buttons should render with a class and data-billid attribute,
    // e.g. <input class="clsBillView" data-billid="123"> — handle those here if AddTelephone.js renders grids.
    $(document).on('click', '.clsBillView', function (e) {
        e.preventDefault();
        var id = $(this).data('billid');
        if (id && typeof getMyArcBill === 'function') {
            getMyArcBill(id);
        }
    });
});