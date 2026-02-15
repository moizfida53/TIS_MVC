// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.ReportChartController
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Mvc;
using TIS.Helper;

namespace TIS.Controllers
{
  public class ReportChartController : Controller
  {
    public ActionResult Index() => (ActionResult) this.View();

    public ActionResult ReportChart() => (ActionResult) this.View();

    public JsonResult GetReportChart()
    {
      try
      {
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_ReportChart");
        List<TIS.Models.ReportChart> reportChartList = new List<TIS.Models.ReportChart>();
        DataTable table = dataSet.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
            reportChartList.Add(new TIS.Models.ReportChart()
            {
              TRANS_TYPE = row["TRANS_TYPE"].ToString(),
              Amount = row["Amount"].ToString(),
              ORG = row["ORG"].ToString()
            });
        }
        return this.Json((object) new
        {
          dtReportChart = reportChartList
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) "'Fail':'true'");
      }
    }
  }
}
