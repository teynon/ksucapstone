using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class JsonResult<T>
    {
        public T data 
        { get; set; }
        public string HTML
        { get; set; }

        public JsonResult() {

        }
    }
}