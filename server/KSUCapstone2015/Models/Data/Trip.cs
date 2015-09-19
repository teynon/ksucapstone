using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace KSUCapstone2015.Models.Data
{
    public class Trip
    {
        public int ID { get; set; }

        [Column("medallion")]
        [MaxLength(40)]
        [Index]
        public string VehicleID { get; set; }

        [Column("hack_license")]
        [MaxLength(40)]
        [Index]
        public string DriverID { get; set; }

        [Column("vendor_id")]
        [MaxLength(40)]
        public string VendorID { get; set; }

        [Column("rate_code")]
        public int RateCode { get; set; }

        [Column("store_and_fwd_flag")]
        public bool StoreAndForward { get; set; }

        [Column("pickup_datetime")]
        [Index]
        public DateTime PickupTime { get; set; }

        [Column("dropoff_datetime")]
        [Index]
        public DateTime DropoffTime { get; set; }

        [Column("passenger_count")]
        public int Passengers { get; set; }

        [Column("trip_time_in_secs")]
        public int Duration { get; set; }

        [Column("trip_distance")]
        public float Distance { get; set; }

        [Index]
        [Column("pickup_longitude")]
        public float PickupLongitude { get; set; }

        [Index]
        [Column("pickup_latitude")]
        public float PickupLatitude { get; set; }

        [Index]
        [Column("dropoff_longitude")]
        public float DropoffLongitude { get; set; }

        [Index]
        [Column("dropoff_latitude")]
        public float DropoffLatitude { get; set; }
    }
}