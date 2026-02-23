// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.SyncBapiController
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using SAPMobile;
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
    public class SyncBapiController : Controller
    {
        public ActionResult Index() => (ActionResult)this.View();

        public JsonResult TestSyncBapi()
        {
            try
            {
                //new char[1][0] = '\'';
                DataSet dataSet = new DataSet();
                DataTable table = new DataView(DB.GetData("select * from tblUser_BAPI").Tables[0]).ToTable(false, "EMPLOYEENO", "NAME", "USERNAME", "ORG", "ORGID", "MANAGERID", "COSTCENTER");
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@dtBAPIData";
                sqlParameter.Value = (object)table;
                paramColl[0] = sqlParameter;
                DB.ExecuteStoredProc("BAPI_ImportData_test", paramColl);
                return this.Json((object)new
                {
                    Message = "Data Synced Successfully"
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)new
                {
                    Message = ex.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult SyncBapiProd()
        {
            try
            {
                SAPProxyMobile sapProxyMobile1 = new SAPProxyMobile();
                SAPProxyMobile sapProxyMobile2 = new SAPProxyMobile(ConnectionSettings.BAPIConnectionString);
                ZHR_EMP_INFOTable zhrEmpInfoTable = new ZHR_EMP_INFOTable();
                ZHR_EMP_INFO zhrEmpInfo = new ZHR_EMP_INFO();
                ref ZHR_EMP_INFOTable local = ref zhrEmpInfoTable;
                sapProxyMobile2.Zbapi_Get_Employee_Details(ref local);
                DataTable dataTable = new DataTable();
                DataTable table = new DataView(zhrEmpInfoTable.ToADODataTable()).ToTable(false, "Pernr", "Ename", "Usrid", "Orgid", "Dept_Name", "Manager_No", "Costcenter");
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@dtBAPIData";
                sqlParameter.Value = (object)table;
                paramColl[0] = sqlParameter;
                DB.ExecuteStoredProc("BAPI_ImportData", paramColl);
                return this.Json((object)new
                {
                    Message = "Data Synced Successfully"
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)new
                {
                    Message = ex.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult SyncBapiOrignal_OLD()
        {
            try
            {
                SAPProxyMobile sapProxyMobile1 = new SAPProxyMobile();
                SAPProxyMobile sapProxyMobile2 = new SAPProxyMobile(ConnectionSettings.BAPIConnectionString);
                ZHR_EMP_INFOTable zhrEmpInfoTable = new ZHR_EMP_INFOTable();
                ZHR_EMP_INFO zhrEmpInfo = new ZHR_EMP_INFO();
                ref ZHR_EMP_INFOTable local = ref zhrEmpInfoTable;
                sapProxyMobile2.Zbapi_Get_Employee_Details(ref local);
                DataTable dataTable = new DataTable();
                DataTable adoDataTable = zhrEmpInfoTable.ToADODataTable();
                char[] chArray = new char[1] { '\'' };
                foreach (DataRow row in (InternalDataCollectionBase)adoDataTable.Rows)
                {
                    int int32_1 = Convert.ToInt32(row["Pernr"]);
                    string str1 = row["Ename"].ToString();
                    string str2 = row["Usrid"].ToString();
                    string str3 = row["Orgid"].ToString();
                    string str4 = row["Dept_Name"].ToString();
                    int int32_2 = Convert.ToInt32(row["Manager_No"]);
                    string str5 = row["Costcenter"].ToString();
                    string str6 = str2 + "@equate.com";
                    string[] strArray = str1.Split(chArray);
                    string str7 = "";
                    for (int index = 0; index < strArray.Length; ++index)
                        str7 = str7 + strArray[index] + " ";
                    SqlParameter[] paramColl1 = new SqlParameter[1];
                    SqlParameter sqlParameter1 = new SqlParameter();
                    sqlParameter1.ParameterName = "@UID";
                    sqlParameter1.SqlDbType = SqlDbType.BigInt;
                    sqlParameter1.Value = (object)int32_1;
                    paramColl1[0] = sqlParameter1;
                    DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_BAPIGetUser", paramColl1);
                    if (dataSet == null)
                    {
                        List<EmployeeDetails> employeeDetailsList = new List<EmployeeDetails>();
                        DataTable table = dataSet.Tables[0];
                        SqlParameter[] paramColl2 = new SqlParameter[8];
                        SqlParameter sqlParameter2 = new SqlParameter();
                        sqlParameter2.ParameterName = "@UID";
                        sqlParameter2.SqlDbType = SqlDbType.BigInt;
                        sqlParameter2.Value = (object)int32_1;
                        paramColl2[0] = sqlParameter2;
                        SqlParameter sqlParameter3 = new SqlParameter();
                        sqlParameter3.ParameterName = "@new_empname";
                        sqlParameter3.SqlDbType = SqlDbType.NVarChar;
                        sqlParameter3.Value = (object)str7;
                        paramColl2[1] = sqlParameter3;
                        SqlParameter sqlParameter4 = new SqlParameter();
                        sqlParameter4.ParameterName = "@username";
                        sqlParameter4.SqlDbType = SqlDbType.NVarChar;
                        sqlParameter4.Value = (object)str2;
                        paramColl2[2] = sqlParameter4;
                        SqlParameter sqlParameter5 = new SqlParameter();
                        sqlParameter5.ParameterName = "@ManagerID";
                        sqlParameter5.SqlDbType = SqlDbType.BigInt;
                        sqlParameter5.Value = (object)int32_2;
                        paramColl2[3] = sqlParameter5;
                        SqlParameter sqlParameter6 = new SqlParameter();
                        sqlParameter6.ParameterName = "@ORGID";
                        sqlParameter6.SqlDbType = SqlDbType.Int;
                        sqlParameter6.Value = (object)str3;
                        paramColl2[4] = sqlParameter6;
                        SqlParameter sqlParameter7 = new SqlParameter();
                        sqlParameter7.ParameterName = "@Dept";
                        sqlParameter7.SqlDbType = SqlDbType.NVarChar;
                        sqlParameter7.Value = (object)str4;
                        paramColl2[5] = sqlParameter7;
                        SqlParameter sqlParameter8 = new SqlParameter();
                        sqlParameter8.ParameterName = "@email";
                        sqlParameter8.SqlDbType = SqlDbType.NVarChar;
                        sqlParameter8.Value = (object)str6;
                        paramColl2[6] = sqlParameter8;
                        SqlParameter sqlParameter9 = new SqlParameter();
                        sqlParameter9.ParameterName = "@CostCenter";
                        sqlParameter9.SqlDbType = SqlDbType.NVarChar;
                        sqlParameter9.Value = (object)str5;
                        paramColl2[7] = sqlParameter9;
                        DB.ExecuteStoredProc("sp_BAPIAddEmployee", paramColl2);
                    }
                    else
                    {
                        SqlParameter[] paramColl3 = new SqlParameter[5];
                        SqlParameter sqlParameter10 = new SqlParameter();
                        sqlParameter10.ParameterName = "@ManagerID";
                        sqlParameter10.SqlDbType = SqlDbType.BigInt;
                        sqlParameter10.Value = (object)int32_2;
                        paramColl3[0] = sqlParameter10;
                        SqlParameter sqlParameter11 = new SqlParameter();
                        sqlParameter11.ParameterName = "@UID";
                        sqlParameter11.SqlDbType = SqlDbType.BigInt;
                        sqlParameter11.Value = (object)int32_1;
                        paramColl3[1] = sqlParameter11;
                        SqlParameter sqlParameter12 = new SqlParameter();
                        sqlParameter12.ParameterName = "@Dept";
                        sqlParameter12.SqlDbType = SqlDbType.NVarChar;
                        sqlParameter12.Value = (object)str4;
                        paramColl3[2] = sqlParameter12;
                        SqlParameter sqlParameter13 = new SqlParameter();
                        sqlParameter13.ParameterName = "@new_empname";
                        sqlParameter13.SqlDbType = SqlDbType.NVarChar;
                        sqlParameter13.Value = (object)str7;
                        paramColl3[3] = sqlParameter13;
                        SqlParameter sqlParameter14 = new SqlParameter();
                        sqlParameter14.ParameterName = "@ORGID";
                        sqlParameter14.SqlDbType = SqlDbType.Int;
                        sqlParameter14.Value = (object)str3;
                        paramColl3[4] = sqlParameter14;
                        DB.ExecuteStoredProc("sp_BAPIUpdateEmployee", paramColl3);
                    }
                }
                SqlParameter[] paramColl4 = new SqlParameter[1];
                SqlParameter sqlParameter15 = new SqlParameter();
                sqlParameter15.ParameterName = "@UID";
                sqlParameter15.SqlDbType = SqlDbType.BigInt;
                sqlParameter15.Value = (object)0;
                paramColl4[0] = sqlParameter15;
                DataSet dataSet1 = DB.ExecuteStoredProcDataSet("sp_BAPIGetUser2", paramColl4);
                List<EmployeeDetails> employeeDetailsList1 = new List<EmployeeDetails>();
                if (dataSet1.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)dataSet1.Tables[0].Rows)
                    {
                        string str8 = row["EmpName"].ToString().Replace("'", "");
                        string str9 = row["UID"].ToString();
                        string str10 = row["Dept"].ToString().Replace("'", "");
                        string str11 = row["TITLE"].ToString().Replace("'", "");
                        SqlParameter[] paramColl5 = new SqlParameter[1];
                        SqlParameter sqlParameter16 = new SqlParameter();
                        sqlParameter16.ParameterName = "@Username";
                        sqlParameter16.SqlDbType = SqlDbType.NVarChar;
                        sqlParameter16.Value = (object)str9;
                        paramColl5[0] = sqlParameter16;
                        DataSet dataSet2 = DB.ExecuteStoredProcDataSet("sp_BAPIGetUser3", paramColl5);
                        List<EmployeeDetails> employeeDetailsList2 = new List<EmployeeDetails>();
                        if (dataSet2.Tables[0].Rows.Count > 0)
                        {
                            SqlParameter[] paramColl6 = new SqlParameter[4];
                            SqlParameter sqlParameter17 = new SqlParameter();
                            sqlParameter17.ParameterName = "@empname";
                            sqlParameter17.SqlDbType = SqlDbType.NVarChar;
                            sqlParameter17.Value = (object)str8;
                            paramColl6[0] = sqlParameter17;
                            SqlParameter sqlParameter18 = new SqlParameter();
                            sqlParameter18.ParameterName = "@Username";
                            sqlParameter18.SqlDbType = SqlDbType.NVarChar;
                            sqlParameter18.Value = (object)str9;
                            paramColl6[1] = sqlParameter18;
                            SqlParameter sqlParameter19 = new SqlParameter();
                            sqlParameter19.ParameterName = "@dept";
                            sqlParameter19.SqlDbType = SqlDbType.NVarChar;
                            sqlParameter19.Value = (object)str10;
                            paramColl6[2] = sqlParameter19;
                            SqlParameter sqlParameter20 = new SqlParameter();
                            sqlParameter20.ParameterName = "@description";
                            sqlParameter20.SqlDbType = SqlDbType.NVarChar;
                            sqlParameter20.Value = (object)str11;
                            paramColl6[3] = sqlParameter20;
                            DB.ExecuteStoredProc("sp_BAPIAddEmployee2", paramColl6);
                        }
                        else
                        {
                            SqlParameter[] paramColl7 = new SqlParameter[4];
                            SqlParameter sqlParameter21 = new SqlParameter();
                            sqlParameter21.ParameterName = "@Username";
                            sqlParameter21.SqlDbType = SqlDbType.NVarChar;
                            sqlParameter21.Value = (object)str9;
                            paramColl7[0] = sqlParameter21;
                            SqlParameter sqlParameter22 = new SqlParameter();
                            sqlParameter22.ParameterName = "@dept";
                            sqlParameter22.SqlDbType = SqlDbType.NVarChar;
                            sqlParameter22.Value = (object)str10;
                            paramColl7[1] = sqlParameter22;
                            SqlParameter sqlParameter23 = new SqlParameter();
                            sqlParameter23.ParameterName = "@description";
                            sqlParameter23.SqlDbType = SqlDbType.NVarChar;
                            sqlParameter23.Value = (object)str11;
                            paramColl7[2] = sqlParameter23;
                            SqlParameter sqlParameter24 = new SqlParameter();
                            sqlParameter24.ParameterName = "@empname";
                            sqlParameter24.SqlDbType = SqlDbType.NVarChar;
                            sqlParameter24.Value = (object)str8;
                            paramColl7[3] = sqlParameter24;
                            DB.ExecuteStoredProc("sp_BAPIUpdateEmployee2", paramColl7);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return this.Json((object)1);
        }
    }
}
