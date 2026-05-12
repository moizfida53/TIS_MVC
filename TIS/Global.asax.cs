using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;


namespace TIS
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            MvcHandler.DisableMvcResponseHeader = true;
            //ExcelPackage.License.SetNonCommercialPersonal("TIS");

        }

        protected void Application_BeginRequest()
        {
            var csp = $"default-src 'self'; " +
                      $"script-src 'self' https://static.hsappstatic.net  'unsafe-eval' ;" +
                      $"style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
                      $"font-src 'self' data: https://fonts.gstatic.com https://static.hsappstatic.net; " +
                      $"img-src 'self' data:; base-uri 'self'; frame-ancestors 'none'; form-action 'self';";

            Response.Headers.Add("content-security-policy", csp);
            HttpContext.Current.Response.Headers.Add("X-Content-Type-Options", "nosniff");
            Response.Headers.Remove("X-Powered-By");
            Response.Headers.Remove("X-AspNet-Version");
        }

        // Ensure cookies set by application have Secure, HttpOnly and SameSite flags
        protected void Application_EndRequest()
        {
            try
            {
                var cookies = Response.Cookies;
                for (int i = 0; i < cookies.Count; i++)
                {
                    var cookie = cookies[i];
                    if (cookie == null) continue;

                    // Mark cookie HttpOnly and Secure
                    cookie.HttpOnly = true;
                    cookie.Secure = true; // requires HTTPS

                    // Set SameSite (Strict). Adjust to Lax/None if your app requires cross-site usage.
                    // If you set SameSite=None, Secure must be true by spec.
                    cookie.SameSite = System.Web.SameSiteMode.Strict;
                }
            }
            catch (Exception)
            {
                // swallowing errors here to avoid breaking responses; log if needed
            }
        }

    }
}