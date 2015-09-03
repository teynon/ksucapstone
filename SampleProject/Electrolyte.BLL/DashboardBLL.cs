using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Electrolyte.Model;
using Electrolyte.DAL;

namespace Electrolyte.BLL
{
    public class DashboardBLL
    {
        public Dashboard GetDashboardByUserID(int userID)
        {
            User user = new UserBLL().GetUserByID(userID);
            Dashboard dashboard = new Dashboard();
            List<Agreement> agreementList = new AgreementBLL().GetAgreementsByUserID(userID);
            List<ActivityItem> activityFeed = new List<ActivityItem>(); //TODO - Add this BLL and functionality
            List<DashboardItem> dashboardItemList = new List<DashboardItem>();

            foreach (Agreement agr in agreementList)
            {
                /*dashboardItemList.Add(new DashboardItem
                    {
                        AgreementNumber = agr.AgreementInitial + "-" + agr.AgreementNumber,
                        ClientName = user.firstname + " " + user.lastname,
                        CurrentStatus = agr.Status,
                        StartDate = agr.StartDate,
                        EndDate = agr.EndDate
                        //TODO - Get Percent Complete
                    });*/
            }

            dashboard = new Dashboard
            {
                CurrentUser = user,
                DashboardList = dashboardItemList,
                ActivityFeed = activityFeed
            };
            return dashboard;
        }
    }
}