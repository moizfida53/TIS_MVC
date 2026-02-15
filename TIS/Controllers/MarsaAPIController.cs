using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using TIS.Helper;

namespace TIS.Controllers
{
    public class MarsaAPIController : Controller
    {
        //
        // GET: /MarsaAPI/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetCountofBillsByUserName(string userName)
        {
            try
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@userName",
                                       SqlDbType=SqlDbType.NVarChar,
                                       Value=userName
                                    }
                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("API_GetCountofBillsByUserName", spa);
                if(ds!=null)
                {
                    if(ds.Tables.Count > 0)
                    {
                        return Json(new { Message = "Success", countofBills = ds.Tables[0].Rows[0]["CountOfBill"] }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { Message = "No Data Found" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetPendingApprovalCountByUserName(string userName)
        {
            try
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@userName",
                                       SqlDbType=SqlDbType.NVarChar,
                                       Value=userName
                                    }
                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("API_GetPendingApprovalCountByUserName", spa);
                if (ds != null)
                {
                    if (ds.Tables.Count > 0)
                    {
                        return Json(new { Message = "Success", countofBills = ds.Tables[0].Rows[0]["CountOfBill"] }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { Message = "No Data Found" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetBillDetailsByBillId(int billId)
        {
            try
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@billId",
                                       SqlDbType=SqlDbType.Int,
                                       Value=billId
                                    }
                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("API_GetBillDetailsByBillId", spa);
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DataTable dtDisptachData = ds.Tables[0];
                        List<APIBillDetails> objBillList = new List<APIBillDetails>();
                        
                        if (dtDisptachData.Rows.Count > 0)
                        {
                            foreach (DataRow dtRow in dtDisptachData.Rows)
                            {
                                APIBillDetails objBill = new APIBillDetails();
                                objBill.BILL_ID = Convert.ToInt32(dtRow["BILL_ID"].ToString());
                                objBill.BILLDATE = Convert.ToDateTime(dtRow["BILLDATE"].ToString());
                                objBill.SUB_NO = dtRow["SUB_NO"].ToString();
                                objBill.NAME = dtRow["NAME"].ToString();
                                objBill.ORG = dtRow["ORG"].ToString();
                                objBill.TOTALAMOUNT = Convert.ToDecimal(dtRow["TOTALAMOUNT"]);
                                objBill.BUSSINESSLIMIT = Convert.ToDecimal(dtRow["BUSSINESSLIMIT"]);
                                objBill.BUSINESSCHARGES = Convert.ToDecimal(dtRow["BUSINESSCHARGES"]);
                                objBill.DEDUCTIBLEAMOUNT = Convert.ToDecimal(dtRow["DEDUCTIBLEAMOUNT"]);
                                objBill.WAIVERAMOUNT = Convert.ToDecimal(dtRow["WAIVERAMOUNT"]);
                                objBill.COMMENTS = dtRow["COMMENTS"].ToString();
                                objBillList.Add(objBill);
                            }
                        }
                        return Json(new { Message = "Success", data = objBillList }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { Message = "No Data Found" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult UpdateBillByBillId(int billId, int status, string comments)
        {
            try
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@billId",
                                       SqlDbType=SqlDbType.Int,
                                       Value=billId
                                    },
                                       new SqlParameter(){
                                       ParameterName="@status",
                                       SqlDbType=SqlDbType.Int,
                                       Value=status
                                    },
                                       new SqlParameter(){
                                       ParameterName="@comments",
                                       SqlDbType=SqlDbType.NVarChar,
                                       Value=comments
                                    }
                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("API_UpdateBillByBillId", spa);
                if (ds != null)
                {
                    if (ds.Tables.Count > 0)
                    {
                        if(ds.Tables[0].Rows[0]["Status"].ToString()== "Success")
                        {
                            return Json(new { Message = "Success" }, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
                return Json(new { Message = "Not Updated" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ApprovalBillList(string Username)
        {
            try
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@Username",
                                       SqlDbType=SqlDbType.NVarChar,
                                       Value=Username
                                    }
                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("API_ApprovalBillList", spa);
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DataTable dtApprovalBillData = ds.Tables[0];
                        List<APIApprovalBillDetails> objBillList = new List<APIApprovalBillDetails>();

                        if (dtApprovalBillData.Rows.Count > 0)
                        {
                            foreach (DataRow dtRow in dtApprovalBillData.Rows)
                            {
                                APIApprovalBillDetails objBill = new APIApprovalBillDetails();
                                objBill.BillID = Convert.ToInt32(dtRow["BillID"].ToString());
                                objBill.BillAmount = Convert.ToDecimal(dtRow["BillAmount"]);
                                objBill.BillDate = Convert.ToDateTime(dtRow["BillDate"].ToString());
                                objBill.EmployeeName = dtRow["EmployeeName"].ToString();
                                objBill.MobileNumber = dtRow["MobileNumber"].ToString();
                                
                                objBill.BusinessCharges = Convert.ToDecimal(dtRow["BusinessCharges"]);
                                objBill.PersonalCharges = Convert.ToDecimal(dtRow["PersonalCharges"]);
                                objBill.WaiverAmount = Convert.ToDecimal(dtRow["WaiverAmount"]);
                                objBill.WaiverComment = dtRow["WaiverComment"].ToString();
                                objBill.BussinessLimitCharges = Convert.ToDecimal(dtRow["BussinessLimitCharges"]);
                                objBill.Department = dtRow["Department"].ToString();
                                objBill.BussinessLimit = Convert.ToDecimal(dtRow["BussinessLimit"]);
                                objBill.DeductibleAmount = Convert.ToDecimal(dtRow["DeductibleAmount"]);
                                objBillList.Add(objBill);
                            }
                        }
                        return Json(new { Message = "Success", data = objBillList }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { Message = "No Data Found" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
            }
        }
        
    }

    public class APIBillDetails
    {
        public int BILL_ID { get; set; }
        public DateTime? BILLDATE { get; set; }
        public string SUB_NO { get; set; }
        public string NAME { get; set; }
        public string ORG { get; set; }
        public decimal TOTALAMOUNT { get; set; }
        public decimal BUSSINESSLIMIT { get; set; }
        public decimal BUSINESSCHARGES { get; set; }
        public decimal DEDUCTIBLEAMOUNT { get; set; }
        public decimal WAIVERAMOUNT { get; set; }
        public string COMMENTS { get; set; }
    }

    public class APIApprovalBillDetails
    {
        public int BillID { get; set; }
        public decimal BillAmount { get; set; }
        public DateTime? BillDate { get; set; }
        public string EmployeeName { get; set; }
        public string MobileNumber { get; set; }
        public decimal BusinessCharges { get; set; }
        public decimal PersonalCharges { get; set; }
        public decimal WaiverAmount { get; set; }
        public string WaiverComment { get; set; }
        public decimal BussinessLimitCharges { get; set; }
        public string Department { get; set; }
        public decimal BussinessLimit { get; set; }
        public decimal DeductibleAmount { get; set; }
    }
}
