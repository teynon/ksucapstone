using System.Web;
using System.Web.Optimization;

namespace KSUCapstone2015
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui.js",
                        "~/Scripts/jquery.datetimepicker.js"));

            bundles.Add(new ScriptBundle("~/MapInterface").Include(
                "~/Scripts/MapInterface.js",
                "~/Scripts/QueryController.js",
                "~/Scripts/MapHelpers.js",
                "~/Scripts/UI.js",
                "~/Scripts/leaflet.js",
                "~/Scripts/leaflet.draw.js",
                "~/Scripts/L.Path.Drag.js",
                "~/Scripts/leaflet.draw.drag.js",
                "~/Scripts/leaflet.label.js",
                "~/Scripts/jacwright.date.format.js",
                "~/Scripts/barGraph.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/leaflet.css",
                      "~/Content/leaflet.draw.css",
                      "~/Content/jquery-ui.css",
                      "~/Content/jquery.datetimepicker.css"));
        }
    }
}
