using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Basbrc.Models
{
    public class Session
    {
        [Key]
        public long SessionId { get; set; }
        public string Location { get; set; }
        [DataType(DataType.Date)]
        public DateTime SessionDate { get; set; }
        [DataType(DataType.Time)]
        public TimeSpan StartTime { get; set; }
        [DataType(DataType.Time)]
        public TimeSpan EndTime { get; set; }
        public int Capacity { get; set; }
        public long RoId { get; set; } = 0;
        public string RangeOfficer { get; set; }

        public virtual ICollection<Booking> Bookings { get; set; }

        public Session()
        {

        }
    }
}
