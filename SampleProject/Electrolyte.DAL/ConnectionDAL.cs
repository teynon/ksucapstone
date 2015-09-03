using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using MySql.Data.MySqlClient;
using AutoMapper;
using System.Data.SqlClient;

namespace Electrolyte.DAL
{
    public class ConnectionDAL
    {
        public DataTable GetSqlQueryResults(string cmd)
        {
            //Create the data table
            DataTable dTable = new DataTable();

            //Open the SQL connection:
            using (MySqlConnection sqlCon = new MySqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["MySQLServer"].ConnectionString))
            {
                sqlCon.Open();
                //Fille the data table
                using (MySqlDataAdapter dAdapter = new MySqlDataAdapter(cmd, sqlCon))
                {
                    dAdapter.Fill(dTable);
                    return dTable;
                }
            }
        }

        public int Insert(MySqlCommand cmd)  
        {
            using (MySqlConnection sqlCon = new MySqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["MySQLServer"].ConnectionString))
            {
                sqlCon.Open();
                cmd.Connection = sqlCon;
                cmd.Prepare();
                cmd.ExecuteNonQuery();
                return (int)cmd.LastInsertedId;
            }
        }

        public bool Delete(MySqlCommand cmd)
        {
            try
            {
                using (MySqlConnection sqlCon = new MySqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["MySQLServer"].ConnectionString))
                {
                    sqlCon.Open();
                    cmd.Connection = sqlCon;
                    cmd.Prepare();
                    cmd.ExecuteNonQuery();
                    return true;
                }
            }
            catch (Exception) { }
            return false;
        }

        public void Update(MySqlCommand cmd)
        {
            using (MySqlConnection sqlCon = new MySqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["MySQLServer"].ConnectionString))
            {
                sqlCon.Open();
                cmd.Connection = sqlCon;
                cmd.Prepare();
                cmd.ExecuteNonQuery();
            }
        }

        public DataTable Select(MySqlCommand cmd)
        {
            //Create the data table
            DataTable dTable = new DataTable();

            using (MySqlConnection sqlCon = new MySqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["MySQLServer"].ConnectionString))
            {
                sqlCon.Open();

                cmd.Connection = sqlCon;
                cmd.Prepare();

                using (MySqlDataAdapter dAdapter = new MySqlDataAdapter())
                {
                    dAdapter.SelectCommand = cmd;
                    dAdapter.Fill(dTable);
                    return dTable;
                }
            }
        }
    }
}