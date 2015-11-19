namespace KSUCapstone2015.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddSavedMaps : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SavedMap",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Key = c.String(maxLength: 255, unicode: false),
                        JSON = c.String(unicode: false),
                    })
                .PrimaryKey(t => t.ID)
                .Index(t => t.Key, unique: true);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.SavedMap", new[] { "Key" });
            DropTable("dbo.SavedMap");
        }
    }
}
