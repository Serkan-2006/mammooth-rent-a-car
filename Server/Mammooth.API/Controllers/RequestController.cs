using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mammooth.Common.Requests.Request;
using Mammooth.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Mammooth.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestController : Controller
    {
        private readonly IRequestService _requestService;
        private readonly IAuthService _authService;

        public RequestController(IRequestService requestService, IAuthService authService)
        {
            _requestService = requestService;
            _authService = authService;
        }

        [HttpPost("GetAvailableCars")]
        public async Task<IActionResult> GetAvailableCars([FromBody] GetAvailableCarsRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cars = await _requestService.GetAvailableCarsAsync(request.StartDate, request.EndDate);
            return Ok(cars);
        }

        [HttpPost("SubmitRentialRequest")]
        //[Authorize]
        public async Task<IActionResult> SubmitRentalRequest([FromBody] CreateRequestRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var authHeader = HttpContext.Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return Unauthorized(new { success = false, message = "Token missing or invalid." });

            var token = authHeader.Replace("Bearer ", "");

            var (user, roles) = await _authService.GetUserFromTokenAsync(token);

            if (user == null)
                return Unauthorized(new { success = false, message = "Invalid token." });

            
            var userId = user.Id;
            var success = await _requestService.SubmitRentalRequestAsync(request, userId);

            return success ? Ok("Rental request submitted!") : BadRequest("Something went wrong.");
        }
    }
}