using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace KSUCapstone2015.DAL
{
    public class MySQLDBInitializer : CreateDatabaseIfNotExists<MySQLDBContext>
    {
        protected override void Seed(MySQLDBContext context)
        {
            context.Examples.Add(new Models.Data.Example() { ID = 1, Name = "Hello" });
            context.Examples.Add(new Models.Data.Example() { ID = 2, Name = "World" });

            base.Seed(context);
        }
    }
}