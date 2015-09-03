using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using Electrolyte.Models;
using Electrolyte.BLL;
using Electrolyte.DAL;
using MySql.Web.Security;
using System.Web.Security;
using Electrolyte.Model;
using Electrolyte.Helper;

namespace Electrolyte.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        public AccountController()
            : this(new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext())))
        {
        }

        public AccountController(UserManager<ApplicationUser> userManager)
        {
            UserManager = userManager;
        }

        public UserManager<ApplicationUser> UserManager { get; private set; }

        [AllowAnonymous]
        public ActionResult NotAuthorized()
        {
            return View();
        }

        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [AllowAnonymous]
        public ActionResult Forgot()
        {
            ViewBag.EmailSent = false;
            ViewBag.Message = "Enter your email address below to recover your account.";
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Forgot(AccountRecoverViewModel model)
        {
            ViewBag.EmailSent = false;
            ViewBag.Message = "Enter your email address below to recover your account.";
            if (ModelState.IsValid)
            {
                MembershipUserCollection users = Membership.FindUsersByName(model.UserName);
                if (users.Count ==  1)
                {
                    Model.MembershipConfirmation recovery = new MembershipConfirmation();
                    foreach (MembershipUser user in users)
                    {
                        recovery.membershipid = (int)user.ProviderUserKey;
                        recovery.expiration = DateTime.Now.AddHours(1);
                        recovery.token = Helper.Strings.RandomString(50);

                        recovery = new MembershipConfirmationDAL().CreateRecovery(recovery);

                        if (recovery.ID != 0)
                        {
                            // Send recovery email.

                            User userInfo = new UserDAL().GetUserByID((int)user.ProviderUserKey);
                            if (userInfo == null) userInfo = new User();
                            Helper.Email.SendEmail(user.Email, userInfo.first + " " + userInfo.last, "Account Recovery Request", string.Format("Dear {0}," + Environment.NewLine + "<br /><br />\t&nbsp;&nbsp;&nbsp;We have received an account recovery request for your account. If you initiated this request, click the link below.<br /><br />" + Environment.NewLine + Environment.NewLine + Helper.Strings.GetBaseURL() + "Account/Recover?token={1}&email={2}", user.UserName, recovery.token, user.Email));

                            ViewBag.EmailSent = true;
                            ViewBag.Message = "A password reset email was sent. Please check your email and click on the link. The recovery link will expire in 1 hour.";
                        }
                        else
                        {
                            ViewBag.Message = "An unknown error occured.";
                        }
                    }
                }
                else
                {
                    ViewBag.Message = "Your email was not found in our system.";
                }
            }
            return View();
        }

        [AllowAnonymous]
        public ActionResult PasswordReset()
        {
            ViewBag.Message = "Enter your new password.";
            ViewBag.Reset = false;
            if (!(((Membership.GetUser() != null && Membership.GetUser().ProviderUserKey != null) ||  (Session["AccountRecovery"] != null && (bool)Session["AccountRecovery"]))))
            {
                // Not authorized.
                return Redirect(Helper.LoginHelper.GetBaseURL() + "Account/NotAuthorized");
            }

            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult PasswordReset(PasswordResetViewModel model)
        {
            ViewBag.Message = "Enter your new password.";
            ViewBag.Reset = false;

            if (!((Membership.GetUser() != null) || (Session["AccountRecovery"] != null && (bool)Session["AccountRecovery"] && Session["AccountRecoveryUserKey"] != null)))
            {
                // Not authorized.
                return Redirect(Helper.LoginHelper.GetBaseURL() + "Account/NotAuthorized");
            }

            if (ModelState.IsValid)
            {
                if (Membership.GetUser() != null)
                {
                    // Reset password.
                    if (Membership.GetUser().ChangePassword(Membership.GetUser().ResetPassword(), model.Password))
                    {
                        Session["AccountRecovery"] = false;
                        ViewBag.Message = "Password updated successfully.";
                        ViewBag.Reset = true;
                    }
                }
                else
                {
                    if (Membership.GetUser(Session["AccountRecoveryUserKey"]).ChangePassword(Membership.GetUser(Session["AccountRecoveryUserKey"]).ResetPassword(), model.Password))
                    {
                        Session["AccountRecovery"] = false;
                        ViewBag.Message = "Password updated successfully.";
                        ViewBag.Reset = true;
                    }
                }
            }

            return View();
        }

        //
        // GET: /Account/Recover
        [AllowAnonymous]
        public ActionResult Recover()
        {
            ViewBag.Message = "";
            if (Request.QueryString["email"] != null)
            {
                MembershipUser member = Membership.GetUser(Request.QueryString["email"]);
                if (member != null)
                {
                    // Verify token.
                    if (Request.QueryString["token"] != null)
                    {
                        MembershipConfirmationDAL confirm = new MembershipConfirmationDAL();
                        if (confirm.ValidateRecovery((int)member.ProviderUserKey, Request.QueryString["token"]))
                        {
                            // Show user reset password page.
                            Session["AccountRecovery"] = true;
                            Session["AccountRecoveryUserKey"] = (int)member.ProviderUserKey;

                            // Forward to password reset.
                            return Redirect(Helper.LoginHelper.GetBaseURL() + "Account/PasswordReset");
                        }
                        else
                        {
                            ViewBag.Message = "Your recovery token could not be verified.";
                        }
                    }
                    else
                    {
                        ViewBag.Message = "There was an error with your request. No token was supplied.";
                    }
                }
                else
                {
                    ViewBag.Message = "We couldn't find your email in our database.";
                }
            }
            else
            {
                ViewBag.Message = "Invalid request received.";
            }
            return View();
        }
        

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginViewModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                if (Membership.ValidateUser(model.UserName, model.Password))
                {
                    MembershipUser user = Membership.GetUser(model.UserName);
                    FormsAuthentication.SetAuthCookie(user.UserName, true);
                    if (returnUrl == null) returnUrl = "/Dashboard/Index"; // Helper.LoginHelper.GetBaseURL() + 

                    Response.Redirect(returnUrl, false);
                }
                else
                {
                    ModelState.AddModelError("", "Invalid username or password.");
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {
            ViewBag.Success = false;
            ViewBag.Message = "We are currently in a private alpha testing phase. Registration is open by invitation only. However, feel free to sign up now and we will email you as soon as our services become available.";
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Register(RegisterViewModel model)
        {
            ViewBag.Success = false;
            ViewBag.Message = "We are currently in a private alpha testing phase. Registration is open by invitation only. However, feel free to sign up now and we will email you as soon as our services become available.";
            if (ModelState.IsValid)
            {
                try
                {
                    // Look for beta user.
                    List<BetaUsers> users = new BetaUsersDAL().GetUsers();

                    MembershipCreateStatus membershipStatus = new MembershipCreateStatus();
                    MembershipUser user = Membership.CreateUser(model.UserName, model.Password, model.UserName, null, null, false, out membershipStatus);
                    User userData = new Model.User();
                    userData.first = model.FirstName;
                    userData.last = model.LastName;
                    userData.company = model.Company;
                    userData.uid = (int)user.ProviderUserKey;

                    UserBLL UserInfo = new UserBLL();
                    UserInfo.Create(userData);
                    ViewBag.Success = true;
                    if (users.Any(o => o.email.ToLower() == model.UserName.ToLower()))
                    {
                        MembershipConfirmation confirmation = UserInfo.CreateUserConfirmation((int)user.ProviderUserKey, Strings.RandomString(25));
                        UserInfo.SendMembershipConfirmationCode(user, confirmation);
                        ViewBag.Message = "A confirmation email has been sent to the email address you supplied. Please check your email and click the verification link to enable your account.";
                    }
                    else
                    {
                        ViewBag.Message = "Thanks for registering for FollowThru! We are currently in a private alpha testing phase and your email was not found in our invitation list. We will notify you as soon as your account is available.";
                    }

                    //m.CreateUser(model.UserName, model.Password, model.UserName, "", "", true, 1, out status);
                }
                catch (Exception er) 
                {
                    string error = er.Message;
                    ViewBag.Message = "An unknown error occured.";
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/Confirm
        [AllowAnonymous]
        public ActionResult Confirm()
        {
            ViewBag.Message = "";
            if (Request.QueryString["email"] != null)
            {
                MembershipUser member = Membership.GetUser(Request.QueryString["email"]);
                if (member != null)
                {
                    // Verify token.
                    if (Request.QueryString["token"] != null)
                    {
                        MembershipConfirmationDAL confirm = new MembershipConfirmationDAL();
                        if (confirm.Validate((int)member.ProviderUserKey, Request.QueryString["token"]))
                        {
                            member.IsApproved = true;
                            Membership.UpdateUser(member);
                            ViewBag.Message = "Your account has been verified. Thanks!";
                        }
                        else
                        {
                            ViewBag.Message = "Your account token could not be verified.";
                        }
                    }
                    else
                    {
                        ViewBag.Message = "There was an error with your request. No token was supplied.";
                    }
                }
                else
                {
                    ViewBag.Message = "We couldn't find your email in our database.";
                }
            }
            return View();
        }

        //
        // POST: /Account/Disassociate
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Disassociate(string loginProvider, string providerKey)
        {
            ManageMessageId? message = null;
            IdentityResult result = await UserManager.RemoveLoginAsync(User.Identity.GetUserId(), new UserLoginInfo(loginProvider, providerKey));
            if (result.Succeeded)
            {
                message = ManageMessageId.RemoveLoginSuccess;
            }
            else
            {
                message = ManageMessageId.Error;
            }
            return RedirectToAction("Manage", new { Message = message });
        }

        //
        // GET: /Account/Manage
        public ActionResult Manage(ManageMessageId? message)
        {
            ViewBag.StatusMessage =
                message == ManageMessageId.ChangePasswordSuccess ? "Your password has been changed."
                : message == ManageMessageId.SetPasswordSuccess ? "Your password has been set."
                : message == ManageMessageId.RemoveLoginSuccess ? "The external login was removed."
                : message == ManageMessageId.Error ? "An error has occurred."
                : "";
            ViewBag.HasLocalPassword = HasPassword();
            ViewBag.ReturnUrl = Url.Action("Manage");
            return View();
        }

        //
        // POST: /Account/Manage
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Manage(ManageUserViewModel model)
        {
            bool hasPassword = HasPassword();
            ViewBag.HasLocalPassword = hasPassword;
            ViewBag.ReturnUrl = Url.Action("Manage");
            if (hasPassword)
            {
                if (ModelState.IsValid)
                {
                    IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);
                    if (result.Succeeded)
                    {
                        return RedirectToAction("Manage", new { Message = ManageMessageId.ChangePasswordSuccess });
                    }
                    else
                    {
                        AddErrors(result);
                    }
                }
            }
            else
            {
                // User does not have a password so remove any validation errors caused by a missing OldPassword field
                ModelState state = ModelState["OldPassword"];
                if (state != null)
                {
                    state.Errors.Clear();
                }

                if (ModelState.IsValid)
                {
                    IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);
                    if (result.Succeeded)
                    {
                        return RedirectToAction("Manage", new { Message = ManageMessageId.SetPasswordSuccess });
                    }
                    else
                    {
                        AddErrors(result);
                    }
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            // Sign in the user with this external login provider if the user already has a login
            var user = await UserManager.FindAsync(loginInfo.Login);
            if (user != null)
            {
                await SignInAsync(user, isPersistent: false);
                return RedirectToLocal(returnUrl);
            }
            else
            {
                // If the user does not have an account, then prompt the user to create an account
                ViewBag.ReturnUrl = returnUrl;
                ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { UserName = loginInfo.DefaultUserName });
            }
        }

        //
        // POST: /Account/LinkLogin
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LinkLogin(string provider)
        {
            // Request a redirect to the external login provider to link a login for the current user
            return new ChallengeResult(provider, Url.Action("LinkLoginCallback", "Account"), User.Identity.GetUserId());
        }

        //
        // GET: /Account/LinkLoginCallback
        public async Task<ActionResult> LinkLoginCallback()
        {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync(XsrfKey, User.Identity.GetUserId());
            if (loginInfo == null)
            {
                return RedirectToAction("Manage", new { Message = ManageMessageId.Error });
            }
            var result = await UserManager.AddLoginAsync(User.Identity.GetUserId(), loginInfo.Login);
            if (result.Succeeded)
            {
                return RedirectToAction("Manage");
            }
            return RedirectToAction("Manage", new { Message = ManageMessageId.Error });
        }        

        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Manage");
            }

            if (ModelState.IsValid)
            {
                // Get the information about the user from the external login provider
                var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return View("ExternalLoginFailure");
                }
                var user = new ApplicationUser() { UserName = model.UserName };
                var result = await UserManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await UserManager.AddLoginAsync(user.Id, info.Login);
                    if (result.Succeeded)
                    {
                        await SignInAsync(user, isPersistent: false);
                        return RedirectToLocal(returnUrl);
                    }
                }
                AddErrors(result);
            }

            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }

        //
        // POST: /Account/LogOff
        [AllowAnonymous]
        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Home");
        }

        //
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        [ChildActionOnly]
        public ActionResult RemoveAccountList()
        {
            var linkedAccounts = UserManager.GetLogins(User.Identity.GetUserId());
            ViewBag.ShowRemoveButton = HasPassword() || linkedAccounts.Count > 1;
            return (ActionResult)PartialView("_RemoveAccountPartial", linkedAccounts);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && UserManager != null)
            {
                UserManager.Dispose();
                UserManager = null;
            }
            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private async System.Threading.Tasks.Task SignInAsync(ApplicationUser user, bool isPersistent)
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            var identity = await UserManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
            AuthenticationManager.SignIn(new AuthenticationProperties() { IsPersistent = isPersistent }, identity);
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private bool HasPassword()
        {
            var user = UserManager.FindById(User.Identity.GetUserId());
            if (user != null)
            {
                return user.PasswordHash != null;
            }
            return false;
        }

        public enum ManageMessageId
        {
            ChangePasswordSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
            Error
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        private class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri) : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties() { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion
    }
}