using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Electrolyte.Model
{
    [DataContract]
    public class JSONResponse<T> where T : new()
    {
        [DataMember(Name="Status")]
        public int Status { get; set; }

        public T Data { get; set; }


        public JSONResponse() 
        {
            Data = new T();
        }
    }
}