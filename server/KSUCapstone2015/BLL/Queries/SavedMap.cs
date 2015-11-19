using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KSUCapstone2015.BLL.Queries
{
    public class SavedMap
    {
        private static DAL.SavedMaps MapDAL;
        static SavedMap()
        {
            MapDAL = new DAL.SavedMaps();
        }

        public Models.Data.SavedMap Save(string json)
        {
            var key = Guid.NewGuid().ToString("N");
            MapDAL.New(key, json);
            return GetByKey(key);
        }

        public Models.Data.SavedMap GetByKey(string key)
        {
            return MapDAL.GetByKey(key);
        }
    }
}