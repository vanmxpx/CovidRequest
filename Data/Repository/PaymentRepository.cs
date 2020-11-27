using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models;

namespace CovidRequest.Data.Repository
{
    public class PaymentRepository
    : BaseRepository<Payment, ApplicationDbContext>
    {
        public PaymentRepository(
            ApplicationDbContext context, 
            ILogger<PaymentRepository> logger
        ) : base(context, logger)
        {
        }
    }
}