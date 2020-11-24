using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WebApi.Services;
using System.Threading.Tasks;
using Basbrc.Models;
using System;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private IUserService _userService;

        public struct PasswordStruct
        {
            public string oldpassword;
            public string newpassword;
        }

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("authenticate")]
        [AllowAnonymous]
        public async Task<IActionResult> Authenticate([FromBody]User userParam)
        {
            var user = await _userService.Authenticate(userParam.Username, userParam.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            return Ok(user);
        }

        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateUser(long id, User userParam)
        {
            var user = await _userService.UpdateUser(id, userParam);
            if (user == null)
                return BadRequest(new { message = "ID or username not valid" });

            return Ok();
        }

        [HttpPut("updatepw/{id}")]
        public async Task<IActionResult> UpdatePassword(long id, PasswordStruct pwstruct)
        {
            
            var user = await _userService.UpdatePassword(id, pwstruct.newpassword);
            if (user == null)
                return BadRequest(new { message = "ID not valid" });

            return Ok(user);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAll();
            return Ok(users);
        }
    }
}
