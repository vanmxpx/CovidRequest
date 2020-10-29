using System;
using CovidRequest.Data.Models.Enums;

namespace CovidRequest.DTO
{
    public class CredentialsDTO
    {
        public long Id { get; set; }
        public CredentialsProvider Provider { get; set; }
        public long PersonalInfoRef { get; set; }
        public string Email { get; set; }
        public bool EmailVerified { get; set; }
        public string Login { get; set; }
        public string Phone { get; set; }
        public bool PhoneVerified { get; set; }
        public string Token { get; set; }
    }
}