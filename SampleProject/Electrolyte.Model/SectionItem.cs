using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class SectionItem
    {
        public int ID
        { get; set; }

        public string Title
        { get; set; }

        public string Description
        { get; set; }

        public string Value
        { get; set; }

        public bool HoursRequired
        { get; set; }

        public decimal HoursEstimated
        { get; set; }

        public Status Status
        { get; set; }
    }
}