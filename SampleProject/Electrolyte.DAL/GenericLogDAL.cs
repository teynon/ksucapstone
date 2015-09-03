using Electrolyte.Model;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Electrolyte.DAL
{
    public class GenericLogDAL
    {
        public GenericLogDAL() { }

        public GenericLog Create(GenericLog log)
        {
            //Create necessary variables
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "INSERT INTO electrolyte.genericlog (`key`, `sessionid`, `value`) VALUES (@key, @sessionid, @value)";
            MySqlParameter keyParam = new MySqlParameter("@key", MySqlDbType.VarChar, 50);
            MySqlParameter sessionidParam = new MySqlParameter("@sessionid", MySqlDbType.VarChar, 255);
            MySqlParameter valueParam = new MySqlParameter("@value", MySqlDbType.VarChar, 255);

            keyParam.Value = log.key;
            sessionidParam.Value = log.sessionid;
            valueParam.Value = log.value;

            cmd.Parameters.Add(keyParam);
            cmd.Parameters.Add(sessionidParam);
            cmd.Parameters.Add(valueParam);

            log.id = cDAL.Insert(cmd);

            return log;
        }
    }
}