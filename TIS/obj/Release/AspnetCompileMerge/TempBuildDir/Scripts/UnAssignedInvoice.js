$(document).ready(function () {
    FillGrid();
})
$(document).on('click', '#btnAssign', function (e) {
    e.preventDefault();
    if (typeof AssignInvoice === 'function') AssignInvoice();
});
$(document).on('click', '#excelExport', function (e) {
    saveMyFile($('#SubmitForm'), "My Excel File" + ".xls", $("#grdData").jqxGrid('exportdata', 'xls'));
});

function FillGrid() {
    debugger;
    $.ajax({
        type: "GET",
        cache: false,
        url: "../../Import/GetUnAssignedBill",
        success: function (result) {
            var Bills = result.Bills;
            var deptsource =
            {
                localdata: Bills,
                datafields:
                    [
                        { name: 'BillDate', type: 'date' },
                        { name: 'Mobile', type: 'string' },
                        { name: 'ProviderName', type: 'string' },
                        { name: 'TotalAmount', type: 'number' }
                    ],
                datatype: "json"
            };

            var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
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
                selectionmode: 'none',
                columns: [
                    { dataField: 'BillDate', text: 'BillDate', cellsformat: 'MMMM-yyyy', cellsalign: 'center', width: '130px' },
                    { dataField: 'Mobile', text: 'Mobile' },
                    { dataField: 'ProviderName', text: 'ProviderName' },
                    { dataField: 'TotalAmount', text: 'TotalAmount' }

                ]
            });
        }
    });
}

function AssignInvoice() {
    debugger;
    $.ajax({
        type: "GET",

        url: "../../Import/AssignInvoice",
        success: function (result) {
            alert(result.Message);
            FillGrid();
        }
    });
}

function saveMyFile(ref, fname, text, mime) {
    var blob = new Blob([text], { type: mime });
    saveAs(blob, fname);
    return false;
}