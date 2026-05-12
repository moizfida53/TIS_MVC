// ============================================================
// DEPENDENCY CHANGE — replace OLEDB with ExcelDataReader
// ============================================================
// Remove from project (no longer needed):
//   System.Data.OleDb  (and the ACE/JET drivers on the server)
//   EPPlus             (uninstall via NuGet if previously added)
//
// Add via NuGet Package Manager Console:
//   Install-Package ExcelDataReader
//   Install-Package ExcelDataReader.DataSet
//
// No license setup required — ExcelDataReader is MIT licensed.
// ============================================================

using Microsoft.SqlServer.Server;
using ExcelDataReader;                // handles both .xls and .xlsx
using System;
using System.Text;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;
using TIS.Filters;
using TIS.Helper;
using TIS.Models;

namespace TIS.Controllers
{
    [RoleAuthorize(Roles.SuperAdmin)]

    public class ImportController : Controller
    {
        private DataTable dtImport;

        public ActionResult Index() =>
            this.Session["EmpLoginName"] == null
                ? (ActionResult)this.View("AccessDenied")
                : (ActionResult)this.View("ImportInvoice");

        public ActionResult UnAssigned() =>
            this.Session["EmpLoginName"] == null
                ? (ActionResult)this.View("AccessDenied")
                : (ActionResult)this.View("UnAssignedInvoice");

        // ===================================================================
        //  GetUploadHistory — unchanged, no Excel I/O
        // ===================================================================
        public JsonResult GetUploadHistory()
        {
            int countryId = Convert.ToInt32(this.Session["CountryID"].ToString());
            int roleId = Convert.ToInt32(this.Session["EmpRoleID"].ToString());
            try
            {
                SqlParameter[] paramColl = new SqlParameter[2];
                paramColl[0] = new SqlParameter { ParameterName = "@CountryID", SqlDbType = SqlDbType.Int, Value = countryId };
                paramColl[1] = new SqlParameter { ParameterName = "@RoleID", SqlDbType = SqlDbType.Int, Value = roleId };

                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetUploadHistory", paramColl);
                var uploadList = new List<TIS.Models.Upload>();
                DataTable table = ds.Tables[0];
                foreach (DataRow row in table.Rows)
                    uploadList.Add(new TIS.Models.Upload
                    {
                        ID = Convert.ToInt32(row["ID"].ToString()),
                        FileName = row["UploadFileName"].ToString(),
                        BillDate = Convert.ToDateTime(row["BillDate"].ToString()),
                        UploadDate = Convert.ToDateTime(row["UploadDate"].ToString()),
                        ProviderName = row["Name"].ToString(),
                        ProviderID = Convert.ToInt32(row["Provider"].ToString()),
                        BillAmount = row["BillAmount"].ToString()
                    });

                int isDeleteButShow = 1;
                if (ds.Tables.Count > 1)
                    isDeleteButShow = Convert.ToInt32(ds.Tables[1].Rows[0]["DeleteBut"]);

                return this.Json(new { UploadList = uploadList, IsDeleteButShow = isDeleteButShow },
                                 JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "GetUploadHistory", Convert.ToInt32(this.Session["EmpUID"]));
                return this.Json("'Fail':'true'");
            }
        }

        // ===================================================================
        //  Upload — unchanged, only saves the file to disk
        // ===================================================================
        public ActionResult Upload(HttpPostedFileBase[] fileToUpload)
        {
            try
            {
                foreach (HttpPostedFileBase f in fileToUpload)
                {
                    string filename = Path.Combine(this.Server.MapPath("~/Bills/"), f.FileName);
                    f.SaveAs(filename);
                }
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "Upload", Convert.ToInt32(this.Session["EmpUID"]));
            }
            return (ActionResult)this.View("ImportInvoice");
        }

        // ===================================================================
        //  FillSheet — returns sheet names from an Excel file
        //  .xls / .xlsx → ExcelDataReader (handles both formats, no driver)
        //  .mde / .mdb  → OleDb (Access only, no bitness issue)
        // ===================================================================
        public JsonResult FillSheet(TIS.Models.Upload File)
        {
            try
            {
                string filePath = AppDomain.CurrentDomain.BaseDirectory
                                  + "Bills\\" + Path.GetFileName(File.FileName);

                var uploadList = new List<TIS.Models.Upload>();
                string ext = Path.GetExtension(filePath).ToLower();

                if (ext == ".xls" || ext == ".xlsx")
                {
                    System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
                    using (var stream = System.IO.File.OpenRead(filePath))
                    using (var reader = ExcelReaderFactory.CreateReader(stream))
                    {
                        var result = reader.AsDataSet(new ExcelDataSetConfiguration
                        {
                            ConfigureDataTable = _ => new ExcelDataTableConfiguration { UseHeaderRow = true }
                        });
                        foreach (DataTable tbl in result.Tables)
                            uploadList.Add(new TIS.Models.Upload { SheetName = tbl.TableName });
                    }
                }
                else if (ext == ".mde" || ext == ".mdb")
                {
                    DataTable sheetTable = GetAccessTableNames(filePath);
                    if (sheetTable != null)
                        foreach (DataRow row in sheetTable.Rows)
                            uploadList.Add(new TIS.Models.Upload { SheetName = row["TABLE_NAME"].ToString() });
                }

                return this.Json(new { dtSheet = uploadList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "FillSheet", Convert.ToInt32(this.Session["EmpUID"]));
                return this.Json(new { Message = "Fail", dtSheet = "" }, JsonRequestBehavior.AllowGet);
            }
        }

        // ===================================================================
        //  Helper: get table names from an Access .mde / .mdb
        //  (OleDb is fine here — Access has no 32/64-bit driver mismatch)
        // ===================================================================
        private DataTable GetAccessTableNames(string filePath)
        {
            System.Data.OleDb.OleDbConnection conn = null;
            try
            {
                string ext = Path.GetExtension(filePath).ToLower();
                string connStr = ext == ".mde"
                    ? string.Format("Provider=Microsoft.Jet.OLEDB.4.0;Data Source={0};", filePath)
                    : string.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Persist Security Info=False;", filePath);

                conn = new System.Data.OleDb.OleDbConnection(connStr);
                conn.Open();
                return conn.GetSchema("Tables");
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "GetAccessTableNames", Convert.ToInt32(this.Session["EmpUID"]));
                return null;
            }
            finally
            {
                if (conn != null) { conn.Close(); conn.Dispose(); }
            }
        }

        // ===================================================================
        //  UploadFile — orchestrates the import
        //  No change to logic; importFirst() is what changed internally.
        // ===================================================================
        public JsonResult UploadFile(TIS.Models.Upload File)
        {
            try
            {
                File.DbBased = "False";

                if (File.DbBased == "False")
                {
                    int year = File.Year;
                    int month = File.Month;
                    int providerId = File.ProviderID;
                    DateTime dt = new DateTime(year, month, 1).AddMonths(1).AddDays(-1);
                    this.Session["m_CurrentImportBillDate"] = dt;
                    this.Session["m_Provider"] = providerId;

                    string sdir = AppDomain.CurrentDomain.BaseDirectory + "Bills\\";
                    string sheetName = File.SheetName;
                    string fileName = File.FileName;
                    this.Session["m_CurrentImportFile"] = fileName;

                    this.importFirst(fileName, sdir, sheetName);
                    DataTable dataTable = this.BindGrid();

                    var importList = new List<Import>();
                    foreach (DataRow row in dataTable.Rows)
                        importList.Add(MapImportRow(row));

                    string billAmount = DB.GetValue("Select ROUND(SUM(amount), 3) from tblimport");
                    var jsonResult = this.Json(
                        new { MyMessage = "Success", BillAmount = billAmount, gridData = importList },
                        JsonRequestBehavior.AllowGet);
                    jsonResult.MaxJsonLength = int.MaxValue;
                    return jsonResult;
                }

                // DB-based provider path (unchanged)
                DataSet providerData = DB.GetData("Select * from tblprovider where ID = '" + File.ProviderID + "'");
                string sqlConstr = providerData.Tables[0].Rows[0][15].ToString();
                string view = providerData.Tables[0].Rows[0][16].ToString();
                string providerName = providerData.Tables[0].Rows[0][1].ToString();

                DateTime dt2 = new DateTime(File.Year, File.Month, 1).AddMonths(1).AddDays(-1);
                this.Session["m_CurrentImportBillDate"] = dt2;
                this.Session["m_Provider"] = File.ProviderID;
                this.Session["m_ProviderName"] = providerName;

                this.importDataFirst(view, sqlConstr, File.Month, File.Year);

                string billAmount2 = DB.GetValue("Select ROUND(SUM(amount), 3) from tblimport");
                DataTable dt3 = this.BindGrid();
                var importList2 = new List<Import>();
                foreach (DataRow row in dt3.Rows)
                    importList2.Add(MapImportRow(row));

                var jsonResult2 = this.Json(
                    new { MyMessage = "Success", BillAmount = billAmount2, gridData = importList2 },
                    JsonRequestBehavior.AllowGet);
                jsonResult2.MaxJsonLength = int.MaxValue;
                return jsonResult2;
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "UploadFile", Convert.ToInt32(this.Session["EmpUID"]));
                throw;
            }
        }

        // ===================================================================
        //  importFirst — reads Excel with EPPlus, then bulk-inserts into SQL
        //  WAS: OleDbDataAdapter with ACE/JET connection strings
        //  NOW: EPPlus ExcelPackage — no drivers, no bitness issues
        // ===================================================================
        private void importFirst(string fileName, string sdir, string ssh)
        {
            try
            {
                int maxId = Convert.ToInt32("0" + DB.GetValue("select max(ID) from tblcallrecord"));
                DB.ExecuteNonQuery("delete from tblImport");
                DB.ExecuteNonQuery(" DBCC CHECKIDENT (tblIMPORT, RESEED, " + maxId + ")");

                string filePath = sdir + fileName;
                string ext = Path.GetExtension(fileName).ToLower();

                DataTable dataTable;

                if (ext == ".mde")
                {
                    dataTable = ReadAccessSheet(filePath, ssh);
                }
                else
                {
                    // ExcelDataReader handles both .xls and .xlsx — no driver needed
                    dataTable = ReadExcelSheet(filePath, ssh);
                }

                // Inject BillDateNew column expected by the column-mapping below
                string billDateStr = ((DateTime)this.Session["m_CurrentImportBillDate"]).ToString("yyyy-MM-dd");
                if (!dataTable.Columns.Contains("BillDateNew"))
                    dataTable.Columns.Add("BillDateNew", typeof(string));
                foreach (DataRow r in dataTable.Rows)
                    r["BillDateNew"] = billDateStr;

                string[] destCols = { "SUB_NO", "BILLDATE", "CALLDATE", "TRANS_TYPE", "DESCRIPTION", "CALLTIME", "DURATION", "AMOUNT", "BILLNUMBER" };
                DataSet mapping = DB.GetData(
                    "select [excel_col1],'BillDateNew' as [excel_col2],[excel_col3],[excel_col4],[excel_col5],[excel_col6],[excel_col7],[excel_col8],[excel_col9] from tblProvider where id=" +
                    (int)this.Session["m_Provider"]);

                string dbConn = DB.GetDBConn();
                using (SqlConnection connection = new SqlConnection(dbConn))
                {
                    connection.Open();
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(connection))
                    {
                        bulkCopy.BulkCopyTimeout = 500;
                        bulkCopy.DestinationTableName = "tblImport";
                        for (int i = 0; i < 9; i++)
                            bulkCopy.ColumnMappings.Add(
                                mapping.Tables[0].Rows[0][i].ToString(),
                                destCols[i]);
                        try
                        {
                            bulkCopy.WriteToServer(dataTable);
                        }
                        catch (Exception ex)
                        {
                            AuditTrail(Convert.ToString(ex), "importFirst-BulkCopy", Convert.ToInt32(this.Session["EmpUID"]));
                            throw;
                        }
                    }
                }

                SqlParameter[] p = { new SqlParameter { ParameterName = "@PROVIDER", SqlDbType = SqlDbType.VarChar, Value = (int)this.Session["m_Provider"] } };
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_tblImport", p);
                this.dtImport = ds.Tables[0];
                this.Session["dtImport"] = ds.Tables[0];
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "importFirst", Convert.ToInt32(this.Session["EmpUID"]));
                throw;
            }
        }

        // ===================================================================
        //  ReadExcelSheet — reads any .xls or .xlsx sheet into a DataTable
        //  Uses ExcelDataReader which handles both formats natively.
        //  No drivers, no bitness dependency, MIT licensed.
        // ===================================================================
        private DataTable ReadExcelSheet(string filePath, string sheetName)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            using (var stream = System.IO.File.OpenRead(filePath))
            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
                var dataSet = reader.AsDataSet(new ExcelDataSetConfiguration
                {
                    ConfigureDataTable = _ => new ExcelDataTableConfiguration { UseHeaderRow = true }
                });

                foreach (DataTable tbl in dataSet.Tables)
                {
                    if (string.Equals(tbl.TableName, sheetName, StringComparison.OrdinalIgnoreCase))
                        return tbl;
                }

                throw new Exception($"Sheet '{sheetName}' not found in '{filePath}'.");
            }
        }

        // ===================================================================
        //  ReadAccessSheet — OleDb only for Access (.mde/.mdb)
        // ===================================================================
        private DataTable ReadAccessSheet(string filePath, string tableName)
        {
            var dt = new DataTable();
            string connStr = string.Format(
                "Provider=Microsoft.Jet.OLEDB.4.0;data source={0};User Id=admin;Password=;", filePath);
            using (var conn = new System.Data.OleDb.OleDbConnection(connStr))
            using (var adapter = new System.Data.OleDb.OleDbDataAdapter(
                       "SELECT * FROM [" + tableName + "]", conn))
            {
                adapter.Fill(dt);
            }
            return dt;
        }

        // ===================================================================
        //  UploadSetting — returns column names for the mapping screen
        //  .xls / .xlsx → ExcelDataReader
        //  .mde         → OleDb (Access)
        // ===================================================================
        public JsonResult UploadSetting(TIS.Models.Upload File)
        {
            try
            {
                string path = AppDomain.CurrentDomain.BaseDirectory + "Bills\\" + File.FileName;
                string ext = Path.GetExtension(path).ToLower();
                var columnList = new List<Column>();

                if (ext == ".xls" || ext == ".xlsx")
                {
                    System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
                    using (var stream = System.IO.File.OpenRead(path))
                    using (var reader = ExcelReaderFactory.CreateReader(stream))
                    {
                        var dataSet = reader.AsDataSet(new ExcelDataSetConfiguration
                        {
                            ConfigureDataTable = _ => new ExcelDataTableConfiguration { UseHeaderRow = true }
                        });
                        foreach (DataTable tbl in dataSet.Tables)
                        {
                            if (string.Equals(tbl.TableName, File.SheetName, StringComparison.OrdinalIgnoreCase))
                            {
                                foreach (DataColumn dc in tbl.Columns)
                                    columnList.Add(new Column { Cols = dc.ColumnName });
                                break;
                            }
                        }
                    }
                }
                else if (ext == ".mde")
                {
                    using (var conn = new System.Data.OleDb.OleDbConnection(
                               string.Format("Provider=Microsoft.Jet.OLEDB.4.0;Data Source={0};", path)))
                    using (var adapter = new System.Data.OleDb.OleDbDataAdapter(
                               string.Format("select * from [{0}]", File.SheetName), conn))
                    {
                        var ds = new DataSet();
                        conn.Open();
                        adapter.Fill(ds);
                        foreach (DataColumn dc in ds.Tables[0].Columns)
                            columnList.Add(new Column { Cols = dc.ColumnName });
                    }
                }

                return this.Json(new { Message = "Success", dtCol = columnList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "UploadSetting", Convert.ToInt32(this.Session["EmpUID"]));
                return this.Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }

        // ===================================================================
        //  BindGrid — unchanged
        // ===================================================================
        public DataTable BindGrid()
        {
            try
            {
                DataTable dt = new DataTable();
                DataRow[] source = this.dtImport.Select("[SUB_NO] is null OR [CALLDATE] is null OR [AMOUNT] is NULL");
                if (source.Length != 0)
                    dt = ((IEnumerable<DataRow>)source).CopyToDataTable<DataRow>();
                return dt;
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "BindGrid", Convert.ToInt32(this.Session["EmpUID"]));
                return null;
            }
        }

        // ===================================================================
        //  ProcessBill — unchanged (no Excel I/O here)
        // ===================================================================
        public JsonResult ProcessBill(TIS.Models.Upload File)
        {
            try
            {
                if (File.DbBased == "False")
                {
                    if (this.OpenExcelFile(this.Server.MapPath("~/Bills/" + this.Session["m_CurrentImportFile"].ToString())) == null)
                        return this.Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);

                    string currentFile = this.Session["m_CurrentImportFile"].ToString();
                    DateTime billDate = Convert.ToDateTime(((DateTime)this.Session["m_CurrentImportBillDate"]).ToString("yyyy-MM-dd"));
                    int providerId = (int)this.Session["m_Provider"];
                    string userId = Convert.ToString(this.Session["EmpUID"]);

                    DataTable dt = InsertUploadHistoryAndAudit(currentFile, billDate, providerId, "Success", userId);
                    return this.Json(new { Message = "succ", BillDetails = BuildBillDetails(dt) }, JsonRequestBehavior.AllowGet);
                }

                string currentFile2 = this.Session["m_CurrentImportFile"]?.ToString();
                DateTime billDate2 = Convert.ToDateTime(((DateTime)this.Session["m_CurrentImportBillDate"]).ToString("yyyy-MM-dd"));
                int providerId2 = (int)this.Session["m_Provider"];
                string providerName2 = this.Session["m_ProviderName"]?.ToString() ?? string.Empty;
                string userId2 = Convert.ToString(this.Session["EmpUID"]);

                DataTable dt2 = InsertUploadHistoryAndAudit(providerName2, billDate2, providerId2, "Success", userId2);
                return this.Json(new { Message = "succ", BillDetails = BuildBillDetails(dt2) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "ProcessBill", Convert.ToInt32(this.Session["EmpUID"]));
                return this.Json(new { Message = "Fail", BillDetails = "" }, JsonRequestBehavior.AllowGet);
            }
        }

        // ===================================================================
        //  InsertUploadHistoryAndAudit — unchanged
        // ===================================================================
        private DataTable InsertUploadHistoryAndAudit(string uploadFileName, DateTime billDate, int providerId, string status, string userId)
        {
            try
            {
                SqlParameter[] p = new SqlParameter[5];
                p[0] = new SqlParameter { ParameterName = "@UploadFileName", SqlDbType = SqlDbType.NVarChar, Size = 255, Value = (object)uploadFileName ?? DBNull.Value };
                p[1] = new SqlParameter { ParameterName = "@BillDate", SqlDbType = SqlDbType.DateTime, Value = billDate };
                p[2] = new SqlParameter { ParameterName = "@Provider", SqlDbType = SqlDbType.Int, Value = providerId };
                p[3] = new SqlParameter { ParameterName = "@Status", SqlDbType = SqlDbType.NVarChar, Size = 50, Value = (object)status ?? DBNull.Value };
                p[4] = new SqlParameter { ParameterName = "@UserID", SqlDbType = SqlDbType.NVarChar, Size = 100, Value = (object)userId ?? DBNull.Value };

                DataSet ds = DB.ExecuteStoredProcDataSet("sp_InsertUploadHistoryAndAudit", p);
                return (ds != null && ds.Tables.Count > 0) ? ds.Tables[0] : null;
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "InsertUploadHistoryAndAudit", Convert.ToInt32(this.Session["EmpUID"]));
                return null;
            }
        }

        // ===================================================================
        //  OpenExcelFile — unchanged (no Excel reading, calls SP)
        // ===================================================================
        protected object OpenExcelFile(string fileName)
        {
            try
            {
                string billDateStr = ((DateTime)this.Session["m_CurrentImportBillDate"]).ToString("yyyy-MM-dd");
                int provider = (int)this.Session["m_Provider"];
                try
                {
                    SqlParameter[] p = new SqlParameter[2];
                    p[0] = new SqlParameter { ParameterName = "@PROVIDER", SqlDbType = SqlDbType.Int, Value = provider };
                    p[1] = new SqlParameter { ParameterName = "@BILLDATE", SqlDbType = SqlDbType.DateTime, Value = billDateStr };

                    if (DB.ExecuteSpRetVal("sp_ImportInvoice", p) == 0)
                    {
                        ClearPreviousImport(provider, billDateStr, fileName);
                        AuditTrail("File data not insert successfully.", "OpenExcelFile", Convert.ToInt32(this.Session["EmpUID"]));
                        return null;
                    }
                    return new DataTable();
                }
                catch (Exception ex)
                {
                    ClearPreviousImport(provider, billDateStr, fileName);
                    string msg = Convert.ToString(ex).Replace("'", " ");
                    DB.ExecuteNonQuery("insert into vwTblUser_tblMaster (FORM_ID,ACTION_NAME,RESULT,USERID) values (9, 'Import Mobile Bills', 'Fail','" + this.Session["EmpUID"] + "')");
                    DB.ExecuteNonQuery("Insert into [vwTBLDetails_TBLMaster]([SNO],[AT_ID],[OLD_VALUE],[NEW_VALUE],[FIELD_NAME]) values (9, (select ID from TBL_AT_MASTER where date1 = (select max(date1) from TBL_AT_MASTER) ),'', '" + msg + "' ,'Import Bill')");
                    AuditTrail(Convert.ToString(ex), "OpenExcelFile", Convert.ToInt32(this.Session["EmpUID"]));
                    return null;
                }
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "OpenExcelFile", Convert.ToInt32(this.Session["EmpUID"]));
                return null;
            }
        }

        // ===================================================================
        //  ClearPreviousImport — unchanged
        // ===================================================================
        private void ClearPreviousImport(int provider, string billDateString, string fileName)
        {
            try
            {
                SqlParameter[] p = new SqlParameter[3];
                p[0] = new SqlParameter { ParameterName = "@Provider", SqlDbType = SqlDbType.Int, Value = provider };
                DateTime parsed;
                p[1] = new SqlParameter
                {
                    ParameterName = "@BillDate",
                    SqlDbType = SqlDbType.DateTime,
                    Value = DateTime.TryParse(billDateString, out parsed) ? (object)parsed : DBNull.Value
                };
                p[2] = new SqlParameter
                {
                    ParameterName = "@FileName",
                    SqlDbType = SqlDbType.VarChar,
                    Size = 200,
                    Value = (object)fileName ?? DBNull.Value
                };
                DB.ExecuteStoredProc("sp_ClearPreviousImport", p);
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "ClearPreviousImport", Convert.ToInt32(this.Session["EmpUID"]));
            }
        }

        // ===================================================================
        //  SendEmail — unchanged
        // ===================================================================
        public JsonResult SendEmail()
        {
            try
            {
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetEmailPipeLine");
                if (ds != null && ds.Tables[0].Rows.Count > 0)
                {
                    try
                    {
                        foreach (DataRow row in ds.Tables[0].Rows)
                        {
                            var message = new MailMessage();
                            message.To.Add(row["EmailTo"].ToString());
                            if (!string.IsNullOrEmpty(row["CC"].ToString()))
                                message.CC.Add(row["CC"].ToString());
                            message.From = new MailAddress(row["EmailFrom"].ToString());
                            message.Sender = new MailAddress(row["EmailFrom"].ToString());
                            message.Subject = row["Subject"].ToString();
                            message.Body = row["EmailText"].ToString();
                            message.IsBodyHtml = true;
                            new SmtpClient(ds.Tables[2].Rows[0]["smtpsettings"].ToString()) { UseDefaultCredentials = true }.Send(message);

                            SqlParameter[] p = { new SqlParameter { ParameterName = "@id", SqlDbType = SqlDbType.Int, Value = row["Id"].ToString() } };
                            DB.ExecuteStoredProcDataSet("sp_MarkAsSent", p);
                        }
                        return this.Json(new { Message = "Email Sent" }, JsonRequestBehavior.AllowGet);
                    }
                    catch (Exception ex)
                    {
                        AuditTrail(Convert.ToString(ex), "SendEmail", Convert.ToInt32(this.Session["EmpUID"]));
                    }
                }
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "SendEmail", Convert.ToInt32(this.Session["EmpUID"]));
            }
            return this.Json(new { Message = "Email Sent Fail" }, JsonRequestBehavior.AllowGet);
        }

        // ===================================================================
        //  UpdateImport — unchanged
        // ===================================================================
        public JsonResult UpdateImport(Import Import)
        {
            try
            {
                DateTime dt = Convert.ToDateTime(Import.CALLDATE);
                DB.ExecuteNonQuery("update tblImport set AMOUNT='" + Import.AMOUNT + "',SUB_NO='" + Import.SUB_NO + "',BILLNUMBER='" + Import.SUB_NO + "',CALLDATE='" + dt + "' where ID=" + Import.ID);
                DataSet data = DB.GetData("Select * from tblImport where SUB_NO is null or CALLDATE is null or AMOUNT is null");
                var importList = new List<Import>();
                if (data != null)
                    foreach (DataRow row in data.Tables[0].Rows)
                        importList.Add(MapImportRow(row));

                return this.Json(new { Message = "Success", dtImp = importList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "UpdateImport", Convert.ToInt32(this.Session["EmpUID"]));
                return this.Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }

        // ===================================================================
        //  UpdateSetting — unchanged
        // ===================================================================
        public JsonResult UpdateSetting(Column Clm)
        {
            try
            {
                SqlParameter[] p = new SqlParameter[11];
                p[0] = new SqlParameter { ParameterName = "@Col1", SqlDbType = SqlDbType.VarChar, Value = Clm.Col1 };
                p[1] = new SqlParameter { ParameterName = "@Col2", SqlDbType = SqlDbType.VarChar, Value = Clm.Col2 };
                p[2] = new SqlParameter { ParameterName = "@Col3", SqlDbType = SqlDbType.VarChar, Value = Clm.Col3 };
                p[3] = new SqlParameter { ParameterName = "@Col4", SqlDbType = SqlDbType.VarChar, Value = Clm.Col4 };
                p[4] = new SqlParameter { ParameterName = "@Col5", SqlDbType = SqlDbType.VarChar, Value = Clm.Col5 };
                p[5] = new SqlParameter { ParameterName = "@Col6", SqlDbType = SqlDbType.VarChar, Value = Clm.Col6 };
                p[6] = new SqlParameter { ParameterName = "@Col7", SqlDbType = SqlDbType.VarChar, Value = Clm.Col7 };
                p[7] = new SqlParameter { ParameterName = "@Col8", SqlDbType = SqlDbType.VarChar, Value = Clm.Col8 };
                p[8] = new SqlParameter { ParameterName = "@Provider", SqlDbType = SqlDbType.VarChar, Value = Clm.Provider };
                p[9] = new SqlParameter { ParameterName = "@dbConstr", SqlDbType = SqlDbType.VarChar, Value = Clm.dbConstr };
                p[10] = new SqlParameter { ParameterName = "@dbTableName", SqlDbType = SqlDbType.VarChar, Value = Clm.dbTableName };
                DB.ExecuteStoredProc("sp_UploadSetting", p);
                return this.Json(new { Message = "Settings Updated Sucessfully" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "UploadSetting", Convert.ToInt32(this.Session["EmpUID"]));
                return this.Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }

        // ===================================================================
        //  GetSetting — unchanged
        // ===================================================================
        public JsonResult GetSetting(Column Clm)
        {
            try
            {
                string dbBased = DB.GetValue("SELECT DbBased FROM tblProvider where ID = '" + Clm.Provider + "' ");
                DataTable table = DB.GetData("Select * from tblProvider where ID='" + Clm.Provider + "'").Tables[0];
                Column column = MapColumnFromTable(table);

                if (dbBased == "True")
                {
                    column.dbConstr = table.Rows[0]["dbConstr"].ToString();
                    column.dbTableName = table.Rows[0]["dbTableName"].ToString();
                    return this.Json(new { dtDBCol = column }, JsonRequestBehavior.AllowGet);
                }
                return this.Json(new { dtCol = column }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "GetSetting", Convert.ToInt32(this.Session["EmpUID"]));
                return this.Json(new { Message = "Fail", dtCol = "" }, JsonRequestBehavior.AllowGet);
            }
        }

        // ===================================================================
        //  DeleteBill — unchanged
        // ===================================================================
        public JsonResult DeleteBill(TIS.Models.Upload Upload)
        {
            try
            {
                SqlParameter[] p = new SqlParameter[2];
                p[0] = new SqlParameter { ParameterName = "@Provider", SqlDbType = SqlDbType.Int, Value = Upload.ProviderID };
                p[1] = new SqlParameter { ParameterName = "@BillDate", SqlDbType = SqlDbType.DateTime, Value = Upload.BillDate };
                DB.ExecuteStoredProc("sp_DeleteBill", p);
                return this.Json(new { myMessage = "succ" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "DeleteBill", Convert.ToInt32(this.Session["EmpUID"]));
                return this.Json(new { myMessage = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }

        // ===================================================================
        //  GetUnAssignedBill — unchanged
        // ===================================================================
        public JsonResult GetUnAssignedBill()
        {
            int countryId = Convert.ToInt32(this.Session["CountryID"].ToString());
            int roleId = Convert.ToInt32(this.Session["EmpRoleID"].ToString());
            try
            {
                DataSet data = DB.GetData(roleId != 8
                    ? "SELECT * FROM [vw_Unassign_Grid] where CountryID='" + countryId + "'"
                    : "SELECT * FROM [vw_Unassign_Grid]");

                var billList = new List<Bill>();
                foreach (DataRow row in data.Tables[0].Rows)
                    billList.Add(new Bill
                    {
                        BillDate = Convert.ToDateTime(row["BILLDATE"].ToString()),
                        Mobile = row["Mobile"].ToString(),
                        ProviderName = row["Provider"].ToString(),
                        TotalAmount = Convert.ToDouble(row["BillAmount"].ToString())
                    });

                return this.Json(new { Bills = billList }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "GetUnAssignedBill", Convert.ToInt32(this.Session["EmpUID"]));
                return this.Json("'Fail':'true'");
            }
        }

        public JsonResult AssignInvoice() =>
            this.Json(new { Message = Convert.ToString(DB.ExecuteSpRetVal("sp_AssignInvoice", null)) + " Bills Generated" },
                      JsonRequestBehavior.AllowGet);

        // ===================================================================
        //  GetDataSetting — unchanged
        // ===================================================================
        public JsonResult GetDataSetting(Column Clm)
        {
            try
            {
                DataTable table = DB.GetData("Select * from tblProvider where ID='" + Clm.Provider + "'").Tables[0];
                Column col = MapColumnFromTable(table);
                col.dbConstr = table.Rows[0]["dbConstr"].ToString();
                col.dbTableName = table.Rows[0]["dbTableName"].ToString();
                return this.Json(new { dtDBCol = col }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "GetDataSetting", Convert.ToInt32(this.Session["EmpUID"]));
                return this.Json("'Fail':'true'");
            }
        }

        // ===================================================================
        //  UploadDataSetting — uses OleDb for a SQL Server connection string
        //  (this is NOT an Excel OleDb call; it connects to another SQL
        //   database via an OleDb connection string entered by the user)
        //  Left unchanged — the OleDb here is for SQL Server, not Excel.
        // ===================================================================
        public JsonResult UploadDataSetting(Column value)
        {
            try
            {
                using (var conn = new System.Data.OleDb.OleDbConnection(value.dbConstr))
                using (var adapter = new System.Data.OleDb.OleDbDataAdapter(
                           string.Format("select * from [{0}]", value.dbTableName), conn))
                {
                    var ds = new DataSet();
                    conn.Open();
                    adapter.Fill(ds);
                    conn.Close();
                    var columnList = new List<Column>();
                    foreach (DataColumn dc in ds.Tables[0].Columns)
                        columnList.Add(new Column { Cols = dc.ColumnName });

                    return this.Json(new { Message = "Success", dtCol = columnList }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "UploadDataSetting", Convert.ToInt32(this.Session["EmpUID"]));
                return this.Json("'Fail':'true'");
            }
        }

        // ===================================================================
        //  UpdateDBSetting — unchanged
        // ===================================================================
        public JsonResult UpdateDBSetting(Column Clm)
        {
            try
            {
                SqlParameter[] p = new SqlParameter[11];
                p[0] = new SqlParameter { ParameterName = "@Col1", SqlDbType = SqlDbType.VarChar, Value = Clm.Col1 };
                p[1] = new SqlParameter { ParameterName = "@Col2", SqlDbType = SqlDbType.VarChar, Value = Clm.Col2 };
                p[2] = new SqlParameter { ParameterName = "@Col3", SqlDbType = SqlDbType.VarChar, Value = Clm.Col3 };
                p[3] = new SqlParameter { ParameterName = "@Col4", SqlDbType = SqlDbType.VarChar, Value = Clm.Col4 };
                p[4] = new SqlParameter { ParameterName = "@Col5", SqlDbType = SqlDbType.VarChar, Value = Clm.Col5 };
                p[5] = new SqlParameter { ParameterName = "@Col6", SqlDbType = SqlDbType.VarChar, Value = Clm.Col6 };
                p[6] = new SqlParameter { ParameterName = "@Col7", SqlDbType = SqlDbType.VarChar, Value = Clm.Col7 };
                p[7] = new SqlParameter { ParameterName = "@Col8", SqlDbType = SqlDbType.VarChar, Value = Clm.Col8 };
                p[8] = new SqlParameter { ParameterName = "@Provider", SqlDbType = SqlDbType.VarChar, Value = Clm.Provider };
                p[9] = new SqlParameter { ParameterName = "@dbConstr", SqlDbType = SqlDbType.VarChar, Value = Clm.dbConstr };
                p[10] = new SqlParameter { ParameterName = "@dbTableName", SqlDbType = SqlDbType.VarChar, Value = Clm.dbTableName };
                DB.ExecuteStoredProc("sp_UploadDBSetting", p);
                return this.Json(new { Message = "Settings Updated Sucessfully" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "UpdateDBSetting", Convert.ToInt32(this.Session["EmpUID"]));
                return this.Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }

        // ===================================================================
        //  CheckProvider — unchanged
        // ===================================================================
        public JsonResult CheckProvider(Column value) =>
            this.Json(new { DbBased = DB.GetValue("SELECT DbBased FROM tblProvider where ID = '" + value.Provider + "' ") },
                      JsonRequestBehavior.AllowGet);

        // ===================================================================
        //  TestConn — unchanged (OleDb used for SQL Server, not Excel)
        // ===================================================================
        public JsonResult TestConn(Column value)
        {
            try
            {
                using (var conn = new System.Data.OleDb.OleDbConnection(value.dbConstr))
                using (var adapter = new System.Data.OleDb.OleDbDataAdapter("Select * from sys.views", conn))
                {
                    var ds = new DataSet();
                    conn.Open();
                    adapter.Fill(ds);
                    conn.Close();
                    var columnList = new List<Column>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                        columnList.Add(new Column { Views = row[0].ToString() });

                    return this.Json(new { Message = "Success", dtViews = columnList }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "TestConn", Convert.ToInt32(this.Session["EmpUID"]));
                return this.Json(new { Error = "Cannot Connect, Please Contact Your Manager" }, JsonRequestBehavior.AllowGet);
            }
        }

        // ===================================================================
        //  importDataFirst — DB-based import, unchanged
        // ===================================================================
        private void importDataFirst(string View, string sqlConstr, int Month, int Year)
        {
            try
            {
                if (string.IsNullOrEmpty(View))
                    throw new Exception("View is empty! Cannot import data.");

                int maxId = Convert.ToInt32("0" + DB.GetValue("select max(ID) from tblcallrecord"));
                DB.ExecuteNonQuery("delete from tblImport");
                DB.ExecuteNonQuery(" DBCC CHECKIDENT (tblIMPORT, RESEED, " + maxId + ")");

                string billDateStr = ((DateTime)this.Session["m_CurrentImportBillDate"]).ToString("yyyy-MM-dd");
                DataTable dt = new DataTable();
                string sql = $"SELECT *, '{billDateStr}' as BillDateNew FROM {View} WHERE Month(CallDate) = {Month} AND Year(CallDate) = {Year}";

                string[] destCols = { "SUB_NO", "BILLDATE", "CALLDATE", "TRANS_TYPE", "DESCRIPTION", "CALLTIME", "DURATION", "AMOUNT", "BILLNUMBER" };
                DataSet mapping = DB.GetData(
                    "select [excel_col1],'BillDateNew' as [excel_col2],[excel_col3],[excel_col4],[excel_col5],[excel_col6],[excel_col7],[excel_col8],[excel_col9] from tblProvider where id = '" +
                    (int)this.Session["m_Provider"] + "'");

                string dbConn = DB.GetDBConn();
                using (SqlConnection connection = new SqlConnection(dbConn))
                {
                    connection.Open();
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(connection))
                    {
                        bulkCopy.BulkCopyTimeout = 500;
                        bulkCopy.DestinationTableName = "tblImport";
                        for (int i = 0; i < 9; i++)
                            bulkCopy.ColumnMappings.Add(mapping.Tables[0].Rows[0][i].ToString(), destCols[i]);
                        bulkCopy.WriteToServer(dt);
                    }
                }

                SqlParameter[] p = { new SqlParameter { ParameterName = "@PROVIDER", SqlDbType = SqlDbType.VarChar, Value = (int)this.Session["m_Provider"] } };
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_tblImport", p);
                this.dtImport = ds.Tables[0];
                this.Session["dtImport"] = ds.Tables[0];
            }
            catch (Exception ex)
            {
                AuditTrail(Convert.ToString(ex), "importDataFirst", Convert.ToInt32(this.Session["EmpUID"]));
                throw;
            }
        }

        // ===================================================================
        //  Private helpers
        // ===================================================================

        private static Import MapImportRow(DataRow row) => new Import
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
        };

        private static Column MapColumnFromTable(DataTable table) => new Column
        {
            Col1 = table.Rows[0]["excel_col1"].ToString(),
            Col2 = table.Rows[0]["excel_col2"].ToString(),
            Col3 = table.Rows[0]["excel_col3"].ToString(),
            Col4 = table.Rows[0]["excel_col4"].ToString(),
            Col5 = table.Rows[0]["excel_col5"].ToString(),
            Col6 = table.Rows[0]["excel_col6"].ToString(),
            Col7 = table.Rows[0]["excel_col7"].ToString(),
            Col8 = table.Rows[0]["excel_col8"].ToString()
        };

        private static object BuildBillDetails(DataTable dt)
        {
            if (dt == null || dt.Rows.Count == 0)
                return new
                {
                    BilledButNotInSystem = new { CountOfBills = 0, TotalAmount = 0.00 },
                    InSystemButNotAssigned = new { CountOfBills = 0, TotalAmount = 0.00 },
                    AssignedButOutsideValidDates = new { CountOfBills = 0, TotalAmount = 0.00 }
                };

            DataRow r = dt.Rows[0];
            int b1c = 0, b2c = 0, b3c = 0;
            double b1a = 0, b2a = 0, b3a = 0;
            int.TryParse(Convert.ToString(r["BilledButNotInSystem_Count"]), out b1c);
            double.TryParse(Convert.ToString(r["BilledButNotInSystem_Amount"]), out b1a);
            int.TryParse(Convert.ToString(r["InSystemButNotAssigned_Count"]), out b2c);
            double.TryParse(Convert.ToString(r["InSystemButNotAssigned_Amount"]), out b2a);
            int.TryParse(Convert.ToString(r["AssignedButOutsideValidDates_Count"]), out b3c);
            double.TryParse(Convert.ToString(r["AssignedButOutsideValidDates_Amount"]), out b3a);

            return new
            {
                BilledButNotInSystem = new { CountOfBills = b1c, TotalAmount = b1a },
                InSystemButNotAssigned = new { CountOfBills = b2c, TotalAmount = b2a },
                AssignedButOutsideValidDates = new { CountOfBills = b3c, TotalAmount = b3a }
            };
        }

        private void AuditTrail(string exMsg, string eventName, int uid)
        {
            SqlParameter[] p = new SqlParameter[5];
            p[0] = new SqlParameter { ParameterName = "@Uid", SqlDbType = SqlDbType.Int, Value = uid };
            p[1] = new SqlParameter { ParameterName = "@EventName", SqlDbType = SqlDbType.NVarChar, Value = eventName };
            p[2] = new SqlParameter { ParameterName = "@EventType", SqlDbType = SqlDbType.NVarChar, Value = "Fail" };
            p[3] = new SqlParameter { ParameterName = "@EventMsg", SqlDbType = SqlDbType.NVarChar, Value = exMsg };
            p[4] = new SqlParameter { ParameterName = "@EventSeverity", SqlDbType = SqlDbType.NVarChar, Value = "severity_high" };
            DB.ExecuteStoredProcDataSet("sp_CreateException", p);
        }
    }
}
