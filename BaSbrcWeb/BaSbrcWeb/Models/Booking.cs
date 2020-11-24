using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Basbrc.Models
{
    public class Booking
    {
        [Key]
        public long BookingId { get; set; }

        public string MemberNumber { get; set; }
        public long SessionId { get; set; }
        public virtual Session Session {get;set;}

        [DataType(DataType.Time)]
        public TimeSpan StartTime { get; set; }
        [DataType(DataType.Time)]
        public TimeSpan EndTime { get; set; }
        public DateTime? BookingDate { get; set; }

        public Booking()
        {
        }
    }
}
