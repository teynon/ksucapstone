using Electrolyte.DAL;
using Electrolyte.Model;
using Electrolyte.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Electrolyte.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            return View();
        }

        public ActionResult Contact()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult Feedback()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public JsonResult SendFeedback(FeedbackViewModel model)
        {
            JsonResult result = new JsonResult();
            JSONMessage msg = new JSONMessage();
            if (ModelState.IsValid)
            {
                Helper.Email.SendEmail("support@followthru.co", model.Name, "FollowThru Feedback", model.Name + " (" + model.Email + ") has submitted feedback.<br />" + model.Message);
                Helper.Email.SendEmail(model.Email, model.Name, "FollowThru Feedback", "Thank you for your feedback!<br /> Your message: " + model.Message);
                msg.Message = "Feedback Received. Thanks!";
                msg.Success = true;
            }
            else
            {
                msg.Message = "Error: Name, email, and message are required.";
            }
            result.Data = msg;
            return result;
        }

        public ActionResult Pricing()
        {
            if (Session["pricingModel"] == null)
            {
                Random rnd = new Random();
                Session["pricingModel"] = rnd.Next(1, 2);
            }

            ViewBag.PricingModel = Session["pricingModel"];
            return View();
        }

        public ActionResult SelectPricing(SampleViewModel model)
        {
            if (Session["pricingSampleChosen"] == null)
            {
                Session["pricingSampleChosen"] = true;
                GenericLog log = new GenericLog();
                log.key = "Pricing Sample";
                log.sessionid = System.Web.HttpContext.Current.Session.SessionID;
                log.value = model.sample + model.choice;
                new GenericLogDAL().Create(log);
            }
            return View();
        }
    }
}