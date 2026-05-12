<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    ManageEmployee
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">




    <link href="../../css/ManageEmployee.css" rel="stylesheet" />
    <script src="../../Scripts/jqxgrid.grouping.js"></script>
    <script src="../../Scripts/ManageEmployee.js"></script>


    <div style="width: 100%">
        <table style="width: 100%">
            <tr>
                <td class="myButton3">Manage Employee
                </td>
            </tr>
        </table>
    </div>
    <div class="">
        <div class="employee-form-container">
            <div class="filter-section">
                <div class="hidden-fields">
                    <input type="hidden" id="hidUID" />
                    <input type="hidden" id="hidManager" />
                    <input type="hidden" id="hidRole" />
                    <input type="hidden" id="hidCC" />
                </div>


                <div class="form-section">
                    <div class="row form-row">
                        <div class="col-md-3">
                            <label for="txtEmployeeNo" class="form-label">
                                <i class="fas fa-id-card me-2"></i>Employee No.
                            </label>
                            <div class="input-group-icon">

                                <input id="txtEmployeeNo" type="text" class="form-control" />
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label for="txtName" class="form-label">
                                <i class="fas fa-signature me-2"></i>Employee Name
                            </label>
                            <div class="input-group-icon">

                                <input id="txtName" type="text" class="form-control" />
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label for="txtDept" class="form-label">
                                <i class="fas fa-building me-2"></i>Department
                            </label>
                            <div class="input-group-icon">

                                <input id="txtDept" type="text" class="form-control" />
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label for="txtDesc" class="form-label">
                                <i class="fas fa-briefcase me-2"></i>Designation
                            </label>
                            <div class="input-group-icon">

                                <input id="txtDesc" type="text" class="form-control" />
                            </div>
                        </div>
                    </div>
                    <div class="row form-row">
                        <div class="col-md-3">
                            <label for="txtUsername" class="form-label">
                                <i class="fas fa-user me-2"></i>Username
                            </label>
                            <div class="input-group-icon">

                                <input id="txtUsername" type="text" class="form-control" />
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label for="txtPayroll" class="form-label">
                                <i class="fas fa-money-check me-2"></i>Payroll
                            </label>
                            <div class="input-group-icon">

                                <input id="txtPayroll" type="text" class="form-control" />
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label for="txtEmail" class="form-label">
                                <i class="fas fa-envelope me-2"></i>Email ID
                            </label>
                            <div class="input-group-icon">

                                <input id="txtEmail" type="text" class="form-control" />
                            </div>
                        </div>
                        <div class="col-md-2">
                            <label for="txtExtension" class="form-label">
                                <i class="fas fa-phone me-2"></i>Extension No.
                            </label>
                            <div class="input-group-icon">

                                <input id="txtExtension" type="text" class="form-control" />
                            </div>
                        </div>
                        <div class="col-md-1">
                            <label for="txtGrade" class="form-label">
                                <i class="fas fa-chart-line me-2"></i>Grade
                            </label>
                            <div class="input-group-icon">

                                <input id="txtGrade" type="text" class="form-control" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="row form-row">

                        <div class="col-md-3">
                            <label for="btnCompany" class="form-label">
                                <i class="fas fa-building me-1"></i><strong>Company</strong>
                            </label>
                            <input type="hidden" id="hidCompany" />

                            <div id="btnCompany" class="form-select" style="cursor: pointer;">
                                <div id="grdCompany"></div>
                            </div>
                        </div>





                        <div class="col-md-3">
                            <label class="form-label">
                                <i class="fas fa-money-bill-wave me-2"></i>Cost Center
                            </label>
                            <div class="dropdown-button-container">
                                <div id="btnCC">
                                    <div id="grdCC"></div>
                                </div>
                                <div>
                                    <input id="btnOpenCC" type="button" value="+" />
                                </div>

                            </div>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">
                                <i class="fas fa-user-friends me-2"></i>Select Manager
                            </label>
                            <div class="dropdown-button-container">
                                <div id="btnmanager">
                                    <div id="grdManager"></div>
                                </div>
                            </div>
                        </div>


                        <div class="col-md-2">
                            <label class="form-label">
                                <i class="fas fa-user-tag me-2"></i>Role
                            </label>
                            <div class="dropdown-button-container">
                                <div id="btnRole">
                                    <div id="grdRole"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 d-none">
                            <label class="form-label">
                                <i class="fas fa-globe me-2"></i>Country
                            </label>
                            <div id="lbCountry"></div>
                        </div>

                        <div class="col-md-1">
                            <label class="form-label">
                                <i class="fas fa-globe me-2"></i>Is Active
                            </label>
                            <div class="IsActive-container">
                                <input type="checkbox" name="IsActive" id="IsActive" class="IsActive-input" value="IsActive" />
                            </div>

                        </div>



                    </div>
                    <div class="row form-row">


                        <div class="col-md-12 d-flex justify-content-end gap-2 align-items-end">
                            <div class="action-buttons">
                                <button id="btnAdd" type="button" class="btn btn-success">
                                    <i class="fas fa-plus-circle me-2"></i>Add
                                </button>
                                <button id="btnUpdate" type="button" class="btn btn-warning">
                                    <i class="fas fa-edit me-2"></i>Update
                                </button>
                                <button id="btnDel" type="button" class="btn btn-danger">
                                    <i class="fas fa-trash-alt me-2"></i>Delete
                                </button>
                                <button id="btnCancel" type="button" class="btn btn-secondary">
                                    <i class="fas fa-times me-2"></i>Cancel
                                </button>

                                <button id="btnSyncBapi" type="button" class="btn btn-primary d-none">
                                    <i class="fas fa-sync-alt me-2"></i>Sync Bapi
                                </button>

                                <button id="btnSyncAD" type="button" class="btn btn-primary">
                                    <i class="fas fa-sync-alt me-2"></i>Sync AD
                                </button>

                                <!-- AD Sync Loader Overlay -->
                                <div id="adSyncLoader" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.55); z-index: 9999; align-items: center; justify-content: center;">
                                    <div style="background: #fff; border-radius: 12px; padding: 40px 50px; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.25); min-width: 280px;">
                                        <div style="margin-bottom: 20px;">
                                            <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="30" cy="30" r="26" fill="none" stroke="#e9ecef" stroke-width="6" />
                                                <circle cx="30" cy="30" r="26" fill="none" stroke="#0dcaf0" stroke-width="6"
                                                    stroke-linecap="round" stroke-dasharray="60 100">
                                                    <animateTransform attributeName="transform" type="rotate"
                                                        from="0 30 30" to="360 30 30" dur="0.9s" repeatCount="indefinite" />
                                                </circle>
                                            </svg>
                                        </div>
                                        <div style="font-size: 17px; font-weight: 600; color: #333; margin-bottom: 6px;">
                                            Syncing with Active Directory
       
                                        </div>
                                        <div style="font-size: 13px; color: #6c757d;">
                                            Please wait, this may take a moment...
       
                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div id="grdEmployee">
        </div>

        <div class="mt-3 text-end">
            <button id="btnManageEmployeeExportExcel" class="main-button btn-export">
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
    <div id="Window">
        <div>
            <b>COST CENTER</b>
        </div>
        <div>
            <table>
                <tr>
                    <td>
                        <input id="hidCID" type="hidden" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Cost Center Name</b>
                    </td>
                    <td>
                        <input id="txtCCName" type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Cost Center No</b>
                    </td>
                    <td>
                        <input id="txtCCNum" type="text" />
                    </td>
                </tr>
            </table>
            <table>
                <tr>
                    <td valign="middle" height="80px">
                        <input id="btnAddCC" type="button" value="Add" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnUpdateCC" type="button" value="Update" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnDelCC" type="button" value="Delete" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnCanCC" type="button" value="Cancel" class="Btnstyle" />
                    </td>
                </tr>
            </table>
            <div id="grdCostCenter">
            </div>
        </div>
    </div>
    <div id="Window1">
        <div>
            <b>COUNTRY</b>
        </div>
        <div>
            <table>
                <tr>
                    <td>
                        <input id="ID" type="hidden" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Country Name</b>
                    </td>
                    <td>
                        <input id="txtCountryName" type="text" />
                    </td>
                </tr>

                <tr>
                    <td>
                        <b>Country Code</b>
                    </td>
                    <td>
                        <input id="txtCountryCode" type="text" />
                    </td>
                </tr>

                <tr>
                    <td>
                        <b>Currency</b>
                    </td>
                    <td>
                        <input id="txtCurrency" type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Dail Code</b>
                    </td>
                    <td>
                        <input id="txtDialCode" type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Exchange Rate</b>
                    </td>
                    <td>
                        <input id="txtExchangeRate" type="text" />
                    </td>
                </tr>
            </table>
            <table>
                <tr>
                    <td valign="middle" height="80px">
                        <input id="btnAddCountry" type="button" value="Add" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnUpdateCountry" type="button" value="Update" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnDeleteCountry" type="button" value="Delete" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnCancleCountry" type="button" value="Cancel" class="Btnstyle" />
                    </td>
                </tr>
            </table>
            <div id="grdCountries">
            </div>
        </div>
    </div>
    <div id="Window2">
        <div>
            <b>Manager</b>
        </div>
        <div>
            <table>
                <tr>
                    <td>
                        <input id="UID" type="hidden" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Name:</b>
                    </td>
                    <td>
                        <input id="txtManagerName" type="text" />
                    </td>

                </tr>

                <tr>
                    <td>
                        <b>Employee No.:</b>
                    </td>
                    <td>
                        <input id="txtEmployeeNum" type="text" />
                    </td>
                </tr>
            </table>
            <table>
                <tr>
                    <td valign="middle" height="80px">
                        <input id="btnAddManager" type="button" value="Add" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnUpdateManager" type="button" value="Update" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnDeleteManager" type="button" value="Delete" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnCancleManager" type="button" value="Cancel" class="Btnstyle" />
                    </td>
                </tr>
            </table>
            <div id="grdManager1">
            </div>
        </div>
    </div>
</asp:Content>
