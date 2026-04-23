using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Mvc;
using TIS.Filters;

namespace TIS.Controllers.Controllers
{
    [RoleAuthorize(Roles.SuperAdmin)]
    
    public class TelephoneController : Controller
    {
        // Loads the Manage Telephone page
        public ActionResult Telephone()
        {
            if (Session["EmpLoginName"] == null)
                return View("AccessDenied");

            return View();
        }

        // AJAX endpoint for Line Type dropdown
        public JsonResult GetLineTypes()
        {
            DataTable dt = new DataTable();

            using (SqlConnection con = new SqlConnection(
                   ConfigurationManager.ConnectionStrings["SqlServerConnection"].ConnectionString))
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

        // AJAX endpoint for Cost Center dropdown
        public JsonResult GetCostCenter()
        {
            DataTable dt = new DataTable();

            using (SqlConnection con = new SqlConnection(
                ConfigurationManager.ConnectionStrings["SqlServerConnection"].ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetCostCenter", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dt);
                }
            }

            var data = dt.AsEnumerable().Select(x => new
            {
                Id = x.Field<int>("Id"),
                Code = x.Field<string>("Code"),
                Name = x.Field<string>("CostCenter_Name")
            }).ToList();

            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}
