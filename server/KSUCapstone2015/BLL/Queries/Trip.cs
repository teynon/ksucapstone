using System;
using System.Collections.Generic;
using System.Device.Location;
using System.Linq;
using System.Web;

namespace KSUCapstone2015.BLL.Queries
{
    public class Trip
    {
        public List<Models.Data.Trip> TaxiInSector(DateTime start, DateTime stop, GeoCoordinate p1, GeoCoordinate p2, out List<string> errors, string filter)
        {
            errors = new List<string>();
            List<Models.Data.Trip> results = new List<Models.Data.Trip>();
            try {
                GeoCoordinate topLeft = new GeoCoordinate(p1.Latitude, p1.Longitude);
                GeoCoordinate bottomRight = new GeoCoordinate(p2.Latitude, p2.Longitude);

                if (p1.Latitude > p2.Latitude)
                {
                    topLeft.Latitude = p2.Latitude;
                    bottomRight.Latitude = p1.Latitude;
                }

                if (p1.Longitude > p2.Longitude)
                {
                    topLeft.Longitude = p2.Longitude;
                    bottomRight.Longitude = p1.Longitude;
                }
                if (filter == "pick")
                {
                    results = new DAL.Trips().GetPickupsInSector(start, stop, topLeft, bottomRight);
                }
                else if(filter == "drop")
                {
                    results = new DAL.Trips().GetDropoffsInSector(start, stop, topLeft, bottomRight);
                }
                else if (filter == "both")
                {
                    results = new DAL.Trips().GetPickupsAndDropoffsInSector(start, stop, topLeft, bottomRight);
                }
                else
                {
                    throw new Exception("Error in filter selection mode please try again");
                }
            }
            catch (Exception e)
            {
                errors.Add("An error occured processing your request: " + e.Message);
            }

            return results;
        }
    }
}