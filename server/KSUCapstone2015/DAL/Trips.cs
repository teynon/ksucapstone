using KSUCapstone2015.Models.Data;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Odbc;
using System.Data.SqlClient;
using System.Device.Location;
using System.Linq;
using System.Web;

namespace KSUCapstone2015.DAL
{
    public class Trips
    {
        const int maxResults = 20000;

        public List<Trip> GetPickupsInSector(DateTime start, DateTime stop, GeoCoordinate p1, GeoCoordinate p2)
        {
            List<Trip> results = new List<Trip>();
            using (var context = new DAL.MySQLDBContext())
            {
                //context.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
                results = context.Trips.Where(o => o.PickupTime > start && o.PickupTime < stop && o.PickupLatitude > p1.Latitude && o.PickupLatitude < p2.Latitude && o.PickupLongitude > p1.Longitude && o.PickupLongitude < p2.Longitude).Take(maxResults).ToList();
            }

            return results;
        }

        public List<Trip> GetDropoffsInSector(DateTime start, DateTime stop, GeoCoordinate p1, GeoCoordinate p2)
        {
            List<Trip> results = new List<Trip>();
            using (var context = new DAL.MySQLDBContext())
            {
                //context.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
                results = context.Trips.Where(o => (o.DropoffTime > start && o.DropoffTime < stop) && (o.DropoffLatitude > p1.Latitude && o.DropoffLatitude < p2.Latitude) && (o.DropoffLongitude > p1.Longitude && o.DropoffLongitude < p2.Longitude)).Take(maxResults).ToList();
            }

            return results;
        }

        public List<Trip> GetPickupsAndDropoffsInSector(DateTime start, DateTime stop, GeoCoordinate p1, GeoCoordinate p2)
        {
            List<Trip> results = new List<Trip>();
            using (var context = new DAL.MySQLDBContext())
            {
                //context.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
                results = context.Trips.Where(o => (o.DropoffTime > start && o.DropoffTime < stop) && (o.DropoffLatitude > p1.Latitude && o.DropoffLatitude < p2.Latitude) && (o.DropoffLongitude > p1.Longitude && o.DropoffLongitude < p2.Longitude)).Take(maxResults).ToList();
                var results1 = context.Trips.Where(o => o.PickupTime > start && o.PickupTime < stop && o.PickupLatitude > p1.Latitude && o.PickupLatitude < p2.Latitude && o.PickupLongitude > p1.Longitude && o.PickupLongitude < p2.Longitude).Take(maxResults).ToList();
                foreach (var item in results1)
                {
                    results.Add(item);
                }
            }

            return results;
        }

        public List<Trip> GetPickupsInPolygon(DateTime start, DateTime stop, GeoCoordinate[] points)
        {
            double smallestLat = double.PositiveInfinity;
            double smallestLng = double.PositiveInfinity;
            double largestLat = double.NegativeInfinity;
            double largestLng = double.NegativeInfinity;

            List<Trip> results = new List<Trip>();
            using (var context = new DAL.MySQLDBContext())
            {
                context.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
                object[] args = new object[8 + points.Length * 2];
                args[0] = new MySqlParameter("@start", start.ToString("yyyy-MM-dd HH:mm:ss"));
                args[1] = new MySqlParameter("@stop", stop.ToString("yyyy-MM-dd HH:mm:ss"));

                List<string> latLngs = new List<string>();
                for (int i = 0; i < points.Length; i++)
                {
                    if (points[i].Latitude < smallestLat) smallestLat = points[i].Latitude;
                    if (points[i].Latitude > largestLat) largestLat = points[i].Latitude;
                    if (points[i].Longitude < smallestLng) smallestLng = points[i].Longitude;
                    if (points[i].Longitude > largestLng) largestLng = points[i].Longitude;

                    int index = i * 2;
                    args[index + 6] = new MySqlParameter("@lat" + i.ToString(), points[i].Latitude.ToString());
                    args[index + 7] = new MySqlParameter("@lon" + i.ToString(), points[i].Longitude.ToString());

                    latLngs.Add("@lat" + i.ToString() + ",' ',@lon" + i.ToString());
                }

                // Close the polygon.
                args[points.Length * 2 + 6] = new MySqlParameter("@lat" + points.Length, points[0].Latitude.ToString());
                args[points.Length * 2 + 7] = new MySqlParameter("@lon" + points.Length, points[0].Longitude.ToString());
                latLngs.Add("@lat" + points.Length + " @lon" + points.Length);

                args[2] = new MySqlParameter("@minLat", smallestLat);
                args[3] = new MySqlParameter("@minLng", smallestLng);
                args[4] = new MySqlParameter("@maxLat", largestLat);
                args[5] = new MySqlParameter("@maxLng", largestLng);

                string sql = @"SELECT 
                                   ID, 
                                   medallion as 'VehicleID', 
                                   hack_license as 'DriverID', 
                                   vendor_id as 'VendorID', 
                                   rate_code as 'RateCode', 
                                   store_and_fwd_flag as 'StoreAndForward', 
                                   pickup_datetime as 'PickupTime', 
                                   dropoff_datetime as 'DropoffTime', 
                                   passenger_count as 'Passengers', 
                                   trip_time_in_secs as 'Duration', 
                                   trip_distance as 'Distance', 
                                   pickup_longitude as 'PickupLongitude', 
                                   pickup_latitude as 'PickupLatitude', 
                                   dropoff_longitude as 'DropoffLongitude', 
                                   dropoff_latitude as 'DropoffLatitude'
                               FROM (SELECT 
                                    trip.*,
                                    GEO.location as `location`
                               FROM trip 
                               INNER JOIN trip_geospatial AS GEO ON (GEO.tripid = trip.ID and GEO.Type = 0) 
                               WHERE 
                                   trip.pickup_datetime BETWEEN @start AND @stop AND 
                                   trip.pickup_latitude > @minLat AND 
                                   trip.pickup_longitude > @minLng AND 
                                   trip.pickup_latitude < @maxLat AND 
                                   trip.pickup_longitude < @maxLng 
                               HAVING ST_CONTAINS(geomfromtext(CONCAT('POLYGON((',";
                sql += string.Join(",',',", latLngs) + ",'))')), `location`)) AS `ThisTableNameDoesntMatter`";
                
                results = context.Trips.SqlQuery(sql, args).ToList();
            }

            return results;
        }

        public List<Trip> GetDropoffsInPolygon(DateTime start, DateTime stop, GeoCoordinate[] points)
        {
            double smallestLat = double.PositiveInfinity;
            double smallestLng = double.PositiveInfinity;
            double largestLat = double.NegativeInfinity;
            double largestLng = double.NegativeInfinity;

            List<Trip> results = new List<Trip>();
            using (var context = new DAL.MySQLDBContext())
            {
                context.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
                object[] args = new object[8 + points.Length * 2];
                args[0] = new MySqlParameter("@start", start.ToString("yyyy-MM-dd HH:mm:ss"));
                args[1] = new MySqlParameter("@stop", stop.ToString("yyyy-MM-dd HH:mm:ss"));

                List<string> latLngs = new List<string>();
                for (int i = 0; i < points.Length; i++)
                {
                    if (points[i].Latitude < smallestLat) smallestLat = points[i].Latitude;
                    if (points[i].Latitude > largestLat) largestLat = points[i].Latitude;
                    if (points[i].Longitude < smallestLng) smallestLng = points[i].Longitude;
                    if (points[i].Longitude > largestLng) largestLng = points[i].Longitude;

                    int index = i * 2;
                    args[index + 6] = new MySqlParameter("@lat" + i.ToString(), points[i].Latitude.ToString());
                    args[index + 7] = new MySqlParameter("@lon" + i.ToString(), points[i].Longitude.ToString());

                    latLngs.Add("@lat" + i.ToString() + ",' ',@lon" + i.ToString());
                }

                // Close the polygon.
                args[points.Length * 2 + 6] = new MySqlParameter("@lat" + points.Length, points[0].Latitude.ToString());
                args[points.Length * 2 + 7] = new MySqlParameter("@lon" + points.Length, points[0].Longitude.ToString());
                latLngs.Add("@lat" + points.Length + " @lon" + points.Length);

                args[2] = new MySqlParameter("@minLat", smallestLat);
                args[3] = new MySqlParameter("@minLng", smallestLng);
                args[4] = new MySqlParameter("@maxLat", largestLat);
                args[5] = new MySqlParameter("@maxLng", largestLng);

                string sql = @"SELECT 
                                   ID, 
                                   medallion as 'VehicleID', 
                                   hack_license as 'DriverID', 
                                   vendor_id as 'VendorID', 
                                   rate_code as 'RateCode', 
                                   store_and_fwd_flag as 'StoreAndForward', 
                                   pickup_datetime as 'PickupTime', 
                                   dropoff_datetime as 'DropoffTime', 
                                   passenger_count as 'Passengers', 
                                   trip_time_in_secs as 'Duration', 
                                   trip_distance as 'Distance', 
                                   pickup_longitude as 'PickupLongitude', 
                                   pickup_latitude as 'PickupLatitude', 
                                   dropoff_longitude as 'DropoffLongitude', 
                                   dropoff_latitude as 'DropoffLatitude'
                               FROM (SELECT 
                                    trip.*,
                                    GEO.location as `location`
                               FROM trip 
                               INNER JOIN trip_geospatial AS GEO ON (GEO.tripid = trip.ID and GEO.Type = 1) 
                               WHERE 
                                   trip.dropoff_datetime BETWEEN @start AND @stop AND 
                                   trip.dropoff_latitude > @minLat AND 
                                   trip.dropoff_longitude > @minLng AND 
                                   trip.dropoff_latitude < @maxLat AND 
                                   trip.dropoff_longitude < @maxLng 
                               HAVING ST_CONTAINS(geomfromtext(CONCAT('POLYGON((',";
                sql += string.Join(",',',", latLngs) + ",'))')), `location`)) AS `ThisTableNameDoesntMatter`";

                results = context.Trips.SqlQuery(sql, args).ToList();
            }

            return results;
        }

        public List<Trip> GetPickupsAndDropoffsInPolygon(DateTime start, DateTime stop, GeoCoordinate[] points)
        {
            double smallestLat = double.PositiveInfinity;
            double smallestLng = double.PositiveInfinity;
            double largestLat = double.NegativeInfinity;
            double largestLng = double.NegativeInfinity;

            List<Trip> results = new List<Trip>();
            using (var context = new DAL.MySQLDBContext())
            {
                context.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
                object[] args = new object[8 + points.Length * 2];
                args[0] = new MySqlParameter("@start", start.ToString("yyyy-MM-dd HH:mm:ss"));
                args[1] = new MySqlParameter("@stop", stop.ToString("yyyy-MM-dd HH:mm:ss"));

                List<string> latLngs = new List<string>();
                for (int i = 0; i < points.Length; i++)
                {
                    if (points[i].Latitude < smallestLat) smallestLat = points[i].Latitude;
                    if (points[i].Latitude > largestLat) largestLat = points[i].Latitude;
                    if (points[i].Longitude < smallestLng) smallestLng = points[i].Longitude;
                    if (points[i].Longitude > largestLng) largestLng = points[i].Longitude;

                    int index = i * 2;
                    args[index + 6] = new MySqlParameter("@lat" + i.ToString(), points[i].Latitude.ToString());
                    args[index + 7] = new MySqlParameter("@lon" + i.ToString(), points[i].Longitude.ToString());

                    latLngs.Add("@lat" + i.ToString() + ",' ',@lon" + i.ToString());
                }

                // Close the polygon.
                args[points.Length * 2 + 6] = new MySqlParameter("@lat" + points.Length, points[0].Latitude.ToString());
                args[points.Length * 2 + 7] = new MySqlParameter("@lon" + points.Length, points[0].Longitude.ToString());
                latLngs.Add("@lat" + points.Length + " @lon" + points.Length);

                args[2] = new MySqlParameter("@minLat", smallestLat);
                args[3] = new MySqlParameter("@minLng", smallestLng);
                args[4] = new MySqlParameter("@maxLat", largestLat);
                args[5] = new MySqlParameter("@maxLng", largestLng);

                string sql = @"SELECT 
                                   ID, 
                                   medallion as 'VehicleID', 
                                   hack_license as 'DriverID', 
                                   vendor_id as 'VendorID', 
                                   rate_code as 'RateCode', 
                                   store_and_fwd_flag as 'StoreAndForward', 
                                   pickup_datetime as 'PickupTime', 
                                   dropoff_datetime as 'DropoffTime', 
                                   passenger_count as 'Passengers', 
                                   trip_time_in_secs as 'Duration', 
                                   trip_distance as 'Distance', 
                                   pickup_longitude as 'PickupLongitude', 
                                   pickup_latitude as 'PickupLatitude', 
                                   dropoff_longitude as 'DropoffLongitude', 
                                   dropoff_latitude as 'DropoffLatitude'
                               FROM (SELECT 
                                    trip.*,
                                    GEO.location as `location`,
                                    GEO2.location as `location2`
                               FROM trip 
                               INNER JOIN trip_geospatial AS GEO ON (GEO.tripid = trip.ID and GEO.Type = 0) 
                               INNER JOIN trip_geospatial AS GEO2 ON (GEO2.tripid = trip.ID and GEO2.Type = 1) 
                               WHERE 
                                   
                                   (
                                       trip.dropoff_datetime BETWEEN @start AND @stop AND 
                                       trip.dropoff_latitude > @minLat AND 
                                       trip.dropoff_longitude > @minLng AND 
                                       trip.dropoff_latitude < @maxLat AND 
                                       trip.dropoff_longitude < @maxLng
                                   ) OR
                                   (
                                       trip.pickup_datetime BETWEEN @start AND @stop AND 
                                       trip.pickup_latitude > @minLat AND 
                                       trip.pickup_longitude > @minLng AND 
                                       trip.pickup_latitude < @maxLat AND 
                                       trip.pickup_longitude < @maxLng
                                   )
                               HAVING ST_CONTAINS(geomfromtext(CONCAT('POLYGON((',";
                sql += string.Join(",',',", latLngs) + ",'))')), `location`) OR ST_CONTAINS(geomfromtext(CONCAT('POLYGON((',";
                sql += string.Join(",',',", latLngs) + ",'))')), `location2`)) AS `ThisTableNameDoesntMatter`";

                results = context.Trips.SqlQuery(sql, args).ToList();
            }

            return results;
        }
    }
}