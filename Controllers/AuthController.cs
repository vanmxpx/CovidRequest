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
    public class AuthController : Controller
    {
        private readonly IDBRepository<Credentials> credsRepository;
        private readonly IDBRepository<Accounting> accountingRepository;
        private readonly IDBRepository<Profile> profilesRepository;
        private readonly ILogger<AuthController> logger;
        private readonly IAccountService accountService;
        private readonly IOptions<GoogleAuth> googleOptions;

        public AuthController(
            IDBRepository<Credentials> credsRepository,
            IDBRepository<Accounting> accountingRepository,
            IDBRepository<Profile> profilesRepository,  
            ILogger<AuthController> logger,
            IAccountService accountService,
            IOptions<GoogleAuth> googleOptions
        )
        {
            this.credsRepository = credsRepository;
            this.accountingRepository = accountingRepository;
            this.profilesRepository = profilesRepository;
            this.logger = logger;
            this.accountService = accountService;
            this.googleOptions = googleOptions;
        }

        [AllowAnonymous]
        [HttpPost("google")]
        public async Task<IActionResult> GoogleLoginAsync(GoogleLoginRequestDTO request)
        {
            Payload payload;
            try
            {
                payload = await ValidateAsync(request.Token, new ValidationSettings
                {
                    Audience = new[] { googleOptions.Value.ClientId }
                });
            }
            catch (Exception e)
            {
                return Forbid(e.Message);
            }

            var credsDTO = await GetOrCreateExternalLoginUser(payload);

            if (credsDTO == null) 
                return BadRequest("Failed to get or create user.");

            credsDTO.Token = accountService.Authenticate(credsDTO.PersonalInfoRef, credsDTO.Email);
            return Ok(credsDTO);
        }

        public async Task<CredentialsDTO> GetOrCreateExternalLoginUser(Payload profile)
        {
            var creds = this.credsRepository.Collection.FirstOrDefault(c => c.Email == profile.Email);

            if (creds != null)
                return new CredentialsDTO() 
                { 
                    Provider = creds.Provider,
                    Email = creds.Email,
                    EmailVerified = creds.EmailVerified,
                    Phone = creds.Phone,
                    PhoneVerified = creds.PhoneVerified,
                    Login = creds.Login,
                    PersonalInfoRef = creds.PersonalInfoRef
                };
            
            Credentials newCreds;
            try { 
                Profile newProfile = new Profile()
                {
                    FirstName = profile.Name,
                    LastName = profile.FamilyName,
                    PhotoUrl = profile.Picture,
                    ModifiedAt = DateTime.Now,
                    CreatedAt = DateTime.Now,
                };

                newProfile = profilesRepository.Add(newProfile);
                newProfile.CreatedBy = newProfile.Id;
                newProfile.ModifiedBy = newProfile.Id;
                
                profilesRepository.Update(newProfile);

                newCreds = new Credentials()
                {
                    Provider = CredentialsProvider.Google,
                    Email = profile.Email,
                    EmailVerified = profile.EmailVerified,
                    PersonalInfoRef = newProfile.Id,
                    ModifiedAt = DateTime.Now,
                    ModifiedBy = newProfile.Id,
                    CreatedAt = DateTime.Now,
                    CreatedBy = newProfile.Id,
                };

                newCreds = credsRepository.Add(newCreds);

                return new CredentialsDTO() 
                { 
                    Provider = newCreds.Provider,
                    Email = newCreds.Email,
                    EmailVerified = newCreds.EmailVerified,
                    PersonalInfoRef = newCreds.PersonalInfoRef
                };
            }
            catch (Exception e)
            {
                logger.LogError("Failed add a user linked to a login.");
                return null;    
            }
        }

        
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterPatinet(RegisterProfileDTO profileDTO)
        {
            if (profileDTO == null)
                return BadRequest();

            Profile newProfile = new Profile()
            {
                FirstName = profileDTO.FirstName,
                LastName = profileDTO.LastName,
                FatherName = profileDTO.FatherName,
                PhotoUrl = profileDTO.PhotoUrl,
                ModifiedAt = DateTime.Now,
                CreatedAt = DateTime.Now,
                City = profileDTO.City,
                Position = profileDTO.Position,
                Clinic = profileDTO.Clinic
            };

            newProfile = profilesRepository.Add(newProfile);
            newProfile.CreatedBy = newProfile.Id;
            newProfile.ModifiedBy = newProfile.Id;
                
            profilesRepository.Update(newProfile);

            Accounting accounting = new Accounting()
            {
                RequestsLeft = 10,
                Subscription = Subscription.Free,
                CreatedAt = DateTime.Now,
                ModifiedAt = DateTime.Now,
                CreatedBy = newProfile.Id,
                ModifiedBy = newProfile.Id
            };

            accounting = accountingRepository.Add(accounting);
                    
            Credentials user = new Credentials
            {
                Provider = CredentialsProvider.Internal,
                PersonalInfoRef = newProfile.Id,
                AccountingRef = accounting.Id,
                Password = accountService.GetHashString(profileDTO.Password),
                Email = profileDTO.Email,
                EmailVerified = false,
                Phone = profileDTO.Phone,
                PhoneVerified = false,
                CreatedAt = DateTime.Now,
                ModifiedAt = DateTime.Now,
                CreatedBy = newProfile.Id,
                ModifiedBy = newProfile.Id
            };
            user = credsRepository.Add(user);

            CredentialsDTO dto = new CredentialsDTO
            {
                Provider = user.Provider,
                PersonalInfoRef = user.PersonalInfoRef,
                AccountingRef = user.AccountingRef,
                Email = user.Email,
                EmailVerified = user.EmailVerified,
                Phone = user.Phone,
                PhoneVerified = user.PhoneVerified,
            };

            dto.Token = accountService.Authenticate(user.PersonalInfoRef, user.Email);
            return Ok(dto);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult> Login(LoginRequestDTO loginModel)
        {
            if (loginModel == null)
            {
                return BadRequest();
            }
            
            var creds = this.credsRepository.Collection.FirstOrDefault(c => c.Email == loginModel.UserName || c.Login == loginModel.UserName);
            if (creds == null) { 
                return Forbid();
            }

            if (PasswordHasher.Validate(loginModel.Password, creds.Password))
            {
                CredentialsDTO user = new CredentialsDTO() 
                { 
                    Provider = creds.Provider,
                    Email = creds.Email,
                    EmailVerified = creds.EmailVerified,
                    Phone = creds.Phone,
                    PhoneVerified = creds.PhoneVerified,
                    Login = creds.Login,
                    PersonalInfoRef = creds.PersonalInfoRef,
                    Token = accountService.Authenticate(creds.PersonalInfoRef, creds.Email)
                };

                return Ok(user);
            }
            return Forbid();
        }

        [HttpPut]
        public async Task<IActionResult> Update(
            [FromBody] Credentials entity
        )
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var profileId = Convert.ToInt64(claimsIdentity.FindFirst(ClaimTypes.Sid)?.Value);
            var creds = credsRepository.Get(entity.Id);
            if (creds.PersonalInfoRef != profileId)
            {
                return Forbid();
            }
            entity.ModifiedAt = DateTime.Now;
            entity.ModifiedBy = profileId;
            credsRepository.Update(entity);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(
            [FromRoute] long id
        )
        {
            credsRepository.Delete(id);
            return Ok();
        }

    }
}