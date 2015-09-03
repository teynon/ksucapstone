using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using AutoMapper;
using Electrolyte.Model;

namespace Electrolyte.DAL
{
    public class SectionDAL
    {
        public SectionDAL()
        {

        }

        public Section GetSectionByID(int sectionID)
        {
            //Create necessary variables
            Section section = new Section();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM Electrolyte.Section WHERE id = " + sectionID.ToString();

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            section = AutoMapper.Mapper.DynamicMap<IDataReader, Section>(dTable.CreateDataReader());

            //Return the model
            return section;
        }

        public List<Section> GetSectionsByAgreementID(int agreementID)
        {
            //Create necessary variables
            List<Section> sectionList = new List<Section>();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM Electrolyte.Section S INNER JOIN Electrolyte.AgreementSectionRelation REL ON REL.sectionid = S.id WHERE REL.agreementid = " + agreementID.ToString();

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            sectionList = AutoMapper.Mapper.DynamicMap<IDataReader, List<Section>>(dTable.CreateDataReader());

            //Return the model
            return sectionList;
        }

        public SectionItem GetSectionItemByID(int sectionItemID)
        {
            //Create necessary variables
            SectionItem sectionItem = new SectionItem();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM Electrolyte.Section WHERE id = " + sectionItemID.ToString();

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            sectionItem = AutoMapper.Mapper.DynamicMap<IDataReader, SectionItem>(dTable.CreateDataReader());

            //Return the model
            return sectionItem;
        }

        public List<SectionItem> GetSectionItemsBySectionID(int sectionID)
        {
            //Create necessary variables
            List<SectionItem> sectionItmList = new List<SectionItem>();
            DataTable dTable = new DataTable();
            ConnectionDAL cDAL = new ConnectionDAL();

            //Create the command to query for the sql data table
            string cmd = "SELECT * FROM Electrolyte.SectionItem SI INNER JOIN Electrolyte.SectionSectionItemRelation REL ON REL.sectionitemid = SI.id WHERE REL.sectionid = " + sectionID.ToString();

            //Get the data table
            dTable = cDAL.GetSqlQueryResults(cmd);

            //Map the query resulted data table to the champion class
            sectionItmList = AutoMapper.Mapper.DynamicMap<IDataReader, List<SectionItem>>(dTable.CreateDataReader());

            //Return the model
            return sectionItmList;
        }

    }
}