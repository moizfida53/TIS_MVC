
        var Telephone
        var AssignNo
        var Providersf
        var Employees
        var phoneNumber
        $(document).ready(function () {

            $("#cmbProvider").jqxDropDownList({ placeHolder: "Select Provider", selectedIndex: -1, width: "95%", height: 30 });

            var dropDownContent = '<div style="position: relative; margin: 3px; ">Select Employee</div>';
            $("#cmbEmployee").jqxDropDownButton({ width: "95%", height: 25 });
            $("#cmbEmployee").jqxDropDownButton('setContent', dropDownContent);
            $('#cmbEmployee').on('open', function () { FillEmployee(); });

            var dropDownContent1 = '<div style="position: relative; margin: 3px; ">Select Number</div>';
            $("#cmbNumber").jqxDropDownButton({ width: "95%", height: 25 });
            $("#cmbNumber").jqxDropDownButton('setContent', dropDownContent1);
            $('#cmbNumber').on('open', function () { FillNumber(); });

            $('#btnUpdate').hide();
            $('#btnDel').hide();
            $('#btnUpdateAsg').hide();
            $('#btnDelAsg').hide();


            $("#Window1").jqxWindow({ height: '70%', width: '70%', theme: 'summer', isModal: true, autoOpen: false });


            $("#txtSubNo").keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Allow: Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                    // Allow: Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||
                    // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });


            GetData();

        })




        function GetData() {
            $.ajax({
                type: "GET",
                cache: false,
                url: "../../Admin/GetTelData",
                success: function (result) {
                    Telephone = result.dtTel;
                    AssignNo = result.dtAsg;
                    phoneNumber = result.dtUnAsg;
                    Providers = result.dtProvider;
                    Employees = result.dtEmp;
                    FillTelephone();
                    FillProvider();
                    FillAssignNo();
                }
            });
        }
        function GetTelNo() {
            $.ajax({
                type: "GET",
                cache: false,
                url: "../../Admin/GetTelNo",
                success: function (result) {
                    Telephone = result.dtTel;
                    phoneNumber = result.dtUnAsg;
                    FillTelephone();
                }
            });
        }
        function GetAsgNo() {
            $.ajax({
                type: "POST",
                data: "",
                cache: false,
                url: "../../Admin/GetAsgNo?1=1",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    AssignNo = result.dtAsg;
                    phoneNumber = result.dtUnAsg;
                    Telephone = result.dtTel;
                    FillAssignNo();
                    FillTelephone();
                }
            });
        }

        function FillEmployee() {
            var sourceEmp =
            {
                dataType: "json",
                dataFields: [
                    { name: 'EmpId', type: 'string' },
                    { name: 'EmpNo', type: 'string' },
                    { name: 'EmpName', type: 'string' }
                ],
                id: 'EmpId',
                localdata: Employees
            };
            var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
            $("#grdEmployee").jqxGrid({
                width: '100%',
                height: '340px',
                source: dataAdapterEmp,
                columnsresize: true,
                theme: 'dark-blue',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                columns: [
                    { dataField: 'EmpId', text: 'UID', hidden: 'true' },
                    { dataField: 'EmpNo', text: 'EmployeeNo', width: '50%' },
                    { dataField: 'EmpName', text: 'Name', width: '50%' }
                ]
            });

            $("#grdEmployee").on('rowselect', function (event) {
                var args = event.args;
                var row = $("#grdEmployee").jqxGrid('getrowdata', args.rowindex);
                var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['EmpName'] + '</div>';
                $('#hidEmployee').val(row['EmpId']);
                $("#cmbEmployee").jqxDropDownButton('setContent', dropDownct);
                $('#cmbEmployee').jqxDropDownButton('close');

            });

        }
        function FillNumber() {
            var sourceEmp =
            {
                dataType: "json",
                cache: false,
                dataFields: [
                    { name: 'ID', type: 'number' },
                    { name: 'SUBNO', type: 'string' },
                    { name: 'DESCRIPTION', type: 'string' }
                ],
                id: 'ID',
                localdata: phoneNumber
            };
            var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
            $("#grdNumber").jqxGrid({
                width: '100%',
                height: '340px',
                source: dataAdapterEmp,
                columnsresize: true,
                theme: 'dark-blue',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                columns: [
                    { dataField: 'ID', text: 'ID', hidden: 'true' },
                    { dataField: 'SUBNO', text: 'Number', width: '40%' },
                    { dataField: 'DESCRIPTION', text: 'Description', width: '60%' }
                ]
            });

            $("#grdNumber").on('rowselect', function (event) {
                var args = event.args;
                var row = $("#grdNumber").jqxGrid('getrowdata', args.rowindex);
                var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['SUBNO'] + '</div>';
                $('#hidNumber').val(row['ID']);
                $("#cmbNumber").jqxDropDownButton('setContent', dropDownct);
                $('#cmbNumber').jqxDropDownButton('close');

            });

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
                localdata: Providers
            };
            var dataAdapterPr = new $.jqx.dataAdapter(source);
            // Create a jqxComboBox
            $("#cmbProvider").jqxDropDownList({ source: dataAdapterPr, displayMember: "NAME", valueMember: "ID" });
        }
        function FillTelephone() {
            var deptsource =
            {
                localdata: Telephone,
                datafields:
                    [
                        { name: 'ID', type: 'number' },
                        { name: 'SUBNO', type: 'string' },
                        { name: 'PROVIDER', type: 'number' },
                        { name: 'PROVIDERNAME', type: 'string' },
                        { name: 'DESCRIPTION', type: 'string' },
                        { name: 'ACCOUNTNO', type: 'string' },
                        { name: 'ISASSIGNED', type: 'bool' },
                        { name: 'GENERALPHONE', type: 'bool' },
                        { name: 'LINETYPE', type: 'number' },
                        { name: 'TYPE', type: 'string' },
                    ],
                datatype: "json"
            };

            var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
            $("#grdTelephone").jqxGrid({
                width: '100%',
                source: dataAdapterCategory,
                columnsresize: true,
                rowsheight: 30,
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                theme: 'dark-blue',
                selectionmode: 'singlerow',
                columns: [
                    { dataField: 'ID', text: 'ID', hidden: 'true' },
                    { dataField: 'SUBNO', text: 'Mobile No.' },
                    { dataField: 'PROVIDER', text: 'Provider', hidden: 'true' },
                    { dataField: 'PROVIDERNAME', text: 'Provider' },
                    { dataField: 'DESCRIPTION', text: 'Telephone Description' },
                    { dataField: 'ACCOUNTNO', text: 'Account No.' },
                    { dataField: 'ISASSIGNED', text: 'Assigned Status', columntype: 'checkbox' },
                    { dataField: 'GENERALPHONE', text: 'General Phone Status', hidden: 'true' },
                    { dataField: 'TYPE', text: 'Business Type', columntype: 'checkbox', type: 'bool' },
                    { dataField: 'LINETYPE', text: 'LINETYPE', hidden: 'true' },

                ]
            });
            $("#grdTelephone").on('rowselect', function (event) {
                idx = event.args.rowindex;
                var datarow = $("#grdTelephone").jqxGrid('getrowdata', idx);
                var ID = datarow.ID;
                var SUBNO = datarow.SUBNO;
                var PROVIDER = datarow.PROVIDER;
                var DESCRIPTION = datarow.DESCRIPTION;
                var ACCOUNTNO = datarow.ACCOUNTNO;



                var TYPE = datarow.TYPE;




                var LINETYPE = datarow.LINETYPE;
                $('#hidID').val(ID);
                $("#txtSubNo").val(SUBNO);
                $("#cmbProvider").jqxDropDownList('selectItem', PROVIDER);
                $("#txtSubDesc").val(DESCRIPTION);
                $("#txtAccountNo").val(ACCOUNTNO);
                $("#cmbLineType").val(LINETYPE);


                $("#cmbType").val(TYPE);





                $('#btnAdd').hide();
                $('#btnUpdate').show();
                $('#btnDel').show();
            });
        }
        function FillAssignNo() {
            var deptsource =
            {
                localdata: AssignNo,

                datafields:
                    [
                        { name: 'ID', type: 'number' },
                        { name: 'SubNoId', type: 'number' },
                        { name: 'SUBNO', type: 'string' },
                        { name: 'UID', type: 'number' },
                        { name: 'EMPLOYEENAME', type: 'string' },
                        { name: 'EMPLOYEENO', type: 'string' },
                        { name: 'DESCRIPTION', type: 'string' },
                        { name: 'ALLOWANCELIMIT', type: 'number' },
                        { name: 'BUSINESSLIMIT', type: 'number' },
                        { name: 'LINESTATUS', type: 'number' },
                        { name: 'STARTDATE', type: 'date' },
                        { name: 'ENDDATE', type: 'date' },

                    ],
                datatype: "json"
            };

            var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
            $("#grdAssignNo").jqxGrid({
                width: '100%',
                source: dataAdapterCategory,
                columnsresize: true,
                rowsheight: 30,
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                theme: 'dark-blue',
                selectionmode: 'singlerow',
                columns: [
                    { dataField: 'ID', text: 'ID', hidden: 'true' },
                    { dataField: 'SubNoId', text: 'SubNoId', hidden: 'true' },
                    { dataField: 'SUBNO', text: 'Telephone No.' },
                    { dataField: 'UID', text: 'UID', hidden: 'true' },
                    { dataField: 'EMPLOYEENAME', text: 'Employee Name' },
                    { dataField: 'EMPLOYEENO', text: 'Employee No.' },
                    { dataField: 'DESCRIPTION', text: 'Telephone Description' },
                    { dataField: 'ALLOWANCELIMIT', text: 'Allowance Limit' },
                    { dataField: 'BUSINESSLIMIT', text: 'Business Limit' },
                    { dataField: 'LINESTATUS', text: 'Line Status', hidden: 'true' },
                    { dataField: 'STARTDATE', text: 'Start Date', cellsformat: 'dd-MM-yyyy' },
                    { dataField: 'ENDDATE', text: 'End Date', cellsformat: 'dd-MM-yyyy' },
                ]
            });
            $("#grdAssignNo").on('rowselect', function (event) {
                idx = event.args.rowindex;
                var datarow = $("#grdAssignNo").jqxGrid('getrowdata', idx);
                var ID = datarow.ID;
                var SubNoId = datarow.SubNoId;
                var SUBNO = datarow.SUBNO;
                var UID = datarow.UID;
                var EMPLOYEENAME = datarow.EMPLOYEENAME;
                var ALLOWANCELIMIT = datarow.ALLOWANCELIMIT;
                var BUSINESSLIMIT = datarow.BUSINESSLIMIT;
                var LINESTATUS = datarow.LINESTATUS;
                var STARTDATE = datarow.STARTDATE;
                var ENDDATE = datarow.ENDDATE;

                $('#hidAID').val(ID);
                $('#hidEmployee').val(UID);
                $('#hidNumber').val(SubNoId);
                $("#txtAlwLimit").val(ALLOWANCELIMIT);
                $("#txtBusLimit").val(BUSINESSLIMIT);
                $("#cmbLineStatus").val(LINESTATUS); // Set
                $("#cmbStartDate").val(STARTDATE ? new Date(STARTDATE).toISOString().split('T')[0] : '');
                $("#cmbEndDate").val(ENDDATE ? new Date(ENDDATE).toISOString().split('T')[0] : '');
                var dropDownContent = '<div style="position: relative; margin: 3px; ">' + EMPLOYEENAME + '</div>';
                $("#cmbEmployee").jqxDropDownButton('setContent', dropDownContent);
                var dropDownContent1 = '<div style="position: relative; margin: 3px; ">' + SUBNO + '</div>';
                $("#cmbNumber").jqxDropDownButton('setContent', dropDownContent1);

                $('#btnAssign').hide();
                $('#btnUpdateAsg').show();
                $('#btnDelAsg').show();
            });
        }

        function AddTelephone() {
            if ($("#txtSubNo").val() == '') {

                $("#txtSubNo").notify('Please Fill Telephone Number', { position: "right" });

                return;
            }

            // Check For Duplicate telephone Number

            var filtergroup = new $.jqx.filter();
            var filter = filtergroup.createfilter('stringfilter', $("#txtSubNo").val(), 'EQUAL');
            filtergroup.addfilter(1, filter);
            $("#grdTelephone").jqxGrid('addfilter', 'SUBNO', filtergroup);
            $("#grdTelephone").jqxGrid('applyfilters');
            var Information = $("#grdTelephone").jqxGrid('getdatainformation');
            var Count = Information.rowscount;
            if (Count > 0) {
                $("#grdTelephone").jqxGrid('clearfilters');
                $("#txtSubNo").notify('Number already added', { position: "right" });
                return;
            }

            $("#grdTelephone").jqxGrid('clearfilters');
            ///////////////////////////////////////////

            var Item = $("#cmbProvider").jqxDropDownList('getSelectedItem');

            if (Item == null) {

                $("#cmbProvider").notify('Please Select Provider', { position: "right" });

                return;
            }

            var Tel = {
                "SUBNO": $("#txtSubNo").val(),
                "PROVIDER": Item.value,
                "DESCRIPTION": $("#txtSubDesc").val(),
                "ACCOUNTNO": $("#txtAccountNo").val(),
                "TYPE": $("#cmbType").val(),
                "LINETYPE": $("#cmbLineType").val()
            };
            var obji = { Telephone: Tel }


            // ✅ Only show SweetAlert, AJAX inside .then
            Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to add this Telephone number?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, add!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "POST",
                        url: "../../Admin/AddTelephone",
                        data: JSON.stringify(obji),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                            ClearTelephone();
                            GetTelNo();
                            if (result.myMessage == 'succ') {
                                Swal.fire('Success!', 'Telephone number Added Successfully', 'success');
                            } else {
                                Swal.fire('Error!', 'Cannot complete transaction, contact Admin', 'error');
                            }
                        }
                    });
                }
            });

        }
        function UpdateTelephone() {
            debugger;
            if ($("#txtSubNo").val() == '') {
                $("#txtSubNo").notify('Please Fill Telephone Number', { position: "right" });
                return;
            }

            // Check For Duplicate telephone Number

            var filtergroup = new $.jqx.filter();
            var filter = filtergroup.createfilter('stringfilter', $("#txtSubNo").val(), 'EQUAL');
            filtergroup.addfilter(1, filter);
            $("#grdTelephone").jqxGrid('addfilter', 'SUBNO', filtergroup);

            var filtergroup1 = new $.jqx.filter();
            var filter1 = filtergroup1.createfilter('stringfilter', $("#hidID").val(), 'NOT_EQUAL');
            filtergroup1.addfilter(1, filter1);
            $("#grdTelephone").jqxGrid('addfilter', 'ID', filtergroup1);

            $("#grdTelephone").jqxGrid('applyfilters');
            var Information = $("#grdTelephone").jqxGrid('getdatainformation');
            var Count = Information.rowscount;
            if (Count > 0) {
                $("#grdTelephone").jqxGrid('clearfilters');
                $("#txtSubNo").notify('Number already added', { position: "right" });
                return;
            }

            $("#grdTelephone").jqxGrid('clearfilters');
            ///////////////////////////////////////////

            var Item = $("#cmbProvider").jqxDropDownList('getSelectedItem');

            if (Item == null) {

                $("#cmbProvider").notify('Please Select Provider', { position: "right" });
                return;
            }

            var Tel = {
                "ID": $("#hidID").val(),
                "SUBNO": $("#txtSubNo").val(),
                "PROVIDER": Item.value,
                "DESCRIPTION": $("#txtSubDesc").val(),
                "ACCOUNTNO": $("#txtAccountNo").val(),
                "TYPE": $("#cmbType").val(),
                "LINETYPE": $("#cmbLineType").val()
            };
            var obji = { Telephone: Tel }

            Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to update this Telephone number?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, update!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "POST",
                        url: "../../Admin/UpdateTelephone",
                        data: JSON.stringify(obji),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                            ClearTelephone();
                            GetTelNo();
                            if (result.myMessage == 'succ') {
                                Swal.fire('Success!', 'Telephone number Updated Successfully', 'success');
                            } else {
                                Swal.fire('Error!', 'Cannot complete transaction, contact Admin', 'error');
                            }
                        }
                    });
                }
            });

        }
        function DelTelephone() {

            var Tel = {
                "ID": $("#hidID").val()
            };

            var obj = JSON.stringify(Tel);
            $.ajax({
                type: "GET",
                cache: false,
                url: "../../Admin/DeleteTelephone",
                contentType: 'application/json',
                data: Tel,
                success: function (result) {
                    ClearTelephone();

                    GetTelNo();

                    if (result.myMessage == 'succ') {
                        $.alert.open('info', 'Success', 'Telephone Number deleted successfully');
                    }
                    else if (result.myMessage == 'Exist') {
                        $.alert.open('error', 'Error', 'Cannot Delete this Number! Because there is a Bill Assigned to this Number');
                    }




                }
            });

        }
        function ClearTelephone() {
            $("#hidID").val('');
            $("#txtSubNo").val('');
            $("#txtSubDesc").val('');
            $("#txtAccountNo").val('');
            $("#cmbType").val('True');
            $("#cmbLineType").val('0');
            $("#cmbProvider").jqxDropDownList('clearSelection');
            $("#grdTelephone").jqxGrid('clearselection');
            $('#btnUpdate').hide();
            $('#btnDel').hide();
            $('#btnAdd').show();
        }

        function Assign() {
            debugger;
            if ($("#hidEmployee").val() == '') {
                $("#cmbEmployee").notify('Please Select Employee', { position: "right" });

                return;
            }
            if ($("#hidNumber").val() == '') {

                $("#cmbNumber").notify('Please Select Number', { position: "right" });
                return;
            }
            if ($("#cmbStartDate").val() == '') {

                $("#cmbStartDate").notify('Please Select Start Date', { position: "right" });
                return;
            }
            if ($("#cmbEndDate").val() == '') {

                $("#cmbEndDate").notify('Please Select End Date', { position: "right" });
                return;
            }

            var date1 = $("#cmbStartDate").val();
            var date2 = $("#cmbEndDate").val();


            if ((new Date(date1).getTime() <= new Date(date2).getTime())) { }
            else {

                $("#cmbStartDate").notify('Start Date Cannot be more than End Date', { position: "right" });
                return;
            }
            var formattedDate1 = date1;
            var formattedDate2 = date2;


            // Check For Dublicate AssignNo

            var filtergroup = new $.jqx.filter();
            var filter = filtergroup.createfilter('numericfilter', $("#hidNumber").val(), 'EQUAL');
            filtergroup.addfilter(1, filter);
            $("#grdAssignNo").jqxGrid('addfilter', 'SubNoId', filtergroup);

            var filtergroup1 = new $.jqx.filter();
            var filter1 = filtergroup1.createfilter('datefilter', formattedDate1, 'GREATER_THAN');
            filtergroup1.addfilter(1, filter1);
            $("#grdAssignNo").jqxGrid('addfilter', 'ENDDATE', filtergroup1);

            $("#grdAssignNo").jqxGrid('applyfilters');
            var Information = $("#grdAssignNo").jqxGrid('getdatainformation');
            var Count = Information.rowscount;
            if (Count > 0) {
                $("#grdAssignNo").jqxGrid('clearfilters');
                alert('');
                $.alert.open('error', 'Assign Cannot be done', 'Number Already Assigned to Someone Wthin this Date');
                return;
            }

            $("#grdAssignNo").jqxGrid('clearfilters');
            ////////////////////////////////////


            var item = {
                label: $("#cmbLineStatus option:selected").text(),
                value: $("#cmbLineStatus").val(),
                index: $("#cmbLineStatus")[0].selectedIndex
            };


            var Asg = {
                "UID": $("#hidEmployee").val(),
                "SubNoId": $("#hidNumber").val(),
                "ALLOWANCELIMIT": $("#txtAlwLimit").val(),
                "BUSINESSLIMIT": $("#txtBusLimit").val(),
                "STARTDATE": formattedDate1,
                "ENDDATE": formattedDate2,
                "LINESTATUS": item.value
            };
            var obji = { Assign: Asg }
            $.ajax({
                type: "POST",
                url: "../../Admin/Assign",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    ClearAssign();

                    GetAsgNo();
                    //FillAssignNo();
                    if (result.myMessage == 'succ') {
                        $.alert.open('info', 'Success', 'Number Assigned Successfully');
                    }
                    else {
                        $.alert.open('error', 'Error', 'Sorry cannot complete transaction, Please contact Administrator');
                    }
                }
            });

            // Show SweetAlert confirmation
            Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to Assign this Telephone number?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, add!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Proceed with AJAX call
                    $.ajax({
                        type: "POST",
                        url: "../../Admin/Assign",
                        data: JSON.stringify(obji),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                            ClearAssign();

                            GetAsgNo();
                            //FillAssignNo();
                            if (result.myMessage == 'succ') {
                                Swal.fire('Success!', 'Telephone number Assinged Successfully', 'success');
                            }
                            else {
                                Swal.fire('Error!', 'Cannot complete transaction, contact Admin', 'error');
                            }
                        }
                    });
                }
            });

        }
        function UpdateAssign() {
            if ($("#hidEmployee").val() == '') {


                $("#cmbEmployee").notify('Please Select Employee', { position: "right" });
                return;
            }
            if ($("#hidNumber").val() == '') {

                $("#cmbNumber").notify('Please Select Number', { position: "right" });
                return;
            }

            var date1 = $("#cmbStartDate").val();
            var date2 = $("#cmbEndDate").val();

            if ((new Date(date1).getTime() <= new Date(date2).getTime())) { }
            else {
                $("#cmbStartDate").notify('Start Date Cannot be more than End Date', { position: "right" });
                return;
            }
            var formattedDate1 = date1;
            var formattedDate2 = date2;


            // Check For Dublicate AssignNo

            var filtergroup = new $.jqx.filter();
            var filter = filtergroup.createfilter('numericfilter', $("#hidNumber").val(), 'EQUAL');
            filtergroup.addfilter(1, filter);
            $("#grdAssignNo").jqxGrid('addfilter', 'SubNoId', filtergroup);

            var filtergroup1 = new $.jqx.filter();
            var filter1 = filtergroup1.createfilter('datefilter', formattedDate1, 'GREATER_THAN');
            filtergroup1.addfilter(1, filter1);
            $("#grdAssignNo").jqxGrid('addfilter', 'ENDDATE', filtergroup1);

            var filtergroup2 = new $.jqx.filter();
            var filter2 = filtergroup2.createfilter('stringfilter', $("#hidAID").val(), 'NOT_EQUAL');
            filtergroup2.addfilter(1, filter2);
            $("#grdAssignNo").jqxGrid('addfilter', 'ID', filtergroup2);

            $("#grdAssignNo").jqxGrid('applyfilters');
            var Information = $("#grdAssignNo").jqxGrid('getdatainformation');
            var Count = Information.rowscount;
            if (Count > 0) {
                $("#grdAssignNo").jqxGrid('clearfilters');
                $.alert.open('error', 'Assign Cannot be done', 'Number Already Assigned to Someone Wthin this Date');
                return;
            }

            $("#grdAssignNo").jqxGrid('clearfilters');
            ////////////////////////////////////


            var item = {
                label: $("#cmbLineStatus option:selected").text(),
                value: $("#cmbLineStatus").val(),
                index: $("#cmbLineStatus")[0].selectedIndex
            };


            var Asg = {
                "ID": $("#hidAID").val(),
                "UID": $("#hidEmployee").val(),
                "SubNoId": $("#hidNumber").val(),
                "ALLOWANCELIMIT": $("#txtAlwLimit").val(),
                "BUSINESSLIMIT": $("#txtBusLimit").val(),
                "STARTDATE": formattedDate1,
                "ENDDATE": formattedDate2,
                "LINESTATUS": item.value
            };
            var obji = { Assign: Asg }


            Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to Update this Telephone number?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, add!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Proceed with AJAX call
                    $.ajax({
                        type: "POST",
                        url: "../../Admin/UpdateAssign",
                        data: JSON.stringify(obji),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                            ClearAssign();
                            GetAsgNo();
                            //FillAssignNo();
                            if (result.myMessage == 'succ') {
                                Swal.fire('Success!', 'Telephone number Updated Successfully', 'success');
                            }
                            else {
                                Swal.fire('Error!', 'Cannot complete transaction, contact Admin', 'error');
                            }
                        }
                    });
                }
            });

        }
        function DelTelephoneClick() {




            $.alert.open('confirm', 'Are You Sure you want to Delete?', function (button) {
                if (button == 'yes') {

                    DelTelephone();
                }


            });
        }
        function DelAssignClick() {

            $.alert.open('confirm', 'Are You Sure you want to Delete?', function (button) {
                if (button == 'yes') {

                    DelAssign();
                }


            });
        }
        function DelAssign() {

            var Asg = {
                "ID": $("#hidAID").val()
            };

            var obj = JSON.stringify(Asg);
            $.ajax({
                type: "GET",
                url: "../../Admin/DeleteAssign",
                contentType: 'application/json',
                data: Asg,
                success: function (result) {
                    ClearAssign();
                    GetAsgNo();
                    if (result.myMessage == 'succ') {
                        $.alert.open('info', 'Success', 'Assigned Record Deleted Successfully');
                    }
                    else {
                        $.alert.open('error', 'Error', 'Sorry cannot complete transaction, Please contact Administrator');
                    }

                }
            });

        }
        function ClearAssign() {
            $("#hidAID").val('');
            $("#hidEmployee").val('');
            var dropDownContent = '<div style="position: relative; margin: 3px; ">Select Employee</div>';
            $("#cmbEmployee").jqxDropDownButton('setContent', dropDownContent);
            $("#hidNumber").val('');
            var dropDownContent1 = '<div style="position: relative; margin: 3px; ">Select Number</div>';
            $("#cmbNumber").jqxDropDownButton('setContent', dropDownContent1);
            $("#txtAlwLimit").val('');
            $("#txtBusLimit").val('');
            $("#cmbLineStatus").val('0');
            $("#cmbLineStatus").jqxDropDownList('selectIndex', 1);
            $("#grdAssignNo").jqxGrid('clearselection');
            $("#cmbStartDate").val('');
            $("#cmbEndDate").val('');
            $('#btnUpdateAsg').hide();
            $('#btnDelAsg').hide();
            $('#btnAssign').show();
        }


