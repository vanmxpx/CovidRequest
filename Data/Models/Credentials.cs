using System;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models.Enums;

namespace CovidRequest.Data.Models
{
    public class Credentials: EntityBase
    {
        public long PersonalInfoRef { get; set; }
        public long AccountingRef { get; set; }
        public CredentialsProvider Provider { get; set; }
        public string? Login { get; set; }
        public string Password { get; set; }
        public string? Email { get; set; }
        public bool EmailVerified { get; set; }
        public string? Phone { get; set; }
        public bool PhoneVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }       
        public long CreatedBy { get; set; }
        public long ModifiedBy { get; set; }
    }
}