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
        private readonly IDBRepository<Profile> profilesRepository;
        private readonly ILogger<AuthController> logger;
        private readonly IAccountService accountService;
        private readonly IOptions<GoogleAuth> googleOptions;

        public AuthController(
            IDBRepository<Credentials> credsRepository,
            IDBRepository<Profile> profilesRepository,  
            ILogger<AuthController> logger,
            IAccountService accountService,
            IOptions<GoogleAuth> googleOptions
        )
        {
            this.credsRepository = credsRepository;
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
                    PhotoUrl = profile.Picture
                };

                newProfile = profilesRepository.Add(newProfile);

                newCreds = new Credentials()
                {
                    Provider = CredentialsProvider.Google,
                    Email = profile.Email,
                    EmailVerified = profile.EmailVerified,
                    PersonalInfoRef = newProfile.Id
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



        // [AllowAnonymous]
        // [HttpPost("register")]
        // public async Task<IActionResult> Register(AccountDTO accountDTO)
        // {
        //     if (accountDTO == null)
        //         return BadRequest();

        //     AuthRequest authRequest = new AuthRequest()
        //     {
        //         FirstName = accountDTO.FirstName,
        //         LastName = accountDTO.LastName,
        //         FatherName = accountDTO.FatherName,
        //         Sex = accountDTO.Sex,
        //         Bith = accountDTO.Bith.ToString(),
        //         PhotoUrl = accountDTO.PhotoUrl,
        //         Email = accountDTO.Email,
        //         Phone = accountDTO.Phone
        //     };

        //     string idPatient = _gRPCAuthClient.AddPatient(authRequest);
        //     ApplicationUser user = new ApplicationUser
        //     {
        //         UserName = accountDTO.Email,
        //         PersonId = idPatient,
        //         Role = MISUserRole.PATIENT,
        //         Password = _accountService.GetHashString(accountDTO.Password),
        //         Email = accountDTO.Email,
        //         CreateTimeEmail = DateTime.Now,
        //         ModifiedTimeEmail = DateTime.Now,
        //         ConfirmedEmail = false,
        //         Phone = accountDTO.Phone,
        //         CreateTimePhone = DateTime.Now,
        //         ModifiedTimePhone = DateTime.Now,
        //         ConfirmedPhone = false
        //     };
        //     var result = await _userManager.CreateAsync(user);
        //     if (result.Succeeded)
        //     {
        //         await signInManager.SignInAsync(user, false);
        //         user.Password = null;
        //         user.Token = _accountService.Authenticate(idPatient, user.Email, user.Role);
        //         return Ok(user);
        //     }
        //     return Ok(string.Join(",", result.Errors?.Select(error => error.Description)));
        // }

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
                    PersonalInfoRef = creds.PersonalInfoRef
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
            var userId = Convert.ToInt64(claimsIdentity.FindFirst(ClaimTypes.Sid)?.Value);

            if (entity.Id != userId)
            {
                return Forbid();
            }

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