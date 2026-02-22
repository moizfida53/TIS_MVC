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
    [RoleAuthorize(Roles.Administrator, Roles.SuperAdmin, Roles.Employee)]
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
        public JsonResult Search(TIS.Models.Search Search)
        {
            try
            {
                if(!string.IsNullOrEmpty(this.Session["EmpUID"].ToString()))
                {
                    string sql = "select * from vwPendingBills where 1=1";
                    if (Search.Month != 0)
                        sql = sql + " and month(billdate)=" + (object)Search.Month;
                    if (Search.Year != 0)
                        sql = sql + " and year(billdate)=" + (object)Search.Year;
                    if (Search.Status == 1)
                        sql += " and status!= 4";
                    if (Search.Status == 4)
                        sql += " and status = 4";
                    if (Search.CompanyId > 0)
                        sql += " and CompanyID = " + (object)Search.CompanyId;

                    if (!string.IsNullOrEmpty(this.Session["CompanyID"].ToString()))
                    {
                        //sql += " and CompanyID =" + Convert.ToInt32(this.Session["CompanyID"].ToString());
                        sql += " and CompanyID >0";
                    }
                    DataSet data = DB.GetData(sql);
                    List<TIS.Models.BillReport> billReportList = new List<TIS.Models.BillReport>();
                    if(data !=null)
                    {
                        DataTable table = data.Tables[0];
                        if (table.Rows.Count > 0)
                        {
                            foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                                billReportList.Add(new TIS.Models.BillReport()
                                {
                                    BILL_ID = Convert.ToInt32(row["BILL_ID"].ToString()),
                                    SUB_NO = row["SUB_NO"].ToString(),
                                    EMPLOYEENO = row["EMPLOYEENO"].ToString(),
                                    EMPLOYEENAME = row["EMPLOYEENAME"].ToString(),
                                    BILLDATE = row["BILLDATE"].ToString(),
                                    TOTALAMOUNT = row["TOTALAMOUNT"].ToString(),
                                    ManagerName = row["ManagerName"].ToString(),
                                    BillStatus = row["BillStatus"].ToString(),
                                    DateIdentified = row["DateIdentified"].ToString(),
                                    LASTUPDATEDON = row["LASTUPDATEDON"].ToString(),
                                    ApprovedDate = row["ApprovedDate"].ToString(),
                                    DEDUCTIBLEAMOUNT = row["DEDUCTIBLEAMOUNT"].ToString(),
                                    BUSINESSCHARGES = row["BUSINESSCHARGES"].ToString(),
                                    SUB_DESC = row["SUB_DESC"].ToString(),
                                    Company = row["CompanyName"].ToString(),
                                    PAYROLLCATEGORY = row["PAYROLLCATEGORY"].ToString(),
                                });
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
