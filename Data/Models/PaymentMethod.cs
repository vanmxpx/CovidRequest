using System;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models.Enums;

namespace CovidRequest.Data.Models
{
    public class PaymentMethod: EntityBase
    {
        public long CardNumber { get; set; }
        public long PaymentMethodRef { get; set; }
        public string ReceiptId { get; set; }
        public long RequestsReceived { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }   
        public long CreatedBy { get; set; }
        public long ModifiedBy { get; set; }
    }
}