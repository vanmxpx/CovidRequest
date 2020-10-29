using System;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using PasswordHashing;
using Microsoft.Extensions.Logging;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models;
using CovidRequest.Services.AccountService;
using CovidRequest.DTO;
using static Google.Apis.Auth.GoogleJsonWebSignature;
using Microsoft.Extensions.Options;
using CovidRequest.Configuration.Entities;
using CovidRequest.Data.Models.Enums;

namespace CovidRequest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : Controller
    {
        private readonly IDBRepository<Profile> profilesRepository;
        private readonly ILogger<ProfileController> logger;

        public ProfileController(
            IDBRepository<Profile> profilesRepository,  
            ILogger<ProfileController> logger
        )
        {
            this.profilesRepository = profilesRepository;
            this.logger = logger;
        }

        [HttpGet("{id}/photo")]
        public async Task<ActionResult> GetUserProfileImage([FromRoute] long id)
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var userId = Convert.ToInt64(claimsIdentity.FindFirst(ClaimTypes.Sid)?.Value);

            if (id != userId)
            {
                return Forbid();
            }

            var profile = this.profilesRepository.Get(id);
            if (profile == null) { 
                return NotFound();
            }

            return Ok(profile.PhotoUrl);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetUserProfile([FromRoute] long id)
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var userId = Convert.ToInt64(claimsIdentity.FindFirst(ClaimTypes.Sid)?.Value);

            if (id != userId)
            {
                return Forbid();
            }

            var profile = this.profilesRepository.Get(id);
            if (profile == null) { 
                return NotFound();
            }

            ProfileDTO profileDTO = new ProfileDTO() 
            {
                FirstName = profile.FirstName,
                LastName = profile.LastName,
                PhotoUrl = profile.PhotoUrl,
                City = profile.City,
                Clinic = profile.Clinic,
                Position = profile.Position
            };

            return Ok(profileDTO);
        }

    }
}