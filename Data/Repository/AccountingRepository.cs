using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models;

namespace CovidRequest.Data.Repository
{
    public class AccountingRepository
    : BaseRepository<Accounting, ApplicationDbContext>
    {
        public AccountingRepository(
            ApplicationDbContext context, 
            ILogger<AccountingRepository> logger
        ) : base(context, logger)
        {
        }
    }
}