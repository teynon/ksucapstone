using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Electrolyte.Model
{
    [DataContract]
    public class Task
    {
        [DataMember(Name = "id")]
        public int id { get; set; }

        [DataMember(Name = "tasktype")]
        public int tasktype { get; set; }

        [DataMember(Name = "title")]
        public string title { get; set; }

        [DataMember(Name = "description")]
        public string description { get; set; }

        [DataMember(Name = "datetime")]
        public DateTime datetime { get; set; }

        [DataMember(Name = "ts")]
        public DateTime ts { get; set; }
    }
}