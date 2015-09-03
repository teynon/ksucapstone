using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.Model
{
    public class File
    {
        public int id { get; set; }

        public string filename { get; set; }

        public string filepath { get; set; }

        public int createdby { get; set; }

        public DateTime createdate { get; set; }

        public DateTime ts { get; set; }
    }
}