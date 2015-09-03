using Electrolyte.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Electrolyte.DAL
{
    public class TaskTypeDAL
    {


        public List<TaskType> GetTaskTypes()
        {
            //Create necessary variables
            List<TaskType> tasktypes = new List<TaskType>();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM electrolyte.tasktypes ORDER BY name";

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            tasktypes = AutoMapper.Mapper.DynamicMap<IDataReader, List<TaskType>>(dTable.CreateDataReader());

            //Return the model
            return tasktypes;
        }
    }
}