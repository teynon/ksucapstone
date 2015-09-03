using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Electrolyte.Model;
using Electrolyte.DAL;

namespace Electrolyte.BLL
{
    public class AgreementBLL
    {
        public Agreement CreateAgreement(Agreement agreement)
        {
            AgreementDAL agreeDAL = new AgreementDAL();
            // Create agreement and associated contacts
            agreement = agreeDAL.CreateAgreement(agreement);
            if (agreement.id != 0)
            {
                // Save contacts.
                for (int x = 0; x < agreement.Contacts.Count; x++)
                {
                    agreement.Contacts[x] = new ContactBLL().CreateContact(agreement.Contacts[x]);

                    // Create association.
                    if (agreement.Contacts[x].id != 0)
                    {
                        AssociateContact(agreement, agreement.Contacts[x]);
                    }
                }

                for (int x = 0; x < agreement.Files.Count; x++)
                {
                    AssociateFile(agreement, agreement.Files[x]);
                }
            }
            return agreement;
        }

        public Agreement SaveAgreement(Agreement agreement)
        {
            AgreementDAL agreeDAL = new AgreementDAL();
            // Create agreement and associated contacts
            return agreeDAL.UpdateAgreement(agreement);
        }

        public Agreement GetAgreementByID(int agreementID)
        {
            Agreement agreement = new Agreement();

            agreement = new AgreementDAL().GetAgreementByID(agreementID);

            return agreement;
        }

        public List<Agreement> GetAgreementsByUserID(int userID)
        {
            return new AgreementDAL().GetAgreementsByUserID(userID);
        }

        public int AssociateContact(Agreement agreement, Contact contact)
        {
            int result = 0;

            result = new AgreementDAL().CreateContactRelation(agreement.id, contact.id);

            return result;
        }

        public bool DisassociateContact(int agreementID, int contactID)
        {
            return new AgreementDAL().DeleteContactRelation(agreementID, contactID);
        }

        public int AssociateTask(Agreement agreement, Task task)
        {
            int result = 0;
            result = new AgreementDAL().CreateTaskRelation(agreement.id, task.id);

            return result;
        }

        public bool DisassociateTask(int agreementID, int taskID)
        {
            return new AgreementDAL().RemoveTaskRelation(agreementID, taskID);
        }

        public int AssociateFile(Agreement agreement, File file)
        {
            int result = 0;
            result = new AgreementDAL().CreateFileRelation(agreement.id, file.id);

            return result;
        }

        public bool DisassociateFile(int agreementID, int fileID)
        {
            return new AgreementDAL().RemoveFileRelation(agreementID, fileID);
        }
    }
}