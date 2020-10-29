using System;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models.Enums;

namespace CovidRequest.Data.Models
{
    public class Credentials: EntityBase
    {
        public long PersonalInfoRef { get; set; }
        public CredentialsProvider Provider { get; set; }
        public string? Login { get; set; }
        public string Password { get; set; }
        public string? Email { get; set; }
        public bool EmailVerified { get; set; }
        public string? Phone { get; set; }
        public bool PhoneVerified { get; set; }
    }
}