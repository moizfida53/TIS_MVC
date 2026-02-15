<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    UnAssignedInvoice
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <script type="text/javascript">
        $(document).ready(function () {
            $("#btnAssign").jqxButton({ width: '50' });
            $("#btnAssign").on('click', function () {
                AssignInvoice();
            });
            //$("#btnExportToExcel").jqxButton({ width: '200' });
            //$("#btnExportToExcel").on('click', function () {
            //    ExportToExcel();
            //});

            $("#excelExport").click(function () {
                saveMyFile($('#SubmitForm'), "My Excel File" + ".xls", $("#grdData").jqxGrid('exportdata', 'xls'));
            });

            FillGrid();
        })

        function FillGrid() {

            $.ajax({
                type: "GET",
                cache: false,
                url: "../../Import/GetUnAssignedBill",
                success: function (result) {
                    var Bills = result.Bills;
                    var deptsource =
                    {
                        localdata: Bills,
                        datafields:
                            [
                                { name: 'BillDate', type: 'date' },
                                { name: 'Mobile', type: 'string' },
                                { name: 'ProviderName', type: 'string' },
                                { name: 'TotalAmount', type: 'number' }
                            ],
                        datatype: "json"
                    };

                    var dataAdapterCategory = new $.jqx.dataAdapter(deptsource);
                    $("#grdData").jqxGrid({
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
                        columns: [
                            { dataField: 'BillDate', text: 'BillDate', cellsformat: 'MMMM-yyyy', cellsalign: 'center', width: '130px' },
                            { dataField: 'Mobile', text: 'Mobile' },
                            { dataField: 'ProviderName', text: 'ProviderName' },
                            { dataField: 'TotalAmount', text: 'TotalAmount' }

                        ]
                    });
                }
            });
        }

        function AssignInvoice() {
            $.ajax({
                type: "GET",

                url: "../../Import/AssignInvoice",
                success: function (result) {
                    alert(result.Message);
                    FillGrid();
                }
            });
        }

        function saveMyFile(ref, fname, text, mime) {
            var blob = new Blob([text], { type: mime });
            saveAs(blob, fname);
            return false;
        }

        //function ExportToExcel() {
        //    $("#grdData").jqxGrid('exportdata', 'xls', 'UnAssignedBills');
        //}
    </script>
    <div style="width: 100%">
        <table style="width: 100%">
            <tr>
                <td class="myButton3">Un-Assinged Bills
                </td>
            </tr>
        </table>
    </div>
    <div>
        <br />
        <div>
            <table>
                <tr>
                    <td>
                        <input id="btnAssign" type="button" value="Assign Records" />
                    </td>
                </tr>
            </table>
        </div>
        <br />
        <div>
            <div id="grdData">
            </div>
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
</asp:Content>
