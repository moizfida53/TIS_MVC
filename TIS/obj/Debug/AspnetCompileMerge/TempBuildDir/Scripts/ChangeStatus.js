
        var Employees;
        var Provider;
        var Status;
        var Year = [];
        var st = [];
        var billID = [];
        var DataAdapStatus;
        $(document).ready(function () {
            $("#cmbMonth").jqxDropDownList({ placeHolder: 'Select Month', selectedIndex: -1, width: '95%', height: '25px' });
            $("#cmbMonth").jqxDropDownList('loadFromSelect', 'Select');
            $("#Select").hide();
            $("#cmbYear").jqxDropDownList({ placeHolder: 'Select Year', selectedIndex: -1, width: '95%', height: '25' });
            $("#cmbProvider").jqxDropDownList({ placeHolder: 'Select Provider', selectedIndex: -1, width: "95%", height: 25 });
            //$("#cmbStatus").jqxDropDownList({ placeHolder: 'Select Status', selectedIndex: -1, width: "95%", height: 25 });
            $("#btnEmployee").jqxDropDownButton({ width: "90%", height: 25 });
            $("#btnEmployee").jqxDropDownButton('setContent', 'Select Employee');
            $('#btnEmployee').on('open', function () { FillEmployee(); });
            $("#btnSearch").jqxButton({ template: 'primary' });
            $('#btnSearch').on('click', function () {
                Search();

            });
            //$("#btnSave").jqxButton({ template: 'primary' });
            //$('#btnSave').on('click', function () {
            //    SaveChanges();
            //});
            //$("#btnSave").hide();
            $("#btnCancel").jqxButton({ template: 'primary' });
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
                data: { "IsStatus": "true" },
                success: function (result) {
                    Employees = result.EmpList;
                    Provider = result.ProviderList;
                    Status = result.dtStatus;
                    FillProvider();
                    //FillStatus();
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
            for (var i = 2023; i <= 2030; i++) {
                Year.push(i);
            }
            $("#cmbYear").jqxDropDownList({ source: Year });
        }
        function FillProvider() {
            var source =
            {
                dataType: "json",
                dataFields: [
                    { name: 'ID', type: 'string' },
                    { name: 'NAME', type: 'string' }
                ],
                id: 'ID',
                localdata: Provider
            };
            var dataAdapterPr = new $.jqx.dataAdapter(source);
            // Create a jqxComboBox
            $("#cmbProvider").jqxDropDownList({ source: dataAdapterPr, displayMember: "NAME", valueMember: "ID" });

        }
        function FillStatus() {
            var source =
            {
                dataType: "json",
                dataFields: [
                    { name: 'ID', type: 'number' },
                    { name: 'NAME', type: 'string' }
                ],
                id: 'ID',
                localdata: Status
            };
            var dataAdapterPr = new $.jqx.dataAdapter(source);
            DataAdapStatus = dataAdapterPr;
            // Create a jqxComboBox
            $("#cmbStatus").jqxDropDownList({ source: dataAdapterPr, displayMember: "NAME", valueMember: "ID" });
        }

        function Search() {
            var Provider = 0; var Month = 0; var Year = 0; var Status = 0; var UID = 0;

            if ($("#cmbProvider").jqxDropDownList('getSelectedItem') != null) {
                Provider = $("#cmbProvider").jqxDropDownList('getSelectedItem');
            }
            if ($("#cmbMonth").val() != null) {
                Month = $("#cmbMonth").val();
            }

            if ($("#cmbYear").jqxDropDownList('getSelectedItem') != null) {
                Year = $("#cmbYear").jqxDropDownList('getSelectedItem');
            }

            //if ($("#cmbStatus").jqxDropDownList('getSelectedItem') != null) {
            //    Status = $("#cmbStatus").jqxDropDownList('getSelectedItem');
            //}

            if ($("#hidEmp").val() != '') {
                UID = $("#hidEmp").val();
            }


            var Search = {
                "Month": Month,
                "Year": Year.label,
                "Provider": Provider.value,
                "Status": Status.value,
                "UID": UID
            };
            var obji = { Search: Search }
            $.ajax({
                type: "POST",
                url: "../../Bill/Search",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    FillGrid(result.dtData);
                    $("#grdData").show();
                    $("#btnSave").show();
                }
            })
        }
        function FillGrid(dtData) {

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
                        { name: 'StatusName', type: 'string' },
                        { name: 'StatusID', type: 'number' }

                    ],
                datatype: "json"
            };

            var dataAdapGrid = new $.jqx.dataAdapter(deptsource);

            $("#grdData").jqxGrid({
                width: '100%',
                source: dataAdapGrid,
                height: "800px",
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                theme: 'dark-blue',
                selectionmode: 'singlerow',
                editable: false,
                rowsheight: 40,
                columnsheight: 40,

                columns: [
                    { dataField: 'Id', text: 'Id', hidden: true },
                    { dataField: 'BillDate', text: 'Bill Date', cellsformat: 'dd-MM-yyyy', width: '8%' },
                    { dataField: 'Mobile', text: 'Mobile', width: '16%' },           // +1%
                    { dataField: 'EmpName', text: 'Employee Name', width: '23%' },   // +1%
                    { dataField: 'ManagerName', text: 'Manager Name', width: '23%' },// +1%
                    {
                        dataField: 'TotalAmount',
                        text: 'Amount',
                        width: '10%',
                        cellsalign: 'left',
                        cellsformat: 'f3',
                    },
                    { dataField: 'StatusName', text: 'Status', width: '12%' },       // +2%
                    {
                        text: 'Change To',
                        datafield: 'ChangeStatus',
                        width: '8%',
                        cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                            return `<div style="text-align:center;margin-top:7px;">
                        <button class="btn-status-change" data-id="${rowdata.Id}">Open</button>
                    </div>`;
                        }
                    }
                ]




            });

            // 🔹 Handle button click separately (since jqxGrid won't auto-bind)
            $(document).on('click', '.btn-status-change', function (e) {
                var billId = $(this).data('id');

                // Get the row index of the clicked button
                var rowIndex = $("#grdData").jqxGrid('getrowboundindexbyid', billId);



                Swal.fire({
                    title: "Change Status?",
                    text: "Do you want to change this bill's status to Open?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Yes, Change",
                    cancelButtonText: "No, Cancel",
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
                            url: '/Bill/ChangeStatus',
                            type: 'POST',
                            data: { billId: billId },
                            success: function (response) {
                                // Close loader first
                                Swal.close();

                                if (response.success) {
                                    Swal.fire("Updated!", response.message, "success").then(() => {
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
            });




        }
        function SaveChanges() {

            if (billID.length == 0) {
                alert('Select Atleast One Record');
                return;
            }

            var CS = {
                "BillID": billID,
                "Status": st
            };
            var obji = { CS: CS }
            $.ajax({
                type: "POST",
                url: "../../Bill/ChangeBillStatus",
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
            $("#cmbMonth").jqxDropDownList({ selectedIndex: -1 });
            $("#cmbYear").jqxDropDownList({ selectedIndex: -1 });
            $("#cmbProvider").jqxDropDownList({ selectedIndex: -1 });

            // Make sure the employee grid exists
            if ($("#grdEmployee").length) {
                $("#grdEmployee").jqxGrid('clearselection');
            }

            $("#hidEmp").val('');

            // Reset dropdown button display after clearing grid
            setTimeout(function () {
                $("#btnEmployee").jqxDropDownButton('setContent', 'Select Employee');
            }, 50);

            $("#grdData").jqxGrid('clearselection').hide();
            $("#btnSave").hide();
        }
