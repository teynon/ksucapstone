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
        public ActionResult Index()
        {
            BLL.Example example = new BLL.Example();
            example.GetExamples();
            return View();
        }

        public ActionResult About()
        {
            return View();
        }
    }
}