using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class ActivityItem
    {
        public int ID
        { get; set; }

        public string Type
        { get; set; }

        public User CreatedBy
        { get; set; }

        public string AgreementNumber
        { get; set; }

        public DateTime CreatedDate
        { get; set; }
    }
}