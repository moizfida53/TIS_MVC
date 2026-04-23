// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.SettingController
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Mvc;
using TIS.Filters;
using TIS.Helper;
using TIS.Models;

namespace TIS.Controllers
{
    [RoleAuthorize(Roles.SuperAdmin)]
    public class SettingController : Controller
    {
        public ActionResult Index() => this.Session["EmpLoginName"] == null ? (ActionResult)this.View("AccessDenied") : (ActionResult)this.View("Config");

        public ActionResult Policy() => this.Session["EmpLoginName"] == null ? (ActionResult)this.View("AccessDenied") : (ActionResult)this.View("ManageCallType");

        public ActionResult Provider() => this.Session["EmpLoginName"] == null ? (ActionResult)this.View("AccessDenied") : (ActionResult)this.View(nameof(Provider));

        public JsonResult FillTransType(TIS.Models.Policy ct)
        {
            DataTable dataTable = new DataTable();
            DataSet data = DB.GetData("select distinct TRANS_TYPE from tblCallRecord where Provider_Type=" + (object)ct.ProviderID + " order by Trans_Type");
            if (data != null)
                dataTable = data.Tables[0];
            List<TIS.Models.Policy> policyList = new List<TIS.Models.Policy>();
            foreach (DataRow row in (InternalDataCollectionBase)dataTable.Rows)
                policyList.Add(new TIS.Models.Policy()
                {
                    TransType = row["TRANS_TYPE"].ToString()
                });
            return this.Json((object)new
            {
                dtTransType = policyList
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FillDesc(TIS.Models.Policy ct)
        {
            DataTable dataTable = new DataTable();
            DataSet data = DB.GetData("SELECT DISTINCT [DESCRIPTION] FROM TBLCALLRECORD WHERE [TRANS_TYPE]='" + ct.TransType + "' AND PROVIDER_TYPE='" + (object)ct.ProviderID + "' order by [Description]");
            if (data != null)
                dataTable = data.Tables[0];
            List<TIS.Models.Policy> policyList = new List<TIS.Models.Policy>();
            foreach (DataRow row in (InternalDataCollectionBase)dataTable.Rows)
                policyList.Add(new TIS.Models.Policy()
                {
                    Description = row["DESCRIPTION"].ToString()
                });
            JsonResult jsonResult = this.Json((object)new
            {
                dtdesc = policyList
            }, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = new int?(int.MaxValue);
            return jsonResult;
        }

        public JsonResult GetCallType()
        {
            try
            {
                DataSet data = DB.GetData("select * from tblCallType where ID<>0");
                List<CallType> callTypeList = new List<CallType>();
                DataTable table = data.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        callTypeList.Add(new CallType()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            NAME = row["Name"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    CallTypeList = callTypeList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        // AJAX endpoint for Line Type dropdown
        public JsonResult GetLineTypes()
        {
            DataTable dt = new DataTable();

            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["SqlServerConnection"].ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetLineTypes", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dt);
                }
            }

            var data = dt.AsEnumerable().Select(x => new
            {
                Id = x.Field<int>("Id"),
                Name = x.Field<string>("LineType")
            }).ToList();

            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetEmployee()
        {
            try
            {
                DataSet data = DB.GetData("select UID,NAME,Subs_no_ID,SUB_NO,ORG from vwEmpCallID ORDER BY NAME,ORG");
                List<EmpSub> empSubList = new List<EmpSub>();
                DataTable table = data.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        empSubList.Add(new EmpSub()
                        {
                            UID = Convert.ToInt32(row["UID"].ToString()),
                            EmployeeName = row["NAME"].ToString(),
                            ORG = row["ORG"].ToString(),
                            SubNoID = Convert.ToInt32(row["Subs_no_ID"].ToString()),
                            SubNo = row["SUB_NO"].ToString()
                        });
                }
                return this.Json((object)new { dtEmp = empSubList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult GetPolicy()
        {
            try
            {
                DataTable dataTable = new DataTable();
                DataSet data = DB.GetData("select distinct id,Provider_type_desc,call_type,provider,providername,call_type_desc,destination_desc,IsAll,Superimpose_train,LineType,LineTypeName from vwManageCalltype where isadmin=1 order by provider,Provider_Type_Desc,Call_Type");
                List<TIS.Models.Policy> policyList = new List<TIS.Models.Policy>();
                if (data != null)
                    dataTable = data.Tables[0];
                if (dataTable.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)dataTable.Rows)
                        policyList.Add(new TIS.Models.Policy()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            ProviderID = Convert.ToInt32(row["provider"].ToString()),
                            ProviderName = row["providername"].ToString(),
                            TransType = row["Provider_type_desc"].ToString(),
                            Description = row["destination_desc"].ToString(),
                            CallTypeID = Convert.ToInt32(row["call_type"].ToString()),
                            CallType = row["call_type_desc"].ToString(),
                            LineTypeID = Convert.ToInt32(row["LineType"].ToString()),
                            LineType = row["LineTypeName"].ToString(),
                            IsAll = Convert.ToBoolean(row["IsAll"].ToString()),
                            IsSupImp = Convert.ToBoolean(row["Superimpose_train"].ToString())
                        });
                }
                return this.Json((object)new
                {
                    dtPolicy = policyList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult AddPolicy(TIS.Models.Policy Policy)
        {
            try
            {
                if (Policy.IsAllDesc)
                {
                    int num = Convert.ToInt32("0" + DB.GetValue("select ISNULL(MAX(ID), 0) from tblManageCallType")) + 1;
                    DB.ExecuteNonQuery(" insert into tblManageCalltype(id,provider,Provider_type_desc,destination_desc,call_type,IsAll,Superimpose_train,IsAdmin,LineType) values('" + (object)num + "','" + (object)Policy.ProviderID + "','" + Policy.TransType + "','','" + (object)Policy.CallTypeID + "','" + Policy.IsAll.ToString() + "','" + Policy.IsSupImp.ToString() + "','true','" + (object)Policy.LineTypeID + "')");
                    DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (18, 'Add Policy', 'Success','" + this.Session["EmpUID"] + "')");
                    if (!Policy.IsAll)
                    {
                        for (int index = 0; index < Policy.Emp.Length; ++index)
                        {
                            DB.ExecuteNonQuery("insert into tblManageCallTypeDetail(uid,sub_no_id,ManageCallTypeID)values('" + (object)Policy.Emp[index] + "', '" + (object)Policy.Num[index] + "','" + (object)num + "'");
                            DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (18, 'Add Policy', 'Success','" + this.Session["EmpUID"] + "')");
                        }
                    }
                }
                else
                {
                    for (int index1 = 0; index1 < Policy.Des.Length; ++index1)
                    {
                        int num = Convert.ToInt32("0" + DB.GetValue("select max(ID) from tblManageCallType")) + 1;
                        DB.ExecuteNonQuery(" insert into tblManageCalltype(id,provider,Provider_type_desc,destination_desc,call_type,IsAll,Superimpose_train,IsAdmin,LineType) values('" + (object)num + "','" + (object)Policy.ProviderID + "','" + Policy.TransType + "','" + Policy.Des[index1] + "','" + (object)Policy.CallTypeID + "','" + Policy.IsAll.ToString() + "','" + Policy.IsSupImp.ToString() + "','true','" + (object)Policy.LineTypeID + "')");
                        DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (18, 'Add Policy', 'Success','" + this.Session["EmpUID"] + "')");
                        if (!Policy.IsAll)
                        {
                            for (int index2 = 0; index2 < Policy.Emp.Length; ++index2)
                            {
                                DB.ExecuteNonQuery("insert into tblManageCallTypeDetail(uid,sub_no_id,ManageCallTypeID)values('" + (object)Policy.Emp[index2] + "', '" + (object)Policy.Num[index2] + "','" + (object)num + "')");
                                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (18, 'Add Policy', 'Success','" + this.Session["EmpUID"] + "')");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex).Replace("'", " ");
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (18, 'ADD POLICY', 'Fail','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (18, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str + "' ,'Add POLICY')");
                return this.Json((object)new
                {
                    Message = "Error Please Contact Your Manager"
                }, JsonRequestBehavior.AllowGet);
            }
            return this.Json((object)new
            {
                Message = "Policy Added Successfully"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdatePolicy(TIS.Models.Policy Policy)
        {
            try
            {
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (18, 'Update Policy', 'Success','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery(" Update tblManageCalltype set IsAll='" + Policy.IsAll.ToString() + "',Superimpose_train='" + Policy.IsSupImp.ToString() + "' where id= '" + (object)Policy.ID + "'");
                DB.ExecuteNonQuery(" Delete from tblManageCallTypeDetail where ManageCallTypeID= '" + (object)Policy.ID + "'");
                if (!Policy.IsAll)
                {
                    for (int index = 0; index < Policy.Emp.Length; ++index)
                    {
                        DB.ExecuteNonQuery("insert into tblManageCallTypeDetail(uid,sub_no_id,ManageCallTypeID)values('" + (object)Policy.Emp[index] + "', '" + (object)Policy.Num[index] + "','" + (object)Policy.ID + "')");
                        DB.ExecuteNonQuery("INSERT INTO TBL_AT_DETAILS ([AT_ID],[SNO],[NEW_VALUE],[OLD_VALUE],[FIELD_NAME]) values ( (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),(select FORM_ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ) ,'" + (object)Policy.Emp[index] + "' , ' ' , 'EMPLOYEE' )");
                    }
                }
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex).Replace("'", " ");
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (18, 'UPDATE POLICY', 'Fail','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (18, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str + "' ,'UPDATE POLICY')");
                return this.Json((object)new
                {
                    Message = "Error Please Contact Your Manager"
                }, JsonRequestBehavior.AllowGet);
            }
            return this.Json((object)new
            {
                Message = "Policy Updated Successfully"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ApplyPolicy()
        {
            DB.ExecuteNonQuery("update M6_CR set [CALL_TYPE]= [new_CALL_TYPE],islocked=NEW_ISLOCKED");
            return this.Json((object)new
            {
                Message = "Policy Applied Successfully"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeletePolicy(TIS.Models.Policy Policy)
        {
            SqlParameter[] paramColl = new SqlParameter[1];
            SqlParameter sqlParameter = new SqlParameter();
            sqlParameter.ParameterName = "@ID";
            sqlParameter.SqlDbType = SqlDbType.VarChar;
            sqlParameter.Value = (object)Policy.ID;
            paramColl[0] = sqlParameter;
            DB.ExecuteStoredProc("sp_DeletePolicy", paramColl);
            return this.Json((object)new
            {
                Message = "Deleted Successfully"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPolicyDetail(TIS.Models.Policy Policy)
        {
            DataTable dataTable = new DataTable();
            DataSet data = DB.GetData("select Sub_No_ID from tblManageCallTypeDetail where ManageCallTypeID=" + (object)Policy.ID ?? "");
            if (data != null)
                dataTable = data.Tables[0];
            List<TIS.Models.Policy> policyList = new List<TIS.Models.Policy>();
            foreach (DataRow row in (InternalDataCollectionBase)dataTable.Rows)
                policyList.Add(new TIS.Models.Policy()
                {
                    ID = Convert.ToInt32(row["Sub_No_ID"].ToString())
                });
            return this.Json((object)new { dtID = policyList }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetEmpList(TIS.Models.Policy Policy)
        {
            DataTable dataTable = new DataTable();
            DataSet data = DB.GetData("select NAME,EMPLOYEENO FROM TBLUSER WHERE UID IN (SELECT UID FROM TBLASSIGNNO WHERE Subs_no_ID IN (SELECT SUB_NO_ID FROM tblManageCallTypeDetail WHERE ManageCallTypeID=" + (object)Policy.ID + "))");
            if (data != null)
                dataTable = data.Tables[0];
            List<Employee> employeeList = new List<Employee>();
            foreach (DataRow row in (InternalDataCollectionBase)dataTable.Rows)
                employeeList.Add(new Employee()
                {
                    EmpName = row["NAME"].ToString(),
                    EmpNo = row["EMPLOYEENO"].ToString()
                });
            return this.Json((object)new { dtEmp = employeeList }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetConfig()
        {
            DataTable dataTable = new DataTable();
            DataSet data = DB.GetData("Select * from tblConfiguration where ID=1");
            if (data != null)
                dataTable = data.Tables[0];
            return this.Json((object)new
            {
                dtConfig = new Config()
                {
                    EmpReminder = dataTable.Rows[0]["EmpReminder"].ToString(),
                    MgrReminder = dataTable.Rows[0]["MgrComplaintReminder"].ToString(),
                    FBReminder = dataTable.Rows[0]["ForceBillReminder"].ToString(),
                    LMReminder = dataTable.Rows[0]["LMReminder"].ToString(),
                    SMTP = dataTable.Rows[0]["SMTPSettings"].ToString(),
                    AdminEmail = dataTable.Rows[0]["AdminEmail"].ToString(),
                    HostUrl = dataTable.Rows[0]["HostUrl"].ToString(),
                    SupGrade = dataTable.Rows[0]["SuperGrade"].ToString(),
                    EnableGrade = Convert.ToBoolean(dataTable.Rows[0]["EnableGrade"].ToString()),
                    DntSndEmail = Convert.ToBoolean(dataTable.Rows[0]["NotSendMail"].ToString()),
                    HidePerCalls = Convert.ToBoolean(dataTable.Rows[0]["HidePersonalCalls"].ToString()),
                    GMApp = Convert.ToBoolean(dataTable.Rows[0]["skipGMApproval"].ToString()),
                    EnableDiscrepancy = Convert.ToBoolean(dataTable.Rows[0]["EnableDiscrepancy"].ToString()),
                    SkipAppBusZero = Convert.ToBoolean(dataTable.Rows[0]["SkipApprovalBuss"].ToString()),
                    DedBusCharges = Convert.ToBoolean(dataTable.Rows[0]["DedBussinessCharges"].ToString()),
                    ZeroUnlimited = Convert.ToBoolean(dataTable.Rows[0]["BusinessZeroAsUnlimited"].ToString()),
                    AlwWav = Convert.ToBoolean(dataTable.Rows[0]["AllowWaiver"].ToString()),
                    EnableDelete = Convert.ToBoolean(dataTable.Rows[0]["DeleteBut"].ToString()),
                    AlwTrainFB = Convert.ToBoolean(dataTable.Rows[0]["AllowTrainForceBill"].ToString()),
                    HideAllowanceLimit = Convert.ToBoolean(dataTable.Rows[0]["HideAllowanceLimit"].ToString()),
                    HidePersonalLimit = Convert.ToBoolean(dataTable.Rows[0]["HidePersonalLimit"].ToString())
                }
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveConfig(Config Config)
        {
            string empty = string.Empty;
            string str1;
            try
            {
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (17, 'Configuration', 'Success','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("update tblConfiguration set EmpReminder='" + Config.EmpReminder + "',MgrComplaintReminder='" + Config.MgrReminder + "',ForceBillReminder='" + Config.FBReminder + "',LMReminder='" + Config.LMReminder + "',SMTPSettings='" + Config.SMTP + "',AdminEmail='" + Config.AdminEmail + "',HostUrl='" + Config.HostUrl + "',SuperGrade='" + Config.SupGrade + "',EnableGrade='" + Config.EnableGrade.ToString() + "',NotSendMail='" + Config.DntSndEmail.ToString() + "',HidePersonalCalls='" + Config.HidePerCalls.ToString() + "',skipGMApproval='" + Config.GMApp.ToString() + "',EnableDiscrepancy='" + Config.EnableDiscrepancy.ToString() + "',SkipApprovalBuss='" + Config.SkipAppBusZero.ToString() + "',DedBussinessCharges='" + Config.DedBusCharges.ToString() + "',BusinessZeroAsUnlimited='" + Config.ZeroUnlimited.ToString() + "',AllowWaiver='" + Config.AlwWav.ToString() + "',DeleteBut='" + Config.EnableDelete.ToString() + "',AllowTrainForceBill='" + Config.AlwTrainFB.ToString() + "',HideAllowanceLimit='" + Config.HideAllowanceLimit.ToString() + "',HidePersonalLimit='" + Config.HidePersonalLimit.ToString() + "' where ID=1");
                str1 = "Configuration Saved Succesfully";
            }
            catch (Exception ex)
            {
                string str2 = Convert.ToString((object)ex).Replace("'", " ");
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (17, 'Save Configuration', 'Fail','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (17, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str2 + "' ,'Save Configuration')");
                str1 = ex.ToString();
            }
            return this.Json((object)new { Message = str1 }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProvider()
        {
            try
            {
                DataSet data = DB.GetData("select ID,Name,IsVoip,COUNTRYID from tblProvider");
                List<TIS.Models.Provider> providerList = new List<TIS.Models.Provider>();
                DataTable table = data.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        providerList.Add(new TIS.Models.Provider()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            NAME = row["Name"].ToString(),
                            IsVoip = Convert.ToBoolean(row["IsVoip"].ToString()),
                            CountryId = Convert.ToInt32(row["COUNTRYID"].ToString())
                        });
                }
                return this.Json((object)new
                {
                    ProviderList = providerList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult AddProvider(TIS.Models.Provider Provider)
        {
            try
            {
                DB.ExecuteNonQuery("insert into tblProvider (Name,IsVoip) values ('" + Provider.NAME + "','" + Provider.IsVoip.ToString() + "')");
                return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult UpdateProvider(TIS.Models.Provider Provider)
        {
            try
            {
                DB.ExecuteNonQuery("Update tblProvider set Name = '" + Provider.NAME + "',IsVoip='" + Provider.IsVoip.ToString() + "' where ID=" + (object)Provider.ID ?? "");
                return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult DeleteProvider(TIS.Models.Provider Provider)
        {
            try
            {
                DB.ExecuteNonQuery("Delete From tblProvider where ID=" + (object)Provider.ID ?? "");
                return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }
    }
}
