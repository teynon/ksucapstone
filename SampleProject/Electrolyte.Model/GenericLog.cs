using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class GenericLog
    {
        public int id { get; set; }

        public string key { get; set; }

        public string sessionid { get; set; }

        public string value { get; set; }
    }
}