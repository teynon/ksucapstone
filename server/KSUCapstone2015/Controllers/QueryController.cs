using KSUCapstone2015._3rdParty;
using System;
using System.Collections.Generic;
using System.Device.Location;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KSUCapstone2015.Controllers
{
    public class QueryController : BaseController
    {
        
        [ActionName("GetTaxisAtLocation")]
        [HttpGet]
        public JsonResult GetTaxisAtLocation(DateTime start, DateTime stop, string filterSelection, float latitude1, float longitude1, float latitude2, float longitude2)
        {
            GeoCoordinate coords1 = new GeoCoordinate(latitude1, longitude1);
            GeoCoordinate coords2 = new GeoCoordinate(latitude2, longitude2);
            List<string> errors;
            var data = new BLL.Queries.Trip().TaxiInSector(start, stop, coords1, coords2, out errors, filterSelection);
            Models.JsonResponse<List<Models.Data.Trip>> response = new Models.JsonResponse<List<Models.Data.Trip>>(errors, data, true);
            return Json(response, JsonRequestBehavior.AllowGet);
        }
    }
}