using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Electrolyte.Models
{
    public class AgreementViewModel
    {
    }

    public class ContactViewModel
    {
        [Required]
        [Display(Name = "name")]
        public string Name { get; set; }

        [Display(Name = "phone")]
        public string Phone { get; set; }

        [Display(Name = "email")]
        public string Email { get; set; }

        [Display(Name = "street")]
        public string Street { get; set; }

        [Display(Name = "city")]
        public string City { get; set; }

        [Display(Name = "state")]
        public string State { get; set; }

        [Display(Name = "agreementid")]
        public int AgreementID { get; set; }
    }

    public class CreateAgreementViewModel
    {
        [Required]
        [Display(Name = "title")]
        public string Title { get; set; }

        [Display(Name = "description")]
        public string Description { get; set; }

        [Display(Name = "contact_name")]
        public string Contact_Name { get; set; }

        [Display(Name = "contact_phone")]
        public string Contact_Phone { get; set; }

        [Display(Name = "contact_email")]
        public string Contact_Email { get; set; }

        [Display(Name = "contact_street")]
        public string Contact_Street { get; set; }

        [Display(Name = "contact_city")]
        public string Contact_City { get; set; }

        [Display(Name = "contact_state")]
        public string Contact_State { get; set; }

        [Display(Name = "agreementid")]
        public int AgreementID { get; set; }
    }

    public class SaveAgreementViewModel
    {
        [Required]
        [Display(Name = "agreementid")]
        public int AgreementID { get; set; }

        [Required]
        [Display(Name = "title")]
        public string Title { get; set; }

        [Display(Name = "description")]
        public string Description { get; set; }

        [Display(Name = "contact_name")]
        public string Contact_Name { get; set; }

        [Display(Name = "contact_phone")]
        public string Contact_Phone { get; set; }

        [Display(Name = "contact_email")]
        public string Contact_Email { get; set; }

        [Display(Name = "contact_street")]
        public string Contact_Street { get; set; }

        [Display(Name = "contact_city")]
        public string Contact_City { get; set; }

        [Display(Name = "contact_state")]
        public string Contact_State { get; set; }
    }

    public class CreateTaskViewModel
    {
        [Required]
        [Display(Name = "task")]
        public int task { get; set; }

        [Required]
        [Display(Name = "agreementid")]
        public int agreementID { get; set; }

        [Required]
        [Display(Name = "title")]
        public string title { get; set; }

        [Display(Name = "description")]
        public string description { get; set; }

        [Display(Name = "date")]
        public DateTime date { get; set; }

        [Display(Name = "time")]
        public DateTime time { get; set; }
    }

    public class IDViewModel
    {
        [Required]
        [Display(Name = "id")]
        public int ID { get; set; }
    }

    public class AgreementIDViewModel
    {
        [Required]
        [Display(Name = "id")]
        public int ID { get; set; }

        [Required]
        [Display(Name = "agreementid")]
        public int AgreementID { get; set; }
    }
}