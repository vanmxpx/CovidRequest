using System;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models.Enums;

namespace CovidRequest.DTO
{
    public class RegisterProfileDTO
    {
        public string Email { get; set; }
        public string Phone { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FatherName { get; set; }
        public string PhotoUrl { get; set; }
        public string City { get; set; }
        public string Position { get; set; }
        public string Clinic { get; set; }
        public string Password { get; set; }
    }
}