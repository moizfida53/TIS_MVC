
var Companies;
var Year = [];
var selectedYear = 0; // store the selected year
var selectedMonth = 0;
var selectedstatus = 0;
var selectedCompany = 0;
$(document).ready(function () {
    // Set default selected month if needed
    $('#cmbMonth').val('0'); // 0 = "Select Month"

    // Log all month options (optional)
    console.log("Month items:", $('#cmbMonth option').map(function () {
        return { value: this.value, text: this.text };
    }).get());

    // Handle month selection
    $('#cmbMonth').on('change', function () {
        var selectedValue = $(this).val();
        selectedMonth = selectedValue; // store selected month
        console.log("Selected month:", selectedMonth);
    });

    // Handle Status selection
    $('#cmbStatus').on('change', function () {
        selectedStatus = $(this).val(); // get selected value
        console.log("Selected Status:", selectedStatus);
    });
    $(document).on('click', '#btnBillReportExport', function (e) {
        e.preventDefault();
        if (typeof ExportToExcel === 'function') {
            ExportToExcel();
        }
    });


    $("#Select").hide();
    $("#btnSearch").jqxButton({ template: '' });
    $('#btnSearch').on('click', function () {
        Search();
    });
    $("#btnCancel").jqxButton({ template: '' });
    $('#btnCancel').on('click', function () {
        Clear();
    });
    FillYear();
    GetCompanyList();
    GetData();

    GetCompanyList();

    // Handle selection
    $('#cmbCompany').on('change', function () {
        selectedCompany = $(this).val();
        var companyName = $(this).find('option:selected').text();
        $('#hidCompany').val(selectedCompany); // store ID in hidden field
        console.log("Selected Company:", selectedCompany, companyName);
    });


    if ($('#isFinanceRoleUser').val() == "1") {
        $('#tdCompanyDropdown').hide();
        $('#tdCompanylbl').hide();
    }
    else {
        $('#tdCompanyDropdown').show();
        $('#tdCompanylbl').show();
    }
})

function GetData() {
    $.ajax({
        type: "GET",
        url: "../../BillReport/GetReport",
        data: { "IsStatus": "true" },
        success: function (result) {
        }
    })
}
// Get company list via AJAX and populate dropdown
function GetCompanyList() {
    $.ajax({
        type: "GET",
        url: "../../BillReport/GetReportFiltersData",
        success: function (result) {
            Companies = result.CompanyList;
            FillCompany();
        }
    });
}
function Search() {
    debugger;
    var Month = 0, Year = 0, Status = 0, companyId = 0;

    Month = selectedMonth;
    Status = selectedstatus;
    companyId = selectedCompany;

    var Year = $("#cmbYear").val() || 0;


    var Search = {
        "Month": Month,
        "Year": Year,
        "Status": Status,
        "CompanyId": companyId
    };

    $.ajax({
        type: "POST",
        url: "../../BillReport/Search",
        data: JSON.stringify({ Search: Search }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            FillGrid(result.dtData);
            $("#grdData").show();
        }
    });
}

function FillGrid(dtData) {

    var deptsource =
    {
        localdata: dtData,
        datafields:
            [
                { name: 'BILL_ID', type: 'number' },
                { name: 'SUB_NO', type: 'number' },
                { name: 'SUB_NO', type: 'string' },
                { name: 'SUB_DESC', type: 'string' },
                { name: 'EMPLOYEENO', type: 'string' },
                { name: 'EMPLOYEENAME', type: 'string' },
                { name: 'ManagerName', type: 'string' },
                { name: 'BILLDATE', type: 'date' },
                { name: 'TOTALAMOUNT', type: 'number' },
                { name: 'DEDUCTIBLEAMOUNT', type: 'number' },
                { name: 'BUSINESSCHARGES', type: 'number' },
                { name: 'Company', type: 'string' },
                { name: 'PAYROLLCATEGORY', type: 'string' },
                { name: 'BillStatus', type: 'string' },
                { name: 'LASTUPDATEDON', type: 'date' },
                { name: 'ApprovedDate', type: 'string' }
            ],
        id: 'BILL_ID',
        datatype: "json"
    };

    var dataAdapGrid = new $.jqx.dataAdapter(deptsource);

    $("#grdData").jqxGrid({
        width: '100%',
        source: dataAdapGrid,
        columnsresize: true,
        theme: 'arctic',
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        filtermode: 'excel',
        groupable: true,
        pageable: false,
        theme: 'ui-redmond',
        selectionmode: 'singlecell',
        editable: true,
        editmode: 'selectedcell',
        columns: [
            { dataField: 'BILL_ID', text: 'Id', hidden: 'true' },
            { dataField: 'EMPLOYEENO', text: 'Employee Number', width: '7%' },
            { dataField: 'EMPLOYEENAME', text: 'Employee name', width: '14%' },
            { dataField: 'SUB_NO', text: 'Mobile number', width: '6%', filtercondition: 'contains' },
            { dataField: 'SUB_DESC', text: 'Mobile Description', width: '8%' },
            { dataField: 'ManagerName', text: 'Manager Name', width: '10%' },
            { dataField: 'BILLDATE', text: 'Bill Date', cellsformat: 'dd-MM-yyyy', width: '7%' },
            {
                //dataField: 'TOTALAMOUNT', text: 'Bill Amount', width: '5%',
                dataField: 'TOTALAMOUNT', text: 'Bill Amount', width: '5%', cellsformat: 'd3'

            },
            { dataField: 'DEDUCTIBLEAMOUNT', text: 'Deductible Amount', width: '7%', cellsformat: 'd3' },
            { dataField: 'BUSINESSCHARGES', text: 'Charge to Business', width: '7%', cellsformat: 'd3' },
            { dataField: 'Company', text: 'Company', width: '7%' },
            { dataField: 'PAYROLLCATEGORY', text: 'Payroll Cateogry', width: '8%' },
            { dataField: 'BillStatus', text: 'Bill Status', width: '8%' },
            { dataField: 'LASTUPDATEDON', text: 'Last Updated On', cellsformat: 'dd-MM-yyyy', width: '6%' },
            { dataField: 'ApprovedDate', text: 'Approved Date', width: '6%', hidden: 'true' }
        ],
        showgroupsheader: true,
        groupsrenderer: groupsRenderer,

    });
}
// 🔧 Custom group renderer for multi-level grouping
function groupsRenderer(text, group, expanded, data) {
    debugger;
    let groupData = data.subItems;
    let count = groupData.length;
    let totalAmountSum = 0;

    // Recursively sum if nested group
    function calculateSum(items) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].subItems) {
                calculateSum(items[i].subItems);
            } else {
                totalAmountSum += items[i].TOTALAMOUNT;
            }
        }
    }
    calculateSum(groupData);

    return `<div style="margin-left:5px;">
                    <b>${group}</b> - Employees: ${count} | Bill Amount Total:${totalAmountSum.toFixed(3)}
                </div>`;
}

function FillYear() {
    var $ddl = $("#cmbYear");
    $ddl.empty();
    $ddl.append('<option value="">Select Year</option>');

    for (var i = 2020; i <= 2030; i++) {
        $ddl.append(`<option value="${i}">${i}</option>`);
    }
}
function Clear() {
    $("#cmbMonth").val('0'); // default "Select Month"
    $("#cmbYear").val('');   // default "Select Year"
    $("#cmbStatus").val('');   // default "Select Year"
    $("#cmbProvider").jqxDropDownList({ selectedIndex: -1 });
    $("#hidEmp").val('');
    $("#grdData").jqxGrid('clearselection');
    $("#grdData").hide();

}
function ExportToExcel() {
    saveMyFile($('#SubmitForm'), "Bill Status Report" + ".xls", $("#grdData").jqxGrid('exportdata', 'xls'));
}
function saveMyFile(ref, fname, text, mime) {
    var blob = new Blob([text], { type: mime });
    saveAs(blob, fname);
    return false;
}
// Fill dropdown with ID + Name
function FillCompany() {
    var $ddl = $('#cmbCompany');
    $ddl.empty();
    $ddl.append('<option value="">Select Company</option>');

    Companies.forEach(function (company) {
        $ddl.append(`<option value="${company.ID}">${company.COMPANY}</option>`);
    });
}