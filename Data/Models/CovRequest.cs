using System;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models.Enums;

namespace CovidRequest.Data.Models
{
    public class CovRequest: EntityBase
    {
        public long OwnerRef { get; set; }
        public CovRequestStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }       
        public long CreatedBy { get; set; }
        public long ModifiedBy { get; set; }
    }
}