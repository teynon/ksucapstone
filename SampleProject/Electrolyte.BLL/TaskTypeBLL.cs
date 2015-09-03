using Electrolyte.DAL;
using Electrolyte.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.BLL
{
    public class TaskTypeBLL
    {

        public List<TaskType> GetTaskTypes()
        {
            return new TaskTypeDAL().GetTaskTypes();
        }
    }
}