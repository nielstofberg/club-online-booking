using BaSbrcWeb.Helpers;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Basbrc.Models
{
    public class User
    {
        [Key]
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }

        public string UserRole { get; set; } = "User";

        public User() { }

        public User(string username, string password, UserRole role)
        {
            Username = username;
            UserRole = role.ToString();
            SetHashPassword(password);
        }

        public void SetHashPassword(string pw)
        {
            var ho = new HashingOptions();
            var pwh = new PasswordHasher(ho);
            Password = pwh.Hash(pw);
        }

        public void CopyFrom(User user)
        {
            FirstName = user.FirstName;
            LastName = user.LastName;
            Username = user.Username;
            UserRole = user.UserRole;
        }

        public static User Copy(User user)
        {
            return new User
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Username = user.Username,
                UserRole = user.UserRole
            };
        }
    }

    public enum UserRole
    {
        Admin,
        User,
        Member,
        RangeOfficer
    }
}
