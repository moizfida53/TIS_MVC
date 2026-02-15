using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace TIS
{
    public partial class dashboard : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Safely obtain the session value
            object sessionValue = this.Session["EmpLoginAs"];

            // If the session value is missing or empty, hide the AccessDenideContainer div
            if (sessionValue == null || string.IsNullOrWhiteSpace(sessionValue.ToString()))
            {
                // Ensure the control exists before setting Visible to avoid potential null reference.
                // The designer-generated partial class should provide AccessDenideContainer; check defensively.
                this.AccessDenideContainer.Visible = true;
                this.DataContainer.Visible = false;
                hdnAccessValid.Value = "0";
            }
            else
            {
                this.AccessDenideContainer.Visible = false;
                this.DataContainer.Visible = true;
                hdnAccessValid.Value = "1";
            }
        }
    }
}