using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class User
    {
        public int id 
        { get; set; }

        public int uid
        { get; set; }

        public string first 
        { get; set; }

        public string last 
        { get; set; }

        public string company 
        { get; set; }

        public DateTime datecreated
        { get; set; }

        public DateTime ts
        { get; set; }

        public User()
        {
            first = "";
            last = "";
            company = "";
        }
    }
}