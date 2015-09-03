using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Electrolyte.Model;
using Electrolyte.Models;
using Electrolyte.BLL;
using Electrolyte.Helper;
using AutoMapper;
using System.IO;
using System.Net.Http;
using System.Web.Security;
using Amazon.S3;
using Amazon;
using System.Configuration;
using Amazon.S3.Transfer;

namespace Electrolyte.Controllers
{
    public class AgreementController : Controller
    {
        //
        // GET: /Agreement/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CreateAgreement()
        {
            AgreementViewModel newAgreement = new AgreementViewModel();

            return View(newAgreement);
        }

        [Authorize]
        public ActionResult Manage(IDViewModel model)
        {
            Agreement agreement = new AgreementBLL().GetAgreementByID(model.ID);
            if (agreement.createdbyid == (int)Membership.GetUser().ProviderUserKey)
            {
                ViewBag.agreement = agreement;
            }
            else
            {
                return Redirect(Helper.LoginHelper.GetBaseURL() + "Account/NotAuthorized");
                //return RedirectToAction(Helper.LoginHelper.GetBaseURL() + "/Account/NotAuthorized", false);
            }
            return View();
        }

        [Authorize]
        public ActionResult EditAgreement(IDViewModel model)
        {
            Agreement agreement = new AgreementBLL().GetAgreementByID(model.ID);
            if (agreement.createdbyid == (int)Membership.GetUser().ProviderUserKey)
            {
                ViewBag.agreement = agreement;
            }
            else
            {
                return Redirect(Helper.LoginHelper.GetBaseURL() + "Account/NotAuthorized");
                //return RedirectToAction(Helper.LoginHelper.GetBaseURL() + "/Account/NotAuthorized", false);
            }
            return View();
        }

        [Authorize]
        public ActionResult GetFile(AgreementIDViewModel model)
        {

            if (ModelState.IsValid)
            {

                Agreement agreement = new AgreementBLL().GetAgreementByID(model.AgreementID);
                if (agreement.createdbyid == (int)Membership.GetUser().ProviderUserKey)
                {
                    foreach (var file in agreement.Files)
                    {
                        if (file.id == model.ID)
                        {
                            TransferUtility ftUtility = new TransferUtility(new AmazonS3Client(Amazon.RegionEndpoint.USEast1));
                            string path = Path.GetTempFileName();
                            ftUtility.Download(path, "followthru", file.filepath);
                            return File(path, Helper.Files.getMimeFromFile(path));
                        }
                    }
                }
            }

            return View();
        }

        [Authorize]
        public JsonResult DeleteFile(AgreementIDViewModel model)
        {
            JsonResult result = new JsonResult();
            result.JsonRequestBehavior = JsonRequestBehavior.AllowGet;

            if (ModelState.IsValid)
            {
                if (model.AgreementID != 0)
                {
                    Agreement agreement = new AgreementBLL().GetAgreementByID(model.AgreementID);
                    if (agreement.createdbyid == (int)Membership.GetUser().ProviderUserKey)
                    {
                        new AgreementBLL().DisassociateFile(agreement.id, model.ID);
                        agreement = new AgreementBLL().GetAgreementByID(model.AgreementID);
                        result.Data = agreement;
                    }
                }
                else
                {
                    Agreement agreement = (Agreement)Session["NewAgreement"];
                    var file = agreement.Files.FirstOrDefault(o => o.id == model.ID);
                    if (file != null)
                    {
                        agreement.Files.Remove(file);
                    }

                    Session["NewAgreement"] = agreement;
                    result.Data = agreement;
                }
            }
            return result;
        }
        
        [Authorize]
        public ActionResult AgreementUploadForm(IDViewModel model) {

            if (ModelState.IsValid)
            {
                if (model.ID != 0)
                {
                    Agreement agreement = new AgreementBLL().GetAgreementByID(model.ID);
                    if (agreement.createdbyid == (int)Membership.GetUser().ProviderUserKey)
                    {
                        if (Request.Files.Count > 0)
                        {
                            int userID = (int)Membership.GetUser().ProviderUserKey;
                            TransferUtility ftUtility = new TransferUtility(new AmazonS3Client(Amazon.RegionEndpoint.USEast1));

                            for (int x = 0; x < Request.Files.Count; x++)
                            {
                                string filename = ((int)Membership.GetUser().ProviderUserKey).ToString() + Helper.Strings.RandomString(60) + Path.GetExtension(Request.Files[x].FileName); //Request.Files[x].FileName;
                                try
                                {
                                    ftUtility.Upload(Request.Files[x].InputStream, "followthru", filename);

                                    Model.File theFile = new Model.File();
                                    theFile.filename = Request.Files[x].FileName;
                                    theFile.filepath = filename;
                                    theFile.createdby = (int)Membership.GetUser().ProviderUserKey;

                                    theFile = new FileBLL().Create(theFile);

                                    new AgreementBLL().AssociateFile(agreement, theFile);
                                }
                                catch (Exception) { }
                            }

                            // Refresh agreement files.
                            agreement = new AgreementBLL().GetAgreementByID(model.ID);
                        }

                        ViewBag.agreement = agreement;

                        // Refresh agreement files.
                        agreement = new AgreementBLL().GetAgreementByID(model.ID);

                        /*S3PolicyDocument policyDoc = new S3PolicyDocument();
                        policyDoc.expiration = DateTime.Now.AddHours(1).ToUniversalTime().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'");

                        policyDoc.conditions.Add(new string[] { "eq", "$bucket", "followthru" });
                        policyDoc.conditions.Add(new string[] { "starts-with", "$key", "uploads/" });
                        policyDoc.conditions.Add(new string[] { "starts-with", "$acl", "private" });
                        policyDoc.conditions.Add(new string[] { "starts-with", "$success_action_redirect", "" });

                        string json = Helper.Strings.ToJSON<S3PolicyDocument>(policyDoc);

                        // Print the number of Amazon S3 Buckets.
                        S3Data data = new S3Data();
                        data.AWSAccessKeyId = ConfigurationManager.AppSettings["AWSAccessKey"];
                        data.success_action_redirect = "";
                        data.bucket = "followthru";
                        data.acl = "private";
                        data.policy = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(json));
                        data.signature = Convert.ToBase64String(Helper.Strings.Encode(data.policy, System.Text.Encoding.UTF8.GetBytes(ConfigurationManager.AppSettings["AWSSecretKey"])));

                        ViewBag.FormData = data;*/
                    }
                    else
                    {
                        return new HttpStatusCodeResult(400, "Invalid agreement ID.");
                    }
                }
                else
                {
                    Agreement agreement = (Agreement)Session["NewAgreement"];
                    if (Request.Files.Count > 0)
                    {
                        int userID = (int)Membership.GetUser().ProviderUserKey;
                        TransferUtility ftUtility = new TransferUtility(new AmazonS3Client(Amazon.RegionEndpoint.USEast1));

                        for (int x = 0; x < Request.Files.Count; x++)
                        {
                            string filename = ((int)Membership.GetUser().ProviderUserKey).ToString() + Helper.Strings.RandomString(60) + Path.GetExtension(Request.Files[x].FileName); //Request.Files[x].FileName;
                            try
                            {
                                ftUtility.Upload(Request.Files[x].InputStream, "followthru", filename);

                                Model.File theFile = new Model.File();
                                theFile.filename = Request.Files[x].FileName;
                                theFile.filepath = filename;
                                theFile.createdby = (int)Membership.GetUser().ProviderUserKey;

                                theFile = new FileBLL().Create(theFile);
                                agreement.Files.Add(theFile);
                            }
                            catch (Exception) { }
                        }
                    }
                    Session["NewAgreement"] = agreement;
                    ViewBag.agreement = agreement;
                }
            }
            else
            {
                return new HttpStatusCodeResult(400, "Invalid agreement ID.");
            }

            return View();
        }

        /// <summary>
        /// Create Agreement
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authorize]
        public JsonResult Create(CreateAgreementViewModel model)
        {
            List<KeyValuePair<string, object>> data = new List<KeyValuePair<string, object>>();
            int status = 0;
            JsonResult response = new JsonResult();
            Model.JSONResponse<Agreement> result = new JSONResponse<Agreement>();

            if (model.Title != null && model.Title.Trim() != "")
            {
                Contact c = new Contact();
                c.id = (int)Session["ContactIndex"];
                c.nickname = model.Contact_Name;
                c.phone = model.Contact_Phone;
                c.street = model.Contact_Street;
                c.city = model.Contact_City;
                c.state = model.Contact_State;
                c.email = model.Contact_Email;

                Agreement agreement = (Agreement)Session["NewAgreement"];
                if (c.nickname != null && c.nickname.Trim() != "")
                {
                    agreement.Contacts.Add(c);
                }



                agreement.createdbyid = (int)Membership.GetUser().ProviderUserKey;
                agreement.title = model.Title;
                agreement.description = model.Description;

                agreement = new AgreementBLL().CreateAgreement(agreement);
                result.Data = agreement;
                status = 1;
            }

            response.Data = result;

            return response;
        }

        [Authorize]
        public JsonResult FileUploadData()
        {
            JsonResult result = new JsonResult();
            result.JsonRequestBehavior = JsonRequestBehavior.AllowGet;

            S3PolicyDocument policyDoc = new S3PolicyDocument();
            policyDoc.expiration = DateTime.Now.AddHours(1).ToString("s");

            policyDoc.conditions.Add(new string[] { "eq", "$bucket", "followthru" });
            policyDoc.conditions.Add(new string[] { "starts-with", "$key", "uploads/" });
            policyDoc.conditions.Add(new string[] { "starts-with", "$acl", "private" });
            policyDoc.conditions.Add(new string[] { "starts-with", "$success_action_redirect", "nowhere" });

            //string policyDoc = "{\"expiration\": \"" + DateTime.Now.AddHours(1).ToString() + "\",\"conditions\": [{\"bucket\": \"FollowThru\"},[\"starts-with\", \"$key\", \"uploads/\"],{\"acl\": \"private\"},{\"success_action_redirect\": \"\"},[\"starts-with\", \"$Content-Type\", \"\"]]}";

            string json = Helper.Strings.ToJSON<S3PolicyDocument>(policyDoc);

            // Print the number of Amazon S3 Buckets.
            S3Data data = new S3Data();
            data.AWSAccessKeyId = ConfigurationManager.AppSettings["AWSAccessKey"];
            data.success_action_redirect = "";
            data.acl = "private";
            data.policy = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(json));
            data.signature = Convert.ToBase64String(Helper.Strings.Encode(data.policy, System.Text.Encoding.UTF8.GetBytes(ConfigurationManager.AppSettings["AWSSecretKey"])));
            //policyDoc.conditions.Add(new string[] { "content-length-range", "0", "1048576" });
            result.Data = data;

            return result;
        }

        /// <summary>
        /// Save Agreement
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authorize]
        public JsonResult SaveAgreement(CreateAgreementViewModel model)
        {
            List<KeyValuePair<string, object>> data = new List<KeyValuePair<string, object>>();
            int status = 0;
            JsonResult response = new JsonResult();
            Model.JSONResponse<Agreement> result = new JSONResponse<Agreement>();

            if (model.Title != null && model.Title.Trim() != "")
            {
                Contact c = new Contact();
                c.nickname = model.Contact_Name;
                c.phone = model.Contact_Phone;
                c.street = model.Contact_Street;
                c.city = model.Contact_City;
                c.state = model.Contact_State;

                AgreementBLL agreementBLL = new AgreementBLL();
                Agreement agreement = agreementBLL.GetAgreementByID(model.AgreementID);
                if (agreement.createdbyid != (int)Membership.GetUser().ProviderUserKey)
                    return response;

                if (c.nickname != null && c.nickname.Trim() != "")
                {
                    c = new ContactBLL().CreateContact(c);

                    agreementBLL.AssociateContact(agreement, c);
                }

                agreement.title = model.Title;
                agreement.description = model.Description;

                agreement = new AgreementBLL().SaveAgreement(agreement);
                result.Data = agreement;
                status = 1;
            }

            response.Data = result;

            return response;
        }

        public ActionResult CreateSection()
        {
            return View();
        }

        public ActionResult CreateSection(int agreementID)
        {
            SectionViewModel newSection = new SectionViewModel{AgreementID = agreementID};

            return View(newSection);
        }

        /// <summary>
        /// Ajax Agreement Form
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public ActionResult NewAgreement()
        {
            Session["NewAgreement"] = new Agreement();
            Session["ContactIndex"] = 0;
            return View();
        }

        [Authorize]
        public ActionResult NewTasks(IDViewModel model)
        {
            ViewBag.TaskList = new TaskTypeBLL().GetTaskTypes();
            Model.Agreement agreement = new AgreementBLL().GetAgreementByID(model.ID);
            ViewBag.Agreement = agreement;
            return View();
        }

        [Authorize]
        public JsonResult TaskTypes()
        {
            JsonResult result = new JsonResult();
            JsonAutosuggest<List<TaskType>> response = new JsonAutosuggest<List<TaskType>>();
            response.Data = new TaskTypeBLL().GetTaskTypes();
            result.Data = response;
            return result;
        }

        /// <summary>
        /// Ajax Add Contact to new agreement.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Authorize]
        public ActionResult AddContact(ContactViewModel model)
        {
            if (ModelState.IsValid)
            {
                Contact c = new Contact();
                c.nickname = model.Name;
                c.phone = model.Phone;
                c.street = model.Street;
                c.city = model.City;
                c.state = model.State;

                ViewBag.ContactName = model.Name;
                ViewBag.ContactPhone = model.Phone;

                Agreement agreement = null;

                if (model.AgreementID != 0)
                {
                    AgreementBLL agreementBLL = new AgreementBLL();
                    agreement = agreementBLL.GetAgreementByID(model.AgreementID);
                    if (agreement.createdbyid != (int)Membership.GetUser().ProviderUserKey)
                        return new HttpStatusCodeResult(400, "Invalid agreement ID.");

                    c = new ContactBLL().CreateContact(c);

                    agreementBLL.AssociateContact(agreement, c);

                    ViewBag.TempID = c.id;

                }
                else
                {
                    c.id = (int)Session["ContactIndex"];
                    agreement = (Agreement)Session["NewAgreement"];
                    agreement.Contacts.Add(c);

                    ViewBag.TempID = c.id;
                    Session["NewAgreement"] = agreement;
                    Session["ContactIndex"] = (int)Session["ContactIndex"] + 1;
                }

            }
            else
            {
                return new HttpStatusCodeResult(400, "Invalid contact data.");
            }

            return View();
        }

        /// <summary>
        /// Ajax Delete Contact to agreement.
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public ActionResult DeleteContact(AgreementIDViewModel model)
        {
            ViewBag.Result = "FAILED";
            if (ModelState.IsValid)
            {
                AgreementBLL agreementBLL = new AgreementBLL();
                Agreement agreement = null;
                if (model.AgreementID == 0)
                     agreement = (Agreement)Session["NewAgreement"];
                else 
                {
                    agreement = agreementBLL.GetAgreementByID(model.AgreementID);
                    if (agreement.createdbyid != (int)Membership.GetUser().ProviderUserKey)
                        return new HttpStatusCodeResult(400, "Invalid agreement ID.");
                }

                foreach (Contact c in agreement.Contacts.ToList())
                {
                    if (c.id == model.ID)
                    {
                        agreement.Contacts.Remove(c);
                        if (agreement.id != 0)
                        {
                            agreementBLL.DisassociateContact(agreement.id, model.ID);
                        }
                        ViewBag.Result = "OK";
                    }
                }

                if (agreement.id != 0)
                    Session["NewAgreement"] = agreement;
            }
            else
            {
                return new HttpStatusCodeResult(400, "Invalid contact data.");
            }

            return View();
        }

        [Authorize]
        [HttpPost]
        public ActionResult AddTask(CreateTaskViewModel model)
        {
            AgreementBLL agreementBLL = new AgreementBLL();

            if (ModelState.IsValid)
            {
                Agreement agreement = agreementBLL.GetAgreementByID(model.agreementID);
                
                if (agreement.createdbyid == (int)Membership.GetUser().ProviderUserKey)
                {
                    Task task = new Task();
                    task.tasktype = model.task;
                    task.title = model.title;
                    task.description = (model.description == null) ? "" : model.description;
                    task.datetime = model.date.AddHours(model.time.Hour).AddMinutes(model.time.Minute);

                    task = new TaskBLL().Create(task);

                    new AgreementBLL().AssociateTask(agreement, task);

                    ViewBag.task = task;
                }
            }

            return View();
        }

        [Authorize]
        public bool DeleteTask(AgreementIDViewModel model)
        {
            bool result = false;

            if (ModelState.IsValid)
            {
                // Get agreement by id.
                AgreementBLL agreementBLL = new AgreementBLL();
                Agreement agreement = agreementBLL.GetAgreementByID(model.AgreementID);
                if (agreement.createdbyid == (int)Membership.GetUser().ProviderUserKey)
                {
                    result = agreementBLL.DisassociateTask(model.AgreementID, model.ID);
                }
            }

            return result;
        }

        public ActionResult AttachContact()
        {
            return View();
        }

        [HttpPost]
        public ActionResult CreateSection(SectionViewModel newSection)
        {
            Section createdSection = new Section();
            List<SectionItem> createdSectionItems = new List<SectionItem>();

            return RedirectToAction("Index", "DashboardController");
        }

        public AgreementViewModel GetAgreementByID(int agreementID)
        {
            AgreementViewModel agreement = new AgreementViewModel();

            agreement = AutoMapper.Mapper.Map<Agreement, AgreementViewModel>(new AgreementBLL().GetAgreementByID(agreementID));

            return agreement;
        }

        public List<AgreementViewModel> GetAgreementsByUserID(int userID)
        {
            List<AgreementViewModel> agreementList = new List<AgreementViewModel>();

            agreementList = AutoMapper.Mapper.Map<List<Agreement>, List<AgreementViewModel>>(new AgreementBLL().GetAgreementsByUserID(userID));

            return agreementList;
        }
	}
}