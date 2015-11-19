using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace KSUCapstone2015.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index(string loadKey = null)
        {
            if (loadKey != null)
            {
                ViewBag.JSON = new BLL.Queries.SavedMap().GetByKey(loadKey).JSON;
            }
            return View();
        }

        public ActionResult About()
        {
            return View();
        }

        [ActionName("Save")]
        [HttpPost]
        public JsonResult Save(string json)
        {
            Models.Data.SavedMap map = new BLL.Queries.SavedMap().Save(json);
            return Json(map, JsonRequestBehavior.AllowGet);
        }
    }
}