using System;
using System.Configuration;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Web.Configuration;
using System.Web.Mvc;

namespace TIS.Controllers
{
    public class ADTestController : Controller
    {
        // ── Connection settings ────────────────────────────────────────────
        private static string AdDomain => WebConfigurationManager.AppSettings["AD.Domain"] ?? string.Empty;
        private static string AdLdapPath => WebConfigurationManager.AppSettings["AD.LdapPath"] ?? string.Empty;

        // ── AD attribute mappings (configurable from Web.config) ───────────
        // These define WHICH AD attribute name to read for each field.
        // Change the values in Web.config without touching this code.
        private static string AttrDisplayName => WebConfigurationManager.AppSettings["AD.Attr.DisplayName"] ?? "displayName";
        private static string AttrEmail => WebConfigurationManager.AppSettings["AD.Attr.Email"] ?? "mail";
        private static string AttrDepartment => WebConfigurationManager.AppSettings["AD.Attr.Department"] ?? "department";
        private static string AttrEmployeeNumber => WebConfigurationManager.AppSettings["AD.Attr.EmployeeNumber"] ?? "employeeNumber";

        // ── Ensures any unhandled exception returns JSON, not an HTML error page
        protected override void OnException(ExceptionContext filterContext)
        {
            filterContext.ExceptionHandled = true;
            filterContext.Result = new JsonResult
            {
                Data = new
                {
                    success = false,
                    message = "FAIL — " + filterContext.Exception.GetType().Name + ": " + filterContext.Exception.Message
                },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        // GET: /ADTest/
        public ActionResult Index()
        {
            return View();
        }

        // POST: /ADTest/TestConnection
        [HttpPost]
        public JsonResult TestConnection()
        {
            if (string.IsNullOrWhiteSpace(AdDomain))
                return Json(new { success = false, message = "FAIL — 'AD.Domain' key is missing from Web.config <appSettings>." });

            try
            {
                using (var context = new PrincipalContext(ContextType.Domain, AdDomain))
                {
                    bool connected = context.ConnectedServer != null;
                    return Json(new
                    {
                        success = connected,
                        message = connected
                            ? "SUCCESS — Connected to: " + context.ConnectedServer
                            : "FAIL — Could not reach a domain controller."
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "FAIL — " + ex.Message });
            }
        }

        // POST: /ADTest/SearchUser
        [HttpPost]
        public JsonResult SearchUser(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                return Json(new { success = false, message = "Please enter a username." });

            if (string.IsNullOrWhiteSpace(AdDomain))
                return Json(new { success = false, message = "FAIL — 'AD.Domain' key is missing from Web.config <appSettings>." });

            try
            {
                using (var context = new PrincipalContext(ContextType.Domain, AdDomain))
                using (var user = UserPrincipal.FindByIdentity(context, IdentityType.SamAccountName, username.Trim()))
                {
                    if (user == null)
                        return Json(new { success = false, message = "No user found for '" + username + "'." });

                    var entry = user.GetUnderlyingObject() as DirectoryEntry;

                    return Json(new
                    {
                        success = true,
                        attributeMap = new
                        {
                            displayName = AttrDisplayName,
                            email = AttrEmail,
                            department = AttrDepartment,
                            employeeNumber = AttrEmployeeNumber
                        },
                        data = new
                        {
                            displayName = GetProperty(entry, AttrDisplayName),
                            email = GetProperty(entry, AttrEmail),
                            department = GetProperty(entry, AttrDepartment),
                            employeeNumber = GetProperty(entry, AttrEmployeeNumber),
                            samAccount = user.SamAccountName ?? string.Empty
                        }
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error: " + ex.Message });
            }
        }


        // POST: /ADTest/UpdateMobile
        [HttpPost]
        public JsonResult UpdateMobile(string username, string mobileNumber)
        {
            if (string.IsNullOrWhiteSpace(username))
                return Json(new { success = false, message = "Please enter a username." });

            if (string.IsNullOrWhiteSpace(mobileNumber))
                return Json(new { success = false, message = "Please enter a mobile number." });

            if (string.IsNullOrWhiteSpace(AdDomain))
                return Json(new { success = false, message = "FAIL — 'AD.Domain' key is missing from Web.config <appSettings>." });

            try
            {
                using (var context = new PrincipalContext(ContextType.Domain, AdDomain))
                using (var user = UserPrincipal.FindByIdentity(context, IdentityType.SamAccountName, username.Trim()))
                {
                    if (user == null)
                        return Json(new { success = false, message = "No user found for '" + username + "'." });

                    var entry = user.GetUnderlyingObject() as DirectoryEntry;

                    if (entry == null)
                        return Json(new { success = false, message = "FAIL — Could not retrieve directory entry for user." });

                    entry.Properties["mobile"].Value = mobileNumber.Trim();
                    entry.CommitChanges();

                    return Json(new { success = true, message = "SUCCESS — Mobile number updated for '" + username + "'." });
                }
            }
            catch (UnauthorizedAccessException)
            {
                return Json(new { success = false, message = "FAIL — The application account does not have write permission to Active Directory." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "FAIL — " + ex.Message });
            }
        }

        // Safely reads any named attribute from a DirectoryEntry
        private static string GetProperty(DirectoryEntry entry, string attributeName)
        {
            if (entry == null || string.IsNullOrWhiteSpace(attributeName))
                return string.Empty;
            try
            {
                if (entry.Properties.Contains(attributeName))
                {
                    var val = entry.Properties[attributeName].Value;
                    return val != null ? val.ToString() : string.Empty;
                }
            }
            catch { /* attribute may not exist in this AD schema */ }
            return string.Empty;
        }
    }
}
