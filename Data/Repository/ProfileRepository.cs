using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models;

namespace CovidRequest.Data.Repository
{
    public class ProfileRepository
    : BaseRepository<Profile, ApplicationDbContext>
    {
        public ProfileRepository(
            ApplicationDbContext context, 
            ILogger<ProfileRepository> logger
        ) : base(context, logger)
        {
        }
    }
}