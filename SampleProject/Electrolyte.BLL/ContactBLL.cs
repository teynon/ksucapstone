using Electrolyte.DAL;
using Electrolyte.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Electrolyte.BLL
{
    public class ContactBLL
    {
        public ContactBLL()
        {

        }

        public Contact CreateContact(Contact c)
        {
            return new ContactDAL().InsertContact(c);
        }
    }
}