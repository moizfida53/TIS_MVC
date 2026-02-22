// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.SAP_PendingController
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Mvc;
using TIS.Filters;
using TIS.Helper;
using TIS.Models;

namespace TIS.Controllers
{
    [RoleAuthorize(Roles.Administrator, Roles.SuperAdmin, Roles.Employee)]
    public class SAP_PendingController : Controller
    {
        public ActionResult Index() => (ActionResult)this.View();

        public ActionResult SAP_Pending() => (ActionResult)this.View();

        public JsonResult GetSAPReport()
        {
            try
            {
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetSAPReport");
                List<SAPReport> sapReportList = new List<SAPReport>();
                DataTable table = dataSet.Tables[0];
                string str = dataSet.Tables[1].Rows[0][0].ToString();
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        sapReportList.Add(new SAPReport()
                        {
                            Bill_ID = row["Bill_ID"].ToString(),
                            BillDate = row["BILLDATE"].ToString(),
                            TelephoneNumber = row["SUB_NO"].ToString(),
                            EMPLOYEENO = row["EMPLOYEENO"].ToString(),
                            EmployeeName = row["EMPLOYEENAME"].ToString(),
                            ManagerName = row["LINEMANAGER"].ToString(),
                            TotalAmount = row["TOTALAMOUNT"].ToString(),
                            BusinessCharges = row["BussCharged"].ToString(),
                            PersonalCharges = row["PERSONALCHARGES"].ToString(),
                            DeductibleAmount = row["DEDUCTIBLEAMOUNT"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    dtbillDetails = sapReportList,
                    PendingBills = str
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                this.AuditTrail(nameof(GetSAPReport), ex.ToString());
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult postSAP()
        {
            try
            {
                return this.Json((object)new
                {
                    Message = new BapiBIController().ExportToBapi()
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                this.AuditTrail("'postSAP'", ex.ToString());
                return this.Json((object)new { Message = "Failed" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult MarkAsPosted(List<SAPReport> value)
        {
            try
            {
                string str = this.Session["EmpLoginName"].ToString();
                for (int index = 0; index < value.Count; ++index)
                {
                    SqlParameter[] paramColl = new SqlParameter[3];
                    SqlParameter sqlParameter1 = new SqlParameter();
                    sqlParameter1.ParameterName = "@Username";
                    sqlParameter1.SqlDbType = SqlDbType.NVarChar;
                    sqlParameter1.Value = (object)str;
                    paramColl[0] = sqlParameter1;
                    SqlParameter sqlParameter2 = new SqlParameter();
                    sqlParameter2.ParameterName = "@Bill_ID";
                    sqlParameter2.SqlDbType = SqlDbType.Int;
                    sqlParameter2.Value = (object)value[index].Bill_ID;
                    paramColl[1] = sqlParameter2;
                    SqlParameter sqlParameter3 = new SqlParameter();
                    sqlParameter3.ParameterName = "@DeductibleAmount";
                    sqlParameter3.SqlDbType = SqlDbType.Decimal;
                    sqlParameter3.Value = (object)value[index].DeductibleAmount;
                    paramColl[2] = sqlParameter3;
                    DB.ExecuteStoredProcDataSet("sp_SAP_MarkAsPosted", paramColl);
                }
                return this.Json((object)"'Success':'true'");
            }
            catch (Exception ex)
            {
                this.AuditTrail(nameof(MarkAsPosted), ex.ToString());
                return this.Json((object)"'Fail':'true'");
            }
        }

        public void AuditTrail(string Function, string Error)
        {
            SqlParameter[] paramColl = new SqlParameter[2];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@Exception";
            sqlParameter1.SqlDbType = SqlDbType.NVarChar;
            sqlParameter1.Value = (object)Error;
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@FunctionName";
            sqlParameter2.SqlDbType = SqlDbType.NVarChar;
            sqlParameter2.Value = (object)Function;
            paramColl[1] = sqlParameter2;
            DB.ExecuteStoredProc("sp_Exception", paramColl);
        }
    }
}
