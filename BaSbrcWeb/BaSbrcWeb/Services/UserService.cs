using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Basbrc.Models;
using BaSbrcWeb.Helpers;
using Microsoft.Extensions.Options;
using WebApi.Helpers;

namespace WebApi.Services
{
  public interface IUserService
    {
        Task<User> Authenticate(string username, string password);
        Task<User> GetUser(long userId);
        Task<User> UpdateUser(long id, User userParam);
        Task<User> UpdatePassword(long id, string password);
        Task<IEnumerable<User>> GetAll();
    }

    public class UserService : IUserService
    {
        private DataContext _context;

        public UserService(DataContext context)
        {
            _context = context;
            _context.Database.EnsureCreated();
            SeedAdminUser();
        }

        private void SeedAdminUser()
        {
            if (_context.User.Count() == 0)
            {
                var user = new User("administrator", "admin", UserRole.Admin);
                user.FirstName = "Administrator";
                _context.User.Add(user);
                _context.SaveChanges();
            }
        }

        public async Task<User> Authenticate(string username, string password)
        {
            User user = null;
            await Task.Run(() =>
            {
                var users = _context.User.Where(u => (username.ToLower() == u.Username.ToLower()));

                var ph = new PasswordHasher(new HashingOptions());
                foreach (var u in users)
                {
                    if (ph.Check(u.Password, password).Verified)
                    {
                        user = u;
                    }
                }
            });

            // return null if user not found
            if (user == null)
                return null;

            // authentication successful so return user details without password
            user = User.Copy(user);
            return user;
        }

        public async Task<User> GetUser(long userId)
        {
            try
            {
                var user = await _context.User.FindAsync(userId);
                user.Password = null;
                return user;
            }
            catch
            {
                return null;
            }
        }

        public async Task<User> UpdateUser(long id, User userParam)
        {
            try
            {
                var user = await _context.User.FindAsync(id);
                // This does not support username change.
                if (user.Username.ToLower() != userParam.Username.ToLower())
                {
                    return null;
                }
                user.CopyFrom(userParam);
                _context.User.Update(user);
                _context.SaveChanges();
                return User.Copy(user); // Make a copy and get rid of the password before returning the userser
            }
            catch(Exception ex)
            {
                return null;
            }
        }

        public async Task<User> UpdatePassword(long id, string password)
        {
            try
            {
                var user = await _context.User.FindAsync(id);
                user.SetHashPassword(password);
                _context.User.Update(user);
                _context.SaveChanges();

                return User.Copy(user); // Make a copy and get rid of the password before returning the user
            }
            catch
            {
                return null;
            }
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            // return users without passwords
            return await Task.Run(() => _context.User.ToArray().Select(x => {
                x.Password = null;
                return x;
            }));
        }
    }
}