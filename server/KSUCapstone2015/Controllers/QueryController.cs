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
        [ActionName("PickupsAtLocation")]
        [HttpGet]
        public JsonResult PickupsAtLocation_GET(DateTime start, DateTime stop, float latitude1, float longitude1, float latitude2, float longitude2)
        {
            List<string> errors;
            var data = GetPickupsAtLocation(start, stop, latitude1, longitude1, latitude2, longitude2, out errors);

            Models.JsonResponse<List<Models.Data.Trip>> response = new Models.JsonResponse<List<Models.Data.Trip>>(errors, data, true);
            response.Count = data.Count;

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [ActionName("PickupsAtLocation")]
        [HttpPost]
        public JsonResult PickupsAtLocation_POST(DateTime start, DateTime stop, float latitude1, float longitude1, float latitude2, float longitude2)
        {
            List<string> errors;
            var data = GetPickupsAtLocation(start, stop, latitude1, longitude1, latitude2, longitude2, out errors);

            Models.JsonResponse<List<Models.Data.Trip>> response = new Models.JsonResponse<List<Models.Data.Trip>>(errors, data, true);
            response.Count = data.Count;

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        private List<Models.Data.Trip> GetPickupsAtLocation(DateTime start, DateTime stop, float latitude1, float longitude1, float latitude2, float longitude2, out List<string> errors)
        {
            GeoCoordinate coords1 = new GeoCoordinate(latitude1, longitude1);
            GeoCoordinate coords2 = new GeoCoordinate(latitude2, longitude2);
            
            return new BLL.Queries.Trip().PickupsInSector(start, stop, coords1, coords2, out errors);
        }
    }
}