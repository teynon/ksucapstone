using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class Agreement
    {
        public int id
        { get; set; }

        public string title
        { get; set; }

        public string description
        { get; set; }

        public string type
        { get; set; }

        public DateTime? createddate
        { get; set; }

        public int createdbyid
        { get; set; }

        public int statusid
        { get; set; }

        public string agreementnumber
        { get; set; }
        
        public User CreatedBy
        { get; set; }

        public Status Status
        { get; set; }

        public List<Contact> Contacts
        { get; set; }

        public List<Task> Tasks
        { get; set; }

        public List<File> Files
        { get; set; }

        public Agreement()
        {
            Contacts = new List<Contact>();
            Files = new List<File>();
            Tasks = new List<Task>();
        }
    }
}