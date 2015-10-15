using System;
using System.Collections.Generic;
using System.Device.Location;
using System.Linq;
using System.Web;
using KSUCapstone2015.Models;

namespace KSUCapstone2015.BLL.Queries
{
    public class Trip
    {
        private static DAL.Trips TripDAL;
        static Trip()
        {
            TripDAL = new DAL.Trips();
        }

        public List<Models.Data.Trip> TaxiInSector(DateTime start, DateTime stop, GeoCoordinate p1, GeoCoordinate p2, ref List<string> errors, string filter)
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

                switch (getFilterType(filter))
                {
                    case FilterTypes.drop:
                        results = TripDAL.GetDropoffsInSector(start, stop, topLeft, bottomRight);
                        break;
                    case FilterTypes.both:
                        results = TripDAL.GetPickupsAndDropoffsInSector(start, stop, topLeft, bottomRight);
                        break;
                    case FilterTypes.pick:
                    default:
                        results = TripDAL.GetPickupsInSector(start, stop, topLeft, bottomRight);
                        break;
                }
            }
            catch (Exception e)
            {
                errors.Add("An error occured processing your request: " + e.Message);
            }

            return results;
        }

        public List<Models.Data.Trip> TaxiInPolygon(DateTime start, DateTime stop, GeoCoordinate[] points, ref List<string> errors, string filter)
        {
            List<Models.Data.Trip> results = new List<Models.Data.Trip>();
            switch (getFilterType(filter))
            {
                case FilterTypes.drop:
                    results = TripDAL.GetDropoffsInPolygon(start, stop, points);
                    break;
                case FilterTypes.both:
                    results = TripDAL.GetPickupsAndDropoffsInPolygon(start, stop, points);
                    break;
                case FilterTypes.pick:
                default:
                    results = TripDAL.GetPickupsInPolygon(start, stop, points);
                    break;
            }

            return results;
        }

        public FilterTypes getFilterType(string filter) {
            try
            {
                FilterTypes type = (FilterTypes)Enum.Parse(typeof(FilterTypes), filter);
                if (Enum.IsDefined(typeof(FilterTypes), type))
                {
                    return type;
                }
            }
            catch (Exception) { }

            return FilterTypes.pick;
        }
    }
}