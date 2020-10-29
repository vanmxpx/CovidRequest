using System;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models.Enums;

namespace CovidRequest.Data.Models
{
    public class Profile: EntityBase
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? PhotoUrl { get; set; }
        public string? City { get; set; }
        public string? Position { get; set; }
        public string? Clinic { get; set; }
    }
}