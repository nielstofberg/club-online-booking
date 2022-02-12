using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace BaSbrcWeb.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : Controller
    {
        IHostApplicationLifetime applicationLifetime;

        public AdminController(IHostApplicationLifetime appLifetime)
        {
            applicationLifetime = appLifetime;
        }

        [AllowAnonymous]
        [HttpGet("blow-me-up")]
        public IActionResult BlowMeUp()
        {
            applicationLifetime.StopApplication();
            return new EmptyResult();
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}