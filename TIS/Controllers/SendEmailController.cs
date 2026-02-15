// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.SendEmailController
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Net.Mail;
using System.Web.Mvc;
using TIS.Helper;

namespace TIS.Controllers
{
    public class SendEmailController : Controller
    {
        public ActionResult Index() => (ActionResult)this.View();

        public ActionResult SendEmail() => (ActionResult)this.View();

        public JsonResult GetEmail()
        {
            try
            {
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetSendEmail");
                List<TIS.Models.SendEmail> sendEmailList = new List<TIS.Models.SendEmail>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        sendEmailList.Add(new TIS.Models.SendEmail()
                        {
                            Id = Convert.ToInt32(row["Id"].ToString()),
                            TemplateId = Convert.ToInt32(row["TemplateId"].ToString()),
                            Bill_Id = Convert.ToInt32(row["Bill_Id"].ToString()),
                            Subject = row["Subject"].ToString(),
                            EmailText = row["EmailText"].ToString(),
                            EmailFrom = row["EmailFrom"].ToString(),
                            EmailTo = row["EmailTo"].ToString(),
                            CC = row["CC"].ToString(),
                            sent = Convert.ToBoolean(row["sent"].ToString()),
                            senton = row["senton"].ToString()
                        });
                }
                JsonResult email = this.Json((object)new
                {
                    dtSendEmail = sendEmailList
                }, JsonRequestBehavior.AllowGet);
                email.MaxJsonLength = new int?(int.MaxValue);
                return email;
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public void SetReminder()
        {
            DB.ExecuteStoredProcDataSet("sp_BillIdentification_Reminder");
            this.GetEmail();
        }

        public void SetForceBillReminder()
        {
            DB.ExecuteStoredProcDataSet("sp_ForceBill_Reminder");
            this.GetEmail();
        }

        public JsonResult Send(TIS.Models.SendEmail value)
        {
            for (int index = 0; index < value.BID.Length; ++index)
            {
                SqlParameter[] paramColl1 = new SqlParameter[1];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@bid";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)value.BID[index];
                paramColl1[0] = sqlParameter1;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetEmail", paramColl1);
                string host = dataSet.Tables[2].Rows[0]["smtpsettings"].ToString();
                if (dataSet != null && dataSet.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)dataSet.Tables[0].Rows)
                    {
                        try
                        {
                            MailMessage message = new MailMessage();
                            if (row["CC"].ToString() == "" || row["CC"].ToString() == null)
                            {
                                message.To.Add(row["EmailTo"].ToString());
                            }
                            else
                            {
                                message.To.Add(row["EmailTo"].ToString());
                                message.CC.Add(row["CC"].ToString());
                            }
                            message.From = new MailAddress(row["EmailFrom"].ToString());
                            message.Sender = new MailAddress(row["EmailFrom"].ToString());
                            message.Subject = row["Subject"].ToString();
                            string str = row["EmailText"].ToString();
                            message.Body = str;
                            message.IsBodyHtml = true;
                            new SmtpClient(host)
                            {
                                UseDefaultCredentials = true
                            }.Send(message);
                            SqlParameter[] paramColl2 = new SqlParameter[1];
                            SqlParameter sqlParameter2 = new SqlParameter();
                            sqlParameter2.ParameterName = "@id";
                            sqlParameter2.SqlDbType = SqlDbType.Int;
                            sqlParameter2.Value = (object)row["Id"].ToString();
                            paramColl2[0] = sqlParameter2;
                            DB.ExecuteStoredProcDataSet("sp_MarkAsSent", paramColl2);
                        }
                        catch (Exception ex)
                        {
                            string empty = string.Empty;
                            string str = Convert.ToString((object)ex);
                            DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (4, 'Send Email', 'Fail','" + this.Session["EmpUID"] + "')");
                            DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (4, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str + "' ,'Issue Send Single Email')");
                            return this.Json((object)new
                            {
                                Message = "Fail"
                            }, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
            }
            return this.Json((object)new
            {
                Message = "Email Sent"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Save(TIS.Models.SendEmail value)
        {
            SqlParameter[] sqlParameterArray = new SqlParameter[4];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@Bill_Id";
            sqlParameter1.SqlDbType = SqlDbType.Int;
            sqlParameter1.Value = (object)value.Bill_Id;
            sqlParameterArray[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@EmailText";
            sqlParameter2.SqlDbType = SqlDbType.NVarChar;
            sqlParameter2.Value = (object)value.EmailText;
            sqlParameterArray[1] = sqlParameter2;
            SqlParameter sqlParameter3 = new SqlParameter();
            sqlParameter3.ParameterName = "@EmailTo";
            sqlParameter3.SqlDbType = SqlDbType.NVarChar;
            sqlParameter3.Value = (object)value.EmailTo;
            sqlParameterArray[2] = sqlParameter3;
            SqlParameter sqlParameter4 = new SqlParameter();
            sqlParameter4.ParameterName = "@CC";
            sqlParameter4.SqlDbType = SqlDbType.NVarChar;
            sqlParameter4.Value = (object)value.CC;
            sqlParameterArray[3] = sqlParameter4;
            SqlParameter[] paramColl = sqlParameterArray;
            try
            {
                DB.ExecuteStoredProcDataSet("sp_Save", paramColl);
                return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
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
                    sqlParameter.Value = (object)value.EmailID[index];
                    paramColl[0] = sqlParameter;
                    DB.ExecuteStoredProcDataSet("sp_DeleteEmail", paramColl);
                }
                catch (Exception ex)
                {
                    string empty = string.Empty;
                    Convert.ToString((object)ex);
                    return this.Json((object)new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
                }
            }
            return this.Json((object)new { Message = "Deleted" }, JsonRequestBehavior.AllowGet);
        }


        public void SetForceBillReminderNew()
        {
            DB.ExecuteStoredProcDataSet("sp_SetForceBill_ReminderNew");
            GetAndSendPendingEmail();
        }

        public void SetBillReminderNew()
        {
            DB.ExecuteStoredProcDataSet("sp_SetBill_ReminderNew");
            GetAndSendPendingEmail();
        }

        public void SetBillApprovalReminderNew()
        {
            DB.ExecuteStoredProcDataSet("SP_BillApprovalReminder_New");
            GetAndSendPendingEmail();
        }

        public JsonResult GetAndSendPendingEmail()
        {
            try
            {
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetPendingEmail");
                var SMTP = ds.Tables[2].Rows[0]["smtpsettings"].ToString();
                if (ds != null && ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        try
                        {
                            MailMessage mail = new MailMessage();
                            if (dr["CC"].ToString() == "" || dr["CC"].ToString() == null)
                            {
                                mail.To.Add(dr["EmailTo"].ToString());
                            }
                            else
                            {
                                mail.To.Add(dr["EmailTo"].ToString());
                                mail.CC.Add(dr["CC"].ToString());
                            }
                            mail.From = new MailAddress(dr["EmailFrom"].ToString());
                            mail.Sender = new MailAddress(dr["EmailFrom"].ToString());
                            mail.Subject = dr["Subject"].ToString();
                            string Body = dr["EmailText"].ToString();
                            mail.Body = Body;
                            mail.IsBodyHtml = true;
                            string smtpsettings = SMTP;
                            SmtpClient smtp = new SmtpClient(smtpsettings);
                            //smtp.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;	
                            //smtp.Host = "equate.com";	
                            //smtp.Port = 587;	
                            smtp.UseDefaultCredentials = true;
                            //smtp.Credentials = new System.Net.NetworkCredential	
                            //("username", "password");// Enter seders User name and password	
                            //smtp.EnableSsl = true;	
                            smtp.Send(mail);
                            //}	
                            SqlParameter[] spa ={
                                     new SqlParameter(){
                                       ParameterName="@id",
                                       SqlDbType=SqlDbType.Int,
                                       Value=dr["Id"].ToString() }
                               };
                            DataSet dss = DB.ExecuteStoredProcDataSet("sp_MarkAsSent", spa);
                        }
                        catch (Exception ex)
                        {
                            string message = string.Empty;
                            message = Convert.ToString(ex);
                            DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (4, 'Send Email', 'Fail','" + Session["EmpUID"] + "')");
                            DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (4, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + message + "' ,'Issue Send Single Email')");
                            return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
                return Json(new { Message = "Email Sent" }, JsonRequestBehavior.AllowGet);
                //var JsonResult = Json(new { dtSendEmail = SendEmail }, JsonRequestBehavior.AllowGet);	
                //JsonResult.MaxJsonLength = int.MaxValue;	
                //return JsonResult;	
            }
            catch (Exception ex)
            {
                return Json("'Fail':'true'");
            }
        }
    }
}
