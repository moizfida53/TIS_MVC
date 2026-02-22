// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.ReportController
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
    public class ReportController : Controller
    {
        public ActionResult Index() => (ActionResult)this.View();

        public ActionResult Report() => (ActionResult)this.View();

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
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_Report", paramColl);
                List<Provider1> provider1List = new List<Provider1>();
                DataTable table1 = dataSet.Tables[0];
                if (table1.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table1.Rows)
                        provider1List.Add(new Provider1()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            Name = row["Name"].ToString()
                        });
                }
                List<Status1> status1List = new List<Status1>();
                if (dataSet.Tables.Count > 0)
                {
                    DataTable table2 = dataSet.Tables[1];
                    if (table2.Rows.Count > 0)
                    {
                        foreach (DataRow row in (InternalDataCollectionBase)table2.Rows)
                            status1List.Add(new Status1()
                            {
                                ID = Convert.ToInt32(row["ID"].ToString()),
                                Name = row["Name"].ToString()
                            });
                    }
                }
                return this.Json((object)new
                {
                    ProviderList = provider1List,
                    dtStatus = status1List
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
                string sql = "select * from vwPendingBills where 1=1";
                if (Search.Month != 0)
                    sql = sql + " and month(billdate)=" + (object)Search.Month;
                if (Search.Year != 0)
                    sql = sql + " and year(billdate)=" + (object)Search.Year;
                if (Search.Status == 1)
                    sql += " and status!= 4";
                if (Search.Provider != 0)
                    sql = sql + " and provider=" + (object)Search.Provider;
                if (Search.Status == 4)
                    sql += " and status = 4";
                DataSet data = DB.GetData(sql);
                List<BillData> billDataList = new List<BillData>();
                DataTable table = data.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        billDataList.Add(new BillData()
                        {
                            BILL_ID = Convert.ToInt32(row["BILL_ID"].ToString()),
                            SUB_NO = row["SUB_NO"].ToString(),
                            EMPLOYEENAME = row["EMPLOYEENAME"].ToString(),
                            BILLDATE = row["BILLDATE"].ToString(),
                            TOTALAMOUNT = row["TOTALAMOUNT"].ToString(),
                            LMEmail = row["LMEmail"].ToString()
                        });
                }
                JsonResult jsonResult = this.Json((object)new
                {
                    dtData = billDataList
                }, JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = new int?(int.MaxValue);
                return jsonResult;
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }
    }
}
