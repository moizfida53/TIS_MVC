// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.UserController
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Security.Principal;
using System.Text.RegularExpressions;
using System.Web.Mvc;
using TIS.Helper;
using TIS.Models;
using Newtonsoft.Json;
using System.Diagnostics;

namespace TIS.Controllers
{
    public class UserController : Controller
    {
        private string loginName;

        public UserController(string loginName1) => this.loginName = loginName1;

        public UserController()
        {
            string appSetting = ConfigurationManager.AppSettings[nameof(loginName)];
            if (appSetting.Trim() != "")
            {
                this.loginName = appSetting;
            }
            else
            {
                string[] strArray = WindowsIdentity.GetCurrent().Name.Split('\\');
                if (strArray.Length == 0)
                    return;
                this.loginName = strArray[strArray.Length - 1];
            }
        }

        public ActionResult NewPage() => (ActionResult)this.View();

        public ActionResult Index(int SelectedTabIndex =1)
        {
            ViewBag.selectedTabId = SelectedTabIndex;
            Users objdata=BindDefaultData();
            if(objdata!=null)
            {
                ViewBag.UID = objdata.uid;
                ViewBag.AdminRoleId = objdata.AdminRoleId;
                ViewBag.Roleid = objdata.Roleid;
                ViewBag.action = objdata.Action;
                ViewBag.name = objdata.name;
                //return (ActionResult)this.View(nameof(Index), (object)objdata);
                return (ActionResult)this.View();
            }
            else
            {
                return (ActionResult)this.View("AccessDenied");
            }
        }
        public Users BindDefaultData()
        {
            SqlParameter[] paramColl = new SqlParameter[1];
            SqlParameter sqlParameter = new SqlParameter();
            sqlParameter.ParameterName = "@userName";
            sqlParameter.SqlDbType = SqlDbType.VarChar;
            sqlParameter.Value = (object)this.loginName;
            paramColl[0] = sqlParameter;
            DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetSettings", paramColl);
            Settings settings = new Settings();
            if (dataSet != null && dataSet.Tables.Count > 1)
            {
                if (dataSet.Tables[1].Rows.Count <= 0)
                {
                    return null;
                }
                    //return (ActionResult)this.View("AccessDenied");
                if (Convert.ToInt32(dataSet.Tables[1].Rows[0]["UID"].ToString()) > 0)
                {
                    Users model = new Users();
                    model.IsShowHomePage = false;
                    try
                    {
                        if (dataSet.Tables[0].Rows[0]["IsShowHomePage"].ToString() == "True")
                        {
                            model.IsShowHomePage = true;
                        }
                    }
                    catch { }
                   

                    model.uid = dataSet.Tables[1].Rows[0]["UID"].ToString();
                    model.name = dataSet.Tables[1].Rows[0]["NAME"].ToString();
                    model.managerId = dataSet.Tables[1].Rows[0]["MANAGERID"].ToString();
                    if (dataSet.Tables[2].Rows.Count > 0)
                    {
                        model.managerName = dataSet.Tables[2].Rows[0]["NAME"].ToString();
                        model.managerEmail = dataSet.Tables[2].Rows[0]["EMAIL"].ToString();
                    }
                    if (dataSet.Tables[3].Rows.Count > 0)
                    {
                        model.Roleid = dataSet.Tables[3].Rows[0]["Role_ID"].ToString();
                        model.Username = dataSet.Tables[3].Rows[0]["Username"].ToString();
                        model.CountryID = Convert.ToInt32(dataSet.Tables[3].Rows[0]["COUNTRYID"].ToString());
                        model.CompanyID = Convert.ToInt32(dataSet.Tables[3].Rows[0]["CompanyID"].ToString());
                    }
                    string username = model.Username;
                    string name = model.name;
                    string roleid = model.Roleid;
                    string uid = model.uid;
                    int countryId = model.CountryID;
                    int? CompanyID = model.CompanyID;
                    ViewBag.RoleId= model.Roleid;

                    this.Session["EmpLoginName"] = (object)username;
                    this.Session["EmpLoginAs"] = (object)username;
                    this.Session["EmpDisplayName"] = (object)name;
                    this.Session["EmpRoleID"] = (object)roleid;
                    this.Session["EmpUsername"] = (object)username;
                    this.Session["EmpUID"] = (object)uid;
                    this.Session["CountryID"] = (object)countryId;
                    this.Session["EmpRoleID"].ToString();
                    this.Session["CompanyID"] = (object)CompanyID;
                    string pattern = "Approve";
                    string input = this.Request.Url.ToString();
                    if (Regex.IsMatch(input, pattern))
                        model.Action = input.Substring(input.IndexOf("=") + 1);
                    //return (ActionResult)this.View(nameof(Index), (object)model);
                    return model;
                }
            }
            return null;
        }
        public ActionResult Landing()
        {
            Users objdata = BindDefaultData();
            if (objdata != null)
            {
                ViewBag.UID = objdata.uid;
                ViewBag.AdminRoleId = objdata.AdminRoleId;
                ViewBag.Roleid = objdata.Roleid;
                ViewBag.action = objdata.Action;
                ViewBag.name = objdata.name;
                //return (ActionResult)this.View(nameof(Index), (object)objdata);
                //return (ActionResult)this.View();

                if (objdata.IsShowHomePage ==true)
                {
                    return (ActionResult)this.View(nameof(Landing), (object)objdata);
                }
                else
                {
                    return (ActionResult)this.View(nameof(Index), (object)objdata);
                }
            }
            else
            {
                return (ActionResult)this.View("AccessDenied");
            }
            //return (ActionResult)this.View();
        }
        //[HttpPost]
        public ActionResult RedirectOnListView(int tabindex)
        {
            return RedirectToAction("Index", new
            {
                SelectedTabIndex = tabindex
            });
        }
        public JsonResult GetLandingPageData(string uid)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@Uid";
                sqlParameter.SqlDbType = SqlDbType.Int;
                sqlParameter.Value = (object)uid;
                paramColl[0] = sqlParameter;
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetLandingPageData", paramColl);
                if (ds != null && ds.Tables.Count > 0)
                {
                    DataTable dtData = ds.Tables[0];
                    if (dtData.Rows.Count > 0)
                    {
                        
                            return Json(new
                            {
                                Message = "Success",
                                Data = JsonConvert.SerializeObject(dtData),
                            }, JsonRequestBehavior.AllowGet);
                    }

                }
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json(new
                {
                    Message = "Fail",
                    Data = ""
                }, JsonRequestBehavior.AllowGet); ;
            }
        }
        public JsonResult Login(TIS.Models.Login Login)
        {
            this.Session["EmpLoginName"] = (object)null;
            SqlParameter[] paramColl = new SqlParameter[1];
            SqlParameter sqlParameter = new SqlParameter();
            sqlParameter.ParameterName = "@username";
            sqlParameter.SqlDbType = SqlDbType.VarChar;
            sqlParameter.Value = (object)Login.Username;
            paramColl[0] = sqlParameter;
            DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_Login", paramColl);
            if (dataSet.Tables[0].Rows.Count > 0)
            {
                string str1 = dataSet.Tables[0].Rows[0][0].ToString();
                string str2 = dataSet.Tables[0].Rows[0][1].ToString();
                string str3 = dataSet.Tables[0].Rows[0][2].ToString();
                this.Session["EmpLoginName"] = (object)str1;
                this.Session["EmpLoginAs"] = (object)str1;
                this.Session["EmpDisplayName"] = (object)str2;
                this.Session["EmpRoleID"] = (object)str3;
                this.Session["EmpUsername"] = (object)str1;
            }
            return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetSession(string Username)
        {
            this.Session["EmpLoginAs"] = (object)Username;
            return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Analyse()
        {
            object sessionValue = this.Session["EmpLoginAs"];
            if (sessionValue == null || string.IsNullOrWhiteSpace(sessionValue.ToString()))
            {
                return (ActionResult)this.View("AccessDenied");
            }
           
            SqlParameter[] paramColl = new SqlParameter[2];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@userName";
            sqlParameter1.SqlDbType = SqlDbType.VarChar;
            sqlParameter1.Value = (object)sessionValue.ToString();
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@UserUid";
            sqlParameter2.SqlDbType = SqlDbType.Int;
            sqlParameter2.Value = this.Session["EmpUID"];
            paramColl[1] = sqlParameter2;
            DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetSettings", paramColl);
            Settings settings = new Settings();
            if (dataSet != null && dataSet.Tables.Count > 1)
            {
                if (dataSet.Tables[1].Rows.Count <= 0)
                    return (ActionResult)this.View("AccessDenied");
                if (Convert.ToInt32(dataSet.Tables[1].Rows[0]["UID"].ToString()) > 0)
                {
                    Users model = new Users();
                    model.uid = dataSet.Tables[1].Rows[0]["UID"].ToString();
                    model.name = dataSet.Tables[1].Rows[0]["NAME"].ToString();
                    model.managerId = dataSet.Tables[1].Rows[0]["MANAGERID"].ToString();
                    if (dataSet.Tables[2].Rows.Count > 0)
                    {
                        model.managerName = dataSet.Tables[2].Rows[0]["NAME"].ToString();
                        model.managerEmail = dataSet.Tables[2].Rows[0]["EMAIL"].ToString();
                    }
                    if (dataSet.Tables[3].Rows.Count > 0)
                        model.Roleid = dataSet.Tables[3].Rows[0]["Role_ID"].ToString();
                    string name = model.name;
                    string roleid = model.Roleid;
                    if (this.Session["EmpRoleID"] == null)
                        return (ActionResult)this.View("AccessDenied");
                    string str2 = this.Session["EmpRoleID"].ToString();
                    model.AdminRoleId = str2;

                    ViewBag.UID = model.uid;
                    ViewBag.AdminRoleId = model.AdminRoleId;
                    ViewBag.Roleid = model.Roleid;
                    ViewBag.action = 1;
                    ViewBag.name = model.name;
                    return (ActionResult)this.View("Index");
                }
            }
            return (ActionResult)this.View();
        }

        public ActionResult HomePage()
        {
            object sessionValue = this.Session["EmpLoginAs"];
            if (sessionValue == null || string.IsNullOrWhiteSpace(sessionValue.ToString()))
            {
                return (ActionResult)this.View("AccessDenied");
            }
            SqlParameter[] paramColl = new SqlParameter[2];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@userName";
            sqlParameter1.SqlDbType = SqlDbType.VarChar;
            sqlParameter1.Value = (object)sessionValue.ToString();
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@UserUid";
            sqlParameter2.SqlDbType = SqlDbType.Int;
            sqlParameter2.Value = this.Session["EmpUID"];
            paramColl[1] = sqlParameter2;
            DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetSettings", paramColl);
            Settings settings = new Settings();
            if (dataSet != null && dataSet.Tables.Count > 1)
            {
                if (dataSet.Tables[1].Rows.Count <= 0)
                    return (ActionResult)this.View("AccessDenied");
                if (Convert.ToInt32(dataSet.Tables[1].Rows[0]["UID"].ToString()) > 0)
                {
                    Users model = new Users();
                    model.uid = dataSet.Tables[1].Rows[0]["UID"].ToString();
                    model.name = dataSet.Tables[1].Rows[0]["NAME"].ToString();
                    model.managerId = dataSet.Tables[1].Rows[0]["MANAGERID"].ToString();
                    if (dataSet.Tables[2].Rows.Count > 0)
                    {
                        model.managerName = dataSet.Tables[2].Rows[0]["NAME"].ToString();
                        model.managerEmail = dataSet.Tables[2].Rows[0]["EMAIL"].ToString();
                    }
                    if (dataSet.Tables[3].Rows.Count > 0)
                        model.Roleid = dataSet.Tables[3].Rows[0]["Role_ID"].ToString();
                    string name = model.name;
                    string roleid = model.Roleid;
                    if (this.Session["EmpRoleID"] == null)
                        return (ActionResult)this.View("AccessDenied");
                    string str2 = this.Session["EmpRoleID"].ToString();
                    model.AdminRoleId = str2;
                    return (ActionResult)this.View("Index", (object)model);
                }
            }
            return (ActionResult)this.View();
        }
    }
}
