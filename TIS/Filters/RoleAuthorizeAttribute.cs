using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TIS.Filters;

namespace TIS.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
    public class RoleAuthorizeAttribute : AuthorizeAttribute
    {
        private readonly Roles[] _allowedRoles;

        public RoleAuthorizeAttribute(params Roles[] roles)
        {
            _allowedRoles = roles ?? Array.Empty<Roles>();
        }

        // Short-circuit when session or EmpRoleID is missing so caller sees AccessDenied (or 403 for AJAX)
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            if (filterContext == null)
                return;

            var httpContext = filterContext.HttpContext;
            var session = httpContext?.Session;

            if (session == null || session["EmpRoleID"] == null)
            {
                if (httpContext.Request.IsAjaxRequest())
                {
                    filterContext.Result = new HttpStatusCodeResult(403);
                }
                else
                {
                    filterContext.Result = new ViewResult { ViewName = "AccessDenied" };
                }
                return;
            }

            // Fallback to default authorization behavior (calls AuthorizeCore + HandleUnauthorizedRequest)
            base.OnAuthorization(filterContext);
        }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (httpContext == null)
                return false;

            var session = httpContext.Session;
            if (session == null)
                return false;

            var empRoleObj = session["EmpRoleID"];
            if (empRoleObj == null)
                return false;

            if (!int.TryParse(empRoleObj.ToString(), out int empRoleId))
                return false;

            // SuperAdmin bypasses role checks
            if (empRoleId == (int)TIS.Filters.Roles.SuperAdmin)
                return true;

            if (_allowedRoles == null || _allowedRoles.Length == 0)
                return false;

            return _allowedRoles.Any(r => (int)r == empRoleId);
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            if (filterContext == null)
                return;

            // If AJAX request return 403
            if (filterContext.HttpContext.Request.IsAjaxRequest())
            {
                filterContext.Result = new HttpStatusCodeResult(403);
                return;
            }

            // Redirect to AccessDenied view
            filterContext.Result = new ViewResult { ViewName = "AccessDenied" };
        }
    }
}