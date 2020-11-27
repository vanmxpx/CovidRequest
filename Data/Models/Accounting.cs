using System;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models.Enums;

namespace CovidRequest.Data.Models
{
    public class Accounting: EntityBase
    {
        public int RequestsLeft { get; set; }
        public Subscription Subscription { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }       
        public long CreatedBy { get; set; }
        public long ModifiedBy { get; set; }
    }
}