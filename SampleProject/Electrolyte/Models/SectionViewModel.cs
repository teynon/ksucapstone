using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Electrolyte.Model;

namespace Electrolyte.Models
{
    public class SectionViewModel
    {
        public int ID
        { get; set; }

        public string Title
        { get; set; }

        public string Description
        { get; set; }

        public bool isCompleted
        { get; set; }

        public Status Status
        { get; set; }

        public int AgreementID
        { get; set; }

        public List<SectionItemViewModel> SectionItemList
        { get; set; }

        public List<MessageViewModel> MessageLog
        { get; set; }
    }
}