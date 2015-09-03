using Electrolyte.BLL;
using Electrolyte.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Electrolyte.Controllers
{
    public class DashboardController : Controller
    {
        //
        // GET: /Dashboard/
        [Authorize]
        public ActionResult Index()
        {
            List<Agreement> agreements = new AgreementBLL().GetAgreementsByUserID((int)Membership.GetUser().ProviderUserKey);


            // Get my agreements.
            ViewBag.agreements = agreements;

            return View();
        }
	}
}