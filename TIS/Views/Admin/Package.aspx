<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Package
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <link href="~/Content/jqx.base.css" rel="stylesheet" type="text/css" />
    <meta name="viewport" content="width=device-width" />
    <link href="../../Scripts/all.min.css" rel="stylesheet" />
    <link href="../../css/BillReport.css" rel="stylesheet">
    <link href="../../css/alert.css" rel="stylesheet" />
    <link href="../../css/theme.css" rel="stylesheet" />
    <link href="../../css/ManageCallType.css" rel="stylesheet" />
    <link href="../../css/ManageEmployee.css" rel="stylesheet" />

    <style>
        .jqx-combobox-arrow-normal, .jqx-action-button {
            height: 5px !important;
            width: 15px !important;
            left: 200px !important;
            margin-top: 5px !important;
        }

        .jqx-datetimeinput,
        .jqx-datetimeinput input {
            border: none !important;
            padding: 5px 15px !important;
        }

        .gap-3rem {
            gap: 3rem;
        }

        .checkbox-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 37px;
        }

        #cmbProvider, #cmbTransType, #btnDesc, #cmbCallType, #cmbLineType, #btnEmployee {
            width: 90% !important;
            display: block !important;
        }

        .jqx-input-content {
            margin-top: 5px !important;
        }
    </style>
    <script src="../../scripts/Package.js"></script>
    <div class="container-fluid mt-3">
        <!-- Header -->
        <div class="row">
            <div class="col-12">
                <div class="myButton3">Manage Packages</div>
            </div>
        </div>

        <!-- Main Form Panel -->
        <div id="Panel1">
            <input id="hidDID" type="hidden" />
            <input id="hidMID" type="hidden" />

            <!-- First Row: Package Name & Description -->
            <div class="row gap-3rem form-group-spacing">
                <div class="col-xl-3 col-lg-4 col-md-6">
                    <label class="form-label">Package Name</label>
                    <input id="txtPkgName" class="form-control" type="text" placeholder="Enter package name" />
                </div>

                <div class="col-xl-3 col-lg-4 col-md-6">
                    <label class="form-label">Package Description</label>
                    <input id="txtPkgDesc" class="form-control" type="text" placeholder="Enter description" />
                </div>
            </div>

            <!-- Second Row: Provider, TransType, Description -->
            <div class="row gap-3rem form-group-spacing">
                <div class="col-xl-3 col-lg-4 col-md-6">
                    <label class="form-label">Provider</label>
                    <div id="cmbProvider"></div>
                </div>

                <div class="col-xl-3 col-lg-4 col-md-6">
                    <label class="form-label">Transaction Type</label>
                    <div id="cmbTransType"></div>
                </div>

                <div class="col-xl-3 col-lg-4 col-md-6">
                    <label class="form-label">Description</label>
                    <div id="cmbDesc"></div>
                </div>

                <div class="col-xl-3 col-lg-4 col-md-6">
                    <div class="checkbox-wrapper">
                        <div id="chkAll"></div>
                        <label class="mb-0">Make All Unexpected</label>
                    </div>
                </div>
            </div>

            <!-- Third Row: Expected Type, Amount Limit, Start Date -->
            <div class="row gap-3rem form-group-spacing" id="trER">
                <div class="col-xl-3 col-lg-4 col-md-6">
                    <label class="form-label">Expected Type</label>
                    <select class="form-select" id="cmbExpType">
                        <option label="Enable" value="1" selected="selected"></option>
                        <option label="Restrict" value="0"></option>
                    </select>
                </div>

                <div class="col-xl-3 col-lg-4 col-md-6">
                    <label class="form-label">Amount Limit</label>
                    <input id="txtAmount" class="form-control" type="text" placeholder="Enter amount" />
                </div>

                <div class="col-xl-3 col-lg-4 col-md-6">
                    <label class="form-label">Start Date</label>
                    <div id="cmbStartDate"></div>
                </div>
            </div>

            <!-- Action Buttons for Detail Grid -->
            <div class="row">
                <div class="col-12">
                    <div class="d-flex gap-3 flex-wrap justify-content-end">
                        <input type="button" value="Add" id='btnAdd' class="btn btn-primary" />
                        <input type="button" value="Update" id='btnUpdate' class="btn btn-warning" />
                        <input type="button" value="Cancel" id='btnCancel' class="btn btn-secondary" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Master Grid with Nested Detail Grid -->
        <div class="row mt-4">
            <div class="col-12">
                <div id="grdMaster"></div>
            </div>
        </div>

        <!-- Package Action Buttons -->
        <div class="row mt-3">
            <div class="col-12">
                <div class="d-flex gap-3 flex-wrap justify-content-end">
                    <input type="button" value="Save Package" id='btnSavePackage' class="btn btn-success" />
                    <input type="button" value="Update Package" id='btnUpdatePackage' class="btn btn-warning" />
                </div>
            </div>
        </div>
    </div>
</asp:Content>