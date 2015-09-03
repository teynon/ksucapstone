using Electrolyte.Model;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Electrolyte.DAL
{
    public class FileDAL
    {
        public File Insert(File file)
        {
            //Create necessary variables
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "INSERT INTO electrolyte.file (filename, filepath, createdby, createdate) VALUES (@filename, @filepath, @createdby, now())";
            MySqlParameter filenameParam = new MySqlParameter("@filename", MySqlDbType.VarChar, 255);
            MySqlParameter filepathParam = new MySqlParameter("@filepath", MySqlDbType.VarChar, 255);
            MySqlParameter createdbyParam = new MySqlParameter("@createdby", MySqlDbType.Int32, 11);

            filenameParam.Value = file.filename;
            filepathParam.Value = file.filepath;
            createdbyParam.Value = file.createdby;

            cmd.Parameters.Add(filenameParam);
            cmd.Parameters.Add(filepathParam);
            cmd.Parameters.Add(createdbyParam);

            file.id = cDAL.Insert(cmd);

            return file;
        }
    }
}