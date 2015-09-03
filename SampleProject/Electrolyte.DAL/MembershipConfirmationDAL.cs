using Electrolyte.Model;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Electrolyte.DAL
{
    public class MembershipConfirmationDAL
    {
        public MembershipConfirmationDAL()
        {

        }

        public MembershipConfirmation Create(MembershipConfirmation data)
        {
            //Create necessary variables
            MembershipConfirmation result = data;
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "INSERT INTO electrolyte.membershipconfirmation (membershipid, token, expiration) VALUES (@id, @token, @expiration)";
            MySqlParameter idParam = new MySqlParameter("@id", MySqlDbType.Int32, 0);
            MySqlParameter tokenParam = new MySqlParameter("@token", MySqlDbType.VarChar, 255);
            MySqlParameter expirationParam = new MySqlParameter("@expiration", MySqlDbType.DateTime);
            idParam.Value = data.membershipid;
            tokenParam.Value = data.token;
            expirationParam.Value = data.expiration;

            cmd.Parameters.Add(idParam);
            cmd.Parameters.Add(tokenParam);
            cmd.Parameters.Add(expirationParam);

            result.ID = cDAL.Insert(cmd);

            //Return the model
            return result;
        }

        public MembershipConfirmation CreateRecovery(MembershipConfirmation data)
        {
            //Create necessary variables
            MembershipConfirmation result = data;
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "INSERT INTO electrolyte.membershipconfirmation (membershipid, token, expiration, status) VALUES (@id, @token, @expiration, 1)";
            MySqlParameter idParam = new MySqlParameter("@id", MySqlDbType.Int32, 0);
            MySqlParameter tokenParam = new MySqlParameter("@token", MySqlDbType.VarChar, 255);
            MySqlParameter expirationParam = new MySqlParameter("@expiration", MySqlDbType.DateTime);
            idParam.Value = data.membershipid;
            tokenParam.Value = data.token;
            expirationParam.Value = data.expiration;

            cmd.Parameters.Add(idParam);
            cmd.Parameters.Add(tokenParam);
            cmd.Parameters.Add(expirationParam);

            result.ID = cDAL.Insert(cmd);

            //Return the model
            return result;
        }

        public bool Validate(int membershipid, string token)
        {
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "SELECT * FROM electrolyte.membershipconfirmation WHERE membershipid = @id AND token = @token";

            MySqlParameter idParam = new MySqlParameter("@id", MySqlDbType.Int32, 11);
            MySqlParameter tokenParam = new MySqlParameter("@token", MySqlDbType.VarChar, 255);

            idParam.Value = membershipid;
            tokenParam.Value = token;

            cmd.Parameters.Add(idParam);
            cmd.Parameters.Add(tokenParam);

            dTable = cDAL.Select(cmd);

            //Map the query resulted data table to the champion class
            List<MembershipConfirmation> confirmation = AutoMapper.Mapper.DynamicMap<IDataReader, List<MembershipConfirmation>>(dTable.CreateDataReader());
            if (confirmation[0] != null && confirmation[0].status != 2)
            {
                // Set the value to 2 and return true
                MySqlCommand cmdUpdate = new MySqlCommand();
                cmdUpdate.CommandText = "update electrolyte.membershipconfirmation SET status = 2 WHERE membershipid = @id AND token = @token";

                idParam.Value = membershipid;
                tokenParam.Value = token;

                cmdUpdate.Parameters.Add(idParam);
                cmdUpdate.Parameters.Add(tokenParam);

                cDAL.Update(cmdUpdate);

                return true;
            }

            return false;
        }

        public bool ValidateRecovery(int membershipid, string token)
        {
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            MySqlCommand cmd = new MySqlCommand();
            cmd.CommandText = "SELECT * FROM electrolyte.membershipconfirmation WHERE membershipid = @id AND token = @token AND status = 1";

            MySqlParameter idParam = new MySqlParameter("@id", MySqlDbType.Int32, 11);
            MySqlParameter tokenParam = new MySqlParameter("@token", MySqlDbType.VarChar, 255);

            idParam.Value = membershipid;
            tokenParam.Value = token;

            cmd.Parameters.Add(idParam);
            cmd.Parameters.Add(tokenParam);

            dTable = cDAL.Select(cmd);

            //Map the query resulted data table to the champion class
            List<MembershipConfirmation> confirmation = AutoMapper.Mapper.DynamicMap<IDataReader, List<MembershipConfirmation>>(dTable.CreateDataReader());
            if (confirmation[0] != null && confirmation[0].status != 2)
            {
                // Set the value to 2 and return true
                MySqlCommand cmdUpdate = new MySqlCommand();
                cmdUpdate.CommandText = "update electrolyte.membershipconfirmation SET status = 2 WHERE membershipid = @id AND token = @token AND status = 1";

                idParam.Value = membershipid;
                tokenParam.Value = token;

                cmdUpdate.Parameters.Add(idParam);
                cmdUpdate.Parameters.Add(tokenParam);

                cDAL.Update(cmdUpdate);

                return true;
            }

            return false;
        }
    }
}