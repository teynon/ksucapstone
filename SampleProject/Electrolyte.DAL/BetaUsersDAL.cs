using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Electrolyte.Model;
using System.Data;

namespace Electrolyte.DAL
{
    public class BetaUsersDAL
    {

        public List<BetaUsers> GetUsers()
        {
            //Create necessary variables
            List<BetaUsers> users = new List<BetaUsers>();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM electrolyte.betausers";

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            users = AutoMapper.Mapper.DynamicMap<IDataReader, List<BetaUsers>>(dTable.CreateDataReader());

            //Return the model
            return users;
        }
    }
}