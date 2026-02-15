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
                            <label class="form-label">
                                <i class="fas fa-user-tag me-2"></i>Role
                            </label>
                            <div class="dropdown-button-container">
                                <div id="btnRole">
                                    <div id="grdRole"></div>
                                </div>
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

                        <div class="row form-row">
                        </div>
                    </div>

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

                        <button id="btnSyncBapi" type="button" class="btn btn-primary">
                            <i class="fas fa-sync-alt me-2"></i>Sync Bapi
                        </button>
                    </div>
                </div>
            </div>

        </div>
        <div id="grdEmployee">
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
                        <input id="btnAddCC" type="button" value="Add" onclick="AddCC()" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnUpdateCC" type="button" value="Update" onclick="UpdateCC()" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnDelCC" type="button" value="Delete" onclick="DelCC()" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnCanCC" type="button" value="Cancel" onclick="ClearCC()" class="Btnstyle" />
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
                        <input id="btnAddCountry" type="button" value="Add" onclick="AddCountry()" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnUpdateCountry" type="button" value="Update" onclick="UpdateCountry()"
                            class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnDeleteCountry" type="button" value="Delete" onclick="DeleteCountry()"
                            class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnCancleCountry" type="button" value="Cancel" onclick="ClearCountry()"
                            class="Btnstyle" />
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
                        <input id="btnAddManager" type="button" value="Add" onclick="AddManager()" class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnUpdateManager" type="button" value="Update" onclick="UpdateManager()"
                            class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnDeleteManager" type="button" value="Delete" onclick="DeleteManager()"
                            class="Btnstyle" />
                    </td>
                    <td valign="middle" height="80px">
                        <input id="btnCancleManager" type="button" value="Cancel" onclick="ClearManager()"
                            class="Btnstyle" />
                    </td>
                </tr>
            </table>
            <div id="grdManager1">
            </div>
        </div>
    </div>
</asp:Content>
