
var Employees;
var Provider;
var Year = [];
var UID = [];
var billID = [];
var DataAdapEmp;
$(document).ready(function () {
    //$("#cmbMonth").jqxDropDownList({ placeHolder: 'Select Month', selectedIndex: -1, width: '95%', height: '25px' });
    //$("#cmbMonth").jqxDropDownList('loadFromSelect', 'Select');
    //$("#Select").hide();
    //$("#cmbYear").jqxDropDownList({ placeHolder: 'Select Year', selectedIndex: -1, width: '95%', height: '25' });
    //$("#cmbProvider").jqxDropDownList({ placeHolder: 'Select Provider', selectedIndex: -1, width: "95%", height: 25 });
    $("#btnEmployee").jqxDropDownButton({ width: "95%", height: 25 });
    $("#btnEmployee").jqxDropDownButton('setContent', 'Select Employee');
    $('#btnEmployee').on('open', function () { FillEmployee(); });
    $("#btnSearch").jqxButton({ template: '' });
    $('#btnSearch').on('click', function () {
        Search();
    });
    $("#btnSave").jqxButton({ template: '' });
    $('#btnSave').on('click', function () {
        SaveChanges();
    });
    $("#btnSave").hide();
    $("#btnCancel").jqxButton({ template: '' });
    $('#btnCancel').on('click', function () {
        Clear();
    });
    FillYear();
    GetData();
})
function GetData() {
    $.ajax({
        type: "GET",
        url: "../../Bill/GetSearchData",
        data: { "IsStatus": "false" },
        success: function (result) {
            Employees = result.EmpList;
            Provider = result.ProviderList;
            FillProvider();
            FillEmployee();
        }
    })
}
function FillEmployee() {

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
    $("#grdEmployee").jqxGrid({
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

    $("#grdEmployee").on('rowselect', function (event) {
        var args = event.args;
        var row = $("#grdEmployee").jqxGrid('getrowdata', args.rowindex);
        var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['EmpName'] + ' - ' + row['EmpNo'] + '</div>';
        $('#hidEmp').val(row['EmpId']);
        $("#btnEmployee").jqxDropDownButton('setContent', dropDownct);
        $('#btnEmployee').jqxDropDownButton('close');
    });
}
function FillYear() {
    for (var i = 2024; i <= 2030; i++) {
        Year.push(i);
    }
    //$("#cmbYear").jqxDropDownList({ source: Year });
    ////Begin Bind Year Dropdown
    var providersCountries = Year;
    var $cmbYear = $("#cmbYear");
    $cmbYear.empty();
    $cmbYear.append('<option value="">Select Provider</option>');

    $.each(providersCountries, function (i, p) {
        debugger
        $cmbYear.append(
            $('<option></option>')
                .val(p)
                .text(p)
        );
    });
    ////End Bind Year Dropdown
}
function FillProvider() {
    //var source =
    //{
    //    dataType: "json",
    //    dataFields: [
    //        { name: 'ID', type: 'string' },
    //        { name: 'NAME', type: 'string' }
    //    ],
    //    id: 'ID',
    //    localdata: Provider
    //};
    //var dataAdapterPr = new $.jqx.dataAdapter(source);
    //// Create a jqxComboBox
    //$("#cmbProvider").jqxDropDownList({ source: dataAdapterPr, displayMember: "NAME", valueMember: "ID" });

    ////Begin Bind Provider Dropdown
    //var providersCountries = Year;
    var $cmbProvider = $("#cmbProvider");
    $cmbProvider.empty();
    $cmbProvider.append('<option value="">Select Provider</option>');

    $.each(Provider, function (i, p) {
        debugger
        $cmbProvider.append(
            $('<option></option>')
                .val(p.ID)
                .text(p.NAME)
        );
    });
    ////End Bind Provider Dropdown
}
function Search() {
    var Provider = 0; var Month = 0; var Year = 0; var UID = 0;

    //if ($("#cmbProvider").jqxDropDownList('getSelectedItem') != null) {
    //    Provider = $("#cmbProvider").jqxDropDownList('getSelectedItem');
    //}
    if ($("#cmbMonth").val() != null) {
        Month = $("#cmbMonth").val();
    }

    if ($("#cmbProvider").val() != null) {
        Provider = $("#cmbProvider").val();
    }
    if ($("#cmbYear").val() != null) {
        Year = $("#cmbYear").val();
    }

    if ($("#hidEmp").val() != '') {
        UID = $("#hidEmp").val();
    }


    var Search = {
        "Month": Month,
        "Year": Year.label,
        "Provider": Provider.value,
        "UID": UID
    };
    var obji = { Search: Search }
    $.ajax({
        type: "POST",
        url: "../../Bill/SearchOpenBill",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            FillGrid(result.dtData);
            $("#grdData").show();
        }
    })
}
function openAssignModal() {
    document.getElementById('modalOverlay-Assign').classList.add('active');
    document.getElementById('modalContainer-Assign').classList.add('active');
    document.body.style.overflow = 'hidden';

    loadEmployeesAssign();
}

function FillGrid(dtData) {
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
    DataAdapEmp = new $.jqx.dataAdapter(sourceEmp);

    var deptsource =
    {
        localdata: dtData,
        datafields:
            [
                { name: 'Id', type: 'number' },
                { name: 'BillDate', type: 'date' },
                { name: 'Mobile', type: 'string' },
                { name: 'EmpName', type: 'string' },
                { name: 'ManagerName', type: 'string' },
                { name: 'TotalAmount', type: 'number' },
                { name: 'Uid', type: 'number' }

            ],
        datatype: "json"
    };

    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);

    $("#grdData").jqxGrid({
        width: '100%',
        height: "600px",
        source: dataAdapterCategory,
        columnsresize: true,
        theme: 'dark-blue',
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        rowsheight: 50,

        selectionmode: 'singlerow',
        editable: false,
        columns: [
            { dataField: 'Id', text: 'Id', hidden: true },
            { dataField: 'BillDate', text: 'Bill Date', cellsformat: 'dd-MM-yyyy' },
            { dataField: 'Mobile', text: 'Mobile' },
            { dataField: 'EmpName', text: 'Employee Name', width: '150px' },
            { dataField: 'ManagerName', text: 'Manager Name' },
            { dataField: 'TotalAmount', text: 'Amount' },
            {
                text: 'Assign To',
                datafield: 'Uid',
                width: '12%',
                cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                    return `
                                    <div style="text-align:center;margin-top:7px;">
                                        <button class="btn btn-primary btn-assign"style="padding:4px 6px;" data-id="${rowdata.Id}" data-uid="${rowdata.Uid}">Assign</button>
                                    </div>
                                    `;
                },

            },


        ]
    });

    // 🔹 Handle button click separately (since jqxGrid won't auto-bind)
    $(document).on('click', '.btn-assign', function (e) {
        const billId = $(this).data('id');
        const uid = $(this).data('uid'); // if needed

        // Store them globally so you can use them later
        window.currentBillId = billId;
        window.currentUid = uid;
        openAssignModal();
    });
}



function loadEmployeesAssign() {

    $.ajax({
        type: "GET",
        url: "../../Ajax/getEmployees",
        success: function (result) {
            employeeDataAssign = result.EmpList;
            filteredDataAssign = employeeDataAssign;
            renderGridAssign(filteredDataAssign);
        },
        error: function () {
            $('#gridBody-Assign').html('<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-text">Failed to load employees. Please try again.</div></div>');
        }
    });

}

let employeeDataAssign = []; // store original data globally
let filteredDataAssign = [];


function renderGridAssign(data) {
    const gridBody = document.getElementById('gridBody-Assign');
    gridBody.innerHTML = '';

    if (data.length === 0) {
        gridBody.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-text">No employees found</div>
            </div>`;
        return;
    }

    data.forEach(function (emp) {
        const row = document.createElement('div');
        row.className = 'grid-row';
        row.innerHTML = `
            <div class="grid-cell" data-label="Employee No">${emp.EmpNo || ''}</div>
            <div class="grid-cell" data-label="Employee Name">${emp.EmpName || ''}</div>
        `;

        // 🔹 When row clicked:
        row.addEventListener('click', function () {
            document.querySelectorAll('#gridBody-Assign .grid-row').forEach(r => r.classList.remove('selected-row'));
            this.classList.add('selected-row');
            selectEmployeeAssign(emp.EmpName, emp.EmpId);
        });

        gridBody.appendChild(row);
    });
}
// 3️⃣ Bind search input only once
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput-Assign');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        filterEmployeesAssign(searchTerm);
    });
});

let debounceTimer;
searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        filterEmployeesAssign(searchInput.value.toLowerCase());
    }, 200); // wait 200ms after typing stops
});


function selectEmployeeAssign(username, EmpId) {
    console.log('Selected employee:', username);
    console.log('Selected employee:', EmpId);

    const billId = window.currentBillId;

    console.log("BillId:", billId);

    var rowIndex = $("#grdData").jqxGrid('getrowboundindexbyid', billId);

    $(document).on('click', '#modelAssign', function (e) {
        const selectedEmpId = $(this).data('empid');
        const selectedEmpName = $(this).text();
        closeAssignModal();

        // Store selection globally or call your assign API directly
        console.log("Selected Emp:", selectedEmpId, selectedEmpName);

        Swal.fire({
            title: "Re-Assign Bill",
            text: "Are you sure you want to Re-Assign the Bill?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33"
        }).then((result) => {
            if (result.isConfirmed) {

                // 🔹 Show loader and keep row highlighted
                Swal.fire({
                    title: "Please wait...",
                    text: "Updating bill status...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => { Swal.showLoading(); }
                });
                e.stopPropagation();
                setTimeout(() => $("#grdData").jqxGrid('selectrow', rowIndex), 10);

                $.ajax({
                    //url: '/Bill/ReAssignBill_Save',
                    url: '../../Bill/ReAssigningBill',
                    type: 'POST',
                    data: {
                        billId: billId,
                        Uid: EmpId
                    },
                    success: function (response) {
                        // Close loader first
                        Swal.close();

                        if (response.success) {
                            Swal.fire("Success", response.message, "Successfully Re-Assigned").then(() => {
                                // Refresh grid
                                Search();
                            });
                        } else {
                            Swal.fire("Error", response.message, "error");
                        }
                    },
                    error: function (xhr, status, error) {
                        Swal.fire("Error", error, "error");
                    },
                    complete: function () {
                    }
                });
            } else {
            }
        });

        //// Example: call assign endpoint or push data
        //UID.push(selectedEmpId);
        //billID.push(currentBillId); // use a global var set before modal opens

    });
    //closeAssignModal();

}











function closeAssignModal() {
    document.getElementById('modalOverlay-Assign').classList.remove('active');
    document.getElementById('modalContainer-Assign').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('searchInput-Assign').value = '';
}

$(document).on('click', '#modalClose-Assign', function () {

    closeAssignModal();
});
// Search Functionality


function filterEmployeesAssign(searchTerm) {
    if (!searchTerm) {
        filteredDataAssign = employeeDataAssign;
    } else {
        filteredDataAssign = employeeDataAssign.filter(emp => {
            return (
                (emp.EmpName && emp.EmpName.toLowerCase().includes(searchTerm)) ||
                (emp.EmpNo && emp.EmpNo.toLowerCase().includes(searchTerm))
            );
        });
    }
    renderGridAssign(filteredDataAssign);
}

function SaveChanges() {

    if (billID.length == 0) {
        alert('Select Atleast One Record');
        return;
    }

    var RB = {
        "BillID": billID,
        "UID": UID
    };
    var obji = { RB: RB }
    $.ajax({
        type: "POST",
        url: "../../Bill/ReAssigningBill",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            alert(result.Message);
            Clear();
        }
    });
}
function Clear() {
    //$("#cmbMonth").jqxDropDownList({ selectedIndex: -1 });
    //$("#cmbYear").jqxDropDownList({ selectedIndex: -1 });
    //$("#cmbProvider").jqxDropDownList({ selectedIndex: -1 });
    //$("#hidEmp").val('');
    //$("#grdData").jqxGrid('clearselection');
    //$("#grdData").hide();
    //$("#btnSave").hide();

    location.reload();
}



