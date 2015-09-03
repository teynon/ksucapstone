using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Electrolyte.Model
{
    [DataContract]
    public class JsonAutosuggest<T> : JSONResponse<T> where T : new()
    {
        [DataMember(Name="count")]
        public int count { get; set; }

        public JsonAutosuggest() : base() {

        }
    }
}