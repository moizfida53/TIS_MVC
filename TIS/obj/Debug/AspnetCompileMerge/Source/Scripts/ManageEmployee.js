    var employees
    var Roles
    var Countries
    var CostCenter
    $(document).ready(function () {
        $('#btnUpdate').hide();
    $('#btnDel').hide();

    var dropDownContent1 = '<div style="position: relative; margin: 3px; ">Select Manager</div>';
    $body = $("body");
    $("#btnmanager").jqxDropDownButton({width: "100%", height: 25 });
    $("#btnmanager").jqxDropDownButton('setContent', dropDownContent1);
    $('#btnmanager').on('open', function () {FillManager(); });

    $("#btnCC").jqxDropDownButton({width: "100%", height: 25 });
    $("#btnCC").jqxDropDownButton('setContent', 'Select CostCenter');
    $('#btnCC').on('open', function () {FillCC(); });

    var dropDownContent = '<div style="position: relative; margin: 3px;">Select Role</div>';
    $("#btnRole").jqxDropDownButton({width: "100%", height: 25 });
    $("#btnRole").jqxDropDownButton('setContent', dropDownContent);
    $('#btnRole').on('open', function () {FillRole(); });

            $('#btnCancel').on('click', () => Clear());
            $('#btnAdd').on('click', () => AddEmployee());
            $('#btnUpdate').on('click', () => UpdateEmployee());


    $("#Window").jqxWindow({height: '70%', width: '70%', theme: 'summer', isModal: true, autoOpen: false });
    $("#Window1").jqxWindow({height: '70%', width: '70%', theme: 'summer', isModal: true, autoOpen: false });
    $("#Window2").jqxWindow({height: '70%', width: '70%', theme: 'summer', isModal: true, autoOpen: false });


    GetData();

        });

    function GetData() {
        $.ajax({
            type: "GET",
            cache: false,
            url: "../../Admin/GetUser",
            success: function (result) {
                employees = result.dtEmp;
                Roles = result.RoleList;
                Countries = result.CountryList;
                CostCenter = result.dtCC;
                FillGrid();
                FillCountry();
                //FillCountry1();
            }
        });
        }

    function FillCountry() {

            var source =
    {
        dataType: "json",
    dataFields: [
    {name: 'COUNTRYID', type: 'number' },
    {name: 'COUNTRYNAME', type: 'string' },
    {name: 'CURRENCY', type: 'string' },
    {name: 'COUNTRYCODE', type: 'string' },
    {name: 'EXCHANGERATE', type: 'number' },
    {name: 'SHAYACODE', type: 'string' }
    ],
    id: 'COUNTRYID',
    localdata: Countries
            };
    var dataAdapterCnt = new $.jqx.dataAdapter(source);
    // Create a jqxListBox
    $("#lbCountry").jqxListBox({
        source: dataAdapterCnt,
    displayMember: "COUNTRYNAME",
    valueMember: "COUNTRYID",
    multiple: true,
    checkboxes: true,
    filterable: false,
    width: "100%",
    theme: 'dark-blue',
    height: 40
            });

        }

    function FillManager() {
            var sourceEmp =
    {
        dataType: "json",
    dataFields: [
    {name: 'UID', type: 'string', hidden: 'true' },
    {name: 'NAME', type: 'string', width: '250' },
    {name: 'EMPLOYEENO', type: 'string' }
    ],
    id: 'UID',
    localdata: employees
            };
    var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
    $("#grdManager").jqxGrid({
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
    {dataField: 'UID', text: 'UID', hidden: 'true' },
    {dataField: 'NAME', text: 'Name', width: '50%' },
    {dataField: 'EMPLOYEENO', text: 'Employee No', width: '50%' }]
            });

    $("#grdManager").on('rowselect', function (event) {
                var args = event.args;
    var row = $("#grdManager").jqxGrid('getrowdata', args.rowindex);
    var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['NAME'] + ' - ' + row['EMPLOYEENO'] + '</div>';
    $('#hidManager').val(row['UID']);
    $("#btnmanager").jqxDropDownButton('setContent', dropDownct);
    $('#btnmanager').jqxDropDownButton('close');
            });
        }
    function FillCC() {
            var sourceEmp =
    {
        dataType: "json",
    dataFields: [
    {name: 'UID', type: 'number' },
    {name: 'CCName', type: 'string' },
    {name: 'CCNum', type: 'string' }
    ],
    id: 'UID',
    localdata: CostCenter
            };
    var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
    $("#grdCC").jqxGrid({
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
    {dataField: 'UID', text: 'UID', hidden: 'true' },
    {dataField: 'CCName', text: 'Cost Center Name', width: '250' },
    {dataField: 'CCNum', text: 'Cost Center Number', width: '150' }]
            });

    $("#grdCC").on('rowselect', function (event) {
                var args = event.args;
    var row = $("#grdCC").jqxGrid('getrowdata', args.rowindex);
    var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['CCName'] + ' - ' + row['CCNum'] + '</div>';
    $('#hidCC').val(row['CCNum']);
    $("#btnCC").jqxDropDownButton('setContent', dropDownct);
    $('#btnCC').jqxDropDownButton('close');

            });

        }
    function FillRole() {
            var sourceEmp =
    {
        dataType: "json",
    dataFields: [
    {name: 'ID', type: 'string' },
    {name: 'ROLE', type: 'string' }
    ],
    id: 'ID',
    localdata: Roles
            };
    var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
    $("#grdRole").jqxGrid({
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
    {dataField: 'ID', text: 'ID' },
    {dataField: 'ROLE', text: 'ROLE' }]
            });

    $("#grdRole").on('rowselect', function (event) {
                var args = event.args;
    var row = $("#grdRole").jqxGrid('getrowdata', args.rowindex);
    var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['ROLE'] + '</div>';
    $('#hidRole').val(row['ID']);
    $("#btnRole").jqxDropDownButton('setContent', dropDownct);
    $('#btnRole').jqxDropDownButton('close');

            });

        }

    function FillGrid() {
            var deptsource = {
        localdata: employees,
    datafields: [
    {name: 'UID', type: 'number' },
    {name: 'NAME', type: 'string' },
    {name: 'EMPLOYEENO', type: 'string' },
    {name: 'EMAIL', type: 'string' },
    {name: 'USERNAME', type: 'string' },
    {name: 'ORG', type: 'string' },
    {name: 'DESCRIPTION', type: 'string' },
    {name: 'GRADE', type: 'string' },
    {name: 'MANAGERID', type: 'number' },
    {name: 'MANAGERNAME', type: 'string' },
    {name: 'EXTENSION', type: 'string' },
    {name: 'PAYROLL', type: 'string' },
    {name: 'ROLEID', type: 'number' },
    {name: 'ROLENAME', type: 'string' },
    {name: 'COUNTRYID', type: 'number' },
    {name: 'COUNTRYNAME', type: 'string' },
    {name: 'CCNO', type: 'string' },
    {name: 'ISCOSTCENTER', type: 'bool' },
    {name: 'IsActive', type: 'bool' }
    ],
    datatype: "json"
            };

    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);

    // First, let's create a custom cellsrenderer function
    function createInactiveRowRenderer() {
                return function (row, column, value, defaultHtml, columnSettings, rowData) {

                    if (rowData && rowData.IsActive === false) {

                        return '<div class="inactive-row">' + (value || '') + '</div>';
                    }

    return defaultHtml;
                };
            }
    function createCountryRenderer() {
                return function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                    if ((columnfield === 'COUNTRYNAME' || columnfield === 'EMPLOYEENO') && rowdata.IsActive === false) {
                        return '<div class="inactive-row2">' + (value || '') + '</div>';
                    }

    return defaulthtml;
                };
            }


    function createInactiveCheckboxRenderer() {
                return function (row, column, value, defaultHtml, columnSettings, rowData) {
                    if (rowData && rowData.IsActive === false) {

                        // Get the checkbox state
                        var isChecked = value ? 'checked' : '';

    // Create a custom checkbox with the same background
    return '<div class="inactive-row" style="justify-content: center;">' +
        '<input type="checkbox" ' + isChecked + ' disabled />' +
        '</div>';
                    }
    else {
                        // Get the checkbox state
                        var isChecked = value ? 'checked' : '';

    // Create a custom checkbox with the same background
    return '<div class="inactive-check">' +
        '<input type="checkbox" ' + isChecked + ' disabled />' +
        '</div>';
                    }
    return defaultHtml;
                };
            }

    $("#grdEmployee").jqxGrid({
        width: '100%',
    source: dataAdapterCategory,
    columnsresize: true,
    rowsheight: 35,
    pageSize: 10,
    sortable: true,
    filterable: true,
    showfilterrow: true,
    pageable: true,
    theme: 'dark-blue',
    selectionmode: 'singlerow',
    altrows: true,
    enabletooltips: true,
    enablehover: true,
    enablebrowserselection: true,
    columnsheight: 40,
    statusbarheight: 30,
    columns: [
    {
        dataField: 'UID',
    text: 'UID',
    hidden: 'true'
                    },
    {
        dataField: 'EMPLOYEENO',
    text: 'EMPLOYEE NO',
    width: '8.78%',
    cellsalign: 'center',
    align: 'center',
    cellsrenderer: createCountryRenderer()
                    },
    {
        dataField: 'NAME',
    text: 'NAME',
    width: '20.28%',
    cellsalign: 'left',
    align: 'center',
    cellsrenderer: createInactiveRowRenderer()
                    },
    {
        dataField: 'USERNAME',
    text: 'USERNAME',
    hidden: 'true'
                    },
    {
        dataField: 'EMAIL',
    text: 'EMAIL',
    width: '16.89%',
    cellsalign: 'left',
    align: 'center',
    cellsrenderer: createInactiveRowRenderer()
                    },
    {
        dataField: 'ORG',
    text: 'ORGANIZATION',
    width: '10.14%',
    cellsalign: 'left',
    align: 'center',
    cellsrenderer: createInactiveRowRenderer()
                    },
    {
        dataField: 'DESCRIPTION',
    text: 'DESCRIPTION',
    width: '10.14%',
    cellsalign: 'left',
    align: 'center',
    cellsrenderer: createInactiveRowRenderer()
                    },
    {
        dataField: 'GRADE',
    text: 'GRADE',
    hidden: 'true'
                    },
    {
        dataField: 'MANAGERID',
    text: 'MANAGERID',
    hidden: 'true'
                    },
    {
        dataField: 'MANAGERNAME',
    text: 'MANAGERNAME',
    hidden: 'true'
                    },
    {
        dataField: 'EXTENSION',
    text: 'EXT',
    width: '6.76%',
    cellsalign: 'center',
    align: 'center',
    cellsrenderer: createInactiveRowRenderer()
                    },
    {
        dataField: 'PAYROLL',
    text: 'PAYROLL',
    width: '6.76%',
    cellsalign: 'center',
    align: 'center',
    cellsrenderer: createInactiveRowRenderer()
                    },
    {
        dataField: 'ROLEID',
    text: 'RID',
    hidden: 'true'
                    },
    {
        dataField: 'ROLENAME',
    text: 'ROLE',
    hidden: 'true'
                    },
    {
        dataField: 'COUNTRYID',
    text: 'CID',
    hidden: 'true'
                    },
    {
        dataField: 'COUNTRYNAME',
    text: 'COUNTRY',
    width: '6.76%',
    cellsalign: 'center',
    align: 'center',
    cellsrenderer: createCountryRenderer()
                    },
    {
        dataField: 'CCNO',
    text: 'COST CENTER',
    width: '6.76%',
    cellsalign: 'center',
    align: 'center',
    cellsrenderer: createInactiveRowRenderer()
                    },
    {
        dataField: 'ISCOSTCENTER',
    text: 'IS CC',
    width: '6.74%',
    cellsalign: 'center',
    align: 'center',
    cellsrenderer: createInactiveCheckboxRenderer()
                    },
    {
        dataField: 'IsActive',
    hidden: 'true'
                    },
    ]
            });

    // Your existing rowselect event handler
    $("#grdEmployee").on('rowselect', function (event) {
        idx = event.args.rowindex;
    var datarow = $("#grdEmployee").jqxGrid('getrowdata', idx);
    var UID = datarow.UID;
    var NAME = datarow.NAME;
    var EMPLOYEENO = datarow.EMPLOYEENO;
    var USERNAME = datarow.USERNAME;
    var EMAIL = datarow.EMAIL;
    var ORG = datarow.ORG;
    var DESCRIPTION = datarow.DESCRIPTION;
    var GRADE = datarow.GRADE;
    var MANAGERID = datarow.MANAGERID;
    var MANAGERNAME = datarow.MANAGERNAME;
    var EXTENSION = datarow.EXTENSION;
    var PAYROLL = datarow.PAYROLL;
    var ROLEID = datarow.ROLEID;
    var ROLENAME = datarow.ROLENAME;
    var COUNTRYID = datarow.COUNTRYID;
    var CCNO = datarow.CCNO;
    var IsActive = datarow.IsActive;

    $('#hidUID').val(UID);
    $("#txtName").val(NAME);
    $("#txtEmployeeNo").val(EMPLOYEENO);
    $("#txtEmail").val(EMAIL);
    $("#txtUsername").val(USERNAME);
    $("#txtDept").val(ORG);
    $("#txtDesc").val(DESCRIPTION);
    $("#txtGrade").val(GRADE);
    $("#txtExtension").val(EXTENSION);
    $("#txtPayroll").val(PAYROLL);
    $('#hidManager').val(MANAGERID);
    $('#hidRole').val(ROLEID);
    $('#btnCC').val(CCNO);
    $('#IsActive').prop('checked', IsActive === true);
    var dropDownContent1 = '<div style="position: relative; margin: 3px; ">' + MANAGERNAME + '</div>';
    $("#btnmanager").jqxDropDownButton('setContent', dropDownContent1);
    var dropDownContent = '<div style="position: relative; margin: 3px; ">' + ROLENAME + '</div>';
    $("#btnRole").jqxDropDownButton('setContent', dropDownContent);
    $("#lbCountry").jqxListBox('uncheckAll');
    $("#lbCountry").jqxListBox('checkItem', COUNTRYID);

    $('#btnAdd').hide();
    $('#btnUpdate').show();
    $('#btnDel').hide();
            });
        }

    function AddEmployee() {
            if ($("#txtEmployeeNo").val() == '') {

        $("#txtEmployeeNo").notify('Please Fill Employee No', { position: "right" });
    return;
            }
    if ($("#txtName").val() == '') {
        $("#txtName").notify('Please Fill Employee Name', { position: "right" });
    return;
            }


    // Check For Dublicate EmployeeNo

    var filtergroup = new $.jqx.filter();
    var filter = filtergroup.createfilter('stringfilter', $("#txtEmployeeNo").val(), 'EQUAL');
    filtergroup.addfilter(1, filter);
    $("#grdEmployee").jqxGrid('addfilter', 'EMPLOYEENO', filtergroup);
    $("#grdEmployee").jqxGrid('applyfilters');
    var Information = $("#grdEmployee").jqxGrid('getdatainformation');
    var Count = Information.rowscount;
            if (Count > 0) {
        $("#grdEmployee").jqxGrid('clearfilters');
    alert('Employee Number Already Created');
    return;
            }

    $("#grdEmployee").jqxGrid('clearfilters');
    //////////////////////////////////////

    if ($("#txtUsername").val() == '') {

        $("#txtUsername").notify('Please Fill UserName', { position: "right" });
    return;
            }
    if ($("#txtEmail").val() == '') {

        $("#txtEmail").notify('Please Fill Email', { position: "right" });
    return;
            }
    if ($("#hidManager").val() == '') {

        $("#btnmanager").notify('Please Select Manager', { position: "right" });
    return;
            }
    if ($("#hidRole").val() == '') {

        $("#btnRole").notify('Please Select Role', { position: "right" });
    return;
            }

    // Show SweetAlert confirmation
    Swal.fire({
        title: 'Are you sure?',
    text: "Do you want to add this employee?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, add!',
    cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
        // Proceed with AJAX call
        performAddEmployee();
                }
            });
        }

    // Move your existing AJAX logic into a separate function
    function performAddEmployee() {
            var Ar = [];
    var items = $("#lbCountry").jqxListBox('getCheckedItems');
    for (var i = 0; i < items.length; i++) {
        Ar.push(items[i].value);
            }

    var Contr = {"SelectedValues": Ar };
    var Employ = {
        "NAME": $("#txtName").val(),
    "EMPLOYEENO": $("#txtEmployeeNo").val(),
    "EMAIL": $("#txtEmail").val(),
    "USERNAME": $("#txtUsername").val(),
    "ORG": $("#txtDept").val(),
    "DESCRIPTION": $("#txtDesc").val(),
    "GRADE": $("#txtGrade").val(),
    "EXTENSION": $("#txtExtension").val(),
    "PAYROLL": $("#txtPayroll").val(),
    "MANAGERID": $('#hidManager').val(),
    "ROLEID": $('#hidRole').val(),
    "CCNO": $('#btnCC').val(),
    "IsActive": $('#IsActive').prop('checked')
            };

    $.ajax({
        type: "POST",
    cache: false,
    url: "../../Admin/AddEmployee",
    data: JSON.stringify({Emp: Employ, Cnt: Contr }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
        Clear();
    GetData();
    if (result.myMessage == 'succ') {
        Swal.fire('Success!', 'Employee Added Successfully', 'success');
                    } else {
        Swal.fire('Error!', 'Cannot complete transaction, contact Admin', 'error');
                    }
                }
            });

        }
    function UpdateEmployee() {
            if ($("#txtName").val() == '') {
        $("#txtName").notify('Please Fill Employee Name', { position: "right" });

    return;
            }
    if ($("#txtEmployeeNo").val() == '') {
        $("#txtEmployeeNo").notify('Please Fill Employee No', { position: "right" });
    return;
            }

    // Check For Dublicate EmployeeNo

    var filtergroup = new $.jqx.filter();
    var filter = filtergroup.createfilter('stringfilter', $("#txtEmployeeNo").val(), 'EQUAL');
    filtergroup.addfilter(1, filter);
    $("#grdEmployee").jqxGrid('addfilter', 'EMPLOYEENO', filtergroup);

    var filtergroup1 = new $.jqx.filter();
    var filter1 = filtergroup1.createfilter('stringfilter', $("#hidUID").val(), 'NOT_EQUAL');
    filtergroup1.addfilter(1, filter1);
    $("#grdEmployee").jqxGrid('addfilter', 'UID', filtergroup1);

    $("#grdEmployee").jqxGrid('applyfilters');
    var Information = $("#grdEmployee").jqxGrid('getdatainformation');
    var Count = Information.rowscount;
            if (Count > 0) {
        $("#grdEmployee").jqxGrid('clearfilters');
    alert('Employee Number Already Created');
    return;
            }

    $("#grdEmployee").jqxGrid('clearfilters');
    //////////////////////////////////////

    if ($("#txtUsername").val() == '') {

        $("#txtUsername").notify('Please Fill UserName', { position: "right" });
    return;
            }
    if ($("#txtEmail").val() == '') {

        $("#txtEmail").notify('Please Fill Email', { position: "right" });
    return;
            }
    if ($("#hidManager").val() == '') {

        $("#hidManager").notify('Please Select Manager', { position: "right" });
    return;
            }
    if ($("#hidRole").val() == '') {

        $("#hidRole").notify('Please Select Role', { position: "right" });
    return;
            }

    Swal.fire({
        title: 'Are you sure?',
    text: "Do you want to update this employee?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, update!',
    cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
        performUpdateEmployee();
                }
            });
        }

    function performUpdateEmployee() {
            var Ar = [];
    var items = $("#lbCountry").jqxListBox('getCheckedItems');
    for (var i = 0; i < items.length; i++) {
        Ar.push(items[i].value);
            }

    var Contr = {"SelectedValues": Ar };
    var Employ = {
        "UID": $("#hidUID").val(),
    "NAME": $("#txtName").val(),
    "EMPLOYEENO": $("#txtEmployeeNo").val(),
    "EMAIL": $("#txtEmail").val(),
    "USERNAME": $("#txtUsername").val(),
    "ORG": $("#txtDept").val(),
    "DESCRIPTION": $("#txtDesc").val(),
    "GRADE": $("#txtGrade").val(),
    "EXTENSION": $("#txtExtension").val(),
    "PAYROLL": $("#txtPayroll").val(),
    "MANAGERID": $('#hidManager').val(),
    "ROLEID": $('#hidRole').val(),
    "CCNO": $('#btnCC').val(),
    "IsActive": $('#IsActive').prop('checked')
            };

    $.ajax({
        type: "POST",
    cache: false,
    url: "../../Admin/UpdateEmployee",
    data: JSON.stringify({Emp: Employ, Cnt: Contr }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
        Clear();
    GetData();
    if (result.myMessage == 'succ') {
        Swal.fire('Success!', 'Employee Updated Successfully', 'success');
                    } else {
        Swal.fire('Error!', 'Cannot complete transaction, contact Admin', 'error');
                    }
                }
            });

        }

    function DelClick() {
        $.alert.open('confirm', 'Are You Sure you want to Delete?', function (button) {
            if (button == 'yes') {

                DelEmployee();
            }


        });

        }
    function DelEmployee() {

            var Employ = {
        "UID": $("#hidUID").val()
            };

    var obj = JSON.stringify(Employ);
    $.ajax({
        type: "GET",

    url: "../../Admin/DeleteEmployee",
    contentType: 'application/json',
    data: Employ,
    success: function (result) {
        Clear();

    GetData();
    if (result.myMessage == 'succ') {
        $.alert.open('info', 'Success', 'Employee Deleted Successfully');
                    }
    else {
        $.alert.open('error', 'Error', 'Sorry cannot complete transaction, Please contact Administrator');
                    }
                }
            });

        }
    function Clear() {
            debugger;
    $("#hidUID").val('');
    $("#txtName").val('');
    $("#txtEmployeeNo").val('');
    $("#txtEmail").val('');
    $("#txtUsername").val('');
    $("#txtDept").val('');
    $("#txtDesc").val('');
    $("#txtGrade").val('');
    $("#txtExtension").val('');
    $("#txtPayroll").val('');
    $('#hidManager').val('');
    $('#hidRole').val('');
    $('#btnCC').val('');
    var dropDownContent1 = '<div style="position: relative; margin: 3px; ">Select Manager</div>';
    $("#btnmanager").jqxDropDownButton('setContent', dropDownContent1);
    var dropDownContent = '<div style="position: relative; margin: 3px; ">Select Role</div>';
    $("#btnRole").jqxDropDownButton('setContent', dropDownContent);

    $("#lbCountry").jqxListBox('uncheckAll');
    $("#grdEmployee").jqxGrid('clearselection');
    $('#btnUpdate').hide();
    $('#btnDel').hide();
    $('#btnAdd').show();
        }
    function OpenCC() {
        FillGridCC();
    $('#btnUpdate').hide();
    $('#btnDel').hide();
    $("#Window").jqxWindow('open');
        }

    function OpenCountry() {
        ClearCountry();
    FillCountry1();
    $('#btnUpdate').hide();
    $('#btnDel').hide();
    $("#Window1").jqxWindow('open');
        }

    function FillCountry1() {

            var deptsource =
    {
        dataType: "json",
    dataFields: [
    {name: 'COUNTRYID', type: 'number' },
    {name: 'COUNTRYNAME', type: 'string' },
    {name: 'CURRENCY', type: 'string' },
    {name: 'COUNTRYCODE', type: 'string' },
    {name: 'EXCHANGERATE', type: 'number' },
    {name: 'SHAYACODE', type: 'string' }
    ],
    id: 'COUNTRYID',
    localdata: Countries
            };

            //            var dataAdapterCnt = new $.jqx.dataAdapter(source);
            // Create a jqxListBox
            //            $("#lbCountry").jqxListBox({source: dataAdapterCnt, displayMember: "COUNTRYNAME", valueMember: "COUNTRYID", multiple: true, checkboxes: true, filterable: true, width: 200, height: 150 });

    var dataAdapterCountries = new $.jqx.dataAdapter(deptsource);
    $("#grdCountries").jqxGrid({
        width: '100%',
    height: '68%',
    source: dataAdapterCountries,
    columnsresize: true,
    theme: 'dark-blue',
    pageSize: 10,
    sortable: true,
    filterable: true,
    showfilterrow: true,
    pageable: true,
    selectionmode: 'singlerow',
    columns: [
    {dataField: 'COUNTRYID', text: 'Country Id' },
    {dataField: 'COUNTRYNAME', text: 'Country Name' },
    {dataField: 'CURRENCY', text: 'Currency' },
    {dataField: 'SHAYACODE', text: 'Code' },
    {dataField: 'EXCHANGERATE', text: 'Exchange Rate' },
    {dataField: 'COUNTRYCODE', text: 'Country Dialling Code' }

    ]
            });
    $("#grdCountries").on('rowselect', function (event) {
        idx = event.args.rowindex;
    var datarow = $("#grdCountries").jqxGrid('getrowdata', idx);

    $('#ID').val(datarow.COUNTRYID);
    $("#txtCountryName").val(datarow.COUNTRYNAME);
    $("#txtCountryCode").val(datarow.SHAYACODE);
    $("#txtCurrency").val(datarow.CURRENCY);
    $("#txtDialCode").val(datarow.COUNTRYCODE);
    $("#txtExchangeRate").val(datarow.EXCHANGERATE);
    $('#btnAddCountry').hide();
    $('#btnUpdateCountry').show();
    $('#btnDelCountry').show();
            });
        }

    // (+) Grid For Select Manager
    function OpenManager() {
        FillManager1();
    $('#btnUpdate').hide();
    $('#btnDel').hide();
    $("#Window2").jqxWindow('open');
        }

    function FillManager1() {
            var sourceEmp =
    {
        dataType: "json",
    dataFields: [
    {name: 'UID', type: 'string' },
    {name: 'NAME', type: 'string' },
    {name: 'EMPLOYEENO', type: 'string' }
    ],
    id: 'UID',
    localdata: employees
            };
    var dataAdapterEmployee = new $.jqx.dataAdapter(sourceEmp);
    $("#grdManager1").jqxGrid({
        width: '100%',
    source: dataAdapterEmployee,
    columnsresize: true,
    theme: 'dark-blue',
    pageSize: 10,
    sortable: true,
    filterable: true,
    showfilterrow: true,
    pageable: true,
    columns: [
    {dataField: 'UID', text: 'UID', hidden: 'true' },
    {dataField: 'NAME', text: 'Name', width: '250' },
    {dataField: 'EMPLOYEENO', text: 'Employee No' }]
            });

    $("#grdManager1").on('rowselect', function (event) {
        idx = event.args.rowindex;
    var datarow = $("#grdManager1").jqxGrid('getrowdata', idx);
                //                var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['NAME'] + ' - ' + row['EMPLOYEENO'] + '</div>';
    $('#txtUid').val(datarow.UID);
    $('#txtManagerName').val(datarow.NAME);
    $('#txtEmployeeNum').val(datarow.EMPLOYEENO);
                //                $("#btnmanager").jqxDropDownButton('setContent', dropDownct);
                //                $('#btnmanager').jqxDropDownButton('close');
            });
        }

    function FillCC() {
            var sourceEmp =
    {
        dataType: "json",
    dataFields: [
    {name: 'UID', type: 'number' },
    {name: 'CCName', type: 'string' },
    {name: 'CCNum', type: 'string' }
    ],
    id: 'UID',
    localdata: CostCenter
            };
    var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
    $("#grdCC").jqxGrid({
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
    {dataField: 'UID', text: 'UID', hidden: 'true' },
    {dataField: 'CCName', text: 'Cost Center Name', width: '250' },
    {dataField: 'CCNum', text: 'Cost Center Number' }]
            });

    $("#grdCC").on('rowselect', function (event) {
                var args = event.args;
    var row = $("#grdCC").jqxGrid('getrowdata', args.rowindex);
    var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['CCName'] + ' - ' + row['CCNum'] + '</div>';
    $('#hidCC').val(row['CCNum']);
    $("#btnCC").jqxDropDownButton('setContent', dropDownct);
    $('#btnCC').jqxDropDownButton('close');

            });

        }

    function FillGridCC() {

            var deptsource =
    {
        localdata: CostCenter,
    datafields:
    [
    {name: 'UID', type: 'number' },
    {name: 'CCName', type: 'string' },
    {name: 'CCNum', type: 'string' }
    ],
    datatype: "json"
            };

    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
    $("#grdCostCenter").jqxGrid({
        width: '100%',
    height: '68%',
    source: dataAdapterCategory,
    columnsresize: true,
    theme: 'dark-blue',
    pageSize: 10,
    sortable: true,
    filterable: true,
    showfilterrow: true,
    pageable: true,

    selectionmode: 'singlerow',
    columns: [
    {dataField: 'UID', text: 'UID' },
    {dataField: 'CCName', text: 'Cost Center' },
    {dataField: 'CCNum', text: 'Cost Center No' }
    ]
            });
    $("#grdCostCenter").on('rowselect', function (event) {
        idx = event.args.rowindex;
    var datarow = $("#grdCostCenter").jqxGrid('getrowdata', idx);

    $('#hidCID').val(datarow.UID);
    $("#txtCCName").val(datarow.CCName);
    $("#txtCCNum").val(datarow.CCNum);

    $('#btnAddCC').hide();
    $('#btnUpdateCC').show();
    $('#btnDelCC').show();
            });
        }

    function AddCC() {
            if ($("#txtCCName").val() == '') {

        $("#txtCCName").notify('Please Cost Center Name', { position: "right" });
    return;
            }
    if ($("#txtCCNum").val() == '') {
        $("#txtCCNum").notify('Please Cost Center No.', { position: "right" });
    return;
            }

    // Check For Dublicate EmployeeNo

    var filtergroup = new $.jqx.filter();
    var filter = filtergroup.createfilter('stringfilter', $("#txtCCNum").val(), 'EQUAL');
    filtergroup.addfilter(1, filter);
    $("#grdCostCenter").jqxGrid('addfilter', 'CCNum', filtergroup);

    $("#grdCostCenter").jqxGrid('applyfilters');
    var Information = $("#grdCostCenter").jqxGrid('getdatainformation');
    var Count = Information.rowscount;
            if (Count > 0) {
        $("#grdCostCenter").jqxGrid('clearfilters');
    alert('Cost Center Number Already Created');
    return;
            }

    $("#grdCostCenter").jqxGrid('clearfilters');
    //////////////////////////////////////

    var Employ = {
        "CCName": $("#txtCCName").val(),
    "CCNum": $("#txtCCNum").val(),

            };
    var obji = {CC: Employ }
    $.ajax({
        type: "POST",

    url: "../../Admin/AddCC",
    data: JSON.stringify(obji),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
        ClearCC();
    alert(result.myMessage);
    GetCC();
                }
            });
        }
    function UpdateCC() {
            if ($("#txtCCName").val() == '') {
        $("#txtCCName").notify('Please Cost Center Name', { position: "right" });
    return;
            }
    if ($("#txtCCNum").val() == '') {
        $("#txtCCNum").notify('Please Cost Center No.', { position: "right" });
    return;
            }

    // Check For Dublicate EmployeeNo

    var filtergroup = new $.jqx.filter();
    var filter = filtergroup.createfilter('stringfilter', $("#txtCCNum").val(), 'EQUAL');
    filtergroup.addfilter(1, filter);
    $("#grdCostCenter").jqxGrid('addfilter', 'CCNum', filtergroup);

    var filtergroup1 = new $.jqx.filter();
    var filter1 = filtergroup1.createfilter('stringfilter', $("#hidCID").val(), 'NOT_EQUAL');
    filtergroup1.addfilter(1, filter1);
    $("#grdCostCenter").jqxGrid('addfilter', 'UID', filtergroup1);

    $("#grdCostCenter").jqxGrid('applyfilters');
    var Information = $("#grdCostCenter").jqxGrid('getdatainformation');
    var Count = Information.rowscount;
            if (Count > 0) {
        $("#grdCostCenter").jqxGrid('clearfilters');
    alert('Cost Center Number Already Created');
    return;
            }

    $("#grdCostCenter").jqxGrid('clearfilters');
    //////////////////////////////////////

    var Employ = {
        "UID": $("#hidCID").val(),
    "CCName": $("#txtCCName").val(),
    "CCNum": $("#txtCCNum").val()
            };
    var obji = {CC: Employ }
    $.ajax({
        type: "POST",

    url: "../../Admin/UpdateCC",
    data: JSON.stringify(obji),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
        ClearCC();
    alert(result.myMessage);
    GetCC();
                }
            });
        }
    function DelCC() {
            var Employ = {
        "UID": $("#hidCID").val()
            };
    var obji = {CC: Employ }
    $.ajax({
        type: "POST",

    url: "../../Admin/DeleteCC",
    data: JSON.stringify(obji),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
        ClearCC();
    alert(result.myMessage);
    GetCC();
                }
            });
        }
    function GetCC() {
        $.ajax({
            type: "GET",
            cache: false,
            url: "../../Admin/GetCC",
            success: function (result) {
                CostCenter = result.dtCC;
                FillGridCC();
            }
        });
        }

    function GetCountry() {
        $.ajax({
            type: "GET",
            cache: false,
            url: "../../Admin/GetCC",
            success: function (result) {
                CostCenter = result.CountryList;
                FillCountry();
                FillCountry1();
            }
        });
        }

    function ClearCC() {

        $("#hidCID").val('');
    $("#txtCCName").val('');
    $("#txtCCNum").val('');
    $("#grdCostCenter").jqxGrid('clearselection');
    $('#btnUpdateCC').hide();
    $('#btnDelCC').hide();
    $('#btnAddCC').show();

        }

    //Add Country

    function AddCountry() {

            if ($("#txtCountryName").val() == '') {
        $("#txtCountryName").notify('Please Enter Country Name', { position: "right" });
    return;
            }

    var Con = {
        "COUNTRYID": $("#ID").val(),
    "COUNTRYNAME": $("#txtCountryName").val(),
    "COUNTRYCODE": $("#txtDialCode").val(),
    "CURRENCY": $("#txtCurrency").val(),
    "EXCHANGERATE": $("#txtExchangeRate").val(),
    "SHAYACODE": $("#txtCountryCode").val(),



            };
    var obji = {Con: Con }
    $.ajax({
        type: "POST",

    url: "../../Admin/AddCountry",
    data: JSON.stringify(obji),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
        alert(result.Message);
    ClearCountry()
    GetCountry();
    GetNewData()
                }
            });
        }

    function UpdateCountry() {

            if ($("#txtCountryName").val() == '') {
        $("#txtCountryName").notify('Please Enter Country Name', { position: "right" });
    return;
            }

    var Con = {
        "COUNTRYID": $("#ID").val(),
    "COUNTRYNAME": $("#txtCountryName").val(),
    "COUNTRYCODE": $("#txtDialCode").val(),
    "CURRENCY": $("#txtCurrency").val(),
    "EXCHANGERATE": $("#txtExchangeRate").val(),
    "SHAYACODE": $("#txtCountryCode").val(),


            };
    var obji = {Con: Con }
    $.ajax({
        type: "POST",

    url: "../../Admin/UpdateCountry",
    data: JSON.stringify(obji),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
        alert(result.Message);
    ClearCountry()
    FillCountry();
    FillCountry1();
    GetNewData()
                }
            });
        }

    function DeleteCountry() {


            var con = {
        "COUNTRYID": $("#ID").val()
            };
    var obji = {con: con }
    $.ajax({
        type: "POST",

    url: "../../Admin/DeleteCountry",
    data: JSON.stringify(obji),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
        alert(result.Message);
    ClearCountry()
    FillCountry();
    FillCountry1();
    GetNewData();
                }
            });
        }

    function AddManager() {

            if ($("#txtManagerName").val() == '') {
        $("#txtManagerName").notify('Please Enter Manager Name', { position: "right" });
    return;
            }



    if ($("#txtEmployeeNum").val() == '') {
        $("#txtEmployeeNum").notify('Please Enter Manager Number', { position: "right" });
    return;
            }

    var man = {
        "UID": $("#UID").val(),
    "NAME": $("#txtManagerName").val(),
    "EMPLOYEENO": $("#txtEmployeeNum").val(),

            };
    var obji = {man: man }
    $.ajax({
        type: "POST",

    url: "../../Admin/AddManager",
    data: JSON.stringify(obji),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
        alert(result.Message);
    Clear();
    FillManager();
    FillManager1();

                }
            });
        }

    function ClearCountry() {
        $("#ID").val('');
    $("#txtCountryName").val('');
    $("#txtCountryCode").val('');
    $("#txtCurrency").val('');
    $("#txtDialCode").val('');
    $("#txtExchangeRate").val('');
    $('#btnUpdateCountry').hide();
    $('#btnDeleteCountry').hide();
    $('#btnAddCountry').show();

        }

    function GetNewData() {
        $.ajax({
            type: "GET",
            cache: false,
            url: "../../Admin/GetNewData",
            success: function (result) {
                Countries = result.CountryList;
                FillCountry();
                FillCountry1();
            }
        });
        }

    function SyncBapi() {
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
    url: "../../SyncBapi/SyncBapiProd",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
        alert(result.Message);
                }
            });
        }

