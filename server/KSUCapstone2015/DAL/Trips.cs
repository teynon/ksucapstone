using KSUCapstone2015.Models.Data;
using System;
using System.Collections.Generic;
using System.Device.Location;
using System.Linq;
using System.Web;

namespace KSUCapstone2015.DAL
{
    public class Trips
    {
        const int maxResults = 5000;

        public List<Trip> GetTripsInSector(DateTime start, DateTime stop, GeoCoordinate p1, GeoCoordinate p2)
        {
            List<Trip> results = new List<Trip>();
            using (var context = new DAL.MySQLDBContext())
            {
                context.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
                results = context.Trips.Where(o => o.PickupTime > start && o.PickupTime < stop && o.PickupLatitude > p1.Latitude && o.PickupLatitude < p2.Latitude && o.PickupLongitude > p1.Longitude && o.PickupLongitude < p2.Longitude).Take(maxResults).ToList();
            }

            return results;
        }
    }
}