using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models;

namespace CovidRequest.Data.Repository
{
    public class CredentialsRepository
    : BaseRepository<Credentials, ApplicationDbContext>
    {
        public CredentialsRepository(
            ApplicationDbContext context, 
            ILogger<CredentialsRepository> logger
        ) : base(context, logger)
        {
        }
    }
}