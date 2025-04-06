using Mammooth.Common.Requests.Car;
using Mammooth.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Mammooth.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Admin(IAdminService adminService) : Controller
    {
        private readonly IAdminService _adminService = adminService;
        [HttpPost("AddCar")]
        public async Task<IActionResult> AddCar([FromBody] CreateCarRequest request)
        {
            var result = await _adminService.AddCar(request);
            if (result.Success)
                return Ok(new { success = true, message = result.Message });

            return BadRequest(new { success = false, message = result.Message });
        }

    }
}