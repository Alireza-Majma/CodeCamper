using Iesi.Collections.Generic;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CodeCamper.Da
{
    [T4TS.TypeScriptInterface]
    public class Session
    {
        public Session()
        {
            this.AttendanceList = new HashedSet<Attendance>();
        }
        public virtual int Id { get; set; }
        [Required, MaxLength(50)]
        public virtual string Title { get; set; }
        public virtual string Code { get; set; }
        public virtual int SpeakerId { get; set; }
        public virtual int TrackId { get; set; }
        public virtual int TimeSlotId { get; set; }
        public virtual int RoomId { get; set; }
        public virtual string Level { get; set; }
        public virtual string Tags { get; set; }
        public virtual string Description { get; set; }
        public virtual Person Speaker { get; set; }
        public virtual Track Track { get; set; }
        public virtual TimeSlot TimeSlot { get; set; }
        public virtual Room Room { get; set; }
        
        public virtual ICollection<Attendance> AttendanceList { get; set; }
    }
}
