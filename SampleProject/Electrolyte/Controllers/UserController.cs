using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Electrolyte.Models;
using Electrolyte.Model;
using Electrolyte.BLL;

namespace Electrolyte.Controllers
{
    public class UserController : Controller
    {
        //
        // GET: /User/
        public ActionResult Index()
        {
            return View();
        }

        public UserViewModel GetUserByID(int userID)
        {
            UserViewModel user = new UserViewModel();

            user = AutoMapper.Mapper.Map<User, UserViewModel>(new UserBLL().GetUserByID(userID));

            return user;
        }
	}
}