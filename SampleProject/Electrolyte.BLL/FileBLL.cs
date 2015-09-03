using Electrolyte.DAL;
using Electrolyte.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.BLL
{
    public class FileBLL
    {
        public FileBLL()
        {

        }

        public File Create(File f)
        {
            return new FileDAL().Insert(f);
        }
    }
}