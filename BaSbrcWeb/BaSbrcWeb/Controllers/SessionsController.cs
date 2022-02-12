using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Basbrc.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace Basbrc.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        private readonly DataContext _context;

        public SessionsController(DataContext context)
        {
            _context = context;
            //_context.Database.EnsureCreated();
        }

        // GET: api/Sessions
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Session>>> GetSession(bool all=false)
        {
            try
            {
                List<Session> retVal;
                if (all)
                {
                    retVal = await _context.Session
                        .OrderBy(s => s.SessionDate)
                        .Include(s => s.Bookings)
                        .ToListAsync();
                }
                else
                {
                    retVal = await _context.Session
                        .Where(s => s.SessionDate >= DateTime.Today)
                        .OrderBy(s => s.SessionDate)
                        .Include(s => s.Bookings)
                        .ToListAsync();
                }
                if (retVal.Count == 0)
                {
                    await GenerateSessionsAsync();
                    retVal = await _context.Session
                        .Include(s => s.Bookings)
                        .ToListAsync();
                }
                return Ok(retVal);
                //return new Session[3];
            }
            catch (Exception ex)
            {               
                var session = new Session();
                do
                {
                    session.Location = ex.Message + "\r\n" + ex.StackTrace + "\r\nINNER EXCEPTION\r\n";

                    ex = ex.InnerException;
                }
                while (ex != null);
                return new Session[] { session };
            }
        }

        private async Task GenerateSessionsAsync()
        {
            DateTime date = DateTime.Now.AddDays(-7);
            int count = 0;
            Session temp;
            while (count < 10)
            {
                if (date.DayOfWeek == DayOfWeek.Monday ||
                    date.DayOfWeek == DayOfWeek.Tuesday ||
                    date.DayOfWeek == DayOfWeek.Friday)
                {
                    temp = new Session {
                        Location = "25Yrd",
                        SessionDate = date,
                        StartTime = new TimeSpan(18, 30, 0),
                        EndTime = new TimeSpan(22, 00, 0),
                        Capacity = 4 };
                    _context.Session.Add(temp);
                    count++;
                }
                else if (date.DayOfWeek == DayOfWeek.Sunday)
                {
                    temp = new Session
                    {
                        Location = "25Yrd",
                        SessionDate = date,
                        StartTime = new TimeSpan(12, 30, 0),
                        EndTime = new TimeSpan(16, 00, 0),
                        Capacity = 4
                    };
                    _context.Session.Add(temp);
                    count++;
                }
                date = date.AddDays(1);
            }
            await _context.SaveChangesAsync();
        }

        private async Task ClearOldBookings()
        {
            var now = DateTime.Now;
            DateTime date = DateTime.Now.AddHours(-now.Hour).AddMinutes(-now.Minute).AddSeconds(-now.Second);

            _context.Session.RemoveRange(_context.Session.Where(s => s.SessionDate < date));
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            { }
        }

        // GET: api/Sessions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Session>> GetSession(long id)
        {
            var session = await _context.Session.Include(s=>s.Bookings).FirstAsync(n=> n.SessionId==id);

            if (session == null)
            {
                return NotFound();
            }

            return session;
        }

        // PUT: api/Sessions/5
        [Authorize(Roles = "Admin,RangeOfficer")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSession(long id, Session session)
        {
            if (id != session.SessionId)
            {
                return BadRequest();
            }

            _context.Entry(session).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SessionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Sessions
        [Authorize(Roles = "Admin,RangeOfficer")]
        [HttpPost]
        public async Task<ActionResult<Session>> PostSession(Session session)
        {
            _context.Session.Add(session);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSession", new { id = session.SessionId }, session);
        }

        // DELETE: api/Sessions/5
        [Authorize(Roles = "Admin,RangeOfficer")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Session>> DeleteSession(long id)
        {
            var session = await _context.Session.FindAsync(id);
            if (session == null)
            {
                return NotFound();
            }

            _context.Session.Remove(session);
            await _context.SaveChangesAsync();

            return session;
        }

        private bool SessionExists(long id)
        {
            return _context.Session.Any(e => e.SessionId == id);
        }
    }
}
