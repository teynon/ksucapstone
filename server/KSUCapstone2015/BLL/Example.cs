using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KSUCapstone2015.BLL
{
    public class Example
    {
        public List<Models.Data.Example> GetExamples()
        {
            using (var context = new DAL.MySQLDBContext())
            {
                return context.Examples.Where(o => 1 == 1).ToList();
            }
        }
    }
}