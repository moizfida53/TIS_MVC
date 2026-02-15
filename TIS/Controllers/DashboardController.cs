using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TIS.Models;
using System.Data;
using TIS.Helper;
using System.Data.SqlClient;
using Newtonsoft.Json;

namespace TIS.Controllers
{
    public class DashboardController : Controller
    {
        // GET: Home
        transactiontype Chartdata = new transactiontype();
        public ActionResult Index()
        {
            string str1 = this.Session["EmpLoginAs"].ToString();
            if (str1 == null)
                return (ActionResult)this.View("AccessDenied");
            return View();
        }
        public ActionResult IndexNew()
        {
            object sessionValue = this.Session["EmpLoginAs"];
            // If the session value is missing or empty, hide the AccessDenideContainer div
            if (sessionValue == null || string.IsNullOrWhiteSpace(sessionValue.ToString()))
            {
                return (ActionResult)this.View("AccessDenied");
            }
            return View();
        }
        public JsonResult GetDashboardData()
        {
            try
            {
                //SqlParameter[] spa ={
                //                       new SqlParameter(){
                //                       ParameterName="@Year",
                //                       SqlDbType=SqlDbType.Int,
                //                       Value=Year
                //                    }
                //                    //   , new SqlParameter(){
                //                    //   ParameterName="@ToDate",
                //                    //   SqlDbType=SqlDbType.Date,
                //                    //   Value=ToDate
                //                    //}
                //               };
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetDashboardData");

                string noOfUnIdentifiedBills = ds.Tables[0].Rows[0][0].ToString();
                string totalAmountofUnAssignedBills = ds.Tables[1].Rows[0][0].ToString();
                string totalBillsinApprovalStage = ds.Tables[2].Rows[0][0].ToString();
                string totalBillAmountforPOSTTOSAP = ds.Tables[3].Rows[0][0].ToString();

                DataTable dashboardChart1 = ds.Tables[4];
                DataTable dashboardChart2 = ds.Tables[5];
                DataTable dashboardChart3 = ds.Tables[6];
                DataTable dashboardChart4 = ds.Tables[7];

                string JSONString = JsonConvert.SerializeObject(dashboardChart1);
                string JSONString1 = JsonConvert.SerializeObject(dashboardChart2);
                string JSONString2 = JsonConvert.SerializeObject(dashboardChart3);
                string JSONString3 = JsonConvert.SerializeObject(dashboardChart4);


                return Json(new
                {
                    Message = "Success",
                    noOfUnIdentifiedBills = noOfUnIdentifiedBills,
                    totalAmountofUnAssignedBills = totalAmountofUnAssignedBills,
                    totalBillsinApprovalStage = totalBillsinApprovalStage,
                    totalBillAmountforPOSTTOSAP = totalBillAmountforPOSTTOSAP,
                    dashboardChart1 = JSONString,
                    dashboardChart2 = JSONString1,
                    dashboardChart3 = JSONString2,
                    dashboardChart4 = JSONString3,
                    //DiscountTypeWiseSales = JSONString4,
                    //PaymentTypeWiseSales = JSONString5,
                    //Itemwisecancellation = JSONString6,
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);
                //var Message = ex.ToString();
                //var Function = "Home/GetDashboardData";

                //SqlParameter[] spa ={
                //                       new SqlParameter(){
                //                       ParameterName="@Message",
                //                       SqlDbType=SqlDbType.NVarChar,
                //                       Value=Message
                //                    }, new SqlParameter(){
                //                       ParameterName="@Function",
                //                       SqlDbType=SqlDbType.NVarChar,
                //                       Value=Function
                //                    }
                //               };

                //var Exc = DB.ExecuteStoredProc("sp_AuditTrail", spa);
                //return Json("'Fail':'true'");
            }

        }





        public JsonResult GetDashboardchart1data(int Year)
        {
            try
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@Year",
                                       SqlDbType=SqlDbType.Int,
                                       Value=Year
                                    }
                                    //   , new SqlParameter(){
                                    //   ParameterName="@ToDate",
                                    //   SqlDbType=SqlDbType.Date,
                                    //   Value=ToDate
                                    //}
                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetDashboardChart1", spa);

                DataTable TopBranchSales = ds.Tables[0];

                string JSONString = JsonConvert.SerializeObject(TopBranchSales);


                return Json(new
                {
                    Message = "Success",

                    TopBranchSales = JSONString,

                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);

            }

        }




        public JsonResult GetDashboardchart2data(int Year, string TRANS_TYPE)
        {
            try
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@Year",
                                       SqlDbType=SqlDbType.Int,
                                       Value=Year
                                    }
                                       , new SqlParameter(){
                                       ParameterName="@TRANS_TYPE",
                                       SqlDbType=SqlDbType.NVarChar,
                                       Value=TRANS_TYPE
                                    }
                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetDashboardChart2", spa);

                DataTable TranstypewiseData = ds.Tables[0];

                string JSONString = JsonConvert.SerializeObject(TranstypewiseData);


                return Json(new
                {
                    Message = "Success",

                    TranstypewiseData = JSONString,

                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);

            }

        }



        public JsonResult GetDashboardchart3data(string Month, int Year)
        {
            try
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@Year",
                                       SqlDbType=SqlDbType.Int,
                                       Value=Year
                                    }
                                       , new SqlParameter(){
                                       ParameterName="@Month",
                                       SqlDbType=SqlDbType.Int,
                                       Value=Month
                                    }
                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetDashboardChart3", spa);

                DataTable monthTranstypewiseData = ds.Tables[0];

                string JSONString = JsonConvert.SerializeObject(monthTranstypewiseData);


                return Json(new
                {
                    Message = "Success",

                    monthTranstypewiseData = JSONString,

                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);

            }

        }


        public JsonResult GetDashboardchart4data(int Year)
        {
            try
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@Year",
                                       SqlDbType=SqlDbType.Int,
                                       Value=Year
                                    }
                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetDashboardChart4", spa);

                DataTable TopBranchSales = ds.Tables[0];

                string JSONString = JsonConvert.SerializeObject(TopBranchSales);


                return Json(new
                {
                    Message = "Success",

                    TopBranchSales = JSONString,

                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);

            }

        }

        public JsonResult GetDashboardchart5data(int Year, string calltypename)
        {
            try
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@Year",
                                       SqlDbType=SqlDbType.Int,
                                       Value=Year }
                                         , new SqlParameter(){
                                       ParameterName="@calltypename",
                                       SqlDbType=SqlDbType.NVarChar,
                                       Value=calltypename
                                    }
                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetDashboardChart5", spa);

                DataTable calltypemonthlysale = ds.Tables[0];

                string JSONString = JsonConvert.SerializeObject(calltypemonthlysale);


                return Json(new
                {
                    Message = "Success",

                    calltypemonthlysale = JSONString,

                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);

            }

        }


        public JsonResult GetDashboardchart6data(int Year, string Call_type)
        {
            try
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@Year",
                                       SqlDbType=SqlDbType.Int,
                                       Value=Year }
                                         , new SqlParameter(){
                                       ParameterName="@Call_type",
                                       SqlDbType=SqlDbType.NVarChar,
                                       Value=Call_type
                                    }
                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetDashboardChart6", spa);

                DataTable TopBranchSales = ds.Tables[0];

                string JSONString = JsonConvert.SerializeObject(TopBranchSales);


                return Json(new
                {
                    Message = "Success",

                    TopBranchSales = JSONString,

                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);

            }

        }

        public JsonResult GetDashboardchart7data(int Year, string OUT_COUNTRY, string Call_type)
        {
            try
            {
                SqlParameter[] spa ={
                                       new SqlParameter(){
                                       ParameterName="@Year",
                                       SqlDbType=SqlDbType.Int,
                                       Value=Year }
                                         , new SqlParameter(){
                                       ParameterName="@Call_type",
                                       SqlDbType=SqlDbType.NVarChar,
                                       Value=Call_type
                                    }    , new SqlParameter(){
                                       ParameterName="@OUT_COUNTRY",
                                       SqlDbType=SqlDbType.NVarChar,
                                       Value=OUT_COUNTRY
                                    }
                               };
                DataSet ds = DB.ExecuteStoredProcDataSet("sp_GetDashboardChart7", spa);

                DataTable countrymonthlysale = ds.Tables[0];

                string JSONString = JsonConvert.SerializeObject(countrymonthlysale);


                return Json(new
                {
                    Message = "Success",

                    countrymonthlysale = JSONString,

                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { Message = "Fail" }, JsonRequestBehavior.AllowGet);

            }

        }



        public JsonResult Gettranstypedata()
        {
            var Chart = Chartdata.Gettranstype();
            return Json(Chart, JsonRequestBehavior.AllowGet);
        }



        public JsonResult Getcalltypedetails(int Year)
        {
            var Chart = Chartdata.Getcalltype(Year);
            return Json(Chart, JsonRequestBehavior.AllowGet);
        }



        public JsonResult GetINTCALLCNTdetails(int Year, string Call_type)
        {
            var Chart = Chartdata.GetINTCNT(Year, Call_type);
            return Json(Chart, JsonRequestBehavior.AllowGet);
        }



        public JsonResult Getallcountryingrid(int year)
        {
            var Chart = Chartdata.getcountrydetailsingrid(year);
            return Json(Chart, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Getallcountryingridmonthwise(int year, int month)
        {
            var Chart = Chartdata.getcountrymonthwiseingrid(year, month);
            return Json(Chart, JsonRequestBehavior.AllowGet);
        }

    }
}