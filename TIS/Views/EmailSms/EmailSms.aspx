<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/MasterPage.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    EmailSms
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <link href="../../css/alert.css" rel="stylesheet" />
    <link href="../../css/theme.css" rel="stylesheet" />
    <script src="../../Scripts/alert.js"></script>
    <link href="../../css/jqx.darkblue.css" rel="stylesheet" />
    <script src="../../Scripts/jqxgrid.grouping.js"></script>
    <script src="../../Scripts/EmailSms.js"></script>

    <style>
        .myButton {
            -moz-box-shadow: inset 0px 1px 0px 0px #54a3f7;
            -webkit-box-shadow: inset 0px 1px 0px 0px #54a3f7;
            box-shadow: inset 0px 1px 0px 0px #54a3f7;
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #007dc1), color-stop(1, #0061a7));
            background: -moz-linear-gradient(top, #007dc1 5%, #0061a7 100%);
            background: -webkit-linear-gradient(top, #007dc1 5%, #0061a7 100%);
            background: -o-linear-gradient(top, #007dc1 5%, #0061a7 100%);
            background: -ms-linear-gradient(top, #007dc1 5%, #0061a7 100%);
            background: linear-gradient(to bottom, #007dc1 5%, #0061a7 100%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#007dc1', endColorstr='#0061a7',GradientType=0);
            background-color: #007dc1;
            -moz-border-radius: 3px;
            -webkit-border-radius: 3px;
            border-radius: 3px;
            border: 1px solid #124d77;
            display: inline-block;
            cursor: pointer;
            color: #ffffff;
            font-family: Arial;
            font-size: 13px;
            padding: 5px 14px;
            text-decoration: none;
            text-shadow: 0px 1px 0px #154682;
        }

            .myButton:hover {
                background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #0061a7), color-stop(1, #007dc1));
                background: -moz-linear-gradient(top, #0061a7 5%, #007dc1 100%);
                background: -webkit-linear-gradient(top, #0061a7 5%, #007dc1 100%);
                background: -o-linear-gradient(top, #0061a7 5%, #007dc1 100%);
                background: -ms-linear-gradient(top, #0061a7 5%, #007dc1 100%);
                background: linear-gradient(to bottom, #0061a7 5%, #007dc1 100%);
                filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0061a7', endColorstr='#007dc1',GradientType=0);
                background-color: #0061a7;
            }
    </style>

    <div id="jqxTabs">
        <ul>
            <li>Email</li>
            <li>SMS</li>
        </ul>
        <div id="tbEmail">
            <div style="width: 100%">
                <table style="width: 100%">
                    <tr>
                        <td class="myButton3">Email Template
                        </td>
                    </tr>
                </table>
            </div>
            <input type="text" id="hidTemplateID" style="display: none" />
            <table>
                <tr>
                    <td>
                        <table class="myButton1" style="width: 620px">
                            <%--<tr>
            <td>New Template Name</td>
            <td>
                <input id="txtNewTemplateName" type="text" />
            </td>
        </tr>--%>
                            <tr>
                                <td>Select Group</td>
                                <td>
                                    <div id='ddGroups'></div>
                                </td>
                                <td>
                                    <button id="btnPlusGroup" onclick="OpenGroupWindow()">+</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Select Template</td>
                                <td>
                                    <div id="ddTemplate">
                                        <div id="grdTemplate">
                                        </div>
                                    </div>
                                </td>
                                <td id="tdNew">
                                    <button id="btnNew" onclick="New()">+</button>
                                </td>

                                <td id="tdName" style="display: none">New Template Name:
                                <input id="txtNewTemplateName" type="text" /></td>

                            </tr>
                            <tr>
                                <td>Email To:</td>
                                <td>
                                    <input id="txtEmailTo" type="text" />
                                    <button id="btnEmail" onclick="AddEmail()">Add</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Subject</td>
                                <td>
                                    <input id="txtSubject" type="text" />
                                </td>
                            </tr>
                            <tr>
                                <td>Email Text</td>
                                <td>
                                    <textarea id="txtTemplate" rows="7" cols="50"></textarea></td>
                            </tr>
                            <tr>
                                <td>
                                    <button id="btnCreate" onclick="Create()" class="myButton">Create</button>
                                </td>
                                <td>
                                    <button id="btnSave" onclick="Save()" class="myButton">Save</button>
                                </td>
                            </tr>

                        </table>
                    </td>
                    <td>
                        <textarea id="txtEmails" rows="18" cols="50"></textarea>
                    </td>
                </tr>
            </table>



            <table>
                <tr>
                    <td>{0} = Employee Name
                    </td>
                    <td>, {1} = Bill Amount
                    </td>
                    <td>, {2} = Bill Date
                    </td>
                    <td>, {3} = Telephone Number
                    </td>
                    <td>, {4} = Manager
                    </td>
                    <td>, {5} = Provider
                    </td>
                    <td>, {6} = Link
                    </td>
                </tr>
            </table>
            <div id="grdTemplates"></div>
            <button id="btnSend" onclick="Send()" class="myButton">Send Email</button>



            &nbsp
            <br />
            <div align="Center" style="color: green">
                <h1>Email Log </h1>
            </div>
            <div id="grdSendEmail"></div>
            &nbsp
            <div>
                <input id="btnSendEmail" type="button" class="myButton" style="position: relative; left: 45%" value="Send Email" onclick="SendEmail()" />
                <input id="btnDeleteEmail" type="button" class="myButton" style="position: relative; left: 45%" value="Clear" onclick="DeleteEmail()" />
            </div>


        </div>

        <div id="tbSMS">
            <div style="width: 100%">
                <table style="width: 100%">
                    <tr>
                        <td class="myButton3">SMS Template
                        </td>
                    </tr>
                </table>
            </div>

            <b style="float: right">SMS Balance:<label id="lblBalance"></label></b>
            <input type="text" id="hidSMSTemplateID" style="display: none" />
            <table>
                <tr>
                    <td>
                        <table class="myButton1" style="width: 620px">
                            <tr>
                                <td>Select Group</td>
                                <td>
                                    <div id='ddSMSGroups' style="display: inline-block">
                                    </div>
                                </td>
                                <td>
                                    <input style="display: inline-flex; margin-bottom: 5px" id="btnPlusSMSGroup" type="button" onclick="OpenGroupSMSWindow()" value="+" />

                                </td>
                            </tr>
                            <tr>
                                <td>Select Template</td>
                                <td>
                                    <div id="ddSMSTemplate">
                                        <div id="grdSMSTemplate">
                                        </div>
                                    </div>
                                </td>
                                <td id="tdSMSNew">
                                    <button id="btnSMSNew" onclick="NewSMS()">+</button>
                                </td>

                                <td id="tdSMSName" style="display: none">New Template Name:
                                <input id="txtNewSMSTemplateName" type="text" /></td>

                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <button id="btnSMSCreate" onclick="SMSCreate()" class="myButton">Create Template</button>
                                    <%-- </td>
                                <td>--%>
                                    <button id="btnSMSSave" onclick="SMSSave()" class="myButton" style="margin-left: 20px">Save Template</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Mobile:</td>
                                <td>
                                    <input id="txtSMSTo" type="text" />
                                    <button id="btnSMS" onclick="AddNumber()">Add</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Language</td>
                                <td>
                                    <label>
                                        <input id="chkArabic" type="checkbox" class="radio" value="1" name="Lang" onclick="LanguageChk(2)" />Arabic</label>
                                    <label>
                                        <input id="chkEnglish" type="checkbox" class="radio" value="2" name="Lang" onclick="LanguageChk(1)" />English</label>
                                </td>
                            </tr>
                            <tr>
                                <td>SMS</td>
                                <td>
                                    <textarea id="txtSMSTemplate" rows="7" cols="50" disabled="disabled"></textarea>
                                    <label id="Length"></label>
                                    /<label id="TotalLength"></label>
                                </td>
                            </tr>


                        </table>
                    </td>
                    <td>
                        <textarea id="txtMobileNos" rows="18" cols="50"></textarea>
                    </td>
                </tr>
            </table>



            <table>
                <tr>
                    <td>{0} = Employee Name
                    </td>
                    <td>, {1} = Bill Amount
                    </td>
                    <td>, {2} = Bill Date
                    </td>
                    <td>, {3} = Telephone Number
                    </td>
                    <td>, {4} = Manager
                    </td>
                    <td>, {5} = Provider
                    </td>
                    <td>, {6} = Link
                    </td>
                </tr>
            </table>

            <div id="grdSMSTemplates"></div>
            <button id="btnSMSSend" onclick="SendSMS()" class="myButton">Send Email</button>


            &nbsp
            <br />
            <div align="Center" style="color: green">
                <h1>SMS Log </h1>
            </div>
            <div id="grdSendSMS"></div>
            &nbsp
            <div>
                <input id="btnSendSMS" type="button" class="myButton" style="position: relative; left: 45%" value="Send SMS" onclick="SendSMS2()" />
                <input id="btnDeleteSMS" type="button" class="myButton" style="position: relative; left: 45%" value="Clear" onclick="DeleteSMS()" />
            </div>


        </div>
    </div>

    <div id="Window">
        <div>
            <b>Group</b>
        </div>
        <div>
            <table>
                <tr>
                    <td style="display: none">
                        <label id="hidGroupID"></label>
                    </td>
                    <td>
                        <b>Group Name:</b>
                    </td>
                    <td>
                        <input id="txtGroupName" type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Select Employees:</b>
                    </td>
                    <td>
                        <div id="ddEmployees">
                            <div id="grdEmployees">
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
            <table>
                <tr>
                    <td>
                        <input id="btnAddGroup" type="button" value="Add" onclick="AddGroup()" class="myButton" />
                    </td>
                    <td>
                        <input id="btnUpdateGroup" type="button" value="Update" onclick="UpdateGroup()" class="myButton" />
                    </td>
                    <td>
                        <input id="btnDeleteGroup" type="button" value="Delete" onclick="DeleteGroup()" class="myButton" />
                    </td>
                    <td>
                        <input id="btnClearGroup" type="button" value="Cancel" onclick="ClearGroup()" class="myButton" />
                    </td>
                </tr>
            </table>
            <div id="grdGroups">
            </div>
        </div>
    </div>

    <div id="WindowSMS">
        <div>
            <b>Group</b>
        </div>
        <div>
            <table>
                <tr>
                    <td style="display: none">
                        <label id="hidSMSGroupID"></label>
                    </td>
                    <td>
                        <b>Group Name:</b>
                    </td>
                    <td>
                        <input id="txtSMSGroupName" type="text" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>Select Employees:</b>
                    </td>
                    <td>
                        <div id="ddSMSEmployees">
                            <div id="grdSMSEmployees">
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
            <table>
                <tr>
                    <td>
                        <input id="btnAddSMSGroup" type="button" value="Add" onclick="AddSMSGroup()" class="myButton" />
                    </td>
                    <td>
                        <input id="btnUpdateSMSGroup" type="button" value="Update" onclick="UpdateSMSGroup()" class="myButton" />
                    </td>
                    <td>
                        <input id="btnDeleteSMSGroup" type="button" value="Delete" onclick="DeleteSMSGroup()" class="myButton" />
                    </td>
                    <td>
                        <input id="btnClearSMSGroup" type="button" value="Cancel" onclick="ClearSMSGroup()" class="myButton" />
                    </td>
                </tr>
            </table>
            <div id="grdSMSGroups">
            </div>
        </div>
    </div>

    <%--&nbsp
    <br />
    <div align="Center" style="color:green">
    <h1> Email Log </h1>
    </div>
    <div id="grdSendEmail"></div>
    &nbsp
    <div>
        <input id="btnSendEmail" type="button" class="myButton" style="position: relative; left: 45%" value="Send Email" onclick="SendEmail()" />
        <input id="btnDeleteEmail" type="button" class="myButton" style="position: relative; left: 45%" value="Clear" onclick="DeleteEmail()" />
    </div>--%>
</asp:Content>
