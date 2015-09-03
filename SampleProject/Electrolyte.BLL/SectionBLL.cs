using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Electrolyte.Model;
using Electrolyte.DAL;

namespace Electrolyte.BLL
{
    public class SectionBLL
    {
        public Section GetSectionByID(int sectionID)
        {
            //Create necessary variables
            Section section = new Section();
            SectionDAL sDAL = new SectionDAL();

            section = sDAL.GetSectionByID(sectionID);

            //Return the model
            return section;
        }

        public List<Section> GetSectionsByAgreementID(int agreementID)
        {
            //Create necessary variables
            List<Section> sectionList = new List<Section>();
            SectionDAL sDAL = new SectionDAL();

            sectionList = sDAL.GetSectionsByAgreementID(agreementID);

            //Return the model
            return sectionList;
        }

        public SectionItem GetSectionItemByID(int sectionItemID)
        {
            //Create necessary variables
            SectionItem sectionItem = new SectionItem();
            SectionDAL sDAL = new SectionDAL();

            sectionItem = sDAL.GetSectionItemByID(sectionItemID);

            //Return the model
            return sectionItem;
        }

        public List<SectionItem> GetSectionItemsBySectionID(int sectionID)
        {
            //Create necessary variables
            List<SectionItem> sectionItmList = new List<SectionItem>();
            SectionDAL sDAL = new SectionDAL();

            sectionItmList = sDAL.GetSectionItemsBySectionID(sectionID);

            //Return the model
            return sectionItmList;
        }
    }
}