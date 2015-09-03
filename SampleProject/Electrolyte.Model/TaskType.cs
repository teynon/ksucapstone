using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Electrolyte.Model
{
    [DataContract]
    public class TaskType
    {
        [DataMember(Name="id")]
        public int id { get; set; }

        [DataMember(Name = "name")]
        public string name { get; set; }
    }
}