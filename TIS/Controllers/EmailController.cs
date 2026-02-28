// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.EmailController
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
    public class EmailController : Controller
    {
        public ActionResult Index() => (ActionResult)this.View();

        public ActionResult Templates() => (ActionResult)this.View(nameof(Templates));

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
            SqlParameter sqlParameter6 = new SqlParameter();
            sqlParameter6.ParameterName = "@EmailBCC";
            sqlParameter6.SqlDbType = SqlDbType.NVarChar;
            sqlParameter6.Value = (object)t.EmailBCC;
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
    }
}
