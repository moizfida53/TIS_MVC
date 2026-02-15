// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.AuditReportController
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Mvc;
using TIS.Helper;
using TIS.Models;

namespace TIS.Controllers
{
  public class AuditReportController : Controller
  {
    public ActionResult Index() => (ActionResult) this.View();

    public ActionResult AuditReport() => (ActionResult) this.View();

    public JsonResult GetEmp()
    {
      try
      {
        DataSet data = DB.GetData("select uid,username,name,EMPLOYEENO from tbluser");
        List<Employee> employeeList = new List<Employee>();
        DataTable table = data.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
            employeeList.Add(new Employee()
            {
              UserName = row["USERNAME"].ToString(),
              EmpNo = row["EMPLOYEENO"].ToString(),
              Uid = Convert.ToInt32(row["Uid"].ToString()),
              EmpName = row["NAME"].ToString()
            });
        }
        return this.Json((object) new
        {
          EmpList = employeeList
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) "'Fail':'true'");
      }
    }

    public JsonResult Search(SearchR Search)
    {
      List<TIS.Models.AuditReport> auditReportList = new List<TIS.Models.AuditReport>();
      DataSet data = DB.GetData("Select * from TBL_AT_MASTER Where DATE1 between '" + Search.StartDate.ToString("yyyy-MM-dd HH:mm:ss") + "' and '" + Search.EndDate.ToString("yyyy-MM-dd HH:mm:ss") + "' and form_id = '" + (object) Search.Event + "' and userid = '" + Search.Uid + "' and result = '" + Search.Status + "' ");
      if (data != null)
      {
        DataTable table = data.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
          {
            string str = DB.GetValue("select Name from tbluser where uid = '" + Search.Uid + "'");
            auditReportList.Add(new TIS.Models.AuditReport()
            {
              ID = Convert.ToInt32(row["ID"].ToString()),
              ACTION_NAME = row["ACTION_NAME"].ToString(),
              RESULT = row["RESULT"].ToString(),
              USER = str,
              USERID = row["USERID"].ToString(),
              DATE1 = row["DATE1"].ToString(),
              FORM_ID = Convert.ToInt32(row["FORM_ID"].ToString())
            });
          }
        }
      }
      return this.Json((object) new
      {
        dtAuditReport = auditReportList
      }, JsonRequestBehavior.AllowGet);
    }

    public JsonResult Details(TIS.Models.Details Detail)
    {
      List<TIS.Models.Details> detailsList = new List<TIS.Models.Details>();
      DataSet data = DB.GetData("Select * from TBL_AT_DETAILS Where AT_ID = '" + (object) Detail.ID + "'  ");
      if (data != null)
      {
        DataTable table = data.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
            detailsList.Add(new TIS.Models.Details()
            {
              ID = Convert.ToInt32(row["ID"].ToString()),
              SNO = Convert.ToInt32(row["SNO"].ToString()),
              AT_ID = Convert.ToInt32(row["AT_ID"].ToString()),
              OLD_VALUE = row["OLD_VALUE"].ToString(),
              NEW_VALUE = row["NEW_VALUE"].ToString(),
              FIELD_NAME = row["FIELD_NAME"].ToString()
            });
        }
      }
      return this.Json((object) new
      {
        dtDetails = detailsList
      }, JsonRequestBehavior.AllowGet);
    }
  }
}
