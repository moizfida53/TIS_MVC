using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TIS.Filters
{
    public class PocExpiryFilter : ActionFilterAttribute
    {
        private static readonly DateTime PocExpiryDate = new DateTime(2026, 5, 15);

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (DateTime.Today > PocExpiryDate)
            {
                filterContext.Controller.TempData["ErrorMessage"] = "POC period has Expired";
                filterContext.Result = new ViewResult
                {
                    ViewName = "AccessDenied"
                };
                return;
            }

            base.OnActionExecuting(filterContext);
        }
    }
}