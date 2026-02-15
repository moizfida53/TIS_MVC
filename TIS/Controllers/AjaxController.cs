// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.AjaxController
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Mail;
using System.Web.Mvc;
using System.Xml.Linq;
using TIS.Helper;
using TIS.Models;

namespace TIS.Controllers
{
    public class AjaxController : Controller
    {
        public ActionResult Index() => this.Session["EmpLoginName"] == null ? (ActionResult)this.View("AccessDenied") : (ActionResult)this.View();

        public JsonResult LoadTemplates()
        {
            TemplateViewModel templateViewModel = new TemplateViewModel();
            DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetTemplates");
            if (dataSet != null)
            {
                DataTable table = dataSet.Tables[0];
                List<Template> templateList = new List<Template>();
                List<TemplateType> templateTypeList = new List<TemplateType>();
                List<Country> countryList = new List<Country>();
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        templateTypeList.Add(new TemplateType()
                        {
                            Id = Convert.ToInt32(row["Id"].ToString()),
                            TemplateName = row["Template"].ToString()
                        });
                    foreach (DataRow row in (InternalDataCollectionBase)dataSet.Tables[1].Rows)
                        countryList.Add(new Country()
                        {
                            COUNTRYID = Convert.ToInt32(row["COUNTRYID"].ToString()),
                            COUNTRYNAME = row["COUNTRYNAME"].ToString()
                        });
                    foreach (DataRow row in (InternalDataCollectionBase)dataSet.Tables[2].Rows)
                        templateList.Add(new Template()
                        {
                            TemplateId = Convert.ToInt32(row["TemplateId"].ToString()),
                            TemplateText = row["TText"].ToString(),
                            EmailBCC = row["EmailBCC"].ToString(),
                            EmailFrom = row["EmailFrom"].ToString(),
                            CountryId = Convert.ToInt32(row["CountryId"].ToString()),
                            CountryName = row["COUNTRYNAME"].ToString(),
                            Id = Convert.ToInt32(row["Id"].ToString()),
                            TemplateName = row["Template"].ToString()
                        });
                    templateViewModel.TemplateTypes = templateTypeList;
                    templateViewModel.Countries = countryList;
                    templateViewModel.Templates = templateList;
                }
            }
            return this.Json((object)new
            {
                tmvm = templateViewModel
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateTemplates(Template t)
        {
            SqlParameter[] paramColl = new SqlParameter[6];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@Id";
            sqlParameter1.SqlDbType = SqlDbType.Int;
            sqlParameter1.Value = (object)t.Id;
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@CId";
            sqlParameter2.SqlDbType = SqlDbType.Int;
            sqlParameter2.Value = (object)t.CountryId;
            paramColl[1] = sqlParameter2;
            SqlParameter sqlParameter3 = new SqlParameter();
            sqlParameter3.ParameterName = "@TId";
            sqlParameter3.SqlDbType = SqlDbType.Int;
            sqlParameter3.Value = (object)t.TemplateId;
            paramColl[2] = sqlParameter3;
            SqlParameter sqlParameter4 = new SqlParameter();
            sqlParameter4.ParameterName = "@Text";
            sqlParameter4.SqlDbType = SqlDbType.NVarChar;
            sqlParameter4.Value = (object)t.TemplateText;
            paramColl[3] = sqlParameter4;
            SqlParameter sqlParameter5 = new SqlParameter();
            sqlParameter5.ParameterName = "@EmailFrom";
            sqlParameter5.SqlDbType = SqlDbType.VarChar;
            sqlParameter5.Value = (object)t.EmailFrom;
            paramColl[4] = sqlParameter5;

            //SqlParameter sqlParameter6 = new SqlParameter();
            //sqlParameter6.ParameterName = "@EmailBCC";
            //sqlParameter6.SqlDbType = SqlDbType.NVarChar;
            //sqlParameter6.Value = (object)t.EmailBCC;
            //paramColl[5] = sqlParameter6;


            SqlParameter sqlParameter6 = new SqlParameter();
            sqlParameter6.ParameterName = "@EmailBCC";
            sqlParameter6.SqlDbType = SqlDbType.NVarChar;
            sqlParameter6.Value = string.IsNullOrEmpty(t.EmailBCC)
                ? DBNull.Value
                : (object)t.EmailBCC;
            paramColl[5] = sqlParameter6;



            DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_SaveTemplates", paramColl);
            List<Template> templateList = new List<Template>();
            foreach (DataRow row in (InternalDataCollectionBase)dataSet.Tables[0].Rows)
                templateList.Add(new Template()
                {
                    TemplateId = Convert.ToInt32(row["TemplateId"].ToString()),
                    TemplateText = row["TText"].ToString(),
                    EmailBCC = row["EmailBCC"].ToString(),
                    EmailFrom = row["EmailFrom"].ToString(),
                    CountryId = Convert.ToInt32(row["CountryId"].ToString()),
                    CountryName = row["COUNTRYNAME"].ToString(),
                    Id = Convert.ToInt32(row["Id"].ToString()),
                    TemplateName = row["Template"].ToString()
                });
            return this.Json((object)new
            {
                Templates = templateList
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getBills(string uid)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@Uid";
                sqlParameter.SqlDbType = SqlDbType.Int;
                sqlParameter.Value = (object)uid;
                paramColl[0] = sqlParameter;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetUserBills", paramColl);
                List<Bill> billList = new List<Bill>();
                DataTable table1 = dataSet.Tables[0];
                if (table1.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table1.Rows)
                        billList.Add(new Bill()
                        {
                            Id = Convert.ToInt32(row["BILL_ID"].ToString()),
                            BillDate = Convert.ToDateTime(row["BILLDATE"].ToString()),
                            Uid = Convert.ToInt32(row["UID"].ToString()),
                            EmpName = row["NAME"].ToString(),
                            BillNumber = row["BILLNUMBER"].ToString(),
                            Mobile = row["SUB_NO"].ToString(),
                            TotalAmount = Convert.ToDouble(row["TOTALAMOUNT"].ToString()),
                            LastUpdatedOn = row["LASTUPDATEDON"].ToString(),
                            ProviderName = row["Provider"].ToString(),
                            Comments = row["COMMENTS"].ToString(),
                            SubsId = row["SUB_NO_ID"].ToString(),
                            ManagerName = row["ManagerName"].ToString(),
                            Currency = row["CURRENCY"].ToString()
                        });
                }
                List<Employee> employeeList = new List<Employee>();
                DataTable table2 = dataSet.Tables[1];
                if (table1.Rows.Count > 1)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table2.Rows)
                        employeeList.Add(new Employee()
                        {
                            EmpId = Convert.ToInt32(row["UID"].ToString()),
                            EmpNo = row["EMPLOYEENO"].ToString(),
                            EmpName = row["NAME"].ToString()
                        });
                }
                JsonResult bills = this.Json((object)new
                {
                    dtBills = billList,
                    EmpList = employeeList
                }, JsonRequestBehavior.AllowGet);
                bills.MaxJsonLength = new int?(int.MaxValue);
                return bills;
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult getBillDetails(string id, int type = 0)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[2];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@Id";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)id;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@type";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)type;
                paramColl[1] = sqlParameter2;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetBillDetails", paramColl);
                List<BillDetails> billDetailsList = new List<BillDetails>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                    {
                        string str = "0";
                        if (row["CALL_TYPE"] != null)
                            str = row["CALL_TYPE"].ToString();
                        billDetailsList.Add(new BillDetails()
                        {
                            Id = Convert.ToInt32(row["ID"].ToString()),
                            CallDate = row["CALLDATE"].ToString().Substring(0, row["CALLDATE"].ToString().IndexOf(" ")),
                            CallTime = row["CALLTIME"].ToString(),
                            TransType = row["TRANS_TYPE"].ToString(),
                            Description = row["DESCRIPTION"].ToString(),
                            Name = row["NAME"].ToString(),
                            Duration = row["DURATION"].ToString(),
                            Amount = Convert.ToDouble(row["AMOUNT"].ToString()),
                            Comment = row["COMMENT"].ToString(),
                            CallType = str,
                            Locked = Convert.ToBoolean(row["ISLOCKED"].ToString()),
                            Auid = Convert.ToInt32(row["AUID"].ToString()),
                            DialledNo = row["DIALLEDNO"].ToString()
                        });
                    }
                }
                string str1 = "";
                string str2 = "";
                string str3 = "";
                if (dataSet.Tables.Count > 1)
                {
                    str1 = dataSet.Tables[1].Rows[0]["BussinessLimit"].ToString();
                    str2 = dataSet.Tables[1].Rows[0]["MonthlyLimit"].ToString();
                    str3 = dataSet.Tables[1].Rows[0]["PLimit"].ToString();
                }
                Settings settings = new Settings();
                if (dataSet.Tables.Count > 2)
                {
                    settings.EnableDiscrepancy = Convert.ToBoolean(dataSet.Tables[2].Rows[0]["EnableDiscrepancy"].ToString());
                    settings.DedBussinessCharges = Convert.ToBoolean(dataSet.Tables[2].Rows[0]["DedBussinessCharges"].ToString());
                    settings.DedPersonalCharges = Convert.ToBoolean(dataSet.Tables[2].Rows[0]["DedPersonalCharges"].ToString());
                    settings.HideAllowanceLimit = Convert.ToBoolean(dataSet.Tables[2].Rows[0]["HideAllowanceLimit"].ToString());
                    settings.HidePersonalLimit = Convert.ToBoolean(dataSet.Tables[2].Rows[0]["HidePersonalLimit"].ToString());
                    settings.IsAllowWaiver = Convert.ToBoolean(dataSet.Tables[2].Rows[0]["AllowWaiver"].ToString());
                    settings.IsZeroUnlimited = Convert.ToBoolean(dataSet.Tables[2].Rows[0]["BusinessZeroAsUnlimited"].ToString());
                    settings.IsZeroUnlimited2 = Convert.ToBoolean(dataSet.Tables[2].Rows[0]["PersonalZeroAsUnlimited"].ToString());
                }
                return this.Json((object)new
                {
                    bill_details = billDetailsList,
                    blim = str1,
                    mlim = str2,
                    plim = str3,
                    setting = settings
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult GetEmp()
        {
            try
            {
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_LoginAs");
                List<Employee> employeeList = new List<Employee>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        employeeList.Add(new Employee()
                        {
                            UserName = row["USERNAME"].ToString(),
                            EmpNo = row["EMPLOYEENO"].ToString(),
                            EmpName = row["NAME"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    EmpList = employeeList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult getEmployees()
        {
            int int32_1 = Convert.ToInt32(this.Session["CountryID"].ToString());
            int int32_2 = Convert.ToInt32(this.Session["EmpRoleID"].ToString());
            try
            {
                SqlParameter[] paramColl = new SqlParameter[2];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@CountryID";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)int32_1;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@RoleID";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)int32_2;
                paramColl[1] = sqlParameter2;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetEmp", paramColl);
                List<Employee> employeeList = new List<Employee>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        employeeList.Add(new Employee()
                        {
                            EmpId = Convert.ToInt32(row["UID"].ToString()),
                            UserName = row["USERNAME"].ToString(),
                            EmpNo = row["EMPLOYEENO"].ToString(),
                            EmpName = row["NAME"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    EmpList = employeeList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        [HttpPost]
        public JsonResult SaveCallLogs(List<BillDetails> callLogs, Closing close)
        {
            string str = new XElement((XName)"newCallLog", (object)callLogs.Select<BillDetails, XElement>((Func<BillDetails, XElement>)(p => new XElement((XName)"CallLogRecords", new object[3]
         {
        (object) new XAttribute((XName) "ID", (object) p.Id),
        (object) new XAttribute((XName) "CALL_TYPE", (object) p.CallType),
        (object) new XAttribute((XName) "Comment", p.Comment == null ? (object) string.Empty : (object) p.Comment)
         })))).ToString();
            SqlParameter[] paramColl = new SqlParameter[10];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@xml";
            sqlParameter1.SqlDbType = SqlDbType.Xml;
            sqlParameter1.Value = (object)str;
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@BusinessCharges";
            sqlParameter2.SqlDbType = SqlDbType.Float;
            sqlParameter2.Value = (object)close.BusinessCharges;
            paramColl[1] = sqlParameter2;
            SqlParameter sqlParameter3 = new SqlParameter();
            sqlParameter3.ParameterName = "@PersonalCharges";
            sqlParameter3.SqlDbType = SqlDbType.Float;
            sqlParameter3.Value = (object)close.PersonalCharges;
            paramColl[2] = sqlParameter3;
            SqlParameter sqlParameter4 = new SqlParameter();
            sqlParameter4.ParameterName = "@PersonalLimitCharges";
            sqlParameter4.SqlDbType = SqlDbType.Float;
            sqlParameter4.Value = (object)close.PersonalLimitCharges;
            paramColl[3] = sqlParameter4;
            SqlParameter sqlParameter5 = new SqlParameter();
            sqlParameter5.ParameterName = "@DeductibleAmount";
            sqlParameter5.SqlDbType = SqlDbType.Float;
            sqlParameter5.Value = (object)close.DeductibleAmount;
            paramColl[4] = sqlParameter5;
            SqlParameter sqlParameter6 = new SqlParameter();
            sqlParameter6.ParameterName = "@TOTALAMOUNT";
            sqlParameter6.SqlDbType = SqlDbType.Float;
            sqlParameter6.Value = (object)close.TOTALAMOUNT;
            paramColl[5] = sqlParameter6;
            SqlParameter sqlParameter7 = new SqlParameter();
            sqlParameter7.ParameterName = "@BID";
            sqlParameter7.SqlDbType = SqlDbType.Int;
            sqlParameter7.Value = (object)close.BID;
            paramColl[6] = sqlParameter7;
            SqlParameter sqlParameter8 = new SqlParameter();
            sqlParameter8.ParameterName = "@comment";
            sqlParameter8.SqlDbType = SqlDbType.VarChar;
            sqlParameter8.Value = (object)close.comments;
            paramColl[7] = sqlParameter8;
            SqlParameter sqlParameter9 = new SqlParameter();
            sqlParameter9.ParameterName = "@Uid";
            sqlParameter9.SqlDbType = SqlDbType.Int;
            sqlParameter9.Value = (object)close.uid;
            paramColl[8] = sqlParameter9;
            SqlParameter sqlParameter10 = new SqlParameter();
            sqlParameter10.ParameterName = "@Waiver";
            sqlParameter10.SqlDbType = SqlDbType.Float;
            sqlParameter10.Value = (object)close.WaiverAmt;
            paramColl[9] = sqlParameter10;
            DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_CloseBill", paramColl);
            List<Bill> billList = new List<Bill>();
            DataTable table = dataSet.Tables[0];
            if (table.Rows.Count > 0)
            {
                foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                    billList.Add(new Bill()
                    {
                        Id = Convert.ToInt32(row["BILL_ID"].ToString()),
                        BillDate = Convert.ToDateTime(row["BILLDATE"].ToString()),
                        Uid = Convert.ToInt32(row["UID"].ToString()),
                        EmpName = row["NAME"].ToString(),
                        BillNumber = row["BILLNUMBER"].ToString(),
                        Mobile = row["SUB_NO"].ToString(),
                        TotalAmount = Convert.ToDouble(row["TOTALAMOUNT"].ToString()),
                        LastUpdatedOn = row["LASTUPDATEDON"].ToString(),
                        Comments = " ",
                        SubsId = row["SUB_NO_ID"].ToString(),
                        ManagerName = row["ManagerName"].ToString()
                    });
            }
            this.SendEmail(close.BID.ToString());
            return this.Json((object)new { dtBills = billList }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SendEmail(string BID)
        {
            SqlParameter[] paramColl1 = new SqlParameter[1];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@bid";
            sqlParameter1.SqlDbType = SqlDbType.Int;
            sqlParameter1.Value = (object)Convert.ToInt32(BID);
            paramColl1[0] = sqlParameter1;
            DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetEmail", paramColl1);
            string host = dataSet.Tables[2].Rows[0]["smtpsettings"].ToString();
            if (dataSet != null && dataSet.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in (InternalDataCollectionBase)dataSet.Tables[0].Rows)
                {
                    try
                    {
                        MailMessage message = new MailMessage();
                        if (row["CC"].ToString() == "" || row["CC"].ToString() == null)
                        {
                            message.To.Add(row["EmailTo"].ToString());
                        }
                        else
                        {
                            message.To.Add(row["EmailTo"].ToString());
                            message.CC.Add(row["CC"].ToString());
                        }
                        message.From = new MailAddress(row["EmailFrom"].ToString());
                        message.Sender = new MailAddress(row["EmailFrom"].ToString());
                        message.Subject = row["Subject"].ToString();
                        string str = row["EmailText"].ToString();
                        message.Body = str;
                        message.IsBodyHtml = true;
                        new SmtpClient(host)
                        {
                            UseDefaultCredentials = true
                        }.Send(message);
                        SqlParameter[] paramColl2 = new SqlParameter[1];
                        SqlParameter sqlParameter2 = new SqlParameter();
                        sqlParameter2.ParameterName = "@id";
                        sqlParameter2.SqlDbType = SqlDbType.Int;
                        sqlParameter2.Value = (object)row["Id"].ToString();
                        paramColl2[0] = sqlParameter2;
                        DB.ExecuteStoredProcDataSet("sp_MarkAsSent", paramColl2);
                    }
                    catch (Exception ex)
                    {
                        string empty = string.Empty;
                        string str = Convert.ToString((object)ex);
                        DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (4, 'Send Email', 'Fail','" + this.Session["EmpUID"] + "')");
                        DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (4, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str + "' ,'Sent Single Email')");
                    }
                }
            }
            return this.Json((object)new
            {
                Message = "Email Sent"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveDelegate(Delg dlg)
        {
            SqlParameter[] paramColl = new SqlParameter[7];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@Command";
            sqlParameter1.SqlDbType = SqlDbType.Int;
            sqlParameter1.Value = (object)1;
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@secid";
            sqlParameter2.SqlDbType = SqlDbType.Int;
            sqlParameter2.Value = (object)dlg.secid;
            paramColl[1] = sqlParameter2;
            SqlParameter sqlParameter3 = new SqlParameter();
            sqlParameter3.ParameterName = "@managerid";
            sqlParameter3.SqlDbType = SqlDbType.Int;
            sqlParameter3.Value = (object)dlg.managerid;
            paramColl[2] = sqlParameter3;
            SqlParameter sqlParameter4 = new SqlParameter();
            sqlParameter4.ParameterName = "@app";
            sqlParameter4.SqlDbType = SqlDbType.Bit;
            sqlParameter4.Value = (object)dlg.app;
            paramColl[3] = sqlParameter4;
            SqlParameter sqlParameter5 = new SqlParameter();
            sqlParameter5.ParameterName = "@idt";
            sqlParameter5.SqlDbType = SqlDbType.Bit;
            sqlParameter5.Value = (object)dlg.idt;
            paramColl[4] = sqlParameter5;
            SqlParameter sqlParameter6 = new SqlParameter();
            sqlParameter6.ParameterName = "@sdate";
            sqlParameter6.SqlDbType = SqlDbType.Date;
            sqlParameter6.Value = (object)dlg.sdate;
            paramColl[5] = sqlParameter6;
            SqlParameter sqlParameter7 = new SqlParameter();
            sqlParameter7.ParameterName = "@edate";
            sqlParameter7.SqlDbType = SqlDbType.Date;
            sqlParameter7.Value = (object)dlg.edate;
            paramColl[6] = sqlParameter7;
            DB.ExecuteStoredProc("sp_delegate", paramColl);
            return this.Json((object)new
            {
                Message = "Sucessfully Added"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateDelegate(Delg dlg)
        {
            SqlParameter[] paramColl = new SqlParameter[8];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@Command";
            sqlParameter1.SqlDbType = SqlDbType.Int;
            sqlParameter1.Value = (object)2;
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@id";
            sqlParameter2.SqlDbType = SqlDbType.Int;
            sqlParameter2.Value = (object)dlg.ID;
            paramColl[1] = sqlParameter2;
            SqlParameter sqlParameter3 = new SqlParameter();
            sqlParameter3.ParameterName = "@secid";
            sqlParameter3.SqlDbType = SqlDbType.Int;
            sqlParameter3.Value = (object)dlg.secid;
            paramColl[2] = sqlParameter3;
            SqlParameter sqlParameter4 = new SqlParameter();
            sqlParameter4.ParameterName = "@managerid";
            sqlParameter4.SqlDbType = SqlDbType.Int;
            sqlParameter4.Value = (object)dlg.managerid;
            paramColl[3] = sqlParameter4;
            SqlParameter sqlParameter5 = new SqlParameter();
            sqlParameter5.ParameterName = "@app";
            sqlParameter5.SqlDbType = SqlDbType.Bit;
            sqlParameter5.Value = (object)dlg.app;
            paramColl[4] = sqlParameter5;
            SqlParameter sqlParameter6 = new SqlParameter();
            sqlParameter6.ParameterName = "@idt";
            sqlParameter6.SqlDbType = SqlDbType.Bit;
            sqlParameter6.Value = (object)dlg.idt;
            paramColl[5] = sqlParameter6;
            SqlParameter sqlParameter7 = new SqlParameter();
            sqlParameter7.ParameterName = "@sdate";
            sqlParameter7.SqlDbType = SqlDbType.Date;
            sqlParameter7.Value = (object)dlg.sdate;
            paramColl[6] = sqlParameter7;
            SqlParameter sqlParameter8 = new SqlParameter();
            sqlParameter8.ParameterName = "@edate";
            sqlParameter8.SqlDbType = SqlDbType.Date;
            sqlParameter8.Value = (object)dlg.edate;
            paramColl[7] = sqlParameter8;
            DB.ExecuteStoredProc("sp_delegate", paramColl);
            return this.Json((object)new
            {
                Message = "Sucessfully Updated"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteDelegate(Delg dlg)
        {
            SqlParameter[] paramColl = new SqlParameter[2];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@Command";
            sqlParameter1.SqlDbType = SqlDbType.Int;
            sqlParameter1.Value = (object)3;
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@id";
            sqlParameter2.SqlDbType = SqlDbType.Int;
            sqlParameter2.Value = (object)dlg.ID;
            paramColl[1] = sqlParameter2;
            DB.ExecuteStoredProc("sp_delegate", paramColl);
            return this.Json((object)new
            {
                Message = "Sucessfully Deleted"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getApprovalBills(string uid)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@Uid";
                sqlParameter.SqlDbType = SqlDbType.Int;
                sqlParameter.Value = (object)uid;
                paramColl[0] = sqlParameter;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetArrovalBills", paramColl);
                List<ArrovalBills> arrovalBillsList = new List<ArrovalBills>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        arrovalBillsList.Add(new ArrovalBills()
                        {
                            BillId = Convert.ToInt32(row["BILL_ID"].ToString()),
                            BillDate = row["BILLDATE"].ToString(),
                            SubNo = row["SUB_NO"].ToString(),
                            Name = row["NAME"].ToString(),
                            Org = row["ORG"].ToString(),
                            Total = row["TOTALAMOUNT"].ToString(),
                            BusinessLimit = row["BUSSINESSLIMIT"].ToString(),
                            BusinessCharges = row["BUSINESSCHARGES"].ToString(),
                            DeductableAmount = row["DEDUCTIBLEAMOUNT"].ToString(),
                            WaiverAmount = row["WAIVERAMOUNT"].ToString(),
                            Comments = row["COMMENTS"].ToString(),
                            AComments = " ",
                            IsSelected = false
                        });
                }
                return this.Json((object)new
                {
                    dtBills = arrovalBillsList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult ApproveBills(List<AppBills> callLogs, int OPT, int UID)
        {
            string str = new XElement((XName)"newCallLog", (object)callLogs.Select<AppBills, XElement>((Func<AppBills, XElement>)(p => new XElement((XName)"CallLogRecords", new object[2]
         {
        (object) new XAttribute((XName) "ID", (object) p.Id),
        (object) new XAttribute((XName) "Comm", (object) p.Comm)
         })))).ToString();
            SqlParameter[] paramColl = new SqlParameter[3];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@xml";
            sqlParameter1.SqlDbType = SqlDbType.Xml;
            sqlParameter1.Value = (object)str;
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@opt";
            sqlParameter2.SqlDbType = SqlDbType.Int;
            sqlParameter2.Value = (object)OPT;
            paramColl[1] = sqlParameter2;
            SqlParameter sqlParameter3 = new SqlParameter();
            sqlParameter3.ParameterName = "@Uid";
            sqlParameter3.SqlDbType = SqlDbType.Int;
            sqlParameter3.Value = (object)UID;
            paramColl[2] = sqlParameter3;
            DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_Approve", paramColl);
            List<ArrovalBills> arrovalBillsList = new List<ArrovalBills>();
            DataTable table = dataSet.Tables[0];
            if (table.Rows.Count > 0)
            {
                foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                    arrovalBillsList.Add(new ArrovalBills()
                    {
                        BillId = Convert.ToInt32(row["BILL_ID"].ToString()),
                        BillDate = row["BILLDATE"].ToString(),
                        SubNo = row["SUB_NO"].ToString(),
                        Name = row["NAME"].ToString(),
                        Org = row["ORG"].ToString(),
                        Total = row["TOTALAMOUNT"].ToString(),
                        BusinessLimit = row["BUSSINESSLIMIT"].ToString(),
                        BusinessCharges = row["BUSINESSCHARGES"].ToString(),
                        DeductableAmount = row["DEDUCTIBLEAMOUNT"].ToString(),
                        WaiverAmount = row["WAIVERAMOUNT"].ToString(),
                        Comments = row["COMMENTS"].ToString(),
                        AComments = " ",
                        IsSelected = false
                    });
            }
            this.SendEmailApprove();
            return this.Json((object)new
            {
                dtBills = arrovalBillsList
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SendEmailApprove()
        {
            DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetEmailApprove");
            string host = dataSet.Tables[2].Rows[0]["smtpsettings"].ToString();
            if (dataSet != null && dataSet.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in (InternalDataCollectionBase)dataSet.Tables[0].Rows)
                {
                    try
                    {
                        MailMessage message = new MailMessage();
                        if (row["CC"].ToString() == "" || row["CC"].ToString() == null)
                        {
                            message.To.Add(row["EmailTo"].ToString());
                        }
                        else
                        {
                            message.To.Add(row["EmailTo"].ToString());
                            message.CC.Add(row["CC"].ToString());
                        }
                        message.From = new MailAddress(row["EmailFrom"].ToString());
                        message.Sender = new MailAddress(row["EmailFrom"].ToString());
                        message.Subject = row["Subject"].ToString();
                        string str = row["EmailText"].ToString();
                        message.Body = str;
                        message.IsBodyHtml = true;
                        new SmtpClient(host)
                        {
                            UseDefaultCredentials = true
                        }.Send(message);
                        SqlParameter[] paramColl = new SqlParameter[1];
                        SqlParameter sqlParameter = new SqlParameter();
                        sqlParameter.ParameterName = "@id";
                        sqlParameter.SqlDbType = SqlDbType.Int;
                        sqlParameter.Value = (object)row["Id"].ToString();
                        paramColl[0] = sqlParameter;
                        DB.ExecuteStoredProcDataSet("sp_MarkAsSent", paramColl);
                    }
                    catch (Exception ex)
                    {
                        string empty = string.Empty;
                        string str = Convert.ToString((object)ex);
                        DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (4, 'Send Email', 'Fail','" + this.Session["EmpUID"] + "')");
                        DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (4, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str + "' ,'Approve Email Failed')");
                    }
                }
            }
            return this.Json((object)new
            {
                Message = "Email Sent"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getArchivedBills(string uid)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@Uid";
                sqlParameter.SqlDbType = SqlDbType.Int;
                sqlParameter.Value = (object)uid;
                paramColl[0] = sqlParameter;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetArchived", paramColl);
                List<ArchiveBills> archiveBillsList = new List<ArchiveBills>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        archiveBillsList.Add(new ArchiveBills()
                        {
                            BillId = Convert.ToInt32(row["BILL_ID"].ToString()),
                            BillDate = row["BILLDATE"].ToString(),
                            Status = row["STATUS"].ToString(),
                            TotalAmount = row["TOTALAMOUNT"].ToString(),
                            Provider = row["PROVIDER"].ToString(),
                            EmployeeName = row["EMPNAME"].ToString(),
                            Deductable = row["DEDUCTIBLEAMOUNT"].ToString(),
                            Mobile = row["SUB_NO"].ToString(),
                            LastUpdate = row["LASTUPDATEDON"].ToString(),
                            Currency = row["Currency"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    dtBills = archiveBillsList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult getDepartmentBills(string uid)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@Uid";
                sqlParameter.SqlDbType = SqlDbType.Int;
                sqlParameter.Value = (object)uid;
                paramColl[0] = sqlParameter;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetDepartmentBills", paramColl);
                List<ArchiveBills> archiveBillsList = new List<ArchiveBills>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        archiveBillsList.Add(new ArchiveBills()
                        {
                            BillId = Convert.ToInt32(row["BILL_ID"].ToString()),
                            BillDate = row["BILLDATE"].ToString(),
                            Status = row["STATUS"].ToString(),
                            TotalAmount = row["TOTALAMOUNT"].ToString(),
                            Provider = row["PROVIDER"].ToString(),
                            EmployeeName = row["EMPNAME"].ToString(),
                            Deductable = row["DEDUCTIBLEAMOUNT"].ToString(),
                            Mobile = row["SUB_NO"].ToString(),
                            LastUpdate = row["LASTUPDATEDON"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    dtBills = archiveBillsList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult getBillDetailsAppr(string id, int type = 0)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[2];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@Id";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)id;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@type";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)0;
                paramColl[1] = sqlParameter2;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetBillDetailsAppr", paramColl);
                List<BillDetails> billDetailsList = new List<BillDetails>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                    {
                        string str = "0";
                        if (row["CALL_TYPE"] != null)
                            str = row["CALL_TYPE"].ToString();
                        billDetailsList.Add(new BillDetails()
                        {
                            Id = Convert.ToInt32(row["ID"].ToString()),
                            CallDate = row["CALLDATE"].ToString().Substring(0, row["CALLDATE"].ToString().IndexOf(" ")),
                            CallTime = row["CALLTIME"].ToString(),
                            TransType = row["TRANS_TYPE"].ToString(),
                            Description = row["DESCRIPTION"].ToString(),
                            Duration = row["DURATION"].ToString(),
                            Amount = Convert.ToDouble(row["AMOUNT"].ToString()),
                            Comment = row["COMMENT"].ToString(),
                            CallType = str,
                            Locked = Convert.ToBoolean(row["ISLOCKED"].ToString())
                        });
                    }
                }
                string str1 = "";
                string str2 = "";
                if (dataSet.Tables.Count > 1)
                {
                    str1 = dataSet.Tables[1].Rows[0]["BussinessLimit"].ToString();
                    str2 = dataSet.Tables[1].Rows[0]["MonthlyLimit"].ToString();
                }
                Settings settings = new Settings();
                if (dataSet.Tables.Count > 2)
                {
                    settings.EnableDiscrepancy = Convert.ToBoolean(dataSet.Tables[2].Rows[0]["EnableDiscrepancy"].ToString());
                    settings.DedBussinessCharges = Convert.ToBoolean(dataSet.Tables[2].Rows[0]["DedBussinessCharges"].ToString());
                    settings.HideAllowanceLimit = Convert.ToBoolean(dataSet.Tables[2].Rows[0]["HideAllowanceLimit"].ToString());
                    settings.HidePersonalLimit = Convert.ToBoolean(dataSet.Tables[2].Rows[0]["HidePersonalLimit"].ToString());
                }
                return this.Json((object)new
                {
                    bill_details = billDetailsList,
                    blim = str1,
                    mlim = str2,
                    setting = settings
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult GetDelegate(string UID)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@UID";
                sqlParameter.SqlDbType = SqlDbType.Int;
                sqlParameter.Value = (object)UID;
                paramColl[0] = sqlParameter;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetDel", paramColl);
                List<Delg> delgList = new List<Delg>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        delgList.Add(new Delg()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            managerid = Convert.ToInt32(row["ManagerID"].ToString()),
                            ManName = row["ManagerName"].ToString(),
                            secid = Convert.ToInt32(row["SecrateryID"].ToString()),
                            SecName = row["SecrateryName"].ToString(),
                            idt = Convert.ToBoolean(row["CanIdentify"].ToString()),
                            app = Convert.ToBoolean(row["CanApprove"].ToString()),
                            sdate = Convert.ToDateTime(row["StartDate"].ToString()),
                            edate = Convert.ToDateTime(row["EndDate"].ToString())
                        });
                }
                return this.Json((object)new { dtSec = delgList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult getReportBillArchive(int billId)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@bid";
                sqlParameter.SqlDbType = SqlDbType.Int;
                sqlParameter.Value = (object)billId;
                paramColl[0] = sqlParameter;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetReportBillArchive", paramColl);
                List<BillDetails> billDetailsList = new List<BillDetails>();
                List<TransType> transTypeList = new List<TransType>();
                ArchiveBill archiveBill = new ArchiveBill();
                if (dataSet != null)
                {
                    DataTable table1 = dataSet.Tables[1];
                    DataTable table2 = dataSet.Tables[0];
                    if (table2.Rows.Count > 0)
                    {
                        DataRow row = table2.Rows[0];
                        archiveBill = new ArchiveBill()
                        {
                            EMPLOYEENAME = row["EMPLOYEENAME"].ToString(),
                            PROVIDER = row["PROVIDER"].ToString(),
                            MOBILENO = row["MOBILENO"].ToString(),
                            BUSSINESSLIMIT = row["BUSSINESSLIMIT"].ToString(),
                            MONTHLYLIMIT = row["MONTHLYLIMIT"].ToString(),
                            TOTALAMOUNT = row["TOTALAMOUNT"].ToString(),
                            BUSINESSCHARGES = row["BUSINESSCHARGES"].ToString(),
                            PERSONALCHARGES = row["PERSONALCHARGES"].ToString(),
                            PERSONALLIMITCHARGES = row["PERSONALLIMITCHARGES"].ToString(),
                            WAIVERAMOUNT = row["WAIVERAMOUNT"].ToString(),
                            DEDUCTIBLEAMOUNT = row["DEDUCTIBLEAMOUNT"].ToString(),
                            COMMENTS = row["COMMENTS"].ToString(),
                            LASTUPDATEDON = row["LASTUPDATEDON"].ToString(),
                            BILLDATE = row["BILLDATE"].ToString(),
                            BILL_ID = row["BILL_ID"].ToString(),
                            STATUS = row["STATUS"].ToString()
                        };
                    }
                    if (table1.Rows.Count > 0)
                    {
                        foreach (DataRow row in (InternalDataCollectionBase)table1.Rows)
                        {
                            string str = "0";
                            if (row["CALL_TYPE"] != null)
                                str = row["CALL_TYPE"].ToString();
                            billDetailsList.Add(new BillDetails()
                            {
                                Id = Convert.ToInt32(row["ID"].ToString()),
                                CallDate = row["CALLDATE"].ToString().Substring(0, row["CALLDATE"].ToString().IndexOf(" ")),
                                CallTime = row["SUB_NO"].ToString(),
                                TransType = row["TRANS_TYPE"].ToString(),
                                Description = row["DESCRIPTION"].ToString(),
                                Duration = row["DURATION"].ToString(),
                                Amount = Convert.ToDouble(row["AMOUNT"].ToString()),
                                Comment = row["COMMENT"].ToString(),
                                CallType = str,
                                Locked = Convert.ToBoolean(row["ISLOCKED"].ToString())
                            });
                        }
                        foreach (DataRow row in (InternalDataCollectionBase)dataSet.Tables[2].Rows)
                            transTypeList.Add(new TransType()
                            {
                                StrTrans = row["TRANS_TYPE"].ToString()
                            });
                    }
                }
                return this.Json((object)new
                {
                    RptBill = billDetailsList,
                    Trans = transTypeList,
                    ArchiveBill = archiveBill
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult UpdateRecord(List<BillDetails> BillDetails)
        {
            string str = new XElement((XName)"newCallLog", (object)BillDetails.Select<BillDetails, XElement>((Func<BillDetails, XElement>)(p => new XElement((XName)"CallLogRecords", new object[3]
         {
        (object) new XAttribute((XName) "ID", (object) p.Id),
        (object) new XAttribute((XName) "CALL_TYPE", (object) p.CallType),
        (object) new XAttribute((XName) "Comment", p.Comment == null ? (object) string.Empty : (object) p.Comment)
         })))).ToString();
            SqlParameter[] paramColl = new SqlParameter[1];
            SqlParameter sqlParameter = new SqlParameter();
            sqlParameter.ParameterName = "@xml";
            sqlParameter.SqlDbType = SqlDbType.Xml;
            sqlParameter.Value = (object)str;
            paramColl[0] = sqlParameter;
            DB.ExecuteStoredProcDataSet("sp_SaveCloseBill", paramColl);
            return this.Json((object)new
            {
                Message = "Updated Sucessfully"
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
