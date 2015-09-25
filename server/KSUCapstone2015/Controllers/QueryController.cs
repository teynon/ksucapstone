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
            List<string> errors = new List<string>();
            Models.JsonResponse<List<Models.Data.Trip>> response;
            if (!(start < stop))
            {
                errors.Add("The From time must be before the To Time");
                response = new Models.JsonResponse<List<Models.Data.Trip>>(errors, null, false);
                return Json(response, JsonRequestBehavior.AllowGet);
            }
            GeoCoordinate coords1 = new GeoCoordinate(latitude1, longitude1);
            GeoCoordinate coords2 = new GeoCoordinate(latitude2, longitude2);
            var data = new BLL.Queries.Trip().TaxiInSector(start, stop, coords1, coords2, out errors, filterSelection);
            response = new Models.JsonResponse<List<Models.Data.Trip>>(errors, data, true);
            response.Count = data.Count;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
    }
}