<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Package
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <link href="~/Content/jqx.base.css" rel="stylesheet" type="text/css" />
    <meta name="viewport" content="width=device-width" />
   
    <script type="text/javascript">
        var PKG = new Array();
        var PkgMaster;
        var Provider;
        $(document).ready(function () {
            $("#Panel1").css("border", "3px solid grey");
            $("#cmbProvider").jqxDropDownList({ placeHolder: "Select Provider", selectedIndex: -1, width: 180, height: 25 });
            $("#cmbTransType").jqxDropDownList({ placeHolder: "Select TransType", selectedIndex: -1, width: 180, height: 25 });
            $("#cmbDesc").jqxDropDownList({ placeHolder: "Select Description", selectedIndex: -1, width: 180, height: 25 });
            $("#chkAll").jqxCheckBox({ width: 50, height: 25 });
            $("#chkAll").bind('change', function (event) {
                var checked = event.args.checked;
                CheckChange(checked);
            });
            $("#cmbStartDate").jqxDateTimeInput({ width: '180px', height: '25px' });
            $("#btnAdd").jqxButton({ width: '50' });
            $("#btnAdd").on('click', function () {
                Add();
            });
            $("#btnUpdate").jqxButton({ width: '70' });
            $("#btnUpdate").on('click', function () {
                Update();
            });

            $("#btnSavePackage").jqxButton({ width: '100' });
            $("#btnSavePackage").on('click', function () {
                SavePackage();
            });
            $("#btnUpdatePackage").jqxButton({ width: '120' });
            $("#btnUpdatePackage").on('click', function () {
                UpdatePackage();
            });
            $("#btnCancel").jqxButton({ width: '50' });
            $("#btnCancel").on('click', function () {
                Clear();
            });
            $("#btnUpdate").hide();
            $("#btnUpdatePackage").hide();
            GetData();
            FillProvider();
        })
        function GetData() {
            $.ajax({
                type: "GET",
                url: "../../Admin/GetPkgData",
                success: function (result) {
                    Provider = result.dtPro;
                    FillProvider()
                    PkgMaster = result.dtPkg;
                    FillMasterGrid();
                }
            });
        }
        function GetMaster() {
            $.ajax({
                type: "GET",
                url: "../../Admin/GetPackage",
                success: function (result) {
                    PkgMaster = result.dtPkg;
                    FillMasterGrid();
                }
            });
        }
        function FillMasterGrid() {
            var source =
            {
                dataType: "json",
                dataFields: [
                    { name: 'ID', type: 'number' },
                    { name: 'PkgName', type: 'string' },
                    { name: 'PkgDesc', type: 'string' },
                    { name: 'StartDate', type: 'date' }
                ],
                id: 'ID',
                localdata: PkgMaster
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#grdMaster").jqxGrid(
            {
                width: "100%",
                source: dataAdapter,
                theme: 'arctic',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                columnsresize: true,
                columns: [
                  { text: 'ID', datafield: 'ID' },
                  { text: 'Package', datafield: 'PkgName' },
                  { text: 'Description', datafield: 'PkgDesc' },
                  { text: 'Start Date', datafield: 'StartDate', cellsformat: 'dd-MM-yyyy' },
                  { datafield: 'Delete', text: 'Delete', columntype: 'button', width: 75, cellsrenderer: function () {
                      return "Delete";
                  }, buttonclick: function (row) {
                      DeletePackage(row);
                      GetMaster();
                  }
                  }
                ]
            });
            $("#grdMaster").on('rowselect', function (event) {
                idx = event.args.rowindex;
                var datarow = $("#grdMaster").jqxGrid('getrowdata', idx);

                $('#hidMID').val(datarow.ID);
                $('#txtPkgName').val(datarow.PkgName);
                $('#txtPkgDesc').val(datarow.PkgDesc);
                var date1 = datarow.StartDate;
                var StartDate = $.jqx.dataFormat.formatdate(date1, 'dd-MM-yyyy');
                $('#dtStartDate').val(StartDate);

                var Package = {
                    "ID": $('#hidMID').val()
                };

                var obj = JSON.stringify(Package);
                $.ajax({
                    type: "GET",
                    url: "../../Admin/GetPkgDetail",
                    contentType: 'application/json',
                    data: Package,
                    success: function (result) {
                        PKG = result.PkgDetail;
                        FillDetailGrid();
                        $("#btnUpdatePackage").show();
                        $("#btnSavePackage").hide();
                    }
                });

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
                localdata: Provider
            };
            var dataAdapterPr = new $.jqx.dataAdapter(source);
            // Create a jqxComboBox
            $("#cmbProvider").jqxDropDownList({ source: dataAdapterPr, displayMember: "NAME", valueMember: "ID" });

            $('#cmbProvider').on('select', function (event) {
                var args = event.args;
                if (args) {
                    var item = args.item;
                    var label = item.label;
                    var value = item.value;


                    var pro = {
                        "ProviderID": value
                    };

                    var obj = JSON.stringify(pro);
                    $.ajax({
                        type: "GET",
                        url: "../../Admin/FillTransType",
                        contentType: 'application/json',
                        data: pro,
                        success: function (result) {
                            FillTransType(result.dtTransType);
                        }
                    });
                }
            });
        }
        function FillTransType(TransData) {

            var source =
            {
                dataType: "json",
                dataFields: [
                    { name: 'TransID', type: 'number' },
                    { name: 'TransName', type: 'string' }
                ],
                id: 'TransID',
                localdata: TransData
            };
            var dataAdapterPr = new $.jqx.dataAdapter(source);
            // Create a jqxComboBox
            $("#cmbTransType").jqxDropDownList({source: dataAdapterPr, displayMember: "TransName", valueMember: "TransID" });

            $('#cmbTransType').on('select', function (event) {
                var args = event.args;
                if (args) {

                    var item = args.item;
                    var label = item.label;
                    var value = item.value;

                    var pro = {
                        "TransID": value
                    };

                    var obj = JSON.stringify(pro);
                    $.ajax({
                        type: "GET",
                        url: "../../Admin/FillDesc",
                        contentType: 'application/json',
                        data: pro,
                        success: function (result) {
                            FillDesc(result);
                        }
                    });
                }
            });
        }
        function FillDesc(DescData) {
            var source =
            {
                dataType: "json",
                dataFields: [
                    { name: 'DescID', type: 'number' },
                    { name: 'DescName', type: 'string' }
                ],
                id: 'DescID',
                localdata: DescData
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#cmbDesc").jqxDropDownList({source: dataAdapter, displayMember: "DescName", valueMember: "DescID" });
        }
        function CheckChange(checked) {
            if (checked) {
                $('#trER').hide();
                $('#trDesc').hide();
            }
            else {
                $('#trER').show();
                $('#trDesc').show();
            }

        }
        function Add() {

            var PkgName = $("#txtPkgName").val();
            var PkgDesc = $("#txtPkgDesc").val();
            var Provider = $("#cmbProvider").jqxDropDownList('getSelectedItem');
            if (Provider == null) {
                alert('Please Select Provider');
                return;
            }
            var Trans = $("#cmbTransType").jqxDropDownList('getSelectedItem');
            if (Trans == null) {
                alert('Please Select TransType');
                return;
            }
            var Desc = $("#cmbDesc").jqxDropDownList('getSelectedItem');
            if (Desc == null) {
                alert('Please Select Description');
                return;
            }
            var IsAll = $('#chkAll').jqxCheckBox('checked');
            var ExpType = $('#cmbExpType').val();

            var Amount = $("#txtAmount").val();
            if (Amount == '') {
                alert('Please insert Amount');
                return;
            }
            var StartDate = $("#cmbStartDate").jqxDateTimeInput('getDate');
            var row = {};
            row["PkgName"] = PkgName;
            row["PkgDesc"] = PkgDesc;
            row["ProviderID"] = Provider.value;
            row["ProviderName"] = Provider.label;
            row["TransID"] = Trans.value;
            row["TransName"] = Trans.label;
            if (!IsAll) {
                row["DescID"] = Desc.value;
                row["DescName"] = Desc.label;
            }
            else {
                row["DescID"] = '';
                row["DescName"] = '';
            }
            row["IsAll"] = IsAll;
            row["ExpType"] = ExpType;
            row["Amount"] = Amount;
            row["StartDate"] = StartDate;
            PKG[PKG.length] = row;
            FillDetailGrid();
            $("#btnUpdate").hide();
            $("#btnAdd").show();
        }
        function Update() {

            var ID = $("#hidDID").val();
            var PkgName = $("#txtPkgName").val();
            var PkgDesc = $("#txtPkgDesc").val();
            var Provider = $("#cmbProvider").jqxDropDownList('getSelectedItem');
            if (Provider == null) {
                alert('Please Select Provider');
                return;
            }
            var Trans = $("#cmbTransType").jqxDropDownList('getSelectedItem');
            if (Trans == null) {
                alert('Please Select TransType');
                return;
            }
            var Desc = $("#cmbDesc").jqxDropDownList('getSelectedItem');
            if (Desc == null) {
                alert('Please Select Description');
                return;
            }
            var IsAll = $('#chkAll').jqxCheckBox('checked');
            var ExpType = $('#cmbExpType').val();

            var Amount = $("#txtAmount").val();
            if (Amount == '') {
                alert('Please insert Amount');
                return;
            }
            var StartDate = $("#cmbStartDate").jqxDateTimeInput('getDate');
            var row = {};
            row["PkgName"] = PkgName;
            row["PkgDesc"] = PkgDesc;
            row["ProviderID"] = Provider.value;
            row["ProviderName"] = Provider.label;
            row["TransID"] = Trans.value;
            row["TransName"] = Trans.label;
            if (!IsAll) {
                row["DescID"] = Desc.value;
                row["DescName"] = Desc.label;
            }
            else {
                row["DescID"] = '';
                row["DescName"] = '';
            }
            row["IsAll"] = IsAll;
            row["ExpType"] = ExpType;
            row["Amount"] = Amount;
            row["StartDate"] = StartDate;
            PKG.splice(ID, 1)
            //            PKG[ID] = row;
            PKG[PKG.length] = row;
            $('#grdDetail').jqxGrid('clearselection');
            FillDetailGrid();
            $("#btnUpdate").hide();
            $("#btnAdd").show();
        }
        function FillDetailGrid() {
            var source =
            {
                localdata: PKG,
                datatype: "array",
                datafields:
                [
                    { name: 'PkgName', type: 'string' },
                    { name: 'PkgDesc', type: 'string' },
                    { name: 'ProviderID', type: 'number' },
                    { name: 'ProviderName', type: 'string' },
                    { name: 'TransID', type: 'number' },
                    { name: 'TransName', type: 'string' },
                    { name: 'DescID', type: 'number' },
                    { name: 'DescName', type: 'string' },
                    { name: 'IsAll', type: 'bool' },
                    { name: 'ExpType', type: 'string' },
                    { name: 'Amount', type: 'number' },
                    { name: 'StartDate', type: 'date' }
                ]
            };
            var dataAdapter = new $.jqx.dataAdapter(source);

            $("#grdDetail").jqxGrid(
            {
                width: "100%",
                source: dataAdapter,
                theme: 'arctic',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                columnsresize: true,
                columns: [
                  { text: 'Package', datafield: 'PkgName', hidden: true },
                  { text: 'Description', datafield: 'PkgDesc', hidden: true },
                  { text: 'Provider ID', datafield: 'ProviderID', hidden: true },
                  { text: 'Provider', datafield: 'ProviderName' },
                  { text: 'Trans ID', datafield: 'TransID', hidden: true },
                  { text: 'Transaction Type', datafield: 'TransName' },
                  { text: 'Desc ID', datafield: 'DescID', hidden: true },
                  { text: 'Description', datafield: 'DescName' },
                  { text: 'IsAll', datafield: 'IsAll' },
                  { text: 'Expected Type', datafield: 'ExpType' },
                  { text: 'Amount', datafield: 'Amount' },
                  { text: 'Start Date', datafield: 'StartDate', cellsformat: 'dd-MM-yyyy', hidden: true },
                  { datafield: 'Delete', text: 'Delete', columntype: 'button', width: 75, cellsrenderer: function () {
                      return "Delete";
                  }, buttonclick: function (row) {
                      PKG.splice(row, 1);
                      FillDetailGrid();
                  }
                  }
                ]
            });
            $("#grdDetail").on('rowselect', function (event) {
                idx = event.args.rowindex;
                var datarow = $("#grdDetail").jqxGrid('getrowdata', idx);

                $('#hidDID').val(idx);
                $("#cmbProvider").jqxDropDownList('selectItem', datarow.ProviderID);
                $("#cmbTransType").jqxDropDownList('selectItem',datarow.TransID);
                $("#cmbDesc").jqxDropDownList('selectItem',datarow.DescID);
                $('#cmbExpType').val(datarow.ExpType);
                $("#chkAll").prop('checked', datarow.IsAll);
                $('#txtAmount').val(datarow.Amount);

                $("#btnUpdate").show();
                $("#btnAdd").hide();
            });
        }
        function SavePackage() {

            if ($("#txtPkgName").val() == '') {
                alert('Please Insert Package Name');
                return;
            }
            var date1 = $("#cmbStartDate").jqxDateTimeInput('getDate');
            var StartDate = $.jqx.dataFormat.formatdate(date1, 'yyyy-MM-dd');
            var Master = {
                "PkgName": $("#txtPkgName").val(),
                "PkgDesc": $("#txtPkgDesc").val(),
                "StartDate": StartDate

            };
            var obji = { Detail: PKG, Master: Master }
            $.ajax({
                type: "POST",
                url: "../../Admin/AddPackage",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {

                }
            });
            Clear();
            PKG.splice(0, PKG.length);
            alert('Added Successfully');
            $('#grdDetail').jqxGrid('clear');
            GetMaster();

        }
        function UpdatePackage() {
            if ($("#txtPkgName").val() == '') {
                alert('Please Insert Package Name');
                return;
            }
            var date1 = $("#cmbStartDate").jqxDateTimeInput('getDate');
            var StartDate = $.jqx.dataFormat.formatdate(date1, 'yyyy-MM-dd');
            var Master = {
                "ID": $("#hidMID").val(),
                "PkgName": $("#txtPkgName").val(),
                "PkgDesc": $("#txtPkgDesc").val(),
                "StartDate": StartDate
            };
            var obji = { Detail: PKG, Master: Master }
            $.ajax({
                type: "POST",
                url: "../../Admin/UpdatePackage",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {

                }
            });
            Clear();
            alert('Updated Successfully');
            GetMaster();

        }
        function DeletePackage(Index) {
            var row = $("#grdMaster").jqxGrid('getrowdata', Index);
            var Pkg = {
               "ID": row.ID
            };
            var obji = { Pkg: Pkg }
            $.ajax({
                type: "POST",
                url: "../../Admin/DeletePackage",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    alert(result.Message);
                    GetMaster();
                }
            });
        }
        function Clear() {
            $("#hidDID").val('');
            $("#txtAmount").val('');
            $("#cmbType").val('True');
            $("#cmbLineType").val('0');
            $("#cmbProvider").jqxDropDownList('clearSelection');
            $("#cmbTransType").jqxDropDownList('clearSelection');
            $("#cmbDesc").jqxDropDownList('clearSelection');
            $("#grdDetail").jqxGrid('clearselection');
            $('#cmbExpType').val('1');
            PKG.splice(0, PKG.length);
            $('#grdDetail').jqxGrid('clearselection');
            $('#grdDetail').jqxGrid('clear');
            $('#grdMaster').jqxGrid('clearselection');
            $("#btnUpdatePackage").hide();
            $("#btnSavePackage").show();
        }
    </script>
    <div id="Panel1">
        <div>
            <table>
                <tr>
                    <td>
                        <input id="hidDID" type="hidden" />
                    </td>
                    <td>
                        <input id="hidMID" type="hidden" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Package Name</b>
                    </td>
                    <td>
                        <input id="txtPkgName" type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Description</b>
                    </td>
                    <td>
                        <input id="txtPkgDesc" type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Provider</b>
                    </td>
                    <td>
                        <div id="cmbProvider">
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Transaction Type</b>
                    </td>
                    <td>
                        <div id="cmbTransType">
                        </div>
                    </td>
                    <td>
                        <div id="chkAll">
                        </div>
                    </td>
                    <td>
                        Make All UnExpected
                    </td>
                </tr>
                <tr id="trDesc">
                    <td>
                        <b>Description</b>
                    </td>
                    <td>
                        <div id="btnDesc">
                            <div id="cmbDesc">
                            </div>
                        </div>
                    </td>
                </tr>
                <tr id="trER">
                    <td>
                        <b>Expected Type</b>
                    </td>
                    <td>
                        <select id="cmbExpType">
                            <option label="Enable" value="1" selected="selected"></option>
                            <option label="Restrict" value="0"></option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Amount Limit</b>
                    </td>
                    <td>
                        <input id="txtAmount" type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Start Date</b>
                    </td>
                    <td>
                        <div id="cmbStartDate">
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <br />
        <br />
        <div>
            <table>
                <tr>
                    <td>
                        <input type="button" value="Add" id='btnAdd' />
                    </td>
                    <td>
                        <input type="button" value="Update" id='btnUpdate' />
                    </td>
                    <td>
                        <input type="button" value="Cancel" id='btnCancel' />
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <br />
    <br />
    <div>
        <div id="grdDetail">
        </div>
    </div>
    <div>
        <table width="100%">
            <tr>
                <td align="right">
                    <input type="button" value="Save Package" id='btnSavePackage' />
                </td>
                <td align="right">
                    <input type="button" value="Update Package" id='btnUpdatePackage' />
                </td>
            </tr>
        </table>
    </div>
    <br />
    <div>
        <div id="grdMaster">
        </div>
    </div>
</asp:Content>
