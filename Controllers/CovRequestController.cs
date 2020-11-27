using System;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models;
using CovidRequest.DTO;

namespace CovidRequest.Controllers
{
    [Route("api/covid-request")]
    [ApiController]
    [Authorize]
    public class CovRequestController : Controller
    {
        private readonly IDBRepository<Accounting> accountingRepository;
        private readonly IDBRepository<CovRequest> covidReqRepository;
        private readonly IDBRepository<Credentials> credentialsRepository;
        private readonly ILogger<CovRequestController> logger;

        public CovRequestController(
            IDBRepository<Accounting> accountingRepository,  
            IDBRepository<CovRequest> covidReqRepository,  
            IDBRepository<Credentials> credentialsRepository,  
            ILogger<CovRequestController> logger
        )
        {
            this.credentialsRepository = credentialsRepository;
            this.accountingRepository = accountingRepository;
            this.covidReqRepository = covidReqRepository;
            this.logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<AccountingDTO>> SaveRequests([FromBody] CovRequestDTO[] requestDtos)
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var userId = Convert.ToInt64(claimsIdentity.FindFirst(ClaimTypes.Sid)?.Value);
            
            var creds = this.credentialsRepository.Collection.FirstOrDefault(c => c.PersonalInfoRef == userId);
            if (creds == null)
            {
                return BadRequest("Credentials missing.");
            }

            var acc = this.accountingRepository.Get(creds.AccountingRef);
            if (acc == null)
            {
                return BadRequest("Accountig missing.");
            }

            if (acc.RequestsLeft < requestDtos.Length)
            {
                return Forbid("Not enough requests.");
            }

            var requests =  requestDtos.Select( r => new CovRequest() { 

            }).ToList();

            this.covidReqRepository.AddRange(requests);
            acc.RequestsLeft -= requestDtos.Length;
            acc = this.accountingRepository.Update(acc);

            return Ok(acc);
        }
    }
}