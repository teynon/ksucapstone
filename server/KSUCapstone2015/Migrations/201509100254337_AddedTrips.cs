namespace KSUCapstone2015.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedTrips : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Trip",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        medallion = c.String(unicode: false),
                        hack_license = c.String(unicode: false),
                        vendor_id = c.String(unicode: false),
                        rate_code = c.Int(nullable: false),
                        store_and_fwd_flag = c.Boolean(nullable: false),
                        pickup_datetime = c.DateTime(nullable: false, precision: 0),
                        dropoff_datetime = c.DateTime(nullable: false, precision: 0),
                        passenger_count = c.Int(nullable: false),
                        trip_time_in_secs = c.Int(nullable: false),
                        trip_distance = c.Single(nullable: false),
                        pickup_longitude = c.Single(nullable: false),
                        pickup_latitude = c.Single(nullable: false),
                        dropoff_longitude = c.Single(nullable: false),
                        dropoff_latitude = c.Single(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Trip");
        }
    }
}
