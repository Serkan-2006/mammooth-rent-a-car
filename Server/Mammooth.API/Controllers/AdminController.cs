using Mammooth.Common.Requests.Car;
using Mammooth.Common.Requests.User;
using Mammooth.Domain.DTOs;
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
        [HttpDelete("DeleteCar/{id}")]
        public async Task<IActionResult> DeleteCar(string id)
        {
            var result = await _adminService.DeleteCar(id);
            if (result.Success)
                return Ok(new { success = true, message = result.Message });

            return BadRequest(new { success = false, message = result.Message });
        }
        [HttpPut("UpdateCar/{id}")]
        public async Task<IActionResult> UpdateCar(string id, [FromBody] CarUpdateModel request)
        {
            var result = await _adminService.UpdateCar(id, request);
            if (result.Success)
                return Ok(new { success = true, message = result.Message });

            return BadRequest(new { success = false, message = result.Message });
        }
        [HttpGet("GetAllCarEnquieries")]
        public async Task<IActionResult> GetAllCarEnqueries()
        {
            var (success, message, data) = await _adminService.GetAllCarEnqueries();

            if (!success)
            {
                return BadRequest(new { success = false, message });
            }

            return Ok(new { success = true, message, data });
        }
        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser([FromBody] CreateUserRequest request)
        {
            var result = await _adminService.AddUser(request);
            if (result.Success)
                return Ok(new { success = true, message = result.Message });

            return BadRequest(new { success = false, message = result.Message });
        }
        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var result = await _adminService.DeleteUser(id);
            if (result.Success)
                return Ok(new { success = true, message = result.Message });

            return BadRequest(new { success = false, message = result.Message });
        }
        [HttpPut("UpdateUser/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserUpdateModel request)
        {
            var result = await _adminService.UpdateUser(id, request);
            if (result.Success)
                return Ok(new { success = true, message = result.Message });

            return BadRequest(new { success = false, message = result.Message });
        }
        [HttpGet("GetAllUserEnquieries")]
        public async Task<IActionResult> GetAllUserEnqueries()
        {
            var (success, message, data) = await _adminService.GetAllUserEnqueries();

            if (!success)
            {
                return BadRequest(new { success = false, message });
            }

            return Ok(new { success = true, message, data });
        }
    }
}