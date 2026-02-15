<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    ReAssignBill
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <link href="../../css/dataTables.bootstrap5.min.css" rel="stylesheet" />
    <link href="../../css/BillReport.css" rel="stylesheet">
    <script src="../../Scripts/ReAssign-bill.js"></script>
    <%--<script src="https://cdn.datatables.net/2.0.0/js/dataTables.min.js"></script>--%>
    <script src="../../Scripts/dataTables.min.js"></script>

    <script src="../../Scripts/alert.js"></script>
    <%--<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>--%>

 

    <%--<div style="width: 100%">
        <table style="width: 100%">
            <tr>
                <td class="myButton3">Re-Assign Bills
                </td>
            </tr>
        </table>
    </div>
    <div>
        <div>
            <table>
                <tr>
                    <td>
                        <input id="hidEmp" type="hidden" />
                    </td>
                </tr>
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
                    <td>
                        <b>Employee</b>
                    </td>
                    <td>
                        <div id="btnEmployee">
                            <div id="grdEmployee">
                            </div>
                        </div>
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


                        <input id="btnSave" type="button" value="Save Changes" />
                    </td>
                    <td>
                        <input id="btnCancel" type="button" value="Cancel" />
                    </td>
                </tr>
            </table>
        </div>
        <br />
        <br />
       
    </div>--%>

    <div class="container-fluid mt-4">


        <div class="container">
            <div style="width: 100%">
                <table style="width: 100%">
                    <tr>
                        <td class="myButton3">Re-Assign Bill
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
                            <button id="btnSave" type="button" style="display: none;" class="btn btn-secondary">
                                <i class="fas fa-times me-2"></i>Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Login Modal -->
    <div class="modal-overlay" id="modalOverlay-Assign"></div>
    <div class="modal-container" id="modalContainer-Assign">
        <div class="modal-header" style="padding: 1rem !important;">
            <h2 class="modal-title">Select User to Assign As</h2>
            <button class="modal-close" id="modalClose-Assign">×</button>
        </div>
        <div class="modal-body">
            <div class="search-container">
                <span class="search-icon">🔍</span>
                <input type="text" class="search-input" id="searchInput-Assign" placeholder="Search by name, or employee number...">
            </div>
            <div class="grid-container">
                <div class="grid-header">
                    <div>Employee No</div>
                    <div>Employee Name</div>
                </div>
                <div class="grid-body" id="gridBody-Assign">
                    <div class="loading">Loading employees</div>
                </div>
            </div>
            <div class="row justify-content-end w-100">
                <button id="modelAssign" class="btn btn-primary w-25">Assign</button>
            </div>
        </div>
    </div>

    <div id="grdData"></div>
</asp:Content>
