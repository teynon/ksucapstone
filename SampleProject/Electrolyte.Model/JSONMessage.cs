using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class JSONMessage
    {
        public bool Success { get; set; }

        public string Message { get; set; }

        public JSONMessage()
        {
            Success = false;
            Message = "";
        }
    }
}