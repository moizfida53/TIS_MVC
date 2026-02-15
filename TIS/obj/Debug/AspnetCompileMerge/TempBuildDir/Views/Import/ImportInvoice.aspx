<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    ImportInvoice
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">


    <link href="../../css/alert.css" rel="stylesheet" />
    <link href="../../css/theme.css" rel="stylesheet" />
    <script src="../../Scripts/alert.js"></script>

    <style>
        .hide_column {
            display: none;
        }

        .show_column {
            display: none;
        }

        /*#wait {
            width: 69px;
            height: 89px;*/
        /*border: 1px solid black;*/
        /*top: 43%;
            left: 51%;
            padding: 2px;
            position: absolute;
            z-index: 1;
        }*/
    </style>

    <script type="text/javascript">
        var Year = [];
        var DataRows = [];
        var Columns;
        var Providers;
        var ImportData;
        var DbBased;

        $(document).ready(function () {

            $('#jqxTabs').jqxTabs({ width: '100%', position: 'top' });


            $('#jqxFileUpload').jqxFileUpload({
                width: 300,
                uploadUrl: '../../Import/Upload',
                fileInputName: 'fileToUpload',
                browseTemplate: 'success',
                localization: { browseButton: 'Select File', uploadButton: 'Upload File', cancelButton: 'Cancel', theme: 'dark-blue' }
            });

            $('#jqxFileUpload2').jqxFileUpload({
                width: 300,
                uploadUrl: '../../Import/Upload',
                fileInputName: 'fileToUpload',
                browseTemplate: 'success',
                localization: { browseButton: 'Select File', uploadButton: 'Upload File', theme: 'dark-blue', cancelButton: 'Cancel' }
            });


            $('#jqxFileUpload').on('uploadStart', function (event) {
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
            });


            $('#jqxFileUpload2').on('uploadStart', function (event) {
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
            });


            $("#btnProcess").hide();
            $("#btnUpload").hide();
            $("#btnSave").hide();
            FillSheet();
            FillSheet2();
            $("#cmbMonth").jqxDropDownList({ width: '170px', height: '25px' });
            $("#cmbMonth").jqxDropDownList('loadFromSelect', 'Select');
            $("#cmbMonth").jqxDropDownList('selectIndex', 0);
            $("#Select").hide();
            $("#cmbSheet").jqxDropDownList({ width: '170px', height: '25px', theme: 'dark-blue' });


            $("#excelExport").click(function () {
                saveMyFile($('#SubmitForm'), "My Excel File" + ".xls", $("#grdData").jqxGrid('exportdata', 'xls'));
            });




            FillYear();
            FillProvider();
            FillGrid();


            $("#dd1").jqxDropDownList({ width: '170px', height: '25px' });
            $("#dd2").jqxDropDownList({ width: '170px', height: '25px' });
            $("#dd3").jqxDropDownList({ width: '170px', height: '25px' });
            $("#dd4").jqxDropDownList({ width: '170px', height: '25px' });
            $("#dd5").jqxDropDownList({ width: '170px', height: '25px' });
            $("#dd6").jqxDropDownList({ width: '170px', height: '25px' });
            $("#dd7").jqxDropDownList({ width: '170px', height: '25px' });
            $("#dd8").jqxDropDownList({ width: '170px', height: '25px' });


            $("#cmbType").jqxDropDownList({ width: '170px', height: '25px' });
            $("#cmbType").jqxDropDownList('loadFromSelect', 'SelectType');
            $("#cmbType").jqxDropDownList('selectIndex', 0);
            $("#SelectType").hide();

            $("#DataBase").hide();
            $("#UpdateDBSetting").hide();
            $("#img").hide();

            $("#cmbViews").jqxDropDownList({ width: '170px', height: '25px' });

            $('#cmbType').on('select', function (event) {

                $("#img").hide();
                var args = event.args;
                var index = args.index;

                $('#txtDataBase').val("Data Source=(localdb)\Projects;Initial Catalog=TIS;Integrated Security=True;Connect Timeout=15;Encrypt=False;TrustServerCertificate=False;Pooling=true")

                if (index == 2) {
                    DataBase();
                }

                else {
                    Excel();
                }

            });


            $('#cmbProvider').on('select', function (event) {
                var args = event.args;
                var item = args.item;
                if (item == null) {
                    $("#h1").show();
                    $("#h2").show();
                    $("#h3").show();
                    $("#h4").show();
                    $("#btnUpload").hide();
                }
                else {
                    var Provider = item.value;
                    CheckProvider(Provider);
                }



            });


        });
        function FillGrid() {
            $.ajax({
                type: "GET",
                cache: false,
                url: "../../Import/GetUploadHistory",
                success: function (result) {
                    var UploadList = result.UploadList;
                    var deptsource =
                    {
                        localdata: UploadList,
                        datafields:
                            [
                                { name: 'ID', type: 'number' },
                                { name: 'FileName', type: 'string' },
                                { name: 'BillDate', type: 'date' },
                                { name: 'UploadDate', type: 'date' },
                                { name: 'ProviderName', type: 'string' },
                                { name: 'ProviderID', type: 'number' },
                                { name: 'BillAmount', type: 'number' }
                            ],
                        datatype: "json"
                    };


                    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
                    var IsDeletebuttonHide = result.IsDeleteButShow == 1 ? false : true;
                    $("#grdData").jqxGrid({
                        width: '100%',
                        source: dataAdapterCategory,
                        columnsresize: true,
                        pageSize: 10,
                        sortable: true,
                        filterable: true,
                        showfilterrow: true,
                        pageable: true,
                        theme: 'dark=blue',
                        selectionmode: 'singlerow',
                        columns: [
                            { dataField: 'ID', text: 'ID' },
                            { dataField: 'FileName', text: 'FileName' },
                            { dataField: 'BillDate', text: 'BillDate', cellsformat: 'dd-MM-yyyy' },
                            { dataField: 'UploadDate', text: 'UploadDate', cellsformat: 'dd-MM-yyyy' },
                            { dataField: 'ProviderName', text: 'ProviderName' },
                            { dataField: 'ProviderID', text: 'Provider' },
                            { dataField: 'BillAmount', text: 'Bill Amount', cellsformat: 'f3' },

                            {
                                datafield: 'Delete',
                                hidden: IsDeletebuttonHide,
                                text: 'Delete', columntype: 'button', width: 75, cellsrenderer: function () {
                                    return "Delete";
                                }, buttonclick: function (row) {
                                    debugger;
                                    var row = $("#grdData").jqxGrid('getrowdata', row);
                                    $.alert.open('confirm', 'Are You Sure you want to Delete?', function (button) {
                                        if (button == 'yes') {
                                            var FormatedBillDate = $.jqx.dataFormat.formatdate(row.BillDate, 'yyyy-MM-dd');
                                            var File = {
                                                "ID": row.ID,
                                                "BillDate": FormatedBillDate,
                                                "ProviderID": row.ProviderID

                                            };
                                            $.ajax({
                                                type: "GET",

                                                url: "../../Import/DeleteBill",
                                                contentType: 'application/json',
                                                data: File,
                                                success: function (result) {
                                                    //$.notify(result.Message);
                                                    if (result.myMessage == 'succ') {
                                                        $.alert.open('info', 'Delete Bill', 'Bill Deleted Successfully');
                                                    }
                                                    else {
                                                        $.alert.open('error', 'Error', 'Sorry cannot complete transaction, Please contact Administrator');
                                                    }
                                                    FillGrid();
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        ]
                    });
                    $("#grdData").on('rowselect', function (event) {
                        idx = event.args.rowindex;
                        var datarow = $("#grdData").jqxGrid('getrowdata', idx);
                        var ID = datarow.ID;

                    });
                }
            });


        }
        function FillSheet() {

            $('#jqxFileUpload').on('uploadEnd', function (event) {
                debugger;
                var args = event.args;
                var fileName = args.file;
                var serverResponce = args.response;
                $("#lblFileName").html(fileName);
                var File = {
                    "FileName": fileName
                };
                $.ajax({
                    type: "GET",
                    cache: false,
                    url: "../../Import/FillSheet",
                    contentType: 'application/json',
                    data: File,
                    success: function (result) {
                        $("#btnUpload").show();
                        var Sheets = result.dtSheet;
                        var source =
                        {
                            dataType: "json",
                            dataFields: [
                                { name: 'SheetName', type: 'string' }
                            ],
                            id: 'SheetName',
                            localdata: Sheets
                        };
                        var dataAdapter = new $.jqx.dataAdapter(source);
                        $("#cmbSheet").jqxDropDownList({
                            selectedIndex: -1, source: dataAdapter, displayMember: "SheetName", valueMember: "SheetName", width: 170, height: 25
                        });
                    }
                });
            });

        }
        function FillSheet2() {

            $('#jqxFileUpload2').on('uploadEnd', function (event) {
                var args = event.args;
                var fileName = args.file;
                var serverResponce = args.response;
                $("#lblFileName2").html(fileName);
                var File = {
                    "FileName": fileName
                };
                $.ajax({
                    type: "GET",
                    cache: false,
                    url: "../../Import/FillSheet",
                    contentType: 'application/json',
                    data: File,
                    success: function (result) {
                        var Sheets = result.dtSheet;
                        var source =
                        {
                            dataType: "json",
                            dataFields: [
                                { name: 'SheetName', type: 'string' }
                            ],
                            id: 'SheetName',
                            localdata: Sheets
                        };
                        var dataAdapter = new $.jqx.dataAdapter(source);
                        $("#cmbSheet2").jqxDropDownList({
                            selectedIndex: -1, source: dataAdapter, displayMember: "SheetName", valueMember: "SheetName", width: 170, height: 25
                        });
                    }
                });
            });

        }
        function FillYear() {
            Year.push("Select Year");
            for (var i = 2022; i <= 2030; i++) {
                Year.push(i);
            }
            $("#cmbYear").jqxDropDownList({ source: Year, selectedIndex: 0, width: '170px', height: '25' });
        }
        function FillProvider() {
            $.ajax({
                type: "GET",
                url: "../../Admin/GetProvider",
                success: function (result) {
                    Providers = result.ProviderList;
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
                    $("#cmbProvider").jqxDropDownList({
                        selectedIndex: -1, source: dataAdapterPr, displayMember: "NAME", valueMember: "ID", width: 170, height: 25
                    });
                    $("#cmbProvider2").jqxDropDownList({
                        selectedIndex: -1, source: dataAdapterPr, displayMember: "NAME", valueMember: "ID", width: 170, height: 25
                    });
                }
            });
        }
        function Upload() {

            var Month = $("#cmbMonth").jqxDropDownList('getSelectedItem');
            if (Month == null || Month.value == "0") {
                $("#cmbMonth").notify('Please Select Month', { position: "right" });
                return;
            }
            var Year = $("#cmbYear").jqxDropDownList('getSelectedItem');
            if (Year == null || Year.label == "Select Year") {
                $("#cmbYear").notify('Please Select Year', { position: "right" });
                return;
            }
            var Provider = $("#cmbProvider").jqxDropDownList('getSelectedItem');
            if (Provider == null) {
                $("#cmbProvider").notify('Please Select Provider', { position: "right" });
                return;
            }

            if (DbBased == "False") {
                var Sheet = $("#cmbSheet").jqxDropDownList('getSelectedItem');
                if (Sheet == null) {
                    $("#cmbSheet").notify('Please Select Sheet', { position: "top center" });
                    return;
                }
            }
            else {
                var Sheet = "";
            }
            ///////////////////////////// Check Duplicate /////////////////////////////////////

            var d = new Date(Year.label, Month.value, '0');
            var BillDate = $.jqx.dataFormat.formatdate(d, 'dd-MM-yyyy');

            var filtergroup = new $.jqx.filter();
            var filter = filtergroup.createfilter('datefilter', BillDate, 'EQUAL');
            filtergroup.addfilter(1, filter);
            $("#grdData").jqxGrid('addfilter', 'BillDate', filtergroup);

            var filtergroup1 = new $.jqx.filter();
            var filter1 = filtergroup1.createfilter('numericfilter', Provider.value, 'EQUAL');
            filtergroup1.addfilter(1, filter1);
            $("#grdData").jqxGrid('addfilter', 'ProviderID', filtergroup1);

            $("#grdData").jqxGrid('applyfilters');
            var Information = $("#grdData").jqxGrid('getdatainformation');
            var Count = Information.rowscount;
            if (Count > 0) {
                $("#grdData").jqxGrid('clearfilters');
                //                $.notify('Bill Already Imported');
                $.pgwModal({
                    content: 'Bill Already Imported',
                    title: 'Message',
                });
                return;
            }
            $("#grdData").jqxGrid('clearfilters');

            //////////////////////////////////////////////////////////////////////////////////////////////////

            var File = {
                "FileName": $("#lblFileName").html(),
                "SheetName": Sheet.label,
                "Month": Month.value,
                "Year": Year.label,
                "ProviderID": Provider.value,
                "DbBased": DbBased,
            };


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

            debugger;
            $.ajax({
                type: "GET",

                url: "../../Import/UploadFile",
                contentType: 'application/json',
                data: File,
                success: function (result) {
                    debugger;
                    $("#lblBillAmount").html(result.BillAmount);
                    ImportData = result.gridData;

                    if (ImportData.length > 0) {
                        FillImport();
                        $("#btnSave").show();
                        $("#btnReset").show();
                    }
                    else {
                        $("#btnUpload").hide();
                        $("#btnReset").show();
                        $("#btnProcess").show();
                    }

                    //                    $.notify(result.MyMessage);
                }
            });
        }
        function FillImport() {

            var deptsource =
            {
                localdata: ImportData,
                datafields:
                    [
                        { name: 'ID', type: 'number' },
                        { name: 'SUB_NO', type: 'string' },
                        { name: 'BILLDATE', type: 'date' },
                        { name: 'CALLDATE', type: 'string' },
                        { name: 'TRANS_TYPE', type: 'string' },
                        { name: 'DESCRIPTION', type: 'string' },
                        { name: 'AMOUNT', type: 'string' },
                        { name: 'DURATION', type: 'string' },
                        { name: 'CALLTIME', type: 'string' }
                    ],
                updaterow: function (rowid, rowdata, commit) {
                    DataRows.push(rowdata);
                },
                datatype: "json"
            };

            var cellclass = function (row, columnfield, value) {
                if (value.length == 0) {
                    return 'red';
                }
            }



            var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
            $("#grdImport").jqxGrid({
                width: '100%',
                source: dataAdapterCategory,
                columnsresize: true,
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                theme: 'dark-blue',
                selectionmode: 'none',
                editable: true,
                editmode: 'dblclick',
                columns: [
                    { dataField: 'ID', text: 'ID' },
                    { dataField: 'SUB_NO', text: 'SUB_NO', cellclassname: cellclass },
                    { dataField: 'BILLDATE', text: 'BILLDATE', cellsformat: 'dd-MM-yyyy' },
                    { dataField: 'CALLDATE', text: 'CALLDATE', cellsformat: 'dd-MM-yyyy', columntype: 'datetimeinput', cellclassname: cellclass },
                    { dataField: 'TRANS_TYPE', text: 'TRANS_TYPE' },
                    { dataField: 'DESCRIPTION', text: 'DESCRIPTION' },
                    { dataField: 'AMOUNT', text: 'AMOUNT', cellclassname: cellclass },
                    { dataField: 'DURATION', text: 'DURATION' },
                    { dataField: 'CALLTIME', text: 'CALLTIME' }
                ]
            });

            $("#grdImport").jqxGrid('setcolumnproperty', 'BILLDATE', 'editable', false);
            $("#grdImport").jqxGrid('setcolumnproperty', 'TRANS_TYPE', 'editable', false);
            $("#grdImport").jqxGrid('setcolumnproperty', 'DESCRIPTION', 'editable', false);
            $("#grdImport").jqxGrid('setcolumnproperty', 'DURATION', 'editable', false);
            $("#grdImport").jqxGrid('setcolumnproperty', 'CALLTIME', 'editable', false);
        }

        function SaveChanges() {
            for (var i = 0; i < DataRows.length; i++) {
                var rowdata = DataRows[i];
                var CallDate = $.jqx.dataFormat.formatdate(rowdata.CALLDATE, 'yyyy-MM-dd');
                var Imp = {
                    "ID": rowdata.ID,
                    "SUB_NO": rowdata.SUB_NO,
                    "BILLDATE": rowdata.BILLDATE,
                    "CALLDATE": CallDate,
                    "TRANS_TYPE": rowdata.TRANS_TYPE,
                    "DESCRIPTION": rowdata.DESCRIPTION,
                    "AMOUNT": rowdata.AMOUNT,
                    "DURATION": rowdata.DURATION,
                    "CALLTIME": rowdata.CALLTIME
                };

                var obj = JSON.stringify(Imp);
                $.ajax({
                    type: "GET",

                    url: "../../Import/UpdateImport",
                    contentType: 'application/json',
                    data: Imp,
                    success: function (result) {
                        ImportData = result.dtImp;
                        if (ImportData.length > 0) {
                            FillImport();
                        }
                        else {
                            $('#grdImport').jqxGrid('destroy');
                            $("#btnSave").hide();
                            $("#btnUpload").hide();
                            $("#btnReset").show();
                            $("#btnProcess").show();
                        }
                    }
                });
            }
        }

        function ProcessBill() {
            var File = {
                "DbBased": DbBased,
            };
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
                url: "../../Import/ProcessBill",
                data: File,
                success: function (result) {
                    //$.notify(result.Message, "success");
                    if (result.Message == 'succ') {


                        $.alert.open('info', 'Bill Import', 'Bill Loaded Successfully');
                    }
                    else {

                        $.alert.open('error', 'Error', 'Sorry cannot complete transaction, Please contact Administrator');
                    }

                    //alert("Bill Loaded Successfully");
                    ClearImport();
                    FillGrid();
                }
            });



        }
        function ClearImport() {
            $("#btnProcess").hide();
            $("#btnUpload").hide();
            $("#btnSave").hide();
            $("#btnReset").hide();
            $("#cmbMonth").jqxDropDownList({ selectedIndex: 0 });
            $("#cmbYear").jqxDropDownList({ selectedIndex: 0 });
            $("#cmbProvider").jqxDropDownList({ selectedIndex: -1 });
            $("#cmbSheet").jqxDropDownList('clear');
            $("#lblFileName").html('');
            $("#lblBillAmount").html('');
        }
        function UploadSetting() {

            var Provider = $("#cmbProvider2").jqxDropDownList('getSelectedItem');
            if (Provider == null) {
                $("#cmbProvider2").notify('Please Select Provider');
                return;
            }
            var Sheet = $("#cmbSheet2").jqxDropDownList('getSelectedItem');
            if (Sheet == null) {
                $("#cmbSheet2").notify('Please Select Sheet');
                return;
            }
            var File = {
                "FileName": $("#lblFileName2").html(),
                "SheetName": Sheet.label,
                "ProviderID": Provider.value
            };
            $.ajax({
                type: "GET",

                url: "../../Import/UploadSetting",
                contentType: 'application/json',
                data: File,
                success: function (result) {
                    Columns = result.dtCol;
                    FillSettings();
                }
            });
        }

        function FillSettings() {
            var source =
            {
                dataType: "json",
                dataFields: [
                    { name: 'Cols', type: 'string' }
                ],
                id: 'Cols',
                localdata: Columns
            };
            var dataAdapter = new $.jqx.dataAdapter(source);

            $("#dd1").jqxDropDownList({ source: dataAdapter, selectedIndex: 0, displayMember: "Cols", valueMember: "Cols", width: '170px', height: '25' });
            $("#dd2").jqxDropDownList({ source: dataAdapter, selectedIndex: 0, displayMember: "Cols", valueMember: "Cols", width: '170px', height: '25' });
            $("#dd3").jqxDropDownList({ source: dataAdapter, selectedIndex: 0, displayMember: "Cols", valueMember: "Cols", width: '170px', height: '25' });
            $("#dd4").jqxDropDownList({ source: dataAdapter, selectedIndex: 0, displayMember: "Cols", valueMember: "Cols", width: '170px', height: '25' });
            $("#dd5").jqxDropDownList({ source: dataAdapter, selectedIndex: 0, displayMember: "Cols", valueMember: "Cols", width: '170px', height: '25' });
            $("#dd6").jqxDropDownList({ source: dataAdapter, selectedIndex: 0, displayMember: "Cols", valueMember: "Cols", width: '170px', height: '25' });
            $("#dd7").jqxDropDownList({ source: dataAdapter, selectedIndex: 0, displayMember: "Cols", valueMember: "Cols", width: '170px', height: '25' });
            $("#dd8").jqxDropDownList({ source: dataAdapter, selectedIndex: 0, displayMember: "Cols", valueMember: "Cols", width: '170px', height: '25' });

        }
        function UpdateSetting() {
            var Item = $("#cmbProvider2").jqxDropDownList('getSelectedItem');
            if (Item == null) {
                $("#cmbProvider2").notify('Please Select Provider');
                return;
            }

            var Item1 = $("#dd1").jqxDropDownList('getSelectedItem');
            if (Item1 == null) {
                $("#dd1").notify('Please Select Telephone No');
                return;
            }

            var Item2 = $("#dd2").jqxDropDownList('getSelectedItem');
            if (Item2 == null) {
                $("#dd2").notify('Please Select Bill Date');
                return;
            }

            var Item3 = $("#dd3").jqxDropDownList('getSelectedItem');
            if (Item3 == null) {
                $("#dd3").notify('Please Select Transaction Date');
                return;
            }

            var Item4 = $("#dd4").jqxDropDownList('getSelectedItem');
            if (Item4 == null) {
                $("#dd4").notify('Please Select Call Type');
                return;
            }

            var Item5 = $("#dd5").jqxDropDownList('getSelectedItem');
            if (Item5 == null) {
                $("#dd5").notify('Please Select Destination No');
                return;
            }

            var Item6 = $("#dd6").jqxDropDownList('getSelectedItem');
            if (Item6 == null) {
                $("#dd6").notify('Please Select Time of Call');
                return;
            }

            var Item7 = $("#dd7").jqxDropDownList('getSelectedItem');
            if (Item7 == null) {
                $("#dd7").notify('Please Select Duration (Sec)');
                return;
            }

            var Item8 = $("#dd8").jqxDropDownList('getSelectedItem');
            if (Item8 == null) {
                $("#dd8").notify('Please Select Amount (KD)');
                return;
            }

            var Clm = {
                "Provider": Item.value,
                "Col1": Item1.label,
                "Col2": Item2.label,
                "Col3": Item3.label,
                "Col4": Item4.label,
                "Col5": Item5.label,
                "Col6": Item6.label,
                "Col7": Item7.label,
                "Col8": Item8.label
            };
            var obji = { Clm: Clm }
            $.ajax({
                type: "POST",

                url: "../../Import/UpdateSetting",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    Clear();
                    $.notify(result.Message, "success");
                }
            });

        }
        function Clear() {

            $("#dd1").jqxDropDownList('clear');
            $("#dd2").jqxDropDownList('clear');
            $("#dd2").jqxDropDownList('clear');
            $("#dd3").jqxDropDownList('clear');
            $("#dd4").jqxDropDownList('clear');
            $("#dd5").jqxDropDownList('clear');
            $("#dd6").jqxDropDownList('clear');
            $("#dd7").jqxDropDownList('clear');
            $("#dd8").jqxDropDownList('clear');
            $("#cmbSheet2").jqxDropDownList('clear');
            $("#cmbProvider2").jqxDropDownList({ selectedIndex: -1 });
            $("#lblFileName2").html('');
            $("#cmbType").jqxDropDownList({ selectedIndex: 0 });
            $("#txtDataBase").val('');
            $("#cmbViews").jqxDropDownList('clear');
            $("#img").hide();
        }

        function GetSetting() {
            var Item = $("#cmbProvider2").jqxDropDownList('getSelectedItem');
            if (Item == null) {
                $("#cmbProvider2").notify('Please Select Provider');
                return;
            }

            $('#cmbViews').jqxDropDownList('clear');

            var Clm = {
                "Provider": Item.value
            };

            $.ajax({
                type: "GET",
                cache: false,
                url: "../../Import/GetSetting",
                contentType: 'application/json',
                data: Clm,
                success: function (result) {
                    var Setting = result.dtCol;

                    if (result.dtDBCol) {
                        GetDBSetting(result.dtDBCol);
                    }

                    else {
                        $("#SelectFile").show();
                        $("#DataBase").hide();
                        $("#cmbType").jqxDropDownList({ selectedIndex: 1 });

                        var source = [
                            Setting.Col1,
                            Setting.Col2,
                            Setting.Col3,
                            Setting.Col4,
                            Setting.Col5,
                            Setting.Col6,
                            Setting.Col7,
                            Setting.Col8
                        ];

                        $("#dd1").jqxDropDownList({ source: source, selectedIndex: 0 });
                        $("#dd2").jqxDropDownList({ source: source, selectedIndex: 1 });
                        $("#dd3").jqxDropDownList({ source: source, selectedIndex: 2 });
                        $("#dd4").jqxDropDownList({ source: source, selectedIndex: 3 });
                        $("#dd5").jqxDropDownList({ source: source, selectedIndex: 4 });
                        $("#dd6").jqxDropDownList({ source: source, selectedIndex: 5 });
                        $("#dd7").jqxDropDownList({ source: source, selectedIndex: 6 });
                        $("#dd8").jqxDropDownList({ source: source, selectedIndex: 7 });
                    }
                }
            })

        }


        function saveMyFile(ref, fname, text, mime) {
            var blob = new Blob([text], { type: mime });
            saveAs(blob, fname);
            return false;
        }


        function Excel() {

            $("#SelectFile").show();
            $("#DataBase").hide();
            $("#UpdateSetting").show();
            $("#UpdateDBSetting").hide();
        }

        function DataBase() {

            $("#SelectFile").hide();
            $("#UpdateSetting").hide();
            $("#DataBase").show();
            $("#UpdateDBSetting").show();

        }

        function GetDBSetting(Data) {


            $("#DataBase").show();
            $("#SelectFile").hide();
            $("#cmbType").jqxDropDownList({ selectedIndex: 2 });

            var Setting = Data;

            var source = [
                Setting.Col1,
                Setting.Col2,
                Setting.Col3,
                Setting.Col4,
                Setting.Col5,
                Setting.Col6,
                Setting.Col7,
                Setting.Col8
            ];
            $("#txtDataBase").val(Setting.dbConstr);
            $("#cmbViews").jqxDropDownList('setContent', Setting.dbTableName);
            $("#dd1").jqxDropDownList({ source: source, selectedIndex: 0 });
            $("#dd2").jqxDropDownList({ source: source, selectedIndex: 1 });
            $("#dd3").jqxDropDownList({ source: source, selectedIndex: 2 });
            $("#dd4").jqxDropDownList({ source: source, selectedIndex: 3 });
            $("#dd5").jqxDropDownList({ source: source, selectedIndex: 4 });
            $("#dd6").jqxDropDownList({ source: source, selectedIndex: 5 });
            $("#dd7").jqxDropDownList({ source: source, selectedIndex: 6 });
            $("#dd8").jqxDropDownList({ source: source, selectedIndex: 7 });

        }

        function UploadDataSetting() {

            var Provider = $("#cmbProvider2").jqxDropDownList('getSelectedItem');
            if (Provider == null) {
                $("#cmbProvider2").notify('Please Select Provider');
                return;
            }

            var DataBase = $("#txtDataBase").val();
            if (DataBase == "") {
                $("#txtDataBase").notify('Please Select Connection String');
                return;
            }

            var TableName = $("#cmbViews").val();
            if (TableName == "") {
                $("#cmbViews").notify('Please Select Table Name');
                return;
            }

            var File = {
                "Provider": Provider.value,
                "dbConstr": DataBase,
                "dbTableName": TableName
            };
            $.ajax({
                type: "GET",
                cache: false,
                url: "../../Import/UploadDataSetting",
                contentType: 'application/json',
                data: File,
                success: function (result) {
                    Columns = result.dtCol;
                    FillSettings();
                }
            });

        }


        function UpdateDBSetting() {

            var Item = $("#cmbProvider2").jqxDropDownList('getSelectedItem');
            if (Item == null) {
                $("#cmbProvider2").notify('Please Select Provider');
                return;
            }

            var Item1 = $("#dd1").jqxDropDownList('getSelectedItem');
            if (Item1 == null) {
                $("#dd1").notify('Please Select Telephone No');
                return;
            }

            var Item2 = $("#dd2").jqxDropDownList('getSelectedItem');
            if (Item2 == null) {
                $("#dd2").notify('Please Select Bill Date');
                return;
            }

            var Item3 = $("#dd3").jqxDropDownList('getSelectedItem');
            if (Item3 == null) {
                $("#dd3").notify('Please Select Transaction Date');
                return;
            }

            var Item4 = $("#dd4").jqxDropDownList('getSelectedItem');
            if (Item4 == null) {
                $("#dd4").notify('Please Select Call Type');
                return;
            }

            var Item5 = $("#dd5").jqxDropDownList('getSelectedItem');
            if (Item5 == null) {
                $("#dd5").notify('Please Select Destination No');
                return;
            }

            var Item6 = $("#dd6").jqxDropDownList('getSelectedItem');
            if (Item6 == null) {
                $("#dd6").notify('Please Select Time of Call');
                return;
            }

            var Item7 = $("#dd7").jqxDropDownList('getSelectedItem');
            if (Item7 == null) {
                $("#dd7").notify('Please Select Duration (Sec)');
                return;
            }

            var Item8 = $("#dd8").jqxDropDownList('getSelectedItem');
            if (Item8 == null) {
                $("#dd8").notify('Please Select Amount (KD)');
                return;
            }

            var DataBase = $("#txtDataBase").val();
            if (DataBase == "") {
                $("#txtDataBase").notify('Please Select Connection String');
                return;
            }

            var TableName = $("#cmbViews").val();
            if (TableName == "") {
                $("#cmbViews").notify('Please Select Table Name');
                return;
            }


            var Clm = {
                "Provider": Item.value,
                "Col1": Item1.label,
                "Col2": Item2.label,
                "Col3": Item3.label,
                "Col4": Item4.label,
                "Col5": Item5.label,
                "Col6": Item6.label,
                "Col7": Item7.label,
                "Col8": Item8.label,
                "dbConstr": DataBase,
                "dbTableName": TableName
            };
            var obji = { Clm: Clm }
            $.ajax({
                type: "POST",
                url: "../../Import/UpdateDBSetting",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    Clear();
                    $.notify(result.Message, "success");
                }
            });

        }


        function CheckProvider(Provider) {

            var value = {
                "Provider": Provider,
            };

            var obji = { value: value }

            $.ajax({
                type: "POST",
                url: "../../Import/CheckProvider",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    DbBased = result.DbBased;

                    if (DbBased == 'True') {
                        $("#h1").hide();
                        $("#h2").hide();
                        $("#h3").hide();
                        $("#h4").hide();
                        $("#btnUpload").show();
                    }

                    else {
                        $("#h1").show();
                        $("#h2").show();
                        $("#h3").show();
                        $("#h4").show();
                        $("#btnUpload").hide();
                    }

                }
            });
        }

        function TestConn() {

            $("#img").hide();
            var DataBase = $("#txtDataBase").val();
            if (DataBase == "") {
                $("#txtDataBase").notify('Please Select Connection String');
                return;
            }

            var value = {
                "dbConstr": DataBase,
            };

            var obji = { value: value }

            $.ajax({
                type: "POST",
                url: "../../Import/TestConn",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {

                    if (result.Error) {

                        $("#img").show();
                        var Img = "<div><img src= ../../images/Cross-Anim.gif /></div>";
                        $("#img").html(Img);
                        alert(result.Error);
                    }
                    else {
                        $("#img").show();
                        var Img = "<div><img src= ../../images/Tick-Anim.gif /></div>";
                        $("#img").html(Img);

                        var Views = result.dtViews;
                        var source =
                        {
                            dataType: "json",
                            dataFields: [
                                { name: 'Views', type: 'string' }
                            ],
                            id: 'Views',
                            localdata: Views
                        };
                        var dataAdapterView = new $.jqx.dataAdapter(source);
                        // Create a jqxComboBox
                        $("#cmbViews").jqxDropDownList({
                            selectedIndex: -1, source: dataAdapterView, displayMember: "Views", valueMember: "Views", width: 170, height: 25
                        });

                    }
                }
            });

        }

    </script>
    <%-- <div id="wait">
        <img src="../images/loader.gif" width="64" height="64" /><br>
        Loading..
    </div>--%>
    <div style="width: 100%">
        <table style="width: 100%">
            <tr>
                <td class="myButton3">Import Bills
                </td>
            </tr>
        </table>
    </div>
    <div id="jqxTabs">
        <ul>
            <li>Import</li>
            <li>Excel Mapping</li>
        </ul>
        <div id="Import">
            <div>
                <table>
                    <tr>
                        <td>
                            <b>Select Month</b>
                        </td>
                        <td>
                            <div id="cmbMonth">
                            </div>
                            <select id="Select">
                                <option value="0" label="Select Month" selected="selected"></option>
                                <option value="1" label="January"></option>
                                <option value="2" label="February"></option>
                                <option value="3" label="March"></option>
                                <option value="4" label="April"></option>
                                <option value="5" label="May"></option>
                                <option value="6" label="June"></option>
                                <option value="7" label="July"></option>
                                <option value="8" label="August"></option>
                                <option value="9" label="September"></option>
                                <option value="10" label="October"></option>
                                <option value="11" label="November"></option>
                                <option value="12" label="December"></option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Select Year</b>
                        </td>
                        <td>
                            <div id="cmbYear">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Select Provider</b>
                        </td>
                        <td>
                            <div id="cmbProvider">
                            </div>
                        </td>
                    </tr>
                    <tr id="selectfile">
                        <td id="h1">
                            <b>Select File</b>
                        </td>
                        <td id="h2">
                            <div id="jqxFileUpload">
                            </div>
                            <div id="lblFileName">
                            </div>
                        </td>


                        <td>
                            <b id="h3">Select Sheet</b>
                        </td>
                        <td id="h4">
                            <div id="cmbSheet">
                            </div>
                        </td>
                        <td>
                            <input id="btnUpload" type="button" value="Upload File" onclick="Upload()" class="myButton" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Total Amount</b>
                        </td>
                        <td>
                            <div id="lblBillAmount">
                            </div>
                        </td>
                        <td>
                            <input id="btnProcess" type="button" class="myButton" value="Process Bill" onclick="ProcessBill()"
                                class="Btnstyle" />
                        </td>
                    </tr>
                </table>
            </div>
            <div>
                <input id="btnSave" type="button" value="Save Changes" onclick="SaveChanges()" class="myButton" />
            </div>
            <div id="grdImport">
            </div>
            <div id="grdData">
            </div>

            <div>
                <table>
                    <tr>
                        <td>
                            <input id="excelExport" type="button" value="Export To Excel" />
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div id="ExcelMapping">
            <div>
                <table>
                    <tr>
                        <td>
                            <b>Select Provider</b>
                        </td>
                        <td>
                            <div id="cmbProvider2">
                            </div>
                        </td>
                        <td>
                            <input id="btnPrevSetting" type="button" value="Show Prev Setting" onclick="GetSetting()"
                                class="Btnstyle" />
                        </td>
                        <td>
                            <input id="btnReset" type="button" value="Reset" onclick="Clear()" class="Btnstyle" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Select Type</b>
                        </td>
                        <td>
                            <div id="cmbType">
                            </div>
                            <select id="SelectType">
                                <option value="0" label=" " selected="selected"></option>
                                <option value="1" label="Excel"></option>
                                <option value="2" label="DataBase"></option>
                            </select>
                        </td>
                    </tr>
                    <tr id="SelectFile">
                        <td>
                            <b>Select File</b>
                        </td>
                        <td>
                            <div id="jqxFileUpload2">
                            </div>
                            <div id="lblFileName2">
                            </div>
                        </td>
                        <td>
                            <b>Select Sheet</b>
                        </td>
                        <td>
                            <div id="cmbSheet2">
                            </div>
                        </td>
                        <td>
                            <input id="btnUpload2" type="button" value="Upload New Setting" onclick="UploadSetting()"
                                class="Btnstyle" />
                        </td>
                    </tr>
                </table>
                <table id="DataBase">
                    <tr>
                        <td>
                            <b>Enter Database Connection Parameter:</b>
                        </td>
                        <td>
                            <input id="txtDataBase" type="text" size="80" style="border: 1px solid grey;" value="Data Source=(localdb)\Projects;Initial Catalog=TIS;Integrated Security=True;Connect Timeout=15;Encrypt=False;TrustServerCertificate=False;Pooling=true" />
                        </td>
                        <td>
                            <input id="btnTestConn" type="button" value="Test Connection" onclick="TestConn()"
                                class="Btnstyle" />
                        </td>
                        <td>
                            <div id="img"></div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Enter Name of View:</b>
                        </td>
                        <td>
                            <div id="cmbViews">
                            </div>
                        </td>
                        <td>
                            <input id="btnUpload3" type="button" value="Upload New DataBase Setting" onclick="UploadDataSetting()"
                                class="Btnstyle" />
                        </td>
                        <%--<td>
                            <input id="btnPrevDataSetting" type="button" value="Show Previous DataBase Setting"
                                onclick="GetDBSetting()" class="Btnstyle" />
                        </td>--%>
                    </tr>
                </table>
            </div>
            <div>
                <table>
                    <tr>
                        <td>
                            <b>1) Telephone Number </b>
                        </td>
                        <td>
                            <div id="dd1">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>2) Bill Date</b>
                        </td>
                        <td>
                            <div id="dd2">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>3) Transaction Date</b>
                        </td>
                        <td>
                            <div id="dd3">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>4) Call Type</b>
                        </td>
                        <td>
                            <div id="dd4">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>5) Destination No </b>
                        </td>
                        <td>
                            <div id="dd5">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>6) Time of Call</b>
                        </td>
                        <td>
                            <div id="dd6">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>7) Duration (Sec)</b>
                        </td>
                        <td>
                            <div id="dd7">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>8) Amount (KD) </b>
                        </td>
                        <td>
                            <div id="dd8">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td id="UpdateSetting">
                            <input id="btnUpdate" type="button" value="Update" onclick="UpdateSetting()" class="Btnstyle" />
                        </td>
                    </tr>
                    <tr>
                        <td id="UpdateDBSetting">
                            <input id="Button1" type="button" value="Update" onclick="UpdateDBSetting()" class="Btnstyle" />
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

</asp:Content>
