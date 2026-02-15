
<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    ManageCallType


</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="../../css/BillReport.css" rel="stylesheet">

    <link href="../../css/alert.css" rel="stylesheet" />
    <link href="../../css/theme.css" rel="stylesheet" />
    <script src="../../Scripts/alert.js"></script>
    <script src="../../Scripts/ManageCallType.js"></script>
    <link href="../../css/ManageCallType.css" rel="stylesheet" />

  

    <div class="container-fluid mt-3">
        <!-- Header -->


        <div class="row">
            <div class="col-12">
                <div class="myButton3">Manage Call Type</div>
            </div>
        </div>

        <!-- Main Form Panel -->
        <div id="Panel1">
            <input id="hidID" type="hidden" />

            <!-- First Row: 4 columns -->
            <div class="row g-4 form-group-spacing" style="gap: 4rem;">

                <!-- Provider -->
                <div class="col-xl-2 col-lg-4 col-md-6">
                    <label class="form-label">Provider</label>
                    <div id="cmbProvider"><i class="fa-solid fa-caret-down"></i></div>
                </div>

                <!-- TransType -->
                <div class="col-xl-2 col-lg-4 col-md-6">
                    <label class="form-label">Trans Type</label>
                    <div id="cmbTransType"><i class="fa-solid fa-caret-down"></i></div>
                </div>

                <!-- Description -->
                <div class="col-xl-2 col-lg-4 col-md-6">
                    <label class="form-label">Description</label>
                    <div id="btnDesc">
                        <div id="cmbDesc"></div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6">
                    <div class="checkbox-wrapper">
                        <div id="chkAllDesc"></div>
                        <label class="mb-0">All Description</label>
                    </div>
                </div>


            </div>

            <!-- Second Row: Line Type & Employee -->
            <div class="row g-4 form-group-spacing" style="gap: 4rem;">
                <!-- Line Type -->
                <div class="col-xl-2 col-lg-3 col-md-4">
                    <label class="form-label">Line Type</label>
                    <select id="Select" style="display: none;">
                        <option label="Local" value="0"></option>
                        <option label="International" value="1"></option>
                        <option label="Both" value="2"></option>
                    </select>
                    <div id="cmbLineType"><i class="fa-solid fa-caret-down"></i></div>
                </div>


                <!-- CallType -->
                <div class="col-xl-2 col-lg-3 col-md-4">
                    <label class="form-label">Call Type</label>
                    <div id="cmbCallType"><i class="fa-solid fa-caret-down"></i></div>
                </div>



                <!-- Employee -->
                <div class="col-xl-2 col-lg-3 col-md-4">
                    <label class="form-label">Employee</label>
                    <div id="btnEmployee">
                        <div id="grdEmployee"></div>
                    </div>
                </div>

                

                <%--<div class="col-xl-2 col-lg-3 col-md-4">
                    <div class="checkbox-wrapper">
                        <div id="chkAllEmp"></div>
                        <label class="mb-0">All Employee</label>
                    </div>
                </div>--%>

                <div class="col-xl-4 col-lg-6 col-md-8">
                    <div class="checkbox-wrapper">
                        <div id="chkAllEmp"></div>
                        <label class="mb-0">All Employee</label>
                        <div id="chkSupImp" style="margin-left: 20px;"></div>
                        <label class="mb-0">Super Impose</label>
                    </div>
                </div>





            </div>

            <!-- Checkboxes Row -->
            <%--<div class="row g-4 form-group-spacing" style="gap: 4rem;">
                <div class="col-xl-2 col-lg-3 col-md-4">
                    <%--<div class="checkbox-wrapper">
        <div id="chkSupImp"></div>
        <label class="mb-0">Super Impose</label>
    </div>
                </div>

            </div>--%>

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


</asp:Content>
