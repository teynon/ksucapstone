using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using KSUCapstone2015.Models.Data;

namespace KSUCapstone2015.DAL
{
    public class SavedMaps
    {
        public SavedMap GetByKey(string key)
        {
            SavedMap result = null;
            using (var context = new DAL.MySQLDBContext())
            {
                //context.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
                result = context.SavedMaps.Where(o => o.Key == key).FirstOrDefault();
            }

            return result;
        }

        public int New(string key, string json)
        {
            SavedMap map = new SavedMap()
            {
                Key = key,
                JSON = json
            };
            try {
                using (var context = new DAL.MySQLDBContext())
                {
                    context.SavedMaps.Add(map);
                    context.SaveChanges();
                    return map.ID;
                }
            }
            catch (Exception) {}

            return -1;
        }
    }
}