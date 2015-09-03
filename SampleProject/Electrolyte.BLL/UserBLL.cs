using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Electrolyte.Model;
using Electrolyte.DAL;
using Electrolyte.Helper;
using System.Web.Security;

namespace Electrolyte.BLL
{
    public class UserBLL
    {


        public MembershipConfirmation CreateUserConfirmation(int id, string token)
        {
            MembershipConfirmation confirmation = new MembershipConfirmation();
            confirmation.token = token;
            confirmation.expiration = DateTime.Now.AddDays(10);
            confirmation.membershipid = id;
            return new MembershipConfirmationDAL().Create(confirmation);
        }

        public User Create(User user)
        {
            return new UserDAL().Create(user);
        }

        public void SendMembershipConfirmationCode(MembershipUser user, MembershipConfirmation confirmation)
        {
            User userInfo = new UserDAL().GetUserByID((int)user.ProviderUserKey);
            if (userInfo == null) userInfo = new User();
            // To Do: Extract the hard coded string title and message.
            Helper.Email.SendEmail(user.Email, userInfo.first + " " + userInfo.last, "Your Recent FollowThru Registration", string.Format(@"Dear {0}," + Environment.NewLine + "<br /><br />&nbsp;&nbsp;&nbsp;Thank you for registering with FollowThru. To confirm your email please click the link below.<br /><br />" + Environment.NewLine + Environment.NewLine + Electrolyte.Helper.Strings.GetBaseURL() + "Account/Confirm?token={1}&email={2}", user.UserName, confirmation.token, user.Email));
        }

        public User GetUserByID(int userID)
        {
            //Create necessary variables
            User user = new User();
            UserDAL uDAL = new UserDAL();

            user = uDAL.GetUserByID(userID);

            //Return the model
            return user;
        }

        public List<User> GetAllUsers()
        {
            //Create necessary variables
            List<User> userList = new List<User>();
            UserDAL uDAL = new UserDAL();

            userList = uDAL.GetAllUsers();

            //Return the model
            return userList;
        }

        public User GetUserByUsername(string username)
        {
            //Create necessary variables
            User user = new User();
            UserDAL uDAL = new UserDAL();

            user = uDAL.GetUserByUsername(username);

            //Return the model
            return user;
        }
    }
}