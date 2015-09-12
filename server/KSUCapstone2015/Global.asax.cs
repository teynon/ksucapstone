using KSUCapstone2015.Controllers;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace KSUCapstone2015
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                DateFormatHandling = DateFormatHandling.IsoDateFormat
            };
        }

        /*
        protected void Application_Error(object sender, EventArgs e)
        {
            Exception exception = Server.GetLastError();
            RouteData routeData = new RouteData();
            routeData.Values.Add("controller", "ErrorController");
            routeData.Values.Add("action", "HandleTheError");
            routeData.Values.Add("error", exception);

            Response.Clear();
            Server.ClearError();

            IController errorController = new ErrorController();
            errorController.Execute(new RequestContext(
                new HttpContextWrapper(Context), routeData));
        }*/
    }
}
