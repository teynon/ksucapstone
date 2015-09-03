using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Helper
{
    public static class LoginHelper
    {
        public static bool IsAuthorized()
        {
            if (HttpContext.Current.Session["isValidated"] != null && (bool)HttpContext.Current.Session["isValidated"])
            {
                return true;
            }

            return false;
        }

        public static string GetBaseURL()
        {
            return HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority + HttpContext.Current.Request.ApplicationPath.TrimEnd('/') + "/";
        }
    }
}