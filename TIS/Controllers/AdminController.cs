// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.AdminController
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
using TIS.Helper;
using TIS.Models;

namespace TIS.Controllers
{
    public class AdminController : Controller
    {
        public ActionResult Index()
        {
            if (this.Session["EmpRoleID"] == null)
                return (ActionResult)this.View("AccessDenied");
            Convert.ToInt32(this.Session["EmpRoleID"].ToString());
            return (ActionResult)this.View("ManageEmployee");
        }

        public ActionResult Telephone() => this.Session["EmpLoginName"] == null ? (ActionResult)this.View("AccessDenied") : (ActionResult)this.View("AddTelephone");

        public ActionResult Delegate() => this.Session["EmpLoginName"] == null ? (ActionResult)this.View("AccessDenied") : (ActionResult)this.View("DelegateBills");

        public ActionResult Package() => this.Session["EmpLoginName"] == null ? (ActionResult)this.View("AccessDenied") : (ActionResult)this.View();


        public JsonResult GetUser()
        {
            string str = this.Session["EmpLoginAs"].ToString();
            try
            {
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@Username";
                sqlParameter.SqlDbType = SqlDbType.VarChar;
                sqlParameter.Value = (object)str;
                paramColl[0] = sqlParameter;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetEmployee", paramColl);

                List<EmployeeDetails> employeeDetailsList = new List<EmployeeDetails>();
                DataTable table1 = dataSet.Tables[0];
                if (table1.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table1.Rows)
                        employeeDetailsList.Add(new EmployeeDetails()
                        {
                            UID = Convert.ToInt32(row["UID"].ToString()),
                            NAME = row["NAME"].ToString(),
                            EMPLOYEENO = row["EMPLOYEENO"].ToString(),
                            EMAIL = row["EMAIL"].ToString(),
                            USERNAME = row["USERNAME"].ToString(),
                            ORG = row["ORG"].ToString(),
                            DESCRIPTION = row["DESCRIPTION"].ToString(),
                            GRADE = row["GRADE"].ToString(),
                            MANAGERID = Convert.ToInt32(row["MANAGERID"].ToString()),
                            MANAGERNAME = row["MANAGER"].ToString(),
                            EXTENSION = row["EXTENSION"].ToString(),
                            PAYROLL = row["PAYROLLCATEGORY"].ToString(),
                            ROLEID = Convert.ToInt32(row["RID"].ToString()),
                            ROLENAME = row["RoleName"].ToString(),
                            COUNTRYID = Convert.ToInt32(row["COUNTRYID"].ToString()),
                            COUNTRYNAME = row["COUNTRYNAME"].ToString(),
                            CCNO = row["COSTCENTER"].ToString(),
                            ISCOSTCENTER = row["ISCOSTCENTER"].ToString(),
                            COMPANY = row["Company"].ToString(),
                            COMPANYID = row["CompanyID"].ToString(),
                            IsActive = bool.Parse(row["IsActive"].ToString())
                        });
                }

                List<CostCenter> costCenterList = new List<CostCenter>();
                DataTable table2 = dataSet.Tables[3];
                if (table2.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table2.Rows)
                        costCenterList.Add(new CostCenter()
                        {
                            UID = Convert.ToInt32(row["UID"].ToString()),
                            CCName = row["NAME"].ToString(),
                            CCNum = row["EMPLOYEENO"].ToString()
                        });
                }

                List<Role> roleList = new List<Role>();
                DataTable table3 = dataSet.Tables[1];
                if (table3.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table3.Rows)
                        roleList.Add(new Role()
                        {
                            ID = Convert.ToInt32(row["Role_ID"].ToString()),
                            ROLE = row["RoleName"].ToString()
                        });
                }

                List<Country> countryList = new List<Country>();
                DataTable table4 = dataSet.Tables[2];
                if (table4.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table4.Rows)
                        countryList.Add(new Country()
                        {
                            COUNTRYID = Convert.ToInt32(row["COUNTRYID"].ToString()),
                            COUNTRYNAME = row["COUNTRYNAME"].ToString(),
                            COUNTRYCODE = row["COUNTRYCODE"].ToString(),
                            EXCHANGERATE = Convert.ToDecimal(row["EXCHANGERATE"].ToString()),
                            SHAYACODE = row["SHAYACODE"].ToString(),
                            CURRENCY = row["CURRENCY"].ToString()
                        });
                }

                List<Company> companyList = new List<Company>();
                DataTable table5 = dataSet.Tables[4];
                if (table5.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table5.Rows)
                        companyList.Add(new Company()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            COMPANY = row["CompanyName"].ToString()
                        });
                }

                return this.Json((object)new
                {
                    dtEmp = employeeDetailsList,
                    RoleList = roleList,
                    CountryList = countryList,
                    dtCC = costCenterList,
                    CompanyList = companyList,
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json(new
                {
                    Fail = true,
                    Message = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AddEmployee(EmployeeDetails Emp, Country Cnt)
        {
            string str1 = string.Empty;
            try
            {
                for (int index = 0; index < Cnt.SelectedValues.Length; ++index)
                {
                    SqlParameter[] paramColl = new SqlParameter[16];
                    SqlParameter sqlParameter1 = new SqlParameter();
                    sqlParameter1.ParameterName = "@NAME";
                    sqlParameter1.SqlDbType = SqlDbType.VarChar;
                    sqlParameter1.Value = (object)Emp.NAME;
                    paramColl[0] = sqlParameter1;
                    SqlParameter sqlParameter2 = new SqlParameter();
                    sqlParameter2.ParameterName = "@EMPLOYEENO";
                    sqlParameter2.SqlDbType = SqlDbType.VarChar;
                    sqlParameter2.Value = (object)Emp.EMPLOYEENO;
                    paramColl[1] = sqlParameter2;
                    SqlParameter sqlParameter3 = new SqlParameter();
                    sqlParameter3.ParameterName = "@CCNO";
                    sqlParameter3.SqlDbType = SqlDbType.VarChar;
                    sqlParameter3.Value = (object)Emp.CCNO;
                    paramColl[2] = sqlParameter3;
                    SqlParameter sqlParameter4 = new SqlParameter();
                    sqlParameter4.ParameterName = "@EMAIL";
                    sqlParameter4.SqlDbType = SqlDbType.VarChar;
                    sqlParameter4.Value = (object)Emp.EMAIL;
                    paramColl[3] = sqlParameter4;
                    SqlParameter sqlParameter5 = new SqlParameter();
                    sqlParameter5.ParameterName = "@USERNAME";
                    sqlParameter5.SqlDbType = SqlDbType.VarChar;
                    sqlParameter5.Value = (object)Emp.USERNAME;
                    paramColl[4] = sqlParameter5;
                    SqlParameter sqlParameter6 = new SqlParameter();
                    sqlParameter6.ParameterName = "@ORG";
                    sqlParameter6.SqlDbType = SqlDbType.VarChar;
                    sqlParameter6.Value = (object)Emp.ORG;
                    paramColl[5] = sqlParameter6;
                    SqlParameter sqlParameter7 = new SqlParameter();
                    sqlParameter7.ParameterName = "@DESCRIPTION";
                    sqlParameter7.SqlDbType = SqlDbType.VarChar;
                    sqlParameter7.Value = (object)Emp.DESCRIPTION;
                    paramColl[6] = sqlParameter7;
                    SqlParameter sqlParameter8 = new SqlParameter();
                    sqlParameter8.ParameterName = "@MANAGERID";
                    sqlParameter8.SqlDbType = SqlDbType.Int;
                    sqlParameter8.Value = (object)Emp.MANAGERID;
                    paramColl[7] = sqlParameter8;
                    SqlParameter sqlParameter9 = new SqlParameter();
                    sqlParameter9.ParameterName = "@GRADE";
                    sqlParameter9.SqlDbType = SqlDbType.VarChar;
                    sqlParameter9.Value = (object)Emp.GRADE;
                    paramColl[8] = sqlParameter9;
                    SqlParameter sqlParameter10 = new SqlParameter();
                    sqlParameter10.ParameterName = "@EXTENSION";
                    sqlParameter10.SqlDbType = SqlDbType.VarChar;
                    sqlParameter10.Value = (object)Emp.EXTENSION;
                    paramColl[9] = sqlParameter10;
                    SqlParameter sqlParameter11 = new SqlParameter();
                    sqlParameter11.ParameterName = "@PAYROLL";
                    sqlParameter11.SqlDbType = SqlDbType.VarChar;
                    sqlParameter11.Value = (object)Emp.PAYROLL;
                    paramColl[10] = sqlParameter11;
                    SqlParameter sqlParameter12 = new SqlParameter();
                    sqlParameter12.ParameterName = "@ROLEID";
                    sqlParameter12.SqlDbType = SqlDbType.Int;
                    sqlParameter12.Value = (object)Emp.ROLEID;
                    paramColl[11] = sqlParameter12;
                    SqlParameter sqlParameter13 = new SqlParameter();
                    sqlParameter13.ParameterName = "@COUNTRYID";
                    sqlParameter13.SqlDbType = SqlDbType.Int;
                    sqlParameter13.Value = (object)Cnt.SelectedValues[index];
                    paramColl[12] = sqlParameter13;
                    SqlParameter sqlParameter14 = new SqlParameter();
                    sqlParameter14.ParameterName = "@Count";
                    sqlParameter14.SqlDbType = SqlDbType.Int;
                    sqlParameter14.Value = (object)index;
                    paramColl[13] = sqlParameter14;
                    SqlParameter sqlParameter15 = new SqlParameter();
                    sqlParameter15.ParameterName = "@UserUid";
                    sqlParameter15.SqlDbType = SqlDbType.Int;
                    sqlParameter15.Value = this.Session["EmpUID"];
                    paramColl[14] = sqlParameter15;

                    SqlParameter sqlParameter16 = new SqlParameter();
                    sqlParameter16.ParameterName = "@CompanyID";
                    sqlParameter16.SqlDbType = SqlDbType.Int;
                    sqlParameter16.Value = (object)Emp.COMPANYID;
                    paramColl[15] = sqlParameter16;

                    SqlParameter sqlParameter17 = new SqlParameter();
                    sqlParameter17.ParameterName = "@IsActive";
                    sqlParameter17.SqlDbType = SqlDbType.Bit;
                    sqlParameter17.Value = Emp.IsActive;
                    paramColl[16] = sqlParameter17;

                    DB.ExecuteStoredProc("sp_AddEmployee", paramColl);
                    str1 = "succ";
                }
            }
            catch (Exception ex)
            {
                string str2 = Convert.ToString((object)ex).Replace("'", " ");
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (1, 'ADD EMPLOYEE', 'Fail','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (1, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str2 + "' ,'Add New Employee')");
                str1 = "err";
            }
            return this.Json((object)new { myMessage = str1 }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateEmployee(EmployeeDetails Emp, Country Cnt)
        {
            string str1 = string.Empty;
            try
            {
                for (int index = 0; index < Cnt.SelectedValues.Length; ++index)
                {
                    SqlParameter[] paramColl = new SqlParameter[18];
                    SqlParameter sqlParameter1 = new SqlParameter();
                    sqlParameter1.ParameterName = "@UID";
                    sqlParameter1.SqlDbType = SqlDbType.VarChar;
                    sqlParameter1.Value = (object)Emp.UID;
                    paramColl[0] = sqlParameter1;
                    SqlParameter sqlParameter2 = new SqlParameter();
                    sqlParameter2.ParameterName = "@NAME";
                    sqlParameter2.SqlDbType = SqlDbType.VarChar;
                    sqlParameter2.Value = (object)Emp.NAME;
                    paramColl[1] = sqlParameter2;
                    SqlParameter sqlParameter3 = new SqlParameter();
                    sqlParameter3.ParameterName = "@EMPLOYEENO";
                    sqlParameter3.SqlDbType = SqlDbType.VarChar;
                    sqlParameter3.Value = (object)Emp.EMPLOYEENO;
                    paramColl[2] = sqlParameter3;
                    SqlParameter sqlParameter4 = new SqlParameter();
                    sqlParameter4.ParameterName = "@CCNO";
                    sqlParameter4.SqlDbType = SqlDbType.VarChar;
                    sqlParameter4.Value = (object)Emp.CCNO;
                    paramColl[3] = sqlParameter4;
                    SqlParameter sqlParameter5 = new SqlParameter();
                    sqlParameter5.ParameterName = "@EMAIL";
                    sqlParameter5.SqlDbType = SqlDbType.VarChar;
                    sqlParameter5.Value = (object)Emp.EMAIL;
                    paramColl[4] = sqlParameter5;
                    SqlParameter sqlParameter6 = new SqlParameter();
                    sqlParameter6.ParameterName = "@USERNAME";
                    sqlParameter6.SqlDbType = SqlDbType.VarChar;
                    sqlParameter6.Value = (object)Emp.USERNAME;
                    paramColl[5] = sqlParameter6;
                    SqlParameter sqlParameter7 = new SqlParameter();
                    sqlParameter7.ParameterName = "@ORG";
                    sqlParameter7.SqlDbType = SqlDbType.VarChar;
                    sqlParameter7.Value = (object)Emp.ORG;
                    paramColl[6] = sqlParameter7;
                    SqlParameter sqlParameter8 = new SqlParameter();
                    sqlParameter8.ParameterName = "@DESCRIPTION";
                    sqlParameter8.SqlDbType = SqlDbType.VarChar;
                    sqlParameter8.Value = (object)Emp.DESCRIPTION;
                    paramColl[7] = sqlParameter8;
                    SqlParameter sqlParameter9 = new SqlParameter();
                    sqlParameter9.ParameterName = "@MANAGERID";
                    sqlParameter9.SqlDbType = SqlDbType.Int;
                    sqlParameter9.Value = (object)Emp.MANAGERID;
                    paramColl[8] = sqlParameter9;
                    SqlParameter sqlParameter10 = new SqlParameter();
                    sqlParameter10.ParameterName = "@GRADE";
                    sqlParameter10.SqlDbType = SqlDbType.VarChar;
                    sqlParameter10.Value = (object)Emp.GRADE;
                    paramColl[9] = sqlParameter10;
                    SqlParameter sqlParameter11 = new SqlParameter();
                    sqlParameter11.ParameterName = "@EXTENSION";
                    sqlParameter11.SqlDbType = SqlDbType.VarChar;
                    sqlParameter11.Value = (object)Emp.EXTENSION;
                    paramColl[10] = sqlParameter11;
                    SqlParameter sqlParameter12 = new SqlParameter();
                    sqlParameter12.ParameterName = "@PAYROLL";
                    sqlParameter12.SqlDbType = SqlDbType.VarChar;
                    sqlParameter12.Value = (object)Emp.PAYROLL;
                    paramColl[11] = sqlParameter12;
                    SqlParameter sqlParameter13 = new SqlParameter();
                    sqlParameter13.ParameterName = "@ROLEID";
                    sqlParameter13.SqlDbType = SqlDbType.Int;
                    sqlParameter13.Value = (object)Emp.ROLEID;
                    paramColl[12] = sqlParameter13;
                    SqlParameter sqlParameter14 = new SqlParameter();
                    sqlParameter14.ParameterName = "@COUNTRYID";
                    sqlParameter14.SqlDbType = SqlDbType.Int;
                    sqlParameter14.Value = (object)Cnt.SelectedValues[index];
                    paramColl[13] = sqlParameter14;
                    SqlParameter sqlParameter15 = new SqlParameter();
                    sqlParameter15.ParameterName = "@Count";
                    sqlParameter15.SqlDbType = SqlDbType.Int;
                    sqlParameter15.Value = (object)index;
                    paramColl[14] = sqlParameter15;
                    SqlParameter sqlParameter16 = new SqlParameter();
                    sqlParameter16.ParameterName = "@UserUid";
                    sqlParameter16.SqlDbType = SqlDbType.Int;
                    sqlParameter16.Value = this.Session["EmpUID"];
                    paramColl[15] = sqlParameter16;

                    SqlParameter sqlParameter17 = new SqlParameter();
                    sqlParameter17.ParameterName = "@CompanyID";
                    sqlParameter17.SqlDbType = SqlDbType.Int;
                    sqlParameter17.Value = Emp.COMPANYID;
                    paramColl[16] = sqlParameter17;

                    SqlParameter sqlParameter18 = new SqlParameter();
                    sqlParameter18.ParameterName = "@IsActive";
                    sqlParameter18.SqlDbType = SqlDbType.Bit;
                    sqlParameter18.Value = Emp.IsActive;
                    paramColl[17] = sqlParameter18;

                    DB.ExecuteStoredProc("sp_UpdateEmployee", paramColl);
                    str1 = "succ";
                }
            }
            catch (Exception ex)
            {
                string str2 = Convert.ToString((object)ex).Replace("'", " ");
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (1, 'UPDATE EMPLOYEE', 'Fail','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (1, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str2 + "' ,'Update Employee')");
                str1 = "err";
            }
            return this.Json((object)new { myMessage = str1 }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteEmployee(EmployeeDetails Emp)
        {
            string empty = string.Empty;
            string str1;
            try
            {
                SqlParameter[] paramColl = new SqlParameter[2];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@UID";
                sqlParameter1.SqlDbType = SqlDbType.VarChar;
                sqlParameter1.Value = (object)Emp.UID;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@UserUid";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = this.Session["EmpUID"];
                paramColl[1] = sqlParameter2;
                DB.ExecuteStoredProc("sp_DeleteEmployee", paramColl);
                str1 = "succ";
            }
            catch (Exception ex)
            {
                string str2 = Convert.ToString((object)ex).Replace("'", " ");
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (1, 'DELETE EMPLOYEE', 'Fail','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (1, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str2 + "' ,'Delete Employee')");
                str1 = "err";
            }
            return this.Json((object)new { myMessage = str1 }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCC()
        {
            try
            {
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetCC");
                List<CostCenter> costCenterList = new List<CostCenter>();
                DataTable table1 = dataSet.Tables[0];
                if (table1.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table1.Rows)
                        costCenterList.Add(new CostCenter()
                        {
                            UID = Convert.ToInt32(row["UID"].ToString()),
                            CCName = row["NAME"].ToString(),
                            CCNum = row["EMPLOYEENO"].ToString()
                        });
                }
                List<Country> countryList = new List<Country>();
                DataTable table2 = dataSet.Tables[1];
                if (table2.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table2.Rows)
                        countryList.Add(new Country()
                        {
                            COUNTRYID = Convert.ToInt32(row["COUNTRYID"].ToString()),
                            COUNTRYNAME = row["COUNTRYNAME"].ToString(),
                            CURRENCY = row["CURRENCY"].ToString(),
                            COUNTRYCODE = row["COUNTRYCODE"].ToString(),
                            EXCHANGERATE = (Decimal)Convert.ToInt32(row["EXCHANGERATE"].ToString()),
                            SHAYACODE = row["SHAYACODE"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    dtCC = costCenterList,
                    CountryList = countryList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult AddCC(CostCenter CC)
        {
            SqlParameter[] paramColl = new SqlParameter[3];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@Command";
            sqlParameter1.SqlDbType = SqlDbType.Int;
            sqlParameter1.Value = (object)1;
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@NAME";
            sqlParameter2.SqlDbType = SqlDbType.VarChar;
            sqlParameter2.Value = (object)CC.CCName;
            paramColl[1] = sqlParameter2;
            SqlParameter sqlParameter3 = new SqlParameter();
            sqlParameter3.ParameterName = "@EMPLOYEENO";
            sqlParameter3.SqlDbType = SqlDbType.VarChar;
            sqlParameter3.Value = (object)CC.CCNum;
            paramColl[2] = sqlParameter3;
            DB.ExecuteStoredProc("sp_ManageCC", paramColl);
            return this.Json((object)new
            {
                myMessage = "Added Sucessfully"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateCC(CostCenter CC)
        {
            SqlParameter[] paramColl = new SqlParameter[4];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@Command";
            sqlParameter1.SqlDbType = SqlDbType.Int;
            sqlParameter1.Value = (object)2;
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@UID";
            sqlParameter2.SqlDbType = SqlDbType.VarChar;
            sqlParameter2.Value = (object)CC.UID;
            paramColl[1] = sqlParameter2;
            SqlParameter sqlParameter3 = new SqlParameter();
            sqlParameter3.ParameterName = "@NAME";
            sqlParameter3.SqlDbType = SqlDbType.VarChar;
            sqlParameter3.Value = (object)CC.CCName;
            paramColl[2] = sqlParameter3;
            SqlParameter sqlParameter4 = new SqlParameter();
            sqlParameter4.ParameterName = "@EMPLOYEENO";
            sqlParameter4.SqlDbType = SqlDbType.VarChar;
            sqlParameter4.Value = (object)CC.CCNum;
            paramColl[3] = sqlParameter4;
            DB.ExecuteStoredProc("sp_ManageCC", paramColl);
            return this.Json((object)new
            {
                myMessage = "Updated Sucessfully"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteCC(CostCenter CC)
        {
            SqlParameter[] paramColl = new SqlParameter[2];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@Command";
            sqlParameter1.SqlDbType = SqlDbType.Int;
            sqlParameter1.Value = (object)3;
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@UID";
            sqlParameter2.SqlDbType = SqlDbType.VarChar;
            sqlParameter2.Value = (object)CC.UID;
            paramColl[1] = sqlParameter2;
            DB.ExecuteStoredProc("sp_ManageCC", paramColl);
            return this.Json((object)new
            {
                myMessage = "Deleted Sucessfully"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddCountry(Country con)
        {
            try
            {
                DB.ExecuteNonQuery("insert into TBLCOUNTRY (COUNTRYNAME, COUNTRYCODE, SHAYACODE, EXCHANGERATE, CURRENCY) values ('" + con.COUNTRYNAME + "','" + con.COUNTRYCODE + "','" + con.SHAYACODE + "','" + (object)con.EXCHANGERATE + "','" + con.CURRENCY + "')");
                return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult UpdateCountry(Country con)
        {
            try
            {
                DB.ExecuteNonQuery("Update TBLCOUNTRY set  COUNTRYNAME='" + con.COUNTRYNAME + "', COUNTRYCODE='" + con.COUNTRYCODE + "',SHAYACODE='" + con.SHAYACODE + "',EXCHANGERATE='" + (object)con.EXCHANGERATE + "', CURRENCY='" + con.CURRENCY + "' where COUNTRYID = " + (object)con.COUNTRYID ?? "");
                return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult DeleteCountry(Country con)
        {
            try
            {
                DB.ExecuteNonQuery("Delete From TBLCOUNTRY where COUNTRYID = " + (object)con.COUNTRYID ?? "");
                return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult AddManager(EmployeeDetails man)
        {
            try
            {
                DB.ExecuteNonQuery("insert into TBLUSER (NAME,EMPLOYEENO) values ('" + man.NAME + "','" + man.EMPLOYEENO + "')");
                return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult UpdateManager(CostCenter man)
        {
            try
            {
                return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult DeleteManager(CostCenter man)
        {
            try
            {
                return this.Json((object)new { Message = "Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult GetNewData()
        {
            try
            {
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetEmployee");
                List<Country> countryList = new List<Country>();
                DataTable table = dataSet.Tables[2];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        countryList.Add(new Country()
                        {
                            COUNTRYID = Convert.ToInt32(row["COUNTRYID"].ToString()),
                            COUNTRYNAME = row["COUNTRYNAME"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    CountryList = countryList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult GetTelData()
        {
            int int32_1 = Convert.ToInt32(this.Session["CountryID"].ToString());
            int int32_2 = Convert.ToInt32(this.Session["EmpRoleID"].ToString());
            try
            {
                SqlParameter[] paramColl = new SqlParameter[2];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@CountryID";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)int32_1;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@RoleID";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)int32_2;
                paramColl[1] = sqlParameter2;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetTelData", paramColl);
                List<TIS.Models.Telephone> telephoneList = new List<TIS.Models.Telephone>();
                DataTable table1 = dataSet.Tables[0];
                if (table1.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table1.Rows)
                    {
                        DateTime? contractExpiry = null;
                        if(!string.IsNullOrEmpty(row["ContractExpiry"].ToString()))
                        {
                            contractExpiry = Convert.ToDateTime(row["ContractExpiry"].ToString());
                        }
                        telephoneList.Add(new TIS.Models.Telephone()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            SUBNO = row["SUB_NO"].ToString(),
                            PROVIDER = Convert.ToInt32(row["SUB_TYPE"].ToString()),
                            PROVIDERNAME = row["SUBS_TYPE"].ToString(),
                            DESCRIPTION = row["SUB_DESC"].ToString(),
                            ACCOUNTNO = row["ACCOUNTNO"].ToString(),
                            LINETYPE = Convert.ToInt32(row["LINETYPE"].ToString()),
                            LINETYPENAME = row["LineTypeName"].ToString(),
                            ISASSIGNED = Convert.ToBoolean(row["ISASSIGNED"].ToString()),
                            GENERALPHONE = Convert.ToBoolean(row["GENERALPHONE"].ToString()),
                            TYPE = row["BUSSINESSTYPE"].ToString(),
                            ContractExpiry = contractExpiry,
                        });
                    }
                        
                }
                List<Unassigned> unassignedList = new List<Unassigned>();
                DataRow[] source = table1.Select("[ISASSIGNED] = FALSE");
                if (source.Length != 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)((IEnumerable<DataRow>)source).CopyToDataTable<DataRow>().Rows)
                        unassignedList.Add(new Unassigned()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            SUBNO = row["SUB_NO"].ToString(),
                            DESCRIPTION = row["SUB_DESC"].ToString()
                        });
                }
                List<AssignNo> assignNoList = new List<AssignNo>();
                DataTable table2 = dataSet.Tables[1];
                if (table2.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table2.Rows)
                        assignNoList.Add(new AssignNo()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            SubNoId = Convert.ToInt32(row["Subs_no_ID"].ToString()),
                            SUBNO = row["SUB_NO"].ToString(),
                            DESCRIPTION = row["SUB_DESC"].ToString(),
                            UID = Convert.ToInt32(row["UID"].ToString()),
                            EMPLOYEENAME = row["NAME"].ToString(),
                            EMPLOYEENO = row["EMPLOYEENO"].ToString(),
                            BUSINESSLIMIT = Convert.ToDecimal(row["BUSSINESSLIMIT"].ToString()),
                            ALLOWANCELIMIT = Convert.ToDecimal(row["MONTHLYLIMIT"].ToString()),
                            LINESTATUS = Convert.ToInt32(row["LineStatusID"].ToString()),
                            LINESTATUSNAME = row["LineStatus"].ToString(),
                            STARTDATE = Convert.ToDateTime(row["StartDate"].ToString()),
                            ENDDATE = Convert.ToDateTime(row["EndDate"].ToString()),
                            CostCenterID = Convert.ToInt32(row["CostCenterID"].ToString()),
                            CostCenterName = row["CostCenter_Name"].ToString(),

                        });
                }
                List<Provider> providerList = new List<Provider>();
                DataTable table3 = dataSet.Tables[2];
                if (table3.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table3.Rows)
                        providerList.Add(new Provider()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            NAME = row["Name"].ToString()
                        });
                }
                List<Employee> employeeList = new List<Employee>();
                DataTable table4 = dataSet.Tables[3];
                if (table4.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table4.Rows)
                        employeeList.Add(new Employee()
                        {
                            EmpId = Convert.ToInt32(row["UID"].ToString()),
                            EmpNo = row["EMPLOYEENO"].ToString(),
                            EmpName = row["NAME"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    dtTel = telephoneList,
                    dtUnAsg = unassignedList,
                    dtAsg = assignNoList,
                    dtProvider = providerList,
                    dtEmp = employeeList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult GetTelNo()
        {
            int int32_1 = Convert.ToInt32(this.Session["CountryID"].ToString());
            int int32_2 = Convert.ToInt32(this.Session["EmpRoleID"].ToString());
            try
            {
                SqlParameter[] paramColl = new SqlParameter[3];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@CountryID";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)int32_1;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@Command";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)1;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@RoleID";
                sqlParameter3.SqlDbType = SqlDbType.Int;
                sqlParameter3.Value = (object)int32_2;
                paramColl[2] = sqlParameter3;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetNumber", paramColl);
                List<TIS.Models.Telephone> telephoneList = new List<TIS.Models.Telephone>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                    {
                        DateTime? contractExpiry = null;
                        if (!string.IsNullOrEmpty(row["ContractExpiry"].ToString()))
                        {
                            contractExpiry = Convert.ToDateTime(row["ContractExpiry"].ToString());
                        }

                        telephoneList.Add(new TIS.Models.Telephone()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            SUBNO = row["SUB_NO"].ToString(),
                            PROVIDER = Convert.ToInt32(row["SUB_TYPE"].ToString()),
                            PROVIDERNAME = row["SUBS_TYPE"].ToString(),
                            DESCRIPTION = row["SUB_DESC"].ToString(),
                            ACCOUNTNO = row["ACCOUNTNO"].ToString(),
                            ISASSIGNED = Convert.ToBoolean(row["ISASSIGNED"].ToString()),
                            GENERALPHONE = Convert.ToBoolean(row["GENERALPHONE"].ToString()),
                            LINETYPE = Convert.ToInt32(row["LINETYPE"].ToString()),
                            LINETYPENAME = row["LineTypeName"].ToString(),
                            TYPE = row["BUSSINESSTYPE"].ToString(),
                            ContractExpiry = contractExpiry
                        });
                    }
                        
                }
                List<Unassigned> unassignedList = new List<Unassigned>();
                DataRow[] source = table.Select("[ISASSIGNED] = FALSE");
                if (source.Length != 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)((IEnumerable<DataRow>)source).CopyToDataTable<DataRow>().Rows)
                        unassignedList.Add(new Unassigned()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            SUBNO = row["SUB_NO"].ToString(),
                            DESCRIPTION = row["SUB_DESC"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    dtTel = telephoneList,
                    dtUnAsg = unassignedList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult GetAsgNo()
        {
            int int32_1 = Convert.ToInt32(this.Session["CountryID"].ToString());
            int int32_2 = Convert.ToInt32(this.Session["EmpRoleID"].ToString());
            try
            {
                SqlParameter[] paramColl = new SqlParameter[3];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@CountryID";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)int32_1;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@Command";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)2;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@RoleID";
                sqlParameter3.SqlDbType = SqlDbType.Int;
                sqlParameter3.Value = (object)int32_2;
                paramColl[2] = sqlParameter3;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetNumber", paramColl);
                List<TIS.Models.Telephone> telephoneList = new List<TIS.Models.Telephone>();
                DataTable table1 = dataSet.Tables[0];
                if (table1.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table1.Rows)
                    {
                        DateTime? contractExpiry = null;
                        if (!string.IsNullOrEmpty(row["ContractExpiry"].ToString()))
                        {
                            contractExpiry = Convert.ToDateTime(row["ContractExpiry"].ToString());
                        }

                        telephoneList.Add(new TIS.Models.Telephone()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            SUBNO = row["SUB_NO"].ToString(),
                            PROVIDER = Convert.ToInt32(row["SUB_TYPE"].ToString()),
                            PROVIDERNAME = row["SUBS_TYPE"].ToString(),
                            DESCRIPTION = row["SUB_DESC"].ToString(),
                            ACCOUNTNO = row["ACCOUNTNO"].ToString(),
                            ISASSIGNED = Convert.ToBoolean(row["ISASSIGNED"].ToString()),
                            GENERALPHONE = Convert.ToBoolean(row["GENERALPHONE"].ToString()),
                            LINETYPE = Convert.ToInt32(row["LINETYPE"].ToString()),
                            TYPE = row["BUSSINESSTYPE"].ToString(),
                            ContractExpiry = contractExpiry
                        });
                    }
                        
                }
                List<Unassigned> unassignedList = new List<Unassigned>();
                DataRow[] source = table1.Select("[ISASSIGNED] = FALSE");
                if (source.Length != 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)((IEnumerable<DataRow>)source).CopyToDataTable<DataRow>().Rows)
                        unassignedList.Add(new Unassigned()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            SUBNO = row["SUB_NO"].ToString(),
                            DESCRIPTION = row["SUB_DESC"].ToString()
                        });
                }
                List<AssignNo> assignNoList = new List<AssignNo>();
                DataTable table2 = dataSet.Tables[1];
                if (table2.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table2.Rows)
                        assignNoList.Add(new AssignNo()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            SubNoId = Convert.ToInt32(row["Subs_no_ID"].ToString()),
                            SUBNO = row["SUB_NO"].ToString(),
                            DESCRIPTION = row["SUB_DESC"].ToString(),
                            UID = Convert.ToInt32(row["UID"].ToString()),
                            EMPLOYEENAME = row["NAME"].ToString(),
                            EMPLOYEENO = row["EMPLOYEENO"].ToString(),
                            BUSINESSLIMIT = Convert.ToDecimal(row["BUSSINESSLIMIT"].ToString()),
                            ALLOWANCELIMIT = Convert.ToDecimal(row["MONTHLYLIMIT"].ToString()),
                            LINESTATUS = Convert.ToInt32(row["LineStatusID"].ToString()),
                            LINESTATUSNAME = row["LineStatus"].ToString(),
                            STARTDATE = Convert.ToDateTime(row["StartDate"].ToString()),
                            ENDDATE = Convert.ToDateTime(row["EndDate"].ToString())
                        });
                }
                return this.Json((object)new
                {
                    dtTel = telephoneList,
                    dtUnAsg = unassignedList,
                    dtAsg = assignNoList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult GetProvider()
        {
            int int32_1 = Convert.ToInt32(this.Session["CountryID"].ToString());
            int int32_2 = Convert.ToInt32(this.Session["EmpRoleID"].ToString());
            try
            {
                SqlParameter[] paramColl = new SqlParameter[2];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@CountryID";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)int32_1;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@RoleID";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)int32_2;
                paramColl[1] = sqlParameter2;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetProvider", paramColl);
                List<Provider> providerList = new List<Provider>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        providerList.Add(new Provider()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            NAME = row["Name"].ToString()
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

        public JsonResult AddTelephone(TIS.Models.Telephone Telephone)
        {
            string empty = string.Empty;
            string str1;
            try
            {
                SqlParameter[] paramColl = new SqlParameter[7];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@SUBNO";
                sqlParameter1.SqlDbType = SqlDbType.VarChar;
                sqlParameter1.Value = (object)Telephone.SUBNO;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@PROVIDER";
                sqlParameter2.SqlDbType = SqlDbType.VarChar;
                sqlParameter2.Value = (object)Telephone.PROVIDER;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@DESCRIPTION";
                sqlParameter3.SqlDbType = SqlDbType.VarChar;
                sqlParameter3.Value = (object)Telephone.DESCRIPTION;
                paramColl[2] = sqlParameter3;
                SqlParameter sqlParameter4 = new SqlParameter();
                sqlParameter4.ParameterName = "@TYPE";
                sqlParameter4.SqlDbType = SqlDbType.VarChar;
                sqlParameter4.Value = (object)Telephone.TYPE;
                paramColl[3] = sqlParameter4;
                SqlParameter sqlParameter5 = new SqlParameter();
                sqlParameter5.ParameterName = "@LINETYPE";
                sqlParameter5.SqlDbType = SqlDbType.VarChar;
                sqlParameter5.Value = (object)Telephone.LINETYPE;
                paramColl[4] = sqlParameter5;
                
                SqlParameter sqlParameter6 = new SqlParameter();
                sqlParameter6.ParameterName = "@ACCOUNTNO";
                sqlParameter6.SqlDbType = SqlDbType.VarChar;
                sqlParameter6.Value = (object)Telephone.ACCOUNTNO;
                paramColl[5] = sqlParameter6;

                SqlParameter sqlParameter7 = new SqlParameter();
                sqlParameter7.ParameterName = "@ContractExpiry";
                sqlParameter7.SqlDbType = SqlDbType.DateTime;
                sqlParameter7.Value = (object)Telephone.ContractExpiry;
                paramColl[6] = sqlParameter7;

                DB.ExecuteStoredProc("sp_AddTelephone", paramColl);
                str1 = "succ";
            }
            catch (Exception ex)
            {
                string str2 = Convert.ToString((object)ex).Replace("'", " ");
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (2, 'ADD NUMBER', 'Fail','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (2, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str2 + "' ,'ADD NEW NUMBER')");
                str1 = "err";
            }
            return this.Json((object)new { myMessage = str1 }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateTelephone(TIS.Models.Telephone Telephone)
        {
            string empty = string.Empty;
            string str1;
            try
            {
                SqlParameter[] paramColl = new SqlParameter[8];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@ID";
                sqlParameter1.SqlDbType = SqlDbType.VarChar;
                sqlParameter1.Value = (object)Telephone.ID;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@SUBNO";
                sqlParameter2.SqlDbType = SqlDbType.VarChar;
                sqlParameter2.Value = (object)Telephone.SUBNO;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@PROVIDER";
                sqlParameter3.SqlDbType = SqlDbType.VarChar;
                sqlParameter3.Value = (object)Telephone.PROVIDER;
                paramColl[2] = sqlParameter3;
                SqlParameter sqlParameter4 = new SqlParameter();
                sqlParameter4.ParameterName = "@DESCRIPTION";
                sqlParameter4.SqlDbType = SqlDbType.VarChar;
                sqlParameter4.Value = (object)Telephone.DESCRIPTION;
                paramColl[3] = sqlParameter4;
                SqlParameter sqlParameter5 = new SqlParameter();
                sqlParameter5.ParameterName = "@TYPE";
                sqlParameter5.SqlDbType = SqlDbType.VarChar;
                sqlParameter5.Value = (object)Telephone.TYPE;
                paramColl[4] = sqlParameter5;
                SqlParameter sqlParameter6 = new SqlParameter();
                sqlParameter6.ParameterName = "@LINETYPE";
                sqlParameter6.SqlDbType = SqlDbType.VarChar;
                sqlParameter6.Value = (object)Telephone.LINETYPE;
                paramColl[5] = sqlParameter6;
                SqlParameter sqlParameter7 = new SqlParameter();
                sqlParameter7.ParameterName = "@ACCOUNTNO";
                sqlParameter7.SqlDbType = SqlDbType.VarChar;
                sqlParameter7.Value = (object)Telephone.ACCOUNTNO;
                paramColl[6] = sqlParameter7;

                SqlParameter sqlParameter8 = new SqlParameter();
                sqlParameter8.ParameterName = "@ContractExpiry";
                sqlParameter8.SqlDbType = SqlDbType.DateTime;
                sqlParameter8.Value = (object)Telephone.ContractExpiry;
                paramColl[7] = sqlParameter8;

                DB.ExecuteStoredProc("sp_UpdateTelephone", paramColl);
                str1 = "succ";
            }
            catch (Exception ex)
            {
                string str2 = Convert.ToString((object)ex).Replace("'", " ");
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (2, 'ADD NUMBER', 'Fail','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (2, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str2 + "' ,'UPDATE NUMBER')");
                str1 = "err";
            }
            return this.Json((object)new { myMessage = str1 }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteTelephone(TIS.Models.Telephone Telephone)
        {
            string empty = string.Empty;
            string str1;
            try
            {
                if (Convert.ToInt16(DB.GetValue("select count(*) from tblAssignNo where Subs_no_ID=" + (object)Telephone.ID ?? "").ToString()) == (short)0)
                {
                    DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (2, 'Update Telephone', 'Success','" + this.Session["EmpUID"] + "')");
                    DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (2, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),(select sub_no from tblSubscription_Number where ID=" + (object)Telephone.ID + "),'','Update Telephone')");
                    DB.ExecuteNonQuery("delete from tblSubscription_Number where ID=" + (object)Telephone.ID ?? "");
                    str1 = "succ";
                }
                else
                    str1 = "Exist";
            }
            catch (Exception ex)
            {
                string str2 = Convert.ToString((object)ex).Replace("'", " ");
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (2, 'DELETE NUMBER', 'Fail','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (2, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str2 + "' ,'DELETE NUMBER')");
                str1 = "err";
            }
            return this.Json((object)new { myMessage = str1 }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Assign(AssignNo Assign)
        {
            string empty = string.Empty;
            string str;
            try
            {
                SqlParameter[] paramColl = new SqlParameter[8];
                //SqlParameter[] paramColl = new SqlParameter[8];

                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@UID";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)Assign.UID;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@SubNoId";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)Assign.SubNoId;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@STARTDATE";
                sqlParameter3.SqlDbType = SqlDbType.DateTime;
                sqlParameter3.Value = (object)Assign.STARTDATE;
                paramColl[2] = sqlParameter3;
                SqlParameter sqlParameter4 = new SqlParameter();
                sqlParameter4.ParameterName = "@ENDDATE";
                sqlParameter4.SqlDbType = SqlDbType.DateTime;
                sqlParameter4.Value = (object)Assign.ENDDATE;
                paramColl[3] = sqlParameter4;
                SqlParameter sqlParameter5 = new SqlParameter();
                sqlParameter5.ParameterName = "@ALLOWANCELIMIT";
                sqlParameter5.SqlDbType = SqlDbType.Decimal;
                sqlParameter5.Value = (object)Assign.ALLOWANCELIMIT;
                paramColl[4] = sqlParameter5;
                SqlParameter sqlParameter6 = new SqlParameter();
                sqlParameter6.ParameterName = "@BUSINESSLIMIT";
                sqlParameter6.SqlDbType = SqlDbType.Decimal;
                sqlParameter6.Value = (object)Assign.BUSINESSLIMIT;
                paramColl[5] = sqlParameter6;
                SqlParameter sqlParameter7 = new SqlParameter();
                sqlParameter7.ParameterName = "@LINESTATUS";
                sqlParameter7.SqlDbType = SqlDbType.Int;
                sqlParameter7.Value = (object)Assign.LINESTATUS;

                //paramColl[6] = sqlParameter7;
                //SqlParameter sqlParameter8 = new SqlParameter();
                //sqlParameter8.ParameterName = "@LINESTATUSNAME";
                //sqlParameter8.SqlDbType = SqlDbType.Int;
                //sqlParameter8.Value = (object)Assign.LINESTATUSNAME;

                paramColl[6] = sqlParameter7;
                SqlParameter sqlParameter8 = new SqlParameter();
                sqlParameter8.ParameterName = "@CostCenterID";
                sqlParameter8.SqlDbType = SqlDbType.Int;
                sqlParameter8.Value = (object)Assign.CostCenterID;



                //paramColl[7] = sqlParameter8;
                //DB.ExecuteStoredProc("sp_AssignNumber", paramColl);

                paramColl[7] = sqlParameter8;
                DB.ExecuteStoredProc("sp_AssignNumber", paramColl);
                str = "succ";
            }
            catch (Exception ex)
            {
                str = "err";
            }
            return this.Json((object)new { myMessage = str }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateAssign(AssignNo Assign)
        {
            string empty = string.Empty;
            string str;
            try
            {
                SqlParameter[] paramColl = new SqlParameter[9];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@ID";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)Assign.ID;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@UID";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)Assign.UID;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@SubNoId";
                sqlParameter3.SqlDbType = SqlDbType.Int;
                sqlParameter3.Value = (object)Assign.SubNoId;
                paramColl[2] = sqlParameter3;
                SqlParameter sqlParameter4 = new SqlParameter();
                sqlParameter4.ParameterName = "@STARTDATE";
                sqlParameter4.SqlDbType = SqlDbType.DateTime;
                sqlParameter4.Value = (object)Assign.STARTDATE;
                paramColl[3] = sqlParameter4;
                SqlParameter sqlParameter5 = new SqlParameter();
                sqlParameter5.ParameterName = "@ENDDATE";
                sqlParameter5.SqlDbType = SqlDbType.DateTime;
                sqlParameter5.Value = (object)Assign.ENDDATE;
                paramColl[4] = sqlParameter5;
                SqlParameter sqlParameter6 = new SqlParameter();
                sqlParameter6.ParameterName = "@ALLOWANCELIMIT";
                sqlParameter6.SqlDbType = SqlDbType.Decimal;
                sqlParameter6.Value = (object)Assign.ALLOWANCELIMIT;
                paramColl[5] = sqlParameter6;
                SqlParameter sqlParameter7 = new SqlParameter();
                sqlParameter7.ParameterName = "@BUSINESSLIMIT";
                sqlParameter7.SqlDbType = SqlDbType.Decimal;
                sqlParameter7.Value = (object)Assign.BUSINESSLIMIT;
                paramColl[6] = sqlParameter7;
                SqlParameter sqlParameter8 = new SqlParameter();
                sqlParameter8.ParameterName = "@LINESTATUS";
                sqlParameter8.SqlDbType = SqlDbType.Int;
                sqlParameter8.Value = (object)Assign.LINESTATUS;
                paramColl[7] = sqlParameter8;
                SqlParameter sqlParameter9 = new SqlParameter();
                sqlParameter9.ParameterName = "@CostCenterID";
                sqlParameter9.SqlDbType = SqlDbType.Int;
                sqlParameter9.Value = (object)Assign.CostCenterID;
                paramColl[8] = sqlParameter9;
                DB.ExecuteStoredProc("sp_UpdateAssignNumber", paramColl);
                str = "succ";
            }
            catch (Exception ex)
            {
                str = "err";
            }
            return this.Json((object)new { myMessage = str }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteAssign(AssignNo Assign)
        {
            string empty = string.Empty;
            string str;
            try
            {
                DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (2, 'Delete Assign No.', 'Success','" + this.Session["EmpUID"] + "')");
                DB.ExecuteNonQuery("delete from tblAssignNo where ID=" + (object)Assign.ID ?? "");
                str = "succ";
            }
            catch (Exception ex)
            {
                str = "err";
            }
            return this.Json((object)new { myMessage = str }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDelegate()
        {
            int int32_1 = Convert.ToInt32(this.Session["CountryID"].ToString());
            int int32_2 = Convert.ToInt32(this.Session["EmpRoleID"].ToString());
            try
            {
                SqlParameter[] paramColl = new SqlParameter[3];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@CountryID";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)int32_1;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@RoleID";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)int32_2;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@Command";
                sqlParameter3.SqlDbType = SqlDbType.Int;
                sqlParameter3.Value = (object)1;
                paramColl[2] = sqlParameter3;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetDelegate", paramColl);
                List<Delg> delgList = new List<Delg>();
                DataTable table1 = dataSet.Tables[0];
                if (table1.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table1.Rows)
                        delgList.Add(new Delg()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            managerid = Convert.ToInt32(row["ManagerID"].ToString()),
                            ManName = row["ManagerName"].ToString(),
                            secid = Convert.ToInt32(row["SecrateryID"].ToString()),
                            SecName = row["SecrateryName"].ToString(),
                            idt = Convert.ToBoolean(row["CanIdentify"].ToString()),
                            app = Convert.ToBoolean(row["CanApprove"].ToString())
                        });
                }
                List<Employee> employeeList = new List<Employee>();
                DataTable table2 = dataSet.Tables[1];
                if (table2.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table2.Rows)
                        employeeList.Add(new Employee()
                        {
                            EmpId = Convert.ToInt32(row["UID"].ToString()),
                            EmpNo = row["EMPLOYEENO"].ToString(),
                            EmpName = row["NAME"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    dtSec = delgList,
                    EmpList = employeeList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult GetSecretary()
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@Command";
                sqlParameter.SqlDbType = SqlDbType.Int;
                sqlParameter.Value = (object)2;
                paramColl[0] = sqlParameter;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetDelegate", paramColl);
                List<Delg> delgList = new List<Delg>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        delgList.Add(new Delg()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            managerid = Convert.ToInt32(row["ManagerID"].ToString()),
                            ManName = row["ManagerName"].ToString(),
                            secid = Convert.ToInt32(row["SecrateryID"].ToString()),
                            SecName = row["SecrateryName"].ToString(),
                            idt = Convert.ToBoolean(row["CanIdentify"].ToString()),
                            app = Convert.ToBoolean(row["CanApprove"].ToString())
                        });
                }
                return this.Json((object)new { dtSec = delgList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult SaveDelegate(Delg dlg)
        {
            SqlParameter[] paramColl = new SqlParameter[5];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@Command";
            sqlParameter1.SqlDbType = SqlDbType.Int;
            sqlParameter1.Value = (object)1;
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@secid";
            sqlParameter2.SqlDbType = SqlDbType.Int;
            sqlParameter2.Value = (object)dlg.secid;
            paramColl[1] = sqlParameter2;
            SqlParameter sqlParameter3 = new SqlParameter();
            sqlParameter3.ParameterName = "@managerid";
            sqlParameter3.SqlDbType = SqlDbType.Int;
            sqlParameter3.Value = (object)dlg.managerid;
            paramColl[2] = sqlParameter3;
            SqlParameter sqlParameter4 = new SqlParameter();
            sqlParameter4.ParameterName = "@app";
            sqlParameter4.SqlDbType = SqlDbType.Bit;
            sqlParameter4.Value = (object)dlg.app;
            paramColl[3] = sqlParameter4;
            SqlParameter sqlParameter5 = new SqlParameter();
            sqlParameter5.ParameterName = "@idt";
            sqlParameter5.SqlDbType = SqlDbType.Bit;
            sqlParameter5.Value = (object)dlg.idt;
            paramColl[4] = sqlParameter5;
            DB.ExecuteStoredProc("sp_ManageDelegate", paramColl);
            return this.Json((object)new
            {
                myMessage = "Added Sucessfully"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateDelegate(Delg dlg)
        {
            SqlParameter[] paramColl = new SqlParameter[6];
            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@Command";
            sqlParameter1.SqlDbType = SqlDbType.Int;
            sqlParameter1.Value = (object)2;
            paramColl[0] = sqlParameter1;
            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@ID";
            sqlParameter2.SqlDbType = SqlDbType.Int;
            sqlParameter2.Value = (object)dlg.ID;
            paramColl[1] = sqlParameter2;
            SqlParameter sqlParameter3 = new SqlParameter();
            sqlParameter3.ParameterName = "@secid";
            sqlParameter3.SqlDbType = SqlDbType.Int;
            sqlParameter3.Value = (object)dlg.secid;
            paramColl[2] = sqlParameter3;
            SqlParameter sqlParameter4 = new SqlParameter();
            sqlParameter4.ParameterName = "@managerid";
            sqlParameter4.SqlDbType = SqlDbType.Int;
            sqlParameter4.Value = (object)dlg.managerid;
            paramColl[3] = sqlParameter4;
            SqlParameter sqlParameter5 = new SqlParameter();
            sqlParameter5.ParameterName = "@app";
            sqlParameter5.SqlDbType = SqlDbType.Bit;
            sqlParameter5.Value = (object)dlg.app;
            paramColl[4] = sqlParameter5;
            SqlParameter sqlParameter6 = new SqlParameter();
            sqlParameter6.ParameterName = "@idt";
            sqlParameter6.SqlDbType = SqlDbType.Bit;
            sqlParameter6.Value = (object)dlg.idt;
            paramColl[5] = sqlParameter6;
            DB.ExecuteStoredProc("sp_ManageDelegate", paramColl);
            return this.Json((object)new
            {
                myMessage = "Updated Sucessfully"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteDelegate(Delg dlg)
        {
            string empty = string.Empty;
            string str;
            try
            {
                SqlParameter[] sqlParameterArray = new SqlParameter[2];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@Command";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)3;
                sqlParameterArray[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@ID";
                sqlParameter2.SqlDbType = SqlDbType.Int;
                sqlParameter2.Value = (object)dlg.ID;
                sqlParameterArray[1] = sqlParameter2;
                SqlParameter[] paramColl = sqlParameterArray;
                str = "Deleted Successfully";
                DB.ExecuteStoredProc("sp_ManageDelegate", paramColl);
            }
            catch (Exception ex)
            {
                str = ex.ToString();
            }
            return this.Json((object)new { myMessage = str }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPkgData()
        {
            try
            {
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetPkgData");
                List<Provider> providerList = new List<Provider>();
                DataTable table1 = dataSet.Tables[0];
                if (table1.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table1.Rows)
                        providerList.Add(new Provider()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            NAME = row["Name"].ToString()
                        });
                }
                List<TIS.Models.Package> packageList = new List<TIS.Models.Package>();
                DataTable table2 = dataSet.Tables[1];
                if (table2.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table2.Rows)
                        packageList.Add(new TIS.Models.Package()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            PkgName = row["PKGNAME"].ToString(),
                            PkgDesc = row["DESCRIPTION"].ToString(),
                            StartDate = Convert.ToDateTime(row["STARTDATE"].ToString())
                        });
                }
                return this.Json((object)new
                {
                    dtPro = providerList,
                    dtPkg = packageList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult GetPackage()
        {
            try
            {
                DataSet data = DB.GetData("Select * from TBL_PKG_MASTER");
                List<TIS.Models.Package> packageList = new List<TIS.Models.Package>();
                if (data != null)
                {
                    DataTable table = data.Tables[0];
                    if (table.Rows.Count > 0)
                    {
                        foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                            packageList.Add(new TIS.Models.Package()
                            {
                                ID = Convert.ToInt32(row["ID"].ToString()),
                                PkgName = row["PKGNAME"].ToString(),
                                PkgDesc = row["DESCRIPTION"].ToString(),
                                StartDate = Convert.ToDateTime(row["STARTDATE"].ToString())
                            });
                    }
                }
                return this.Json((object)new { dtPkg = packageList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult FillTransType(TIS.Models.Package Pkg)
        {
            DataTable dataTable = new DataTable();
            DataSet data = DB.GetData("SELECT ID, PKG_CALLTYPE FROM [TBL_PKGCALLTYPE] WHERE PROVIDER=" + (object)Pkg.ProviderID + " order by PKG_CALLTYPE");
            if (data != null)
                dataTable = data.Tables[0];
            List<TIS.Models.Package> packageList = new List<TIS.Models.Package>();
            foreach (DataRow row in (InternalDataCollectionBase)dataTable.Rows)
                packageList.Add(new TIS.Models.Package()
                {
                    TransID = Convert.ToInt32(row["ID"].ToString()),
                    TransName = row["PKG_CALLTYPE"].ToString()
                });
            return this.Json((object)new
            {
                dtTransType = packageList
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FillDesc(TIS.Models.Package Pkg)
        {
            DataTable dataTable = new DataTable();
            DataSet data = DB.GetData("SELECT ID, CALLTYPEDESC FROM [TBL_PKGCALLDESC] WHERE CALLTYPEID='" + (object)Pkg.TransID + "' order by CALLTYPEDESC");
            if (data != null)
                dataTable = data.Tables[0];
            List<TIS.Models.Package> packageList = new List<TIS.Models.Package>();
            foreach (DataRow row in (InternalDataCollectionBase)dataTable.Rows)
                packageList.Add(new TIS.Models.Package()
                {
                    DescID = Convert.ToInt32(row["ID"].ToString()),
                    DescName = row["CALLTYPEDESC"].ToString()
                });
            JsonResult jsonResult = this.Json((object)new
            {
                dtdesc = packageList
            }, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = new int?(int.MaxValue);
            return jsonResult;
        }

        public JsonResult AddPackage(List<TIS.Models.Package> Detail, TIS.Models.Package Master)
        {
            for (int index = 0; index < Detail.Count; ++index)
            {
                SqlParameter[] paramColl = new SqlParameter[10];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@Count";
                sqlParameter1.SqlDbType = SqlDbType.VarChar;
                sqlParameter1.Value = (object)index;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@PkgName";
                sqlParameter2.SqlDbType = SqlDbType.VarChar;
                sqlParameter2.Value = (object)Master.PkgName;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@PkgDesc";
                sqlParameter3.SqlDbType = SqlDbType.VarChar;
                sqlParameter3.Value = (object)Master.PkgDesc;
                paramColl[2] = sqlParameter3;
                SqlParameter sqlParameter4 = new SqlParameter();
                sqlParameter4.ParameterName = "@ProviderID";
                sqlParameter4.SqlDbType = SqlDbType.VarChar;
                sqlParameter4.Value = (object)Detail[index].ProviderID;
                paramColl[3] = sqlParameter4;
                SqlParameter sqlParameter5 = new SqlParameter();
                sqlParameter5.ParameterName = "@TransID";
                sqlParameter5.SqlDbType = SqlDbType.VarChar;
                sqlParameter5.Value = (object)Detail[index].TransID;
                paramColl[4] = sqlParameter5;
                SqlParameter sqlParameter6 = new SqlParameter();
                sqlParameter6.ParameterName = "@DescID";
                sqlParameter6.SqlDbType = SqlDbType.VarChar;
                sqlParameter6.Value = (object)Detail[index].DescID;
                paramColl[5] = sqlParameter6;
                SqlParameter sqlParameter7 = new SqlParameter();
                sqlParameter7.ParameterName = "@IsAll";
                sqlParameter7.SqlDbType = SqlDbType.VarChar;
                sqlParameter7.Value = (object)Detail[index].IsAll;
                paramColl[6] = sqlParameter7;
                SqlParameter sqlParameter8 = new SqlParameter();
                sqlParameter8.ParameterName = "@ExpType";
                sqlParameter8.SqlDbType = SqlDbType.VarChar;
                sqlParameter8.Value = (object)Detail[index].ExpType;
                paramColl[7] = sqlParameter8;
                SqlParameter sqlParameter9 = new SqlParameter();
                sqlParameter9.ParameterName = "@Amount";
                sqlParameter9.SqlDbType = SqlDbType.VarChar;
                sqlParameter9.Value = (object)Detail[index].Amount;
                paramColl[8] = sqlParameter9;
                SqlParameter sqlParameter10 = new SqlParameter();
                sqlParameter10.ParameterName = "@StartDate";
                sqlParameter10.SqlDbType = SqlDbType.VarChar;
                sqlParameter10.Value = (object)Master.StartDate;
                paramColl[9] = sqlParameter10;
                DB.ExecuteStoredProc("sp_AddPackage", paramColl);
            }
            return this.Json((object)new
            {
                myMessage = "Added Sucessfully"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdatePackage(List<TIS.Models.Package> Detail, TIS.Models.Package Master)
        {
            for (int index = 0; index < Detail.Count; ++index)
            {
                SqlParameter[] paramColl = new SqlParameter[11];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@Count";
                sqlParameter1.SqlDbType = SqlDbType.VarChar;
                sqlParameter1.Value = (object)index;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@PkgID";
                sqlParameter2.SqlDbType = SqlDbType.VarChar;
                sqlParameter2.Value = (object)Master.ID;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@PkgName";
                sqlParameter3.SqlDbType = SqlDbType.VarChar;
                sqlParameter3.Value = (object)Master.PkgName;
                paramColl[2] = sqlParameter3;
                SqlParameter sqlParameter4 = new SqlParameter();
                sqlParameter4.ParameterName = "@PkgDesc";
                sqlParameter4.SqlDbType = SqlDbType.VarChar;
                sqlParameter4.Value = (object)Master.PkgDesc;
                paramColl[3] = sqlParameter4;
                SqlParameter sqlParameter5 = new SqlParameter();
                sqlParameter5.ParameterName = "@ProviderID";
                sqlParameter5.SqlDbType = SqlDbType.VarChar;
                sqlParameter5.Value = (object)Detail[index].ProviderID;
                paramColl[4] = sqlParameter5;
                SqlParameter sqlParameter6 = new SqlParameter();
                sqlParameter6.ParameterName = "@TransID";
                sqlParameter6.SqlDbType = SqlDbType.VarChar;
                sqlParameter6.Value = (object)Detail[index].TransID;
                paramColl[5] = sqlParameter6;
                SqlParameter sqlParameter7 = new SqlParameter();
                sqlParameter7.ParameterName = "@DescID";
                sqlParameter7.SqlDbType = SqlDbType.VarChar;
                sqlParameter7.Value = (object)Detail[index].DescID;
                paramColl[6] = sqlParameter7;
                SqlParameter sqlParameter8 = new SqlParameter();
                sqlParameter8.ParameterName = "@IsAll";
                sqlParameter8.SqlDbType = SqlDbType.VarChar;
                sqlParameter8.Value = (object)Detail[index].IsAll;
                paramColl[7] = sqlParameter8;
                SqlParameter sqlParameter9 = new SqlParameter();
                sqlParameter9.ParameterName = "@ExpType";
                sqlParameter9.SqlDbType = SqlDbType.VarChar;
                sqlParameter9.Value = (object)Detail[index].ExpType;
                paramColl[8] = sqlParameter9;
                SqlParameter sqlParameter10 = new SqlParameter();
                sqlParameter10.ParameterName = "@Amount";
                sqlParameter10.SqlDbType = SqlDbType.VarChar;
                sqlParameter10.Value = (object)Detail[index].Amount;
                paramColl[9] = sqlParameter10;
                SqlParameter sqlParameter11 = new SqlParameter();
                sqlParameter11.ParameterName = "@StartDate";
                sqlParameter11.SqlDbType = SqlDbType.VarChar;
                sqlParameter11.Value = (object)Master.StartDate;
                paramColl[10] = sqlParameter11;
                DB.ExecuteStoredProc("sp_UpdatePackage", paramColl);
            }
            return this.Json((object)new
            {
                myMessage = "Added Sucessfully"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeletePackage(TIS.Models.Package Pkg)
        {
            SqlParameter[] paramColl = new SqlParameter[1];
            SqlParameter sqlParameter = new SqlParameter();
            sqlParameter.ParameterName = "@ID";
            sqlParameter.SqlDbType = SqlDbType.Int;
            sqlParameter.Value = (object)Pkg.ID;
            paramColl[0] = sqlParameter;
            DB.ExecuteStoredProc("sp_DeletePackage", paramColl);
            return this.Json((object)new
            {
                Message = "Deleted Sucessfully"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPkgDetail(TIS.Models.Package Pkg)
        {
            SqlParameter[] paramColl = new SqlParameter[1];
            SqlParameter sqlParameter = new SqlParameter();
            sqlParameter.ParameterName = "@ID";
            sqlParameter.SqlDbType = SqlDbType.VarChar;
            sqlParameter.Value = (object)Pkg.ID;
            paramColl[0] = sqlParameter;
            DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetPkgDetail", paramColl);
            List<TIS.Models.Package> packageList = new List<TIS.Models.Package>();
            DataTable table = dataSet.Tables[0];
            if (table.Rows.Count > 0)
            {
                foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                    packageList.Add(new TIS.Models.Package()
                    {
                        ID = Convert.ToInt32(row["ID"].ToString()),
                        ProviderID = Convert.ToInt32(row["PROVIDER"].ToString()),
                        ProviderName = row["ProviderName"].ToString(),
                        TransID = Convert.ToInt32(row["CALLTYPEID"].ToString()),
                        TransName = row["TransName"].ToString(),
                        DescID = Convert.ToInt32(row["CALLDESCID"].ToString()),
                        DescName = row["DescName"].ToString(),
                        ExpType = Convert.ToInt32(row["EXP_TYPE"].ToString()),
                        Amount = Convert.ToDouble(row["AMT"].ToString())
                    });
            }
            return this.Json((object)new
            {
                PkgDetail = packageList
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveContact(Contact value)
        {
            if (value.ExName != null)
            {
                DB.ExecuteNonQuery(string.Format("Update tblContact set [Name] = '" + value.Name + "' where [Uid] = '" + (object)value.Uid + "'"));
                return this.Json((object)new
                {
                    Message = "Contact Updated Sucessfully"
                }, JsonRequestBehavior.AllowGet);
            }
            DB.ExecuteNonQuery(string.Format("insert into tblContact ([DialledNo],[Name],[Uid]) values ('" + value.DialledNo + "', '" + value.Name + "', '" + (object)value.Uid + "')"));
            return this.Json((object)new
            {
                Message = "Contact Saved Sucessfully"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDataRoaming()
        {
            try
            {
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetDataRoaming");
                List<DataRoaming> dataRoamingList = new List<DataRoaming>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        dataRoamingList.Add(new DataRoaming()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            Country = row["Country"].ToString(),
                            Operator = row["Operator"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    dtCountry = dataRoamingList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult AddDataRoaming(DataRoaming value)
        {
            string empty = string.Empty;
            string str;
            try
            {
                SqlParameter[] paramColl = new SqlParameter[2];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@Country";
                sqlParameter1.SqlDbType = SqlDbType.VarChar;
                sqlParameter1.Value = (object)value.Country;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@Operator";
                sqlParameter2.SqlDbType = SqlDbType.VarChar;
                sqlParameter2.Value = (object)value.Operator;
                paramColl[1] = sqlParameter2;
                DB.ExecuteStoredProc("sp_AddDataRoaming", paramColl);
                str = "Success";
            }
            catch (Exception ex)
            {
                Convert.ToString((object)ex).Replace("'", " ");
                str = "Error";
            }
            return this.Json((object)new { myMessage = str }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateDataRoaming(DataRoaming value)
        {
            string empty = string.Empty;
            string str;
            try
            {
                SqlParameter[] paramColl = new SqlParameter[3];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@ID";
                sqlParameter1.SqlDbType = SqlDbType.VarChar;
                sqlParameter1.Value = (object)value.ID;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@Country";
                sqlParameter2.SqlDbType = SqlDbType.VarChar;
                sqlParameter2.Value = (object)value.Country;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@Operator";
                sqlParameter3.SqlDbType = SqlDbType.VarChar;
                sqlParameter3.Value = (object)value.Operator;
                paramColl[2] = sqlParameter3;
                DB.ExecuteStoredProc("sp_UpdateDataRoaming", paramColl);
                str = "Success";
            }
            catch (Exception ex)
            {
                Convert.ToString((object)ex).Replace("'", " ");
                str = "Error";
            }
            return this.Json((object)new { myMessage = str }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteDataRoaming(DataRoaming value)
        {
            string empty = string.Empty;
            string str;
            try
            {
                DB.ExecuteNonQuery("Delete from tblDataRoaming where ID=" + (object)value.ID ?? "");
                str = "Success";
            }
            catch (Exception ex)
            {
                Convert.ToString((object)ex).Replace("'", " ");
                str = "Error";
            }
            return this.Json((object)new { myMessage = str }, JsonRequestBehavior.AllowGet);
        }
    }
}
