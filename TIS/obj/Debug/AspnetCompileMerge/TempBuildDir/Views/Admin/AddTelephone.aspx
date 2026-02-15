<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    AddTelephone
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../Scripts/jqxgrid.grouping.js"></script>
    <link href="../../css/ManageEmployee.css" rel="stylesheet" />
    <script src="../../Scripts/AddTelephone.js"></script>
    <!-- Add this in your <head> section if you haven't already -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  
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
                            <label for="cmbProvider" class="form-label"><i class="fas fa-network-wired me-2"></i>Provider</label>
                            <div id="cmbProvider"></div>
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
                                <option value="0" id="1">Local</option>
                                <option value="1" id="2">Corporate</option>
                            </select>
                        </div>



                        <div class="col-md-6 d-flex justify-content-end gap-2 align-items-end">
                            <button id="btnAdd" type="button" class="btn btn-success h-fit" onclick="AddTelephone()"><i class="fas fa-plus-circle me-2"></i>Add</button>
                            <button id="btnUpdate" type="button" class="btn btn-warning h-fit" onclick="UpdateTelephone()"><i class="fas fa-edit me-2"></i>Update</button>
                            <%--<button id="btnDel" type="button" class="btn btn-danger h-fit" onclick="DelTelephoneClick()"><i class="fas fa-trash-alt me-2"></i>Delete</button>--%>
                            <button id="btnCancel" type="button" class="btn btn-secondary h-fit" onclick="ClearTelephone()"><i class="fas fa-times me-2"></i>Cancel</button>
                        </div>

                    </div>


                </div>

                <div id="grdTelephone" class="mt-4"></div>
            </div>

            <!-- ===================== ASSIGN TELEPHONE ===================== -->
            <div class="tab-pane" id="AssignTelephone" role="tabpanel" aria-labelledby="assign-tab">

                <div class="container-fluid form-section p-4 border rounded bg-light shadow-sm">
                    <input id="hidAID" type="hidden" />
                    <input id="hidEmployee" type="hidden" />
                    <input id="hidNumber" type="hidden" />

                    <div class="row mb-3">


                        <div class="col-md-3">
                            <label for="cmbEmployee" class="form-label"><i class="fas fa-user-tie me-2"></i>Select Employee</label>
                            <div id="cmbEmployee" class="form-control">
                                <div id="grdEmployee"></div>
                            </div>
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

                    </div>

                    <div class="row mb-4 justify-content-between">

                        <div class="row w-50">
                            <div class="col-md-4">
                                <label for="cmbStartDate" class="form-label">
                                    <i class="fas fa-calendar-day me-2"></i>Start Date
                                </label>
                                <input type="date" id="cmbStartDate" class="form-control" />
                            </div>

                            <div class="col-md-4">
                                <label for="cmbEndDate" class="form-label">
                                    <i class="fas fa-calendar-day me-2"></i>End Date
                                </label>
                                <input type="date" id="cmbEndDate" class="form-control" />
                            </div>

                        </div>

                        <div class="col-md-4 d-flex justify-content-end gap-4 align-items-end">
                            <button id="btnAssign" type="button" class="btn btn-success" onclick="Assign()"><i class="fas fa-plus me-2"></i>Assign</button>
                            <button id="btnUpdateAsg" type="button" class="btn btn-warning" onclick="UpdateAssign()"><i class="fas fa-edit me-2"></i>Update</button>
                            <%--<button id="btnDelAsg" type="button" class="btn btn-danger" onclick="DelAssignClick()"><i class="fas fa-trash me-2"></i>Delete</button>--%>
                            <button id="btnCancelAsg" type="button" class="btn btn-secondary" onclick="ClearAssign()"><i class="fas fa-times me-2"></i>Cancel</button>
                        </div>

                    </div>
                </div>

                <div id="grdAssignNo" class="mt-4"></div>
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
                <button id="btnAddCountry" type="button" onclick="AddCountry()" class="btn btn-success Btnstyle">
                    <i class="fas fa-plus-circle me-2"></i>Add
                </button>
                <button id="btnUpdateCountry" type="button" onclick="UpdateCountry()" class="btn btn-warning Btnstyle">
                    <i class="fas fa-edit me-2"></i>Update
                </button>
                <button id="btnDeleteCountry" type="button" onclick="DeleteCountry()" class="btn btn-danger Btnstyle">
                    <i class="fas fa-trash-alt me-2"></i>Delete
                </button>
                <button id="btnCancleCountry" type="button" onclick="ClearCountry()" class="btn btn-secondary Btnstyle">
                    <i class="fas fa-times me-2"></i>Cancel
                </button>
            </div>

            <div class="table-section mt-4">
                <div id="grdCountries"></div>
            </div>
        </div>
    </div>





</asp:Content>

