using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using Electrolyte.Model;
using System.Data;
using MySql.Data.MySqlClient;

namespace Electrolyte.DAL
{
    public class ContactDAL
    {
        public ContactDAL()
        {

        }

        public Contact GetContactByID(int id)
        {
            //Create necessary variables
            Contact contact = new Contact();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM Electrolyte.contract WHERE id = " + id.ToString();

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd); 

            //Map the query resulted data table to the champion class
            contact = AutoMapper.Mapper.DynamicMap<IDataReader, Contact>(dTable.CreateDataReader());

            //Return the model
            return contact;
        }

        public Contact InsertContact(Contact contact)
        {
            //Create necessary variables
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "INSERT INTO electrolyte.contact (nickname, firstname, lastname, middle, phone, cell, street, city, state, zip, email) VALUES (@nickname, @first, @last, @middle, @phone, @cell, @street, @city, @state, @zip, @email)";

            MySqlParameter nicknameParam = new MySqlParameter("@nickname", MySqlDbType.VarChar, 60);
            MySqlParameter firstParam = new MySqlParameter("@first", MySqlDbType.VarChar, 60);
            MySqlParameter lastParam = new MySqlParameter("@last", MySqlDbType.VarChar, 60);
            MySqlParameter middleParam = new MySqlParameter("@middle", MySqlDbType.VarChar, 60);
            MySqlParameter phoneParam = new MySqlParameter("@phone", MySqlDbType.VarChar, 60);
            MySqlParameter cellParam = new MySqlParameter("@cell", MySqlDbType.VarChar, 60);
            MySqlParameter streetParam = new MySqlParameter("@street", MySqlDbType.VarChar, 60);
            MySqlParameter cityParam = new MySqlParameter("@city", MySqlDbType.VarChar, 60);
            MySqlParameter stateParam = new MySqlParameter("@state", MySqlDbType.VarChar, 60);
            MySqlParameter zipParam = new MySqlParameter("@zip", MySqlDbType.VarChar, 60);
            MySqlParameter emailParam = new MySqlParameter("@email", MySqlDbType.VarChar, 255);

            nicknameParam.Value = contact.nickname;
            firstParam.Value = contact.firstname;
            lastParam.Value = contact.lastname;
            middleParam.Value = contact.middle;
            phoneParam.Value = contact.phone;
            cellParam.Value = contact.cell;
            streetParam.Value = contact.street;
            cityParam.Value = contact.city;
            stateParam.Value = contact.state;
            zipParam.Value = contact.zip;
            emailParam.Value = contact.email;

            cmd.Parameters.Add(nicknameParam);
            cmd.Parameters.Add(firstParam);
            cmd.Parameters.Add(lastParam);
            cmd.Parameters.Add(middleParam);
            cmd.Parameters.Add(phoneParam);
            cmd.Parameters.Add(cellParam);
            cmd.Parameters.Add(streetParam);
            cmd.Parameters.Add(cityParam);
            cmd.Parameters.Add(stateParam);
            cmd.Parameters.Add(zipParam);
            cmd.Parameters.Add(emailParam);

            contact.id = cDAL.Insert(cmd);

            return contact;
        }
    }
}