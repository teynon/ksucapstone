using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Electrolyte.Model
{
    [DataContract]
    public class S3Data
    {
        [DataMember(Name = "AWSAccessKeyId")]
        public string AWSAccessKeyId { get; set; }

        [DataMember(Name = "acl")]
        public string acl { get; set; }

        [DataMember(Name = "bucket")]
        public string bucket { get; set; }

        [DataMember(Name = "success_action_redirect")]
        public string success_action_redirect { get; set; }

        [DataMember(Name = "policy")]
        public string policy { get; set; }

        [DataMember(Name = "signature")]
        public string signature { get; set; }
    }

    [DataContract]
    public class S3PolicyDocument
    {
        [DataMember(Name = "expiration")]
        public string expiration { get; set; }

        [DataMember(Name = "conditions")]
        public List<string[]> conditions { get; set; }

        public S3PolicyDocument()
        {
            conditions = new List<string[]>();
        }
    }
}