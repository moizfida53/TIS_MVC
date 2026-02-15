

    $(document).ready(function () {
        GetReport();
        })

    function GetReport() {
        $.ajax({
            type: "GET",
            cache: false,
            url: "../SAP_Pending/GetSAPReport",
            success: function (result) {
                var Report = result.dtbillDetails;
                $("#PendingBills").text(result.PendingBills);
                var source =
                {
                    dataType: "json",
                    dataFields: [
                        { name: 'EMPLOYEENO', type: 'string' },
                        { name: 'Bill_ID', type: 'number' },
                        { name: 'BillDate', type: 'date' },
                        { name: 'TelephoneNumber', type: 'string' },
                        { name: 'EmployeeName', type: 'string' },
                        { name: 'ManagerName', type: 'string' },
                        { name: 'TotalAmount', type: 'string' },
                        { name: 'BusinessCharges', type: 'string' },
                        { name: 'PersonalCharges', type: 'string' },
                        { name: 'DeductibleAmount', type: 'string' },
                        { name: 'ReimbursementAmount', type: 'string' }
                    ],
                    id: 'Bill_ID',
                    localdata: Report
                };
                var dataAdapter = new $.jqx.dataAdapter(source);

                $("#grdReport").jqxGrid({
                    width: "100%",
                    source: dataAdapter,
                    columnsresize: true,
                    theme: 'arctic',
                    pageSize: 15,
                    sortable: true,
                    filterable: true,
                    showfilterrow: true,
                    pageable: true,
                    selectionmode: 'checkbox',
                    columnsresize: true,
                    columns: [
                        { text: 'Bill Date', datafield: 'BillDate', cellsformat: 'dd-MM-yyyy', width: 100 },
                        { text: 'Telephone Number', datafield: 'TelephoneNumber', width: 100 },
                        { text: 'BillID', datafield: 'Bill_ID', hidden: true },
                        { text: 'EmployeeID', datafield: 'EMPLOYEENO', width: 100 },
                        { text: 'Employee Name', datafield: 'EmployeeName', width: 250 },
                        { text: 'Line Manager Name', datafield: 'ManagerName' },
                        { text: 'Total Amount', datafield: 'TotalAmount' },
                        { text: 'Business Charges', datafield: 'BusinessCharges' },
                        { text: 'Personal Charges', datafield: 'PersonalCharges' },
                        { text: 'Deductible Amount', datafield: 'DeductibleAmount' },
                    ]
                });

            }
        });
        }

    function PostSAP() {
        $(document).ajaxStart($.blockUI({
            css: {
                border: 'none',
                padding: '10px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .3,
                color: '#fff'
            }
        })).ajaxStop($.unblockUI);

    $.ajax({
        type: "GET",
    cache: false,
    url: "../SAP_Pending/postSAP",
    success: function (result) {
                    var Report = result.Message;
    alert(Report);
                }
            });
        }

    function ExportToExcel() {
        saveMyFile($('#SubmitForm'), "BAPI Report" + ".xls", $("#grdReport").jqxGrid('exportdata', 'xls'));
        }
    function saveMyFile(ref, fname, text, mime) {
            var blob = new Blob([text], {type: mime });
    saveAs(blob, fname);
    return false;
        }
    function UpdateSAP() {
        $.alert.open('confirm', 'Are you sure you want to Mark as Posted ?', function (button) {
            if (button == 'yes') {
                var SAPdatarows = new Array();
                var Selectedrows = $("#grdReport").jqxGrid('selectedrowindexes');
                var selectedrecords = new Array();
                for (var m = 0; m < Selectedrows.length; m++) {
                    SAPdatarows[m] = $("#grdReport").jqxGrid('getrowdata', Selectedrows[m]);
                }
                var obji = { value: SAPdatarows }
                $.ajax({
                    type: "POST",
                    url: "../SAP_Pending/MarkAsPosted",
                    data: JSON.stringify(obji),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        GetReport();
                        $("#grdReport").jqxGrid('clearselection');
                    }

                })

            }
        });
        }
