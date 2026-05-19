// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.BillReportController
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
    [RoleAuthorize(Roles.Administrator, Roles.SuperAdmin)]
    public class BillReportController : Controller
    {
        public ActionResult Index() => (ActionResult)this.View();

        public ActionResult BillReport() => (ActionResult)this.View();

        public JsonResult GetReport(bool IsStatus)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@IsStatus";
                sqlParameter.SqlDbType = SqlDbType.Bit;
                sqlParameter.Value = (object)IsStatus;
                paramColl[0] = sqlParameter;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_BillReport", paramColl);
                List<BillStatus> billStatusList = new List<BillStatus>();
                if (dataSet.Tables.Count > 0)
                {
                    DataTable table = dataSet.Tables[0];
                    if (table.Rows.Count > 0)
                    {
                        foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                            billStatusList.Add(new BillStatus()
                            {
                                Id = Convert.ToInt32(row["ID"].ToString()),
                                Name = row["Name"].ToString()
                            });
                    }
                }
                return this.Json((object)new
                {
                    dtStatus = billStatusList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }
        public JsonResult GetReportFiltersData()
        {
            try
            {
                //SqlParameter[] paramColl = new SqlParameter[1];
                //SqlParameter sqlParameter = new SqlParameter();
                //sqlParameter.ParameterName = "@Username";
                //sqlParameter.SqlDbType = SqlDbType.VarChar;
                //sqlParameter.Value = (object)str;
                //paramColl[0] = sqlParameter;
                //DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetEmployee", paramColl);
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetSalesReportFilterData");
                DataTable table1 = dataSet.Tables[0];
                List<Company> companyList = new List<Company>();
                if (table1.Rows.Count > 0)
                {
                    if (table1.Rows.Count > 0)
                    {
                        foreach (DataRow row in (InternalDataCollectionBase)table1.Rows)
                            companyList.Add(new Company()
                            {
                                ID = Convert.ToInt32(row["ID"].ToString()),
                                COMPANY = row["CompanyName"].ToString()
                            });
                    }
                }

                return this.Json((object)new
                {
                    CompanyList = companyList,
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }
        //public JsonResult Search(TIS.Models.Search Search)
        //{
        //    try
        //    {
        //        if(!string.IsNullOrEmpty(this.Session["EmpUID"].ToString()))
        //        {
        //            string sql = "select * from vw_BillReport where 1=1";
        //            if (Search.Month != 0)
        //                sql = sql + " and month(billdate)=" + (object)Search.Month;
        //            if (Search.Year != 0)
        //                sql = sql + " and year(billdate)=" + (object)Search.Year;
        //            if (Search.Status == 1)
        //                sql += " and status!= 4";
        //            if (Search.Status == 4)
        //                sql += " and status = 4";
        //            if (Search.CompanyId > 0)
        //                sql += " and CompanyID = " + (object)Search.CompanyId;

        //            if (!string.IsNullOrEmpty(this.Session["CompanyID"].ToString()))
        //            {
        //                //sql += " and CompanyID =" + Convert.ToInt32(this.Session["CompanyID"].ToString());
        //                sql += " and CompanyID >0";
        //            }
        //            DataSet data = DB.GetData(sql);
        //            List<TIS.Models.BillReport> billReportList = new List<TIS.Models.BillReport>();
        //            if(data !=null)
        //            {
        //                DataTable table = data.Tables[0];
        //                if (table.Rows.Count > 0)
        //                {
        //                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
        //                        billReportList.Add(new TIS.Models.BillReport()
        //                        {
        //                            BILL_ID = Convert.ToInt32(row["BILL_ID"].ToString()),
        //                            SUB_NO = row["SUB_NO"].ToString(),
        //                            EMPLOYEENO = row["EMPLOYEENO"].ToString(),
        //                            EMPLOYEENAME = row["EMPLOYEENAME"].ToString(),
        //                            BILLDATE = row["BILLDATE"].ToString(),
        //                            TOTALAMOUNT = row["TOTALAMOUNT"].ToString(),
        //                            ManagerName = row["ManagerName"].ToString(),
        //                            BillStatus = row["BillStatus"].ToString(),
        //                            //DateIdentified = row["DateIdentified"].ToString(),
        //                            LASTUPDATEDON = row["LASTUPDATEDON"].ToString(),
        //                            //ApprovedDate = row["ApprovedDate"].ToString(),
        //                            DEDUCTIBLEAMOUNT = row["DEDUCTIBLEAMOUNT"].ToString(),
        //                            BUSINESSCHARGES = row["BUSINESSCHARGES"].ToString(),
        //                            SUB_DESC = row["SUB_DESC"].ToString(),
        //                            Company = row["CompanyName"].ToString(),
        //                            PAYROLLCATEGORY = row["PAYROLLCATEGORY"].ToString(),
        //                            Forced_by_UID = row["Forced_by_UID"].ToString(),
        //                            Forced_Date = row["Forced_Date"].ToString(),
        //                        });
        //                }
        //            }
        //            JsonResult jsonResult = this.Json((object)new
        //            {
        //                dtData = billReportList
        //            }, JsonRequestBehavior.AllowGet);
        //            jsonResult.MaxJsonLength = new int?(int.MaxValue);
        //            return jsonResult;
        //        }
        //        else
        //        {
        //            return this.Json((object)"'Fail':'true'");
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        return this.Json((object)"'Fail':'true'");
        //    }
        //}

        private string SafeGetColumn(DataRow row, params string[] columnNames)
        {
            foreach (string col in columnNames)
            {
                if (row.Table.Columns.Contains(col) && row[col] != DBNull.Value)
                    return row[col].ToString();
            }
            return "";
        }
        public JsonResult Search(TIS.Models.Search Search)
        {
            try
            {
                if (!string.IsNullOrEmpty(this.Session["EmpUID"].ToString()))
                {
                    SqlParameter[] paramColl = new SqlParameter[4];

                    SqlParameter pMonth = new SqlParameter();
                    pMonth.ParameterName = "@Month";
                    pMonth.SqlDbType = SqlDbType.Int;
                    pMonth.Value = Search.Month;
                    paramColl[0] = pMonth;

                    SqlParameter pYear = new SqlParameter();
                    pYear.ParameterName = "@Year";
                    pYear.SqlDbType = SqlDbType.Int;
                    pYear.Value = Search.Year;
                    paramColl[1] = pYear;

                    SqlParameter pStatus = new SqlParameter();
                    pStatus.ParameterName = "@Status";
                    pStatus.SqlDbType = SqlDbType.Int;
                    pStatus.Value = Search.Status;
                    paramColl[2] = pStatus;

                    SqlParameter pCompanyId = new SqlParameter();
                    pCompanyId.ParameterName = "@CompanyId";
                    pCompanyId.SqlDbType = SqlDbType.Int;
                    pCompanyId.Value = Search.CompanyId;
                    paramColl[3] = pCompanyId;

                    DataSet data = DB.ExecuteStoredProcDataSet("sp_SearchBillReport", paramColl);

                    List<TIS.Models.BillReport> billReportList = new List<TIS.Models.BillReport>();

                    if (data != null && data.Tables.Count > 0)
                    {
                        DataTable table = data.Tables[0];
                        if (table.Rows.Count > 0)
                        {
                            foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                            {
                                string forcedDate = "";
                                if (row.Table.Columns.Contains("Forced_Date") && row["Forced_Date"] != DBNull.Value)
                                {
                                    string rawForcedDate = row["Forced_Date"].ToString().Trim();
                                    if (!string.IsNullOrEmpty(rawForcedDate))
                                    {
                                        DateTime parsedDate;

                                        // ✅ Format coming from SP: "2026-04-23 13:51:27.813" (yyyy-MM-dd HH:mm:ss.fff)
                                        if (DateTime.TryParse(rawForcedDate,
                                            System.Globalization.CultureInfo.InvariantCulture,
                                            System.Globalization.DateTimeStyles.None, out parsedDate))
                                        {
                                            // ✅ Output: "23-Apr-26 13:51"
                                            forcedDate = parsedDate.ToString("dd-MMM-yy HH:mm");
                                        }
                                        else
                                        {
                                            forcedDate = rawForcedDate; // fallback
                                        }
                                    }
                                }

                                billReportList.Add(new TIS.Models.BillReport()
                                {
                                    BILL_ID = Convert.ToInt32(SafeGetColumn(row, "BILL_ID")),
                                    BILLDATE = SafeGetColumn(row, "BILLDATE"),
                                    EMPLOYEENO = SafeGetColumn(row, "EMPLOYEENO"),
                                    EMPLOYEENAME = SafeGetColumn(row, "EMPLOYEENAME"),
                                    SUB_NO = SafeGetColumn(row, "SUB_NO"),
                                    SUB_DESC = SafeGetColumn(row, "SUB_DESC"),
                                    TOTALAMOUNT = SafeGetColumn(row, "TOTALAMOUNT"),
                                    BUSINESSCHARGES = SafeGetColumn(row, "BUSINESSCHARGES"),
                                    PERSONALCHARGES = SafeGetColumn(row, "PERSONALCHARGES"),
                                    PERSONALLIMITCHARGES = SafeGetColumn(row, "PERSONALLIMITCHARGES"),
                                    DEDUCTIBLEAMOUNT = SafeGetColumn(row, "DEDUCTIBLEAMOUNT"),
                                    COSTCENTER = SafeGetColumn(row, "COSTCENTER"),
                                    COSTCENTERCODE = SafeGetColumn(row, "Code", "CostCenterCode", "CODE"),  // ← tries multiple names
                                    DEPARTMENT = SafeGetColumn(row, "DESCRIPTION", "Department"),
                                    PAYROLLCATEGORY = SafeGetColumn(row, "PAYROLLCATEGORY"),
                                    BillStatus = SafeGetColumn(row, "BillStatus"),
                                    Company = SafeGetColumn(row, "CompanyName", "Company"),
                                    PROVIDERNAME = row["PROVIDERNAME"].ToString(),
                                    Forced_by_UID = SafeGetColumn(row, "Forced_by_UID"),
                                    Forced_Date = forcedDate,
                                });
                            }

                        }
                    }

                    JsonResult jsonResult = this.Json((object)new
                    {
                        dtData = billReportList
                    }, JsonRequestBehavior.AllowGet);
                    jsonResult.MaxJsonLength = new int?(int.MaxValue);
                    return jsonResult;
                }
                else
                {
                    return this.Json((object)"'Fail':'true'");
                }
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }
    }
}
