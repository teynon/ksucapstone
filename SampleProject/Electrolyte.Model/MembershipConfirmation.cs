using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class MembershipConfirmation
    {
        public int ID { get; set; }

        public int membershipid { get; set; }

        public string token { get; set; }

        public DateTime expiration { get; set; }

        public DateTime updated { get; set; }

        public int status { get; set; }
    }
}