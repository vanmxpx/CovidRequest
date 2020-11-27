using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models;

namespace CovidRequest.Data.Repository
{
    public class CovRequestRepository
    : BaseRepository<CovRequest, ApplicationDbContext>
    {
        public CovRequestRepository(
            ApplicationDbContext context, 
            ILogger<CovRequestRepository> logger
        ) : base(context, logger)
        {
        }
    }
}