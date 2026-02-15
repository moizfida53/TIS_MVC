
        var Year = [];
        $(document).ready(function () {
            FillYear();
            GetData();

            $("#btnSearch").on('click', function () {
                Search();
            });

            $("#btnCancel").on('click', function () {
                Clear();
            });

            $("#btnExport").on('click', function () {
                if ($.fn.DataTable.isDataTable('#grdData')) {
                    $('#grdData').DataTable().button(0).trigger();
                }
            });
        });

        function GetData() {
            $.ajax({
                type: "GET",
                url: "../../BillReport/GetReport",
                data: { "IsStatus": "true" },
                success: function (result) {
                }
            });
        }

        function Search() {
            debugger;
            var Month = $("#cmbMonth").val() || 0;
            var Year = $("#cmbYear").val() || 0;
            var Status = $("#cmbStatus").val() || 0;

            var Search = {
                "Month": Month,
                "Year": Year,
                "Status": Status
            };

            var obji = { Search: Search };
            $.ajax({
                type: "POST",
                url: "../../BillReport/Search",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    FillGrid(result.dtData);
                    $("#grdData").show();
                }
            });
        }

        function FillGrid(dtData) {
            if ($.fn.DataTable.isDataTable('#grdData')) {
                $('#grdData').DataTable().clear().destroy();
            }

            // Add enhanced styling
            if (!$('#dataTableCustomStyle').length) {
                $('<style id="dataTableCustomStyle">' +
                    '.dataTables_wrapper .table { table-layout: fixed; width: 100% !important; }' +
                    '#grdData { width: 100% !important; }' +
                    '#grdData thead th { white-space: normal !important; word-break: keep-all !important; padding: 12px 8px !important; font-size: 13px; font-weight: 600; line-height: 1.4; vertical-align: middle; }' +
                    '#grdData tbody td { word-wrap: break-word; padding: 10px 8px; vertical-align: middle; overflow: hidden; text-overflow: ellipsis; }' +
                    '.header-bg {background-color:#26a8b9 !important; }' +
                    '#grdData thead th { color: #ffffff !important; border-bottom: 3px solid #1565c0 !important; }' +
                    '#grdData tbody tr:hover { background-color: #e3f2fd !important; }' +
                    '#grdData.table-striped tbody tr:nth-of-type(odd) { background-color: #f8f9fa; }' +
                    '#grdData.table-striped tbody tr:nth-of-type(even) { background-color: #ffffff; }' +
                    '.dataTables_wrapper .dataTables_length, .dataTables_wrapper .dataTables_filter { margin-bottom: 15px; }' +
                    '.dataTables_wrapper .dataTables_filter input { border: 2px solid #2196f3; border-radius: 4px; padding: 5px 10px; }' +
                    '.dataTables_wrapper .dataTables_filter input:focus { outline: none; border-color: #1565c0; box-shadow: 0 0 5px rgba(33, 150, 243, 0.3); }' +
                    '.dataTables_wrapper .dataTables_paginate .paginate_button.current { background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%) !important; border-color: #1976d2 !important; color: white !important; }' +
                    '.dataTables_wrapper .dataTables_paginate .paginate_button:hover { background: #e3f2fd !important; border-color: #2196f3 !important; color: #1565c0 !important; }' +
                    '.dt-buttons .btn { background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: 500; }' +
                    '.dt-buttons .btn:hover { background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); transform: translateY(-1px); box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3); }' +
                    '.boxed-table { border: 2px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }' +
                    '.dataTables_wrapper { width: 100%; }' +
                    '.dataTables_scroll { width: 100%; }' +
                    '</style>').appendTo('head');
            }

            $('#grdData').DataTable({
                data: dtData,
                columns: [
                    { data: 'EMPLOYEENO', width: '7%', className: 'text-center' },
                    { data: 'EMPLOYEENAME', width: '18%' },
                    { data: 'SUB_NO', width: '5%', className: 'text-center' },
                    { data: 'SUB_DESC', width: '10%' },
                    { data: 'ManagerName', width: '10%' },
                    { data: 'BILLDATE', width: '6%', className: 'text-center', render: function (data) { return data ? new Date(data).toLocaleDateString('en-GB') : ''; } },
                    { data: 'TOTALAMOUNT', width: '5%', className: 'text-end', render: $.fn.dataTable.render.number(',', '.', 2) },
                    { data: 'DEDUCTIBLEAMOUNT', width: '6%', className: 'text-end', render: $.fn.dataTable.render.number(',', '.', 2) },
                    { data: 'BUSINESSCHARGES', width: '6%', className: 'text-end', render: $.fn.dataTable.render.number(',', '.', 2) },
                    { data: 'BillStatus', width: '7%', className: 'text-center' },
                    { data: 'LASTUPDATEDON', width: '5%', className: 'text-center', render: function (data) { return data ? new Date(data).toLocaleDateString('en-GB') : ''; } },
                    { data: 'Forced_Date', width: '5%', className: 'text-center' },
                    { data: 'Forced_by_User', width: '5%', className: 'text-center' },
                    { data: 'Previous_Status', width: '5%', className: 'text-center' }
                ],
                autoWidth: false,
                scrollX: false,
                scrollCollapse: false,
                pageLength: 10,
                lengthMenu: [10, 25, 50, 100],
                order: [[5, 'desc']],
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        title: 'Bill Status Report',
                        text: '<i class="fas fa-file-excel"></i> Export to Excel',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }
                ],
                language: {
                    search: "Search:",
                    lengthMenu: "Show _MENU_ entries"
                },
                responsive: false,
                drawCallback: function () {
                    // Force table to maintain 100% width after draw
                    $('#grdData').css('width', '100%');
                }
            });
        }

        function FillYear() {
            var cmbYear = $("#cmbYear");
            for (var i = 2020; i <= 2030; i++) {
                Year.push(i);
                cmbYear.append('<option value="' + i + '">' + i + '</option>');
            }
        }

        function Clear() {
            $("#cmbMonth").val('');
            $("#cmbYear").val('');
            $("#cmbStatus").val('');
            if ($.fn.DataTable.isDataTable('#grdData')) {
                $('#grdData').DataTable().clear().destroy();
            }
            $("#grdData").hide();
        }
