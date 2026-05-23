var Year = [];
var DataRows = [];
var Columns;
var Providers;
var ImportData;
var DbBased;

// ===== Loader helpers (uses blockUI already loaded on this page) =====
function showLoader(message) {
    message = message || 'Please wait...';
    $.blockUI({
        message: '<div style="display:flex;align-items:center;gap:12px;">'
            + '<div class="tis-spinner"></div>'
            + '<span style="color:#fff;font-size:14px;">' + message + '</span>'
            + '</div>',
        css: {
            border: 'none',
            padding: '18px 28px',
            backgroundColor: '#1a1a2e',
            borderRadius: '10px',
            color: '#fff',
            width: 'auto',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
        },
        overlayCSS: {
            backgroundColor: '#000',
            opacity: 0.55
        }
    });
}

function hideLoader() {
    $.unblockUI();
}

// Inject spinner keyframe style once
$(function () {
    if (!$('#tis-spinner-style').length) {
        $('head').append(
            '<style id="tis-spinner-style">'
            + '@keyframes tis-spin { to { transform: rotate(360deg); } }'
            + '.tis-spinner {'
            + '  width:22px;height:22px;border-radius:50%;'
            + '  border:3px solid rgba(255,255,255,0.25);'
            + '  border-top-color:#fff;'
            + '  animation:tis-spin .7s linear infinite;'
            + '  flex-shrink:0;'
            + '}'
            + '</style>'
        );
    }
});
// ====================================================================

$(document).ready(function () {
    $("#btnProcess").hide();
    $("#btnSave").hide();
    //FillSheet();
    FillSheet2();

    $("#Select").hide();

    $("#excelExport").click(function () {
        saveMyFile($('#SubmitForm'), "My Excel File" + ".xls", $("#grdData").jqxGrid('exportdata', 'xls'));
    });

    FillYear();
    $('#cmbProvider').on('change', function () {
        var Provider = $(this).val();
        var ProviderText = $(this).find('option:selected').text();

        console.log('Provider value:', Provider);
        console.log('Provider label:', ProviderText);

        if (!Provider) {
            console.log('No provider selected');

            $("#h1").show();
            $("#h2").show();
            $("#h3").show();
            $("#h4").show();
            $("#btnUpload").hide();
        }
        else {
            CheckProvider(Provider);
        }
    });

    FillProvider();
    FillGrid();

    $("#cmbType").val("");
    $("#SelectType").hide();

    $("#DataBase").hide();
    $("#UpdateDBSetting").hide();
    $("#img").hide();

    $("#cmbViews").jqxDropDownList({ width: '170px', height: '25px' });

    $('#cmbType').on('change', function (event) {

        $("#img").hide();
        //var args = event.args;
        //var index = args.index;

        //var args = this.value;
        var index = this.selectedIndex;

        $('#txtDataBase').val("Data Source=(localdb)\\Projects;Initial Catalog=TIS;Integrated Security=True;Connect Timeout=15;Encrypt=False;TrustServerCertificate=False;Pooling=true")

        if (index == 2) {
            DataBase();
        }

        else {
            Excel();
        }

    });
});

// ---------- Delegated handlers for ImportInvoice page ----------
// Use delegation so handlers work if DOM is updated dynamically.
$(document).on('change', '#jqxFileUpload', function (e) {
    debugger;
    var files = this.files;
    if (!files || files.length === 0) {
        Swal.fire('Warning!', 'Please select a file to upload.', 'warning');
        $('#btnUpload').hide();
        return;
    } else {
        $('#btnUpload').show();
    }

});
//$(document).on('change', '#jqxFileUpload', function (e) {
//    debugger;
//    var files = this.files;
//    if (!files || files.length === 0) {
//        Swal.fire('Warning!', 'Please select a file to upload.', 'warning');
//        return;
//    }

//    var formData = new FormData();
//    var file = null;
//    for (var i = 0; i < files.length; i++) {
//        file = files[i];
//        formData.append('fileToUpload', files[i]);
//    }

//    $.ajax({
//        url: '../../Import/Upload',
//        type: 'POST',
//        data: formData,
//        processData: false,
//        contentType: false,
//        success: function (result) {
//            //Swal.fire('Success!', 'File uploaded successfully.', 'success');
//            //$('#btnUpload').hide();
//            FillSheet(file);
//        },
//        error: function () {
//            Swal.fire('Error!', 'File upload failed.', 'error');
//        }
//    });
//});
// Add this delegated handler for #btnUpload to call ImportController.Upload with selected file from jqxFileUpload
$(document).on('click', '#btnUpload', function (e) {
    debugger;
    e.preventDefault();

    var files = $('#jqxFileUpload')[0].files;
    if (!files || files.length === 0) {
        Swal.fire('Warning!', 'Please select a file to upload.', 'warning');
        return;
    }

    // Prepare FormData for AJAX file upload
    var formData = new FormData();
    var file = null;
    for (var i = 0; i < files.length; i++) {
        file = files[i];
        formData.append('fileToUpload', files[i]);
    }

    // AJAX POST to Import/Upload
    showLoader('Uploading file...');
    $.ajax({
        url: '../../Import/Upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
            hideLoader();
            $('#btnUpload').hide();
            FillSheet(file);
        },
        error: function () {
            hideLoader();
            Swal.fire('Error!', 'File upload failed.', 'error');
        }
    });
});

$(document).on('click', '#btnProcess', function (e) {
    e.preventDefault();
    if (typeof ProcessBill === 'function') ProcessBill();
});

$(document).on('click', '#btnSave', function (e) {
    e.preventDefault();
    if (typeof SaveChanges === 'function') SaveChanges();
});

$(document).on('click', '#excelExport', function (e) {
    e.preventDefault();
    if (typeof saveMyFile === 'function') {
        var exported = $("#grdData").jqxGrid('exportdata', 'xls');
        saveMyFile($('#SubmitForm'), "My Excel File.xls", exported, 'application/vnd.ms-excel');
    }
});

$(document).on('click', '#btnPrevSetting', function (e) {
    e.preventDefault();
    if (typeof GetSetting === 'function') GetSetting();
});

$(document).on('click', '#bdClose', function (e) {
    e.preventDefault();
    if (typeof closeBillDetailsModal === 'function') closeBillDetailsModal();
});

$(document).on('click', '#bdSendEmailGoto', function (e) {
    e.preventDefault();
    window.location.href = '../../Import/UnAssigned';
});
$(document).on('click', '#btnSubmit', function (e) {
    e.preventDefault();
    if (typeof SubmitData === 'function') SubmitData();
});

function FillGrid() {
    $.ajax({
        type: "GET",
        cache: false,
        url: "../../Import/GetUploadHistory",
        success: function (result) {
            var UploadList = result.UploadList;
            var deptsource =
            {
                localdata: UploadList,
                datafields:
                    [
                        { name: 'ID', type: 'number' },
                        { name: 'FileName', type: 'string' },
                        { name: 'BillDate', type: 'date' },
                        { name: 'UploadDate', type: 'date' },
                        { name: 'ProviderName', type: 'string' },
                        { name: 'ProviderID', type: 'number' },
                        { name: 'BillAmount', type: 'number' }
                    ],
                datatype: "json"
            };


            var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
            var IsDeletebuttonHide = result.IsDeleteButShow == 1 ? false : true;
            $("#grdData").jqxGrid({
                width: '100%',
                source: dataAdapterCategory,
                columnsresize: true,
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                theme: 'dark-blue',
                selectionmode: 'singlerow',
                columns: [
                    { dataField: 'ID', text: 'ID', hidden: true },
                    { dataField: 'FileName', text: 'FileName' },
                    { dataField: 'BillDate', text: 'BillDate', cellsformat: 'dd-MM-yyyy' },
                    { dataField: 'UploadDate', text: 'UploadDate', cellsformat: 'dd-MM-yyyy' },
                    { dataField: 'ProviderName', text: 'ProviderName' },
                    { dataField: 'ProviderID', text: 'Provider', hidden: true },
                    { dataField: 'BillAmount', text: 'Bill Amount', cellsformat: 'f3' },

                    {
                        datafield: 'Delete',
                        hidden: IsDeletebuttonHide,
                        text: 'Delete', columntype: 'button', width: 75, cellsrenderer: function () {
                            return "Delete";
                        }, buttonclick: function (row) {
                            debugger;
                            var row = $("#grdData").jqxGrid('getrowdata', row);

                            // SweetAlert2 Example
                            Swal.fire({
                                title: 'Are you sure?',
                                text: "Do you want to delete this bill?",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'Yes, delete!',
                                cancelButtonText: 'Cancel',
                                confirmButtonColor: '#e74c3c',
                                cancelButtonColor: '#6c757d'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    var FormatedBillDate = $.jqx.dataFormat.formatdate(row.BillDate, 'yyyy-MM-dd');
                                    var File = {
                                        "ID": row.ID,
                                        "BillDate": FormatedBillDate,
                                        "ProviderID": row.ProviderID

                                    };
                                    $.ajax({
                                        type: "GET",
                                        url: "../../Import/DeleteBill",
                                        contentType: 'application/json',
                                        data: File,
                                        success: function (result) {
                                            if (result.myMessage == 'succ') {
                                                Swal.fire('Success!', 'Bill Deleted Successfully', 'success');
                                            }
                                            else {
                                                Swal.fire('Error!', 'Cannot complete transaction, contact Admin', 'error');
                                            }
                                            FillGrid();
                                        }
                                    })
                                }
                            });
                        }
                    }
                ]
            });
            $("#grdData").on('rowselect', function (event) {
                idx = event.args.rowindex;
                var datarow = $("#grdData").jqxGrid('getrowdata', idx);
                var ID = datarow.ID;

            });
        }
    });


}

function FillSheet(fileInput) {
    debugger;
    //$('#jqxFileUpload').on('uploadEnd', function () {
    //var fileInput = this.files[0];
    if (!fileInput) return;

    var fileName = fileInput.name;
    $("#lblFileName").html(fileName);

    var File = { "FileName": fileName };

    // SHOW PAGE LOADER
    showLoader('Please wait... Loading sheet names');

    $.ajax({
        type: "GET",
        url: "../../Import/FillSheet",
        contentType: 'application/json',
        cache: false,
        data: File,
        success: function (result) {

            // HIDE PAGE LOADER
            hideLoader();

            $("#btnUpload").show();


            var Sheets = result.dtSheet;

            // Populate dropdown
            var $cmbSheet = $('#cmbSheet');
            $cmbSheet.empty();
            $cmbSheet.append('<option value="">Select Sheet</option>');

            $.each(Sheets, function (i, sheet) {
                $cmbSheet.append('<option value="' + sheet.SheetName + '">' + sheet.SheetName + '</option>');
            });
        },
        error: function () {
            // HIDE PAGE LOADER
            hideLoader();

            Swal.fire('Error!', 'Failed to load sheets', 'error');
        }
    });
    //});
}




function FillSheet2() {
    $('#jqxFileUpload2').on('uploadEnd', function () {
        var fileInput = this.files[0];
        if (!fileInput) return;

        var fileName = fileInput.name;
        $("#lblFileName2").html(fileName);

        // Prepare data for server
        var File = { "FileName": fileName };

        $.ajax({
            type: "GET",
            url: "../../Import/FillSheet",
            contentType: 'application/json',
            data: File,
            cache: false,
            success: function (result) {
                var Sheets = result.dtSheet;

                // Clear existing options
                var $cmbSheet2 = $('#cmbSheet2');
                $cmbSheet2.empty();
                $cmbSheet2.append('<option value="">Select Sheet</option>');

                // Populate dropdown
                $.each(Sheets, function (i, sheet) {
                    $cmbSheet2.append('<option value="' + sheet.SheetName + '">' + sheet.SheetName + '</option>');
                });
            },
            error: function () {
                Swal.fire('Error!', 'Failed to load sheets', 'error');
            }
        });
    });
}

function FillYear() {
    var yearSelect = $('#cmbYear');
    yearSelect.empty(); // Clear previous options

    // Add default option
    yearSelect.append('<option value="">Select Year</option>');

    // Add years 2022 - 2030
    for (var i = 2026; i <= 2035; i++) {
        yearSelect.append('<option value="' + i + '">' + i + '</option>');
    }

    // Optional: select first year by default
    yearSelect.val('');
}

function FillProvider() {
    $.ajax({
        type: "GET",
        url: "../../Admin/GetProvider",
        success: function (result) {
            var providers = result.ProviderList;

            // Fill first dropdown
            var $cmbProvider = $('#cmbProvider');
            $cmbProvider.empty();
            $cmbProvider.append('<option value="">Select Provider</option>'); // default
            $.each(providers, function (i, provider) {
                $cmbProvider.append('<option value="' + provider.ID + '">' + provider.NAME + '</option>');
            });

            // Fill second dropdown
            var $cmbProvider2 = $('#cmbProvider2');
            $cmbProvider2.empty();
            $cmbProvider2.append('<option value="">Select Provider</option>');
            $.each(providers, function (i, provider) {
                $cmbProvider2.append('<option value="' + provider.ID + '">' + provider.NAME + '</option>');
            });
        },
        error: function () {
            Swal.fire('Error!', 'Failed to load providers', 'error');
        }
    });
}

function SubmitData() {
    debugger;
    // Get selected values from standard <select> elements
    var month = $('#cmbMonth').val();
    var year = $('#cmbYear').val();
    var provider = $('#cmbProvider').val();

    // Validation
    if (!month || month === "0") {
        Swal.fire('Warning!', 'Please Select Month', 'warning');
        $('#cmbMonth').focus();
        return;
    }

    if (!year || year === "Select Year") {
        Swal.fire('Warning!', 'Please Select Year', 'warning');
        $('#cmbYear').focus();
        return;
    }

    if (!provider) {
        Swal.fire('Warning!', 'Please Select Provider', 'warning');
        $('#cmbProvider').focus();
        return;
    }


    if (DbBased == "False") {
        var sheetValue = $('#cmbSheet').val();
        var sheetText = $('#cmbSheet option:selected').text();

        if (!sheetValue) {
            console.log('Sheet not selected');

            $('#cmbSheet').focus();
            Swal.fire('Warning!', 'Please Select Sheet', 'warning');
            return;
        }

        console.log('Selected Sheet value:', sheetValue);
        console.log('Selected Sheet text:', sheetText);

    }
    else {
        var Sheet = "";
    }
    ///////////////////////////// Check Duplicate /////////////////////////////////////

    // Get selected values
    var year = $('#cmbYear').val();      // e.g., "2025"
    var month = $('#cmbMonth').val();    // e.g., "1" for January

    // Make sure both are numbers
    year = parseInt(year);
    month = parseInt(month);

    // Get the last day of the selected month
    // JS Date: new Date(year, month, 0) => last day of previous month
    // To get last day of 'month', we can keep this pattern
    var lastDayOfMonth = new Date(year, month, 0);
    console.log(lastDayOfMonth); // e.g., 2025-01-31

    var BillDate = $.jqx.dataFormat.formatdate(lastDayOfMonth, 'dd-MM-yyyy');

    var filtergroup = new $.jqx.filter();
    var filter = filtergroup.createfilter('datefilter', BillDate, 'EQUAL');
    filtergroup.addfilter(1, filter);
    $('#grdData').jqxGrid('addfilter', 'BillDate', filtergroup);

    var filtergroup1 = new $.jqx.filter();
    var filter1 = filtergroup1.createfilter('stringfilter', provider, 'EQUAL');
    filtergroup1.addfilter(1, filter1);
    $('#grdData').jqxGrid('addfilter', 'ProviderID', filtergroup1);

    $('#grdData').jqxGrid('applyfilters');

    var Information = $("#grdData").jqxGrid('getdatainformation');
    var Count = Information.rowscount;
    if (Count > 0) {
        $("#grdData").jqxGrid('clearfilters');
        Swal.fire('Info', 'Bill Already Imported', 'info');
        return;
    }
    $("#grdData").jqxGrid('clearfilters');

    //////////////////////////////////////////////////////////////////////////////////////////////////

    var File = {
        "FileName": $("#lblFileName").html(),
        "SheetName": sheetText,
        "Month": month,
        "Year": year,
        "ProviderID": provider,
        "DbBased": DbBased,
    };




    debugger;
    showLoader('Importing bill data...');
    $.ajax({
        type: "GET",
        url: "../../Import/UploadFile",
        contentType: 'application/json',
        data: File,
        success: function (result) {
            hideLoader();
            debugger;
            $("#lblBillAmount").html(result.BillAmount);
            ImportData = result.gridData;

            if (ImportData.length > 0) {
                FillImport();
                $("#btnSave").show();
                $("#btnReset").show();
            }
            else {
                $("#btnUpload").hide();
                $("#btnReset").show();
                $("#btnProcess").show();
            }
        },
        error: function () {
            hideLoader();
            Swal.fire('Error!', 'Failed to import bill data, please contact Admin.', 'error');
        }
    });
}
function FillImport() {

    var deptsource =
    {
        localdata: ImportData,
        datafields:
            [
                { name: 'ID', type: 'number' },
                { name: 'SUB_NO', type: 'string' },
                { name: 'BILLDATE', type: 'date' },
                { name: 'CALLDATE', type: 'string' },
                { name: 'TRANS_TYPE', type: 'string' },
                { name: 'DESCRIPTION', type: 'string' },
                { name: 'AMOUNT', type: 'string' },
                { name: 'DURATION', type: 'string' },
                { name: 'CALLTIME', type: 'string' }
            ],
        updaterow: function (rowid, rowdata, commit) {
            DataRows.push(rowdata);
        },
        datatype: "json"
    };

    var cellclass = function (row, columnfield, value) {
        if (value.length == 0) {
            return 'red';
        }
    }



    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
    $("#grdImport").jqxGrid({
        width: '100%',
        source: dataAdapterCategory,
        columnsresize: true,
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        theme: 'dark-blue',
        selectionmode: 'none',
        editable: true,
        editmode: 'dblclick',
        columns: [
            { dataField: 'ID', text: 'ID' },
            { dataField: 'SUB_NO', text: 'SUB_NO', cellclassname: cellclass },
            { dataField: 'BILLDATE', text: 'BILLDATE', cellsformat: 'dd-MM-yyyy' },
            { dataField: 'CALLDATE', text: 'CALLDATE', cellsformat: 'dd-MM-yyyy', columntype: 'datetimeinput', cellclassname: cellclass },
            { dataField: 'TRANS_TYPE', text: 'TRANS_TYPE' },
            { dataField: 'DESCRIPTION', text: 'DESCRIPTION' },
            { dataField: 'AMOUNT', text: 'AMOUNT', cellclassname: cellclass },
            { dataField: 'DURATION', text: 'DURATION' },
            { dataField: 'CALLTIME', text: 'CALLTIME' }
        ]
    });

    $("#grdImport").jqxGrid('setcolumnproperty', 'BILLDATE', 'editable', false);
    $("#grdImport").jqxGrid('setcolumnproperty', 'TRANS_TYPE', 'editable', false);
    $("#grdImport").jqxGrid('setcolumnproperty', 'DESCRIPTION', 'editable', false);
    $("#grdImport").jqxGrid('setcolumnproperty', 'DURATION', 'editable', false);
    $("#grdImport").jqxGrid('setcolumnproperty', 'CALLTIME', 'editable', false);
}

function SaveChanges() {
    // Show SweetAlert2 confirmation before saving
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to save these changes?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, save!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            performSaveChanges();
        }
    });
}

function performSaveChanges() {
    for (var i = 0; i < DataRows.length; i++) {
        var rowdata = DataRows[i];
        var CallDate = $.jqx.dataFormat.formatdate(rowdata.CALLDATE, 'yyyy-MM-dd');
        var Imp = {
            "ID": rowdata.ID,
            "SUB_NO": rowdata.SUB_NO,
            "BILLDATE": rowdata.BILLDATE,
            "CALLDATE": CallDate,
            "TRANS_TYPE": rowdata.TRANS_TYPE,
            "DESCRIPTION": rowdata.DESCRIPTION,
            "AMOUNT": rowdata.AMOUNT,
            "DURATION": rowdata.DURATION,
            "CALLTIME": rowdata.CALLTIME
        };

        var obj = JSON.stringify(Imp);
        $.ajax({
            type: "GET",

            url: "../../Import/UpdateImport",
            contentType: 'application/json',
            data: Imp,
            success: function (result) {
                ImportData = result.dtImp;
                if (ImportData.length > 0) {
                    FillImport();
                }
                else {
                    $('#grdImport').jqxGrid('destroy');
                    $("#btnSave").hide();
                    $("#btnUpload").hide();
                    $("#btnReset").show();
                    $("#btnProcess").show();
                    Swal.fire('Success!', 'Changes Saved Successfully', 'success');
                }
            }
        });
    }
}

function ProcessBill() {
    var File = {
        "DbBased": DbBased,
    };
    showLoader('Processing bill...');
    $.ajax({
        type: "GET",
        cache: false,
        url: "../../Import/ProcessBill",
        data: File,
        success: function (result) {
            hideLoader();
            debugger;
            if (result && result.Message && (result.Message.toLowerCase() === 'succ' || result.Message === 'Succ')) {

                var billDetails = result.BillDetails || {};

                // Normalize fields with defaults
                var billedNotInSystem = billDetails.BilledButNotInSystem || { CountOfBills: 0, TotalAmount: 0 };
                var inSystemNotAssigned = billDetails.InSystemButNotAssigned || { CountOfBills: 0, TotalAmount: 0 };
                var assignedOutsideDates = billDetails.AssignedButOutsideValidDates || { CountOfBills: 0, TotalAmount: 0 };

                showBillDetailsModal({
                    billedNotInSystem: billedNotInSystem,
                    inSystemNotAssigned: inSystemNotAssigned,
                    assignedOutsideDates: assignedOutsideDates
                });

            }
            else {
                Swal.fire('Error!', 'Cannot complete transaction, contact Admin', 'error');
            }

            ClearImport();
            FillGrid();
        },
        error: function () {
            hideLoader();
            Swal.fire('Error!', 'Cannot complete transaction, contact Admin', 'error');
        }
    });



}
function ClearImport() {
    $("#btnProcess").hide();
    $("#btnUpload").hide();
    $("#btnSave").hide();
    $("#btnReset").hide();
    //$("#cmbMonth").jqxDropDownList({ selectedIndex: 0 });
    //$("#cmbYear").jqxDropDownList({ selectedIndex: 0 });
    //$("#cmbProvider").jqxDropDownList({ selectedIndex: -1 });
    //$("#cmbSheet").jqxDropDownList('clear');

    $("#cmbMonth").val("");
    $("#cmbYear").val("");
    $("#cmbProvider").val("");
    $("#cmbSheet").html("");

    $("#lblFileName").html('');
    $("#lblBillAmount").html('');

    // Clear jqxFileUpload selected file
    $("#jqxFileUpload").val("");
}
function UploadSetting() {

    var Provider = $("#cmbProvider2").val();
    if (Provider == null) {
        $("#cmbProvider2").notify('Please Select Provider');
        return;
    }
    var Sheet = $("#cmbSheet2").val();
    if (Sheet == null) {
        $("#cmbSheet2").notify('Please Select Sheet');
        return;
    }
    var File = {
        "FileName": $("#lblFileName2").html(),
        "SheetName": Sheet.label,
        "ProviderID": Provider.value
    };
    $.ajax({
        type: "GET",

        url: "../../Import/UploadSetting",
        contentType: 'application/json',
        data: File,
        success: function (result) {
            Columns = result.dtCol;
            FillSettings(Columns);
        }
    });
}

function FillSettings(Columns) {
    debugger;
    //Change logic on 08-Feb-2026
    var source = [
        Columns.Col1,
        Columns.Col2,
        Columns.Col3,
        Columns.Col4,
        Columns.Col5,
        Columns.Col6,
        Columns.Col7,
        Columns.Col8
    ];
    bindDropdown($("#dd1"), source, 0);
    bindDropdown($("#dd2"), source, 1);
    bindDropdown($("#dd3"), source, 2);
    bindDropdown($("#dd4"), source, 3);
    bindDropdown($("#dd5"), source, 4);
    bindDropdown($("#dd6"), source, 5);
    bindDropdown($("#dd7"), source, 6);
    bindDropdown($("#dd8"), source, 7);
}
function UpdateSetting() {
    var Item = $("#cmbProvider2").val();
    if (Item == null) {
        $("#cmbProvider2").notify('Please Select Provider');
        return;
    }

    var Item1 = $("#dd1").val();
    if (Item1 == null) {
        $("#dd1").notify('Please Select Telephone No');
        return;
    }

    var Item2 = $("#dd2").val();
    if (Item2 == null) {
        $("#dd2").notify('Please Select Bill Date');
        return;
    }

    var Item3 = $("#dd3").val();
    if (Item3 == null) {
        $("#dd3").notify('Please Select Transaction Date');
        return;
    }

    var Item4 = $("#dd4").val();
    if (Item4 == null) {
        $("#dd4").notify('Please Select Call Type');
        return;
    }

    var Item5 = $("#dd5").val();
    if (Item5 == null) {
        $("#dd5").notify('Please Select Destination No');
        return;
    }

    var Item6 = $("#dd6").val();
    if (Item6 == null) {
        $("#dd6").notify('Please Select Time of Call');
        return;
    }

    var Item7 = $("#dd7").val();
    if (Item7 == null) {
        $("#dd7").notify('Please Select Duration (Sec)');
        return;
    }

    var Item8 = $("#dd8").val();
    if (Item8 == null) {
        $("#dd8").notify('Please Select Amount (KD)');
        return;
    }

    // Show SweetAlert2 confirmation
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to update these settings?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            performUpdateSetting(Item, Item1, Item2, Item3, Item4, Item5, Item6, Item7, Item8);
        }
    });
}

function performUpdateSetting(Item, Item1, Item2, Item3, Item4, Item5, Item6, Item7, Item8) {
    var Clm = {
        "Provider": Item.value,
        "Col1": Item1,
        "Col2": Item2,
        "Col3": Item3,
        "Col4": Item4,
        "Col5": Item5,
        "Col6": Item6,
        "Col7": Item7,
        "Col8": Item8
    };
    var obji = { Clm: Clm }
    $.ajax({
        type: "POST",

        url: "../../Import/UpdateSetting",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            Clear();
            if (result.Message) {
                Swal.fire('Success!', result.Message, 'success');
            } else {
                Swal.fire('Success!', 'Settings Updated Successfully', 'success');
            }
        },
        error: function () {
            Swal.fire('Error!', 'Failed to update settings', 'error');
        }
    });
}

function Clear() {
    $("#dd1").html("");
    $("#dd2").html("");
    $("#dd2").html("");
    $("#dd3").html("");
    $("#dd4").html("");
    $("#dd5").html("");
    $("#dd6").html("");
    $("#dd7").html("");
    $("#dd8").html("");
    $("#cmbSheet2").html("");
    $("#cmbProvider2").html("");
    $("#lblFileName2").html("");
    $("#cmbType").val("")
    $("#txtDataBase").val('');
    $("#cmbViews").html("");
    $("#img").hide();
}

function GetSetting() {
    debugger;
    //var Item = $("#cmbProvider2").jqxDropDownList('getSelectedItem');
    var Item = $("#cmbProvider2").val();

    if (Item == null) {
        $("#cmbProvider2").notify('Please Select Provider');
        return;
    }

    //$('#cmbViews').jqxDropDownList('clear');
    $('#cmbViews').html("");


    var Clm = {
        "Provider": Item
    };

    $.ajax({
        type: "GET",
        cache: false,
        url: "../../Import/GetSetting",
        contentType: 'application/json',
        data: Clm,
        success: function (result) {
            debugger;
            var Setting = result.dtCol;

            if (result.dtDBCol) {
                GetDBSetting(result.dtDBCol);
            }

            else {
                $("#SelectFile").show();
                $("#DataBase").hide();
                //$("#cmbType").jqxDropDownList({ selectedIndex: 1 });
                $("#cmbType").prop('selectedIndex', 1);


                var source = [
                    Setting.Col1,
                    Setting.Col2,
                    Setting.Col3,
                    Setting.Col4,
                    Setting.Col5,
                    Setting.Col6,
                    Setting.Col7,
                    Setting.Col8
                ];
                bindDropdown($("#dd1"), source, 0);
                bindDropdown($("#dd2"), source, 1);
                bindDropdown($("#dd3"), source, 2);
                bindDropdown($("#dd4"), source, 3);
                bindDropdown($("#dd5"), source, 4);
                bindDropdown($("#dd6"), source, 5);
                bindDropdown($("#dd7"), source, 6);
                bindDropdown($("#dd8"), source, 7);
                // End Bind Settings Dropdowns
            }
        }
    })

}
function bindDropdown($dropdown, options, selectedIndex) {
    debugger;
    $dropdown.empty();
    $dropdown.append('<option value="">Select Column</option>');
    $.each(options, function (i, col) {
        var $opt = $('<option></option>').val(col).text(col);
        if (i === selectedIndex) $opt.prop('selected', true);
        $dropdown.append($opt);
    });
}

function saveMyFile(ref, fname, text, mime) {
    var blob = new Blob([text], { type: mime });
    saveAs(blob, fname);
    return false;
}


function Excel() {

    $("#SelectFile").show();
    $("#DataBase").hide();
    $("#UpdateSetting").show();
    $("#UpdateDBSetting").hide();
}

function DataBase() {

    $("#SelectFile").hide();
    $("#UpdateSetting").hide();
    $("#DataBase").show();
    $("#UpdateDBSetting").show();

}

function GetDBSetting(Data) {


    $("#DataBase").show();
    $("#SelectFile").hide();
    $("#cmbType").prop('selectedIndex', 2);


    var Setting = Data;

    var source = [
        Setting.Col1,
        Setting.Col2,
        Setting.Col3,
        Setting.Col4,
        Setting.Col5,
        Setting.Col6,
        Setting.Col7,
        Setting.Col8
    ];
    $("#txtDataBase").val(Setting.dbConstr);
    $("#cmbViews").val(Setting.dbTableName);
    bindDropdown($("#dd1"), source, 0);
    bindDropdown($("#dd2"), source, 1);
    bindDropdown($("#dd3"), source, 2);
    bindDropdown($("#dd4"), source, 3);
    bindDropdown($("#dd5"), source, 4);
    bindDropdown($("#dd6"), source, 5);
    bindDropdown($("#dd7"), source, 6);
    bindDropdown($("#dd8"), source, 7);
}

function UploadDataSetting() {

    var Provider = $("#cmbProvider2").val();
    if (Provider == null) {
        $("#cmbProvider2").notify('Please Select Provider');
        return;
    }

    var DataBase = $("#txtDataBase").val();
    if (DataBase == "") {
        $("#txtDataBase").notify('Please Select Connection String');
        return;
    }

    var TableName = $("#cmbViews").val();
    if (TableName == "") {
        $("#cmbViews").notify('Please Select Table Name');
        return;
    }

    var File = {
        "Provider": Provider.value,
        "dbConstr": DataBase,
        "dbTableName": TableName
    };
    $.ajax({
        type: "GET",
        cache: false,
        url: "../../Import/UploadDataSetting",
        contentType: 'application/json',
        data: File,
        success: function (result) {
            Columns = result.dtCol;
            FillSettings(Columns);
        }
    });

}


function UpdateDBSetting() {

    var Item = $("#cmbProvider2").val();
    if (Item == null) {
        $("#cmbProvider2").notify('Please Select Provider');
        return;
    }

    var Item1 = $("#dd1").val();
    if (Item1 == null) {
        $("#dd1").notify('Please Select Telephone No');
        return;
    }

    var Item2 = $("#dd2").val();
    if (Item2 == null) {
        $("#dd2").notify('Please Select Bill Date');
        return;
    }

    var Item3 = $("#dd3").val();
    if (Item3 == null) {
        $("#dd3").notify('Please Select Transaction Date');
        return;
    }

    var Item4 = $("#dd4").val();
    if (Item4 == null) {
        $("#dd4").notify('Please Select Call Type');
        return;
    }

    var Item5 = $("#dd5").val();
    if (Item5 == null) {
        $("#dd5").notify('Please Select Destination No');
        return;
    }

    var Item6 = $("#dd6").val();
    if (Item6 == null) {
        $("#dd6").notify('Please Select Time of Call');
        return;
    }

    var Item7 = $("#dd7").val();
    if (Item7 == null) {
        $("#dd7").notify('Please Select Duration (Sec)');
        return;
    }

    var Item8 = $("#dd8").val();
    if (Item8 == null) {
        $("#dd8").notify('Please Select Amount (KD)');
        return;
    }

    var DataBase = $("#txtDataBase").val();
    if (DataBase == "") {
        $("#txtDataBase").notify('Please Select Connection String');
        return;
    }

    var TableName = $("#cmbViews").val();
    if (TableName == "") {
        $("#cmbViews").notify('Please Select Table Name');
        return;
    }

    // Show SweetAlert2 confirmation
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to update database settings?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            performUpdateDBSetting(Item, Item1, Item2, Item3, Item4, Item5, Item6, Item7, Item8, DataBase, TableName);
        }
    });
}

function performUpdateDBSetting(Item, Item1, Item2, Item3, Item4, Item5, Item6, Item7, Item8, DataBase, TableName) {
    var Clm = {
        "Provider": Item,
        "Col1": Item1,
        "Col2": Item2,
        "Col3": Item3,
        "Col4": Item4,
        "Col5": Item5,
        "Col6": Item6,
        "Col7": Item7,
        "Col8": Item8,
        "dbConstr": DataBase,
        "dbTableName": TableName
    };
    var obji = { Clm: Clm }
    $.ajax({
        type: "POST",
        url: "../../Import/UpdateDBSetting",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            Clear();
            if (result.Message) {
                Swal.fire('Success!', result.Message, 'success');
            } else {
                Swal.fire('Success!', 'Database Settings Updated Successfully', 'success');
            }
        },
        error: function () {
            Swal.fire('Error!', 'Failed to update database settings', 'error');
        }
    });
}


function CheckProvider(Provider) {

    var value = {
        "Provider": Provider,
    };

    var obji = { value: value }

    $.ajax({
        type: "POST",
        url: "../../Import/CheckProvider",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            DbBased = result.DbBased;

            if (DbBased == 'True') {
                $("#h1").hide();
                $("#h2").hide();
                $("#h3").hide();
                $("#h4").hide();
                $("#btnUpload").show();
            }

            else {
                $("#h1").show();
                $("#h2").show();
                $("#h3").show();
                $("#h4").show();
                $("#btnUpload").hide();
            }

        }
    });
}

function TestConn() {

    $("#img").hide();
    var DataBase = $("#txtDataBase").val();
    if (DataBase == "") {
        $("#txtDataBase").notify('Please Select Connection String');
        return;
    }

    var value = {
        "dbConstr": DataBase,
    };

    var obji = { value: value }

    $.ajax({
        type: "POST",
        url: "../../Import/TestConn",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {

            if (result.Error) {

                $("#img").show();
                var Img = "<div><img src= ../../images/Cross-Anim.gif /></div>";
                $("#img").html(Img);
                Swal.fire('Error!', result.Error, 'error');
            }
            else {
                $("#img").show();
                var Img = "<div><img src= ../../images/Tick-Anim.gif /></div>";
                $("#img").html(Img);

                var Views = result.dtViews;
                var $cmbViews = $("#cmbViews");
                $cmbViews.empty();
                $cmbViews.append('<option value="">Select View</option>');

                $.each(Views, function (i, p) {
                    debugger
                    $cmbViews.append(
                        $('<option></option>')
                            .val(p)
                            .text(p)
                    );
                });
                ////End Bind cmbViews Dropdown

                Swal.fire('Success!', 'Connection Successful', 'success');
            }
        }
    });

}
// Build and show modal for Bill Details
function showBillDetailsModal(details) {
    debugger;
    // Remove existing if present
    $('#billDetailsOverlay').remove();

    var billed = details.billedNotInSystem || { CountOfBills: 0, TotalAmount: 0 };
    var inSystem = details.inSystemNotAssigned || { CountOfBills: 0, TotalAmount: 0 };
    var assigned = details.assignedOutsideDates || { CountOfBills: 0, TotalAmount: 0 };

    var modalHtml = ''
        + '<div id="billDetailsOverlay" role="dialog" aria-modal="true">'
        + '<div id="billDetailsModal">'
        + '<h3>Bill loaded successfully! Below is Summary of Un-Assigned Bills</h3>'
        + '<table id="billDetailsTable">'
        + '<tr><td style="padding-top:5rem !important;"><strong>Unregistered Mobile Numbers:</strong></td><td style="text-align:right">Count: <span id="bd1Count">' + (billed.CountOfBills || 0) + '</span></td><td style="text-align:right">Amount(kd): <span id="bd1Amt">' + billed.TotalAmount + '</span></td></tr>'
        + '<tr><td><strong>Mobile Number not Assgined to any User:</strong></td><td style="text-align:right">Count: <span id="bd2Count">' + (inSystem.CountOfBills || 0) + '</span></td><td style="text-align:right">Amount(kd): <span id="bd2Amt">' + inSystem.TotalAmount + '</span></td></tr>'
        + '<tr><td><strong>Assigned but outside valid Dates</strong></td><td style="text-align:right">Count: <span id="bd3Count">' + (assigned.CountOfBills || 0) + '</span></td><td style="text-align:right">Amount(kd): <span id="bd3Amt">' + assigned.TotalAmount + '</span></td></tr>'
        + '</table>'
        + '<div id="billDetailsBtns">'
        + '<button id="bdSendEmail" class="bd-btn bd-btn-primary">Send Email</button>'
        + '<button id="bdSendEmailGoto" class="bd-btn bd-btn-secondary">Goto Unassigned Bills</button>'
        + '<button id="bdClose" class="bd-btn bd-btn-close">Close</button>'
        + '</div>'
        + '</div>'
        + '</div>';

    $('body').append(modalHtml);
    var $overlay = $('#billDetailsOverlay');
    $overlay.css('display', 'flex').hide().fadeIn(150);



    // prepare the payload to send
    var payload = {
        BilledButNotInSystem: billed,
        InSystemButNotAssigned: inSystem,
        AssignedButOutsideValidDates: assigned
    };

    //$('#bdSendEmail').on('click', function () {
    $(document).on('click', '#bdSendEmail', function (e) {
        debugger;
        $.ajax({
            type: "POST",
            async: false,
            url: "../../Import/SendEmail",
            data: JSON.stringify({ BillDetails: payload }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result && (result.Success || result.success || result.Message && result.Message.toLowerCase() === 'succ')) {
                    Swal.fire('Success!', 'Email Sent Successfully', 'success');
                } else {
                    Swal.fire('Error!', 'Failed to send email', 'error');
                }
            },
            error: function () {
                Swal.fire('Error!', 'Failed to send email', 'error');
            }
        });
    });

}
function closeBillDetailsModal() {
    $('#billDetailsOverlay').fadeOut(150, function () {
        $(this).remove();
    });
}
function Export_ToExcel() {
    saveMyFile($('#SubmitForm'), "import_invoice_data" + ".xls", $("#grdData").jqxGrid('exportdata', 'xls'));
}