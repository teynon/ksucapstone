using KSUCapstone2015.Models.Data;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace KSUCapstone2015.DAL
{
    [DbConfigurationType(typeof(MySql.Data.Entity.MySqlEFConfiguration))]
    public class MySQLDBContext : DbContext
    {

        public MySQLDBContext() : base("MySQLContext")
        {
            Database.SetInitializer<MySQLDBContext>(new MySQLDBInitializer());
        }

        public DbSet<Example> Examples { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }

    }
}