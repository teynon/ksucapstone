using Electrolyte.DAL;
using Electrolyte.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.BLL
{
    public class TaskBLL
    {
        public Task Create(Task c)
        {
            return new TaskDAL().Create(c);
        }
    }
}