<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    ImportInvoice
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <!-- Styles -->
    <link href="../../css/alert.css" rel="stylesheet" />
    <link href="../../css/theme.css" rel="stylesheet" />
    <link href="../../css/ManageEmployee.css" rel="stylesheet" />
    <link href="../../css/bootstrap.min.css" rel="stylesheet" />
    <link href="../../css/ImportInvoice.css" rel="stylesheet" />

    <!-- Scripts -->
    <script src="../../Scripts/alert.js"></script>
    <script src="../../Scripts/ImportInvoice.js"></script>
    <script src="../../Scripts/bootstrap.bundle.min.js"></script>
    <script src="../../Scripts/jqxgrid.grouping.js"></script>
    <script src="../../Scripts/sweetalert2@11.js"></script>

    <div style="width: 100%">
        <table style="width: 100%">
            <tr>
                <td class="myButton3">Import Bills</td>
            </tr>
        </table>
    </div>

    <div class="">
        <div class="employee-form-container">
            <!-- Tabs -->
            <ul class="nav nav-tabs" id="importTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="import-tab" data-bs-toggle="tab" data-bs-target="#import" type="button" role="tab">Import</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="excelMapping-tab" data-bs-toggle="tab" data-bs-target="#excelMapping" type="button" role="tab">Excel Mapping</button>
                </li>
            </ul>

            <div class="tab-content mt-3">
                <!-- Import Tab -->
                <div class="tab-pane fade show active" id="import" role="tabpanel">
                    <div class="filter-section">
                        <div class="form-section">
                            <div class="row form-row">
                                <div class="col-md-3">
                                    <label for="cmbMonth" class="form-label"><i class="fas fa-calendar me-2"></i>Select Month</label>
                                    <div class="input-group-icon">
                                        <select id="cmbMonth" class="form-control">
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
                                </div>

                                <div class="col-md-3">
                                    <label for="cmbYear" class="form-label"><i class="fas fa-calendar-alt me-2"></i>Select Year</label>
                                    <div class="input-group-icon">
                                        <select id="cmbYear" class="form-control">
                                            <option value="">Select Year</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <label for="cmbProvider" class="form-label"><i class="fas fa-building me-2"></i>Select Provider</label>
                                    <div class="input-group-icon">
                                        <select id="cmbProvider" class="form-control">
                                            <option value="">Select Provider</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="row form-row">
                                <div class="col-md-3">
                                    <label for="jqxFileUpload" class="form-label"><i class="fas fa-file-upload me-2"></i>Select File</label>
                                    <div class="input-group-icon">
                                        <input type="file" class="form-control" id="jqxFileUpload" />
                                    </div>
                                    <div id="lblFileName" class="form-text"></div>
                                </div>

                                <div class="col-md-2">
                                    <label for="cmbSheet" class="form-label"><i class="fas fa-file-excel me-2"></i>Select Sheet</label>
                                    <div class="input-group-icon">
                                        <select id="cmbSheet" class="form-control"></select>
                                    </div>
                                </div>

                                <div class="col-md-2">
                                    <label for="btnUpload" class="form-label">&nbsp;</label>
                                    <div class="input-group-icon">
                                        <button id="btnUpload" class="btn btn-success w-100" onclick="Upload()"><i class="fas fa-upload me-2"></i>Upload File</button>
                                    </div>
                                </div>

                                <div class="col-md-2">
                                    <label class="form-label"><i class="fas fa-money-bill-wave me-2"></i>Total Amount</label>
                                    <div class="input-group-icon">
                                        <div id="lblBillAmount" class="form-control bg-white" style="border: 1px solid var(--border-color); width: 9rem; height: 2.5rem;"></div>
                                    </div>
                                </div>

                                <div class="col-md-2">
                                    <label for="btnProcess" class="form-label">&nbsp;</label>
                                    <div class="input-group-icon">
                                        <button id="btnProcess" class="btn btn-primary w-100" onclick="ProcessBill()"><i class="fas fa-cog me-2"></i>Process Bill</button>
                                    </div>
                                </div>
                            </div>

                            <div class="row form-row">
                                <div class="col-md-12 d-flex justify-content-end gap-2 align-items-end">
                                    <div class="action-buttons">
                                        <button id="btnSave" type="button" class="btn btn-warning" onclick="SaveChanges()">
                                            <i class="fas fa-save me-2"></i>Save Changes
                                       
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="grdImport"></div>
                    <div id="grdData" class="mt-2"></div>

                    <div class="mt-3 text-end">
                        <button id="excelExport" class="main-button btn-export">
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

                <!-- Excel Mapping Tab -->
                <div class="tab-pane fade" id="excelMapping" role="tabpanel">
                    <div class="filter-section">
                        <div class="form-section">
                            <div class="row form-row">
                                <div class="col-md-3">
                                    <label for="cmbProvider2" class="form-label"><i class="fas fa-building me-2"></i>Select Provider</label>
                                    <div class="input-group-icon">
                                        <select id="cmbProvider2" class="form-control">
                                            <option value="">Select Provider</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <label for="SelectType" class="form-label"><i class="fas fa-list me-2"></i>Select Type</label>
                                    <div class="input-group-icon">
                                        <select id="SelectType" class="form-control">
                                            <option value="0"></option>
                                            <option value="1">Excel</option>
                                            <option value="2">DataBase</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <label for="btnPrevSetting" class="form-label">&nbsp;</label>
                                    <div class="input-group-icon">
                                        <button id="btnPrevSetting" class="btn btn-secondary w-100" onclick="GetSetting()"><i class="fas fa-history me-2"></i>Show Prev Setting</button>
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <label for="btnReset" class="form-label">&nbsp;</label>
                                    <div class="input-group-icon">
                                        <button id="btnReset" class="btn btn-danger w-100" onclick="Clear()"><i class="fas fa-redo me-2"></i>Reset</button>
                                    </div>
                                </div>
                            </div>

                            <div class="row form-row">
                                <div class="col-md-3">
                                    <label for="jqxFileUpload2" class="form-label"><i class="fas fa-file-upload me-2"></i>Select File</label>
                                    <div class="input-group-icon">
                                        <input type="file" class="form-control" id="jqxFileUpload2" />
                                    </div>
                                    <div id="lblFileName2" class="form-text"></div>
                                </div>

                                <div class="col-md-3">
                                    <label for="cmbSheet2" class="form-label"><i class="fas fa-file-excel me-2"></i>Select Sheet</label>
                                    <div class="input-group-icon">
                                        <select id="cmbSheet2" class="form-control"></select>
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <label for="btnUpload2" class="form-label">&nbsp;</label>
                                    <div class="input-group-icon">
                                        <button id="btnUpload2" class="btn btn-success w-100" onclick="UploadSetting()"><i class="fas fa-upload me-2"></i>Upload New Setting</button>
                                    </div>
                                </div>
                            </div>

                            <div class="row form-row">
                                <div class="col-md-12">
                                    <label class="form-label"><i class="fas fa-database me-2"></i>Enter Database Connection Parameter</label>
                                    <div class="input-group-icon">
                                        <input id="txtDataBase" type="text" class="form-control" value="Data Source=(localdb)\Projects;Initial Catalog=TIS;Integrated Security=True;" />
                                    </div>
                                </div>
                            </div>

                            <div class="row form-row">
                                <div class="col-md-3">
                                    <label for="btnTestConn" class="form-label">&nbsp;</label>
                                    <div class="input-group-icon">
                                        <button id="btnTestConn" class="btn btn-primary" onclick="TestConn()"><i class="fas fa-plug me-2"></i>Test Connection</button>
                                    </div>
                                </div>
                                <div class="col-md-9">
                                    <label class="form-label">&nbsp;</label>
                                    <div id="img"></div>
                                </div>
                            </div>

                            <div class="row form-row">
                                <div class="col-md-6">
                                    <label class="form-label"><i class="fas fa-eye me-2"></i>Enter Name of View</label>
                                    <div class="input-group-icon">
                                        <select id="cmbViews" class="form-control"></select>
                                    </div>
                                </div>

                                <div class="col-md-3">
                                    <label for="btnUpload3" class="form-label">&nbsp;</label>
                                    <div class="input-group-icon">
                                        <button id="btnUpload3" class="btn btn-success" onclick="UploadDataSetting()"><i class="fas fa-upload me-2"></i>Upload New DataBase Setting</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Telephone Mapping Table -->
                        <div class="form-section mt-4">
                            <h5 class="section-title"><i class="fas fa-map me-2"></i>Field Mapping Configuration</h5>
                            <table class="table table-bordered table-hover">
                                <thead class="table-light">
                                    <tr>
                                        <th width="30%">Field Name</th>
                                        <th width="70%">Mapping</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong><i class="fas fa-phone me-2"></i>1) Telephone Number</strong></td>
                                        <td>
                                            <%--<div id="dd1"></div>--%>
                                            <select id="dd1" class="form-control"></select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-calendar me-2"></i>2) Bill Date</strong></td>
                                        <td>
                                            <%--<div id="dd2"></div>--%>
                                            <select id="dd2" class="form-control"></select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-calendar-check me-2"></i>3) Transaction Date</strong></td>
                                        <td>
                                            <%--<div id="dd3"></div>--%>
                                            <select id="dd3" class="form-control"></select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-phone-volume me-2"></i>4) Call Type</strong></td>
                                        <td>
                                            <%--<div id="dd4"></div>--%>
                                            <select id="dd4" class="form-control"></select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-mobile-alt me-2"></i>5) Destination No</strong></td>
                                        <td>
                                            <%--<div id="dd5"></div>--%>
                                            <select id="dd5" class="form-control"></select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-clock me-2"></i>6) Time of Call</strong></td>
                                        <td>
                                            <%--<div id="dd6"></div>--%>
                                            <select id="dd6" class="form-control"></select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-hourglass-half me-2"></i>7) Duration (Sec)</strong></td>
                                        <td>
                                            <%--<div id="dd7"></div>--%>
                                            <select id="dd7" class="form-control"></select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-money-bill-wave me-2"></i>8) Amount (KD)</strong></td>
                                        <td>
                                            <%--<div id="dd8"></div>--%>
                                            <select id="dd8" class="form-control"></select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="row form-row">
                                <div class="col-md-12 d-flex justify-content-start gap-2">
                                    <div class="action-buttons">
                                        <button id="btnUpdate" type="button" class="btn btn-warning" onclick="UpdateSetting()">
                                            <i class="fas fa-edit me-2"></i>Update
                                       
                                        </button>
                                        <button id="Button1" type="button" class="btn btn-warning" onclick="UpdateDBSetting()">
                                            <i class="fas fa-database me-2"></i>Update DB
                                       
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
