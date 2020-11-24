using BaSbrcWeb.Interaces;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace BaSbrcWeb.Helpers
{
    /// <summary>
    /// Class used to hash Passwords beore stornig them
    /// </summary>
    public sealed class PasswordHasher : IPasswordHasher
    {
        private const int SaltSize = 16; // 128 bit 
        private const int KeySize = 32; // 256 bit

        /// <summary>
        /// Constructor takes an instance of HashingOptions to determine
        /// the number of iterations the hashing process uses
        /// </summary>
        /// <param name="options"></param>
        public PasswordHasher(HashingOptions options)
        {
            Options = options;
        }

        private HashingOptions Options { get; }

        /// <summary>
        /// Generate a hash string for the password
        /// The sring contains: the number of ierations, the randum salt and the hash.
        /// The three values are . delimited and the salt and hash are base64 encripted
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        public string Hash(string password)
        {
            using (var algorithm = new Rfc2898DeriveBytes(
              password,
              SaltSize,
              Options.Iterations,
              HashAlgorithmName.SHA512))
            {
                var key = Convert.ToBase64String(algorithm.GetBytes(KeySize));
                var salt = Convert.ToBase64String(algorithm.Salt);

                return $"{Options.Iterations}.{salt}.{key}";
            }
        }

        /// <summary>
        /// Varify a password against a stored hash string.
        /// </summary>
        /// <param name="hash"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public (bool Verified, bool NeedsUpgrade) Check(string hash, string password)
        {
            // Split the string up into the 3 parts
            var parts = hash.Split('.', 3);

            // If there are not 3 parts there is a fault
            if (parts.Length != 3)
            {
                throw new FormatException("Unexpected hash format. " +
                  "Should be formatted as `{iterations}.{salt}.{hash}`");
            }

            // Get the propper values from the 3 parts.
            var iterations = Convert.ToInt32(parts[0]);
            var salt = Convert.FromBase64String(parts[1]);
            var key = Convert.FromBase64String(parts[2]);

            // if the nmber of iterations in the hash dont match the crrent options, the ppasswoord should be re-hashed
            var needsUpgrade = iterations != Options.Iterations;

            // hash the password with the original salt and iterations
            using (var algorithm = new Rfc2898DeriveBytes(
                password,
                salt,
                iterations,
                HashAlgorithmName.SHA512))
            {
                var keyToCheck = algorithm.GetBytes(KeySize);

                var verified = keyToCheck.SequenceEqual(key);

                return (verified, needsUpgrade);
            }
        }
    }
}
