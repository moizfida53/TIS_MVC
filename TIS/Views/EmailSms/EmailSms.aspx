<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    EmailSms
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <link href="../../css/alert.css" rel="stylesheet" />
    <link href="../../css/theme.css" rel="stylesheet" />
    <script src="../../Scripts/alert.js"></script>
    <link href="../../css/jqx.darkblue.css" rel="stylesheet" />
    <script src="../../Scripts/jqxgrid.grouping.js"></script>
    <script type="text/javascript">

        var Emails = "";
        var MobileNos = "";
        $(document).ready(function () {
            $('#jqxTabs').jqxTabs({ width: '100%', position: 'top' });
            GetGroups();
            $("#ddTemplate").jqxDropDownButton({ width: 170, height: 25 });
            var dropDownContent = '<div style="position: relative; margin: 6px;">Template</div>';
            $("#ddTemplate").jqxDropDownButton('setContent', dropDownContent);
            $('#ddTemplate').on('open', function () { GetTemplate(); });

            $("#Window").jqxWindow({ height: '70%', width: '50%', theme: 'darkblue', isModal: true, autoOpen: false });
            $("#WindowSMS").jqxWindow({ height: '70%', width: '50%', theme: 'darkblue', isModal: true, autoOpen: false });
            $("#ddEmployees").jqxDropDownButton({ width: 170, height: 25 });
            var dropDownContent = '<div style="position: relative; margin: 6px;">Employees</div>';
            $("#ddEmployees").jqxDropDownButton('setContent', dropDownContent);
            //$('#ddEmployees').on('open', function () { GetEmployees(); });

            $("#ddSMSEmployees").jqxDropDownButton({ width: 170, height: 25 });
            var dropDownContent = '<div style="position: relative; margin: 2px;">Employees</div>';
            $("#ddSMSEmployees").jqxDropDownButton('setContent', dropDownContent);
            GetEmployees();
            ClearGroup();
            ClearSMSGroup();
            GetLogEmails();



            $('#jqxTabs').on('selected', function (event) {
                var selectedTab = event.args.item;
                if (selectedTab == 1) {
                    GetSMSGroups();
                    GetLogSMS();
                    $("#ddSMSTemplate").jqxDropDownButton({ width: 170, height: 25 });
                    var dropDownContent = '<div style="position: relative; margin: 3px;">Template</div>';
                    $("#ddSMSTemplate").jqxDropDownButton('setContent', dropDownContent);
                    $('#ddSMSTemplate').on('open', function () { GetSMSTemplate(); });
                }
            });

            $("input:checkbox").on('click', function () {
                var $box = $(this);
                if ($box.is(":checked")) {
                    var group = "input:checkbox[name='" + $box.attr("name") + "']";
                    $(group).prop("checked", false);
                    $box.prop("checked", true);
                } else {
                    $box.prop("checked", false);
                }
            });

            GetLogEmails();

        });

        function GetGroups() {
            $.ajax({
                type: "GET",
                cache: false,
                url: "../../EmailSms/GetGroups",
                success: function (result) {

                    if (result.Message) {
                        alert("Error: Please Try Again");
                    }
                    else {
                        var Groups = result.dtGroups;
                        FillGroups(Groups)
                    }
                }
            });
        }

        function FillGroups(Groups) {
            var Groups =
            {
                datafields:
                    [
                        { name: 'GroupID', type: 'number' },
                        { name: 'GroupName', type: 'string' }
                    ],
                localdata: Groups,
                datatype: "json"
            };
            dataAdapterGroups = new $.jqx.dataAdapter(Groups);

            $("#ddGroups").jqxDropDownList({
                selectedIndex: -1,
                placeHolder: 'Select Group:',
                source: dataAdapterGroups,
                displayMember: "GroupName",
                valueMember: "GroupID",
                checkboxes: true,
                width: 185,
                height: 22,
                dropDownHeight: 76
            });

            $("#ddGroups").on('checkChange', function (event) {
                var item = event.args.item;
                var value = item.value;

                var ChkdItems = $("#ddGroups").jqxDropDownList('getCheckedItems');

                var CheckedValue = "";

                for (i = 0; i < ChkdItems.length; i++) {
                    var ID = ChkdItems[i].value;
                    CheckedValue += ID + ',';
                }


                var ChkItem = {
                    "GroupIDs": CheckedValue.slice(0, -1),
                };
                var obji = { value: ChkItem }
                $.ajax({
                    type: "POST",
                    url: "../../EmailSms/GetEmails",
                    data: JSON.stringify(obji),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        var Email = result.dtEmail;
                        Emails = "";

                        if (Email == undefined)
                            $("#txtEmails").val("");
                        for (i = 0; i < Email.length; i++) {
                            Emails += Email[i].Emails + ',';
                        }
                        $("#txtEmails").val(Emails.slice(0, -1));
                    }
                });
            });

            $("#grdGroups").jqxGrid({
                width: '50%',
                source: dataAdapterGroups,
                columnsresize: true,
                theme: 'dark-blue',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                columns: [
                    { dataField: 'GroupID', text: 'ID', hidden: true },
                    { dataField: 'GroupName', text: 'GroupName', width: '100%' }
                ]
            });

            $("#grdGroups").on('rowselect', function (event) {
                var args = event.args;
                var row = $("#grdGroups").jqxGrid('getrowdata', args.rowindex);

                $("#txtGroupName").val(row.GroupName);
                $("#hidGroupID").val(row.GroupID);

                $("#btnAddGroup").hide();
                $("#btnUpdateGroup").show();
                $("#btnDeleteGroup").show();

                var value = {
                    "GroupID": row.GroupID
                };
                $.ajax({
                    type: "GET",
                    url: "../../EmailSms/GetGroupDetails",
                    contentType: 'application/json',
                    data: value,
                    success: function (result) {
                        var UIDs = result.dtUIDs;
                        $.each(UIDs, function (key, val) {
                            var Index = $('#grdEmployees').jqxGrid('getrowboundindexbyid', val.UID);
                            $('#grdEmployees').jqxGrid({ selectedrowindex: Index });
                        });

                    }
                })

            });


        }

        function Send() {

            var CheckedGroupList = "";

            var CheckedItem = $("#ddGroups").jqxDropDownList('getCheckedItems');

            for (i = 0; i < CheckedItem.length; i++) {
                var GroupID = CheckedItem[i].value;
                CheckedGroupList += GroupID + ',';
            }


            var value = {
                "CheckedGroupList": CheckedGroupList.slice(0, -1),
                "Subject": $("#txtSubject").val(),
                "TemplateID": $("#hidTemplateID").val(),
                "Emails": $("#txtEmails").val()
            };
            var obji = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSms/SendEmail",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    var Message = result.Message;
                    if (Message == "Success") {
                        alert("Email Sent Successfully");
                    }
                    else {
                        alert("Error, Please Try Again");
                    }
                    GetLogEmails();
                }
            });
        }

        function GetTemplate() {
            $.ajax({
                type: "GET",

                url: "../../EmailSms/GetTemplate",
                success: function (result) {
                    var Template = result.dtTemplate;
                    var SourceTemplate =
                    {
                        dataType: "json",
                        dataFields: [
                            { name: 'TemplateId', type: 'int' },
                            { name: 'TemplateName', type: 'string' },
                            { name: 'Subject', type: 'string' },
                            { name: 'TemplateText', type: 'string' }
                        ],
                        localdata: Template
                    };
                    var dataAdapter = new $.jqx.dataAdapter(SourceTemplate);
                    $("#grdTemplate").jqxGrid({
                        width: '50%',
                        source: dataAdapter,
                        columnsresize: true,
                        theme: 'arctic',
                        pageSize: 10,
                        sortable: true,
                        filterable: true,
                        showfilterrow: true,
                        pageable: true,
                        columns: [
                            { dataField: 'TemplateId', text: 'ID', hidden: true },
                            { dataField: 'TemplateName', text: 'Template', width: '20%' },
                            { dataField: 'Subject', text: 'Subject', width: '20%' },
                            { dataField: 'TemplateText', text: 'Text', width: '60%' },
                            {
                                text: 'Delete', datafield: 'Delete', columntype: 'button', width: 75, cellsrenderer: function () {
                                    return "Delete";
                                }, buttonclick: function (row) {
                                    row = $("#grdTemplate").jqxGrid('getrowdata', row);
                                    DeleteEmailTemplate(row.TemplateId);
                                }
                            },
                        ]
                    });

                    $("#grdTemplate").on('rowselect', function (event) {
                        var args = event.args;
                        var row = $("#grdTemplate").jqxGrid('getrowdata', args.rowindex);
                        $("#hidTemplateID").val(row.TemplateId);
                        $("#txtTemplate").val(row.TemplateText);
                        $("#txtNewTemplateName").val(row.TemplateName);
                        $("#txtSubject").val(row.Subject);
                        Close();
                    });
                }
            });
        }


        function Close() {
            $("#ddTemplate").jqxDropDownList('close');
        }


        function Create() {

            if ($("#txtNewTemplateName").val() == '') {
                $("#txtNewTemplateName").notify('Please Give Template Name', { position: "right" });
                return;
            }
            if ($("#txtSubject").val() == '') {
                $("#txtSubject").notify('Please Give a Subject', { position: "right" });
                return;
            }

            if ($("#txtTemplate").val() == '') {
                $("#txtTemplate").notify('Please Insert Text', { position: "right" });
                return;
            }

            var value = {
                "TemplateName": $("#txtNewTemplateName").val(),
                "Subject": $("#txtSubject").val(),
                "TemplateText": $("#txtTemplate").val()
            };
            var obji = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSms/CreateTemplate",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {

                }
            });
        }

        function Save() {
            var value = {
                "TemplateName": $("#txtNewTemplateName").val(),
                "Subject": $("#txtSubject").val(),
                "TemplateText": $("#txtTemplate").val(),
                "TemplateId": $("#hidTemplateID").val()
            };
            var obji = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSms/SaveTemplate",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    var Message = result.Message;
                    if (Message == "Added Successfuly") {
                        alert("Added Successfuly");
                    }
                    else {
                        alert("Error, Please Try Again");
                    }
                }
            });
        }

        function New() {
            $("#tdNew").hide();
            $("#tdName").show()
        }

        function AddEmail() {
            var Email = $("#txtEmailTo").val();
            Emails = $("#txtEmails").val();
            Emails += ',' + Email;
            //$("#txtEmails").val(Emails.slice(0, -1));
            Emails = Emails.replace(/^,/, '');
            $("#txtEmails").val(Emails);
        }

        function OpenGroupWindow() {
            $("#Window").jqxWindow('open');
        }

        function GetEmployees() {
            $.ajax({
                type: "GET",
                url: "../../EmailSms/GetEmployees",
                success: function (result) {
                    var Log = result.dtEmpList;
                    var Log2 = result.dtEmpList1;
                    var sourceEmp =
                    {
                        dataType: "json",
                        dataFields: [
                            { name: 'UID', type: 'number' },
                            { name: 'USERNAME', type: 'string' },
                            { name: 'EMAIL', type: 'string' },
                            { name: 'ORG', type: 'string' }
                        ],
                        id: 'UID',
                        localdata: Log
                    };
                    var dataAdapterEmp = new $.jqx.dataAdapter(sourceEmp);
                    $("#grdEmployees").jqxGrid({
                        width: '100%',
                        source: dataAdapterEmp,
                        columnsresize: true,
                        theme: 'arctic',
                        pageSize: 10,
                        sortable: true,
                        filterable: true,
                        showfilterrow: true,
                        pageable: true,
                        selectionmode: 'checkbox',
                        altrows: true,
                        columns: [
                            { dataField: 'UID', text: 'UID', hidden: true },
                            { dataField: 'USERNAME', text: 'Employee Name', width: '27%' },
                            { dataField: 'EMAIL', text: 'Email', width: '40%' },
                            { dataField: 'ORG', text: 'Department', width: '27%' },
                        ]
                    });

                    $("#grdEmployees").on('rowselect', function (event) {
                        var args = event.args;
                        var row = $("#grdEmployees").jqxGrid('getrowdata', args.rowindex);

                    });



                    var Log2 = result.dtEmpList1;
                    var sourceEmp2 =
                    {
                        dataType: "json",
                        dataFields: [
                            { name: 'UID', type: 'number' },
                            { name: 'USERNAME', type: 'string' },
                            { name: 'SUB_NO', type: 'string' },
                            { name: 'ORG', type: 'string' }
                        ],
                        localdata: Log2
                    };
                    var dataAdapterEmp2 = new $.jqx.dataAdapter(sourceEmp2);
                    $("#grdSMSEmployees").jqxGrid({
                        width: '100%',
                        source: dataAdapterEmp2,
                        columnsresize: true,
                        theme: 'arctic',
                        pageable: true,
                        pageSize: 10,
                        sortable: true,
                        filterable: true,
                        showfilterrow: true,
                        selectionmode: 'checkbox',
                        altrows: true,
                        columns: [
                            { dataField: 'UID', text: 'UID', hidden: true },
                            { dataField: 'USERNAME', text: 'Employee Name', width: '27%' },
                            { dataField: 'SUB_NO', text: 'Mobile No.', width: '40%' },
                            { dataField: 'ORG', text: 'Department', width: '27%' },
                        ]
                    });

                    $("#grdSMSEmployees").on('rowselect', function (event) {
                        var args = event.args;
                        var row = $("#grdSMSEmployees").jqxGrid('getrowdata', args.rowindex);

                    });


                }
            });
        }


        function AddGroup() {

            var Emp = [];
            var Indexes = $('#grdEmployees').jqxGrid('getselectedrowindexes');
            for (var i = 0; i < Indexes.length; i++) {
                var Data = $('#grdEmployees').jqxGrid('getrowdata', Indexes[i]);
                var UID = Data.UID;
                Emp.push(UID);
            }

            var value = {
                "Emp": Emp,
                "GroupName": $('#txtGroupName').val()
            };

            var obj = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSms/AddUpdateGroup",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(obj),
                dataType: "json",
                success: function (result) {
                    ClearGroup();
                    GetGroups();
                }
            });

        }

        function ClearGroup() {
            $("#txtGroupName").val('');
            $("#btnAddGroup").show();
            $("#btnUpdateGroup").hide();
            $("#btnDeleteGroup").hide();
            $("#grdEmployees").jqxGrid('clearselection');
            $("#grdGroups").jqxGrid('clearselection');
        }


        function UpdateGroup() {

            var Emp = [];
            var Indexes = $('#grdEmployees').jqxGrid('getselectedrowindexes');
            for (var i = 0; i < Indexes.length; i++) {
                var Data = $('#grdEmployees').jqxGrid('getrowdata', Indexes[i]);
                var UID = Data.UID;
                Emp.push(UID);
            }

            var value = {
                "Emp": Emp,
                "GroupName": $('#txtGroupName').val(),
                "GroupID": $("#hidGroupID").val(),
                "IsUpdated": 1
            };

            var obj = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSms/AddUpdateGroup",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(obj),
                dataType: "json",
                success: function (result) {
                    ClearGroup();
                    GetGroups();
                    $("#btnAddGroup").show();
                    $("#btnUpdateGroup").hide();
                    $("#btnDeleteGroup").hide();
                }
            });

        }


        function DeleteGroup() {
            $("#Window").jqxWindow('close');
            $.alert.open('confirm', 'Are You Sure you want to Delete?', function (button) {
                if (button == 'yes') {
                    var value = {
                        "GroupID": $('#hidGroupID').val(),
                    };

                    var obj = { value: value }
                    $.ajax({
                        type: "POST",
                        url: "../../EmailSms/DeleteGroup",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(obj),
                        dataType: "json",
                        success: function (result) {
                            var Message = result.Message;
                            if (Message == "Deleted Successfuly") {
                                alert("Deleted Successfuly");
                            }
                            else {
                                alert("Error, Please Try Again");
                            }

                            ClearGroup();
                            GetGroups();
                            $("#btnAddGroup").show();
                            $("#btnUpdateGroup").hide();
                            $("#btnDeleteGroup").hide();
                            $("#Window").jqxWindow('open');
                        }
                    });
                }
                else {
                    $("#Window").jqxWindow('open');
                }
            });
        }


        function GetSMSGroups() {
            $("#btnSMSCreate").show();
            $("#btnSMSSave").hide();
            $.ajax({
                type: "GET",
                cache: false,
                url: "../../EmailSms/GetSMSGroups",
                success: function (result) {

                    if (result.Message) {
                        alert("Error: Please Try Again");
                    }
                    else {
                        var SMSGroups = result.dtSMSGroups;
                        FillSMSGroups(SMSGroups)
                    }
                }
            });
        }

        function FillSMSGroups(SMSGroups) {
            var SMSGroups =
            {
                datafields:
                    [
                        { name: 'GroupID', type: 'number' },
                        { name: 'GroupName', type: 'string' }
                    ],
                localdata: SMSGroups,
                datatype: "json"
            };
            dataAdapterSMSGroups = new $.jqx.dataAdapter(SMSGroups);

            $("#ddSMSGroups").jqxDropDownList({
                selectedIndex: -1,
                placeHolder: 'Select Group:',
                source: dataAdapterSMSGroups,
                displayMember: "GroupName",
                valueMember: "GroupID",
                checkboxes: true,
                width: 185,
                height: 30,
                dropDownHeight: 76
            });

            $("#ddSMSGroups").on('checkChange', function (event) {
                var item = event.args.item;
                var value = item.value;

                var ChkdItems = $("#ddSMSGroups").jqxDropDownList('getCheckedItems');

                var CheckedValue = "";

                for (i = 0; i < ChkdItems.length; i++) {
                    var ID = ChkdItems[i].value;
                    CheckedValue += ID + ',';
                }


                var ChkItem = {
                    "GroupIDs": CheckedValue.slice(0, -1),
                };
                var obji = { value: ChkItem }
                $.ajax({
                    type: "POST",
                    url: "../../EmailSms/GetMobileNo",
                    data: JSON.stringify(obji),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        var Mobile = result.dtMobile;
                        MobileNos = "";

                        if (Mobile == undefined)
                            $("#txtMobileNos").val("");
                        for (i = 0; i < Mobile.length; i++) {
                            MobileNos += Mobile[i].MobileNo + ',';
                        }
                        $("#txtMobileNos").val(MobileNos.slice(0, -1));
                    }
                });
            });

            $("#grdSMSGroups").jqxGrid({
                width: '50%',
                source: dataAdapterSMSGroups,
                columnsresize: true,
                theme: 'dark-blue',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                columns: [
                    { dataField: 'GroupID', text: 'ID', hidden: true },
                    { dataField: 'GroupName', text: 'GroupName', width: '100%' }
                ]
            });

            $("#grdSMSGroups").on('rowselect', function (event) {
                var args = event.args;
                var row = $("#grdSMSGroups").jqxGrid('getrowdata', args.rowindex);

                $("#txtSMSGroupName").val(row.GroupName);
                $("#hidSMSGroupID").val(row.GroupID);

                $("#btnAddSMSGroup").hide();
                $("#btnUpdateSMSGroup").show();
                $("#btnDeleteSMSGroup").show();

                var value = {
                    "GroupID": row.GroupID
                };
                $.ajax({
                    type: "GET",
                    url: "../../EmailSms/GetSMSGroupDetails",
                    contentType: 'application/json',
                    data: value,
                    success: function (result) {
                        var SUB_NOs = result.dtSUB_NOs;
                        $.each(SUB_NOs, function (key, val) {
                            var Index = $('#grdSMSEmployees').jqxGrid('getrowboundindexbyid', val.SUB_NO);
                            $('#grdSMSEmployees').jqxGrid({ selectedrowindex: Index });
                        });
                    }
                })
            });
        }

        function GetSMSTemplate() {

            $.ajax({
                type: "GET",
                url: "../../EmailSms/GetSMSTemplate",
                success: function (result) {
                    var Template = result.dtTemplate;
                    var SourceTemplate =
                    {
                        dataType: "json",
                        dataFields: [
                            { name: 'SMSTemplateId', type: 'int' },
                            { name: 'SMSTemplateName', type: 'string' },
                            //{ name: 'CountryID', type: 'string' },
                            { name: 'Message', type: 'string' },
                            { name: 'Language', type: 'number' }
                        ],
                        localdata: Template
                    };
                    var dataAdapter = new $.jqx.dataAdapter(SourceTemplate);
                    $("#grdSMSTemplate").jqxGrid({
                        width: '50%',
                        source: dataAdapter,
                        columnsresize: true,
                        theme: 'arctic',
                        pageSize: 10,
                        sortable: true,
                        filterable: true,
                        showfilterrow: true,
                        pageable: true,
                        columns: [
                            { dataField: 'SMSTemplateId', text: 'ID', hidden: true },
                            { dataField: 'SMSTemplateName', text: 'Template', width: '20%' },
                            //{ dataField: 'Subject', text: 'Subject', width: '20%' },
                            { dataField: 'Message', text: 'Text', width: '60%' },
                            {
                                text: 'Delete', datafield: 'Delete', columntype: 'button', width: 75, cellsrenderer: function () {
                                    return "Delete";
                                }, buttonclick: function (row) {
                                    row = $("#grdSMSTemplate").jqxGrid('getrowdata', row);
                                    DeleteSMSTemplate(row.SMSTemplateId);
                                }
                            },
                            { dataField: 'Language', text: 'Language', hidden: true },
                        ]
                    });

                    $("#grdSMSTemplate").on('rowselect', function (event) {
                        $("#btnSMSCreate").hide();
                        var args = event.args;
                        //var row = $("#grdTemplate").jqxGrid('getrowdata', args.rowindex);
                        var row = args.row;
                        $("#hidSMSTemplateID").val(row.SMSTemplateId);
                        $("#txtSMSTemplate").val(row.Message);
                        $("#txtNewSMSTemplateName").val(row.SMSTemplateName);
                        if (row.Language == 1) {
                            $("#chkEnglish").prop('checked', true);
                            $('#txtSMSTemplate').attr('disabled', false).focus();
                            ChkedValue = 1;
                        }
                        $("#btnSMSSave").show('slow');

                        if (row.Language == 2) {
                            $("#chkArabic").prop('checked', true);
                            $('#txtSMSTemplate').attr('disabled', false).focus();
                            ChkedValue = 2;
                        }
                        var dropDownct = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + row['SMSTemplateName'] + '</div>';
                        $("#ddSMSTemplate").jqxDropDownButton('setContent', dropDownct);
                        $('#ddSMSTemplate').jqxDropDownButton('close');
                        //Close();
                    });
                }
            });
        }

        function SendSMS() {

            if ($("#txtMobileNos").val() == '') {
                $("#txtMobileNos").notify('Please Add/Select Atleast One Mobile No.', { position: "right" });
                return;
            }

            var value = {
                "TemplateID": $("#hidSMSTemplateID").val(),
                "MobileNos": $("#txtMobileNos").val(),
                "SMS": $("#txtSMSTemplate").val(),
                "Language": ChkedValue
            };
            var obji = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSms/SendSMS",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    var Message = result.Message;
                    if (Message == "Success") {
                        alert("SMS Sent Successfuly");
                    }
                    else {
                        alert("SMS Failed, Please Try Again.")
                    }
                    GetLogSMS();
                    ClearSMS();
                }
            });
        }

        function NewSMS() {
            $("#btnSMSCreate").show('slow');
            $("#tdSMSNew").hide();
            $("#tdSMSName").show();
        }

        function SMSCreate() {

            if ($("#txtNewSMSTemplateName").val() == '') {
                $("#txtNewSMSTemplateName").notify('Please Give Template Name', { position: "right" });
                return;
            }
            if ($("#txtSMSTemplate").val() == '') {
                $("#txtSMSTemplate").notify('Please Give a Subject', { position: "right" });
                return;
            }

            var value = {
                "SMSTemplateName": $("#txtNewSMSTemplateName").val(),
                "Message": $("#txtSMSTemplate").val(),
                "Language": ChkedValue,
            };
            var obji = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSms/CreateSMSTemplate",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    $.alert.open('info', 'Success', 'SMS Template Created successfully');
                    GetSMSTemplate();
                    ClearSMS();
                }
            });
        }

        function SMSSave() {
            var value = {
                "SMSTemplateName": $("#txtNewSMSTemplateName").val(),
                "Message": $("#txtSMSTemplate").val(),
                "SMSTemplateId": $("#hidSMSTemplateID").val(),
                "Language": ChkedValue,
            };
            var obji = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSms/SaveSMSTemplate",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    $.alert.open('info', 'Success', 'SMS Template Saved successfully');
                    ClearSMS();
                }
            });
        }

        function OpenGroupSMSWindow() {
            $("#WindowSMS").jqxWindow('open');
        }


        function ClearSMSGroup() {
            $("#txtSMSGroupName").val('');
            $("#btnUpdateSMSGroup").hide();
            $("#btnDeleteSMSGroup").hide();
            $("#grdSMSEmployees").jqxGrid('clearselection');
            $("#grdSMSGroups").jqxGrid('clearselection');
        }


        function AddSMSGroup() {

            var SUB_NOs = [];
            var Indexes = $('#grdSMSEmployees').jqxGrid('getselectedrowindexes');
            for (var i = 0; i < Indexes.length; i++) {
                var Data = $('#grdSMSEmployees').jqxGrid('getrowdata', Indexes[i]);
                var SUB_NO = Data.SUB_NO;
                SUB_NO.replace('+', '');
                SUB_NOs.push(SUB_NO);
            }

            var value = {
                "SUB_NOs": SUB_NOs,
                "GroupName": $('#txtSMSGroupName').val()
            };

            var obj = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSms/SMSAddUpdateGroup",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(obj),
                dataType: "json",
                success: function (result) {
                    ClearSMSGroup();
                    GetSMSGroups();
                }
            });

        }


        function UpdateSMSGroup() {

            var SUB_NOs = [];
            var Indexes = $('#grdSMSEmployees').jqxGrid('getselectedrowindexes');
            for (var i = 1; i < Indexes.length; i++) {
                var Data = $('#grdSMSEmployees').jqxGrid('getrowdata', Indexes[i]);
                var SUB_NO = Data.SUB_NO;
                SUB_NO.replace('+', '');
                SUB_NOs.push(SUB_NO);
            }

            var value = {
                "SUB_NOs": SUB_NOs,
                "GroupName": $('#txtSMSGroupName').val(),
                "GroupID": $('#hidSMSGroupID').val(),
                "IsUpdated": 1
            };

            var obj = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSms/SMSAddUpdateGroup",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(obj),
                dataType: "json",
                success: function (result) {
                    var Message = result.Message;
                    if (Message == "Success") {
                        alert("Updated SuccessFully");
                    }
                    else {
                        alert("Error, Please Try Again");
                    }
                    ClearGroup();
                    GetGroups();
                    $("#btnAddSMSGroup").show();
                    $("#btnUpdateSMSGroup").hide();
                    $("#btnDeleteSMSGroup").hide();
                }
            });

        }


        function DeleteSMSGroup() {
            $("#WindowSMS").jqxWindow('close');
            $.alert.open('confirm', 'Are You Sure you want to Delete?', function (button) {
                if (button == 'yes') {
                    var value = {
                        "GroupID": $('#hidSMSGroupID').val(),
                    };

                    var obj = { value: value }
                    $.ajax({
                        type: "POST",
                        url: "../../EmailSms/DeleteSMSGroup",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(obj),
                        dataType: "json",
                        success: function (result) {
                            var Message = result.Message;
                            if (Message == "Deleted Successfuly") {
                                alert("Deleted Successfuly");
                            }
                            else {
                                alert("Error, Please Try Again");
                            }

                            ClearSMSGroup();
                            GetSMSGroups();
                            $("#btnAddSMSGroup").show();
                            $("#btnUpdateSMSGroup").hide();
                            $("#btnDeleteSMSGroup").hide();
                            $("#WindowSMS").jqxWindow('open');
                        }
                    });
                }
                else {
                    $("#WindowSMS").jqxWindow('open');
                }
            });
        }

        var ChkedValue;
        function LanguageChk(value) {
            ChkedValue = value;
            var Length = "";
            if (value == 1) {
                $("#TotalLength").html('160');
                Length = '160';
            }
            if (value == 2) {
                $("#TotalLength").html('70');
                Length = '70';
            }

            $("#txtSMSTemplate").keyup(function () {
                $("#Length").text("Characters left: " + (Length - $(this).val().length));
            });

            $('#txtSMSTemplate').attr('disabled', false).focus();
        }

        function GetLogEmails() {
            $.ajax({
                type: "GET",
                cache: false,
                url: "../../EmailSMS/GetLogEmails",
                success: function (result) {
                    var Email = result.dtSendEmail;
                    FillEmail(Email);
                }
            });
        }

        function FillEmail(Email) {
            var Email =
            {
                dataType: "json",
                dataFields: [
                    { name: 'Id', type: 'number' },
                    { name: 'TemplateId', type: 'number' },
                    { name: 'TemplateName', type: 'string' },
                    { name: 'Subject', type: 'string' },
                    { name: 'EmailText', type: 'string' },
                    { name: 'EmailFrom', type: 'string' },
                    { name: 'EmailTo', type: 'string' },
                    { name: 'IsSent', type: 'number' },
                    { name: 'senton', type: 'string' },
                ],
                id: 'Id',
                localdata: Email
            };
            var dataAdapterEmail = new $.jqx.dataAdapter(Email);
            $("#grdSendEmail").jqxGrid({
                width: '100%',
                source: dataAdapterEmail,
                columnsresize: true,
                theme: 'dark-blue',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                editable: true,
                selectionmode: 'checkbox',
                columns: [
                    { dataField: 'Id', text: 'Id', hidden: 'true' },
                    { dataField: 'TemplateId', text: 'Temp. Id', width: '80px', editable: false, hidden: 'true' },
                    { dataField: 'TemplateName', text: 'Template', editable: false },
                    { dataField: 'Subject', text: 'Subject', editable: false },
                    { dataField: 'EmailText', text: 'Email Text' },
                    { dataField: 'EmailFrom', text: 'Email From', editable: false },
                    { dataField: 'EmailTo', text: 'Email To' },
                    { dataField: 'IsSent', text: 'Sent', editable: false },
                    { dataField: 'senton', text: 'Sent On', editable: false, hidden: 'true' }
                ]
            });

        }


        function SendEmail() {

            var EmailID = [];
            var Indexes = $('#grdSendEmail').jqxGrid('getselectedrowindexes');
            for (var i = 0; i < Indexes.length; i++) {
                var RowData = $('#grdSendEmail').jqxGrid('getrowdata', Indexes[i]);
                var Id = RowData.Id;
                EmailID.push(Id);
            }

            var value = {
                "EmailID": EmailID
            };
            var obji = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSMS/Send",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    GetLogEmails();
                    if (result.Message == 'Email Sent') {
                        $.alert.open('info', 'Success', 'Email Sent Successfully');
                        $('#grdSendEmail').jqxGrid('clearselection');
                    }
                    else {
                        $.alert.open('error', 'Error', 'Email Sending Fail...');
                    }
                    ClearSMS();
                }
            });


        }


        function DeleteEmail() {

            var EmailID = [];
            var Indexes = $('#grdSendEmail').jqxGrid('getselectedrowindexes');
            for (var i = 0; i < Indexes.length; i++) {
                var RowData = $('#grdSendEmail').jqxGrid('getrowdata', Indexes[i]);
                var Id = RowData.Id;
                EmailID.push(Id);
            }

            var value = {
                "EmailID": EmailID
            };
            var obji = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSMS/DeleteEmail",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {

                    GetLogEmails();
                    if (result.Message == 'Deleted') {
                        $.alert.open('info', 'Success', 'Email Deleted Successfully');
                    }
                    else {
                        $.alert.open('error', 'Error', 'Cannot Delete, Please Try Again.');
                    }
                }
            });


        }

        function GetLogSMS() {
            $.ajax({
                type: "GET",
                cache: false,
                url: "../../EmailSMS/GetLogSMS",
                success: function (result) {
                    var SMS = result.dtSendSMS;
                    var SMSBalance = result.SMSBalance;
                    $("#lblBalance").html(SMSBalance);
                    FillSMS(SMS);
                }
            });
        }

        function FillSMS(SMS) {
            var SMS =
            {
                dataType: "json",
                dataFields: [
                    { name: 'ID', type: 'number' },
                    { name: 'SMSTemplateId', type: 'number' },
                    { name: 'SMSTemplateName', type: 'string' },
                    { name: 'SMSTo', type: 'string' },
                    { name: 'Message', type: 'string' }
                ],
                id: 'ID',
                localdata: SMS
            };
            var dataAdapterSMS = new $.jqx.dataAdapter(SMS);
            $("#grdSendSMS").jqxGrid({
                width: '100%',
                source: dataAdapterSMS,
                columnsresize: true,
                theme: 'dark-blue',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                editable: true,
                selectionmode: 'checkbox',
                columns: [
                    { dataField: 'ID', text: 'Id', hidden: 'true' },
                    { dataField: 'SMSTemplateId', text: 'Temp. Id', width: '80px', editable: false, hidden: 'true' },
                    { dataField: 'SMSTemplateName', text: 'Template', editable: false },
                    { dataField: 'SMSTo', text: 'Mobile', editable: false },
                    { dataField: 'Message', text: 'Message' }
                ]
            });

        }


        function SendSMS2() {

            var SMSID = [];
            var Indexes = $('#grdSendSMS').jqxGrid('getselectedrowindexes');
            for (var i = 0; i < Indexes.length; i++) {
                var RowData = $('#grdSendSMS').jqxGrid('getrowdata', Indexes[i]);
                var ID = RowData.ID;
                SMSID.push(ID);
            }

            var value = {
                "SMSID": SMSID
            };
            var obji = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSMS/SendSMS2",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    GetLogSMS();
                    if (result.Message == 'Success') {
                        $.alert.open('info', 'Success', 'SMS Sent Successfully');
                        $('#grdSendSMS').jqxGrid('clearselection');
                    }
                    else {
                        $.alert.open('error', 'Error', 'SMS Sending Fail...');
                    }

                }
            });


        }

        function DeleteSMS() {

            var SMSID = [];
            var Indexes = $('#grdSendSMS').jqxGrid('getselectedrowindexes');
            for (var i = 0; i < Indexes.length; i++) {
                var RowData = $('#grdSendSMS').jqxGrid('getrowdata', Indexes[i]);
                var ID = RowData.ID;
                SMSID.push(ID);
            }

            var value = {
                "SMSID": SMSID
            };
            var obji = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSMS/DeleteSMS",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {

                    GetLogSMS();
                    if (result.Message == 'Deleted') {
                        $.alert.open('info', 'Success', 'SMS Deleted Successfully');
                    }
                    else {
                        $.alert.open('error', 'Error', 'Cannot SMS, Please Try Again.');
                    }

                }
            });
        }

        function AddNumber() {


            var Number = $("#txtSMSTo").val();
            if (Number.length < 8) {
                alert("Please enter Valid Number");
                return
            }

            MobileNos = $("#txtMobileNos").val();
            MobileNos += ',' + Number;
            MobileNos = MobileNos.replace(/^,/, '');
            //$("#txtMobileNos").val(MobileNos.slice(0, -1));
            $("#txtMobileNos").val(MobileNos);
        }

        function DeleteEmailTemplate(TemplateID) {
            var value = {
                "TemplateID": TemplateID
            };
            var obji = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSMS/DeleteEmailTemplate",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    GetTemplate();
                    if (result.Message == 'Deleted') {
                        $.alert.open('info', 'Success', 'Deleted Successfully');
                        $('#grdSendSMS').jqxGrid('clearselection');
                    }
                    else {
                        $.alert.open('error', 'Error', 'Error, Try Again');
                    }

                }
            });
        }

        function DeleteSMSTemplate(TemplateID) {
            var value = {
                "TemplateID": TemplateID
            };
            var obji = { value: value }
            $.ajax({
                type: "POST",
                url: "../../EmailSMS/DeleteSMSTemplate",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    GetTemplate();
                    if (result.Message == 'Deleted') {
                        $.alert.open('info', 'Success', 'Deleted Successfully');
                        $('#grdSendSMS').jqxGrid('clearselection');
                    }
                    else {
                        $.alert.open('error', 'Error', 'Error, Try Again');
                    }

                }
            });
        }


        function ClearSMS() {
            $("#txtSMSGroupName").val('');
            $("#btnUpdateSMSGroup").hide();
            $("#btnDeleteSMSGroup").hide();
            $("#grdSMSEmployees").jqxGrid('clearselection');
            $("#grdSMSGroups").jqxGrid('clearselection');
            $("#txtSMSTo").val('');
            $("#txtSMSTemplate").val('');
            $("#tdSMSNew").show();
            $("#tdSMSName").hide();
        }


    </script>
    <style>
        .myButton {
            -moz-box-shadow: inset 0px 1px 0px 0px #54a3f7;
            -webkit-box-shadow: inset 0px 1px 0px 0px #54a3f7;
            box-shadow: inset 0px 1px 0px 0px #54a3f7;
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #007dc1), color-stop(1, #0061a7));
            background: -moz-linear-gradient(top, #007dc1 5%, #0061a7 100%);
            background: -webkit-linear-gradient(top, #007dc1 5%, #0061a7 100%);
            background: -o-linear-gradient(top, #007dc1 5%, #0061a7 100%);
            background: -ms-linear-gradient(top, #007dc1 5%, #0061a7 100%);
            background: linear-gradient(to bottom, #007dc1 5%, #0061a7 100%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#007dc1', endColorstr='#0061a7',GradientType=0);
            background-color: #007dc1;
            -moz-border-radius: 3px;
            -webkit-border-radius: 3px;
            border-radius: 3px;
            border: 1px solid #124d77;
            display: inline-block;
            cursor: pointer;
            color: #ffffff;
            font-family: Arial;
            font-size: 13px;
            padding: 5px 14px;
            text-decoration: none;
            text-shadow: 0px 1px 0px #154682;
        }

            .myButton:hover {
                background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #0061a7), color-stop(1, #007dc1));
                background: -moz-linear-gradient(top, #0061a7 5%, #007dc1 100%);
                background: -webkit-linear-gradient(top, #0061a7 5%, #007dc1 100%);
                background: -o-linear-gradient(top, #0061a7 5%, #007dc1 100%);
                background: -ms-linear-gradient(top, #0061a7 5%, #007dc1 100%);
                background: linear-gradient(to bottom, #0061a7 5%, #007dc1 100%);
                filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0061a7', endColorstr='#007dc1',GradientType=0);
                background-color: #0061a7;
            }
    </style>

    <div id="jqxTabs">
        <ul>
            <li>Email</li>
            <li>SMS</li>
        </ul>
        <div id="tbEmail">
            <div style="width: 100%">
                <table style="width: 100%">
                    <tr>
                        <td class="myButton3">Email Template
                        </td>
                    </tr>
                </table>
            </div>
            <input type="text" id="hidTemplateID" style="display: none" />
            <table>
                <tr>
                    <td>
                        <table class="myButton1" style="width: 620px">
                            <%--<tr>
            <td>New Template Name</td>
            <td>
                <input id="txtNewTemplateName" type="text" />
            </td>
        </tr>--%>
                            <tr>
                                <td>Select Group</td>
                                <td>
                                    <div id='ddGroups'></div>
                                </td>
                                <td>
                                    <button id="btnPlusGroup" onclick="OpenGroupWindow()">+</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Select Template</td>
                                <td>
                                    <div id="ddTemplate">
                                        <div id="grdTemplate">
                                        </div>
                                    </div>
                                </td>
                                <td id="tdNew">
                                    <button id="btnNew" onclick="New()">+</button>
                                </td>

                                <td id="tdName" style="display: none">New Template Name:
                                <input id="txtNewTemplateName" type="text" /></td>

                            </tr>
                            <tr>
                                <td>Email To:</td>
                                <td>
                                    <input id="txtEmailTo" type="text" />
                                    <button id="btnEmail" onclick="AddEmail()">Add</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Subject</td>
                                <td>
                                    <input id="txtSubject" type="text" />
                                </td>
                            </tr>
                            <tr>
                                <td>Email Text</td>
                                <td>
                                    <textarea id="txtTemplate" rows="7" cols="50"></textarea></td>
                            </tr>
                            <tr>
                                <td>
                                    <button id="btnCreate" onclick="Create()" class="myButton">Create</button>
                                </td>
                                <td>
                                    <button id="btnSave" onclick="Save()" class="myButton">Save</button>
                                </td>
                            </tr>

                        </table>
                    </td>
                    <td>
                        <textarea id="txtEmails" rows="18" cols="50"></textarea>
                    </td>
                </tr>
            </table>



            <table>
                <tr>
                    <td>{0} = Employee Name
                    </td>
                    <td>, {1} = Bill Amount
                    </td>
                    <td>, {2} = Bill Date
                    </td>
                    <td>, {3} = Telephone Number
                    </td>
                    <td>, {4} = Manager
                    </td>
                    <td>, {5} = Provider
                    </td>
                    <td>, {6} = Link
                    </td>
                </tr>
            </table>
            <div id="grdTemplates"></div>
            <button id="btnSend" onclick="Send()" class="myButton">Send Email</button>



            &nbsp
            <br />
            <div align="Center" style="color: green">
                <h1>Email Log </h1>
            </div>
            <div id="grdSendEmail"></div>
            &nbsp
            <div>
                <input id="btnSendEmail" type="button" class="myButton" style="position: relative; left: 45%" value="Send Email" onclick="SendEmail()" />
                <input id="btnDeleteEmail" type="button" class="myButton" style="position: relative; left: 45%" value="Clear" onclick="DeleteEmail()" />
            </div>


        </div>

        <div id="tbSMS">
            <div style="width: 100%">
                <table style="width: 100%">
                    <tr>
                        <td class="myButton3">SMS Template
                        </td>
                    </tr>
                </table>
            </div>

            <b style="float: right">SMS Balance:<label id="lblBalance"></label></b>
            <input type="text" id="hidSMSTemplateID" style="display: none" />
            <table>
                <tr>
                    <td>
                        <table class="myButton1" style="width: 620px">
                            <tr>
                                <td>Select Group</td>
                                <td>
                                    <div id='ddSMSGroups' style="display: inline-block">
                                    </div>
                                </td>
                                <td>
                                    <input style="display: inline-flex; margin-bottom: 5px" id="btnPlusSMSGroup" type="button" onclick="OpenGroupSMSWindow()" value="+" />

                                </td>
                            </tr>
                            <tr>
                                <td>Select Template</td>
                                <td>
                                    <div id="ddSMSTemplate">
                                        <div id="grdSMSTemplate">
                                        </div>
                                    </div>
                                </td>
                                <td id="tdSMSNew">
                                    <button id="btnSMSNew" onclick="NewSMS()">+</button>
                                </td>

                                <td id="tdSMSName" style="display: none">New Template Name:
                                <input id="txtNewSMSTemplateName" type="text" /></td>

                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <button id="btnSMSCreate" onclick="SMSCreate()" class="myButton">Create Template</button>
                                    <%-- </td>
                                <td>--%>
                                    <button id="btnSMSSave" onclick="SMSSave()" class="myButton" style="margin-left: 20px">Save Template</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Mobile:</td>
                                <td>
                                    <input id="txtSMSTo" type="text" />
                                    <button id="btnSMS" onclick="AddNumber()">Add</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Language</td>
                                <td>
                                    <label>
                                        <input id="chkArabic" type="checkbox" class="radio" value="1" name="Lang" onclick="LanguageChk(2)" />Arabic</label>
                                    <label>
                                        <input id="chkEnglish" type="checkbox" class="radio" value="2" name="Lang" onclick="LanguageChk(1)" />English</label>
                                </td>
                            </tr>
                            <tr>
                                <td>SMS</td>
                                <td>
                                    <textarea id="txtSMSTemplate" rows="7" cols="50" disabled="disabled"></textarea>
                                    <label id="Length"></label>
                                    /<label id="TotalLength"></label>
                                </td>
                            </tr>


                        </table>
                    </td>
                    <td>
                        <textarea id="txtMobileNos" rows="18" cols="50"></textarea>
                    </td>
                </tr>
            </table>



            <table>
                <tr>
                    <td>{0} = Employee Name
                    </td>
                    <td>, {1} = Bill Amount
                    </td>
                    <td>, {2} = Bill Date
                    </td>
                    <td>, {3} = Telephone Number
                    </td>
                    <td>, {4} = Manager
                    </td>
                    <td>, {5} = Provider
                    </td>
                    <td>, {6} = Link
                    </td>
                </tr>
            </table>

            <div id="grdSMSTemplates"></div>
            <button id="btnSMSSend" onclick="SendSMS()" class="myButton">Send Email</button>


            &nbsp
            <br />
            <div align="Center" style="color: green">
                <h1>SMS Log </h1>
            </div>
            <div id="grdSendSMS"></div>
            &nbsp
            <div>
                <input id="btnSendSMS" type="button" class="myButton" style="position: relative; left: 45%" value="Send SMS" onclick="SendSMS2()" />
                <input id="btnDeleteSMS" type="button" class="myButton" style="position: relative; left: 45%" value="Clear" onclick="DeleteSMS()" />
            </div>


        </div>
    </div>

    <div id="Window">
        <div>
            <b>Group</b>
        </div>
        <div>
            <table>
                <tr>
                    <td style="display: none">
                        <label id="hidGroupID"></label>
                    </td>
                    <td>
                        <b>Group Name:</b>
                    </td>
                    <td>
                        <input id="txtGroupName" type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Select Employees:</b>
                    </td>
                    <td>
                        <div id="ddEmployees">
                            <div id="grdEmployees">
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
            <table>
                <tr>
                    <td>
                        <input id="btnAddGroup" type="button" value="Add" onclick="AddGroup()" class="myButton" />
                    </td>
                    <td>
                        <input id="btnUpdateGroup" type="button" value="Update" onclick="UpdateGroup()" class="myButton" />
                    </td>
                    <td>
                        <input id="btnDeleteGroup" type="button" value="Delete" onclick="DeleteGroup()" class="myButton" />
                    </td>
                    <td>
                        <input id="btnClearGroup" type="button" value="Cancel" onclick="ClearGroup()" class="myButton" />
                    </td>
                </tr>
            </table>
            <div id="grdGroups">
            </div>
        </div>
    </div>

    <div id="WindowSMS">
        <div>
            <b>Group</b>
        </div>
        <div>
            <table>
                <tr>
                    <td style="display: none">
                        <label id="hidSMSGroupID"></label>
                    </td>
                    <td>
                        <b>Group Name:</b>
                    </td>
                    <td>
                        <input id="txtSMSGroupName" type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Select Employees:</b>
                    </td>
                    <td>
                        <div id="ddSMSEmployees">
                            <div id="grdSMSEmployees">
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
            <table>
                <tr>
                    <td>
                        <input id="btnAddSMSGroup" type="button" value="Add" onclick="AddSMSGroup()" class="myButton" />
                    </td>
                    <td>
                        <input id="btnUpdateSMSGroup" type="button" value="Update" onclick="UpdateSMSGroup()" class="myButton" />
                    </td>
                    <td>
                        <input id="btnDeleteSMSGroup" type="button" value="Delete" onclick="DeleteSMSGroup()" class="myButton" />
                    </td>
                    <td>
                        <input id="btnClearSMSGroup" type="button" value="Cancel" onclick="ClearSMSGroup()" class="myButton" />
                    </td>
                </tr>
            </table>
            <div id="grdSMSGroups">
            </div>
        </div>
    </div>

    <%--&nbsp
    <br />
    <div align="Center" style="color:green">
    <h1> Email Log </h1>
    </div>
    <div id="grdSendEmail"></div>
    &nbsp
    <div>
        <input id="btnSendEmail" type="button" class="myButton" style="position: relative; left: 45%" value="Send Email" onclick="SendEmail()" />
        <input id="btnDeleteEmail" type="button" class="myButton" style="position: relative; left: 45%" value="Clear" onclick="DeleteEmail()" />
    </div>--%>
</asp:Content>
