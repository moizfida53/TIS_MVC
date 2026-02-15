<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Provider
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <script type="text/javascript">

        $(document).ready(function () {
            $("#chkVoip").jqxCheckBox({ width: 30, height: 25 });
            $("#btnAdd").jqxButton({ template: 'primary' });
            $('#btnAdd').on('click', function () {
                Add();

            });
            $("#btnUpdate").jqxButton({ template: 'primary' });
            $('#btnUpdate').on('click', function () {
                Update();
            });
            $("#btnUpdate").hide();
            $("#btnDelete").jqxButton({ template: 'primary' });
            $('#btnDelete').on('click', function () {
                Delete();
            });
            $("#btnCancel").jqxButton({ template: 'primary' });
            $('#btnCancel').on('click', function () {
                Clear();
            });
            $("#btnDelete").hide();
            FillGrid();

        })
        function FillGrid() {

            $.ajax({
                type: "GET",
                cache: false,
                url: "../../Setting/GetProvider",
                success: function (result) {
                    var Bills = result.ProviderList;
                    var deptsource =
                    {
                        localdata: Bills,
                        datafields:
                            [
                                { name: 'ID', type: 'number' },
                                { name: 'NAME', type: 'date' },
                                { name: 'CountryId', type: 'number' },
                                { name: 'IsVoip', type: 'bool' }
                            ],
                        datatype: "json"
                    };

                    var DataAdapPdr = new $.jqx.dataAdapter(deptsource);
                    $("#grdData").jqxGrid({
                        width: '100%',
                        source: DataAdapPdr,
                        columnsresize: true,
                        theme: 'dark-blue',
                        pageSize: 10,
                        sortable: true,
                        filterable: true,
                        showfilterrow: true,
                        pageable: true,

                        selectionmode: 'singlerow',
                        columns: [
                            { dataField: 'ID', text: 'ID' },
                            { dataField: 'NAME', text: 'NAME' },
                            { dataField: 'CountryId', text: 'Country Id' },
                            { dataField: 'IsVoip', text: 'Is Voip', columntype: 'checkbox' }
                        ]
                    });
                    $("#grdData").on('rowselect', function (event) {
                        idx = event.args.rowindex;
                        var datarow = $("#grdData").jqxGrid('getrowdata', idx);
                        var ID = datarow.ID;
                        var NAME = datarow.NAME;
                        var IsVoip = datarow.IsVoip;
                        $('#hidID').val(ID);
                        $("#txtProvider").val(NAME);
                        $("#chkVoip").jqxCheckBox({ checked: IsVoip });
                        $("#btnAdd").hide();
                        $("#btnUpdate").show();
                        $("#btnDelete").show();

                    })
                }
            });
        }
        function Add() {

            if ($("#txtProvider").val() == '') {
                alert('Please Enter Provider Name');
                return;
            }

            var Pro = {

                "NAME": $("#txtProvider").val(),
                "IsVoip": $('#chkVoip').jqxCheckBox('checked')
            };
            var obji = { Provider: Pro }
            $.ajax({
                type: "POST",
                url: "../../Setting/AddProvider",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    alert(result.Message);
                    Clear();
                    FillGrid();
                }
            });
        }
        function Update() {

            if ($("#txtProvider").val() == '') {
                alert('Please Enter Provider Name');
                return;
            }

            var Pro = {
                "ID": $("#hidID").val(),
                "NAME": $("#txtProvider").val(),
                "IsVoip": $('#chkVoip').jqxCheckBox('checked')
            };
            var obji = { Provider: Pro }
            $.ajax({
                type: "POST",
                url: "../../Setting/UpdateProvider",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    alert(result.Message);
                    Clear();
                    FillGrid();
                }
            });
        }
        function Delete() {


            var Pro = {
                "ID": $("#hidID").val()
            };
            var obji = { Provider: Pro }
            $.ajax({
                type: "POST",
                url: "../../Setting/DeleteProvider",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    alert(result.Message);
                    Clear();
                    FillGrid();
                }
            });
        }
        function Clear() {
            $("#grdData").jqxGrid('clearselection');
            $("#hidID").val("");
            $("#txtProvider").val("");
            $("#chkVoip").jqxCheckBox({ checked: false });
            $("#btnAdd").show();
            $("#btnUpdate").hide();
            $("#btnDelete").hide();
        }
    </script>
    <div style="width: 100%">
        <table style="width: 100%">
            <tr>
                <td class="myButton3">Manage Provider
                </td>
            </tr>
        </table>
    </div>
    <div>
        <table>
            <tr>
                <td>
                    <input id="hidID" type="hidden" />
                </td>
            </tr>
            <tr>
                <td>
                    <b>Provider Name :</b>
                </td>
                <td>
                    <input id="txtProvider" type="text" />
                </td>
            </tr>
            <tr>
                <td>
                    <b>Is Voip </b>
                </td>
                <td>
                    <div id="chkVoip">
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <br />
    <div>
        <table>
            <tr>
                <td>
                    <input id="btnAdd" type="button" value="Add" />
                </td>
                <td>
                    <input id="btnUpdate" type="button" value="Update" />
                </td>
                <td>
                    <input id="btnDelete" type="button" value="Delete" />
                </td>
                <td>
                    <input id="btnCancel" type="button" value="Cancel" />
                </td>
            </tr>
        </table>
    </div>
    <br />
    <div>
        <div id="grdData">
        </div>
    </div>
</asp:Content>
