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
    public class AgreementDAL
    {
        public AgreementDAL()
        {

        }

        /// <summary>
        /// Get agreement by id.
        /// </summary>
        /// <param name="agreementID"></param>
        /// <returns></returns>
        public Agreement GetAgreementByID(int agreementID)
        {
            //Create necessary variables
            Agreement agreement = new Agreement();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM electrolyte.agreement WHERE id = " + agreementID.ToString();

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd); 

            //Map the query resulted data table to the champion class
            agreement = AutoMapper.Mapper.DynamicMap<IDataReader, List<Agreement>>(dTable.CreateDataReader()).FirstOrDefault();
            agreement.Contacts = GetContactsByAgreementID(agreementID);
            agreement.Tasks = GetTasksByAgreementID(agreementID);
            agreement.Files = GetFilesByAgreementID(agreementID);

            //Return the model
            return agreement;
        }

        public List<Agreement> GetAgreementsByUserID(int userID)
        {
            //Create necessary variables
            List<Agreement> agreements = new List<Agreement>();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM electrolyte.agreement WHERE createdbyid = " + userID.ToString();

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            agreements = AutoMapper.Mapper.DynamicMap<IDataReader, List<Agreement>>(dTable.CreateDataReader());
            for (int x = 0; x < agreements.Count; x++)
            {
                agreements[x].Contacts = GetContactsByAgreementID(agreements[x].id);
                agreements[x].Tasks = GetTasksByAgreementID(agreements[x].id);
                agreements[x].Files = GetFilesByAgreementID(agreements[x].id);
            }

            //Return the model
            return agreements;
        }

        public Agreement CreateAgreement(Agreement agreement)
        {
            //Create necessary variables
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "INSERT INTO electrolyte.agreement (title, description, type, createddate, createdbyid, statusid, agreementnumber) VALUES (@title, @description, @type, @createddate, @createdbyid, @statusid, @agreementnumber)";
            MySqlParameter titleParam = new MySqlParameter("@title", MySqlDbType.VarChar, 255);
            MySqlParameter descrParam = new MySqlParameter("@description", MySqlDbType.Text, 0);
            MySqlParameter typeParam = new MySqlParameter("@type", MySqlDbType.VarChar, 45);
            MySqlParameter createdParam = new MySqlParameter("@createddate", MySqlDbType.DateTime, 0);
            MySqlParameter createdUidParam = new MySqlParameter("@createdbyid", MySqlDbType.Int32, 11);
            MySqlParameter statusParam = new MySqlParameter("@statusid", MySqlDbType.Int32, 11);
            MySqlParameter agreementnumberParam = new MySqlParameter("@agreementnumber", MySqlDbType.VarChar, 255);

            titleParam.Value = agreement.title;
            descrParam.Value = agreement.description;
            typeParam.Value = agreement.type;
            createdParam.Value = (agreement.createddate == null) ? DateTime.Now : (DateTime)agreement.createddate;
            createdUidParam.Value = agreement.createdbyid;
            statusParam.Value = agreement.statusid;
            agreementnumberParam.Value = agreement.agreementnumber;

            cmd.Parameters.Add(titleParam);
            cmd.Parameters.Add(descrParam);
            cmd.Parameters.Add(typeParam);
            cmd.Parameters.Add(createdParam);
            cmd.Parameters.Add(createdUidParam);
            cmd.Parameters.Add(statusParam);
            cmd.Parameters.Add(agreementnumberParam);

            agreement.id = cDAL.Insert(cmd);

            return agreement;
        }

        public Agreement UpdateAgreement(Agreement agreement)
        {
            //Create necessary variables
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "UPDATE electrolyte.agreement SET title = @title, description = @description, statusid = @statusid, agreementnumber = @agreementnumber WHERE id = @id";
            MySqlParameter titleParam = new MySqlParameter("@title", MySqlDbType.VarChar, 255);
            MySqlParameter descrParam = new MySqlParameter("@description", MySqlDbType.Text, 0);
            //MySqlParameter typeParam = new MySqlParameter("@type", MySqlDbType.VarChar, 45);
            MySqlParameter statusParam = new MySqlParameter("@statusid", MySqlDbType.Int32, 11);
            MySqlParameter agreementnumberParam = new MySqlParameter("@agreementnumber", MySqlDbType.VarChar, 255);
            MySqlParameter idParam = new MySqlParameter("@id", MySqlDbType.Int32, 11);

            titleParam.Value = agreement.title;
            descrParam.Value = agreement.description;
            //typeParam.Value = agreement.type;
            idParam.Value = agreement.id;
            statusParam.Value = agreement.statusid;
            agreementnumberParam.Value = agreement.agreementnumber;

            cmd.Parameters.Add(titleParam);
            cmd.Parameters.Add(descrParam);
            //cmd.Parameters.Add(typeParam);
            cmd.Parameters.Add(idParam);
            cmd.Parameters.Add(statusParam);
            cmd.Parameters.Add(agreementnumberParam);

            cDAL.Update(cmd);

            return GetAgreementByID(agreement.id);
        }

        public List<Contact> GetContactsByAgreementID(int agreementID)
        {
            //Create necessary variables
            List<Contact> contacts = new List<Contact>();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM contact LEFT JOIN agreementcontactrelation ON agreementcontactrelation.contactid = contact.id WHERE agreementcontactrelation.agreementid = " + agreementID.ToString();

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            contacts = AutoMapper.Mapper.DynamicMap<IDataReader, List<Contact>>(dTable.CreateDataReader());

            //Return the model
            return contacts;
        }


        public List<Task> GetTasksByAgreementID(int agreementID)
        {
            //Create necessary variables
            List<Task> tasks = new List<Task>();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM task LEFT JOIN agreementtaskrelation ON agreementtaskrelation.taskid = task.id WHERE agreementtaskrelation.agreementid = " + agreementID.ToString();

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            tasks = AutoMapper.Mapper.DynamicMap<IDataReader, List<Task>>(dTable.CreateDataReader());

            //Return the model
            return tasks;
        }

        public List<File> GetFilesByAgreementID(int agreementID)
        {
            //Create necessary variables
            List<File> files = new List<File>();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM file LEFT JOIN agreementfilerelation ON agreementfilerelation.fileid = file.id WHERE agreementfilerelation.agreementid = " + agreementID.ToString();

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            files = AutoMapper.Mapper.DynamicMap<IDataReader, List<File>>(dTable.CreateDataReader());

            //Return the model
            return files;
        }

        public int CreateContactRelation(int agreementID, int contactID)
        {
            //Create necessary variables
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "INSERT INTO electrolyte.agreementcontactrelation (contactid, agreementid) VALUES (@contactid, @agreementid)";
            MySqlParameter contactParam = new MySqlParameter("@contactid", MySqlDbType.VarChar, 0);
            MySqlParameter agreementParam = new MySqlParameter("@agreementid", MySqlDbType.VarChar, 0);

            contactParam.Value = contactID;
            agreementParam.Value = agreementID;

            cmd.Parameters.Add(contactParam);
            cmd.Parameters.Add(agreementParam);

            return cDAL.Insert(cmd);
        }

        public bool DeleteContactRelation(int agreementID, int contactID)
        {
            //Create necessary variables
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "DELETE FROM electrolyte.agreementcontactrelation WHERE contactid = @contactid AND agreementid = @agreementid";
            MySqlParameter contactParam = new MySqlParameter("@contactid", MySqlDbType.VarChar, 0);
            MySqlParameter agreementParam = new MySqlParameter("@agreementid", MySqlDbType.VarChar, 0);

            contactParam.Value = contactID;
            agreementParam.Value = agreementID;

            cmd.Parameters.Add(contactParam);
            cmd.Parameters.Add(agreementParam);

            return cDAL.Delete(cmd);
        }

        public int CreateTaskRelation(int agreementID, int taskID)
        {
            //Create necessary variables
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "INSERT INTO electrolyte.agreementtaskrelation (taskid, agreementid) VALUES (@taskid, @agreementid)";
            MySqlParameter taskParam = new MySqlParameter("@taskid", MySqlDbType.VarChar, 0);
            MySqlParameter agreementParam = new MySqlParameter("@agreementid", MySqlDbType.VarChar, 0);

            taskParam.Value = taskID;
            agreementParam.Value = agreementID;

            cmd.Parameters.Add(taskParam);
            cmd.Parameters.Add(agreementParam);

            return cDAL.Insert(cmd);
        }

        public bool RemoveTaskRelation(int agreementID, int taskID)
        {
            //Create necessary variables
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "DELETE FROM electrolyte.agreementtaskrelation WHERE taskid = @taskid AND agreementid = @agreementid";
            MySqlParameter taskParam = new MySqlParameter("@taskid", MySqlDbType.VarChar, 0);
            MySqlParameter agreementParam = new MySqlParameter("@agreementid", MySqlDbType.VarChar, 0);

            taskParam.Value = taskID;
            agreementParam.Value = agreementID;

            cmd.Parameters.Add(taskParam);
            cmd.Parameters.Add(agreementParam);

            return cDAL.Delete(cmd);
        }

        public int CreateFileRelation(int agreementID, int fileID)
        {
            //Create necessary variables
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "INSERT INTO electrolyte.agreementfilerelation (fileid, agreementid) VALUES (@fileid, @agreementid)";
            MySqlParameter fileParam = new MySqlParameter("@fileid", MySqlDbType.VarChar, 0);
            MySqlParameter agreementParam = new MySqlParameter("@agreementid", MySqlDbType.VarChar, 0);

            fileParam.Value = fileID;
            agreementParam.Value = agreementID;

            cmd.Parameters.Add(fileParam);
            cmd.Parameters.Add(agreementParam);

            return cDAL.Insert(cmd);
        }

        public bool RemoveFileRelation(int agreementID, int fileID)
        {
            //Create necessary variables
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "DELETE FROM electrolyte.agreementfilerelation WHERE fileid = @fileid AND agreementid = @agreementid";
            MySqlParameter fileParam = new MySqlParameter("@fileid", MySqlDbType.VarChar, 0);
            MySqlParameter agreementParam = new MySqlParameter("@agreementid", MySqlDbType.VarChar, 0);

            fileParam.Value = fileID;
            agreementParam.Value = agreementID;

            cmd.Parameters.Add(fileParam);
            cmd.Parameters.Add(agreementParam);

            return cDAL.Delete(cmd);
        }
    }
}