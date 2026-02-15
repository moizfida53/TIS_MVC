<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    ChangeStatus
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <%--<link href="https://cdn.datatables.net/2.0.0/css/dataTables.bootstrap5.min.css" rel="stylesheet">--%>
    <link href="../../css/BillReport.css" rel="stylesheet">

    <%--<script src="https://cdn.datatables.net/2.0.0/js/dataTables.min.js"></script>--%>
    <script src="../../Scripts/alert.js"></script>
    <%--<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>--%>

    <script src="../../Scripts/ChangeStatus.js"></script>

    


    <div class="container-fluid mt-4">
       

        <div class="container">
                   <div style="width: 100%">
    <table style="width: 100%">  
        <tr>
            <td class="myButton3">Change Bill Status
            </td>
        </tr>
    </table>
</div>
            <div class="search-container">
                <div class="filter-section">
                    <div class="row mb-3">
                                                <input id="hidEmp" type="hidden" />

                        <div class="col-md-3" style="margin-bottom: 15px;">
                            <label for="cmbMonth" class="form-label"><i class="fas fa-calendar-alt me-2"></i><strong>Month</strong></label>
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
                        </div>
                        <div class="col-md-3">
                            <label for="cmbYear" class="form-label"><i class="fas fa-calendar-alt me-2"></i><strong>Year</strong></label>
                            <div id="cmbYear">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label for="cmbProvider" class="form-label"><i class="fas fa-calendar-alt me-2"></i><strong>Provider</strong></label>
                            <div id="cmbProvider">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label for="btnEmployee" class="form-label"><i class="fas fa-calendar-alt me-2"></i><strong>Employee</strong></label>
                            <div id="btnEmployee">
                                <div id="grdEmployee">
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="row mb-3 justify-content-end">


                        <div class="col-md-3 d-flex align-items-end justify-content-end">
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
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
</asp:Content>





