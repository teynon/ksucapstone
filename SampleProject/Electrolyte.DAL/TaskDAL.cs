using Electrolyte.Model;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Electrolyte.DAL
{
    public class TaskDAL
    {

        public Task Create(Task task)
        {
            //Create necessary variables
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "INSERT INTO electrolyte.task (tasktype, title, description, datetime) VALUES (@tasktype, @title, @description, @datetime)";
            MySqlParameter tasktypeParam = new MySqlParameter("@tasktype", MySqlDbType.Int32, 11);
            MySqlParameter titleParam = new MySqlParameter("@title", MySqlDbType.VarChar, 255);
            MySqlParameter descrParam = new MySqlParameter("@description", MySqlDbType.Text, 0);
            MySqlParameter datetimeParam = new MySqlParameter("@datetime", MySqlDbType.DateTime, 0);

            titleParam.Value = task.title;
            descrParam.Value = task.description;
            tasktypeParam.Value = task.tasktype;
            datetimeParam.Value = task.datetime;

            cmd.Parameters.Add(titleParam);
            cmd.Parameters.Add(descrParam);
            cmd.Parameters.Add(tasktypeParam);
            cmd.Parameters.Add(datetimeParam);

            task.id = cDAL.Insert(cmd);

            return task;
        }
    }
}