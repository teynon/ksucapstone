using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Electrolyte.Models;
using Electrolyte.Model;
using Electrolyte.BLL;

namespace Electrolyte.Controllers
{
    public class MessageController : Controller
    {
        //
        // GET: /Message/
        public ActionResult Index()
        {
            return View();
        }

        public MessageViewModel GetMessageByID(int messageID)
        {
            MessageViewModel message = new MessageViewModel();

            return message;
        }
	}
}