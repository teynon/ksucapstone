namespace KSUCapstone2015.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TripIndexes : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Trip", "vendor_id", c => c.String(maxLength: 40, storeType: "nvarchar"));
            CreateIndex("dbo.Trip", "pickup_datetime");
            CreateIndex("dbo.Trip", "dropoff_datetime");
            CreateIndex("dbo.Trip", "pickup_longitude");
            CreateIndex("dbo.Trip", "pickup_latitude");
            CreateIndex("dbo.Trip", "dropoff_longitude");
            CreateIndex("dbo.Trip", "dropoff_latitude");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Trip", new[] { "dropoff_latitude" });
            DropIndex("dbo.Trip", new[] { "dropoff_longitude" });
            DropIndex("dbo.Trip", new[] { "pickup_latitude" });
            DropIndex("dbo.Trip", new[] { "pickup_longitude" });
            DropIndex("dbo.Trip", new[] { "dropoff_datetime" });
            DropIndex("dbo.Trip", new[] { "pickup_datetime" });
            AlterColumn("dbo.Trip", "vendor_id", c => c.String(unicode: false));
        }
    }
}
