﻿using System;
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
            base.Seed(context);
        }
    }
}