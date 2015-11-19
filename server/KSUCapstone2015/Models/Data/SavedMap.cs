using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KSUCapstone2015.Models.Data
{
    public class SavedMap
    {
        public int ID { get; set; }
        
        [Index(IsUnique = true)]
        [Column(TypeName = "VARCHAR")]
        [MaxLength(255)]
        public string Key { get; set; }

        public string JSON { get; set; }
    }
}