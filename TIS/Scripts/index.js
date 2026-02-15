
    //    $(document).ready(function () {
    //        debugger
    //        //showLoader();
    //        $("#DataRoamingTab").hide();
    //        $("#DataRoamingContent").hide();

    //        $("#grdBillMaster").jqxTooltip({
    //            content: '<b>List of Bills waiting for Identification</b><br /><b>Click on any Bill to view its details</b>',
    //            position: 'mouse',
    //            name: 'movieTooltip'
    //        });
    //        $('#window').jqxWindow({ height: 460, width: 1130, maxWidth: 1200, theme: 'summer' });
    //        $('#window').jqxWindow('close');
    //        if ('@Model.Roleid' == '3' || '@Model.Roleid' == '8' || '@Model.Roleid' == '4') {
    //            $("#btnAdmin").show();
    //            $("#DataRoaming2").show();
    //            $('#chkMyBillsOnly').attr('checked', false);
    //            $("#chkMyBillsOnly").show();
    //            $("#aa").show();
    //            //$("#btnAdmin").jqxButton({ width: '100', template: 'primary' });
    //            $("#btnAdmin").on('click', function () {
    //                OpenAdmin();
    //            });
    //        }
    //        else {
    //            if ('@Model.AdminRoleId' == '3 ' || '@Model.AdminRoleId' == '8' || '@Model.Roleid' == '4') {
    //                $("#btnAdmin").show();
    //                $("#DataRoaming2").show();
    //                //$("#btnAdmin").jqxButton({ width: '100', template: 'primary' });
    //                $("#btnAdmin").on('click', function () {
    //                    OpenAdmin();
    //                });
    //            }
    //            else {
    //                $("#btnAdmin").hide();
    //                $("#DataRoaming2").hide();
    //            }
    //            $('#chkMyBillsOnly').attr('checked', false);
    //            $("#chkMyBillsOnly").hide();
    //            $("#aa").hide();
    //        }

    //        uid = @Model.uid;
    //        IndexLoad();

    //        $('btnUpdate').hide();
    //        $('#dropDownButton').on('open', function () { GetDelegate(); });

    //        if(@Model.Action == 2)
    //        {
    //            bindApprovalBills();
    //            $('#chkMyBillsOnly').attr('checked', false);
    //        }

    //        $("#WindowContact").jqxWindow({ height: '20%', width: '20%', theme: 'dark-blue', isModal: true, autoOpen: false, position: { x: 500, y: 650 } });

    //        GetDataRoaming();
    ////showMyBills();
    //        $("#btnUpdateDataRoaming").hide();
    //        $("#btnDeleteDataRoaming").hide();
    //        debugger;
    //        var selTabIndex = window.sessionStorage['SelectedTabIndex'];
    //        if (selTabIndex > 0) {
    //            window.sessionStorage['SelectedTabIndex'] = 1;
    //            displayTabDetails(selTabIndex);
    //        }
    //        else {
    //            if ($('#selectedTabId').val() > 0) {
    //                displayTabDetails($('#selectedTabId').val());
    //                SelectedtbIndex = $('#selectedTabId').val();
    //            }
    //            else {
    //                SelectedtbIndex = 1;
    //            }
    //        }

    //        //hideLoader();
    //    });

    //    function OpenAdmin() {
    //        window.location.href = "@Url.Action("Index", "Admin")"
    //    }
    //    function GetDelegate() {
    //        $.ajax({
    //            type: "POST",
    //            async: false,
    //            url: "../../Ajax/GetDelegate",
    //            data: { 'UID': uid },
    //            success: function (result) {
    //                var SecData = result.dtSec;
    //                var deptsource =
    //                {
    //                    localdata: SecData,
    //                    datafields:
    //                    [
    //                        { name: 'ID', type: 'number' },
    //                        { name: 'secid', type: 'number' },
    //                        { name: 'SecName', type: 'string' },
    //                        { name: 'managerid', type: 'number' },
    //                        { name: 'ManName', type: 'string' },
    //                        { name: 'app', type: 'bool' },
    //                        { name: 'idt', type: 'bool' },
    //                        { name: 'sdate', type: 'date' },
    //                        { name: 'edate', type: 'date' }
    //                        ],
    //                    datatype: "json"

    //                };

    //                var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
    //                $("#grdDelegate").jqxGrid({
    //                    width: '100%',
    //                    source: dataAdapterCategory,
    //                    columnsresize: true,
    //                    rowsheight: 40,
    //                    columnsheight: 42,
    //                    theme: 'dark-blue',
    //                    pageSize: 10,
    //                    sortable: true,
    //                    filterable: true,
    //                    showfilterrow: true,
    //                    pageable: true,

    //                    selectionmode: 'singlerow',
    //                    columns: [
    //                        { dataField: 'ID', text: 'ID', hidden: true },
    //                        { dataField: 'secid', text: 'secid', hidden: true },
    //                        { dataField: 'SecName', text: 'Delegate To' },
    //                        { dataField: 'managerid', text: 'managerid', hidden: true },
    //                        { dataField: 'ManName', text: 'ManName', hidden: true },
    //                        { dataField: 'idt', text: 'Identify', columntype: 'checkbox' },
    //                        { dataField: 'app', text: 'Approve', columntype: 'checkbox' },
    //                        { dataField: 'sdate', text: 'Start Date', cellsformat: 'dd-MM-yyyy' },
    //                        { dataField: 'edate', text: 'End Date', cellsformat: 'dd-MM-yyyy' },
    //                        {
    //                            datafield: 'Delete', text: 'Delete', columntype: 'button', width: 75, cellsrenderer: function () {
    //                                return "Delete";
    //                            }, buttonclick: function (row) {
    //                                DeleteDelegate(row);
    //                            }
    //                        }
    //                        ]
    //                });
    //                $("#grdDelegate").on('rowselect', function (event) {
    //                    idx = event.args.rowindex;
    //                    var datarow = $("#grdDelegate").jqxGrid('getrowdata', idx);
    //                    $('#hidDID').val(datarow.ID);
    //                    $("#hidManager").val(datarow.secid);
    //                    var SecName = datarow.SecName;
    //                    var dropDownContent1 = '<div style="position: relative; margin: 3px; ">' + SecName + ' To</div>';
    //                    $("#btnmanager").jqxDropDownButton('setContent', dropDownContent1);
    //                    $("#chkIdt").prop('checked', datarow.idt);
    //                    $("#chkApp").prop('checked', datarow.app);
    //                    $('#StartInput ').jqxDateTimeInput('setDate', datarow.sdate);
    //                    $('#EndInput ').jqxDateTimeInput('setDate', datarow.edate);
    //                    $('#btnAdd').hide();
    //                    $('#btnUpdate').show();
    //                });
    //            }
    //        });
    //    }
    //    function UpdateDelegate() {

    //        var date1 = $("#StartInput").jqxDateTimeInput('getDate');
    //        var date2 = $("#EndInput").jqxDateTimeInput('getDate');

    //        if ((new Date(date1).getTime() <= new Date(date2).getTime())) { } else {
    //        //alert('start date cant be more then end date');
    //            $("#StartInput").notify('Start Date cannot be after End Date', { position: "right" });
    //            return;
    //        }


    //        var formattedDate1 = $.jqx.dataFormat.formatdate(date1, 'yyyy-MM-dd');
    //        var formattedDate2 = $.jqx.dataFormat.formatdate(date2, 'yyyy-MM-dd');



    //        var DelG = {
    //            "ID": $('#hidDID').val(),
    //            "secid": $('#hidManager').val(),
    //            "managerid": uid,
    //            "app": $("#chkApp").is(':checked'),
    //            "idt": $("#chkIdt").is(':checked'),
    //            "sdate": formattedDate1,
    //            "edate": formattedDate2
    //        };
    //        var obj = JSON.stringify(DelG);
    //        $.ajax({
    //            type: "GET",
    //            cache: false,
    //            async: false,
    //            url: "../../Ajax/UpdateDelegate",
    //            contentType: 'application/json',
    //            data: DelG,
    //            success: function (result) {
    //            //alert(result.Message);
    //                if (result.Message == 'Sucessfully Updated') {
    //                    $.alert.open('info', 'Success', 'Delegation Updated Successfully');
    //                }
    //                else {
    //                    $.alert.open('error', 'Error', 'Sorry cannot complete transaction, Please contact Administrator');
    //                }
    //                ClearDelegate();
    //                GetDelegate();
    //            }
    //        });
    //    }
    //    function DeleteDelegate(index) {

    //        var row = $("#grdDelegate").jqxGrid('getrowdata', index);

    //        var Delg = {
    //            "ID": row.ID
    //        };
    //        $.ajax({
    //            type: "GET",
    //            cache: false,
    //            async: false,
    //            url: "../../Ajax/DeleteDelegate",
    //            contentType: 'application/json',
    //            data: Delg,
    //            success: function (result) {
    //                ClearDelegate();
    //            //alert(result.Message);
    //                if (result.myMessage == 'succ') {
    //                    $.alert.open('info', 'Success', 'Delegation Successfull');
    //                }
    //                else {
    //                    $.alert.open('error', 'Error', 'Sorry cannot complete transaction, Please contact Administrator');
    //                }
    //                GetDelegate();
    //            }
    //        })
    //    }
    //    function ClearDelegate() {

    //        $('#hidDID').val('');
    //        $("#hidManager").val('');
    //        var dropDownContent1 = '<div style="position: relative; margin: 3px; ">Select Employee</div>';
    //        $("#btnmanager").jqxDropDownButton('setContent', dropDownContent1);
    //        $("#chkIdt").prop('checked', false);
    //        $("#chkApp").prop('checked', false);
    //    //                        $('#StartInput ').jqxDateTimeInput('setDate', datarow.sdate);
    //    //                        $('#EndInput ').jqxDateTimeInput('setDate', datarow.edate);
    //        $("#grdDelegate").jqxGrid('clearselection');
    //        $('#btnAdd').show();
    //        $('#btnUpdate').hide();
    //    }

    //    function Print() {
    //        if ($('#hdnBillID').val() > 0) {
    //            getMyArcBill($('#hdnBillID').val());
    //        }
    //        //var datainformation = $('#grdBillDetails').jqxGrid('getdatainformation');
    //        //var rowscount = datainformation.rowscount;

    //        //for (var i = 0; i < rowscount; i++) {

    //        //    var data = $('#grdBillDetails').jqxGrid('getrowdata', i);

    //        //    if (data.CallType == 0) {
    //        //        CallType = "To Be Identified";
    //        //        data.CallType = CallType;
    //        //    }

    //        //    if (data.CallType == 1) {
    //        //        CallType = "Business";
    //        //        data.CallType = CallType;
    //        //    }

    //        //    if (data.CallType == 2) {
    //        //        CallType = "Personal";
    //        //        data.CallType = CallType;
    //        //    }

    //        //    if (data.CallType == 3) {
    //        //        CallType = "Allowance";
    //        //        data.CallType = CallType;
    //        //    }

    //        //    if (data.CallType == 5) {
    //        //        CallType = "Extra Allowance";
    //        //        data.CallType = CallType;
    //        //    }

    //        //}


    //        //var gridContent = $("#grdBillDetails").jqxGrid('exportdata', 'html');
    //        //var Something = $("#something").html();
    //        //var newWindow = window.open('', '', 'width=900, height=950, scrollbars=1, top=1, left=1'),
    //        //document = newWindow.document.open(),
    //        //pageContent =
    //        //'<!DOCTYPE html>\n' +
    //        //'<html>\n' +
    //        //'<head>\n' +
    //        //'<meta charset="utf-8" />\n' +
    //        //'<title>Bill Details</title>\n' +
    //        //'</head>\n' +
    //        //'<body>\n' + Something + '\n</body>\n' +
    //        //'<body>\n' + gridContent + '\n</body>\n</html>';
    //        //document.write(pageContent);
    //        //document.close();
    //        //newWindow.print();

    //    }

    //    function SaveContact() {
    //        var getselectedrowindexes = $('#grdBillDetails').jqxGrid('getselectedrowindexes');
    //        var row = $("#grdBillDetails").jqxGrid('getrowdata', getselectedrowindexes[0]);
    //        var ContactName = $("#txtContactName").val();

    //        if (ExName != null) {
    //            var value = {
    //                "ExName": ExName,
    //                "Name": ContactName,
    //                "DialledNo": row.DialledNo,
    //                "Uid": row.Auid,
    //            };
    //        }

    //        else {
    //            var value = {
    //                "Name": ContactName,
    //                "DialledNo": row.DialledNo,
    //                "Uid": row.Auid,
    //            };
    //        }
    //        var obji = { value: value }

    //        $.ajax({
    //            type: "POST",
    //            async: false,
    //            url: "../../Admin/SaveContact",
    //            data: JSON.stringify(obji),
    //            contentType: "application/json; charset=utf-8",
    //            dataType: "json",
    //            success: function (result) {

    //                if (result.Message) {
    //                    $.alert.open('info', result.Message);
    //                    getUBillDetails(GBillId);
    //                    $("#WindowContact").jqxWindow('close');
    //                    $("#txtContactName").val("");
    //                }

    //                if (result.MessageError) {
    //                    $.alert.open('error', 'Error', result.MessageError);
    //                    getUBillDetails(GBillId);
    //                    $("#WindowContact").jqxWindow('close');
    //                    $("#txtContactName").val("");
    //                }
    //            }
    //        })

    //    }

    //    function GetDataRoaming() {
    //        $.ajax({
    //            type: "GET",
    //            cache: false,
    //            async: false,
    //            url: "../../Admin/GetDataRoaming",
    //            success: function (result) {
    //                Country = result.dtCountry;
    //                FillDataRoaming(Country);
    //            }
    //        });
    //    }

    //    function FillDataRoaming(Country) {
    //        var deptsource =
    //        {
    //            localdata: Country,
    //            datafields:
    //            [
    //                { name: 'ID', type: 'number' },
    //                { name: 'Country', type: 'string' },
    //                { name: 'Operator', type: 'string' }
    //                ],
    //            datatype: "json"
    //        };

    //        var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
    //        $("#grdDataRoaming").jqxGrid({
    //            width: '80%',
    //            source: dataAdapterCategory,
    //            columnsresize: true,
    //            rowsheight: 40,
    //            columnsheight: 42,
    //            autoheight:true,
    //            rowsheight: 30,
    //            sortable: true,
    //            filterable: true,
    //            showfilterrow: true,
    //            theme: 'dark-blue',
    //            selectionmode: 'singlerow',
    //            columns: [
    //             { dataField: 'ID', text: 'ID', hidden: 'true' },
    //             { dataField: 'Country', text: 'Country', width: '50%' },
    //             { dataField: 'Operator', text: 'Operator', width: '50%' }
    //             ]
    //        });

    //        $("#grdDataRoaming").on('rowselect', function (event) {
    //            idx = event.args.rowindex;
    //            var datarow = $("#grdDataRoaming").jqxGrid('getrowdata', idx);
    //            var ID = datarow.ID;
    //            var Country = datarow.Country;
    //            var Operator = datarow.Operator;

    //            $("#btnAddDataRoaming").hide();
    //            $("#btnUpdateDataRoaming").show();
    //            $("#btnDeleteDataRoaming").show();


    //            $('#hidID').val(ID);
    //            $("#txtCountryName").val(Country);
    //            $("#txtOperator").val(Operator);

    //            $('#btnAddDataRoaming').hide();
    //            $('#btnUpdateDataRoaming').show();
    //            $('#btnDeleteDataRoaming').show();
    //        });
    //    }

    //    function AddDataRoaming() {


    //        if ($("#txtCountryName").val() == '') {

    //            $("#txtCountryName").notify('Please Fill Country', { position: "right" });

    //            return;
    //        }


    //        if ($("#txtOperator").val() == '') {

    //            $("#txtOperator").notify('Please Fill Operator', { position: "right" });

    //            return;
    //        }


    //        var value = {
    //            "Country": $("#txtCountryName").val(),
    //            "Operator": $("#txtOperator").val()
    //        };

    //        var obji = { value: value }
    //        $.ajax({
    //            type: "POST",
    //            async: false,
    //            url: "../../Admin/AddDataRoaming",
    //            data: JSON.stringify(obji),
    //            contentType: "application/json; charset=utf-8",
    //            dataType: "json",
    //            success: function (result) {
    //                ClearDataRoaming();

    //                GetDataRoaming();
    //                if (result.myMessage == 'Success') {
    //                    $.alert.open('info', 'Success', 'Added Successfully');
    //                }
    //                else {
    //                    $.alert.open('error', 'Error', 'Unsuccessfull,Please Try again.');
    //                }
    //            }
    //        });

    //    }
    //    function UpdateDataRoaming() {


    //        if ($("#txtCountryName").val() == '') {

    //            $("#txtCountryName").notify('Please Fill Country', { position: "right" });

    //            return;
    //        }


    //        if ($("#txtOperator").val() == '') {

    //            $("#txtOperator").notify('Please Fill Operator', { position: "right" });

    //            return;
    //        }

    //        var value = {
    //            "ID": $("#hidID").val(),
    //            "Country": $("#txtCountryName").val(),
    //            "Operator": $("#txtOperator").val()
    //        };
    //        var obji = { value: value }
    //        $.ajax({
    //            type: "POST",
    //            async: false,
    //            url: "../../Admin/UpdateDataRoaming",
    //            data: JSON.stringify(obji),
    //            contentType: "application/json; charset=utf-8",
    //            dataType: "json",
    //            success: function (result) {
    //                ClearDataRoaming();

    //                GetDataRoaming();
    //                if (result.myMessage == 'Success') {
    //                    $.alert.open('info', 'Success', 'Updated Successfully');
    //                }
    //                else {
    //                    $.alert.open('error', 'Error', 'Unsuccessfull,Please Try again.');
    //                }
    //            }
    //        });

    //    }

    //    function DeleteDataRoaming() {
    //        var value = {
    //            "ID": $("#hidID").val()
    //        };
    //        var obj = JSON.stringify(value);
    //        $.ajax({
    //            type: "GET",
    //            cache: false,
    //            async: false,
    //            url: "../../Admin/DeleteDataRoaming",
    //            contentType: 'application/json',
    //            data: value,
    //            success: function (result) {
    //                ClearDataRoaming();
    //                GetDataRoaming();
    //                if (result.myMessage == 'Success') {
    //                    $.alert.open('info', 'Success', 'Deleted Successfully');
    //                }
    //                else {
    //                    $.alert.open('error', 'Error', 'Unsuccessfull,Please Try again.');
    //                }
    //            }
    //        });
    //    }
    //    function ClearDataRoaming() {
    //        $("#hidID").val('');
    //        $("#txtCountryName").val('');
    //        $("#txtOperator").val('');
    //        $("#btnAddDataRoaming").show();
    //        $("#btnUpdateDataRoaming").hide();
    //        $("#btnDeleteDataRoaming").hide();
    //    }

    //    //function ProcessBill() {
    //    //    try {
    //    //        // Show loading modal
    //    //        Swal.fire({
    //    //            title: 'Please Wait',
    //    //            html: 'Processing your request...',
    //    //            allowOutsideClick: false,
    //    //            allowEscapeKey: false,
    //    //            showConfirmButton: false,
    //    //            didOpen: () => {
    //    //                Swal.showLoading();
    //    //            }
    //    //        });

    //    //        // Your existing ProcessBill code here
    //    //        // Put your AJAX call or processing logic here

    //    //    } catch (error) {
    //    //        console.error('Error in ProcessBill:', error);
    //    //        Swal.fire({
    //    //            title: 'Error!',
    //    //            text: 'An error occurred: ' + error.message,
    //    //            icon: 'error'
    //    //        });
    //    //    }
    //    //}



$(document).ready(function () {
    //showLoader();
    $("#DataRoamingTab").hide();
    $("#DataRoamingContent").hide();

    $("#grdBillMaster").jqxTooltip({
        content: '<b>List of Bills waiting for Identification</b><br /><b>Click on any Bill to view its details</b>',
        position: 'mouse',
        name: 'movieTooltip'
    });
    $('#window').jqxWindow({ height: 460, width: 1130, maxWidth: 1200, theme: 'summer' });
    $('#window').jqxWindow('close');
    if ('@Model.Roleid' == '3' || '@Model.Roleid' == '8' || '@Model.Roleid' == '4') {
        $("#btnAdmin").show();
        $("#DataRoaming2").show();
        $('#chkMyBillsOnly').attr('checked', false);
        $("#chkMyBillsOnly").show();
        $("#aa").show();
        //$("#btnAdmin").jqxButton({ width: '100', template: 'primary' });
        $("#btnAdmin").on('click', function () {
            OpenAdmin();
        });
    }
    else {
        if ('@Model.AdminRoleId' == '3 ' || '@Model.AdminRoleId' == '8' || '@Model.Roleid' == '4') {
            $("#btnAdmin").show();
            $("#DataRoaming2").show();
            //$("#btnAdmin").jqxButton({ width: '100', template: 'primary' });
            $("#btnAdmin").on('click', function () {
                OpenAdmin();
            });
        }
        else {
            $("#btnAdmin").hide();
            $("#DataRoaming2").hide();
        }
        $('#chkMyBillsOnly').attr('checked', false);
        $("#chkMyBillsOnly").hide();
        $("#aa").hide();
    }

    uid = @Model.uid;
    IndexLoad();

    $('btnUpdate').hide();
    $('#dropDownButton').on('open', function () { GetDelegate(); });

    if (@Model.Action == 2) {
        bindApprovalBills();
        $('#chkMyBillsOnly').attr('checked', false);
    }

    $("#WindowContact").jqxWindow({ height: '20%', width: '20%', theme: 'dark-blue', isModal: true, autoOpen: false, position: { x: 500, y: 650 } });

    GetDataRoaming();
    //showMyBills();
    $("#btnUpdateDataRoaming").hide();
    $("#btnDeleteDataRoaming").hide();
    var selTabIndex = window.sessionStorage['SelectedTabIndex'];
    if (selTabIndex > 0) {
        window.sessionStorage['SelectedTabIndex'] = 1;
        displayTabDetails(selTabIndex);
    }
    else {
        if ($('#selectedTabId').val() > 0) {
            displayTabDetails($('#selectedTabId').val());
            SelectedtbIndex = $('#selectedTabId').val();
        }
        else {
            SelectedtbIndex = 1;
        }
    }

    hideLoader();
});

function OpenAdmin() {
    //window.location.href = "@Url.Action("Index", "Admin")"
    window.location.href = '/Admin/Index';
}
function GetDelegate() {
    $.ajax({
        type: "POST",
        async: false,
        url: "../../Ajax/GetDelegate",
        data: { 'UID': uid },
        success: function (result) {
            var SecData = result.dtSec;
            var deptsource =
            {
                localdata: SecData,
                datafields:
                    [
                        { name: 'ID', type: 'number' },
                        { name: 'secid', type: 'number' },
                        { name: 'SecName', type: 'string' },
                        { name: 'managerid', type: 'number' },
                        { name: 'ManName', type: 'string' },
                        { name: 'app', type: 'bool' },
                        { name: 'idt', type: 'bool' },
                        { name: 'sdate', type: 'date' },
                        { name: 'edate', type: 'date' }
                    ],
                datatype: "json"

            };

            var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
            $("#grdDelegate").jqxGrid({
                width: '100%',
                source: dataAdapterCategory,
                columnsresize: true,
                rowsheight: 40,
                columnsheight: 42,
                theme: 'dark-blue',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,

                selectionmode: 'singlerow',
                columns: [
                    { dataField: 'ID', text: 'ID', hidden: true },
                    { dataField: 'secid', text: 'secid', hidden: true },
                    { dataField: 'SecName', text: 'Delegate To' },
                    { dataField: 'managerid', text: 'managerid', hidden: true },
                    { dataField: 'ManName', text: 'ManName', hidden: true },
                    { dataField: 'idt', text: 'Identify', columntype: 'checkbox' },
                    { dataField: 'app', text: 'Approve', columntype: 'checkbox' },
                    { dataField: 'sdate', text: 'Start Date', cellsformat: 'dd-MM-yyyy' },
                    { dataField: 'edate', text: 'End Date', cellsformat: 'dd-MM-yyyy' },
                    {
                        datafield: 'Delete', text: 'Delete', columntype: 'button', width: 75, cellsrenderer: function () {
                            return "Delete";
                        }, buttonclick: function (row) {
                            DeleteDelegate(row);
                        }
                    }
                ]
            });
            $("#grdDelegate").on('rowselect', function (event) {
                idx = event.args.rowindex;
                var datarow = $("#grdDelegate").jqxGrid('getrowdata', idx);
                $('#hidDID').val(datarow.ID);
                $("#hidManager").val(datarow.secid);
                var SecName = datarow.SecName;
                var dropDownContent1 = '<div style="position: relative; margin: 3px; ">' + SecName + ' To</div>';
                $("#btnmanager").jqxDropDownButton('setContent', dropDownContent1);
                $("#chkIdt").prop('checked', datarow.idt);
                $("#chkApp").prop('checked', datarow.app);
                $('#StartInput ').jqxDateTimeInput('setDate', datarow.sdate);
                $('#EndInput ').jqxDateTimeInput('setDate', datarow.edate);
                $('#btnAdd').hide();
                $('#btnUpdate').show();
            });
        }
    });
}
function UpdateDelegate() {

    var date1 = $("#StartInput").jqxDateTimeInput('getDate');
    var date2 = $("#EndInput").jqxDateTimeInput('getDate');

    if ((new Date(date1).getTime() <= new Date(date2).getTime())) { } else {
        //alert('start date cant be more then end date');
        $("#StartInput").notify('Start Date cannot be after End Date', { position: "right" });
        return;
    }


    var formattedDate1 = $.jqx.dataFormat.formatdate(date1, 'yyyy-MM-dd');
    var formattedDate2 = $.jqx.dataFormat.formatdate(date2, 'yyyy-MM-dd');



    var DelG = {
        "ID": $('#hidDID').val(),
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
        url: "../../Ajax/UpdateDelegate",
        contentType: 'application/json',
        data: DelG,
        success: function (result) {
            //alert(result.Message);
            if (result.Message == 'Sucessfully Updated') {
                $.alert.open('info', 'Success', 'Delegation Updated Successfully');
            }
            else {
                $.alert.open('error', 'Error', 'Sorry cannot complete transaction, Please contact Administrator');
            }
            ClearDelegate();
            GetDelegate();
        }
    });
}
function DeleteDelegate(index) {

    var row = $("#grdDelegate").jqxGrid('getrowdata', index);

    var Delg = {
        "ID": row.ID
    };
    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: "../../Ajax/DeleteDelegate",
        contentType: 'application/json',
        data: Delg,
        success: function (result) {
            ClearDelegate();
            //alert(result.Message);
            if (result.myMessage == 'succ') {
                $.alert.open('info', 'Success', 'Delegation Successfull');
            }
            else {
                $.alert.open('error', 'Error', 'Sorry cannot complete transaction, Please contact Administrator');
            }
            GetDelegate();
        }
    })
}
function ClearDelegate() {

    $('#hidDID').val('');
    $("#hidManager").val('');
    var dropDownContent1 = '<div style="position: relative; margin: 3px; ">Select Employee</div>';
    $("#btnmanager").jqxDropDownButton('setContent', dropDownContent1);
    $("#chkIdt").prop('checked', false);
    $("#chkApp").prop('checked', false);
    //                        $('#StartInput ').jqxDateTimeInput('setDate', datarow.sdate);
    //                        $('#EndInput ').jqxDateTimeInput('setDate', datarow.edate);
    $("#grdDelegate").jqxGrid('clearselection');
    $('#btnAdd').show();
    $('#btnUpdate').hide();
}

function Print() {
    if ($('#hdnBillID').val() > 0) {
        getMyArcBill($('#hdnBillID').val());
    }
    //var datainformation = $('#grdBillDetails').jqxGrid('getdatainformation');
    //var rowscount = datainformation.rowscount;

    //for (var i = 0; i < rowscount; i++) {

    //    var data = $('#grdBillDetails').jqxGrid('getrowdata', i);

    //    if (data.CallType == 0) {
    //        CallType = "To Be Identified";
    //        data.CallType = CallType;
    //    }

    //    if (data.CallType == 1) {
    //        CallType = "Business";
    //        data.CallType = CallType;
    //    }

    //    if (data.CallType == 2) {
    //        CallType = "Personal";
    //        data.CallType = CallType;
    //    }

    //    if (data.CallType == 3) {
    //        CallType = "Allowance";
    //        data.CallType = CallType;
    //    }

    //    if (data.CallType == 5) {
    //        CallType = "Extra Allowance";
    //        data.CallType = CallType;
    //    }

    //}


    //var gridContent = $("#grdBillDetails").jqxGrid('exportdata', 'html');
    //var Something = $("#something").html();
    //var newWindow = window.open('', '', 'width=900, height=950, scrollbars=1, top=1, left=1'),
    //document = newWindow.document.open(),
    //pageContent =
    //'<!DOCTYPE html>\n' +
    //'<html>\n' +
    //'<head>\n' +
    //'<meta charset="utf-8" />\n' +
    //'<title>Bill Details</title>\n' +
    //'</head>\n' +
    //'<body>\n' + Something + '\n</body>\n' +
    //'<body>\n' + gridContent + '\n</body>\n</html>';
    //document.write(pageContent);
    //document.close();
    //newWindow.print();

}

function SaveContact() {
    var getselectedrowindexes = $('#grdBillDetails').jqxGrid('getselectedrowindexes');
    var row = $("#grdBillDetails").jqxGrid('getrowdata', getselectedrowindexes[0]);
    var ContactName = $("#txtContactName").val();

    if (ExName != null) {
        var value = {
            "ExName": ExName,
            "Name": ContactName,
            "DialledNo": row.DialledNo,
            "Uid": row.Auid,
        };
    }

    else {
        var value = {
            "Name": ContactName,
            "DialledNo": row.DialledNo,
            "Uid": row.Auid,
        };
    }
    var obji = { value: value }

    $.ajax({
        type: "POST",
        async: false,
        url: "../../Admin/SaveContact",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {

            if (result.Message) {
                $.alert.open('info', result.Message);
                getUBillDetails(GBillId);
                $("#WindowContact").jqxWindow('close');
                $("#txtContactName").val("");
            }

            if (result.MessageError) {
                $.alert.open('error', 'Error', result.MessageError);
                getUBillDetails(GBillId);
                $("#WindowContact").jqxWindow('close');
                $("#txtContactName").val("");
            }
        }
    })

}

function GetDataRoaming() {
    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: "../../Admin/GetDataRoaming",
        success: function (result) {
            Country = result.dtCountry;
            FillDataRoaming(Country);
        }
    });
}

function FillDataRoaming(Country) {
    var deptsource =
    {
        localdata: Country,
        datafields:
            [
                { name: 'ID', type: 'number' },
                { name: 'Country', type: 'string' },
                { name: 'Operator', type: 'string' }
            ],
        datatype: "json"
    };

    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
    $("#grdDataRoaming").jqxGrid({
        width: '80%',
        source: dataAdapterCategory,
        columnsresize: true,
        rowsheight: 40,
        columnsheight: 42,
        autoheight: true,
        rowsheight: 30,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        theme: 'dark-blue',
        selectionmode: 'singlerow',
        columns: [
            { dataField: 'ID', text: 'ID', hidden: 'true' },
            { dataField: 'Country', text: 'Country', width: '50%' },
            { dataField: 'Operator', text: 'Operator', width: '50%' }
        ]
    });

    $("#grdDataRoaming").on('rowselect', function (event) {
        idx = event.args.rowindex;
        var datarow = $("#grdDataRoaming").jqxGrid('getrowdata', idx);
        var ID = datarow.ID;
        var Country = datarow.Country;
        var Operator = datarow.Operator;

        $("#btnAddDataRoaming").hide();
        $("#btnUpdateDataRoaming").show();
        $("#btnDeleteDataRoaming").show();


        $('#hidID').val(ID);
        $("#txtCountryName").val(Country);
        $("#txtOperator").val(Operator);

        $('#btnAddDataRoaming').hide();
        $('#btnUpdateDataRoaming').show();
        $('#btnDeleteDataRoaming').show();
    });
}

function AddDataRoaming() {


    if ($("#txtCountryName").val() == '') {

        $("#txtCountryName").notify('Please Fill Country', { position: "right" });

        return;
    }


    if ($("#txtOperator").val() == '') {

        $("#txtOperator").notify('Please Fill Operator', { position: "right" });

        return;
    }


    var value = {
        "Country": $("#txtCountryName").val(),
        "Operator": $("#txtOperator").val()
    };

    var obji = { value: value }
    $.ajax({
        type: "POST",
        async: false,
        url: "../../Admin/AddDataRoaming",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            ClearDataRoaming();

            GetDataRoaming();
            if (result.myMessage == 'Success') {
                $.alert.open('info', 'Success', 'Added Successfully');
            }
            else {
                $.alert.open('error', 'Error', 'Unsuccessfull,Please Try again.');
            }
        }
    });

}
function UpdateDataRoaming() {


    if ($("#txtCountryName").val() == '') {

        $("#txtCountryName").notify('Please Fill Country', { position: "right" });

        return;
    }


    if ($("#txtOperator").val() == '') {

        $("#txtOperator").notify('Please Fill Operator', { position: "right" });

        return;
    }

    var value = {
        "ID": $("#hidID").val(),
        "Country": $("#txtCountryName").val(),
        "Operator": $("#txtOperator").val()
    };
    var obji = { value: value }
    $.ajax({
        type: "POST",
        async: false,
        url: "../../Admin/UpdateDataRoaming",
        data: JSON.stringify(obji),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            ClearDataRoaming();

            GetDataRoaming();
            if (result.myMessage == 'Success') {
                $.alert.open('info', 'Success', 'Updated Successfully');
            }
            else {
                $.alert.open('error', 'Error', 'Unsuccessfull,Please Try again.');
            }
        }
    });

}

function DeleteDataRoaming() {
    var value = {
        "ID": $("#hidID").val()
    };
    var obj = JSON.stringify(value);
    $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: "../../Admin/DeleteDataRoaming",
        contentType: 'application/json',
        data: value,
        success: function (result) {
            ClearDataRoaming();
            GetDataRoaming();
            if (result.myMessage == 'Success') {
                $.alert.open('info', 'Success', 'Deleted Successfully');
            }
            else {
                $.alert.open('error', 'Error', 'Unsuccessfull,Please Try again.');
            }
        }
    });
}
function ClearDataRoaming() {
    $("#hidID").val('');
    $("#txtCountryName").val('');
    $("#txtOperator").val('');
    $("#btnAddDataRoaming").show();
    $("#btnUpdateDataRoaming").hide();
    $("#btnDeleteDataRoaming").hide();
}

//function ProcessBill() {
//    try {
//        // Show loading modal
//        Swal.fire({
//            title: 'Please Wait',
//            html: 'Processing your request...',
//            allowOutsideClick: false,
//            allowEscapeKey: false,
//            showConfirmButton: false,
//            didOpen: () => {
//                Swal.showLoading();
//            }
//        });

//        // Your existing ProcessBill code here
//        // Put your AJAX call or processing logic here

//    } catch (error) {
//        console.error('Error in ProcessBill:', error);
//        Swal.fire({
//            title: 'Error!',
//            text: 'An error occurred: ' + error.message,
//            icon: 'error'
//        });
//    }
//}