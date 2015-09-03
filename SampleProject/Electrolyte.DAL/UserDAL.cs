using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using AutoMapper;
using Electrolyte.Model;
using MySql.Data.MySqlClient;

namespace Electrolyte.DAL
{
    public class UserDAL
    {
        public UserDAL()
        {

        }

        public User Create(User user)
        {
            //Create necessary variables
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "INSERT INTO electrolyte.user (uid, first, last, company, datecreated) VALUES (@uid, @first, @last, @company, now())";
            MySqlParameter uidParam = new MySqlParameter("@uid", MySqlDbType.Int32, 11);
            MySqlParameter firstParam = new MySqlParameter("@first", MySqlDbType.VarChar, 60);
            MySqlParameter lastParam = new MySqlParameter("@last", MySqlDbType.VarChar, 60);
            MySqlParameter companyParam = new MySqlParameter("@company", MySqlDbType.VarChar, 60);

            uidParam.Value = user.uid;
            firstParam.Value = user.first;
            lastParam.Value = user.last;
            companyParam.Value = user.company;

            cmd.Parameters.Add(uidParam);
            cmd.Parameters.Add(firstParam);
            cmd.Parameters.Add(lastParam);
            cmd.Parameters.Add(companyParam);

            user.id = cDAL.Insert(cmd);

            return user;
        }

        public User GetUserByID(int userID)
        {
            //Create necessary variables
            User user = new User();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM electrolyte.user WHERE uid = " + userID.ToString();

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd); 

            //Map the query resulted data table to the champion class
            user = AutoMapper.Mapper.DynamicMap<IDataReader, List<User>>(dTable.CreateDataReader()).FirstOrDefault();

            //Return the model
            return user;
        }

        public List<User> GetAllUsers()
        {
            //Create necessary variables
            List<User> userList = new List<User>();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM electrolyte.User";

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            userList = AutoMapper.Mapper.DynamicMap<IDataReader, List<User>>(dTable.CreateDataReader());

            //Return the model
            return userList;
        }

        public User GetUserByUsername(string username)
        {
            //Create necessary variables
            User user = new User();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM electrolyte.User WHERE username = '" + username + "'";

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            user = AutoMapper.Mapper.DynamicMap<IDataReader, List<User>>(dTable.CreateDataReader()).First();

            //Return the model
            return user;
        }
    }
}