using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class Dashboard
    {
        public User CurrentUser
        { get; set; }

        public List<DashboardItem> DashboardList
        { get; set; }

        public List<ActivityItem> ActivityFeed
        { get; set; }
    }
}