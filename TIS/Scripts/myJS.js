var arrovalItem;
var bc, pc, ac, uc;
var blim, alim;
var isbus;
var isper;
var HidePer;
var myPart = 1;
var GBillId = 0;
var attemp = 0;
var sortinformation;
var sortdirection;
var hardSelect = 0;
var itemData;
var Settings;
var currentValue = 0;
var employees
var uid;
var AppBills;
var sortColumn = 'TransType';
var ArcBills;
var deptsourceDetail;
var cellclass;
var ExName;
var CName;
let flgTabClickLock = 0;
let jqx_rowsheight = 43;
let jqx_theme = 'dark-blue';

// Delegated handler replacing inline onclicks for call type radios
// Uses change because these are radio inputs; supports dynamically created radios
$(document).on('change', "input[data-handle='calltype']", function (e) {
    var $el = $(this);
    var id = $el.data('id');
    if (typeof handleClick === 'function') {
        // pass the native element and id to existing handler
        handleClick(this, id);
    }
});

function getMyArcBill1(arcbid) {

    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: "../../Ajax/getReportBillArchive",
        data: { billId: arcbid },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            console.log('obj');
            console.log(result);
            var myVariable = '';
            var myVariable1 = '';
            var tAmt = 0;
            var GAmt = 0;
            myVariable1 = myVariable1 + ($("#archead").render(result.ArchiveBill));

            for (var i = 0; i < result.Trans.length; i++) {
                var currentGroup = result.Trans[i];
                tAmt = 0;
                myVariable = myVariable + ($("#thh").render(currentGroup));
                var newJsonItems = [];
                for (var j = 0; j < result.RptBill.length; j++) {

                    var currentItem = result.RptBill[j];

                    if (currentItem.TransType == currentGroup.StrTrans) {
                        tAmt = tAmt + currentItem.Amount;
                        myVariable = myVariable + ($("#trr").render(currentItem));
                        GAmt = GAmt + currentItem.Amount;
                    }
                }
                var Tot = { tot: tAmt.toFixed(3) };
                myVariable = myVariable + ($("#trrb").render(Tot));
            }
            console.log(myVariable);

            var GrAmt = { GTot: GAmt.toFixed(3) };
            myVariable = myVariable + ($("#trrg").render(GrAmt));
            $("#myBillTableArc").html(myVariable);


            var gridContent = myVariable1 + $("#finalHtmlArc").html();
            var newWindow = window.open('', '', 'width=900, height=950, scrollbars=1, top=1, left=1'),
                document = newWindow.document.open(),
                pageContent =
                    '<!DOCTYPE html>\n' +
                    '<html>\n' +
                    '<head>\n' +
                    '<meta charset="utf-8" />\n' +
                    '<title>My Bill</title>\n' +
                    '</head>\n' +
                    '<body>\n' + gridContent + '\n</body>\n</html>';
            document.write(pageContent);
            document.close();
            newWindow.print();


        }
    });

}



//updated getMyArcBill layout


function getMyArcBill(arcbid) {
    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: "../../Ajax/getReportBillArchive",
        data: { billId: arcbid },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            var bill = result.ArchiveBill;
            var tAmt = 0, GAmt = 0;

            // ── Build transaction rows grouped by Trans type ──
            var txnHtml = '';
            for (var i = 0; i < result.Trans.length; i++) {
                var grp = result.Trans[i];
                tAmt = 0;
                var rowsHtml = '';
                for (var j = 0; j < result.RptBill.length; j++) {
                    var r = result.RptBill[j];
                    if (r.TransType !== grp.StrTrans) continue;
                    tAmt += r.Amount;
                    GAmt += r.Amount;
                    var ctLower = (r.CallType || '').toLowerCase();
                    var badgeClass = ctLower === 'personal' ? 'personal'
                        : ctLower === 'business' ? 'business' : 'allowance';
                    rowsHtml +=
                        '<tr>' +
                        '<td>' + (r.TransType || '') + '</td>' +
                        '<td>' + (r.CallTime || '') + '</td>' +
                        '<td>' + (r.CallDate || '') + '</td>' +
                        '<td>' + (r.Description || '') + '</td>' +
                        '<td style="text-align:center">' + (r.Duration || '0') + '</td>' +
                        '<td><span class="call-type-badge ' + badgeClass + '">' + (r.CallType || '') + '</span></td>' +
                        '<td>' + (r.Amount ? r.Amount.toFixed(3) : '0.000') + '</td>' +
                        '</tr>';
                }
                txnHtml +=
                    '<div class="txn-section">' +
                    '<div class="txn-group-header">' + grp.StrTrans + '</div>' +
                    '<table class="txn-table">' +
                    '<thead><tr>' +
                    '<th>Transaction Type</th><th>Time</th><th>Call Date</th>' +
                    '<th>Description</th><th style="text-align:center">Duration</th>' +
                    '<th>Call Type</th><th style="text-align:right">Amount</th>' +
                    '</tr></thead>' +
                    '<tbody>' + rowsHtml +
                    '<tr class="subtotal"><td colspan="6">Subtotal</td><td>' + tAmt.toFixed(3) + '</td></tr>' +
                    '</tbody></table></div>';
            }

            // Grand total row appended after last group
            txnHtml +=
                '<table class="txn-table" style="margin-top:-1px">' +
                '<tbody><tr class="grandtotal" style="color: #3b79b7 !important">' +
                '<td colspan="6">Grand Total</td>' +
                '<td>' + GAmt.toFixed(3) + '</td>' +
                '</tr></tbody></table>';

            
            // ── Helper to safely read bill field ──
            function f(key) { return bill[key] != null ? bill[key] : ''; }

            // ── Helper to format numeric fields to 3 decimal places ──
            function amt(key) { return parseFloat(f(key) || 0).toFixed(3); }

            // ── Format Bill Month — strip time portion ──
            var rawDate = f('BILLDATE');
            var billMonthStr = rawDate;
            var dp = rawDate.split(' ')[0].split('/');
            if (dp.length === 3) {
                var bd = new Date(dp[2], dp[1] - 1, dp[0]);
                billMonthStr = bd.toLocaleString('en-US', { month: 'short', year: 'numeric' });
            }

            // ── Status badge class ──
            var statusClass = (f('STATUS') || '').toLowerCase() === 'closed' ? 'closed' : 'pending';

            // ── Comments block (only if not empty) ──
            var commentsBlock = '';
            if (f('COMMENTS')) {
                commentsBlock =
                    '<div class="comments-block">' +
                    '<div class="cb-label">Comments</div>' +
                    '<div>' + f('COMMENTS') + '</div>' +
                    '</div>';
            }

            // ── Metrics bar HTML ──
            var metricsBar =
                '<div class="metrics-bar">' +

                // Total Bill Amount — left dark anchor
                '<div class="metric-total">' +
                '<div class="m-label">Total Bill Amount</div>' +
                '<div class="m-value">' + amt('TOTALAMOUNT') + '</div>' +
                '</div>' +
                '<div class="metrics-divider"></div>' +

                '<div class="metrics-items">' +

                // ALLOWANCE grouped box: title bar + two sub-cells
                '<div class="m-group">' +
                '<div class="m-group-title">Allowance</div>' +
                '<div class="m-group-cells">' +
                '<div class="m-cell">' +
                '<div class="m-label">Limit</div>' +
                '<div class="m-value">' + amt('MONTHLYLIMIT') + '</div>' +
                '</div>' +
                '<div class="m-cell">' +
                '<div class="m-label">Charges</div>' +
                '<div class="m-value">' + amt('PERSONALLIMITCHARGES') + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +

                // BUSINESS grouped box: title bar + two sub-cells
                '<div class="m-group">' +
                '<div class="m-group-title">Business</div>' +
                '<div class="m-group-cells">' +
                '<div class="m-cell">' +
                '<div class="m-label">Limit</div>' +
                '<div class="m-value">' + amt('BUSSINESSLIMIT') + '</div>' +
                '</div>' +
                '<div class="m-cell">' +
                '<div class="m-label">Charges</div>' +
                '<div class="m-value">' + amt('BUSINESSCHARGES') + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +

                // Waiver + Personal Charges — stacked in one column
                '<div class="m-stack">' +
                '<div class="m-stack-row">' +
                '<div class="m-label">Waiver Amount</div>' +
                '<div class="m-value">' + amt('WAIVERAMOUNT') + '</div>' +
                '</div>' +
                '<div class="m-stack-row m-stack-row-bottom">' +
                '<div class="m-label">Personal Charges</div>' +
                '<div class="m-value">' + amt('PERSONALCHARGES') + '</div>' +
                '</div>' +
                '</div>' +

                // Net Deductible — right highlighted anchor
                '<div class="m-item net-ded">' +
                '<div class="m-label">Net Deductible</div>' +
                '<div class="m-value">' + amt('DEDUCTIBLEAMOUNT') + '</div>' +
                '</div>' +

                '</div>' +
                '</div>';

            // ── Assemble full page ──
            var pageContent =
                '<!DOCTYPE html><html><head>' +
                '<meta charset="utf-8"/>' +
                '<title>Bill Statement \u2013 ' + f('EMPLOYEENAME') + '</title>' +
                //'<link rel="preconnect" href="https://fonts.googleapis.com">' +
                //'<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">' +
                '<style>' + getPreviewStyles() + '</style>' +
                '</head><body>' +

                '<div class="page">' +

                // ── Header band ──
                '<div class="page-header">' +
                '<div class="title-block"><h1>Mobile Bill Statement</h1><p>Official Telecom Expense Report</p></div>' +
                '<span class="status-badge ' + statusClass + '">' + f('STATUS') + '</span>' +
                '</div>' +

                // ── Employee strip ──
                '<div class="emp-strip">' +
                '<div class="emp-name">' + f('EMPLOYEENAME') + '</div>' +
                '<div class="emp-meta">' +
                '<div><span>Mobile Number</span><strong>' + f('MOBILENO') + '</strong></div>' +
                '<div><span>Provider</span><strong>' + f('PROVIDER') + '</strong></div>' +
                '<div><span>Bill Month</span><strong>' + billMonthStr + '</strong></div>' +
                '<div><span>Last Updated</span><strong>' + f('LASTUPDATEDON') + '</strong></div>' +
                '</div>' +
                '</div>' +

                // ── Body ──
                '<div class="page-body">' +
                metricsBar +
                commentsBlock +
                '<div class="section-heading">Transaction Details</div>' +
                txnHtml +
                '</div>' +

                // ── Footer ──
                '<div class="page-footer">' +
                '<span>Generated on <strong>' +
                new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
                '</strong></span>' +
                //'<button class="print-btn" onclick="window.print()">Print / Save PDF</button>' +
                //'<button class="print-btn"  onclick="window.focus();window.print();">Print / Save PDF</button>' +
                '</div>' +

                '</div>' + // .page
                '</body></html>';

            //var newWindow = window.open('', '', 'width=960,height=980,scrollbars=1,top=20,left=20');
            //var doc = newWindow.document.open();
            //doc.write(pageContent);
            //doc.close();
            var newWindow = window.open('', '', 'width=960,height=980,scrollbars=1,top=20,left=20');
            var doc = newWindow.document.open();
            doc.write(pageContent);
            doc.close();
            newWindow.focus();
            newWindow.onload = function () {
                newWindow.print();
            };
            // Fallback: some browsers fire onload before doc.close(), so defer as well
            setTimeout(function () {
                if (newWindow && !newWindow.closed) {
                    newWindow.focus();
                }
            }, 500);
        }
    });
}

function getPreviewStyles() {
    return "" +
        // ── Reset ──
        "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}" +

        // ── Variables ──
        // No external fonts — all system fonts available on every Windows intranet machine
        ":root{" +
        "--font-body:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;" +
        "--font-heading:Georgia,'Times New Roman',Times,serif;" +
        "--ink:#0f1923;--ink-light:#4a5568;--rule:#d1d9e0;" +
        "--accent:#1a3a5c;--accent-mid:#2d6a9f;--accent-pale:#e8f0f8;" +
        "--green:#0e6e4f;--green-pale:#e6f4f0;" +
        "--amber:#92500a;--amber-pale:#fdf3e3;" +
        "--white:#ffffff;--paper:#f7f9fc" +
        "}" +

        // ── Base ──
        "html,body{background:#cdd5de;font-family:var(--font-body);color:var(--ink);min-height:100vh;padding:32px 16px 48px}" +

        // ── Page wrapper ──
        ".page{max-width:820px;margin:0 auto;background:var(--white);border-radius:4px;box-shadow:0 4px 32px rgba(0,0,0,.18),0 1px 4px rgba(0,0,0,.10);overflow:hidden}" +

        // ── Header band ──
        ".page-header{background:var(--accent);padding:28px 36px 22px;display:flex;align-items:flex-end;justify-content:space-between;gap:16px}" +
        ".page-header .title-block h1{font-family:var(--font-heading);font-size:26px;color:var(--white);letter-spacing:.4px;line-height:1.1}" +
        ".page-header .title-block p{font-size:12px;color:rgba(255,255,255,.6);margin-top:4px;letter-spacing:.8px;text-transform:uppercase}" +

        // ── Status badge ──
        ".status-badge{font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:5px 14px;border-radius:20px;background:rgba(255,255,255,.15);color:var(--white);border:1px solid rgba(255,255,255,.3);white-space:nowrap}" +
        ".status-badge.closed{background:var(--green-pale);color:var(--green);border-color:#a8d5c7}" +
        ".status-badge.pending{background:var(--amber-pale);color:var(--amber);border-color:#f0cc96}" +

        // ── Employee strip ──
        ".emp-strip{background:var(--accent-pale);border-bottom:1px solid var(--rule);padding:14px 36px;display:flex;align-items:center;gap:32px;flex-wrap:wrap}" +
        ".emp-strip .emp-name{font-family:var(--font-heading);font-size:20px;color:var(--accent);flex:1;min-width:200px}" +
        ".emp-strip .emp-meta{display:flex;gap:28px;flex-wrap:wrap}" +
        ".emp-strip .emp-meta span{font-size:12px;color:var(--ink-light)}" +
        ".emp-strip .emp-meta strong{display:block;font-size:14px;color:var(--ink);font-weight:600;margin-top:1px}" +

        // ── Body ──
        ".page-body{padding:28px 36px 36px}" +

        // ── Metrics bar ──
        ".metrics-bar{display:flex;align-items:stretch;margin-bottom:24px;border:1px solid var(--rule);border-radius:7px;overflow:hidden}" +
        ".metric-total{background:var(--accent);padding:14px 20px;display:flex;flex-direction:column;justify-content:center;min-width:130px;flex-shrink:0}" +
        ".metric-total .m-label{font-size:9.5px;text-transform:uppercase;letter-spacing:.8px;color:rgba(255,255,255,.65);margin-bottom:4px;white-space:nowrap}" +
        ".metric-total .m-value{font-size:22px;font-weight:700;color:var(--white);line-height:1}" +
        ".metrics-divider{width:3px;background:var(--accent-mid);flex-shrink:0}" +
        ".metrics-items{display:flex;flex:1;background:var(--paper)}" +

        // ── Single metric item ──
        ".m-item{flex:1;display:flex;flex-direction:column;justify-content:center;padding:12px 14px;border-right:1px solid var(--rule)}" +
        ".m-item:last-child{border-right:none}" +
        ".m-item .m-label{font-size:9.5px;text-transform:uppercase;letter-spacing:.6px;color:var(--ink-light);margin-bottom:4px;white-space:nowrap}" +
        ".m-item .m-value{font-size:15px;font-weight:600;color:var(--ink);line-height:1.1}" +

        // ── Grouped metric box (Allowance / Business) ──
        ".m-group{flex:1;display:flex;flex-direction:column;border-right:1px solid var(--rule);min-width:0}" +
        ".m-group-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--white);background:var(--accent-mid);padding:3px 8px;text-align:center}" +
        ".m-group-cells{display:flex;flex:1}" +
        ".m-cell{flex:1;padding:7px 10px;border-right:1px solid var(--rule)}" +
        ".m-cell:last-child{border-right:none}" +
        ".m-cell .m-label{font-size:9px;text-transform:uppercase;letter-spacing:.5px;color:var(--ink-light);margin-bottom:3px;white-space:nowrap}" +
        ".m-cell .m-value{font-size:13.5px;font-weight:600;color:var(--ink)}" +

        // ── Stacked metric (Waiver + Personal Charges in one column) ──
        ".m-stack{flex:1;display:flex;flex-direction:column;border-right:1px solid var(--rule);min-width:0}" +
        ".m-stack-row{flex:1;display:flex;flex-direction:column;justify-content:center;padding:6px 12px}" +
        ".m-stack-row-bottom{border-top:1px solid var(--rule)}" +
        ".m-stack-row .m-label{font-size:9px;text-transform:uppercase;letter-spacing:.5px;color:var(--ink-light);margin-bottom:2px;white-space:nowrap}" +
        ".m-stack-row .m-value{font-size:13.5px;font-weight:600;color:var(--ink)}" +

        // ── Net Deductible (highlighted anchor) ──
        ".m-item.net-ded{background:var(--accent-pale);border-left:3px solid var(--accent-mid);min-width:120px;flex-shrink:0;border-right:none}" +
        ".m-item.net-ded .m-label{color:var(--accent-mid)}" +
        ".m-item.net-ded .m-value{font-size:17px;color:var(--accent);font-weight:700}" +

        // ── Section heading ──
        ".section-heading{font-size:11px;text-transform:uppercase;letter-spacing:1.2px;color:var(--ink-light);font-weight:600;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--rule)}" +

        // ── Transaction section ──
        ".txn-section{margin-bottom:24px}" +
        ".txn-group-header{font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--accent-mid);background:var(--accent-pale);padding:7px 12px;border-radius:4px 4px 0 0;border:1px solid #c5d9ee;border-bottom:none}" +

        // ── Transaction table ──
        "table.txn-table{width:100%;border-collapse:collapse;font-size:12.5px}" +
        "table.txn-table thead th{background:var(--ink);color:var(--white);padding:8px 10px;text-align:left;font-weight:600;font-size:11px;letter-spacing:.4px;text-transform:uppercase;white-space:nowrap}" +
        "table.txn-table thead th:last-child{text-align:right}" +
        "table.txn-table tbody tr:nth-child(even) td{background:var(--paper)}" +
        "table.txn-table tbody td{padding:8px 10px;border-bottom:1px solid var(--rule);color:var(--ink);vertical-align:middle}" +
        "table.txn-table tbody td:last-child{text-align:right;font-weight:500}" +

        // ── Call type badges ──
        ".call-type-badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:10.5px;font-weight:600;letter-spacing:.3px}" +
        ".call-type-badge.personal{background:#fff0e0;color:#a0440a}" +
        ".call-type-badge.business{background:#e0f0ff;color:#0a4a80}" +
        ".call-type-badge.allowance{background:var(--green-pale);color:var(--green)}" +

        // ── Subtotal / grand total rows ──
        "tr.subtotal td{border-top:2px solid var(--ink);padding:6px 10px;font-weight:700;font-size:12.5px}" +
        "tr.subtotal td:last-child{text-align:right}" +
        "tr.subtotal td:not(:last-child){border-top:none;border-bottom:1px solid var(--rule)}" +
        "tr.grandtotal td{background:var(--ink)!important;color:#3b79b7 !important;padding:9px 10px;font-weight:700;font-size:13.5px}" +
        "tr.grandtotal td:last-child{text-align:right}" +

        // ── Comments block ──
        ".comments-block{background:var(--amber-pale);border:1px solid #e8c882;border-radius:6px;padding:12px 16px;margin-bottom:24px;font-size:13px;color:var(--amber)}" +
        ".comments-block .cb-label{font-weight:700;margin-bottom:3px;font-size:11px;letter-spacing:.6px;text-transform:uppercase}" +

        // ── Footer ──
        ".page-footer{border-top:1px solid var(--rule);padding:14px 36px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--ink-light)}" +
        ".print-btn{background:var(--accent);color:var(--white);border:none;border-radius:5px;padding:8px 22px;font-family:var(--font-body);font-size:12px;font-weight:600;cursor:pointer;letter-spacing:.4px}" +
        ".print-btn:hover{background:var(--accent-mid)}" +
        ".print-btn:active{transform:scale(.97);opacity:.9}" +

        // ── Print media ──
        "@media print{" +
        "html,body{background:white;padding:0}" +
        ".page{box-shadow:none;border-radius:0;max-width:100%}" +
        ".print-btn{display:none}" +
        "table.txn-table tbody tr:nth-child(even) td{background:white}" +
        "}";
}


//End of updated getMyArcBill layout



function getDepartmentBill(departmentBillid) {

    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: "../../Ajax/getReportBillDepartment",
        data: { billId: departmentBillid },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            console.log('obj');
            console.log(result);
            var myVariable = '';
            var myVariable1 = '';
            var tAmt = 0;
            var GAmt = 0;
            myVariable1 = myVariable1 + ($("#archead").render(result.ArchiveBill));

            for (var i = 0; i < result.Trans.length; i++) {
                var currentGroup = result.Trans[i];
                tAmt = 0;
                myVariable = myVariable + ($("#thh").render(currentGroup));
                var newJsonItems = [];
                for (var j = 0; j < result.RptBill.length; j++) {

                    var currentItem = result.RptBill[j];

                    if (currentItem.TransType == currentGroup.StrTrans) {
                        tAmt = tAmt + currentItem.Amount;
                        myVariable = myVariable + ($("#trr").render(currentItem));
                        GAmt = GAmt + currentItem.Amount;
                    }
                }
                var Tot = { tot: tAmt.toFixed(3) };
                myVariable = myVariable + ($("#trrb").render(Tot));
            }
            console.log(myVariable);

            var GrAmt = { GTot: GAmt.toFixed(3) };
            myVariable = myVariable + ($("#trrg").render(GrAmt));
            $("#myBillTableArc").html(myVariable);


            var gridContent = myVariable1 + $("#finalHtmlArc").html();
            var newWindow = window.open('', '', 'width=900, height=950, scrollbars=1, top=1, left=1'),
                document = newWindow.document.open(),
                pageContent =
                    '<!DOCTYPE html>\n' +
                    '<html>\n' +
                    '<head>\n' +
                    '<meta charset="utf-8" />\n' +
                    '<title>My Bill</title>\n' +
                    '</head>\n' +
                    '<body>\n' + gridContent + '\n</body>\n</html>';
            document.write(pageContent);
            document.close();
            newWindow.print();


        }
    });

}

function printNew() {

    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: "../../Ajax/getReportBill",
        data: { billId: GBillId },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            var myVariable = '';
            var tAmt = 0;
            var GAmt = 0;
            for (var i = 0; i < result.Trans.length; i++) {
                var currentGroup = result.Trans[i];
                tAmt = 0;
                myVariable = myVariable + ($("#thh").render(currentGroup));
                var newJsonItems = [];
                for (var j = 0; j < result.RptBill.length; j++) {

                    var currentItem = result.RptBill[j];
                    GAmt = GAmt + currentItem.Amount;
                    if (currentItem.TransType == currentGroup.StrTrans) {
                        tAmt = tAmt + currentItem.Amount;
                        myVariable = myVariable + ($("#trr").render(currentItem));
                    }
                }
                var Tot = { tot: tAmt };
                myVariable = myVariable + ($("#trrb").render(Tot));
            }
            console.log(myVariable);

            var GrAmt = { GTot: GAmt };
            myVariable = myVariable + ($("#trrg").render(GrAmt));
            $("#myBillTable").html(myVariable);


            var gridContent = $("#finalHtml").html();
            var newWindow = window.open('', '', 'width=900, height=800'),
                document = newWindow.document.open(),
                pageContent =
                    '<!DOCTYPE html>\n' +
                    '<html>\n' +
                    '<head>\n' +
                    '<meta charset="utf-8" />\n' +
                    '<title>My Bill</title>\n' +
                    '</head>\n' +
                    '<body>\n' + gridContent + '\n</body>\n</html>';
            document.write(pageContent);
            document.close();
            newWindow.print();


        }
    });

}

function openWindow(billid) {
    //        $('#window').jqxWindow('open');
    getApprovalBill(billid);
}

function selectBill(id, chkBox) {
    var newItemData = [];
    for (i = 0; i < AppBills.length; i++) {
        var curItem = AppBills[i];
        if (curItem.Id == id) {
            curItem.IsSelected = chk.attr('checked', 'checked');
        }
        newItemData.push(curItem);


    }
    AppBills = newItemData;
}

function DoApprove(opt) {

    var myids = [];
    var getselectedrowindexes = $('#grdApprBills').jqxGrid('getselectedrowindexes');
    console.log(myAB);
    if (getselectedrowindexes.length > 0) {
        for (ii = 0; ii < getselectedrowindexes.length; ii++) {
            var selectedRowData = $('#grdApprBills').jqxGrid('getrowdata', getselectedrowindexes[ii]);
            for (y = 0; y < myAB.length; y++) {
                var myim = myAB[y];
                if (myim.BillId == selectedRowData.BillId) {
                    if ((myim.AComments == "" || myim.AComments.toString() == " ") && opt == 1) {
                        //alert('');

                        $.alert.open('error', 'Info Needed', 'Please Enter Comments for Rejection');

                        return;
                    }
                    myId = { ID: selectedRowData.BillId, Comm: myim.AComments };
                    myids.push(myId);
                    break;
                }

            }

        }
        var obji = { callLogs: myids, OPT: opt, UID: uid }
        $.ajax({
            type: "POST",
            cache: false,
            async: false,
            url: "../../Ajax/ApproveBills",
            contentType: 'application/json',
            data: JSON.stringify(obji),
            success: function (result) {
                // alert('Succ');
                setDataSourceApproval(result);
                AppBills = result;
                $("#grdApprBills").jqxGrid('clearselection');
            }
        });
        $.ajax({
            type: "POST",
            cache: false,
            async: false,
            url: "../../Ajax/SendEmail",
            data: JSON.stringify(obji),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                //alert('succ');
                $.alert.open('info', 'Success', 'Bill Processed Successfully');


            }
        });
    }
    else {
        alert("Please select atleast one bill");
        return;
    }
}

//getApprovalBill
function getApprovalBill(billid) {
    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: "../../Ajax/getBillDetailsAppr",
        data: { id: billid, type: 1 },
        success: function (result) {
            setDataSourceGridApproval(result.bill_details);
            $('#window').jqxWindow('open');
        }
    });
}

function setDataSourceArchived(mybill) {
    myBillDet = mybill.dtBills;
    var deptsource =
    {
        localdata: myBillDet,

        datafields:
            [{ name: 'BillId', type: 'number' },
            { name: 'BillDate', type: 'string' },
            { name: 'Status', type: 'string' },
            { name: 'TotalAmount', type: 'number' },
            { name: 'Currency', type: 'string' },
            { name: 'Provider', type: 'string' },
            { name: 'EmployeeName', type: 'string' },
            { name: 'Deductable', type: 'number' },
            { name: 'Mobile', type: 'string' },
            { name: 'LastUpdate', type: 'string' }
            ], datatype: "json"
    };
    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
    cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowData) {
        return '<input type="button" value="View" class="myButton clsBillHistoryViewBtn" data-billid="' + rowData.BillId + '"/>';
    };

    if ($('#grdArcBills').jqxGrid('instanceOf', 'jqxGrid')) {
        $('#grdArcBills').jqxGrid('destroy');
    }


    $("#grdArcBills").jqxGrid({
        width: '100%',
        source: dataAdapterCategory,
        columnsresize: true,
        rowsheight: jqx_rowsheight,
        columnsheight: 42,
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        autoheight: false,
        theme: jqx_theme,
        showsortcolumnbackground: true,
        columns: [
            { dataField: 'BillId', text: 'Id', hidden: 'true' },
            {
                dataField: 'BillDate', text: 'Bill Date', filterable: false, width: '7%',
                cellsrenderer: function (row, col, value) {
                    if (!value) return '';
                    var parts = value.split(' ')[0].split('/');   // handles "30/04/2026 00:00:00"
                    var d = new Date(parts[2], parts[1] - 1, parts[0]);
                    return '<div style="height:100%; display:flex; align-items:center; justify-content:center;">'
                        + d.toLocaleString('en-US', { month: 'short', year: 'numeric' }) +
                        '</div>';
                }
            },
            { dataField: 'EmployeeName', text: 'Employee Name', width: '20%', cellsalign: 'left', align: 'left' },
            { dataField: 'Provider', text: 'Provider', width: '7%', cellsalign: 'center', align: 'center' },
            { dataField: 'Mobile', text: 'Mobile', width: '8%', cellsalign: 'center', align: 'center' },
            { dataField: 'TotalAmount', text: 'Bill Amount (KD)', cellsformat: 'F3', width: '8%', cellsalign: 'center', align: 'center' },
            { dataField: 'Currency', text: 'Currency', cellsalign: 'center', width: '6%', hidden:'true' },
            { dataField: 'Deductable', text: 'Deduction', cellsformat: 'F3', cellsalign: 'right', width: '7%', cellsalign: 'center', align: 'center' },
            { dataField: 'LastUpdate', text: 'Last Update', width: '15%', cellsalign: 'center', align: 'center' },
            { dataField: 'Status', text: 'Status', width: '20%', cellsalign: 'center', align: 'center' },
            { text: 'View', cellsrenderer: cellsrenderer, cellsalign: 'center', width: '8%' }
        ]
    });

    //display count on Tab Name
    var datainformations = $('#grdArcBills').jqxGrid('getdatainformation');
    var rowscounts = datainformations.rowscount;
    $('#lblBillsHistoryCnt').text(rowscounts);
    $('#lblBillsHistory').html(rowscounts);

}

function setDataSourceDepartmentBill(DepartmentBill) {
    DepartmentBillDet = DepartmentBill.dtBills;
    var deptsource =
    {
        localdata: DepartmentBillDet,

        datafields:
            [{ name: 'BillId', type: 'number' },
            { name: 'BillDate', type: 'date' },
            { name: 'Status', type: 'string' },
            { name: 'TotalAmount', type: 'number' },
            { name: 'Currency', type: 'string' },
            { name: 'Provider', type: 'string' },
            { name: 'EmployeeName', type: 'string' },
            { name: 'Deductable', type: 'number' },
            { name: 'Mobile', type: 'string' },
            { name: 'LastUpdate', type: 'string' }
            ], datatype: "json"
    };
    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
    $("#grdDepartmentBills").jqxGrid({
        width: '100%',
        source: dataAdapterCategory,
        columnsresize: true,
        rowsheight: 40,
        columnsheight: 42,
        rowsheight: 30,
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        autoheight: true,
        theme: 'dark-blue',
        showsortcolumnbackground: true,
        columns: [
            { dataField: 'BillId', text: 'Id', hidden: 'true' },
            { dataField: 'BillDate', text: 'Bill Date', cellsformat: 'MMMM, yyyy', filterable: false, width: '15%' },
            { dataField: 'Status', text: 'Status', width: '8%' },
            { dataField: 'TotalAmount', text: 'Bill Amount', cellsformat: 'F3', width: '8%' },
            { dataField: 'Currency', text: 'Currency', cellsalign: 'center', width: '6%' },
            { dataField: 'Provider', text: 'Provider', width: '10%' },
            { dataField: 'EmployeeName', text: 'Employee Name', width: '15%' },
            { dataField: 'Deductable', text: 'Deduction', cellsformat: 'F3', cellsalign: 'right', width: '8%' },
            { dataField: 'Mobile', text: 'Mobile', width: '10%' },
            { dataField: 'LastUpdate', text: 'Last Update', width: '15%' },
            { text: 'View', cellsrenderer: cellsrenderer, cellsalign: 'center', width: '100px' }
        ]
    });

    //display count on Tab Name
    var datainformations = $('#grdDepartmentBills').jqxGrid('getdatainformation');
    var rowscounts = datainformations.rowscount;
    $('#lblBillsDepartmentCnt').text(rowscounts);
    $('#lblBillsDepartment').html(rowscounts);

}

function setDataSourceGridApproval(mybill) {
    myBillDet = mybill;
    var deptsource =
    {
        localdata: myBillDet,

        datafields:
            [{ name: 'Id', type: 'number' },
            { name: 'CallDate', type: 'date' },
            { name: 'CallTime', type: 'date' },
            { name: 'TransType', type: 'string' },
            { name: 'Description', type: 'string' },
            { name: 'Duration', type: 'string' },
            { name: 'Amount', type: 'number' },
            { name: 'CallType', type: 'string' },
            { name: 'Comment', type: 'string' }
            ], datatype: "json"
    };
    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);

    cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowData) {
        if (rowData.CallType == 1) { return 'Business' }
        else if (rowData.CallType == 2) { return 'Personal' }
        else if (rowData.CallType == 3) { return 'Allowance' }
    };

    $("#grdApprDet").jqxGrid({
        width: '100%',
        source: dataAdapterCategory,
        columnsresize: true,
        rowsheight: 40,
        columnsheight: 42,
        pageSize: 10,
        sortable: true,
        rowsheight: 30,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        theme: 'dark-blue',
        editable: true,
        showsortcolumnbackground: true,
        columns: [
            { dataField: 'Id', text: 'Telphone No.', width: '100px', hidden: 'true' },
            { dataField: 'CallDate', text: 'Call Date', cellsformat: 'dd-MMM, yyyy', width: '100px' },
            { dataField: 'CallTime', text: 'Call Time', cellsformat: 'hh:mm:ss', width: '80px' },
            { dataField: 'TransType', text: 'Trans Type', width: '250px' },
            { dataField: 'Description', text: 'Description', width: '300px' },
            { dataField: 'Duration', text: 'Duration', width: '100px' },
            { dataField: 'Amount', text: 'Amount', cellsformat: 'F3', cellsalign: 'center', width: '80px' },
            { dataField: 'CallType', text: 'Call Type', cellsrenderer: cellsrenderer, cellsalign: 'center', width: '100px' },
            {
                text: 'Comment',
                datafield: 'Comment',
                width: '20%',
                columntype: 'textbox'
            }
        ]
    });

}

function saveComment(commentId) {
    if (commentId != 0) {
        var newItemDataAB = [];
        for (var i = 0; i < myAB.length; i++) {

            var curItem = myAB[i];
            if (myAB[i].BillId === commentId) {
                try { curItem.AComments = $('#txtComm' + commentId).val(); } catch (e) { }
            }
            newItemDataAB.push(curItem);
        }
        myAB = newItemDataAB;
        deptsourceDetailAB.localdata = myAB;
        $("#grdBillDetails").jqxGrid('databind', deptsourceDetailAB, 'sort');
    }
    for (var ii = 0; ii < myAB.length; ii++) {
        try {
            $('#txtComm' + myAB[ii].BillId).val(myAB[ii].AComments);
        } catch (e) { }
    }

}

var myAB;
var deptsourceDetailAB;
function setDataSourceApproval(result) {
    myBills = result.dtBills;
    myAB = result.dtBills;
    deptsourceDetailAB =
    {
        localdata: myBills,
        datafields:
            [
                { name: 'BillId', type: 'number' },
                { name: 'BillDate', type: 'string' },
                { name: 'SubNo', type: 'string' },
                { name: 'Name', type: 'string' },
                { name: 'Provider', type: 'string' },
                { name: 'BillNumber', type: 'string' },
                { name: 'Org', type: 'string' },
                { name: 'Total', type: 'number' },
                { name: 'Currency', type: 'string' },
                { name: 'BusinessLimit', type: 'string' },
                { name: 'DeductableAmount', type: 'string' },
                { name: 'BusinessCharges', type: 'number' },
                { name: 'WaiverAmount', type: 'string' },
                { name: 'Comments', type: 'string' },
                { name: 'AComments', type: 'string' }
            ],
        datatype: "json"
    };
    var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowData) {
        return '<input type="button" class="myButton clsOpenWindowBtn" data-billid="' + rowData.BillId + '" value="View"/>';
    }

    var dataAdapterCategory = new $.jqx.dataAdapter(deptsourceDetailAB);
    var cellsrenderer1 = function (row, columnfield, value, defaulthtml, columnproperties, rowData) {
        console.log(rowData.AComments);
        // provide id for compatibility but avoid inline onblur; use data-billid for delegated handler
        return '<input type="text" id="txtComm' + rowData.BillId + '" value="' + (rowData.AComments || '') + '" class="clsAComment" data-billid="' + rowData.BillId + '"/>';
    };
    $("#grdApprBills").jqxGrid({
        width: '100%',
        source: dataAdapterCategory,
        columnsresize: true,
        rowsheight: jqx_rowsheight,
        columnsheight: 42,
        rowsheight: 30,
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        autoheight: false,
        theme: jqx_theme,
        selectionmode: 'checkbox',
        columns: [

            { dataField: 'BillId', text: 'Bill Id', hidden: 'true' },
            { text: 'View', cellsrenderer: cellsrenderer, cellsalign: 'center', filterable: false, width: '5%' },
            { dataField: 'BillDate', text: 'Bill Date', cellsformat: 'dd.MM.yyyy', filterable: false, width: '5%' },
            { dataField: 'Provider', text: 'Provider', width: '10%' },
            { dataField: 'SubNo', text: 'Number', width: '6%' },
            { dataField: 'Name', text: 'Employee Name', width: '10%' },
            { dataField: 'BillNumber', text: 'Bill Number', hidden: 'true' },
            { dataField: 'Org', text: 'Organization', hidden: 'true' },
            { dataField: 'Total', text: 'Bill Amount', cellsformat: 'f3', width: '6%' },
            { dataField: 'Currency', text: 'Currency', cellsalign: 'center', width: '6%' },
            { dataField: 'BusinessLimit', text: 'Business Limit', width: '10%' },
            { dataField: 'DeductableAmount', text: 'Deductable Amt', hidden: 'true', width: '10%' },
            { dataField: 'BusinessCharges', text: 'Business Charges', cellsformat: 'f3', width: '10%' },
            { dataField: 'WaiverAmount', text: 'Waiver Amount', width: '10%' },
            { dataField: 'Comments', text: 'Emp.Comments', width: '10%' },
            { dataField: 'AComments', text: 'Reject.Comments', cellsrenderer: cellsrenderer1, width: '10%' }

        ]
    });
    $('.modal').hide();
    $("#grdApprBills").on("pagechanged", function (event) { saveComment(0); });
    //$("#grdApprBills").on('rowselect', function (event) {

    //});
    //display count on Tab Name
    var datainformations = $('#grdApprBills').jqxGrid('getdatainformation');
    var rowscounts = datainformations.rowscount;
    $('#lblPendingApprovalCnt').text(rowscounts);
    if (rowscounts == 0) {
        $('#liPendingApproval').hide();
    }
    else {
        $('#liPendingApproval').show();
    }
    $('#lblPendingApproval').html(rowscounts);
}

function ProcessBill() {

    // Capture any comment that hasn't been blurred yet
    for (var i = 0; i < itemData.length; i++) {
        var $input = $('#txtComment' + itemData[i].Id);
        if ($input.length) {
            itemData[i].Comment = $input.val();
        }
    }
    myABB = itemData;



    // 🟩 STEP 1: Validate records
    const curData = itemData.filter(el => el.CallType == 0);
    if (curData.length > 0) {
        $.alert.open('error', 'Info Needed', 'Please Identify All Records');

        // Highlight only the unidentified rows without reinitializing the grid
        const rowCount = $('#grdBillDetails').jqxGrid('getdatainformation').rowscount;
        for (let i = 0; i < rowCount; i++) {
            const rowData = $('#grdBillDetails').jqxGrid('getrowdata', i);
            if (rowData && rowData.CallType == 0) {
                $('#grdBillDetails').jqxGrid('setrowstyle', i, 'background-color: #e83636 !important; color: #000 !important;');
            } else {
                $('#grdBillDetails').jqxGrid('setrowstyle', i, ''); // clear style for identified rows
            }
        }

        return;
    }

    // 🟩 STEP 2: Calculate waiver amount
    let wamt = 0.0;
    if ($("#chkW1").is(':checked')) wamt += parseFloat($('#btot').html());
    if ($("#chkW2").is(':checked')) wamt += parseFloat($('#atot').html());

    // 🟩 STEP 4: Manager name
    const managerName = $("#txtManagerName").text() || "Not Assigned";

    // 🟩 STEP 5: SweetAlert Confirmation UI
    Swal.fire({
        html: `
        <div id="swalConfirmSection" style="
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            gap: 10px;
            font-size: 15px;
            line-height: 1.5;
        ">
            <div><strong style="display: none">Line Manager:</strong> <span style="display: none;color:#2c3e50;">${managerName}</span></div>
            <div>Are you sure you want to Process the Bill?</div>

            <hr style="width:100%; margin:10px 0; border-color:#eee;">

            <div id="divWB" class="form-check mb-2">
                <input type="checkbox" id="chkW1Swal" class="form-check-input" />
                <label for="chkW1Swal" class="form-check-label">Request Waive for Business Charges</label>
            </div>

            <div id="divWA" class="form-check mb-3">
                <input type="checkbox" id="chkW2Swal" class="form-check-input" />
                <label for="chkW2Swal" class="form-check-label">Request Waive for Allowance Charges</label>
            </div>

            <textarea id="txtProcessCommentSwal" rows="3"
                      class="form-control mb-3"
                      style="display:none; width:100%;"
                      placeholder="Add comments (if any)..."></textarea>
        </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Yes, Process it",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        width: 480,
        didOpen: () => {
            // Trigger your waiver visibility logic dynamically
            showWaiveSwal();
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // 🟩 STEP 6: Collect latest waiver/comment data
            const isW1 = $("#chkW1Swal").is(':checked');
            const isW2 = $("#chkW2Swal").is(':checked');
            const comment = $("#txtProcessCommentSwal").val() || "";

            let wamt = 0.0;
            if (isW1) wamt += parseFloat($('#btot').html());
            if (isW2) wamt += parseFloat($('#atot').html());

            // 🟩 STEP 7: Prepare the data object AFTER confirmation
            const objNew = {
                BusinessCharges: $('#busCharge').html(),
                PersonalCharges: $('#perCharge').html(),
                PersonalLimitCharges: $('#alwCharge').html(),
                DeductibleAmount: $('#nettotal').html(),
                TOTALAMOUNT: 0,
                comments: comment,
                BID: GBillId,
                UID: uid,
                WaiverAmt: wamt
            };

            const obji = { callLogs: itemData, close: objNew };

            // 🟩 STEP 8: Show processing modal
            Swal.fire({
                title: 'Please Wait',
                html: 'Processing your request...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // 🟩 STEP 9: First AJAX - SaveCallLogs
            $.ajax({
                type: "POST",
                cache: false,
                url: "../../Ajax/SaveCallLogs",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    $('#billDetails').hide();
                    setDataSourceGridMaster(result);
                    $('#txtProcessComment').val('');
                    $("html, body").animate({ scrollTop: 0 }, "slow");

                    // 🟩 STEP 10: Then SendEmail
                    $.ajax({
                        type: "POST",
                        cache: false,
                        url: "../../Ajax/SendEmail",
                        data: JSON.stringify(obji),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function () {
                            Swal.close();
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Bill processed successfully!',
                                showConfirmButton: false,
                                timer: 1500,
                                timerProgressBar: true
                            }).then(() => {
                                IndexLoad();
                            });
                        },
                        error: function (xhr, status, error) {
                            Swal.close();
                            Swal.fire({
                                icon: 'error',
                                title: 'Email Error!',
                                text: 'Failed to send email: ' + error
                            });
                        }
                    });
                },
                error: function (xhr, status, error) {
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'An error occurred while saving call logs: ' + error
                    });
                }
            });
        }
    });
}

function showWaiveSwal() {
    $('#divWA').show();
    $('#divWB').show();
    $('#txtProcessCommentSwal').val('');

    if (Settings.IsAllowWaiver) {
        if (parseFloat($('#atot').html()) <= 0) {
            $('#divWA').hide();
        } else {
            $('#txtProcessCommentSwal').show();
        }
        if (parseFloat($('#btot').html()) <= 0) {
            $('#divWB').hide();
        } else {
            $('#txtProcessCommentSwal').show();
        }
    } else {
        $('#divWA').hide();
        $('#divWB').hide();
    }
}

function ChangeCallType() {
    if ($('#myCallType').val() == 0) {
        return;
    }

    $("#grdBillDetails").jqxGrid('showloadelement');
    var newItemData = [];
    bc = 0; pc = 0; ac = 0; uc = 0;
    for (i = 0; i < itemData.length; i++) {
        var curItem = itemData[i];

        if (curItem.CallType == 0 && $('#cmbChangeOpt').val() == 0 && curItem.Locked === false) {
            curItem.CallType = $('#myCallType').val();

            $("input[name='rd" + curItem.Id + "'][value=" + curItem.CallType + "]").attr('checked', 'checked');
        }
        else if ($('#cmbChangeOpt').val() == 1 && curItem.Locked === false) {
            curItem.CallType = $('#myCallType').val();
            $("input[name='rd" + curItem.Id + "'][value=" + curItem.CallType + "]").attr('checked', 'checked');
        }

        newItemData.push(curItem);
        var ct = parseInt(curItem.CallType + '');
        if (ct == 0) {
            uc = uc + curItem.Amount;
        }
        if (ct == 1) {
            bc = bc + curItem.Amount;
        }
        if (ct == 2) {
            pc = pc + curItem.Amount;
        }
        if (ct == 3) {
            ac = ac + curItem.Amount;
        }

    }
    $('#alwCharge').html(ac.toFixed(3));
    $('#busCharge').html(bc.toFixed(3));
    $('#perCharge').html(pc.toFixed(3));

    itemData = newItemData;

    setDataSourceGridDetails(itemData);
    var BL, BC, NB, PL, PC;
    var AL, AC, NA;
    BL = parseFloat($('#blimit').html());
    BC = parseFloat($('#busCharge').html());
    PL = parseFloat($('#plimit').html());
    PC = parseFloat($('#perCharge').html());
    // add logic here
    if (BC > BL && isbus == true) {
        if (Settings.IsZeroUnlimited && parseFloat($('#blimit').html()) == 0) {
            $('#btot').html('0.000');
        } else {
            $('#btot').html((BC - BL).toFixed(3));
        }
    }
    else {
        $('#btot').html("0.000");
    }
    if (PC > PL && isper == true) {
        if (Settings.IsZeroUnlimited2 && parseFloat($('#plimit').html()) == 0) {
            $('#ptot').html('0.000');
        } else {
            $('#ptot').html((PC - PL).toFixed(3));
        }
    }
    else {
        $('#ptot').html("0.000");
    }





    AL = parseFloat($('#alimit').html());
    AC = parseFloat($('#alwCharge').html());
    if (AC > AL) {
        $('#atot').html((AC - AL).toFixed(3));
    }
    else {
        $('#atot').html((0).toFixed(3));
    }
    $('#nettotal').html((parseFloat($('#ptot').html()) + parseFloat($('#btot').html()) + parseFloat($('#atot').html())).toFixed(3));
}

function showWaive() {
    $('#divWA').show();
    $('#divWB').show();
    $('#txtProcessComment').val('');
    if (Settings.IsAllowWaiver) {
        if (parseFloat($('#atot').html()) <= 0) {
            $('#divWA').hide();
        }
        else {
            $('#txtProcessComment').show();
        }
        if (parseFloat($('#btot').html()) <= 0) {
            $('#divWB').hide();
        }
        else {
            $('#txtProcessComment').show();
        }
    }
    else {
        $('#divWA').hide();
        $('#divWB').hide();
    }

}

function SelectMyBill(id) {
    getUBillDetails(id + '');
    GBillId = id;
    $('#txtManagerName').text(datarow.ManagerName);
    var rows = $('#grdBillMaster').jqxGrid('getrows');
    var rowsCount = rows.length;
    for (var i = 0; i < rowsCount; i++) {
        var value = $('#grdBillMaster').jqxGrid('getcellvalue', i, "Id");
        if (parseInt(value) == id) {
            {
                var datarow = $("#grdBillMaster").jqxGrid('getrowdata', i);
            }
            $('#txtManagerName').text(datarow.ManagerName);
            break;
        };
    };

}

function setDataSourceGridMaster(result) {
    myBills = result.dtBills;
    var deptsource =
    {
        localdata: myBills,
        datafields:
            [
                { name: 'Id', type: 'number' },
                { name: 'BillDate', type: 'date' },
                { name: 'Uid', type: 'number' },
                { name: 'EmpName', type: 'string' },
                { name: 'BillNumber', type: 'string' },
                { name: 'Mobile', type: 'string' },
                { name: 'TotalAmount', type: 'number' },
                { name: 'Currency', type: 'string' },
                { name: 'LastUpdatedOn', type: 'date' },
                { name: 'ProviderName', type: 'string' },
                { name: 'Comments', type: 'string' },
                { name: 'SubsId', type: 'string' },
                { name: 'ManagerName', type: 'string' },
            ],
        datatype: "json"
    };


    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
    var rbt = function (row, columnfield, value, defaulthtml, columnproperties, rowData) {
        // render a radio that uses delegated handler instead of inline onclick
        return '<input type="radio" class="clsSelectMyBill" data-billid="' + rowData.Id + '" style="margin:5px"/>';
    }
    $("#grdBillMaster").jqxGrid({
        width: '100%',
        source: dataAdapterCategory,
        columnsresize: true,
        rowsheight: jqx_rowsheight,
        columnsheight: 42,
        height: '300px',
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        autoheight: false,
        theme: jqx_theme,
        showsortcolumnbackground: true,
        selectionmode: 'singlerow',
        columns: [
            //{ text: '', cellsrenderer: rbt },
            { dataField: 'Id', text: 'Id', hidden: 'true' },
            { dataField: 'ProviderName', text: 'Provider', width: '5%', cellsalign: 'center', align: 'center' },
            { dataField: 'BillDate', text: 'Bill Date', cellsformat: 'MMMM, yyyy', width: '8%', cellsalign: 'center', filterable: false, align: 'center' },
            { dataField: 'Uid', text: 'User Id', hidden: 'true' },
            { dataField: 'EmpName', text: 'Employee Name', width: '20%', cellsalign: 'center', align: 'center' },
            { dataField: 'BillNumber', text: 'Bill Number', hidden: 'true' },
            { dataField: 'Mobile', text: 'Mobile', width: '8%', cellsalign: 'center', align: 'center' },
            { dataField: 'TotalAmount', text: 'Amount', cellsformat: 'f3', width: '7%', cellsalign: 'center', align: 'center' },
            { dataField: 'Currency', text: 'Currency', width: '6%', cellsalign: 'center', align: 'center' },
            { dataField: 'LastUpdatedOn', text: 'Last Updated', cellsformat: 'dd-MMM-yy', width: '15%', cellsalign: 'center', align: 'center' },
            { dataField: 'Comments', text: 'Comments', align: 'center' },
            { dataField: 'SubsId', text: 'SubsId', hidden: 'true' },
            { dataField: 'ManagerName', text: 'Manager', hidden: 'true' },
        ]
    });

    //display count on Tab Name
    var datainformations = $('#grdBillMaster').jqxGrid('getdatainformation');
    var rowscounts = datainformations.rowscount;
    $('#lblPendingIdentificationCnt').text(rowscounts);
    $('#lblPendingIdentificationCount').html(rowscounts);


}
$("#grdBillMaster").on('rowselect', function (event) {
    var idx;
    debugger;
    idx = event.args.rowindex;
    var datarow = $("#grdBillMaster").jqxGrid('getrowdata', idx);
    GBillId = datarow.Id;
    $('#hdnBillID').val(datarow.Id);
    getUBillDetails(datarow.Id + '');
    $('#txtManagerName').text(datarow.ManagerName);
});

function saveComments(commentId) {
    if (commentId != 0) {
        var normalizedId = parseInt(commentId, 10);
        var newComment = $('#txtComment' + commentId).val();
        if (newComment === undefined) {
            newComment = $('#txtComment' + normalizedId).val();
        }
        for (var i = 0; i < itemData.length; i++) {
            if (parseInt(itemData[i].Id, 10) === normalizedId) {
                itemData[i].Comment = newComment;
                break;
            }
        }
        if (Array.isArray(myBillDet)) {
            for (var j = 0; j < myBillDet.length; j++) {
                if (parseInt(myBillDet[j].Id, 10) === normalizedId) {
                    myBillDet[j].Comment = newComment;
                    break;
                }
            }
        }
        if ($("#grdBillDetails").length) {
            var rowIndex = $("#grdBillDetails").jqxGrid('getrowboundindexbyid', normalizedId);
            if (rowIndex === undefined || rowIndex < 0) {
                rowIndex = $("#grdBillDetails").jqxGrid('getrowindexbyid', normalizedId);
            }
            if (rowIndex !== undefined && rowIndex >= 0) {
                $("#grdBillDetails").jqxGrid('setcellvalue', rowIndex, 'Comment', newComment);
            }
        }
        myABB = itemData;
    }
}

var myABB;
function setDataSourceGridDetails(bill_details) {
    var customsortfunc = function (column, direction) {
        sortdata = new Array();
        if (direction == 'ascending') direction = true;
        if (direction == 'descending') direction = false;
        if (direction != null) {
            for (i = 0; i < itemData.length; i++) {
                sortdata.push(itemData[i]);
            }
        }
        else sortdata = itemData;
        var tmpToString = Object.prototype.toString;
        Object.prototype.toString = (typeof column == "function") ? column : function () { return this[column] };
        if (direction != null) {
            sortdata.sort(compare);
            if (!direction) {
                sortdata.reverse();
            }
        }
        deptsource.localdata = sortdata;
        itemData = sortdata;
        $("#grdBillDetails").jqxGrid('databind', deptsource, 'sort');
        Object.prototype.toString = tmpToString;
    }
    // custom comparer.
    var compare = function (value1, value2) {
        value1 = String(value1).toLowerCase();
        value2 = String(value2).toLowerCase();
        try {
            var tmpvalue1 = parseFloat(value1);
            if (isNaN(tmpvalue1)) {
                if (value1 < value2) { return -1; }
                if (value1 < value2) { return 1; }
            }
            else {
                var tmpvalue2 = parseFloat(value2);
                if (tmpvalue1 < tmpvalue2) { return -1; }
                if (tmpvalue1 < tmpvalue2) { return 1; }
            }
        }
        catch (error) {
            var er = error;
        }
        return 0;
    };

    myBillDet = bill_details;
    myABB = bill_details;
    deptsourceDetail =
    {
        localdata: myBillDet,
        id: 'Id',

        datafields:
            [{ name: 'Id', type: 'number' },
            { name: 'CallDate', type: 'date' },
            { name: 'CallTime', type: 'date' },
            { name: 'TransType', type: 'string' },
            { name: 'Description', type: 'string' },
            { name: 'Name', type: 'string' },
            { name: 'Duration', type: 'string' },
            { name: 'Amount', type: 'number' },
            { name: 'Comment', type: 'string' },
            { name: 'CallType', type: 'string' },
            { name: 'Locked', type: 'bool' },
            { name: 'Auid', type: 'number' },
            { name: 'DialledNo', type: 'string' },
            ], datatype: "json"

    };
    var dataAdapterCategory = new $.jqx.dataAdapter(deptsourceDetail);

    var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowData, row) {
        var s0 = '', s1 = '', s2 = '', s3 = '', s4 = '', s5 = '';

        if (rowData.CallType == 0) {
            s0 = 'checked';
        }
        else if (rowData.CallType == 1) {
            s1 = 'checked';
        }
        else if (rowData.CallType == 2) {
            s2 = 'checked';
        }
        else if (rowData.CallType == 3) {
            s3 = 'checked';
        }
        else if (rowData.CallType == 5) {
            s5 = 'checked';
        }

        var myString = "";
        if (rowData.Locked) {
            // Render radios without inline onclick; use data attributes and delegated handler
            if (rowData.CallType == 1) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="1" data-handle="calltype" data-id="' + rowData.Id + '" disabled ' + s1 + '> Business';
            }
            if (rowData.CallType == 2) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="2" data-handle="calltype" data-id="' + rowData.Id + '" disabled ' + s2 + '> Personal';
            }
            if (rowData.CallType == 3) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="3" data-handle="calltype" data-id="' + rowData.Id + '" disabled ' + s3 + '> Allowance';
            }
            if (rowData.CallType == 5) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="5" data-handle="calltype" data-id="' + rowData.Id + '" disabled ' + s5 + '> Ext.Allowance';
            }
        }
        else {
            myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="1" data-handle="calltype" data-id="' + rowData.Id + '"  ' + s1 + '> Business';
            myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="2" data-handle="calltype" data-id="' + rowData.Id + '"  ' + s2 + '> Personal';
            if (rowData.CallType == 3) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="3" data-handle="calltype" data-id="' + rowData.Id + '"  ' + s3 + '> Allowance';
            }
            if (rowData.CallType == 5) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="5" data-handle="calltype" data-id="' + rowData.Id + '" > Ext.Allowance';
            }
            if (Settings.EnableDiscrepancy) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="4" data-handle="calltype" data-id="' + rowData.Id + '"  ' + s4 + '> Faulty';
            }
        }
        return "<div style='padding: 10px;'>" + myString + "</div>";
    }
    var cellstext = function (row, columnfield, value, defaulthtml, columnproperties, rowData) {
        var latestComment = rowData.Comment || '';
        if (Array.isArray(itemData)) {
            for (var i = 0; i < itemData.length; i++) {
                if (parseInt(itemData[i].Id, 10) === parseInt(rowData.Id, 10)) {
                    latestComment = itemData[i].Comment || '';
                    break;
                }
            }
        }
        return '<input type="text" id="txtComment' + rowData.Id + '" class="comment-input" data-id="' + rowData.Id + '" style="width: 92% !important;margin: 5px;height: 30px;" value="' + latestComment + '" onblur="saveComments(' + rowData.Id + ')" />';
    }


    var imagerenderer = function (row, datafield, value) {
        return 'Save Contact';
    }

    var cellsrenderer1 = function (row, column, value, defaultHtml, columnSettings, rowData) {

        var DialledNo = rowData.DialledNo;
        if (DialledNo != "") {

            return "Save Contact";

        }

        else {
            return " ";
        }
    }

    var ContactName = function (row, column, value, defaultHtml, columnSettings, rowData) {
        debugger;
        var DialledNo = rowData.DialledNo;
        if (DialledNo != "") {
            str = '<div style="width:100%;padding:5px;">';
            strTxtBox = '<div style="float:left;width: 66%;">';
            strTxtBox += '<input id="txtContactName2_' + DialledNo + '" class="txtBillDetailsContactName" disabled="true" readonly = "readonly" type="text" value = "' + rowData.Name + '">';
            strTxtBox += '</div>';

            strImgBtn = '<div style="float:left;width:19%;margin-left: 9px;margin-top: -6px;">';
            strImgBtn += '<input id="btnContact_' + DialledNo + '" type="button" class="imgBillDetailsContactName" />';
            strImgBtn += '</div>';

            str += strTxtBox + strImgBtn;
            str += "</div>"
            return str
        }
        else {
            return " ";
        }
    }

    $("#grdBillDetails").jqxGrid({
        width: '100%',
        source: dataAdapterCategory,
        columnsresize: true,
        rowsheight: jqx_rowsheight,
        columnsheight: 42,
        pageSize: 10,
        sortable: true,
        pageable: false,
        autoheight: false,
        theme: jqx_theme,
        showsortcolumnbackground: true,
        selectionmode: 'singlerow',
        columns: [

            { dataField: 'Id', text: 'Id', hidden: 'true' },
            { dataField: 'CallDate', text: 'Call Date', cellsformat: 'dd-MMM-yyyy', width: '8%' },
            { dataField: 'CallTime', text: 'Call Time', cellsformat: "h:mm tt", width: '8%' },
            { dataField: 'TransType', text: 'Trans Type', width: '12%' },
            { dataField: 'Description', text: 'Description', width: '20%' },
            { dataField: 'Name', text: 'Contact Name', cellsrenderer: ContactName, width: '10%' },
            { dataField: 'Duration', text: 'Duration', width: '5%' },
            { dataField: 'Amount', text: 'Amount', cellsformat: 'F3', cellsalign: 'center', width: '5%' },
            { dataField: 'CallType', text: 'Identify Calls', cellsrenderer: cellsrenderer, width: '17%' },
            { dataField: 'Comment', text: 'Comment', cellsrenderer: cellstext },
            { dataField: 'Auid', text: 'Uid', hidden: 'true' },
            { dataField: 'DialledNo', text: 'Dialled Number', hidden: 'true' },
            {
                text: 'Save Contact', hidden: 'true', width: 100, columntype: 'button', align: 'center', editable: false, cellsrenderer: cellsrenderer1, buttonclick: function (row) {
                    var getselectedrowindexes = $('#grdBillDetails').jqxGrid('getselectedrowindexes');
                    var row = $("#grdBillDetails").jqxGrid('getrowdata', getselectedrowindexes[0]);
                    ExName = row.Name;
                    if (row.DialledNo != "") {
                        $("#WindowContact").jqxWindow('open');
                        $("#txtContactName").val(row.Name);
                    }
                }
            }
        ]
    });

    $("#grdBillDetails").on('scroll', function () {
        persistComments();
    });

}

var onetwo = 0;
function getUBillDetails(billid) {
    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: "../../Ajax/getBillDetails",
        data: { id: billid, type: 0 },

        success: function (result) {

            setDataSourceGridDetails(result.bill_details);
            Settings = result.setting;
            $('#chkW1').attr('checked', false);
            $('#chkW2').attr('checked', false);

            itemData = result.bill_details;
            if (itemData.length > 0) {
                $('#billDetails').show();
            }
            var curPart = [];
            myPart = 1;
            itemData = result.bill_details;
            if (itemData.length > 0) {
                $('#billDetails').show();

            }
            bc = 0.0; pc = 0.0; ac = 0.0; uc = 0.0;
            for (var i = 0; i < itemData.length; i++) {
                var item = itemData[i];
                $("input[name='rd" + item.Id + "'][value=" + item.CallType + "]").attr('checked', 'checked');
                var ct = parseInt(item.CallType + '');
                if (ct == 0) {
                    uc = uc + item.Amount;
                }
                if (ct == 1) {
                    bc = bc + item.Amount;
                }
                if (ct == 2) {
                    pc = pc + item.Amount;
                }
                if (ct == 3) {
                    ac = ac + item.Amount;
                }
            }

            $('#alwCharge').html(ac.toFixed(3));
            $('#busCharge').html(bc.toFixed(3));
            $('#perCharge').html(pc.toFixed(3));

            blim = result.blim;
            plim = result.plim;
            alim = result.mlim;
            isbus = Settings.DedBussinessCharges;
            isper = Settings.DedPersonalCharges;
            HidePer = Settings.HidePersonalLimit;
            isallow = Settings.HideAllowanceLimit;
            ispersonal = Settings.HidePersonalLimit;

            if (isallow == true) {
                $("#a1TD").hide();
                $("#a2TD").hide();
                $("#a3TD").hide();

                $("#alimit").hide();
                $("#atot").hide();
                $("#alwCharge").hide();
            }
            else { }
            ispersonal = Settings.HidePersonalLimit;

            if (ispersonal == true) {
                $("#p1TD").hide();
                $("#p2TD").hide();
                $("#plimit").hide();
                $("#perCharge").hide();
                $("#a").show();
                $("#b").show();
                $("#c").show();
                $("#d").show();
            }
            else {

                $("#a").hide();
                $("#b").hide();
                $("#c").hide();
                $("#d").hide();

            }

            $('#blimit').html(parseFloat(blim).toFixed(3));
            $('#plimit').html(parseFloat(plim).toFixed(3));
            $('#alimit').html(parseFloat(alim).toFixed(3));
            var BL, BC, NB, PL, PC;
            var AL = 0.0, AC = 0.0, NA = 0.0;
            BL = parseFloat($('#blimit').html());
            BC = parseFloat($('#busCharge').html());

            PL = parseFloat($('#plimit').html());
            PC = parseFloat($('#perCharge').html());

            if (BC > BL && isbus == true) {
                if (Settings.IsZeroUnlimited && parseFloat($('#blimit').html()) == 0) {
                    $('#btot').html('0.000');
                } else {
                    $('#btot').html((BC - BL).toFixed(3));
                }
            }
            else {
                $('#btot').html("0.000");
            }

            // Personal Limit and Personal Charge

            if (PC > PL && isper == true) {
                if (Settings.IsZeroUnlimited2 && parseFloat($('#plimit').html()) == 0) {
                    $('#ptot').html('0.000');
                } else {
                    $('#ptot').html((PC - PL).toFixed(3));
                }
            }
            else {
                $('#ptot').html("0.000");
            }
            if (HidePer == true) {
                $('#plimit').html("0.000");
                $('#ptot').html((PC).toFixed(3));
            }
            AL = parseFloat($('#alimit').html());
            AC = parseFloat($('#alwCharge').html());

            if (AC > AL) {
                $('#atot').html((AC - AL).toFixed(3));
            }
            else {
                $('#atot').html("0.000");
            }
            $('#nettotal').html((parseFloat($('#ptot').html()) + parseFloat($('#btot').html()) + parseFloat($('#atot').html())).toFixed(3));
        }
    });
}

function LiveTag(myRadio, id) {
    var LTItem = itemData.filter(function (el) { return el.Id == id; });
    var newItemData = [];
    bc = 0; pc = 0; ac = 0; uc = 0;
    for (i = 0; i < itemData.length; i++) {
        var curItem = itemData[i];

        if (curItem.TransType == LTItem[0].TransType && curItem.Description == LTItem[0].Description && curItem.Locked === false) {
            curItem.CallType = myRadio.value;
            $("input[name='rd" + curItem.Id + "'][value=" + curItem.CallType + "]").attr('checked', 'checked');
        }


        newItemData.push(curItem);
        var ct = parseInt(curItem.CallType + '');
        if (ct == 0) {
            uc = uc + curItem.Amount;
        }
        if (ct == 1) {
            bc = bc + curItem.Amount;
        }
        if (ct == 2) {
            pc = pc + curItem.Amount;
        }
        if (ct == 3) {
            ac = ac + curItem.Amount;
        }

    }
    $('#alwCharge').html(ac.toFixed(3));
    $('#busCharge').html(bc.toFixed(3));
    $('#perCharge').html(pc.toFixed(3));

    itemData = newItemData;

    deptsourceDetail.localdata = itemData;
    $("#grdBillDetails").jqxGrid('databind', deptsourceDetail, 'sort');

    var BL, BC, NB, PL, PC;
    var AL, AC, NA;
    BL = parseFloat($('#blimit').html());
    BC = parseFloat($('#busCharge').html());
    PL = parseFloat($('#plimit').html());
    PC = parseFloat($('#perCharge').html());

    if (BC > BL && isbus == true) {
        if (Settings.IsZeroUnlimited && parseFloat($('#blimit').html()) == 0) {
            $('#btot').html('0.000');
        }
        else {
            $('#btot').html((BC - BL).toFixed(3));
        }
    }
    else {
        $('#btot').html("0.000");
    }

    if (PC > PL && isper == true) {
        if (Settings.IsZeroUnlimited2 && parseFloat($('#plimit').html()) == 0) {
            $('#ptot').html('0.000');
        }
        else {
            $('#ptot').html((PC - PL).toFixed(3));
        }
    }
    else {
        $('#ptot').html("0.000");
    }

    AL = parseFloat($('#alimit').html());
    AC = parseFloat($('#alwCharge').html());
    if (AC > AL) {
        $('#atot').html((AC - AL).toFixed(3));
    }
    else {
        $('#atot').html("0.000");
    }
    $('#nettotal').html((parseFloat($('#ptot').html()) + parseFloat($('#btot').html()) + parseFloat($('#atot').html())).toFixed(3));
}
function persistComments() {
    $('.comment-input, [id^="txtComment"]').each(function () {
        var id = $(this).data('id');
        if (!id) {
            var idAttr = $(this).attr('id') || '';
            id = idAttr.replace(/^txtComment/, '');
        }
        id = parseInt(id, 10);
        var value = $(this).val();

        for (var i = 0; i < itemData.length; i++) {
            if (parseInt(itemData[i].Id, 10) === id) {
                itemData[i].Comment = value;
                break;
            }
        }
        if (Array.isArray(myBillDet)) {
            for (var j = 0; j < myBillDet.length; j++) {
                if (parseInt(myBillDet[j].Id, 10) === id) {
                    myBillDet[j].Comment = value;
                    break;
                }
            }
        }
        if ($("#grdBillDetails").length) {
            var rowIndex = $("#grdBillDetails").jqxGrid('getrowboundindexbyid', id);
            if (rowIndex === undefined || rowIndex < 0) {
                rowIndex = $("#grdBillDetails").jqxGrid('getrowindexbyid', id);
            }
            if (rowIndex !== undefined && rowIndex >= 0) {
                $("#grdBillDetails").jqxGrid('setcellvalue', rowIndex, 'Comment', value);
            }
        }
    });
}
function handleClick(myRadio, id) {
    persistComments();
    var rdv;
    var oldVal;
    var newItemData = [];
    // ✅ STEP 1: Save all comments BEFORE grid refresh
    for (var i = 0; i < itemData.length; i++) {
        var $input = $('#txtComment' + itemData[i].Id);
        if ($input.length) {
            itemData[i].Comment = $input.val();
        }
    }
    if ($("#chkLiveTag").is(':checked')) {
        LiveTag(myRadio, id);
        return;
    }
    var rdv;
    var oldVal;
    var newItemData = [];
    for (var i = 0; i < itemData.length; i++) {
        var curItem = itemData[i];
        if (itemData[i].Id === id) {
            oldVal = itemData[i].CallType;
            rdv = itemData[i];
            itemData[i].CallType = myRadio.value;
        }
        newItemData.push(curItem);
    }
    itemData = newItemData;
    //    alert("HI");
    deptsourceDetail.localdata = itemData;
    $("#grdBillDetails").jqxGrid('databind', deptsourceDetail, 'sort');

    for (var i = 0; i < itemData.length; i++) {
        var curItem = itemData[i];
    }

    var item = rdv;
    ct = myRadio.value;
    //    ct1=rdv.CallType;
    ct1 = oldVal;

    if (ct == 0) {
        uc = uc + item.Amount;
    }
    if (ct == 1) {
        bc = bc + item.Amount;
    }
    if (ct == 2) {
        pc = pc + item.Amount;
    }
    if (ct == 3) {
        console.log('+' + i);
        ac = ac + item.Amount;
    }

    if (ct1 == 0) {
        uc = uc - item.Amount;
    }
    if (ct1 == 1) {
        bc = bc - item.Amount;
    }
    if (ct1 == 2) {
        pc = pc - item.Amount;
    }
    if (ct1 == 3) {
        ac = ac - item.Amount;
    }
    $('#alwCharge').html(ac.toFixed(3));
    $('#busCharge').html(bc.toFixed(3));
    $('#perCharge').html(pc.toFixed(3));
    var BL, BC, NB, PL, PC;
    var AL, AC, NA;
    BL = parseFloat($('#blimit').html());
    BC = parseFloat($('#busCharge').html());
    PL = parseFloat($('#plimit').html());
    PC = parseFloat($('#perCharge').html());
    if (BC > BL && isbus == true) {
        if (Settings.IsZeroUnlimited && parseFloat($('#blimit').html()) == 0) {
            $('#btot').html('0.000');
        }
        else {
            $('#btot').html((BC - BL).toFixed(3));
        }
    }
    else {
        $('#btot').html("0.000");
    }



    if (PC > PL && isper == true) {
        if (Settings.IsZeroUnlimited2 && parseFloat($('#plimit').html()) == 0) {
            $('#ptot').html('0.000');
        }
        else {
            $('#ptot').html((PC - PL).toFixed(3));
        }
    }
    else {
        $('#ptot').html("0.000");
    }


    //Hide Personal Charge

    if (HidePer == true) {

        $('#plimit').html("0.000");
        $('#ptot').html((PC).toFixed(3));
    }


    AL = parseFloat($('#alimit').html());
    AC = parseFloat($('#alwCharge').html());
    if (AC > AL) {
        $('#atot').html((AC - AL).toFixed(3));
    }
    else {
        $('#atot').html("0.000");
    }
    $('#nettotal').html((parseFloat($('#ptot').html()) + parseFloat($('#btot').html()) + parseFloat($('#atot').html())).toFixed(3));

}

function getEmpList() {
    //if (!employees) {
    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: "../../Ajax/getEmployees",

        success: function (result) {
            employees = result.EmpList;



            //}
            var sourceEmp =
            {
                dataType: "json",
                dataFields: [
                    { name: 'EmpId', type: 'string' },
                    { name: 'EmpName', type: 'string' },
                    { name: 'EmpNo', type: 'string' }
                ],
                id: 'EmpId',
                localdata: employees
            };
            var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
            $("#grdManager").jqxGrid({
                width: '100%',
                source: dataAdapterEmp,
                columnsresize: true,
                rowsheight: 40,
                columnsheight: 42,
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
        }
    });
    $("#grdManager").on('rowselect', function (event) {
        var args = event.args;
        var row = $("#grdManager").jqxGrid('getrowdata', args.rowindex);
        var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['EmpName'] + ' - ' + row['EmpNo'] + '</div>';
        $('#hidManager').val(row['EmpId']);
        $("#btnmanager").jqxDropDownButton('setContent', dropDownct);
        $('#btnmanager').jqxDropDownButton('close');

    });

}

function delegateBill() {

    var date1 = $("#StartInput").jqxDateTimeInput('getDate');
    var date2 = $("#EndInput").jqxDateTimeInput('getDate');

    if ((new Date(date1).getTime() <= new Date(date2).getTime())) { } else {
        // alert('start date cant be more then end date');
        return;
    }


    var formattedDate1 = $.jqx.dataFormat.formatdate(date1, 'yyyy-MM-dd');
    var formattedDate2 = $.jqx.dataFormat.formatdate(date2, 'yyyy-MM-dd');



    var DelG = {
        "secid": $('#hidManager').val(),
        "managerid": uid,
        "app": $("#chkApp").is(':checked'),
        "idt": $("#chkIdt").is(':checked'),
        "sdate": formattedDate1,
        "edate": formattedDate2
    };
    var obj = JSON.stringify(DelG);
    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: "../../Ajax/SaveDelegate",
        contentType: 'application/json',
        data: DelG,
        success: function (result) {
            //alert(result.Message);
            $.alert.open('info', 'Success', 'Delegation Saved Successfully');
            GetDelegate();
        }
    });

}

function IndexLoad() {
    //showLoader();
    $('#jqxTabs').on('tabclick', function (event) {
        //showLoader();
        //if (flgTabClickLock == 0) {
        var clickedItem = event.args.item;
        if (clickedItem == 0) {
            bindIdentificationBills();
            //$('#jqxTabs').jqxTabs('select', 0);
        }
        else if (clickedItem == 1) {
            bindApprovalBills();
            //$('#jqxTabs').jqxTabs('select', 1);
        }
        else if (clickedItem == 2) {
            bindArchivedBills();
            //$('#jqxTabs').jqxTabs('select', 2);
        }
        else if (clickedItem == 3) {
            bindDepartmentBills();
            //$('#jqxTabs').jqxTabs('select', 2);
        }

    });
    $("#dropDownButton").hide();
    var dropDownContent = '<div style="position: relative; margin: 3px;">Delegate Bills to</div>';
    var dropDownContent1 = '<div style="position: relative; margin: 3px; ">Select Employee</div>';
    var dropDownContentProcess = '<div style="position: relative; margin: 3px; ">Process Bill</div>';
    $("#dropDownButton").jqxDropDownButton({ width: 150, height: 25 });
    $("#dropDownButton").jqxDropDownButton('setContent', dropDownContent);
    $body = $("body");
    $("#btnmanager").jqxDropDownButton({ width: 150, height: 25 });
    $("#btnmanager").jqxDropDownButton('setContent', dropDownContent1);



    $('#btnProcess').off('click').on('click', function () {
        showWaive();
    });

    $("#StartInput").jqxDateTimeInput({ width: '300px', height: '25px' });
    $("#EndInput").jqxDateTimeInput({ width: '300px', height: '25px' });

    $('#btnmanager').on('open', function () { getEmpList(); });


    $('#jqxTabs').jqxTabs({ width: '100%', position: 'top' });
    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: "../../Ajax/getBills",
        data: { uid: uid },
        success: function (result) {
            setDataSourceGridMaster(result);
            employees = result.EmpList;
        }
    });
    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 50) {

        }
        if ($(window).scrollTop() > 550) {
            $("#something").css({ "top": ($(window).scrollTop()) - 550 + "px" });
        }
        else {
            $("#something").css({ "top": "0px" });
        }
    });
    bindApprovalBills();
    bindArchivedBills();
    if ($('#DepartmentBills').length > 0) {
        bindDepartmentBills();
    }
    //hideLoader();
}

function bindIdentificationBills() {
    $.ajax({
        type: "GET",
        async: false,
        cache: false,
        url: "../../Ajax/getBills",
        data: { uid: uid },
        success: function (result) {
            hideLoader();
            setDataSourceGridMaster(result);
            employees = result.EmpList;
            //showMyBills();
        }
    });
}

function bindApprovalBills() {
    debugger;
    $.ajax({
        type: "GET",
        async: false,
        url: "../../Ajax/getApprovalBills",
        data: { uid: uid },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            debugger;
            hideLoader();
            AppBills = result;
            setDataSourceApproval(AppBills);
        }
    });
}

function bindArchivedBills() {
    $.ajax({
        type: "GET",
        async: false,
        cache: false,
        url: "../../Ajax/getArchivedBills",
        data: { uid: uid },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            hideLoader();
            ArcBills = result;
            setDataSourceArchived(ArcBills);
        }
    });
}

function bindDepartmentBills() {
    if ($('#DepartmentBills').length > 0) {

        $.ajax({
            type: "GET",
            async: false,
            cache: false,
            url: "../../Ajax/getDepartmentBills",
            data: { uid: uid },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                hideLoader();
                DepartmentBill = result;
                setDataSourceDepartmentBill(DepartmentBill);
            }
        });
    }
}

function showMyBills() {
    if ($("#chkMyBillsOnly").is(':checked')) {
        var filtergroup = new $.jqx.filter();
        var filter_or_operator = 1;
        var filtervalue = uid;
        var filtercondition = 'equal';
        var filter1 = filtergroup.createfilter('numericfilter', filtervalue, filtercondition);


        filtergroup.addfilter(filter_or_operator, filter1);
        // add the filters.
        $("#grdBillMaster").jqxGrid('addfilter', 'Uid', filtergroup);
        // apply the filters.
        $("#grdBillMaster").jqxGrid('applyfilters');

        //display count on Tab Name
        var datainformations = $('#grdBillMaster').jqxGrid('getdatainformation');
        var rowscounts = datainformations.rowscount;
        $('#lblPendingIdentificationCnt').text(rowscounts);
        $('#lblPendingIdentificationCount').html(rowscounts);
    }
    else {
        $("#grdBillMaster").jqxGrid('clearfilters');
    }
}

function FillCallType() {
    deptsourceDetail =
    {
        localdata: myBillDet,


        datafields:
            [{ name: 'Id', type: 'number' },
            { name: 'CallDate', type: 'date' },
            { name: 'CallTime', type: 'date' },
            { name: 'TransType', type: 'string' },
            { name: 'Description', type: 'string' },
            { name: 'Duration', type: 'string' },
            { name: 'Amount', type: 'number' },
            { name: 'Comment', type: 'string' },
            { name: 'CallType', type: 'string' },
            { name: 'Locked', type: 'bool' },
            ], datatype: "json"

    };
    var dataAdapterCategory = new $.jqx.dataAdapter(deptsourceDetail);

    var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowData, row) {
        var s0 = '', s1 = '', s2 = '', s3 = '', s4 = '', s5 = '';

        if (rowData.CallType == 0) {
            s0 = 'checked';
        }
        else if (rowData.CallType == 1) {
            s1 = 'checked';
        }
        else if (rowData.CallType == 2) {
            s2 = 'checked';
        }
        else if (rowData.CallType == 3) {
            s3 = 'checked';
        }
        else if (rowData.CallType == 5) {
            s5 = 'checked';
        }

        var myString = "";
        if (rowData.Locked) {
            //            myString = '<input type="radio" name="rd' + rowData.Id + '" value="0"  onclick="handleClick(this,' + rowData.Id + ');" disabled  ' + s0 + '> Unidentified ';
            if (rowData.CallType == 1) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="1" onclick="handleClick(this,' + rowData.Id + ');" disabled ' + s1 + '> Business';
            }
            if (rowData.CallType == 2) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="2" onclick="handleClick(this,' + rowData.Id + ');" disabled ' + s2 + '> Personal';
            }
            if (rowData.CallType == 3) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="3" onclick="handleClick(this,' + rowData.Id + ');" disabled ' + s3 + '> Allowance';
            }
            if (rowData.CallType == 5) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="5" onclick="handleClick(this,' + rowData.Id + ');" disabled ' + s5 + '> Ext.Allowance';
            }
        }
        else {
            //            myString = '<input type="radio" name="rd' + rowData.Id + '" value="0"  onclick="handleClick(this,' + rowData.Id + ');" ' + s0 + '> Unidentified ';
            myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="1"  onclick="handleClick(this,' + rowData.Id + ');"  ' + s1 + '> Business';
            myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="2" onclick="handleClick(this,' + rowData.Id + ');"  ' + s2 + '> Personal';
            if (rowData.CallType == 3) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="3" onclick="handleClick(this,' + rowData.Id + ');"  ' + s3 + '> Allowance';
            }
            if (rowData.CallType == 5) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="5" onclick="handleClick(this,' + rowData.Id + ');" > Ext.Allowance';
            }
            if (Settings.EnableDiscrepancy) {
                myString = myString + '<input type="radio" name="rd' + rowData.Id + '" value="4" onclick="handleClick(this,' + rowData.Id + ');"  ' + s4 + '> Faulty';
            }
        }
        return "<div style='padding: 10px;'>" + myString + "</div>";
    }
    var cellstext = function (row, columnfield, value, defaulthtml, columnproperties, rowData) {
        var latestComment = rowData.Comment || '';
        if (Array.isArray(itemData)) {
            for (var i = 0; i < itemData.length; i++) {
                if (parseInt(itemData[i].Id, 10) === parseInt(rowData.Id, 10)) {
                    latestComment = itemData[i].Comment || '';
                    break;
                }
            }
        }
        return `
        <input type="text"
               id="txtComment${rowData.Id}"
               value="${latestComment}"
               style="width:92%; margin:5px; height:30px;"
               class="comment-input"
               data-id="${rowData.Id}"
               onblur="saveComments(${rowData.Id})" />
    `;
    }
    var cellclassname = function (row, column, value, data) {
        if (value == 0) {
            return "redClass";
        }
    }


    $("#grdBillDetails").jqxGrid({
        width: '100%',
        source: dataAdapterCategory,
        columnsresize: true,
        rowsheight: jqx_rowsheight,
        columnsheight: 42,
        pageSize: 10,
        sortable: true,
        pageable: false,
        autoheight: false,
        theme: 'dark-blue',
        showsortcolumnbackground: true,
        selectionmode: 'singlerow',
        rowclassname: function (row) {          // 👈 Add this
            const rowData = $('#grdBillDetails').jqxGrid('getrowdata', row);
            if (rowData && rowData.CallType == 0) {
                return 'redClass';
            }
            return '';
        },
        columns: [

            { dataField: 'Id', text: 'Id', hidden: 'true' },
            { dataField: 'CallDate', text: 'Call Date', cellsformat: 'dd-MMM-yyyy', width: '8%' },
            { dataField: 'CallTime', text: 'Call Time', cellsformat: "h:mm tt", width: '7%' },
            { dataField: 'TransType', text: 'Trans Type', width: '12%' },
            { dataField: 'Description', text: 'Description', width: '21%' },
            { dataField: 'Duration', text: 'Duration', width: '6%' },
            { dataField: 'Amount', text: 'Amount', cellsformat: 'F3', cellsalign: 'right', width: '5%' },
            { dataField: 'CallType', text: 'Identify Calls', cellsrenderer: cellsrenderer, cellclassname: cellclassname, width: '18%' },
            { dataField: 'Comment', text: 'Comment' }]

    });



}




function SaveChanges() {


    var obji = { BillDetails: itemData }

    console.log(obji);
    $.ajax({
        type: "POST",
        cache: false,
        async: false,
        url: "../../Ajax/UpdateRecord",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            //alert(result.Message);
            $.alert.open('info', 'Success', 'Changes Saved Successfully');

        }
    });
}

function ButtonClick() {
    var getselectedrowindexes = $('#grdBillDetails').jqxGrid('getselectedrowindexes');
    var row = $("#grdBillDetails").jqxGrid('getrowdata', getselectedrowindexes[0]);
    ExName = row.Name;
    if (row.DialledNo != "") {

        $("#WindowContact").jqxWindow('open');
        $("#txtContactName").val(row.Name);
    }
}

function displayTabDetails(CardNo) {
    IndexLoad();
    if (CardNo == 1) {
        $('#jqxTabs').jqxTabs('select', 0);
    }
    else if (CardNo == 2) {
        $('#jqxTabs').jqxTabs('select', 1);
    }
    else if (CardNo == 3) {
        $('#jqxTabs').jqxTabs('select', 2);
    }
    else if (CardNo == 4) {
        $('#jqxTabs').jqxTabs('select', 3);
    }
};


function showLoader() {
    debugger;
    if (!($("#loaderDiv").is(':visible'))) {
        /* setTimeout(*/
        //function () {
        $('#loading').show();
        $('#loaderDiv').show();
        /*   }, 900);*/
    }
}

function hideLoader() {
    if (($("#loaderDiv").is(':visible'))) {
        /* setTimeout(*/
        //function () {
        $('#loading').hide();
        $('#loaderDiv').hide();
        /*   }, 900);*/
    }

}

// Delegated handlers for elements that previously used inline handlers
$(document).on('click', '.imgBillDetailsContactName', function (e) {
    e.preventDefault();
    if (typeof ButtonClick === 'function') {
        ButtonClick();
    }
});

$(document).on('click', '.clsBillHistoryViewBtn', function (e) {
    debugger;
    var billId = $(this).data('billid');
    if (billId) {
        getMyArcBill(billId);
    }
});

// Open approval window (replaces inline onclick="openWindow(...)")
$(document).on('click', '.clsOpenWindowBtn', function (e) {
    e.preventDefault();
    var billId = $(this).data('billid');
    if (billId && typeof openWindow === 'function') {
        openWindow(billId);
    }
});

// Select my bill (replaces inline onclick on radios)
$(document).on('click', '.clsSelectMyBill', function (e) {
    var bid = $(this).data('billid');
    if (bid && typeof SelectMyBill === 'function') {
        SelectMyBill(parseInt(bid, 10));
    }
});

// Delegated blur for approval comments (replaces inline onblur)
$(document).on('blur', '[id^="txtComm"]', function (e) {
    var idAttr = $(this).attr('id');
    // Guard: skip txtComment inputs (detail grid), only handle txtComm (approval grid)
    if (idAttr && idAttr.indexOf('txtComment') === 0) return;
    var id = idAttr ? idAttr.replace(/^txtComm/, '') : null;
    if (id && typeof saveComment === 'function') {
        saveComment(parseInt(id, 10));
    }
});

$(document).on('input keyup change', '.comment-input, [id^="txtComment"]', function () {
    var id = $(this).data('id');
    if (!id) {
        var idAttr = $(this).attr('id') || '';
        id = idAttr.replace(/^txtComment/, '');
    }
    id = parseInt(id, 10);
    var value = $(this).val();

    for (var i = 0; i < itemData.length; i++) {
        if (parseInt(itemData[i].Id, 10) === id) {
            itemData[i].Comment = value;
            break;
        }
    }
    if (Array.isArray(myBillDet)) {
        for (var j = 0; j < myBillDet.length; j++) {
            if (parseInt(myBillDet[j].Id, 10) === id) {
                myBillDet[j].Comment = value;
                break;
            }
        }
    }
});

// Save detail comments when user clicks/selects rows in jqxGrid
// Mirrors radio-click flow where persistComments() is called before rebinding.
$(document).on('mousedown', '#grdBillDetails .jqx-grid-cell, #grdBillDetails .jqx-fill-state-normal', function (e) {
    if ($(e.target).closest('.comment-input, [id^="txtComment"]').length) return;
    if (typeof persistComments === 'function') {
        persistComments();
    }
});

$(document).on('rowclick rowselect', '#grdBillDetails', function () {
    if (typeof persistComments === 'function') {
        persistComments();
    }
});

// Delegated blur for detail comments
$(document).on('blur', '[id^="txtComment"]', function () {
    var idAttr = $(this).attr('id');
    var id = idAttr ? idAttr.replace(/^txtComment/, '') : null;
    if (id && typeof saveComments === 'function') {
        saveComments(parseInt(id, 10));
    }
});