// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.PivotController
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Mvc;
using TIS.Filters;
using TIS.Helper;
using TIS.Models;

namespace TIS.Controllers
{
    [RoleAuthorize(Roles.Administrator, Roles.SuperAdmin)]
    public class PivotController : Controller
    {
        public ActionResult Index() => (ActionResult)this.View();

        public ActionResult Pivot() => (ActionResult)this.View();

        public JsonResult GetPivot()
        {
            try
            {
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_vwSub1Pivot");
                List<TIS.Models.Pivot> pivotList = new List<TIS.Models.Pivot>();
                DataTable table = dataSet.Tables[1];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        pivotList.Add(new TIS.Models.Pivot()
                        {
                            SUB_NO = Convert.ToInt32(row["SUB_NO"].ToString()),
                            TRANS_TYPE = row["TRANS_TYPE"].ToString(),
                            AMOUNT = Convert.ToDecimal(row["AMOUNT"].ToString()),
                            BILLDATE = row["BILLDATE"].ToString()
                        });
                }
                JsonResult pivot = this.Json((object)new
                {
                    dtPivot = pivotList
                }, JsonRequestBehavior.AllowGet);
                pivot.MaxJsonLength = new int?(int.MaxValue);
                return pivot;
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult Save(PivotData value)
        {
            try
            {
                DB.ExecuteNonQuery("insert into tblPivot (Object,Date) values ('" + value.Object + "',GetDate())");
                return this.Json((object)"Success");
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult Restore()
        {
            try
            {
                JsonConvert.DeserializeObject<List<string>>("['0','1','2','3','4']");
                JsonResult jsonResult = this.Json((object)new
                {
                    dtPivot = DB.GetData("select Top 1 Object from tblPivot").Tables[0].Rows[0]["Object"].ToString()
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
