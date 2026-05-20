<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    BillReport
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <link href="../../css/BillReport.css" rel="stylesheet">
    <script src="../../Scripts/BillReport.js"></script>
    <link href="../../css/alert.css" rel="stylesheet" />
    <link href="../../css/theme.css" rel="stylesheet" />
    <script src="../../Scripts/alert.js"></script>

    <div class="container-fluid mt-4">
        <div class="container">
            <div style="width: 100%">
                <table style="width: 100%">
                    <tr>
                        <td class="myButton3">Bill Report
                        </td>
                    </tr>
                </table>
            </div>
            <div class="search-container">
                <div class="filter-section">
                    <div class="row mb-3" style="display: flex; justify-content: flex-end; align-items: center;">
                        <div class="col-md-3">
                            <label for="cmbMonth" class="form-label"><i class="fas fa-calendar-alt me-2"></i><strong>Month</strong></label>
                            <select id="cmbMonth" class="form-select">
                                <option value="0">Select Month</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="cmbYear" class="form-label"><strong>Year</strong></label>
                            <select id="cmbYear" class="form-select">
                                <option value="">Select Year</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="cmbStatus" class="form-label"><i class="fas fa-flag me-2"></i><strong>Status</strong></label>
                            <select id="cmbStatus" class="form-select">
                                <option value="0">Select Status</option>
                                <option value="1">Open</option>
                                <option value="4">Close</option>
                            </select>
                        </div>
                        <!-- Company Dropdown -->
                        <div class="col-md-3">
                            <label for="cmbCompany" class="form-label"><strong>Company</strong></label>
                            <select id="cmbCompany" class="form-select">
                                <option value="">Select Company</option>
                            </select>
                        </div>

                        <input type="hidden" id="hidCompany" />

                    </div>

                    <div class="row mb-12" style="display: flex; justify-content: flex-end; align-items: center;">

                        <div class="col-md-3 d-flex align-items-end">
                            <button id="btnSearch" type="button" class="btn btn-primary me-2">
                                <i class="fas fa-search me-2"></i>Search
                            </button>
                            <button id="btnCancel" type="button" class="btn btn-secondary">
                                <i class="fas fa-times me-2"></i>Cancel
                            </button>
                        </div>
                    </div>



                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">

                <table id="grdData" class="table table-striped table-hover boxed-table" style="display: none;">
                    <thead class="header-bg">
                        <tr>
                            <th>Employee Number</th>
                            <th>Employee Name</th>
                            <th>Mobile Number</th>
                            <th>Mobile Description</th>
                            <th>Manager Name</th>
                            <th>Bill Date</th>
                            <th>Bill Amount</th>
                            <th>Deductible Amount</th>
                            <th>Charge to Business</th>
                            <th>Bill Status</th>
                            <th>Last Updated On</th>
                            <th>Forced Date</th>
                            <th>Forced by User</th>
                            <th>Previous Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>

                </table>
                <input id="btnBillReportExport" type="button" value="Export To Excel" class="btn btn-primary me-2"/>
            </div>
        </div>
    </div>

</asp:Content>
