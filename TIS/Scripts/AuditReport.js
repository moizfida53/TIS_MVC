var Uid;

$(document).ready(function () {
    $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
    $("#cmbStartDate").jqxDateTimeInput({ width: '180px', height: '25px', formatString: 'yyyy-MM-dd HH:mm:ss' });
    $("#cmbEndDate").jqxDateTimeInput({ width: '180px', height: '25px', formatString: 'yyyy-MM-dd HH:mm:ss' });

    $("#cmbEvents").jqxDropDownList({ placeHolder: 'Select Event', selectedIndex: -1, width: '170px', height: '25px' });
    $("#cmbEvents").jqxDropDownList('loadFromSelect', 'SelectEvents');
    $("#SelectEvents").hide();

    $("#cmbUser").jqxDropDownButton({ width: 170, height: 25 });
    var dropDownContent = '<div style="position: relative; margin: 3px;">Select User</div>';
    $("#cmbUser").jqxDropDownButton('setContent', dropDownContent);
    $('#cmbUser').on('open', function () { GetUserName(); });

    $("#cmbStatus").jqxDropDownList({ placeHolder: 'Select Status', selectedIndex: -1, width: '170px', height: '25px' });
    $("#cmbStatus").jqxDropDownList('loadFromSelect', 'SelectStatus');
    $("#SelectStatus").hide();


    $("#Window").jqxWindow({ height: '100%', width: '100%', theme: 'summer', isModal: true, autoOpen: false });

    GetUserName();

});


function Search() {

    var date1 = $("#cmbStartDate").jqxDateTimeInput('getDate');
    var date2 = $("#cmbEndDate").jqxDateTimeInput('getDate');

    var Event = $("#cmbEvents").val();
    var Status = $("#cmbStatus").text();

    if ((new Date(date1) <= new Date(date2))) { }
    else {
        alert('Start Date Cannot be more than End Date');
        return;
    }
    var formattedDate1 = $.jqx.dataFormat.formatdate(date1, 'yyyy-MM-dd HH:mm:ss');
    var formattedDate2 = $.jqx.dataFormat.formatdate(date2, 'yyyy-MM-dd HH:mm:ss');


    var File = {
        "StartDate": formattedDate1,
        "EndDate": formattedDate2,
        "Event": Event,
        "Uid": Uid,
        "Status": Status
    };

    $.ajax({
        type: "GET",
        url: "../../AuditReport/Search",
        contentType: 'application/json',
        data: File,
        success: function (result) {
            var results = result.dtAuditReport;
            FillGrid(results)
        }
    })

}

function FillGrid(result) {

    var deptsource =
    {
        localdata: result,
        datafields:
            [
                { name: 'ID', type: 'number' },
                { name: 'ACTION_NAME', type: 'string' },
                { name: 'RESULT', type: 'string' },
                { name: 'USER', type: 'string' },
                { name: 'USERID', type: 'string' },
                { name: 'DATE1', type: 'string' },
                { name: 'FORM_ID', type: 'number' }
            ],
        datatype: "json"
    };

    var dataAdapterReport = new $.jqx.dataAdapter(deptsource);

    $("#grdReport").jqxGrid({
        width: '100%',
        source: dataAdapterReport,
        columnsresize: true,
        pageSize: 10,
        sortable: true,
        filterable: true,
        showfilterrow: true,
        pageable: true,
        groupable: true,
        theme: 'office',
        selectionmode: 'singlerow',
        columns: [
            { dataField: 'ID', text: 'ID' },
            { dataField: 'ACTION_NAME', text: 'Action' },
            { dataField: 'RESULT', text: 'Result' },
            { dataField: 'USER', text: 'User Name' },
            { dataField: 'USERID', text: 'User Id' },
            { dataField: 'DATE1', text: 'Date' },
            { dataField: 'FORM_ID', text: 'Form' },
            {
                dataField: 'View', text: 'View', width: 100, columntype: 'button', cellsrenderer: function (row, column, value, defaultHtml, columnSettings, rowData) {

                    return "View Details";
                }, buttonclick: function (row) {

                    var getselectedrowindexes = $('#grdReport').jqxGrid('getselectedrowindexes');
                    var row = $("#grdReport").jqxGrid('getrowdata', getselectedrowindexes[0]);

                    var ID = row.ID;

                    var File = {
                        "ID": ID
                    };

                    $.ajax({
                        type: "GET",
                        url: "../../AuditReport/Details",
                        contentType: 'application/json',
                        data: File,
                        success: function (result) {
                            var results = result.dtDetails;
                            FillDeatils(results)
                        }
                    })

                    function FillDeatils(result) {

                        var deptsource =
                        {
                            localdata: result,
                            datafields:
                                [
                                    { name: 'ID', type: 'number' },
                                    { name: 'SNO', type: 'number' },
                                    { name: 'AT_ID', type: 'number' },
                                    { name: 'OLD_VALUE', type: 'string' },
                                    { name: 'NEW_VALUE', type: 'string' },
                                    { name: 'FIELD_NAME', type: 'string' }
                                ],
                            datatype: "json"
                        };

                        var dataAdapterReport = new $.jqx.dataAdapter(deptsource);

                        $("#grdDetails").jqxGrid({
                            width: '100%',
                            source: dataAdapterReport,
                            columnsresize: true,
                            pageSize: 10,
                            sortable: true,
                            filterable: true,
                            showfilterrow: true,
                            pageable: true,
                            groupable: true,
                            theme: 'office',
                            selectionmode: 'singlerow',
                            columns: [
                                { dataField: 'ID', text: 'ID' },
                                { dataField: 'SNO', text: 'SNo' },
                                { dataField: 'AT_ID', text: 'Master ID' },
                                { dataField: 'OLD_VALUE', text: 'Old Value' },
                                { dataField: 'NEW_VALUE', text: 'New Value' },
                                { dataField: 'FIELD_NAME', text: 'Field Name' }
                            ]
                        });
                    }


                    $('#Window').jqxWindow('open');

                }
            }
        ]
    });

}

function GetUserName() {
    $.ajax({
        type: "GET",
        url: "../../AuditReport/getEmp",
        success: function (result) {
            var Log = result.EmpList;
            var sourceEmp =
            {
                dataType: "json",
                dataFields: [
                    { name: 'UserName', type: 'string' },
                    { name: 'EmpName', type: 'string' },
                    { name: 'EmpNo', type: 'string' },
                    { name: 'Uid', type: 'number' }
                ],
                id: 'UserName',
                localdata: Log
            };
            var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
            $("#cmbUserName").jqxGrid({
                width: '100%',
                source: dataAdapterEmp,
                columnsresize: true,
                theme: 'arctic',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                columns: [
                    { dataField: 'UserName', text: 'Username' },
                    { dataField: 'EmpName', text: 'Employee Name' },
                    { dataField: 'EmpNo', text: 'Employee No' },
                    { dataField: 'Uid', text: 'User Id' }
                ]
            });


            $("#cmbUserName").on('rowselect', function (event) {
                var args = event.args;
                var row = $("#cmbUserName").jqxGrid('getrowdata', args.rowindex);
                Uid = row.Uid;
                var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['UserName'] + ' - ' + row['EmpNo'] + '</div>';
                $("#cmbUser").jqxDropDownButton('setContent', dropDownct);
                $('#cmbUser').jqxDropDownButton('close');
            });

        }
    });

}
function Clear() {

    $("#grdReport").hide();
    $("#cmbUser").jqxDropDownButton('setContent', 'Select User');
    $("#cmbEvents").jqxDropDownList({ selectedIndex: -1 });
    $("#cmbStatus").jqxDropDownList({ selectedIndex: -1 });
}