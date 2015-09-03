using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class Message
    {
        public int ID
        { get; set; }

        public string MessageDescription
        { get; set; }

        public DateTime CreatedDate
        { get; set; }

        public User CreatedBy
        { get; set; }

        public Status Status
        { get; set; }
    }
}