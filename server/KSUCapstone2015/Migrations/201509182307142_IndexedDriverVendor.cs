namespace KSUCapstone2015.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class IndexedDriverVendor : DbMigration
    {
        public override void Up()
        {

            CreateIndex("dbo.Trip", "medallion");
            CreateIndex("dbo.Trip", "hack_license");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Trip", new[] { "hack_license" });
            DropIndex("dbo.Trip", new[] { "medallion" });
        }
    }
}
