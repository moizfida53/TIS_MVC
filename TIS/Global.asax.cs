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
        }

        //protected void Application_BeginRequest()
        //{
        //    Response.Headers.Add(
        //        "Content-Security-Policy",
        //        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; object-src 'none'; frame-ancestors 'self'; base-uri 'self'; form-action 'self';"
        //    );
        //}



        protected void Application_BeginRequest()
        {
            // generate a per-request nonce for inline scripts
            //var noncebytes = new byte[16];
            //using (var rng = new RNGCryptoServiceProvider())
            //{
            //    rng.GetBytes(noncebytes);
            //}

            //var nonce = Convert.ToBase64String(noncebytes);
            //HttpContext.Current.Items["cspnonce"] = nonce;

            // fixed spacing and allow the remote host that serves the chunk




            var csp = $"default-src 'self'; " +
                      // $"script-src 'self' https://static.hsappstatic.net 'nonce-{nonce}'; " +
                      //$"script-src 'self' https://static.hsappstatic.net 'nonce-{nonce}' 'unsafe-eval';" +
                      //$"script-src 'self' https://static.hsappstatic.net 'nonce-{nonce}' 'unsafe-eval';" +
                      $"script-src 'self' https://static.hsappstatic.net  'unsafe-eval' ;" +
                      $"style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
                      $"font-src 'self' data: https://fonts.gstatic.com https://static.hsappstatic.net; " +
                      $"img-src 'self' data:; base-uri 'self'; frame-ancestors 'none'; form-action 'self';";

            //var csp = $"script-src 'self' https://static.hsappstatic.net 'nonce-{nonce}' 'unsafe-eval';";

            //if (Response.Headers.AllKeys.Contains("content-security-policy"))
            //{
            //    Response.Headers.Set("content-security-policy", csp);
            //}
            //else
            //{
            Response.Headers.Add("content-security-policy", csp);
            HttpContext.Current.Response.Headers.Add("X-Content-Type-Options", "nosniff");
            Response.Headers.Remove("X-Powered-By");
            Response.Headers.Remove("X-AspNet-Version");
            //}
        }

        //protected void Application_BeginRequest()
        //{
        //    // generate a per-request nonce
        //    var noncebytes = new byte[16];
        //    using (var rng = new RNGCryptoServiceProvider())
        //    {
        //        rng.GetBytes(noncebytes);
        //    }

        //    var nonce = Convert.ToBase64String(noncebytes);
        //    HttpContext.Current.Items["cspnonce"] = nonce;

        //    // CSP with HubSpot, inline scripts, and eval support
        //    var csp = $"default-src 'self'; " +
        //              $"script-src 'self' https://static.hsappstatic.net http://static.hsappstatic.net 'nonce-{nonce}' 'unsafe-eval' 'unsafe-inline'; " +
        //              $"style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
        //              $"font-src 'self' data: https://fonts.gstatic.com https://static.hsappstatic.net; " +
        //              $"img-src 'self' data:; base-uri 'self'; frame-ancestors 'none'; form-action 'self';";

        //    if (Response.Headers.AllKeys.Contains("content-security-policy"))
        //        Response.Headers.Set("content-security-policy", csp);
        //    else
        //        Response.Headers.Add("content-security-policy", csp);
        //}











    }
}