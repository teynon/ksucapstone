using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class Contact
    {
        public int id { get; set; }

        public string nickname { get; set; }

        public string firstname { get; set; }

        public string lastname { get; set; }

        public string middle { get; set; }

        public string phone { get; set; }

        public string cell { get; set; }

        public string street { get; set; }

        public string city { get; set; }

        public string state { get; set; }

        public string zip { get; set; }

        public string email { get; set; }

        public DateTime? updated { get; set; }
    }
}