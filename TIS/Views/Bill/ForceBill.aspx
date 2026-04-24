<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master"
    Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    ForceBill
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <input type="hidden" id="hidUID" value="<%=Session["EmpUID"]%>" />
    <link href="../../css/alert.css" rel="stylesheet" />
    <link href="../../css/theme.css" rel="stylesheet" />
    <script src="../../Scripts/alert.js"></script>
    <link href="../../css/Force-bill.css" rel="stylesheet" />
    <script src="../../Scripts/Force-bill.js"></script>



    <div style="width: 100%">
        <table style="width: 100%">
            <tr>
                <td class="myButton3">Force Bills</td>
            </tr>
        </table>
    </div>

    <div>
        <br />
        <div>
            <div id="grdData"></div>
        </div>

        <!-- Export and Force Bill Buttons at Bottom -->
        <div class="button-container">
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
            <input id="btnForceBillOpen" type="button" value="⚡ Force Bill" class="main-button btn-force" />
        </div>
    </div>

    <!-- Custom Alert Modal -->
    <div class="custom-alert-overlay">
        <div class="custom-alert-container">
            <div class="custom-alert-header">
                <div class="custom-alert-icon" id="customAlertIcon">⚠️</div>
                <h3 class="custom-alert-title" id="customAlertTitle">Alert</h3>
            </div>
            <div class="custom-alert-body">
                <p class="custom-alert-message" id="customAlertMessage">This is an alert message</p>
            </div>
            <div class="custom-alert-footer">
                <button class="custom-alert-btn">OK</button>
            </div>
        </div>
    </div>

    <!-- Force Bill Modal -->
    <div class="force-bill-modal">
        <div class="force-bill-modal-container">
            <div class="force-bill-header">
                <h2>Force Bill Configuration</h2>
                <button class="modal-close-btn">×</button>
            </div>
            <div class="force-bill-body">
                <div class="config-horizontal-card">
                    <!-- Dropdowns Section -->
                    <div class="card-section">
                        <div class="section-label">Bill Configuration</div>
                        <div class="horizontal-row">
                            <div class="field-wrapper">
                                <label class="field-label">Save unidentified Calls as:</label>
                                <select id="cmbCallType">
                                    <option label="Business" value="1"></option>
                                    <option label="Personal" value="2" selected="selected"></option>
                                </select>
                            </div>
                            <div class="field-wrapper">
                                <label class="field-label">Set Bill Status to:</label>
                                <select id="cmbStatus">
                                    <option label="Waiting For Line Manager Approval" value="2"></option>
                                    <option label="Closed" value="4" selected="selected"></option>
                                </select>
                            </div>
                        </div>
                    </div>



                    <!-- ✅ Checkboxes Section -->
                    <div class="card-section">
                        <div class="section-label">Additional Options</div>

                        <div class="checkbox-row">
                            <label class="checkbox-wrapper">
                                <input type="checkbox" id="chkWavRtl">
                                <span class="custom-checkbox"></span>
                                <span class="checkbox-label">Waive Rental Charges</span>
                            </label>

                            <label class="checkbox-wrapper">
                                <input type="checkbox" id="chkWavBus">
                                <span class="custom-checkbox"></span>
                                <span class="checkbox-label">Waive Business Charges</span>
                            </label>

                            <label class="checkbox-wrapper">
                                <input type="checkbox" id="chkAlwTrain">
                                <span class="custom-checkbox"></span>
                                <span class="checkbox-label">Allow Train</span>
                            </label>
                        </div>
                    </div>



                    <!-- Bottom Actions -->
                    <div class="bottom-actions">
                        <button class="action-btn btn-cancel">✕ Cancel</button>
                        <input id="btnForceBill" type="button" value="Force" class="action-btn btn-execute" />
                    </div>
                </div>
            </div>
        </div>


    </div>
</asp:Content>
