using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class DashboardItem
    {
        public string ClientName
        { get; set; }

        public string AgreementNumber
        { get; set; }

        public DateTime StartDate
        { get; set; }

        public DateTime EndDate
        { get; set; }

        public decimal PercentComplete
        { get; set; }

        public Status CurrentStatus
        { get; set; }
    }
}