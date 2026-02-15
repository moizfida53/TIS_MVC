<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    UnAssignedInvoice
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <link href="../../css/ForceBill.css" rel="stylesheet" />

    <style>
        .button-container{
            margin: 1rem 0 0 1rem;
    gap: 3rem !important;
    display: flex;
    justify-content: flex-start;
    align-items: center;
        }
    </style>

    <script type="text/javascript">
        $(document).ready(function () {
           /* $("#btnAssign").jqxButton({ width: '50' });*/
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
        <%--<div>
            <table>
                <tr>
                    <td>
                        <input id="btnAssign" type="button" value="Assign Records" />
                    </td>
                </tr>
            </table>
        </div>--%>
        <br />
        <div>
            <div id="grdData">
            </div>
        </div>
        <%--<div>
            <table>
                <tr>
                    <td>
                        <input id="excelExport" type="button" value="Export To Excel" />
                    </td>
                </tr>
            </table>
        </div>--%>
                <div class="button-container" style="margin:1rem 0 0 1rem;">
            <button id="excelExport" style="background:linear-gradient(135deg, #10b981 0%, #059669 100%);" class="main-button btn-export">
                <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50">
                    <path d="M28.8125 .03125L.8125 5.34375C.339844 
5.433594 0 5.863281 0 6.34375L0 43.65625C0 
44.136719 .339844 44.566406 .8125 44.65625L28.8125 
49.96875C28.875 49.980469 28.9375 50 29 50C29.230469 
50 29.445313 49.929688 29.625 49.78125C29.855469 49.589844 
30 49.296875 30 49L30 1C30 .703125 29.855469 .410156 29.625 
.21875C29.394531 .0273438 29.105469 -.0234375 28.8125 .03125ZM32 
6L32 13L34 13L34 15L32 15L32 20L34 20L34 22L32 22L32 27L34 27L34 
29L32 29L32 35L34 35L34 37L32 37L32 44L47 44C48.101563 44 49 
43.101563 49 42L49 8C49 6.898438 48.101563 6 47 6ZM36 13L44 
13L44 15L36 15ZM6.6875 15.6875L11.8125 15.6875L14.5 21.28125C14.710938 
21.722656 14.898438 22.265625 15.0625 22.875L15.09375 22.875C15.199219 
22.511719 15.402344 21.941406 15.6875 21.21875L18.65625 15.6875L23.34375 
15.6875L17.75 24.9375L23.5 34.375L18.53125 34.375L15.28125 
28.28125C15.160156 28.054688 15.035156 27.636719 14.90625 
27.03125L14.875 27.03125C14.8125 27.316406 14.664063 27.761719 
14.4375 28.34375L11.1875 34.375L6.1875 34.375L12.15625 25.03125ZM36 
20L44 20L44 22L36 22ZM36 27L44 27L44 29L36 29ZM36 35L44 35L44 37L36 37Z">
                    </path>
                </svg>
                Export To Excel
            </button>
            <input id="btnAssign"  style="background:#26a8b9;" type="button" value="Assign Records" class="main-button btn-force" />
        </div>
    </div>
</asp:Content>
