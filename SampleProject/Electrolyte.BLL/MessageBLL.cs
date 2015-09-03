using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Electrolyte.Model;
using Electrolyte.DAL;

namespace Electrolyte.BLL
{
    public class MessageBLL
    {
        public Message GetMessageByID(int messageID)
        {
            //Create necessary variables
            Message message = new Message();
            MessageDAL mDAL = new MessageDAL();

            message = mDAL.GetMessageByID(messageID);

            //Return the model
            return message;
        }

        public List<Message> GetMessagesByAgreementID(int agreementID)
        {
            //Create necessary variables
            List<Message> messageList = new List<Message>();
            MessageDAL mDAL = new MessageDAL();

            //Get the data table
            messageList = mDAL.GetMessagesByAgreementID(agreementID);

            //Return the model
            return messageList;
        }
    }
}