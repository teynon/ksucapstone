using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Electrolyte.Model;

namespace Electrolyte.Models
{
    public class DashboardViewModel
    {
        public UserViewModel CurrentUser
        { get; set; }

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

        List<AgreementViewModel> AgreementList
        { get; set; }

        List<ActivityItemViewModel> ActivityFeed
        { get; set; }
    }
}