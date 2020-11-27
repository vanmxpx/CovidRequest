using System;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models.Enums;

namespace CovidRequest.Data.Models
{
    public class Payment: EntityBase
    {
        public PaymentStatus PaymentStatus { get; set; }
        public long Amount { get; set; }
        public long PaymentMethodRef { get; set; }
        public string ReceiptId { get; set; }
        public long RequestsReceived { get; set; }
        public DateTime CreatedAt { get; set; }
        public long CreatedBy { get; set; }
    }
}