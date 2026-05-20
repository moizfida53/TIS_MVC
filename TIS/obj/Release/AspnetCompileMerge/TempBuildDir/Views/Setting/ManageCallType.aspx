<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    ManageCallType
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <link href="../../css/all.min.css" rel="stylesheet" />
    <link href="../../css/BillReport.css" rel="stylesheet">
    <link href="../../css/select2.min.css" rel="stylesheet" />
    <link href="../../css/alert.css" rel="stylesheet" />
    <link href="../../css/theme.css" rel="stylesheet" />
    <script src="../../Scripts/alert.js"></script>
    <script src="../../Scripts/ManageCallType.js"></script>
    <link href="../../css/ManageCallType.css" rel="stylesheet" />
    <script src="../../Scripts/select2.min.js"></script>

    <div class="container-fluid mt-3">
        <!-- Header -->
        <div class="row">
            <div class="col-12">
                <div class="myButton3">Manage Policy</div>
            </div>
        </div>

        <!-- Main Form Panel -->
        <div id="Panel1">
            <input id="hidID" type="hidden" />
            <!-- First Row: 4 columns -->
            <!-- First Row -->
            <div class="row g-4 form-group-spacing" style="gap: 4rem;">
                <!-- Provider -->
                <div class="col-xl-2 col-lg-4 col-md-6">
                    <label class="form-label">Provider</label>
                    <select id="cmbProvider" class="form-select">
                    </select>
                </div>

                <!-- Trans Type -->
                <div class="col-xl-2 col-lg-4 col-md-6">
                    <label class="form-label">Trans Type</label>
                    <select id="cmbTransType" class="form-select">
                    </select>
                </div>

                <!-- Description -->
                <div class="col-xl-2 col-lg-4 col-md-6">
                    <label class="form-label">Description</label>
                    <select id="cmbDesc" class="form-select">

                        <!-- options will be added dynamically -->
                    </select>
                </div>


                <!-- All Description -->
                <div class="col-xl-4 col-lg-4 col-md-6 d-flex align-items-end">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="chkAllDesc">
                        <label class="form-check-label" for="chkAllDesc">
                            All Description
                        </label>
                    </div>
                </div>

            </div>

            <!-- Second Row: Line Type & Employee -->
            <div class="row g-4 form-group-spacing" style="gap: 4rem;">
                <!-- Line Type -->
                <%--<div class="col-xl-2 col-lg-3 col-md-4">
                    <label class="form-label">Line Type</label>
                    <select id="cmbLineType" class="form-select">
                        <option value="">Select Line Type</option>
                        <option value="1">Voice</option>
                        <option value="2">Data</option>
                        <option value="3">VTS</option>
                    </select>
                </div>--%>
                <!-- Line Type -->
                <div class="col-xl-2 col-lg-3 col-md-4">
                    <label class="form-label">Line Type</label>
                    <select id="cmbLineType" class="form-select">
                        <option value="">Select Line Type</option>
                    </select>
                </div>

                <!-- CallType -->
                <div class="col-xl-2 col-lg-3 col-md-4">
                    <label class="form-label">Call Type</label>
                    <select id="cmbCallType" class="form-select">
                        <option value="">Select Call Type</option>
                        <!-- Options will be filled by AJAX -->
                    </select>
                </div>

                <!-- Employee -->
                <div class="col-xl-2 col-lg-3 col-md-4">
                    <label class="form-label">Employee</label>
                    <div id="btnEmployee">
                        <div id="grdEmployee"></div>
                    </div>
                </div>

                <div class="col-xl-4 col-lg-6 col-md-8">
                    <div class="d-flex align-items-center gap-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="chkAllEmp">
                            <label class="form-check-label mb-0" for="chkAllEmp">All Employee</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="chkSupImp">
                            <label class="form-check-label mb-0" for="chkSupImp">Super Impose</label>
                        </div>
                    </div>
                </div>


                <!-- Action Buttons -->
                <div class="row">
                    <div class="col-12">
                        <div class="d-flex gap-3 flex-wrap justify-content-end">
                            <input type="button" value="Add" id='btnAdd' class="btn btn-primary" />
                            <input type="button" value="Update" id='btnUpdate' class="btn btn-warning" />
                            <input type="button" value="Apply" id='btnApply' class="btn btn-success" />
                            <input type="button" value="Cancel" id='btnCancel' class="btn btn-secondary" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Data Grid -->
            <div class="row mt-4">
                <div class="col-12">
                    <div id="grdData"></div>
                </div>
            </div>
        </div>

        <!-- Employee List Modal Window -->
        <div id='jqxwindow'>
            <div><b>Employees</b></div>
            <br />
            <div id="grdEmpList"></div>
        </div>
    </div>
</asp:Content>
