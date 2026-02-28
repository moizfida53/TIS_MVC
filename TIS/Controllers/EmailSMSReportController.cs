// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.EmailSMSReportController
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
    public class EmailSMSReportController : Controller
    {
        public ActionResult EmailSMSReport() => (ActionResult)this.View();

        public JsonResult SearchEmail(EmailSms.EmailSMSSearch Search)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[3];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@StartDate";
                sqlParameter1.SqlDbType = SqlDbType.DateTime;
                sqlParameter1.Value = (object)Search.StartDate;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@EndDate";
                sqlParameter2.SqlDbType = SqlDbType.DateTime;
                sqlParameter2.Value = (object)Search.EndDate;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@Sent";
                sqlParameter3.SqlDbType = SqlDbType.Int;
                sqlParameter3.Value = (object)Search.Status;
                paramColl[2] = sqlParameter3;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_EmailReport", paramColl);
                List<SendEmail> sendEmailList = new List<SendEmail>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        sendEmailList.Add(new SendEmail()
                        {
                            Id = Convert.ToInt32(row["Id"].ToString()),
                            TemplateId = Convert.ToInt32(row["TemplateId"].ToString()),
                            TemplateName = row["TemplateName"].ToString(),
                            Subject = row["Subject"].ToString(),
                            EmailText = row["Body"].ToString(),
                            EmailFrom = row["EmailFrom"].ToString(),
                            EmailTo = row["EmailTo"].ToString(),
                            IsSent = (int)Convert.ToInt16(row["IsSent"].ToString()),
                            senton = row["SentOn"].ToString()
                        });
                }
                JsonResult jsonResult = this.Json((object)new
                {
                    dtEmailReport = sendEmailList
                }, JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = new int?(int.MaxValue);
                return jsonResult;
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult SearchSMS(EmailSms.EmailSMSSearch Search)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[3];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@StartDate";
                sqlParameter1.SqlDbType = SqlDbType.DateTime;
                sqlParameter1.Value = (object)Search.StartDate;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@EndDate";
                sqlParameter2.SqlDbType = SqlDbType.DateTime;
                sqlParameter2.Value = (object)Search.EndDate;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@Sent";
                sqlParameter3.SqlDbType = SqlDbType.Int;
                sqlParameter3.Value = (object)Search.Status;
                paramColl[2] = sqlParameter3;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_SMSReport", paramColl);
                List<SMSTemplate> smsTemplateList = new List<SMSTemplate>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        smsTemplateList.Add(new SMSTemplate()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            SMSTemplateId = Convert.ToInt32(row["SMSTemplateID"].ToString()),
                            SMSTemplateName = row["SMSTemplateName"].ToString(),
                            SMSTo = row["SMSTo"].ToString(),
                            Message = row["Message"].ToString()
                        });
                }
                JsonResult jsonResult = this.Json((object)new
                {
                    dtSMSReport = smsTemplateList
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
