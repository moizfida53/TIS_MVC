// Decompiled with JetBrains decompiler
// Type: TIS.Controllers.ImportController
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using Microsoft.SqlServer.Server;
using System;
using System.Collections.Generic;
using System.Configuration.Provider;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.IO;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;
using TIS.Helper;
using TIS.Models;

namespace TIS.Controllers
{
    public class ImportController : Controller
    {
        private DataSet m_Bill_Data;
        private DataTable dtImport;

        public ActionResult Index() => this.Session["EmpLoginName"] == null ? (ActionResult)this.View("AccessDenied") : (ActionResult)this.View("ImportInvoice");

        public ActionResult UnAssigned() => this.Session["EmpLoginName"] == null ? (ActionResult)this.View("AccessDenied") : (ActionResult)this.View("UnAssignedInvoice");

        public JsonResult GetUploadHistory()
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
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetUploadHistory", paramColl);
                List<TIS.Models.Upload> uploadList = new List<TIS.Models.Upload>();
                DataTable table = dataSet.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        uploadList.Add(new TIS.Models.Upload()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            FileName = row["UploadFileName"].ToString(),
                            BillDate = Convert.ToDateTime(row["BillDate"].ToString()),
                            UploadDate = Convert.ToDateTime(row["UploadDate"].ToString()),
                            ProviderName = row["Name"].ToString(),
                            ProviderID = Convert.ToInt32(row["Provider"].ToString()),
                            BillAmount = row["BillAmount"].ToString()
                        });
                }
                int IsDeleteButShow = 1;
                if (dataSet.Tables.Count > 1)
                {
                    IsDeleteButShow = Convert.ToInt32(dataSet.Tables[1].Rows[0]["DeleteBut"]);
                }

                return this.Json((object)new
                {
                    UploadList = uploadList,
                    IsDeleteButShow = IsDeleteButShow,
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "GetUploadHistory", Uid);
                return this.Json((object)"'Fail':'true'");
            }
        }

        public ActionResult Upload(HttpPostedFileBase[] fileToUpload)
        {
            try
            {
                foreach (HttpPostedFileBase httpPostedFileBase in fileToUpload)
                {
                    string filename = Path.Combine(this.Server.MapPath("~/Bills/"), httpPostedFileBase.FileName);
                    httpPostedFileBase.SaveAs(filename);
                }
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "Upload", Uid);
            }
            return (ActionResult)this.View("ImportInvoice");
        }

        public JsonResult FillSheet(TIS.Models.Upload File)
        {
            try
            {
                DataTable excelSheetNames = this.GetExcelSheetNames(AppDomain.CurrentDomain.BaseDirectory + "Bills\\" + Path.GetFileName(File.FileName));
                List<TIS.Models.Upload> uploadList = new List<TIS.Models.Upload>();
                if (excelSheetNames.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)excelSheetNames.Rows)
                        uploadList.Add(new TIS.Models.Upload()
                        {
                            SheetName = row["TABLE_NAME"].ToString()
                        });
                }
                return this.Json((object)new { dtSheet = uploadList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "FillSheet", Uid);
                return this.Json((object)new { Message = "Fail", dtSheet ="" }, JsonRequestBehavior.AllowGet);
            }
        }

        private DataTable GetExcelSheetNames(string FilePath)
        {
            OleDbConnection oleDbConnection = (OleDbConnection)null;
            try
            {
                oleDbConnection = !Path.GetExtension(FilePath).Equals(".xls") ?
                    (!Path.GetExtension(FilePath).Equals(".mde") ?
                    (!Path.GetExtension(FilePath).Equals(".mdb") ?
                    new OleDbConnection(string.Format("Provider=Microsoft.ACE.OLEDB.12.0; Data Source={0};Extended Properties='Excel 12.0 XML;HRD=YES;IMEX=1;';", (object)FilePath))
                    : new OleDbConnection(string.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Persist Security Info=False;",
                    (object)FilePath)))
                    : new OleDbConnection(string.Format("Provider=Microsoft.Jet.OLEDB.4.0;Data Source={0};", (object)FilePath)))
                    : new OleDbConnection(string.Format("Provider=Microsoft.Jet.OLEDB.4.0; Data Source={0};Extended Properties=Excel 8.0;",
                    (object)FilePath));

                oleDbConnection.Open();
                return oleDbConnection.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, (object[])null) ?? (DataTable)null;
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "GetExcelSheetNames", Uid);
                return (DataTable)null;
            }
            finally
            {
                if (oleDbConnection != null)
                {
                    oleDbConnection.Close();
                    oleDbConnection.Dispose();
                }
            }
        }

        public JsonResult UploadFile(TIS.Models.Upload File)
        {
            try
            {
                File.DbBased = "False";

                if (File.DbBased == "False")
                {

                    int year = File.Year;
                    int month1 = File.Month;
                    int providerId = File.ProviderID;
                    int month2 = month1;
                    DateTime dateTime = new DateTime(year, month2, 1);
                    dateTime = dateTime.AddMonths(1);
                    this.Session["m_CurrentImportBillDate"] = (object)dateTime.AddDays(-1.0);
                    this.Session["m_Provider"] = (object)providerId;
                    string str1 = AppDomain.CurrentDomain.BaseDirectory + "Bills\\";
                    string sheetName = File.SheetName;
                    string fileName = File.FileName;
                    this.Session["m_CurrentImportFile"] = (object)fileName;
                    //string str2 = this.UploadZAINBills(fileName, str1, sheetName, providerId.ToString()).ToString("");
                    //string str2 = DB.GetValue("Select ROUND(SUM(amount), 3) from tblimport");
                    this.importFirst(fileName, str1, sheetName);
                    DataTable dataTable = this.BindGrid();
                    List<Import> importList = new List<Import>();
                    if (dataTable.Rows.Count > 0)
                    {
                        foreach (DataRow row in (InternalDataCollectionBase)dataTable.Rows)
                            importList.Add(new Import()
                            {
                                ID = Convert.ToInt32(row["ID"].ToString()),
                                SUB_NO = row["SUB_NO"].ToString(),
                                BILLDATE = Convert.ToDateTime(row["BILLDATE"].ToString()),
                                CALLDATE = row["CALLDATE"].ToString(),
                                TRANS_TYPE = row["TRANS_TYPE"].ToString(),
                                DESCRIPTION = row["DESCRIPTION"].ToString(),
                                AMOUNT = row["AMOUNT"].ToString(),
                                DURATION = row["DURATION"].ToString(),
                                CALLTIME = row["CALLTIME"].ToString()
                            });
                    }
                    string str2 = DB.GetValue("Select ROUND(SUM(amount), 3) from tblimport");
                    JsonResult jsonResult = this.Json((object)new
                    {
                        MyMessage = "Success",
                        BillAmount = str2,
                        gridData = importList
                    }, JsonRequestBehavior.AllowGet);
                    jsonResult.MaxJsonLength = new int?(int.MaxValue);
                    return jsonResult;
                }
                DataSet data = DB.GetData("Select * from tblprovider where ID = '" + (object)File.ProviderID + "'");
                string sqlConstr = data.Tables[0].Rows[0][15].ToString();
                string View = data.Tables[0].Rows[0][16].ToString();
                string str3 = data.Tables[0].Rows[0][1].ToString();
                int month = File.Month;
                int year1 = File.Year;
                int providerId1 = File.ProviderID;
                DateTime dateTime1 = new DateTime(year1, month, 1);
                dateTime1 = dateTime1.AddMonths(1);
                this.Session["m_CurrentImportBillDate"] = (object)dateTime1.AddDays(-1.0);
                this.Session["m_Provider"] = (object)providerId1;
                this.Session["m_ProviderName"] = (object)str3;
                this.importDataFirst(View, sqlConstr, month, year1);
                string str4 = DB.GetValue("Select ROUND(SUM(amount), 3) from tblimport");
                DataTable dataTable1 = this.BindGrid();
                List<Import> importList1 = new List<Import>();
                if (dataTable1.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)dataTable1.Rows)
                        importList1.Add(new Import()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            SUB_NO = row["SUB_NO"].ToString(),
                            BILLDATE = Convert.ToDateTime(row["BILLDATE"].ToString()),
                            CALLDATE = row["CALLDATE"].ToString(),
                            TRANS_TYPE = row["TRANS_TYPE"].ToString(),
                            DESCRIPTION = row["DESCRIPTION"].ToString(),
                            AMOUNT = row["AMOUNT"].ToString(),
                            DURATION = row["DURATION"].ToString(),
                            CALLTIME = row["CALLTIME"].ToString()
                        });
                }
                JsonResult jsonResult1 = this.Json((object)new
                {
                    MyMessage = "Success",
                    BillAmount = str4,
                    gridData = importList1
                }, JsonRequestBehavior.AllowGet);
                jsonResult1.MaxJsonLength = new int?(int.MaxValue);
                return jsonResult1;
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "UploadFile", Uid);
                throw;
            }

        }

        //public double UploadZAINBills(
        //  string fileName,
        //  string filePath,
        //  string fnSheetName,
        //  string Provider)
        //{
        //    try
        //    {
        //        this.m_Bill_Data = ImportController.UploadZainBills(filePath + fileName, fnSheetName);
        //        double num1 = 0.0;
        //        double num2 = 0.0;
        //        double num3 = 0.0;
        //        string cmdText = string.Format("select * from tblProvider where ID=" + Provider);
        //        string str1 = "Amount (KD)";
        //        SqlConnection sqlConnection = new SqlConnection(DB.GetDBConn());
        //        sqlConnection.Open();
        //        SqlConnection connection = sqlConnection;
        //        SqlDataReader sqlDataReader = new SqlCommand(cmdText, connection).ExecuteReader();
        //        while (sqlDataReader.Read())
        //            str1 = Convert.ToString(sqlDataReader["excel_col8"]);
        //        sqlDataReader.Close();
        //        sqlConnection.Close();
        //        int columnIndex1 = 0;
        //        if (Path.GetExtension(fileName) == ".mde")
        //        {
        //            for (int index = 0; index < this.m_Bill_Data.Tables[0].Columns.Count; ++index)
        //            {
        //                string str2 = Convert.ToString(this.m_Bill_Data.Tables[0].Columns[index].ColumnName);
        //                if (str2 != "" && str1 == str2)
        //                {
        //                    columnIndex1 = index;
        //                    break;
        //                }
        //            }
        //        }
        //        else
        //        {
        //            for (int columnIndex2 = 0; columnIndex2 < this.m_Bill_Data.Tables[0].Columns.Count; ++columnIndex2)
        //            {
        //                string str3 = Convert.ToString(this.m_Bill_Data.Tables[0].Rows[0][columnIndex2]);
        //                if (str3 != "" && str1 == str3)
        //                {
        //                    columnIndex1 = columnIndex2;
        //                    break;
        //                }
        //            }
        //        }
        //        for (int index = 1; index < this.m_Bill_Data.Tables[0].Rows.Count; ++index)
        //        {
        //            string str4 = Convert.ToString(this.m_Bill_Data.Tables[0].Rows[index][0]);
        //            string str5 = Convert.ToString(this.m_Bill_Data.Tables[0].Rows[index][columnIndex1].ToString() + "0");
        //            if (str4 != "")
        //            {
        //                if (str5 != "0")
        //                    num1 += Convert.ToDouble(this.m_Bill_Data.Tables[0].Rows[index][columnIndex1]);
        //                else
        //                    num2 += Convert.ToDouble(this.m_Bill_Data.Tables[0].Rows[index][columnIndex1].ToString() + "0");
        //                num3 = num1 + num2;
        //            }
        //        }
        //        return Math.Round(num3, 3);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}

        //public static DataSet UploadZainBills(string FilePath, string fnSheetName)
        //{
        //    OleDbConnection oleDbConnection = new OleDbConnection(Path.GetExtension(FilePath) == ".xlsx" || Path.GetExtension(FilePath) == ".XLSX" ? string.Format("Provider=Microsoft.ACE.OLEDB.12.0; Data Source={0};Extended Properties='Excel 12.0 Xml;HDR=No;IMEX=1';", (object)FilePath) : (!(Path.GetExtension(FilePath) == ".mde") ? string.Format("Provider=Microsoft.ACE.OLEDB.12.0; Data Source={0};Extended Properties='Excel 8.0;HDR=YES;IMEX=1';", (object)FilePath) : string.Format("Provider=Microsoft.Jet.OLEDB.4.0;data source={0};User Id=admin;Password=;", (object)FilePath)));
        //    string selectCommandText = string.Format("select * from [{0}]", (object)fnSheetName);
        //    DataSet dataSet = new DataSet();
        //    OleDbConnection selectConnection = oleDbConnection;
        //    new OleDbDataAdapter(selectCommandText, selectConnection).Fill(dataSet);
        //    return dataSet;
        //}

        private void importFirst(string fileName, string sdir, string ssh)
        {
            try
            {
                int int32 = Convert.ToInt32("0" + DB.GetValue("select max(ID) from tblcallrecord"));
                DB.ExecuteNonQuery("delete from tblImport");
                DB.ExecuteNonQuery(" DBCC CHECKIDENT (tblIMPORT, RESEED, " + (object)int32 + ")");
                DataTable dataTable = new DataTable();
                string dbConn = DB.GetDBConn();
                if (Path.GetExtension(fileName).Equals(".xls"))
                {
                    string selectConnectionString = string.Format("Provider=Microsoft.ACE.OLEDB.12.0; data source={0}; Extended Properties=Excel 8.0;HDR=YES", (object)(sdir + fileName));
                    new OleDbDataAdapter("SELECT *,'" + ((DateTime)this.Session["m_CurrentImportBillDate"]).ToString("yyyy-MM-dd") + "' as BillDateNew FROM [" + ssh + "]", selectConnectionString).Fill(dataTable);
                }
                else if (Path.GetExtension(fileName).Equals(".mde"))
                {
                    string selectConnectionString = string.Format("Provider=Microsoft.Jet.OLEDB.4.0;data source={0} ;User Id=admin;Password=;", (object)(sdir + fileName));
                    new OleDbDataAdapter("SELECT *,'" + ((DateTime)this.Session["m_CurrentImportBillDate"]).ToString("yyyy-MM-dd") + "' as BillDateNew FROM [" + ssh + "]", selectConnectionString).Fill(dataTable);
                }
                else
                {
                    try
                    {
                        string selectConnectionString = string.Format("Provider=Microsoft.ACE.OLEDB.12.0; Data Source={0};Extended Properties='Excel 12.0 XML;HDR=YES;IMEX=1;';", (object)(sdir + fileName));
                        new OleDbDataAdapter("SELECT *,'" + ((DateTime)this.Session["m_CurrentImportBillDate"]).ToString("yyyy-MM-dd") + "' as BillDateNew FROM [" + ssh + "]", selectConnectionString).Fill(dataTable);
                    }
                    catch (Exception ex)
                    {
                        string str = Convert.ToString((object)ex);
                        int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                        AuditTrail(str, "importFirst", Uid);
                        throw;
                    }
                }
                string[] strArray = new string[9]
                {
        "SUB_NO",
        "BILLDATE",
        "CALLDATE",
        "TRANS_TYPE",
        "DESCRIPTION",
        "CALLTIME",
        "DURATION",
        "AMOUNT",
        "BILLNUMBER"
                };
                DataSet data = DB.GetData("select [excel_col1],'BillDateNew' as [excel_col2],[excel_col3],[excel_col4],[excel_col5],[excel_col6],[excel_col7],[excel_col8],[excel_col9] from tblProvider where id=" + (object)(int)this.Session["m_Provider"]);
                using (SqlConnection connection = new SqlConnection(dbConn))
                {
                    connection.Open();
                    using (SqlBulkCopy sqlBulkCopy = new SqlBulkCopy(connection))
                    {
                        sqlBulkCopy.BulkCopyTimeout = 500;
                        //sqlBulkCopy.BatchSize = 50;
                        sqlBulkCopy.DestinationTableName = "tblImport";
                        for (int columnIndex = 0; columnIndex < 9; ++columnIndex)
                        {
                            data.Tables[0].Rows[0][columnIndex].ToString();
                            string str = strArray[columnIndex];
                            sqlBulkCopy.ColumnMappings.Add(data.Tables[0].Rows[0][columnIndex].ToString(), strArray[columnIndex]);
                        }
                        try
                        {
                            sqlBulkCopy.WriteToServer(dataTable);
                        }
                        catch (Exception ex)
                        {
                            string str = Convert.ToString((object)ex);
                            int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                            AuditTrail(str, "importFirst", Uid);
                            throw;
                        }
                    }
                }
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@PROVIDER";
                sqlParameter.SqlDbType = SqlDbType.VarChar;
                sqlParameter.Value = (object)(int)this.Session["m_Provider"];
                paramColl[0] = sqlParameter;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_tblImport", paramColl);
                this.dtImport = dataSet.Tables[0];
                this.Session["dtImport"] = (object)dataSet.Tables[0];
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "importFirst", Uid);
                throw;
            }
        }

        public DataTable BindGrid()
        {
            try
            {
                DataTable dataTable = new DataTable();
                DataRow[] source = this.dtImport.Select("[SUB_NO] is null OR [CALLDATE] is null OR [AMOUNT] is NULL");
                if (source.Length != 0)
                    dataTable = ((IEnumerable<DataRow>)source).CopyToDataTable<DataRow>();
                return dataTable;
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "BindGrid", Uid);
                return null;
            }
        }

        public JsonResult ProcessBill(TIS.Models.Upload File)
        {
            try
            {
                if (File.DbBased == "False")
                {
                    if (this.OpenExcelFile(this.Server.MapPath("~/Bills/" + this.Session["m_CurrentImportFile"].ToString())) == null)
                        return this.Json((object)new { Message = "Fail" }, JsonRequestBehavior.AllowGet);

                    string CurrentImportFile1 = this.Session["m_CurrentImportFile"].ToString();
                    DateTime CurrentImportBillDate1 = Convert.ToDateTime(((DateTime)this.Session["m_CurrentImportBillDate"]).ToString("yyyy-MM-dd"));
                    int ProviderID1 = (int)this.Session["m_Provider"];
                    string userId = Convert.ToString(this.Session["EmpUID"]);

                    //DB.ExecuteNonQuery(string.Format("Insert into tblUploadHistory(UploadFileName,billdate,status,provider) values ('{0}','{1}','{2}',{3})", CurrentImportFile1, CurrentImportBillDate1, (object)"Success", ProviderID1));
                    //DB.ExecuteNonQuery(string.Format("update tbluploadhistory set billamount=(select sum(amount) from tblimport where billdate='" + CurrentImportBillDate1 + "' and provider=" + ProviderID1 + ") where  billdate='" + CurrentImportBillDate1 + "' and provider=" + ProviderID1));
                    //DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (9, 'Import Mobile Bills', 'Success','" + this.Session["EmpUID"] + "')");
                    //DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (9, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'',(select UploadFileName from tbluploadhistory where billdate='" + CurrentImportBillDate1 + "' and provider=" + ProviderID1 + "),'Imported Bill')");
                    //DateTime dateTime = (DateTime)this.Session["m_CurrentImportBillDate"];


                    DataTable dt = InsertUploadHistoryAndAudit(CurrentImportFile1, CurrentImportBillDate1, ProviderID1, "Success", userId);

                    var billDetails = new
                    {
                        BilledButNotInSystem = new { CountOfBills = 0, TotalAmount = 0.00 },
                        InSystemButNotAssigned = new { CountOfBills = 0, TotalAmount = 0.00 },
                        AssignedButOutsideValidDates = new { CountOfBills = 0, TotalAmount = 0.00 }
                    };

                    if (dt != null && dt.Rows.Count > 0)
                    {
                        var r = dt.Rows[0];
                        int b1c = 0, b2c = 0, b3c = 0;
                        double b1a = 0.0, b2a = 0.0, b3a = 0.0;

                        int.TryParse(Convert.ToString(r["BilledButNotInSystem_Count"]), out b1c);
                        double.TryParse(Convert.ToString(r["BilledButNotInSystem_Amount"]), out b1a);

                        int.TryParse(Convert.ToString(r["InSystemButNotAssigned_Count"]), out b2c);
                        double.TryParse(Convert.ToString(r["InSystemButNotAssigned_Amount"]), out b2a);

                        int.TryParse(Convert.ToString(r["AssignedButOutsideValidDates_Count"]), out b3c);
                        double.TryParse(Convert.ToString(r["AssignedButOutsideValidDates_Amount"]), out b3a);

                        billDetails = new
                        {
                            BilledButNotInSystem = new { CountOfBills = b1c, TotalAmount = b1a },
                            InSystemButNotAssigned = new { CountOfBills = b2c, TotalAmount = b2a },
                            AssignedButOutsideValidDates = new { CountOfBills = b3c, TotalAmount = b3a }
                        };
                    }

                    return this.Json((object)new { Message = "succ", BillDetails = billDetails }, JsonRequestBehavior.AllowGet);
                }
                string CurrentImportFile = this.Session["m_CurrentImportFile"].ToString();
                DateTime CurrentImportBillDate = Convert.ToDateTime(((DateTime)this.Session["m_CurrentImportBillDate"]).ToString("yyyy-MM-dd"));
                int ProviderID = (int)this.Session["m_Provider"];

                string providerName = this.Session["m_ProviderName"] != null ? this.Session["m_ProviderName"].ToString() : string.Empty;
                string userId2 = Convert.ToString(this.Session["EmpUID"]);

                //DB.ExecuteNonQuery(string.Format("Insert into tblUploadHistory(UploadFileName,billdate,status,provider) values ('{0}','{1}','{2}',{3})", this.Session["m_ProviderName"], CurrentImportBillDate, (object)"Success", ProviderID));
                //DB.ExecuteNonQuery(string.Format("update tbluploadhistory set billamount=(select ROUND(SUM(amount), 3) from tblimport where billdate='" + CurrentImportBillDate + "' and provider=" + ProviderID + ") where  billdate='" + CurrentImportBillDate + "' and provider=" + ProviderID));
                //DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (9, 'Import Mobile Bills', 'Success','" + this.Session["EmpUID"] + "')");
                //DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (9, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'',(select UploadFileName from tbluploadhistory where billdate='" + CurrentImportBillDate + "' and provider=" + ProviderID + "),'Imported Bill')");
                //DateTime dateTime1 = (DateTime)this.Session["m_CurrentImportBillDate"];

                // use same common method for DB-based providers
                DataTable dt2 = InsertUploadHistoryAndAudit(providerName, CurrentImportBillDate, ProviderID, "Success", userId2);

                var billDetails2 = new
                {
                    BilledButNotInSystem = new { CountOfBills = 0, TotalAmount = 0.00 },
                    InSystemButNotAssigned = new { CountOfBills = 0, TotalAmount = 0.00 },
                    AssignedButOutsideValidDates = new { CountOfBills = 0, TotalAmount = 0.00 }
                };

                if (dt2 != null && dt2.Rows.Count > 0)
                {
                    var r = dt2.Rows[0];
                    int b1c = 0, b2c = 0, b3c = 0;
                    double b1a = 0.0, b2a = 0.0, b3a = 0.0;

                    int.TryParse(Convert.ToString(r["BilledButNotInSystem_Count"]), out b1c);
                    double.TryParse(Convert.ToString(r["BilledButNotInSystem_Amount"]), out b1a);

                    int.TryParse(Convert.ToString(r["InSystemButNotAssigned_Count"]), out b2c);
                    double.TryParse(Convert.ToString(r["InSystemButNotAssigned_Amount"]), out b2a);

                    int.TryParse(Convert.ToString(r["AssignedButOutsideValidDates_Count"]), out b3c);
                    double.TryParse(Convert.ToString(r["AssignedButOutsideValidDates_Amount"]), out b3a);

                    billDetails2 = new
                    {
                        BilledButNotInSystem = new { CountOfBills = b1c, TotalAmount = b1a },
                        InSystemButNotAssigned = new { CountOfBills = b2c, TotalAmount = b2a },
                        AssignedButOutsideValidDates = new { CountOfBills = b3c, TotalAmount = b3a }
                    };
                }

                return this.Json((object)new { Message = "succ", BillDetails = billDetails2 }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "ProcessBill", Uid);
                return this.Json((object)new { Message = "Fail", BillDetails = "" }, JsonRequestBehavior.AllowGet);
            }
            
        }
        private DataTable InsertUploadHistoryAndAudit(string uploadFileName, DateTime billDate, int providerId, string status, string userId)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[5];

                SqlParameter p1 = new SqlParameter();
                p1.ParameterName = "@UploadFileName";
                p1.SqlDbType = SqlDbType.NVarChar;
                p1.Size = 255;
                p1.Value = (object)uploadFileName ?? (object)DBNull.Value;
                paramColl[0] = p1;

                SqlParameter p2 = new SqlParameter();
                p2.ParameterName = "@BillDate";
                p2.SqlDbType = SqlDbType.DateTime;
                p2.Value = (object)billDate;
                paramColl[1] = p2;

                SqlParameter p3 = new SqlParameter();
                p3.ParameterName = "@Provider";
                p3.SqlDbType = SqlDbType.Int;
                p3.Value = (object)providerId;
                paramColl[2] = p3;

                SqlParameter p4 = new SqlParameter();
                p4.ParameterName = "@Status";
                p4.SqlDbType = SqlDbType.NVarChar;
                p4.Size = 50;
                p4.Value = (object)status ?? (object)DBNull.Value;
                paramColl[3] = p4;

                SqlParameter p5 = new SqlParameter();
                p5.ParameterName = "@UserID";
                p5.SqlDbType = SqlDbType.NVarChar;
                p5.Size = 100;
                p5.Value = (object)userId ?? (object)DBNull.Value;
                paramColl[4] = p5;

                // Executes the stored procedure that performs insert/update/audit atomically
                //DB.ExecuteStoredProc("sp_InsertUploadHistoryAndAudit", paramColl);
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_InsertUploadHistoryAndAudit", paramColl);
                if (ds != null && ds.Tables.Count > 0)
                    return ds.Tables[0];
                return null;
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "InsertUploadHistoryAndAudit", Uid);
                return null;
            }
        }

        protected object OpenExcelFile(string fileName)
        {
            try
            {
                DataTable dataTable = new DataTable();
                string str1 = ((DateTime)this.Session["m_CurrentImportBillDate"]).ToString("yyyy-MM-dd");
                int num = (int)this.Session["m_Provider"];
                string empty = string.Empty;
                try
                {
                    SqlParameter[] paramColl = new SqlParameter[2];
                    SqlParameter sqlParameter1 = new SqlParameter();
                    sqlParameter1.ParameterName = "@PROVIDER";
                    sqlParameter1.SqlDbType = SqlDbType.Int;
                    sqlParameter1.Value = (object)num;
                    paramColl[0] = sqlParameter1;
                    SqlParameter sqlParameter2 = new SqlParameter();
                    sqlParameter2.ParameterName = "@BILLDATE";
                    sqlParameter2.SqlDbType = SqlDbType.DateTime;
                    sqlParameter2.Value = (object)str1;
                    paramColl[1] = sqlParameter2;

                    if (DB.ExecuteSpRetVal("sp_ImportInvoice", paramColl) == 0)
                    {
                        // Call cleanup stored procedure to remove previous import data for this provider/billdate/filename
                        ClearPreviousImport(num, str1, fileName);

                        string str = "File data not insert successfully.";
                        int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                        AuditTrail(str, "OpenExcelFile", Uid);

                        return (object)null;
                    }
                    //this.SendEmail();
                    return (object)dataTable;
                }
                catch (Exception ex)
                {
                    // Call cleanup stored procedure to remove previous import data for this provider/billdate/filename
                    ClearPreviousImport(num, str1, fileName);


                    string str2 = Convert.ToString((object)ex).Replace("'", " ");
                    DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (9, 'Import Mobile Bills', 'Fail','" + this.Session["EmpUID"] + "')");
                    DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (9, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + str2 + "' ,'Import Bill')");

                    string str = Convert.ToString((object)ex);
                    int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                    AuditTrail(str, "OpenExcelFile", Uid);
                    return (object)null;
                }
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "OpenExcelFile", Uid);
                return (object)null;
            }
        }
        private void ClearPreviousImport(int provider, string billDateString, string fileName)
        {
            try
            {
                SqlParameter[] delParams = new SqlParameter[3];

                SqlParameter dp1 = new SqlParameter();
                dp1.ParameterName = "@Provider";
                dp1.SqlDbType = SqlDbType.Int;
                dp1.Value = (object)provider;
                delParams[0] = dp1;

                SqlParameter dp2 = new SqlParameter();
                dp2.ParameterName = "@BillDate";
                dp2.SqlDbType = SqlDbType.DateTime;
                // use the same bill date value used above
                DateTime parsedBillDate;
                if (DateTime.TryParse(billDateString, out parsedBillDate))
                    dp2.Value = (object)parsedBillDate;
                else
                    dp2.Value = (object)DBNull.Value;
                delParams[1] = dp2;

                SqlParameter dp3 = new SqlParameter();
                dp3.ParameterName = "@FileName";
                dp3.SqlDbType = SqlDbType.VarChar;
                dp3.Size = 200;
                dp3.Value = (object)fileName ?? (object)DBNull.Value;
                delParams[2] = dp3;

                // Stored procedure should perform the deletes:
                // delete tblbills where PROVIDER= @Provider and BILLDATE =@BillDate
                // delete tblcallrecord where PROVIDER= @Provider and BILLDATE =@BillDate
                // delete temp where PROVIDER= @Provider and BILLDATE =@BillDate
                // delete tmptblBills where PROVIDER= @Provider and BILLDATE =@BillDate
                // delete tblUploadHistory where UploadFileName=@FileName and PROVIDER= @Provider and BILLDATE =@BillDate
                DB.ExecuteStoredProc("sp_ClearPreviousImport", delParams);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "ClearPreviousImport", Uid);
                // swallow/log if necessary - do not throw to preserve original behavior
            }
        }
        public JsonResult SendEmail()
        {
            try
            {
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_GetEmailPipeLine");
                if (dataSet != null && dataSet.Tables[0].Rows.Count > 0)
                {
                    try
                    {
                        foreach (DataRow row in (InternalDataCollectionBase)dataSet.Tables[0].Rows)
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
                            new SmtpClient(dataSet.Tables[2].Rows[0]["smtpsettings"].ToString())
                            {
                                UseDefaultCredentials = true
                            }.Send(message);
                            SqlParameter[] paramColl = new SqlParameter[1];
                            SqlParameter sqlParameter = new SqlParameter();
                            sqlParameter.ParameterName = "@id";
                            sqlParameter.SqlDbType = SqlDbType.Int;
                            sqlParameter.Value = (object)row["Id"].ToString();
                            paramColl[0] = sqlParameter;
                            DB.ExecuteStoredProcDataSet("sp_MarkAsSent", paramColl);

                        }
                    }
                    catch (Exception ex)
                    {
                        string str = Convert.ToString((object)ex);
                        int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                        AuditTrail(str, "SendEmail", Uid);
                    }
                }
                return this.Json((object)new
                {
                    Message = "Email Sent"
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "SendEmail", Uid);
                return this.Json((object)new { Message = "Email Sent Fail" }, JsonRequestBehavior.AllowGet);
            }
        }

        private void AuditTrail(string exMsg, string EventName, int Uid)
        {
            string empty = string.Empty;
            SqlParameter[] paramColl = new SqlParameter[5];

            SqlParameter sqlParameter1 = new SqlParameter();
            sqlParameter1.ParameterName = "@Uid";
            sqlParameter1.SqlDbType = SqlDbType.Int;
            sqlParameter1.Value = Uid;
            paramColl[0] = sqlParameter1;

            SqlParameter sqlParameter2 = new SqlParameter();
            sqlParameter2.ParameterName = "@EventName";
            sqlParameter2.SqlDbType = SqlDbType.NVarChar;
            sqlParameter2.Value = EventName;
            paramColl[1] = sqlParameter2;

            SqlParameter sqlParameter3 = new SqlParameter();
            sqlParameter3.ParameterName = "@EventType";
            sqlParameter3.SqlDbType = SqlDbType.NVarChar;
            sqlParameter3.Value = "Fail";
            paramColl[2] = sqlParameter3;

            SqlParameter sqlParameter4 = new SqlParameter();
            sqlParameter4.ParameterName = "@EventMsg";
            sqlParameter4.SqlDbType = SqlDbType.NVarChar;
            sqlParameter4.Value = exMsg;
            paramColl[3] = sqlParameter4;

            SqlParameter sqlParameter5 = new SqlParameter();
            sqlParameter5.ParameterName = "@EventSeverity";
            sqlParameter5.SqlDbType = SqlDbType.NVarChar;
            sqlParameter5.Value = "severity_high";
            paramColl[4] = sqlParameter5;

            DB.ExecuteStoredProcDataSet("sp_CreateException", paramColl);
        }

        public JsonResult UpdateImport(Import Import)
        {
            try
            {
                DateTime dateTime = Convert.ToDateTime(Import.CALLDATE);
                DB.ExecuteNonQuery("update tblImport set AMOUNT='" + Import.AMOUNT + "',SUB_NO='" + Import.SUB_NO + "',BILLNUMBER='" + Import.SUB_NO + "',CALLDATE='" + (object)dateTime + "' where ID=" + (object)Import.ID ?? "");
                DataSet data = DB.GetData("Select * from tblImport where SUB_NO is null or CALLDATE is null or AMOUNT is null");
                DataTable dataTable = new DataTable();
                if (data != null)
                    dataTable = data.Tables[0];
                List<Import> importList = new List<Import>();
                if (dataTable.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)dataTable.Rows)
                        importList.Add(new Import()
                        {
                            ID = Convert.ToInt32(row["ID"].ToString()),
                            SUB_NO = row["SUB_NO"].ToString(),
                            BILLDATE = Convert.ToDateTime(row["BILLDATE"].ToString()),
                            CALLDATE = row["CALLDATE"].ToString(),
                            TRANS_TYPE = row["TRANS_TYPE"].ToString(),
                            DESCRIPTION = row["DESCRIPTION"].ToString(),
                            AMOUNT = row["AMOUNT"].ToString(),
                            DURATION = row["DURATION"].ToString(),
                            CALLTIME = row["CALLTIME"].ToString()
                        });
                }
                return this.Json((object)new
                {
                    Message = "Success",
                    dtImp = importList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "UpdateImport", Uid);
                return this.Json((object)new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult UploadSetting(TIS.Models.Upload File)
        {
            try
            {
                int providerId = File.ProviderID;
                string fileName = File.FileName;
                string sheetName = File.SheetName;
                List<Column> columnList = new List<Column>();
                string path = AppDomain.CurrentDomain.BaseDirectory + "Bills\\" + fileName;
                if (Path.GetExtension(path).Equals(".xls"))
                {
                    OleDbConnection connection = new OleDbConnection(string.Format("Provider=Microsoft.ACE.OLEDB.12.0; Data Source={0};Extended Properties='Excel 8.0;IMEX=1';HDR=YES", (object)path));
                    OleDbDataAdapter oleDbDataAdapter = new OleDbDataAdapter(new OleDbCommand(string.Format("select * from [{0}]", (object)sheetName), connection));
                    DataSet dataSet1 = new DataSet();
                    connection.Open();
                    DataSet dataSet2 = dataSet1;
                    oleDbDataAdapter.Fill(dataSet2);
                    connection.Close();
                    DataTable table = dataSet1.Tables[0];
                    for (int columnIndex = 0; columnIndex < table.Columns.Count; ++columnIndex)
                        columnList.Add(new Column()
                        {
                            Cols = table.Rows[0][columnIndex].ToString()
                        });
                }
                else if (Path.GetExtension(path).Equals(".xlsx"))
                {
                    OleDbConnection connection = new OleDbConnection(string.Format("Provider=Microsoft.ACE.OLEDB.12.0; Data Source={0};Extended Properties='Excel 12.0 XML;HRD=YES;IMEX=1;'", (object)path));
                    OleDbDataAdapter oleDbDataAdapter = new OleDbDataAdapter(new OleDbCommand(string.Format("select * from [{0}]", (object)sheetName), connection));
                    DataSet dataSet3 = new DataSet();
                    connection.Open();
                    DataSet dataSet4 = dataSet3;
                    oleDbDataAdapter.Fill(dataSet4);
                    connection.Close();
                    DataTable table = dataSet3.Tables[0];
                    for (int index = 0; index < table.Columns.Count; ++index)
                        columnList.Add(new Column()
                        {
                            Cols = table.Columns[index].ColumnName
                        });
                }
                else if (Path.GetExtension(path).Equals(".mde"))
                {
                    OleDbConnection connection = new OleDbConnection(string.Format("Provider=Microsoft.Jet.OLEDB.4.0;Data Source={0};", (object)path));
                    OleDbDataAdapter oleDbDataAdapter = new OleDbDataAdapter(new OleDbCommand(string.Format("select * from [{0}]", (object)sheetName), connection));
                    DataSet dataSet5 = new DataSet();
                    connection.Open();
                    DataSet dataSet6 = dataSet5;
                    oleDbDataAdapter.Fill(dataSet6);
                    connection.Close();
                    DataTable table = dataSet5.Tables[0];
                    for (int index = 0; index < table.Columns.Count; ++index)
                        columnList.Add(new Column()
                        {
                            Cols = table.Columns[index].ColumnName
                        });
                }
                return this.Json((object)new
                {
                    Message = "Success",
                    dtCol = columnList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "UploadSetting", Uid);
                return this.Json((object)new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult UpdateSetting(Column Clm)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[11];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@Col1";
                sqlParameter1.SqlDbType = SqlDbType.VarChar;
                sqlParameter1.Value = (object)Clm.Col1;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@Col2";
                sqlParameter2.SqlDbType = SqlDbType.VarChar;
                sqlParameter2.Value = (object)Clm.Col2;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@Col3";
                sqlParameter3.SqlDbType = SqlDbType.VarChar;
                sqlParameter3.Value = (object)Clm.Col3;
                paramColl[2] = sqlParameter3;
                SqlParameter sqlParameter4 = new SqlParameter();
                sqlParameter4.ParameterName = "@Col4";
                sqlParameter4.SqlDbType = SqlDbType.VarChar;
                sqlParameter4.Value = (object)Clm.Col4;
                paramColl[3] = sqlParameter4;
                SqlParameter sqlParameter5 = new SqlParameter();
                sqlParameter5.ParameterName = "@Col5";
                sqlParameter5.SqlDbType = SqlDbType.VarChar;
                sqlParameter5.Value = (object)Clm.Col5;
                paramColl[4] = sqlParameter5;
                SqlParameter sqlParameter6 = new SqlParameter();
                sqlParameter6.ParameterName = "@Col6";
                sqlParameter6.SqlDbType = SqlDbType.VarChar;
                sqlParameter6.Value = (object)Clm.Col6;
                paramColl[5] = sqlParameter6;
                SqlParameter sqlParameter7 = new SqlParameter();
                sqlParameter7.ParameterName = "@Col7";
                sqlParameter7.SqlDbType = SqlDbType.VarChar;
                sqlParameter7.Value = (object)Clm.Col7;
                paramColl[6] = sqlParameter7;
                SqlParameter sqlParameter8 = new SqlParameter();
                sqlParameter8.ParameterName = "@Col8";
                sqlParameter8.SqlDbType = SqlDbType.VarChar;
                sqlParameter8.Value = (object)Clm.Col8;
                paramColl[7] = sqlParameter8;
                SqlParameter sqlParameter9 = new SqlParameter();
                sqlParameter9.ParameterName = "@Provider";
                sqlParameter9.SqlDbType = SqlDbType.VarChar;
                sqlParameter9.Value = (object)Clm.Provider;
                paramColl[8] = sqlParameter9;
                SqlParameter sqlParameter10 = new SqlParameter();
                sqlParameter10.ParameterName = "@dbConstr";
                sqlParameter10.SqlDbType = SqlDbType.VarChar;
                sqlParameter10.Value = (object)Clm.dbConstr;
                paramColl[9] = sqlParameter10;
                SqlParameter sqlParameter11 = new SqlParameter();
                sqlParameter11.ParameterName = "@dbTableName";
                sqlParameter11.SqlDbType = SqlDbType.VarChar;
                sqlParameter11.Value = (object)Clm.dbTableName;
                paramColl[10] = sqlParameter11;
                DB.ExecuteStoredProc("sp_UploadSetting", paramColl);
                return this.Json((object)new
                {
                    Message = "Settings Updated Sucessfully"
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "UploadSetting", Uid);
                return this.Json((object)new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
            
        }

        public JsonResult GetSetting(Column Clm)
        {
            try
            {
                string str = DB.GetValue("SELECT DbBased FROM tblProvider where ID = '" + (object)Clm.Provider + "' ");
                DataTable table = DB.GetData("Select * from tblProvider where ID='" + (object)Clm.Provider + "'").Tables[0];
                Column column = new Column();
                if (str == "True")
                {
                    column.Col1 = table.Rows[0]["excel_col1"].ToString();
                    column.Col2 = table.Rows[0]["excel_col2"].ToString();
                    column.Col3 = table.Rows[0]["excel_col3"].ToString();
                    column.Col4 = table.Rows[0]["excel_col4"].ToString();
                    column.Col5 = table.Rows[0]["excel_col5"].ToString();
                    column.Col6 = table.Rows[0]["excel_col6"].ToString();
                    column.Col7 = table.Rows[0]["excel_col7"].ToString();
                    column.Col8 = table.Rows[0]["excel_col8"].ToString();
                    column.dbConstr = table.Rows[0]["dbConstr"].ToString();
                    column.dbTableName = table.Rows[0]["dbTableName"].ToString();
                    return this.Json((object)new { dtDBCol = column }, JsonRequestBehavior.AllowGet);
                }
                column.Col1 = table.Rows[0]["excel_col1"].ToString();
                column.Col2 = table.Rows[0]["excel_col2"].ToString();
                column.Col3 = table.Rows[0]["excel_col3"].ToString();
                column.Col4 = table.Rows[0]["excel_col4"].ToString();
                column.Col5 = table.Rows[0]["excel_col5"].ToString();
                column.Col6 = table.Rows[0]["excel_col6"].ToString();
                column.Col7 = table.Rows[0]["excel_col7"].ToString();
                column.Col8 = table.Rows[0]["excel_col8"].ToString();
                return this.Json((object)new { dtCol = column }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "GetSetting", Uid);
                return this.Json((object)new { Message = "Fail", dtCol="" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult DeleteBill(TIS.Models.Upload Upload)
        {
            string empty = string.Empty;
            try
            {
                SqlParameter[] paramColl = new SqlParameter[2];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@Provider";
                sqlParameter1.SqlDbType = SqlDbType.Int;
                sqlParameter1.Value = (object)Upload.ProviderID;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@BillDate";
                sqlParameter2.SqlDbType = SqlDbType.DateTime;
                sqlParameter2.Value = (object)Upload.BillDate;
                paramColl[1] = sqlParameter2;
                DB.ExecuteStoredProc("sp_DeleteBill", paramColl);
                return this.Json((object)new { myMessage = "succ" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "DeleteBill", Uid);
                return this.Json((object)new { myMessage = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetUnAssignedBill()
        {
            int int32_1 = Convert.ToInt32(this.Session["CountryID"].ToString());
            int int32_2 = Convert.ToInt32(this.Session["EmpRoleID"].ToString());
            try
            {
                DataSet data = DB.GetData(int32_2 != 8 ? "SELECT * FROM [vw_Unassign_Grid] where CountryID='" + (object)int32_1 + "'" : "SELECT * FROM [vw_Unassign_Grid]");
                List<Bill> billList = new List<Bill>();
                DataTable table = data.Tables[0];
                if (table.Rows.Count > 0)
                {
                    foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                        billList.Add(new Bill()
                        {
                            BillDate = Convert.ToDateTime(row["BILLDATE"].ToString()),
                            Mobile = row["Mobile"].ToString(),
                            ProviderName = row["Provider"].ToString(),
                            TotalAmount = Convert.ToDouble(row["BillAmount"].ToString())
                        });
                }
                return this.Json((object)new { Bills = billList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "GetUnAssignedBill", Uid);
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult AssignInvoice() => this.Json((object)new
        {
            Message = (Convert.ToString(DB.ExecuteSpRetVal("sp_AssignInvoice", (SqlParameter[])null)) + " Bills Generated")
        }, JsonRequestBehavior.AllowGet);

        public JsonResult GetDataSetting(Column Clm)
        {
            try
            {
                DataTable table = DB.GetData("Select * from tblProvider where ID='" + (object)Clm.Provider + "'").Tables[0];
                return this.Json((object)new
                {
                    dtDBCol = new Column()
                    {
                        Col1 = table.Rows[0]["excel_col1"].ToString(),
                        Col2 = table.Rows[0]["excel_col2"].ToString(),
                        Col3 = table.Rows[0]["excel_col3"].ToString(),
                        Col4 = table.Rows[0]["excel_col4"].ToString(),
                        Col5 = table.Rows[0]["excel_col5"].ToString(),
                        Col6 = table.Rows[0]["excel_col6"].ToString(),
                        Col7 = table.Rows[0]["excel_col7"].ToString(),
                        Col8 = table.Rows[0]["excel_col8"].ToString(),
                        dbConstr = table.Rows[0]["dbConstr"].ToString(),
                        dbTableName = table.Rows[0]["dbTableName"].ToString()
                    }
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "GetDataSetting", Uid);
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult UploadDataSetting(Column value)
        {
            try
            {
                int provider = value.Provider;
                OleDbConnection connection = new OleDbConnection(value.dbConstr);
                OleDbDataAdapter oleDbDataAdapter = new OleDbDataAdapter(new OleDbCommand(string.Format("select * from [{0}]", (object)value.dbTableName), connection));
                DataSet dataSet1 = new DataSet();
                connection.Open();
                DataSet dataSet2 = dataSet1;
                oleDbDataAdapter.Fill(dataSet2);
                connection.Close();
                DataTable table = dataSet1.Tables[0];
                List<Column> columnList = new List<Column>();
                for (int index = 0; index < table.Columns.Count; ++index)
                    columnList.Add(new Column()
                    {
                        Cols = table.Columns[index].ColumnName
                    });
                return this.Json((object)new
                {
                    Message = "Success",
                    dtCol = columnList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "UploadDataSetting", Uid);
                return this.Json((object)"'Fail':'true'");
            }
        }

        public JsonResult UpdateDBSetting(Column Clm)
        {
            try
            {
                SqlParameter[] paramColl = new SqlParameter[11];
                SqlParameter sqlParameter1 = new SqlParameter();
                sqlParameter1.ParameterName = "@Col1";
                sqlParameter1.SqlDbType = SqlDbType.VarChar;
                sqlParameter1.Value = (object)Clm.Col1;
                paramColl[0] = sqlParameter1;
                SqlParameter sqlParameter2 = new SqlParameter();
                sqlParameter2.ParameterName = "@Col2";
                sqlParameter2.SqlDbType = SqlDbType.VarChar;
                sqlParameter2.Value = (object)Clm.Col2;
                paramColl[1] = sqlParameter2;
                SqlParameter sqlParameter3 = new SqlParameter();
                sqlParameter3.ParameterName = "@Col3";
                sqlParameter3.SqlDbType = SqlDbType.VarChar;
                sqlParameter3.Value = (object)Clm.Col3;
                paramColl[2] = sqlParameter3;
                SqlParameter sqlParameter4 = new SqlParameter();
                sqlParameter4.ParameterName = "@Col4";
                sqlParameter4.SqlDbType = SqlDbType.VarChar;
                sqlParameter4.Value = (object)Clm.Col4;
                paramColl[3] = sqlParameter4;
                SqlParameter sqlParameter5 = new SqlParameter();
                sqlParameter5.ParameterName = "@Col5";
                sqlParameter5.SqlDbType = SqlDbType.VarChar;
                sqlParameter5.Value = (object)Clm.Col5;
                paramColl[4] = sqlParameter5;
                SqlParameter sqlParameter6 = new SqlParameter();
                sqlParameter6.ParameterName = "@Col6";
                sqlParameter6.SqlDbType = SqlDbType.VarChar;
                sqlParameter6.Value = (object)Clm.Col6;
                paramColl[5] = sqlParameter6;
                SqlParameter sqlParameter7 = new SqlParameter();
                sqlParameter7.ParameterName = "@Col7";
                sqlParameter7.SqlDbType = SqlDbType.VarChar;
                sqlParameter7.Value = (object)Clm.Col7;
                paramColl[6] = sqlParameter7;
                SqlParameter sqlParameter8 = new SqlParameter();
                sqlParameter8.ParameterName = "@Col8";
                sqlParameter8.SqlDbType = SqlDbType.VarChar;
                sqlParameter8.Value = (object)Clm.Col8;
                paramColl[7] = sqlParameter8;
                SqlParameter sqlParameter9 = new SqlParameter();
                sqlParameter9.ParameterName = "@Provider";
                sqlParameter9.SqlDbType = SqlDbType.VarChar;
                sqlParameter9.Value = (object)Clm.Provider;
                paramColl[8] = sqlParameter9;
                SqlParameter sqlParameter10 = new SqlParameter();
                sqlParameter10.ParameterName = "@dbConstr";
                sqlParameter10.SqlDbType = SqlDbType.VarChar;
                sqlParameter10.Value = (object)Clm.dbConstr;
                paramColl[9] = sqlParameter10;
                SqlParameter sqlParameter11 = new SqlParameter();
                sqlParameter11.ParameterName = "@dbTableName";
                sqlParameter11.SqlDbType = SqlDbType.VarChar;
                sqlParameter11.Value = (object)Clm.dbTableName;
                paramColl[10] = sqlParameter11;
                DB.ExecuteStoredProc("sp_UploadDBSetting", paramColl);
                return this.Json((object)new
                {
                    Message = "Settings Updated Sucessfully"
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "UpdateDBSetting", Uid);
                return this.Json((object)new
                {
                    Message = "Fail"
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult CheckProvider(Column value) => this.Json((object)new
        {
            DbBased = DB.GetValue("SELECT DbBased FROM tblProvider where ID = '" + (object)value.Provider + "' ")
        }, JsonRequestBehavior.AllowGet);

        public JsonResult TestConn(Column value)
        {
            try
            {
                OleDbConnection connection = new OleDbConnection(value.dbConstr);
                OleDbDataAdapter oleDbDataAdapter = new OleDbDataAdapter(new OleDbCommand(string.Format("Select * from sys.views"), connection));
                DataSet dataSet1 = new DataSet();
                connection.Open();
                DataSet dataSet2 = dataSet1;
                oleDbDataAdapter.Fill(dataSet2);
                connection.Close();
                DataTable table = dataSet1.Tables[0];
                List<Column> columnList = new List<Column>();
                for (int index = 0; index < table.Rows.Count; ++index)
                    columnList.Add(new Column()
                    {
                        Views = table.Rows[index][0].ToString()
                    });
                return this.Json((object)new
                {
                    Message = "Success",
                    dtViews = columnList
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "TestConn", Uid);
                return this.Json((object)new
                {
                    Error = "Cannot Connect, Please Contact Your Manager"
                }, JsonRequestBehavior.AllowGet);
            }
        }

        private void importDataFirst(string View, string sqlConstr, int Month, int Year)
        {
            try
            {
                View = View ?? "";
                if (string.IsNullOrEmpty(View))
                    throw new Exception("View is empty! Cannot import data.");

                int int32 = Convert.ToInt32("0" + DB.GetValue("select max(ID) from tblcallrecord"));
                DB.ExecuteNonQuery("delete from tblImport");
                DB.ExecuteNonQuery(" DBCC CHECKIDENT (tblIMPORT, RESEED, " + (object)int32 + ")");
                DataTable dataTable = new DataTable();
                string dbConn = DB.GetDBConn();
                string selectConnectionString = string.Format((sqlConstr ?? "") ?? "");
                string sql = $"SELECT *, '{((DateTime)this.Session["m_CurrentImportBillDate"]).ToString("yyyy-MM-dd")}' as BillDateNew " +
                             $"FROM {View} " +
                             $"WHERE Month(CallDate) = {Month} AND Year(CallDate) = {Year}";
                string[] strArray = new string[9]
                {
        "SUB_NO",
        "BILLDATE",
        "CALLDATE",
        "TRANS_TYPE",
        "DESCRIPTION",
        "CALLTIME",
        "DURATION",
        "AMOUNT",
        "BILLNUMBER"
                };
                DataSet data = DB.GetData("select [excel_col1],'BillDateNew' as [excel_col2],[excel_col3],[excel_col4],[excel_col5],[excel_col6],[excel_col7],[excel_col8],[excel_col9] from tblProvider where id = '" + (object)(int)this.Session["m_Provider"] + "'");
                using (SqlConnection connection = new SqlConnection(dbConn))
                {
                    connection.Open();
                    using (SqlBulkCopy sqlBulkCopy = new SqlBulkCopy(connection))
                    {
                        sqlBulkCopy.BulkCopyTimeout = 500;
                        //sqlBulkCopy.BatchSize = 50;
                        sqlBulkCopy.DestinationTableName = "tblImport";
                        for (int columnIndex = 0; columnIndex < 9; ++columnIndex)
                        {
                            sqlBulkCopy.ColumnMappings.Add(
                                data.Tables[0].Rows[0][columnIndex].ToString(),
                                strArray[columnIndex]
                            );
                        }
                        try
                        {
                            sqlBulkCopy.WriteToServer(dataTable);
                        }
                        catch (Exception ex)
                        {
                            throw;
                        }
                    }
                }
                SqlParameter[] paramColl = new SqlParameter[1];
                SqlParameter sqlParameter = new SqlParameter();
                sqlParameter.ParameterName = "@PROVIDER";
                sqlParameter.SqlDbType = SqlDbType.VarChar;
                sqlParameter.Value = (object)(int)this.Session["m_Provider"];
                paramColl[0] = sqlParameter;
                DataSet dataSet = DB.ExecuteStoredProcDataSet("sp_tblImport", paramColl);
                this.dtImport = dataSet.Tables[0];
                this.Session["dtImport"] = (object)dataSet.Tables[0];
            }
            catch (Exception ex)
            {
                string str = Convert.ToString((object)ex);
                int Uid = Convert.ToInt32(this.Session["EmpUID"]);
                AuditTrail(str, "importDataFirst", Uid);
                throw;
            }

        }
    }
}
