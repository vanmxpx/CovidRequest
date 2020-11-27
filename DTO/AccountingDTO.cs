using System;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models.Enums;

namespace CovidRequest.DTO
{
    public class AccountingDTO
    {
        public uint RequestsLeft { get; set; }
        public Subscription Subscription { get; set; }
    }
}