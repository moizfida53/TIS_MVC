// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.EmailSmsController
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web.Configuration;
using System.Web.Mvc;
using TIS.Helper;
using TIS.Models;

namespace TIS.Controllers
{
  public class EmailSmsController : Controller
  {
    public ActionResult EmailSms() => (ActionResult) this.View();

    public JsonResult GetGroups()
    {
      string empty = string.Empty;
      try
      {
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetGroups");
        List<TIS.Models.EmailSms.EmailGroup> emailGroupList = new List<TIS.Models.EmailSms.EmailGroup>();
        DataTable table = dataSet.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
            emailGroupList.Add(new TIS.Models.EmailSms.EmailGroup()
            {
              GroupID = Convert.ToInt32(row["GroupID"].ToString()),
              GroupName = row["GroupName"].ToString()
            });
        }
        return this.Json((object) new
        {
          dtGroups = emailGroupList
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult SendEmail(TIS.Models.EmailSms.EmailGroup value)
    {
      string empty = string.Empty;
      try
      {
        string str1 = string.Join(",", (IEnumerable<string>) ((IEnumerable<string>) value.Emails.Replace(" ", string.Empty).Split(',')).Reverse<string>().Distinct<string>().ToList<string>());
        SqlParameter[] paramColl1 = new SqlParameter[4];
        SqlParameter sqlParameter1 = new SqlParameter();
        sqlParameter1.ParameterName = "@GroupList";
        sqlParameter1.SqlDbType = SqlDbType.VarChar;
        sqlParameter1.Value = (object) value.CheckedGroupList;
        paramColl1[0] = sqlParameter1;
        SqlParameter sqlParameter2 = new SqlParameter();
        sqlParameter2.ParameterName = "@Subject";
        sqlParameter2.SqlDbType = SqlDbType.VarChar;
        sqlParameter2.Value = (object) value.Subject;
        paramColl1[1] = sqlParameter2;
        SqlParameter sqlParameter3 = new SqlParameter();
        sqlParameter3.ParameterName = "@TemplateID";
        sqlParameter3.SqlDbType = SqlDbType.Int;
        sqlParameter3.Value = (object) value.TemplateID;
        paramColl1[2] = sqlParameter3;
        SqlParameter sqlParameter4 = new SqlParameter();
        sqlParameter4.ParameterName = "@Email";
        sqlParameter4.SqlDbType = SqlDbType.NVarChar;
        sqlParameter4.Value = (object) str1;
        paramColl1[3] = sqlParameter4;
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_SendGroupEmail", paramColl1);
        string host = dataSet.Tables[1].Rows[0]["smtpsettings"].ToString();
        if (dataSet != null && dataSet.Tables[0].Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) dataSet.Tables[0].Rows)
          {
            try
            {
              MailMessage message = new MailMessage();
              message.To.Add(row["EmailTo"].ToString());
              message.From = new MailAddress(row["EmailFrom"].ToString());
              message.Sender = new MailAddress(row["EmailFrom"].ToString());
              message.Subject = row["Subject"].ToString();
              string str2 = row["Body"].ToString();
              message.Body = str2;
              message.IsBodyHtml = true;
              new SmtpClient(host)
              {
                UseDefaultCredentials = true
              }.Send(message);
              SqlParameter[] paramColl2 = new SqlParameter[1];
              SqlParameter sqlParameter5 = new SqlParameter();
              sqlParameter5.ParameterName = "@ID";
              sqlParameter5.SqlDbType = SqlDbType.Int;
              sqlParameter5.Value = (object) row["ID"].ToString();
              paramColl2[0] = sqlParameter5;
              DB.ExecuteStoredProcDataSet("sp_GroupEmailMarkAsSent", paramColl2);
            }
            catch (Exception ex)
            {
              empty = string.Empty;
              string str3 = Convert.ToString((object) ex);
              DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (4, 'Send Email', 'Fail','" + this.Session["EmpUID"] + "')");
              DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (4, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str3 + "' ,'Issue Send Single Email')");
            }
          }
        }
        return this.Json((object) new{ Message = "Success" }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult GetTemplate()
    {
      try
      {
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GroupEmailTemplate");
        List<Template> templateList = new List<Template>();
        DataTable table = dataSet.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
            templateList.Add(new Template()
            {
              TemplateId = Convert.ToInt32(row["Template_ID"].ToString()),
              TemplateName = row["TemplateName"].ToString(),
              Subject = row["TemplateName"].ToString(),
              TemplateText = row["Body"].ToString()
            });
        }
        return this.Json((object) new
        {
          dtTemplate = templateList
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult GetEmails(TIS.Models.EmailSms.EmailGroup value)
    {
      try
      {
        SqlParameter[] paramColl = new SqlParameter[1];
        SqlParameter sqlParameter = new SqlParameter();
        sqlParameter.ParameterName = "@GroupID";
        sqlParameter.SqlDbType = SqlDbType.NVarChar;
        sqlParameter.Value = (object) value.GroupIDs;
        paramColl[0] = sqlParameter;
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetEmails", paramColl);
        List<Email> emailList = new List<Email>();
        DataTable table = dataSet.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
            emailList.Add(new Email()
            {
              Emails = row["Emails"].ToString()
            });
        }
        return this.Json((object) new{ dtEmail = emailList }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult GetEmployees()
    {
      string empty = string.Empty;
      try
      {
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetEmployeesForGroup");
        List<TIS.Models.EmailSms.Employees> employeesList1 = new List<TIS.Models.EmailSms.Employees>();
        DataTable table1 = dataSet.Tables[0];
        if (table1.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table1.Rows)
            employeesList1.Add(new TIS.Models.EmailSms.Employees()
            {
              UID = Convert.ToInt32(row["UID"].ToString()),
              USERNAME = row["USERNAME"].ToString(),
              EMAIL = row["Email"].ToString(),
              ORG = row["ORG"].ToString()
            });
        }
        List<TIS.Models.EmailSms.Employees> employeesList2 = new List<TIS.Models.EmailSms.Employees>();
        DataTable table2 = dataSet.Tables[1];
        if (table2.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table2.Rows)
            employeesList2.Add(new TIS.Models.EmailSms.Employees()
            {
              UID = Convert.ToInt32(row["UID"].ToString()),
              USERNAME = row["USERNAME"].ToString(),
              SUB_NO = row["SUB_NO"].ToString(),
              ORG = row["ORG"].ToString()
            });
        }
        return this.Json((object) new
        {
          dtEmpList = employeesList1,
          dtEmpList1 = employeesList2
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult AddUpdateGroup(TIS.Models.EmailSms.Employees value)
    {
      try
      {
        string str = string.Join<int>(",", (IEnumerable<int>) value.Emp);
        SqlParameter[] paramColl = new SqlParameter[4];
        SqlParameter sqlParameter1 = new SqlParameter();
        sqlParameter1.ParameterName = "@UIDs";
        sqlParameter1.SqlDbType = SqlDbType.NVarChar;
        sqlParameter1.Value = (object) str;
        paramColl[0] = sqlParameter1;
        SqlParameter sqlParameter2 = new SqlParameter();
        sqlParameter2.ParameterName = "@GroupName";
        sqlParameter2.SqlDbType = SqlDbType.NVarChar;
        sqlParameter2.Value = (object) value.GroupName;
        paramColl[1] = sqlParameter2;
        SqlParameter sqlParameter3 = new SqlParameter();
        sqlParameter3.ParameterName = "@GroupID";
        sqlParameter3.SqlDbType = SqlDbType.Int;
        sqlParameter3.Value = (object) value.GroupID;
        paramColl[2] = sqlParameter3;
        SqlParameter sqlParameter4 = new SqlParameter();
        sqlParameter4.ParameterName = "@IsUpdated";
        sqlParameter4.SqlDbType = SqlDbType.Int;
        sqlParameter4.Value = (object) value.IsUpdated;
        paramColl[3] = sqlParameter4;
        DB.ExecuteStoredProc("sp_AddUpdateGroup", paramColl);
      }
      catch (Exception ex)
      {
      }
      return this.Json((object) new{ Message = "Success" }, JsonRequestBehavior.AllowGet);
    }

    public JsonResult GetGroupDetails(TIS.Models.EmailSms.EmailGroup value)
    {
      try
      {
        SqlParameter[] paramColl = new SqlParameter[1];
        SqlParameter sqlParameter = new SqlParameter();
        sqlParameter.ParameterName = "@GroupID";
        sqlParameter.SqlDbType = SqlDbType.NVarChar;
        sqlParameter.Value = (object) value.GroupID;
        paramColl[0] = sqlParameter;
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetGroupDetails", paramColl);
        List<TIS.Models.EmailSms.Employees> employeesList = new List<TIS.Models.EmailSms.Employees>();
        DataTable table = dataSet.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
            employeesList.Add(new TIS.Models.EmailSms.Employees()
            {
              UID = Convert.ToInt32(row["UID"].ToString())
            });
        }
        return this.Json((object) new
        {
          dtUIDs = employeesList
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult DeleteGroup(TIS.Models.EmailSms.EmailGroup value)
    {
      try
      {
        SqlParameter[] paramColl = new SqlParameter[1];
        SqlParameter sqlParameter = new SqlParameter();
        sqlParameter.ParameterName = "@GroupID";
        sqlParameter.SqlDbType = SqlDbType.Int;
        sqlParameter.Value = (object) value.GroupID;
        paramColl[0] = sqlParameter;
        DB.ExecuteStoredProc("sp_DeleteGroup", paramColl);
        return this.Json((object) new
        {
          Message = "Deleted Successfuly"
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult CreateTemplate(Template value)
    {
      try
      {
        SqlParameter[] paramColl = new SqlParameter[3];
        SqlParameter sqlParameter1 = new SqlParameter();
        sqlParameter1.ParameterName = "@TemplateName";
        sqlParameter1.SqlDbType = SqlDbType.NVarChar;
        sqlParameter1.Value = (object) value.TemplateName;
        paramColl[0] = sqlParameter1;
        SqlParameter sqlParameter2 = new SqlParameter();
        sqlParameter2.ParameterName = "@Subject";
        sqlParameter2.SqlDbType = SqlDbType.NVarChar;
        sqlParameter2.Value = (object) value.Subject;
        paramColl[1] = sqlParameter2;
        SqlParameter sqlParameter3 = new SqlParameter();
        sqlParameter3.ParameterName = "@TemplateText";
        sqlParameter3.SqlDbType = SqlDbType.NVarChar;
        sqlParameter3.Value = (object) value.TemplateText;
        paramColl[2] = sqlParameter3;
        DB.ExecuteStoredProc("sp_CreateTemplate", paramColl);
        return this.Json((object) new
        {
          Message = "Added Successfuly"
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult SaveTemplate(Template value)
    {
      try
      {
        SqlParameter[] paramColl = new SqlParameter[4];
        SqlParameter sqlParameter1 = new SqlParameter();
        sqlParameter1.ParameterName = "@TemplateName";
        sqlParameter1.SqlDbType = SqlDbType.NVarChar;
        sqlParameter1.Value = (object) value.TemplateName;
        paramColl[0] = sqlParameter1;
        SqlParameter sqlParameter2 = new SqlParameter();
        sqlParameter2.ParameterName = "@Subject";
        sqlParameter2.SqlDbType = SqlDbType.NVarChar;
        sqlParameter2.Value = (object) value.Subject;
        paramColl[1] = sqlParameter2;
        SqlParameter sqlParameter3 = new SqlParameter();
        sqlParameter3.ParameterName = "@TemplateText";
        sqlParameter3.SqlDbType = SqlDbType.NVarChar;
        sqlParameter3.Value = (object) value.TemplateText;
        paramColl[2] = sqlParameter3;
        SqlParameter sqlParameter4 = new SqlParameter();
        sqlParameter4.ParameterName = "@TemplateId";
        sqlParameter4.SqlDbType = SqlDbType.NVarChar;
        sqlParameter4.Value = (object) value.TemplateId;
        paramColl[3] = sqlParameter4;
        DB.ExecuteStoredProc("sp_SaveTemplate", paramColl);
        return this.Json((object) new
        {
          Message = "Added Successfuly"
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult GetSMSGroups()
    {
      string empty = string.Empty;
      try
      {
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetSMSGroups");
        List<TIS.Models.EmailSms.EmailGroup> emailGroupList = new List<TIS.Models.EmailSms.EmailGroup>();
        DataTable table = dataSet.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
            emailGroupList.Add(new TIS.Models.EmailSms.EmailGroup()
            {
              GroupID = Convert.ToInt32(row["GroupID"].ToString()),
              GroupName = row["GroupName"].ToString()
            });
        }
        return this.Json((object) new
        {
          dtSMSGroups = emailGroupList
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult GetMobileNo(TIS.Models.EmailSms.SMSGroup value)
    {
      try
      {
        SqlParameter[] paramColl = new SqlParameter[1];
        SqlParameter sqlParameter = new SqlParameter();
        sqlParameter.ParameterName = "@GroupID";
        sqlParameter.SqlDbType = SqlDbType.NVarChar;
        sqlParameter.Value = (object) value.GroupIDs;
        paramColl[0] = sqlParameter;
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetMobileNos", paramColl);
        List<TIS.Models.EmailSms.Mobile> mobileList = new List<TIS.Models.EmailSms.Mobile>();
        DataTable table = dataSet.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
            mobileList.Add(new TIS.Models.EmailSms.Mobile()
            {
              MobileNo = row["MobileNo"].ToString()
            });
        }
        return this.Json((object) new
        {
          dtMobile = mobileList
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult GetSMSTemplate()
    {
      try
      {
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GroupSMSTemplate");
        List<SMSTemplate> smsTemplateList = new List<SMSTemplate>();
        DataTable table = dataSet.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
            smsTemplateList.Add(new SMSTemplate()
            {
              SMSTemplateId = Convert.ToInt32(row["SMSTemplate_ID"].ToString()),
              SMSTemplateName = row["SMSTemplateName"].ToString(),
              Message = row["Message"].ToString(),
              Language = Convert.ToInt32(row["Language"].ToString())
            });
        }
        return this.Json((object) new
        {
          dtTemplate = smsTemplateList
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult SendSMS(TIS.Models.EmailSms.SMSGroup value)
    {
      string appSetting1 = WebConfigurationManager.AppSettings["SMSSenderUserName"];
      string appSetting2 = WebConfigurationManager.AppSettings["SMSSenderPassword"];
      string appSetting3 = WebConfigurationManager.AppSettings["SMSSenderID"];
      string empty = string.Empty;
      string str1 = value.Language.ToString();
      if (str1 == null || str1 == "")
        str1 = "1";
      try
      {
        List<string> list = ((IEnumerable<string>) value.MobileNos.Replace(" ", string.Empty).Split(',')).Reverse<string>().Distinct<string>().ToList<string>();
        string str2 = value.SMS;
        try
        {
          for (int index = 0; index < list.Count; ++index)
          {
            string str3 = list[index].ToString();
            string str4 = new WebClient().DownloadString("http://www.brazilboxtech.com/api/send.aspx?username=" + appSetting1 + "&password=" + appSetting2 + "&language=" + str1 + "&sender=" + appSetting3 + "&mobile=965" + str3 + "&message= " + str2 ?? "");
            int num = 0;
            if (str4.Contains("OK"))
              num = 1;
            else
              str2 = str4;
            SqlParameter[] paramColl = new SqlParameter[5];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@TemplateID";
            sqlParameter1.SqlDbType = SqlDbType.Int;
            sqlParameter1.Value = (object) value.TemplateID;
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@SMSTo";
            sqlParameter2.SqlDbType = SqlDbType.NVarChar;
            sqlParameter2.Value = (object) str3;
            paramColl[1] = sqlParameter2;
            SqlParameter sqlParameter3 = new SqlParameter();
            sqlParameter3.ParameterName = "@Message";
            sqlParameter3.SqlDbType = SqlDbType.NVarChar;
            sqlParameter3.Value = (object) str2;
            paramColl[2] = sqlParameter3;
            SqlParameter sqlParameter4 = new SqlParameter();
            sqlParameter4.ParameterName = "@IsSent";
            sqlParameter4.SqlDbType = SqlDbType.Int;
            sqlParameter4.Value = (object) num;
            paramColl[3] = sqlParameter4;
            SqlParameter sqlParameter5 = new SqlParameter();
            sqlParameter5.ParameterName = "@Language";
            sqlParameter5.SqlDbType = SqlDbType.Int;
            sqlParameter5.Value = (object) str1;
            paramColl[4] = sqlParameter5;
            DB.ExecuteStoredProc("sp_SMSLog", paramColl);
          }
        }
        catch (Exception ex)
        {
          throw;
        }
        return this.Json((object) new{ Message = "Success" }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult CreateSMSTemplate(SMSTemplate value)
    {
      try
      {
        SqlParameter[] paramColl = new SqlParameter[3];
        SqlParameter sqlParameter1 = new SqlParameter();
        sqlParameter1.ParameterName = "@SMSTemplateName";
        sqlParameter1.SqlDbType = SqlDbType.NVarChar;
        sqlParameter1.Value = (object) value.SMSTemplateName;
        paramColl[0] = sqlParameter1;
        SqlParameter sqlParameter2 = new SqlParameter();
        sqlParameter2.ParameterName = "@Message";
        sqlParameter2.SqlDbType = SqlDbType.NVarChar;
        sqlParameter2.Value = (object) value.Message;
        paramColl[1] = sqlParameter2;
        SqlParameter sqlParameter3 = new SqlParameter();
        sqlParameter3.ParameterName = "@Language";
        sqlParameter3.SqlDbType = SqlDbType.Int;
        sqlParameter3.Value = (object) value.Language;
        paramColl[2] = sqlParameter3;
        DB.ExecuteStoredProc("sp_CreateSMSTemplate", paramColl);
        return this.Json((object) new
        {
          Message = "Added Successfuly"
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult SaveSMSTemplate(SMSTemplate value)
    {
      try
      {
        SqlParameter[] paramColl = new SqlParameter[4];
        SqlParameter sqlParameter1 = new SqlParameter();
        sqlParameter1.ParameterName = "@SMSTemplateName";
        sqlParameter1.SqlDbType = SqlDbType.NVarChar;
        sqlParameter1.Value = (object) value.SMSTemplateName;
        paramColl[0] = sqlParameter1;
        SqlParameter sqlParameter2 = new SqlParameter();
        sqlParameter2.ParameterName = "@Message";
        sqlParameter2.SqlDbType = SqlDbType.NVarChar;
        sqlParameter2.Value = (object) value.Message;
        paramColl[1] = sqlParameter2;
        SqlParameter sqlParameter3 = new SqlParameter();
        sqlParameter3.ParameterName = "@SMSTemplateId";
        sqlParameter3.SqlDbType = SqlDbType.NVarChar;
        sqlParameter3.Value = (object) value.SMSTemplateId;
        paramColl[2] = sqlParameter3;
        SqlParameter sqlParameter4 = new SqlParameter();
        sqlParameter4.ParameterName = "@Language";
        sqlParameter4.SqlDbType = SqlDbType.Int;
        sqlParameter4.Value = (object) value.Language;
        paramColl[3] = sqlParameter4;
        DB.ExecuteStoredProc("sp_SaveSMSTemplate", paramColl);
        return this.Json((object) new
        {
          Message = "Added Successfuly"
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult SMSAddUpdateGroup(TIS.Models.EmailSms.Employees value)
    {
      try
      {
        string str = string.Join<long>(",", (IEnumerable<long>) value.SUB_NOs);
        SqlParameter[] paramColl = new SqlParameter[4];
        SqlParameter sqlParameter1 = new SqlParameter();
        sqlParameter1.ParameterName = "@SUB_NOs";
        sqlParameter1.SqlDbType = SqlDbType.NVarChar;
        sqlParameter1.Value = (object) str;
        paramColl[0] = sqlParameter1;
        SqlParameter sqlParameter2 = new SqlParameter();
        sqlParameter2.ParameterName = "@GroupName";
        sqlParameter2.SqlDbType = SqlDbType.NVarChar;
        sqlParameter2.Value = (object) value.GroupName;
        paramColl[1] = sqlParameter2;
        SqlParameter sqlParameter3 = new SqlParameter();
        sqlParameter3.ParameterName = "@GroupID";
        sqlParameter3.SqlDbType = SqlDbType.Int;
        sqlParameter3.Value = (object) value.GroupID;
        paramColl[2] = sqlParameter3;
        SqlParameter sqlParameter4 = new SqlParameter();
        sqlParameter4.ParameterName = "@IsUpdated";
        sqlParameter4.SqlDbType = SqlDbType.Int;
        sqlParameter4.Value = (object) value.IsUpdated;
        paramColl[3] = sqlParameter4;
        DB.ExecuteStoredProc("sp_SMSAddUpdateGroup", paramColl);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Fail" }, JsonRequestBehavior.AllowGet);
      }
      return this.Json((object) new{ Message = "Success" }, JsonRequestBehavior.AllowGet);
    }

    public JsonResult GetSMSGroupDetails(TIS.Models.EmailSms.SMSGroup value)
    {
      try
      {
        SqlParameter[] paramColl = new SqlParameter[1];
        SqlParameter sqlParameter = new SqlParameter();
        sqlParameter.ParameterName = "@GroupID";
        sqlParameter.SqlDbType = SqlDbType.NVarChar;
        sqlParameter.Value = (object) value.GroupID;
        paramColl[0] = sqlParameter;
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetSMSGroupDetails", paramColl);
        List<TIS.Models.EmailSms.Employees> employeesList = new List<TIS.Models.EmailSms.Employees>();
        DataTable table = dataSet.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
            employeesList.Add(new TIS.Models.EmailSms.Employees()
            {
              SUB_NO = Convert.ToString(row["Mobile"].ToString())
            });
        }
        return this.Json((object) new
        {
          dtSUB_NOs = employeesList
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult DeleteSMSGroup(TIS.Models.EmailSms.EmailGroup value)
    {
      try
      {
        SqlParameter[] paramColl = new SqlParameter[1];
        SqlParameter sqlParameter = new SqlParameter();
        sqlParameter.ParameterName = "@GroupID";
        sqlParameter.SqlDbType = SqlDbType.Int;
        sqlParameter.Value = (object) value.GroupID;
        paramColl[0] = sqlParameter;
        DB.ExecuteStoredProc("sp_DeleteSMSGroup", paramColl);
        return this.Json((object) new
        {
          Message = "Deleted Successfuly"
        }, JsonRequestBehavior.AllowGet);
      }
      catch (Exception ex)
      {
        return this.Json((object) new{ Message = "Error" }, JsonRequestBehavior.AllowGet);
      }
    }

    public JsonResult GetLogEmails()
    {
      try
      {
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetLogEmails");
        List<TIS.Models.SendEmail> sendEmailList = new List<TIS.Models.SendEmail>();
        DataTable table = dataSet.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
            sendEmailList.Add(new TIS.Models.SendEmail()
            {
              Id = Convert.ToInt32(row["Id"].ToString()),
              TemplateId = Convert.ToInt32(row["TemplateId"].ToString()),
              TemplateName = row["TemplateName"].ToString(),
              Subject = row["Subject"].ToString(),
              EmailText = row["Body"].ToString(),
              EmailFrom = row["EmailFrom"].ToString(),
              EmailTo = row["EmailTo"].ToString(),
              IsSent = (int) Convert.ToInt16(row["IsSent"].ToString()),
              senton = row["SentOn"].ToString()
            });
        }
        JsonResult logEmails = this.Json((object) new
        {
          dtSendEmail = sendEmailList
        }, JsonRequestBehavior.AllowGet);
        logEmails.MaxJsonLength = new int?(int.MaxValue);
        return logEmails;
      }
      catch (Exception ex)
      {
        return this.Json((object) "'Fail':'true'");
      }
    }

    public JsonResult Send(TIS.Models.SendEmail value)
    {
      string str1 = "";
      for (int index = 0; index < value.EmailID.Length; ++index)
      {
        SqlParameter[] paramColl1 = new SqlParameter[1];
        SqlParameter sqlParameter1 = new SqlParameter();
        sqlParameter1.ParameterName = "@ID";
        sqlParameter1.SqlDbType = SqlDbType.Int;
        sqlParameter1.Value = (object) value.EmailID[index];
        paramColl1[0] = sqlParameter1;
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetGroupEmail", paramColl1);
        string host = dataSet.Tables[1].Rows[0]["smtpsettings"].ToString();
        if (dataSet != null && dataSet.Tables[0].Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) dataSet.Tables[0].Rows)
          {
            try
            {
              MailMessage message = new MailMessage();
              message.To.Add(row["EmailTo"].ToString());
              message.From = new MailAddress(row["EmailFrom"].ToString());
              message.Sender = new MailAddress(row["EmailFrom"].ToString());
              message.Subject = row["Subject"].ToString();
              string str2 = row["Body"].ToString();
              message.Body = str2;
              message.IsBodyHtml = true;
              new SmtpClient(host)
              {
                UseDefaultCredentials = true
              }.Send(message);
              SqlParameter[] paramColl2 = new SqlParameter[1];
              SqlParameter sqlParameter2 = new SqlParameter();
              sqlParameter2.ParameterName = "@ID";
              sqlParameter2.SqlDbType = SqlDbType.Int;
              sqlParameter2.Value = (object) row["ID"].ToString();
              paramColl2[0] = sqlParameter2;
              DB.ExecuteStoredProcDataSet("sp_GroupEmailMarkAsSent", paramColl2);
            }
            catch (Exception ex)
            {
              str1 = string.Empty;
              string str3 = Convert.ToString((object) ex);
              DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (4, 'Send Email', 'Fail','" + this.Session["EmpUID"] + "')");
              DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (4, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str3 + "' ,'Issue Send Single Email')");
            }
          }
        }
      }
      return this.Json((object) new
      {
        Message = "Email Sent"
      }, JsonRequestBehavior.AllowGet);
    }

    public JsonResult DeleteEmail(TIS.Models.SendEmail value)
    {
      for (int index = 0; index < value.EmailID.Length; ++index)
      {
        try
        {
          SqlParameter[] paramColl = new SqlParameter[1];
          SqlParameter sqlParameter = new SqlParameter();
          sqlParameter.ParameterName = "@Id";
          sqlParameter.SqlDbType = SqlDbType.Int;
          sqlParameter.Value = (object) value.EmailID[index];
          paramColl[0] = sqlParameter;
          DB.ExecuteStoredProcDataSet("sp_DeleteLogEmail", paramColl);
        }
        catch (Exception ex)
        {
          string empty = string.Empty;
          Convert.ToString((object) ex);
          return this.Json((object) new{ Message = "Fail" }, JsonRequestBehavior.AllowGet);
        }
      }
      return this.Json((object) new{ Message = "Deleted" }, JsonRequestBehavior.AllowGet);
    }

    public JsonResult GetLogSMS()
    {
      try
      {
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetLogSMS");
        List<SMSTemplate> smsTemplateList = new List<SMSTemplate>();
        DataTable table = dataSet.Tables[0];
        if (table.Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) table.Rows)
            smsTemplateList.Add(new SMSTemplate()
            {
              ID = Convert.ToInt32(row["ID"].ToString()),
              SMSTemplateId = Convert.ToInt32(row["SMSTemplateID"].ToString()),
              SMSTemplateName = row["SMSTemplateName"].ToString(),
              SMSTo = row["SMSTo"].ToString(),
              Message = row["Message"].ToString()
            });
        }
        string str = dataSet.Tables[1].Rows[0][0].ToString();
        JsonResult logSms = this.Json((object) new
        {
          dtSendSMS = smsTemplateList,
          SMSBalance = str
        }, JsonRequestBehavior.AllowGet);
        logSms.MaxJsonLength = new int?(int.MaxValue);
        return logSms;
      }
      catch (Exception ex)
      {
        return this.Json((object) "'Fail':'true'");
      }
    }

    public JsonResult SendSMS2(SMSTemplate value)
    {
      string appSetting1 = WebConfigurationManager.AppSettings["SMSSenderUserName"];
      string appSetting2 = WebConfigurationManager.AppSettings["SMSSenderPassword"];
      string appSetting3 = WebConfigurationManager.AppSettings["SMSSenderID"];
      string str1 = "";
      for (int index = 0; index < value.SMSID.Length; ++index)
      {
        SqlParameter[] paramColl1 = new SqlParameter[1];
        SqlParameter sqlParameter1 = new SqlParameter();
        sqlParameter1.ParameterName = "@ID";
        sqlParameter1.SqlDbType = SqlDbType.Int;
        sqlParameter1.Value = (object) value.SMSID[index];
        paramColl1[0] = sqlParameter1;
        DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetGroupSMS", paramColl1);
        string str2 = dataSet.Tables[0].Rows[0]["Language"].ToString();
        if (str2 == null || str2 == "")
          str2 = "1";
        dataSet.Tables[1].Rows[0]["smtpsettings"].ToString();
        if (dataSet != null && dataSet.Tables[0].Rows.Count > 0)
        {
          foreach (DataRow row in (InternalDataCollectionBase) dataSet.Tables[0].Rows)
          {
            try
            {
              string str3 = row["ID"].ToString();
              string str4 = row["SMSTo"].ToString();
              string str5 = row["Message"].ToString();
              string str6 = new WebClient().DownloadString("http://www.brazilboxtech.com/api/send.aspx?username=" + appSetting1 + "&password=" + appSetting2 + "&language=" + str2 + "&sender=" + appSetting3 + "&mobile=965" + str4 + "&message= " + str5 ?? "");
              int num = 0;
              if (str6.Contains("OK"))
                num = 1;
              SqlParameter[] paramColl2 = new SqlParameter[4];
              SqlParameter sqlParameter2 = new SqlParameter();
              sqlParameter2.ParameterName = "@ID";
              sqlParameter2.SqlDbType = SqlDbType.Int;
              sqlParameter2.Value = (object) str3;
              paramColl2[0] = sqlParameter2;
              SqlParameter sqlParameter3 = new SqlParameter();
              sqlParameter3.ParameterName = "@IsSent";
              sqlParameter3.SqlDbType = SqlDbType.Int;
              sqlParameter3.Value = (object) num;
              paramColl2[1] = sqlParameter3;
              SqlParameter sqlParameter4 = new SqlParameter();
              sqlParameter4.ParameterName = "@Language";
              sqlParameter4.SqlDbType = SqlDbType.Int;
              sqlParameter4.Value = (object) str2;
              paramColl2[2] = sqlParameter4;
              SqlParameter sqlParameter5 = new SqlParameter();
              sqlParameter5.ParameterName = "@Message";
              sqlParameter5.SqlDbType = SqlDbType.NVarChar;
              sqlParameter5.Value = (object) str5;
              paramColl2[3] = sqlParameter5;
              DB.ExecuteStoredProc("sp_SMSLogMarkAsSent", paramColl2);
            }
            catch (Exception ex)
            {
              str1 = string.Empty;
              string str7 = Convert.ToString((object) ex);
              DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (4, 'Send Email', 'Fail','" + this.Session["EmpUID"] + "')");
              DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (4, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str7 + "' ,'Issue Send Single Email')");
            }
          }
        }
      }
      return this.Json((object) new{ Message = "Success" }, JsonRequestBehavior.AllowGet);
    }

    public JsonResult DeleteSMS(SMSTemplate value)
    {
      for (int index = 0; index < value.SMSID.Length; ++index)
      {
        try
        {
          SqlParameter[] paramColl = new SqlParameter[1];
          SqlParameter sqlParameter = new SqlParameter();
          sqlParameter.ParameterName = "@ID";
          sqlParameter.SqlDbType = SqlDbType.Int;
          sqlParameter.Value = (object) value.SMSID[index];
          paramColl[0] = sqlParameter;
          DB.ExecuteStoredProcDataSet("sp_DeleteLogSMS", paramColl);
        }
        catch (Exception ex)
        {
          string empty = string.Empty;
          Convert.ToString((object) ex);
          return this.Json((object) new{ Message = "Fail" }, JsonRequestBehavior.AllowGet);
        }
      }
      return this.Json((object) new{ Message = "Deleted" }, JsonRequestBehavior.AllowGet);
    }

    public JsonResult DeleteEmailTemplate(TIS.Models.SendEmail value)
    {
      try
      {
        SqlParameter[] paramColl = new SqlParameter[1];
        SqlParameter sqlParameter = new SqlParameter();
        sqlParameter.ParameterName = "@ID";
        sqlParameter.SqlDbType = SqlDbType.Int;
        sqlParameter.Value = (object) value.TemplateId;
        paramColl[0] = sqlParameter;
        DB.ExecuteStoredProcDataSet("sp_DeleteEmailTemplate", paramColl);
      }
      catch (Exception ex)
      {
        string empty = string.Empty;
        Convert.ToString((object) ex);
        return this.Json((object) new{ Message = "Fail" }, JsonRequestBehavior.AllowGet);
      }
      return this.Json((object) new{ Message = "Deleted" }, JsonRequestBehavior.AllowGet);
    }

    public JsonResult DeleteSMSTemplate(TIS.Models.SendEmail value)
    {
      try
      {
        SqlParameter[] paramColl = new SqlParameter[1];
        SqlParameter sqlParameter = new SqlParameter();
        sqlParameter.ParameterName = "@ID";
        sqlParameter.SqlDbType = SqlDbType.Int;
        sqlParameter.Value = (object) value.TemplateId;
        paramColl[0] = sqlParameter;
        DB.ExecuteStoredProcDataSet("sp_DeleteSMSTemplate", paramColl);
      }
      catch (Exception ex)
      {
        string empty = string.Empty;
        Convert.ToString((object) ex);
        return this.Json((object) new{ Message = "Fail" }, JsonRequestBehavior.AllowGet);
      }
      return this.Json((object) new{ Message = "Deleted" }, JsonRequestBehavior.AllowGet);
    }
  }
}
