// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.BillController
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Net.Mail;
using System.Web.Mvc;
using TIS.Filters;
using TIS.Helper;
using TIS.Models;

namespace TIS.Controllers
{
    [RoleAuthorize(Roles.Administrator, Roles.SuperAdmin, Roles.Employee)]
    public class BillController : Controller
    {
        public ActionResult Index() => this.Session["EmpLoginName"] == null ? (ActionResult)this.View("AccessDenied") : (ActionResult)this.View("ForceBill");

        public ActionResult ChangeStatus() => this.Session["EmpLoginName"] == null ? (ActionResult)this.View("AccessDenied") : (ActionResult)this.View(nameof(ChangeStatus));

        public ActionResult ReAssignBill() => this.Session["EmpLoginName"] == null ? (ActionResult)this.View("AccessDenied") : (ActionResult)this.View(nameof(ReAssignBill));

        public ActionResult ReImburseBill() => this.Session["EmpLoginName"] == null ? (ActionResult)this.View("AccessDenied") : (ActionResult)this.View(nameof(ReImburseBill));

        public JsonResult GetForceBill()
        {
            object countryObj = this.Session["CountryID"];
            object roleObj = this.Session["EmpRoleID"];

            if (countryObj == null || roleObj == null)
            {
                return Json(new { Fail = true, Message = "Session expired or missing CountryID/EmpRoleID" }, JsonRequestBehavior.AllowGet);
            }
            int int32_1 = Convert.ToInt32(this.Session["CountryID"].ToString());
            int int32_2 = Convert.ToInt32(this.Session["EmpRoleID"].ToString());
            try
            {
                SqlParameter[] paramColl = new SqlParameter[2];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@RoleId";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)int32_2;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@CountryId";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)int32_1;
                paramColl[1] = sqlParameter2;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("[sp_GetForceBills]", paramColl);
                List<Bill> billList = new List<Bill>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        billList.Add(new Bill()
                        {
                            Id = Convert.ToInt32(row["BILL_ID"].ToString()),
                            BillDate = Convert.ToDateTime(row["BILLDATE"].ToString()),
                            Mobile = row["Mobile"].ToString(),
                            ProviderName = row["ProviderName"].ToString(),
                            TotalAmount = Convert.ToDouble(row["Amount"].ToString()),
                            EmpName = row["EmployeeName"].ToString(),
                            ManagerName = row["ManagerName"].ToString(),
                            Department = row["ORG"].ToString()
                        });
                }
                return this.Json((object)new { Bills = billList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        [HttpPost]
        public JsonResult ForceBill(TIS.Models.ForceBill Bill)
        {
            try
            {
                if (Bill?.BillID == null || Bill.BillID.Length == 0)
                {
                    return Json(new { Success = false, Message = "No bills selected for processing" });
                }

                DB.ExecuteNonQuery("delete from tmp_bill_ids");

                foreach (var billId in Bill.BillID)
                {
                    DB.ExecuteNonQuery("insert into tmp_bill_ids values(" + billId + ")");
                }

                SqlParameter[] paramColl = new SqlParameter[6];

                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@Status";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)Bill.Status;
                paramColl[0] = sqlParameter1;

                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@CallType";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)Bill.CallType;
                paramColl[1] = sqlParameter2;

                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@chkWavRtl";
                sqlParameter3.SqlDbType = SqlDbType.Bit;
                sqlParameter3.Value = (object)Bill.WavRental;
                paramColl[2] = sqlParameter3;

                SqlParameter sqlParameter4 = new SqlParameter();
                sqlParameter4.ParameterName = "@chkWavBus";
                sqlParameter4.SqlDbType = SqlDbType.Bit;
                sqlParameter4.Value = (object)Bill.WavBusiness;
                paramColl[3] = sqlParameter4;

                SqlParameter sqlParameter5 = new SqlParameter();
                sqlParameter5.ParameterName = "@chkTrain";
                sqlParameter5.SqlDbType = SqlDbType.Bit;
                sqlParameter5.Value = (object)Bill.Train;
                paramColl[4] = sqlParameter5;

                SqlParameter sqlParameter6 = new SqlParameter();
                sqlParameter6.ParameterName = "@UID";
                sqlParameter6.SqlDbType = SqlDbType.Int;
                sqlParameter6.Value = (object)Bill.UID;
                paramColl[5] = sqlParameter6;

                // Execute main stored procedure
                DB.ExecuteStoredProc("sp_ForceBill", paramColl);

                // Try sending email separately
                try
                {
                    this.SendEmail();
                    return Json(new { Success = true, Message = "Bills Successfully Processed" });
                }
                catch (Exception)
                {
                    return Json(new { Success = true, Message = "Bill Forced without Sending Email" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, Message = "Failed to process bills" });
            }
        }


        public JsonResult SendEmail()
        {
            DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetEmailPipeLine");
            if (dataSet != null && dataSet.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in (InternalDataCollectionBase)dataSet.Tables[0].Rows)
                {
                    MailMessage message = new MailMessage();
                    message.To.Add(row["EmailTo"].ToString());
                    message.From = new MailAddress(row["EmailFrom"].ToString());
                    message.Sender = new MailAddress(row["EmailFrom"].ToString());
                    message.Subject = row["Subject"].ToString();
                    string str = row["EmailText"].ToString();
                    message.Body = str;
                    message.IsBodyHtml = true;
                    new SmtpClient(dataSet.Tables[2].Rows[0]["smtpsettings"].ToString())
                    {
                        UseDefaultCredentials = true
                    }.Send(message);
                }
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@id";
                sqlParameter.SqlDbType = SqlDbType.Int;
                sqlParameter.Value = (object)dataSet.Tables[1].Rows[0][0].ToString();
                paramColl[0] = sqlParameter;
                DB.ExecuteStoredProcDataSet("sp_MarkAsSent", paramColl);
            }
            return this.Json((object)new
            {
                Message = "Email Sent"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSearchData(bool IsStatus)
        {
            int int32_1 = Convert.ToInt32(this.Session["CountryID"].ToString());
            int int32_2 = Convert.ToInt32(this.Session["EmpRoleID"].ToString());
            try
            {
                SqlParameter[] paramColl = new SqlParameter[3];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@IsStatus";
                sqlParameter1.SqlDbType = SqlDbType.Bit;
                sqlParameter1.Value = (object)IsStatus;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@CountryID";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)int32_1;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@RoleID";
                sqlParameter3.SqlDbType = SqlDbType.Int;
                sqlParameter3.Value = (object)int32_2;
                paramColl[2] = sqlParameter3;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_SearchBill", paramColl);
                List<Employee> employeeList = new List<Employee>();
                DataTable table1 = dataSet.Tables[0];
                if (table1.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table1.Rows)
                        employeeList.Add(new Employee()
                        {
                            EmpId = Convert.ToInt32(row["UID"].ToString()),
                            EmpNo = row["EMPLOYEENO"].ToString(),
                            EmpName = row["NAME"].ToString()
                        });
                }
                List<Provider> providerList = new List<Provider>();
                DataTable table2 = dataSet.Tables[1];
                if (table2.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table2.Rows)
                        providerList.Add(new Provider()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            NAME = row["Name"].ToString()
                        });
                }
                List<Status> statusList = new List<Status>();
                if (dataSet.Tables.Count > 2)
                {
                    DataTable table3 = dataSet.Tables[2];
                    if (table3.Rows.Count > 0)
                    {
                        foreach (DataRow row in (InternalDataCollectionBase)table3.Rows)
                            statusList.Add(new Status()
                            {
                                ID = Convert.ToInt32(row["ID"].ToString()),
                                NAME = row["Name"].ToString()
                            });
                    }
                }
                return this.Json((object)new
                {
                    EmpList = employeeList,
                    ProviderList = providerList,
                    dtStatus = statusList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult GetStatus()
        {
            try
            {
                DataSet data = DB.GetData("Select * from tblStatus");
                List<Status> statusList = new List<Status>();
                DataTable table = data.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        statusList.Add(new Status()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            NAME = row["Name"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    dtStatus = statusList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult Search(TIS.Models.Search Search)
        {
            try
            {
                // Step 1: Prepare SQL parameters
                SqlParameter[] parameters =
                {
            new SqlParameter("@Month", Search.Month),
            new SqlParameter("@Year", Search.Year),
            new SqlParameter("@UID", Search.UID),
            new SqlParameter("@Status", Search.Status),
            new SqlParameter("@Provider", Search.Provider)
        };

                // Step 2: Execute stored procedure using your existing DB helper
                DataSet data = DB.ExecuteStoredProcDataSet("SP_ChangeBillStatus_Search", parameters);

                if (data == null || data.Tables.Count == 0 || data.Tables[0].Rows.Count == 0)
                    return Json(new { success = false, message = "No data found." }, JsonRequestBehavior.AllowGet);

                DataTable table = data.Tables[0];
                List<Bill> billList = new List<Bill>();

                // Step 3: Convert DataTable to list
                foreach (DataRow row in table.Rows)
                {
                    billList.Add(new Bill()
                    {
                        Id = Convert.ToInt32(row["BILL_ID"]),
                        BillDate = Convert.ToDateTime(row["BILLDATE"]),
                        Mobile = row["SUB_NO"].ToString(),
                        EmpName = row["EMPLOYEENAME"].ToString(),
                        ManagerName = row["Appr_Manager"].ToString(),
                        TotalAmount = Convert.ToDouble(row["TOTALAMOUNT"]),
                        StatusName = row["STATUSNAME"].ToString(),
                        StatusID = Convert.ToInt32(row["STATUS"])
                    });
                }

                // Step 4: Return JSON result
                var jsonResult = Json(new { dtData = billList }, JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = int.MaxValue;
                return jsonResult;
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public JsonResult ChangeStatus(int billId)
        {
            try
            {
                SqlParameter[] param =
                {
            new SqlParameter("@Bill_ID", billId)
        };

                // Update bill status
                DB.ExecuteStoredProc("SP_ChangeBillStatus_Update", param);

                // Try sending email separately
                try
                {
                    SendEmail();

                    // Email success
                    return Json(new
                    {
                        success = true,
                        message = "Status changed to Open successfully and email sent!"
                    }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception emailEx)
                {
                    // Email failed, but bill update succeeded
                    return Json(new
                    {
                        success = true,
                        emailFailed = true,
                        message = "Bill Status Changed BUT Email sending failed!"
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                // Main operation failed
                return Json(new
                {
                    success = false,
                    message = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }






        public JsonResult SearchOpenBill(TIS.Models.Search Search)
        {
            try
            {
                // Step 1: Prepare SQL parameters
                SqlParameter[] parameters =
                {
            new SqlParameter("@Month", Search.Month),
            new SqlParameter("@Year", Search.Year),
            new SqlParameter("@UID", Search.UID),
            new SqlParameter("@Status", Search.Status),
            new SqlParameter("@Provider", Search.Provider)
        };

                // Step 2: Execute stored procedure using your existing DB helper
                DataSet data = DB.ExecuteStoredProcDataSet("sp_ReAssignBill_Search", parameters);

                if (data == null || data.Tables.Count == 0 || data.Tables[0].Rows.Count == 0)
                    return Json(new { success = false, message = "No data found." }, JsonRequestBehavior.AllowGet);

                DataTable table = data.Tables[0];
                List<Bill> billList = new List<Bill>();

                foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                    billList.Add(new Bill()
                    {
                        Id = Convert.ToInt32(row["BILL_ID"].ToString()),
                        BillDate = Convert.ToDateTime(row["BILLDATE"].ToString()),
                        Mobile = row["SUB_NO"].ToString(),
                        EmpName = row["EMPLOYEENAME"].ToString(),
                        ManagerName = row["Appr_Manager"].ToString(),
                        TotalAmount = Convert.ToDouble(row["TOTALAMOUNT"].ToString()),
                        StatusName = row["STATUSNAME"].ToString(),
                        Uid = Convert.ToInt32(row["UID"].ToString())
                    });

                JsonResult jsonResult = this.Json((object)new
                {
                    dtData = billList
                }, JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = new int?(int.MaxValue);
                return jsonResult;
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult SearchCloseBill(TIS.Models.Search Search)
        {
            try
            {
                string sql = "select * from vwPendingBills_new where status=4";
                if (Search.Month != 0)
                    sql = sql + " and month(billdate)=" + (object)Search.Month;
                if (Search.Year != 0)
                    sql = sql + " and year(billdate)=" + (object)Search.Year;
                if (Search.UID != 0)
                    sql = sql + " and UID=" + (object)Search.UID;
                if (Search.Provider != 0)
                    sql = sql + " and provider=" + (object)Search.Provider;
                DataSet data = DB.GetData(sql);
                List<Bill> billList = new List<Bill>();
                DataTable table = data.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        billList.Add(new Bill()
                        {
                            Id = Convert.ToInt32(row["BILL_ID"].ToString()),
                            BillDate = Convert.ToDateTime(row["BILLDATE"].ToString()),
                            Mobile = row["SUB_NO"].ToString(),
                            EmpName = row["EMPLOYEENAME"].ToString(),
                            ManagerName = row["Appr_Manager"].ToString(),
                            TotalAmount = Convert.ToDouble(row["TOTALAMOUNT"].ToString()),
                            StatusName = row["STATUSNAME"].ToString()
                        });
                }
                JsonResult jsonResult = this.Json((object)new
                {
                    dtData = billList
                }, JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = new int?(int.MaxValue);
                return jsonResult;
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult ReimbursingBill(TIS.Models.ForceBill Bill)
        {
            try
            {
                for (int index = 0; index < Bill.BillID.Length; ++index)
                {
                    int num = Bill.BillID[index];
                    DataSet data = DB.GetData(" select ReimbursementAmount,DeductibleAmount,Status,WaiverAmount from tblBills where bill_id=" + (object)num ?? "");
                    data.Tables[0].Rows[0]["ReimbursementAmount"].ToString();
                    data.Tables[0].Rows[0]["DeductibleAmount"].ToString();
                    data.Tables[0].Rows[0]["Status"].ToString();
                    data.Tables[0].Rows[0]["WaiverAmount"].ToString();
                    DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (13, 'Re-ImbursementBill', 'Success','" + this.Session["EmpUID"] + "')");
                    DB.ExecuteNonQuery(string.Format("update tblBills set ReimbursementAmount=DeductibleAmount+WaiverAmount,DeductibleAmount=DeductibleAmount+WaiverAmount,Status=1,WaiverRejection=NULL,WaiverAmount=0 where Bill_ID={0}", (object)num));
                }
                return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex).Replace("'", " ");
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (13, 'Re-ImbursementBill', 'Fail','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (13, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str + "' ,'Re-ImbursementBill')");
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult ChangeBillStatus(ChangeBill CS)
        {
            try
            {
                for (int index = 0; index < CS.BillID.Length; ++index)
                {
                    int num = CS.BillID[index];
                    int statu = CS.Status[index];
                    DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (14, 'Change Bill Status', 'Success','" + this.Session["EmpUID"] + "')");
                    DB.ExecuteNonQuery("update tblBills set status=" + (object)statu + ",comments='',DeductibleAmount=DeductibleAmount+WaiverAmount,WaiverAmount=0,WaiverRejection=NULL where bill_id=" + (object)num ?? "");
                }
                return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex).Replace("'", " ");
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (14, 'Change Bill Status', 'Fail','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (14, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str + "' ,'Change Bill Status')");
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult ReAssigningBill(ChangeBill RB)
        {
            try
            {
                for (int index = 0; index < RB.BillID.Length; ++index)
                {
                    int num1 = RB.BillID[index];
                    int num2 = RB.UID[index];
                    DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (15, 'Re-AssingBill', 'Success','" + this.Session["EmpUID"] + "')");
                    DB.ExecuteNonQuery("update tblBills set UID=" + (object)num2 + ", LINEMANAGER=(select ManagerID from tbluser where UID=" + (object)num2 + "), ROUTEMANAGER=(select ManagerID from tbluser where UID=" + (object)num2 + ") where bill_id=" + (object)num1);
                    DB.ExecuteNonQuery("update tblCallRecord set AUID=" + (object)num2 + " where bill_id=" + (object)num1);
                }
                //return this.Json((object) new{ Message = "success" }, JsonRequestBehavior.AllowGet);
                return Json(new { success = true, message = "Re-Assigned Successfully" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex).Replace("'", " ");
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (15, 'Re-AssingBill', 'Fail','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (15, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str + "' ,'Re-AssingBill')");
                //return this.Json((object) "'Fail':'true'");
                return Json(new { success = false, message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }



        [HttpPost]
        public JsonResult ReAssignBill_Save(int billId, int Uid)
        {
            try
            {
                SqlParameter[] param =
                {
            new SqlParameter("@Bill_ID", SqlDbType.Int) { Value = billId },
new SqlParameter("@Uid", SqlDbType.Int) { Value = Uid }

        };

                DB.ExecuteStoredProc("sp_ReAssignBill_Save", param);

                return Json(new { success = true, message = "Bill Re-Assigned successfully!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


    }
}
