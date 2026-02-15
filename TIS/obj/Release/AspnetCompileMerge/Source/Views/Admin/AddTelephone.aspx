<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    AddTelephone
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <%-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">--%>
    <link href="../../css/bootstrap.min.css" rel="stylesheet" />
    <%--  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>--%>
    <script src="../../Scripts/bootstrap.bundle.min.js"></script>
    <script src="../../Scripts/jqxgrid.grouping.js"></script>
    <link href="../../css/ManageEmployee.css" rel="stylesheet" />

    <script src="../../Scripts/AddTelephone.js"></script>
    <!-- Add this in your <head> section if you haven't already -->
    <%--    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>--%>
    <script src="../../Scripts/sweetalert2@11.js"></script>



    <div style="width: 100%">
        <table style="width: 100%">
            <tr>
                <td class="myButton3">Manage Telephone
                </td>
            </tr>
        </table>
    </div>
    <div id="jqxTabs" class="telephone-form-container">

        <ul class="nav nav-tabs" id="telephoneTabs" role="tablist">
            <li class="nav-item nav-link active" id="add-tab" data-bs-toggle="tab" data-bs-target="#AddTelephone" role="tab">Add Telephone
            </li>
            <li class="nav-item nav-link" id="assign-tab" data-bs-toggle="tab" data-bs-target="#AssignTelephone" role="tab">Assign Telephone
            </li>
        </ul>


        <div class="tab-content " id="telephoneTabContent">
            <!-- ===================== ADD TELEPHONE ===================== -->
            <div class="tab-pane show active" id="AddTelephone" role="tabpanel" aria-labelledby="add-tab">

                <div class="container-fluid form-section p-4 border rounded bg-light shadow-sm">
                    <input type="hidden" id="hidID" />

                    <div class="row mb-3">

                        <div class="col-md-3">
                            <label for="txtSubNo" class="form-label"><i class="fas fa-phone me-2"></i>Telephone No</label>
                            <input id="txtSubNo" type="text" class="form-control" />
                        </div>

                        <div class="col-md-3">
                            <label for="txtSubDesc" class="form-label"><i class="fas fa-align-left me-2"></i>Description</label>
                            <input id="txtSubDesc" type="text" class="form-control" />
                        </div>

                        <div class="col-md-3">
                             <label for="txtProvider" class="form-label"><i class="fas fa-align-left me-2"></i>Provider</label>
                            <select id="cmbProvider" class="form-select">
                                <option value="">Select Provider</option>
                            </select>


                        </div>

                        <div class="col-md-3">
                            <label for="cmbType" class="form-label"><i class="fas fa-user-tag me-2"></i>Business or Personal</label>
                            <select id="cmbType" class="form-select myButton4">
                                <option value="False" id="3">Personal</option>
                                <option value="True" id="4" selected>Business</option>
                            </select>
                        </div>


                    </div>



                    <div class="row mb-3">


                        <div class="col-md-3">
                            <label for="txtAccountNo" class="form-label"><i class="fas fa-hashtag me-2"></i>Account No</label>
                            <input id="txtAccountNo" type="text" class="form-control" />
                        </div>



                        <div class="col-md-3">
                            <label for="cmbLineType" class="form-label"><i class="fas fa-sitemap me-2"></i>Line Type</label>
                            <select id="cmbLineType" class="form-select myButton4">
                                <option value="">-- Select Line Type --</option>
                            </select>
                        </div>



                        <div class="col-md-6 d-flex justify-content-end gap-2 align-items-end">
                            <button id="btnAdd" type="button" class="btn btn-success h-fit"><i class="fas fa-plus-circle me-2"></i>Add</button>
                            <button id="btnUpdate" type="button" class="btn btn-warning h-fit"><i class="fas fa-edit me-2"></i>Update</button>
                            <%--<button id="btnDel" type="button" class="btn btn-danger h-fit" onclick="DelTelephoneClick()"><i class="fas fa-trash-alt me-2"></i>Delete</button>--%>
                            <button id="btnCancel" type="button" class="btn btn-secondary h-fit"><i class="fas fa-times me-2"></i>Cancel</button>
                        </div>

                    </div>


                </div>

                <div id="grdTelephone" class="mt-4"></div>

                <div class="mt-3 text-end">
                    <button id="btnExportTelephone" class="main-button btn-export">
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

                </div>

            </div>

            <!-- ===================== ASSIGN TELEPHONE ===================== -->
            <div class="tab-pane" id="AssignTelephone" role="tabpanel" aria-labelledby="assign-tab">

                <div class="container-fluid form-section p-4 border rounded bg-light shadow-sm">
                    <input id="hidAID" type="hidden" />
                    <input id="hidEmployee" type="hidden" />
                    <input id="hidNumber" type="hidden" />

                    <div class="row mb-3" style="row-gap: 2rem;">


                        <div class="col-md-3">
                            <label for="cmbEmployee" class="form-label"><i class="fas fa-user-tie me-2"></i>Select Employee</label>
                            <div id="cmbEmployee" class="form-control">
                                <div id="grdEmployee"></div>
                            </div>
                        </div>

                        <div class="col-md-3">
                            <label for="cmbCostCenter" class="form-label">
                                <i class="fas fa-building me-2"></i>Select Cost Center
                            </label>
                            <div id="cmbCostCenter" class="form-control">
                                <div id="grdCostCenter"></div>
                            </div>
                            <input type="hidden" id="hidCostCenter" />
                        </div>


                        <div class="col-md-3">
                            <label for="cmbNumber" class="form-label"><i class="fas fa-phone me-2"></i>Select Number</label>
                            <div id="cmbNumber" class="form-control">
                                <div id="grdNumber"></div>
                            </div>
                        </div>


                        <div class="col-md-2">
                            <label for="cmbLineStatus" class="form-label"><i class="fas fa-shuffle me-2"></i>Line Status</label>
                            <select id="cmbLineStatus" class="form-select myButton4">
                                <option value="0" selected>None</option>
                                <option value="1">Connected</option>
                                <option value="2">Disconnected</option>
                                <option value="3">Transferred</option>
                            </select>
                        </div>



                        <div class="col-md-2">
                            <label for="txtBusLimit" class="form-label"><i class="fas fa-briefcase me-2"></i>Business Limit</label>
                            <input id="txtBusLimit" type="text" class="form-control" />
                        </div>

                        <div class="col-md-2">
                            <label for="txtAlwLimit" class="form-label"><i class="fas fa-wallet me-2"></i>Allowance Limit</label>
                            <input id="txtAlwLimit" type="text" class="form-control" />
                        </div>

                        <div class="col-md-4" style="width: 15.333%;">
                            <label for="cmbStartDate" class="form-label">
                                <i class="fas fa-calendar-day me-2"></i>Start Date
                            </label>
                            <input type="date" id="cmbStartDate" class="form-control" />
                        </div>

                        <div class="col-md-4" style="width: 15.333%;">
                            <label for="cmbEndDate" class="form-label">
                                <i class="fas fa-calendar-day me-2"></i>End Date
                            </label>
                            <input type="date" id="cmbEndDate" class="form-control" />
                        </div>


                        <div class="col-md-4 d-flex justify-content-end gap-4 align-items-end">
                            <button id="btnAssign" type="button" class="btn btn-success"><i class="fas fa-plus me-2"></i>Assign</button>
                            <button id="btnUpdateAsg" type="button" class="btn btn-warning"><i class="fas fa-edit me-2"></i>Update</button>
                            <%--<button id="btnDelAsg" type="button" class="btn btn-danger" onclick="DelAssignClick()"><i class="fas fa-trash me-2"></i>Delete</button>--%>
                            <button id="btnCancelAsg" type="button" class="btn btn-secondary"><i class="fas fa-times me-2"></i>Cancel</button>
                        </div>

                    </div>

                    <div class="row mb-4 justify-content-between">

                        <div class="row w-50">
                        </div>



                    </div>
                </div>

                <div id="grdAssignNo" class="mt-4"></div>

                <div class="mt-3 text-end">
                    <button id="btnExportAssign" class="main-button btn-export">
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

                </div>


            </div>
        </div>
            </div>



    <div id="Window1">
        <!-- Header -->
        <div>
            <b>PROVIDER</b>
        </div>

        <!-- Content -->
        <div class="provider-form-container">
            <input id="ID" type="hidden" />

            <div class="form-section mt-3">
                <label for="txtCountryName" class="form-label">
                    <i class="fas fa-flag me-2"></i>Country Name
                </label>
                <div class="input-group-icon mb-3">
                    <i class="input-icon fas fa-flag"></i>
                    <input id="txtCountryName" type="text" class="form-control" />
                </div>
            </div>

            <div class="action-buttons mt-4 d-flex flex-wrap gap-2">
                <button id="btnAddCountry" type="button" class="btn btn-success Btnstyle">
                    <i class="fas fa-plus-circle me-2"></i>Add
                </button>
                <button id="btnUpdateCountry" type="button" class="btn btn-warning Btnstyle">
                    <i class="fas fa-edit me-2"></i>Update
                </button>
                <button id="btnDeleteCountry" type="button" class="btn btn-danger Btnstyle">
                    <i class="fas fa-trash-alt me-2"></i>Delete
                </button>
                <button id="btnCancleCountry" type="button" class="btn btn-secondary Btnstyle">
                    <i class="fas fa-times me-2"></i>Cancel
                </button>
            </div>

            <div class="table-section mt-4">
                <div id="grdCountries"></div>
            </div>
        </div>
    </div>





</asp:Content>

