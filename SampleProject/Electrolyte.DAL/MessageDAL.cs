using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using AutoMapper;
using Electrolyte.Model;

namespace Electrolyte.DAL
{
    public class MessageDAL
    {
        public MessageDAL()
        {

        }

        public Message GetMessageByID(int messageID)
        {
            //Create necessary variables
            Message messageList = new Message();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM Electrolyte.Message M WHERE M.id = " + messageID.ToString();

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            messageList = AutoMapper.Mapper.DynamicMap<IDataReader, Message>(dTable.CreateDataReader());

            //Return the model
            return messageList;
        }

        public List<Message> GetMessagesByAgreementID(int agreementID)
        {
            //Create necessary variables
            List<Message> messageList = new List<Message>();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM Electrolyte.Message M INNER JOIN Electrolyte.AgreementMessageRelation REL ON REL.messageid = M.id WHERE REL.agreementid = " + agreementID.ToString();

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            messageList = AutoMapper.Mapper.DynamicMap<IDataReader, List<Message>>(dTable.CreateDataReader());

            //Return the model
            return messageList;
        }
    }
}