
    $(document).ready(function () {
        $("#chkWavRtl").jqxCheckBox({ width: 30, height: 22 });
    $("#chkWavBus").jqxCheckBox({width: 30, height: 22 });
    $("#chkAlwTrain").jqxCheckBox({width: 30, height: 22 });


    // Toggle on wrapper click
    $(".checkbox-wrapper").on("click", function () {
                var checkboxId = $(this).find('[id^="chk"]').attr('id');
    var checkbox = $("#" + checkboxId);
    checkbox.jqxCheckBox('checked', !checkbox.jqxCheckBox('checked'));
            });

    // Open modal on Force Bill button click
    $("#btnForceBillOpen").on('click', function () {
                var selectedCount = $('#grdData').jqxGrid('getselectedrowindexes').length;
    if (selectedCount === 0) {
        showCustomAlert('warning', 'No Selection', 'Please select at least one bill to force.');
    return;
                }
    $('.force-bill-modal').fadeIn(300);
            });

    // Close modal
    $('.modal-close-btn, .btn-cancel').on('click', function () {
        $('.force-bill-modal').fadeOut(300);
            });

    // Close on overlay click
    $('.force-bill-modal').on('click', function (e) {
                if ($(e.target).hasClass('force-bill-modal')) {
        $('.force-bill-modal').fadeOut(300);
                }
            });

    // Execute Force Bill
    $("#btnForceBill").on('click', function () {
        ForceBill();
            });

    // Close custom alert
    $('.custom-alert-btn').on('click', function () {
        closeCustomAlert();
            });

    // Close alert on overlay click
    $('.custom-alert-overlay').on('click', function (e) {
                if ($(e.target).hasClass('custom-alert-overlay')) {
        closeCustomAlert();
                }
            });

    $("#excelExport").click(function () {
        saveMyFile($('#SubmitForm'), "My Excel File" + ".xls", $("#grdData").jqxGrid('exportdata', 'xls'));
            });

    FillGrid();
        })

    function showCustomAlert(type, title, message) {
            // Ensure alert is hidden first
            var $overlay = $('.custom-alert-overlay');
    $overlay.removeClass('show');

    // Use setTimeout to ensure proper rendering
    setTimeout(function () {
                var iconMap = {
        'warning': '⚠️',
    'success': '✅'
                };

    $('#customAlertIcon').text(iconMap[type]);
    $('#customAlertTitle').text(title);
    $('#customAlertMessage').text(message);

    $('.custom-alert-header').removeClass('warning success').addClass(type);
    $('.custom-alert-btn').removeClass('warning success').addClass(type);

    $overlay.addClass('show');
            }, 50);
        }

    function closeCustomAlert() {
        $('.custom-alert-overlay').removeClass('show');
        }

    function FillGrid() {
        $.ajax({
            type: "GET",
            url: "../../Bill/GetForceBill",
            cache: false,
            success: function (result) {
                var Bills = result.Bills;
                var deptsource =
                {
                    localdata: Bills,
                    datafields:
                        [
                            { name: 'Id', type: 'number' },
                            { name: 'BillDate', type: 'date' },
                            { name: 'EmpName', type: 'string' },
                            { name: 'ManagerName', type: 'string' },
                            { name: 'Department', type: 'string' },
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
                    theme: 'dark-blue',
                    pageSize: 10,
                    sortable: true,
                    filterable: true,
                    showfilterrow: true,
                    pageable: true,
                    selectionmode: 'checkbox',
                    columns: [
                        { dataField: 'Id', text: 'Bill ID', hidden: 'true' },
                        { dataField: 'BillDate', text: 'BillDate', cellsformat: 'MMMM-yyyy', cellsalign: 'center', width: '130px' },
                        { dataField: 'EmpName', text: 'Employee Name', width: '250px' },
                        { dataField: 'ManagerName', text: 'Manager Name', width: '250px' },
                        { dataField: 'Department', text: 'Department', width: '200px' },
                        { dataField: 'Mobile', text: 'Mobile', width: '120px' },
                        { dataField: 'ProviderName', text: 'ProviderName' },
                        { dataField: 'TotalAmount', text: 'TotalAmount' }
                    ]
                });
            }
        });
        }

    function ForceBill() {
        // Close modal first
        $('.force-bill-modal').fadeOut(300);

    // Show centered block UI with custom styling
    $.blockUI({
        message: '<h1>Processing Force Bill...</h1>',
    css: {
        border: 'none',
    padding: '30px 50px',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    '-webkit-border-radius': '15px',
    '-moz-border-radius': '15px',
    'border-radius': '15px',
    opacity: 1,
    color: '#fff',
    'font-size': '18px',
    'font-weight': '600'
                },
    overlayCSS: {
        backgroundColor: '#000',
    opacity: 0.6
                }
            });

    var BillID = [];
    var Indexes = $('#grdData').jqxGrid('getselectedrowindexes');
    for (var i = 0; i < Indexes.length; i++) {
                var RowData = $('#grdData').jqxGrid('getrowdata', Indexes[i]);
    var ID = RowData.Id;
    BillID.push(ID);
            }

    var uid = sessionStorage.getItem('UID');

    var Force = {
        "BillID": BillID,
    "Status": $("#cmbStatus").val(),
    "CallType": $("#cmbCallType").val(),
    "WavRental": $('#chkWavRtl').jqxCheckBox('checked'),
    "WavBusiness": $('#chkWavBus').jqxCheckBox('checked'),
    "Train": $('#chkAlwTrain').jqxCheckBox('checked'),
    "UID": uid,
            };
    var obji = {Bill: Force }
    $.ajax({
        type: "POST",
    url: "../../Bill/ForceBill",
    data: JSON.stringify(obji),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
        $.unblockUI();
    showCustomAlert('success', 'Success', 'Bill Forced Successfully');
    Clear();
    FillGrid();
                },
    error: function (xhr, status, error) {
        $.unblockUI();
    showCustomAlert('warning', 'Error', 'Failed to force bill. Please try again.');
                }
            });
        }

    function Clear() {
        $("#grdData").jqxGrid('clearselection');
    $("#cmbStatus").val("4");
    $("#cmbCallType").val("2");
        }

    function saveMyFile(ref, fname, text, mime) {
            var blob = new Blob([text], {type: mime });
    saveAs(blob, fname);
    return false;
        }



