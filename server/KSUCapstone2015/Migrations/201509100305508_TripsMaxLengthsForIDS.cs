namespace KSUCapstone2015.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TripsMaxLengthsForIDS : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Trip", "medallion", c => c.String(maxLength: 40, storeType: "nvarchar"));
            AlterColumn("dbo.Trip", "hack_license", c => c.String(maxLength: 40, storeType: "nvarchar"));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Trip", "hack_license", c => c.String(unicode: false));
            AlterColumn("dbo.Trip", "medallion", c => c.String(unicode: false));
        }
    }
}
