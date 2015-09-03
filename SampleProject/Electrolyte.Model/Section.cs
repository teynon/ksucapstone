using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class Section
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
    }
}