<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Report
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2>REPORT</h2>
    <link href="~/Content/jqx.base.css" rel="stylesheet" type="text/css" />
    <meta name="viewport" content="width=device-width" />
    
   <%-- <script src="~/Scripts/jquery-1.11.1.min.js" type="text/javascript"></script>--%>

    <script src="../../Scripts/jquery-3.7.1.min.js"></script>

    <script src="~/Scripts/jquery.blockUI.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxcore.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxbuttons.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxcalendar.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxdatetimeinput.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxdropdownbutton.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxcheckbox.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxmenu.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxlistbox.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxdropdownlist.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxtabs.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxscrollbar.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.selection.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.filter.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.columnsresize.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.pager.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxdata.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.sort.js" type="text/javascript"></script>
    <script src="~/Scripts/jsrender.min.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxfileupload.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxgrid.edit.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxcombobox.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxwindow.js" type="text/javascript"></script>
    <script src="~/Scripts/jqxswitchbutton.js" type="text/javascript"></script>
    <link href="~/Content/jqx.ui-redmond.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript">


        var Year = [];
        $(document).ready(function () {
            $("#cmbMonth").jqxDropDownList({ placeHolder: 'Select Month', selectedIndex: -1, width: '170px', height: '25px' });
            $("#cmbMonth").jqxDropDownList('loadFromSelect', 'Select');
            $("#Select").hide();
            $("#cmbYear").jqxDropDownList({ placeHolder: 'Select Year', selectedIndex: -1, width: '170px', height: '25' });
            $("#cmbProvider").jqxDropDownList({ placeHolder: 'Select Provider', selectedIndex: -1, width: 170, height: 25 });
            $("#cmbStatus").jqxDropDownList({ placeHolder: 'Select Status', selectedIndex: -1, width: 170, height: 25 });
            $("#cmbStatus").jqxDropDownList('loadFromSelect', 'Select1');
            $("#Select1").hide();
            $("#btnSearch").jqxButton({ template: 'primary' });
            $('#btnSearch').on('click', function () {
                Search();

            });
            $("#btnCancel").jqxButton({ template: 'primary' });
            $('#btnCancel').on('click', function () {
                Clear();
            });
            FillYear();
            GetData();
        })

        function GetData() {
            $.ajax({
                type: "GET",
                url: "../../Report/GetReport",
                data: { "IsStatus": "true" },
                success: function (result) {

                    var Provider = result.ProviderList;
                    //                    var Status = result.dtStatus;
                    FillProvider(Provider);
                    //                    FillStatus(Status);

                }
            })
        }

        function FillProvider(Provider) {
            var source =
            {
                dataType: "json",
                dataFields: [
                    { name: 'ID', type: 'string' },
                    { name: 'Name', type: 'string' }
                ],
                id: 'ID',
                localdata: Provider
            };
            var dataAdapterPr = new $.jqx.dataAdapter(source);
            // Create a jqxComboBox
            $("#cmbProvider").jqxDropDownList({ source: dataAdapterPr, displayMember: "Name", valueMember: "ID" });

        }


        //        function FillStatus(Status) {
        //            var source =
        //            {
        //                dataType: "json",
        //                dataFields: [
        //                    { name: 'ID', type: 'number' },
        //                    { name: 'Name', type: 'string' }
        //                ],
        //                id: 'ID',
        //                localdata: Status
        //            };
        //            var dataAdapterPr = new $.jqx.dataAdapter(source);
        //            DataAdapStatus = dataAdapterPr;
        //            // Create a jqxComboBox
        //            $("#cmbStatus").jqxDropDownList({ source: dataAdapterPr, displayMember: "Name", valueMember: "ID" });
        //        }

        function Search() {
            var Provider = 0; var Month = 0; var Year = 0; var Status = 0;

            if ($("#cmbProvider").jqxDropDownList('getSelectedItem') != null) {
                Provider = $("#cmbProvider").jqxDropDownList('getSelectedItem');
            }
            if ($("#cmbMonth").val() != null) {
                Month = $("#cmbMonth").val();
            }

            if ($("#cmbYear").jqxDropDownList('getSelectedItem') != null) {
                Year = $("#cmbYear").jqxDropDownList('getSelectedItem');
            }

            if ($("#cmbStatus").jqxDropDownList('getSelectedItem') != null) {
                Status = $("#cmbStatus").jqxDropDownList('getSelectedItem');
            }

            var Search = {
                "Month": Month,
                "Year": Year.label,
                "Provider": Provider.value,
                "Status": Status.value

            };
            var obji = { Search: Search }
            $.ajax({
                type: "POST",
                url: "../../Report/Search",
                data: JSON.stringify(obji),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    FillGrid(result.dtData);
                    $("#grdData").show();

                }
            })
        }

        function FillGrid(dtData) {

            var deptsource =
            {
                localdata: dtData,
                datafields:
                    [
                        { name: 'BILL_ID', type: 'number' },


                        { name: 'EMPLOYEENAME', type: 'string' },

                        { name: 'SUB_NO', type: 'number' },
                        { name: 'BILLDATE', type: 'date' },
                        { name: 'TOTALAMOUNT', type: 'number' },
                        { name: 'LMEmail', type: 'string' }

                    ],
                id: 'BILL_ID',
                datatype: "json"
            };

            var dataAdapGrid = new $.jqx.dataAdapter(deptsource);

            $("#grdData").jqxGrid({
                width: '100%',
                source: dataAdapGrid,
                columnsresize: true,
                theme: 'arctic',
                pageSize: 10,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                pageable: true,
                theme: 'ui-redmond',
                selectionmode: 'singlecell',
                editable: true,
                editmode: 'selectedcell',
                columns: [
                    { dataField: 'BILL_ID', text: 'Id' },


                    { dataField: 'EMPLOYEENAME', text: 'Employee Name', width: '150px' },

                    { dataField: 'SUB_NO', text: 'Sub No.' },
                    { dataField: 'BILLDATE', text: 'Bill Date.', cellsformat: 'dd-MM-yyyy' },
                    { dataField: 'TOTALAMOUNT', text: 'Total Amount' },
                    { dataField: 'LMEmail', text: 'Email Address' }


                ]
            });
        }

        function FillYear() {
            for (var i = 2013; i <= 2018; i++) {
                Year.push(i);
            }
            $("#cmbYear").jqxDropDownList({ source: Year });
        }

        function Clear() {
            $("#cmbMonth").jqxDropDownList({ selectedIndex: -1 });
            $("#cmbYear").jqxDropDownList({ selectedIndex: -1 });
            $("#cmbProvider").jqxDropDownList({ selectedIndex: -1 });
            $("#hidEmp").val('');
            $("#grdData").jqxGrid('clearselection');
            $("#grdData").hide();

        }

    </script>
    <div>
        <div>
            <table>
                <tr>
                    <td>
                        <b>Month</b>
                    </td>
                    <td>
                        <div id="cmbMonth">
                        </div>
                        <select id="Select">
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
                    <td>
                        <b>Year</b>
                    </td>
                    <td>
                        <div id="cmbYear">
                        </div>
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
                        <b>Status</b>
                    </td>
                    <td>
                        <div id="cmbStatus">
                        </div>
                        <select id="Select1">
                            <option value="1" label="Open"></option>
                            <option value="4" label="Close"></option>
                        </select>
                    </td>
                </tr>
            </table>
            <br />
            <table>
                <tr>
                    <td></td>
                    <td>
                        <input id="btnSearch" type="button" value="Search" />
                    </td>
                    <td>
                        <input id="btnCancel" type="button" value="Cancel" />
                    </td>
                </tr>
            </table>
        </div>
        <br />
        <br />
        <div id="grdData">
        </div>
    </div>
</asp:Content>
