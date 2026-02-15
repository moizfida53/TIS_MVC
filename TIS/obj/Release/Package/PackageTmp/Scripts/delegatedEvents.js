// Centralized delegated event handlers for dynamically-rendered elements
// Place a single <script src="~/Scripts/delegatedEvents.js"></script> in __MasterPage.Master__ after other scripts.

(function ($) {
    $(function () {

        // Common button actions (IDs used across pages)
        var clickMap = {
            '#btnAdd': 'AddTelephone',                // AddTelephone.aspx / other pages
            '#btnUpdate': 'UpdateTelephone',
            '#btnCancel': 'ClearTelephone',
            '#btnExportTelephone': 'ExportToExcel',
            '#btnExportAssign': 'Export_ToExcel',
            '#btnAssign': 'Assign',
            '#btnUpdateAsg': 'UpdateAssign',
            '#btnCancelAsg': 'ClearAssign',
            '#btnAddCountry': 'AddCountry',
            '#btnUpdateCountry': 'UpdateCountry',
            '#btnDeleteCountry': 'DeleteCountry',
            '#btnCancleCountry': 'ClearCountry',
            '#btnPrint': 'getMyArcBill',              // special: will use #hdnBillID if function expects id param
            '#btnSave': 'SaveChanges',
            '#btnProcess': 'ProcessBill',
            '#btnDone': 'SaveContact',
            '#btnAddDataRoaming': 'AddDataRoaming',
            '#btnUpdateDataRoaming': 'UpdateDataRoaming',
            '#btnDeleteDataRoaming': 'DeleteDataRoaming',
            '#btnCancelDataRoaming': 'ClearDataRoaming',
            '#btnApproveSelected': function () { if (typeof DoApprove === 'function') DoApprove(4); },
            '#btnRejectSelected': function () { if (typeof DoApprove === 'function') DoApprove(1); },
            '#btnSaveContact': 'SaveContact'
        };

        Object.keys(clickMap).forEach(function (selector) {
            $(document).on('click', selector, function (e) {
                e.preventDefault();
                var handler = clickMap[selector];
                if (typeof handler === 'string') {
                    // special case for print: prefer hdn value
                    if (handler === 'getMyArcBill') {
                        var billIdVal = $('#hdnBillID').val();
                        var billId = parseInt(billIdVal, 10);
                        if (!isNaN(billId) && billId > 0 && typeof getMyArcBill === 'function') {
                            getMyArcBill(billId);
                            return;
                        }
                        if ($.alert && $.alert.open) {
                            $.alert.open('error', 'Error', 'No bill selected to print.');
                        } else {
                            alert('No bill selected to print.');
                        }
                        return;
                    }
                    if (typeof window[handler] === 'function') {
                        window[handler]();
                    }
                } else if (typeof handler === 'function') {
                    handler();
                }
            });
        });

        // change events
        $(document).on('change', '#chkMyBillsOnly', function () {
            if (typeof showMyBills === 'function') showMyBills();
        });
        $(document).on('change', '#myCallType', function () {
            if (typeof ChangeCallType === 'function') ChangeCallType();
        });

        // delegated for radio inputs using data attributes (pattern used in grids)
        $(document).on('change', "input[data-handle='calltype']", function (e) {
            if (typeof handleClick === 'function') {
                handleClick(this, $(this).data('id'));
            }
        });

        // delegated blur for inline comment inputs with predictable ID prefixes
        $(document).on('blur', '[id^="txtComm"]', function () {
            var id = $(this).attr('id').replace(/^txtComm/, '');
            if (id && typeof saveComment === 'function') saveComment(parseInt(id, 10));
        });
        $(document).on('blur', '[id^="txtComment"]', function () {
            var id = $(this).attr('id').replace(/^txtComment/, '');
            if (id && typeof saveComments === 'function') saveComments(parseInt(id, 10));
        });

        // delegated click handlers for grid-rendered buttons (use data-* attributes in renderers)
        $(document).on('click', '.clsBillHistoryViewBtn', function (e) {
            e.preventDefault();
            var id = $(this).data('billid');
            if (id && typeof getMyArcBill === 'function') getMyArcBill(id);
        });
        $(document).on('click', '.clsOpenWindowBtn', function (e) {
            e.preventDefault();
            var id = $(this).data('billid');
            if (id && typeof openWindow === 'function') openWindow(id);
        });
        $(document).on('click', '.clsSelectMyBill', function (e) {
            e.preventDefault();
            var id = $(this).data('billid');
            if (id && typeof SelectMyBill === 'function') SelectMyBill(parseInt(id, 10));
        });

        // image / icon delegates
        $(document).on('click', '.imgBillDetailsContactName', function (e) {
            e.preventDefault();
            if (typeof ButtonClick === 'function') ButtonClick();
        });

        // fallback generic data-action handler (optional usage)
        $(document).on('click', '[data-action]', function (e) {
            e.preventDefault();
            var action = $(this).data('action');
            if (!action) return;
            // if data-id present, pass id as first argument
            var id = $(this).data('id') || $(this).data('billid');
            if (id && typeof window[action] === 'function') window[action](id);
            else if (typeof window[action] === 'function') window[action]();
        });

    });
})(jQuery);