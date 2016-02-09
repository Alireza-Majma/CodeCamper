using System;
using System.Collections.Generic;

namespace CodeCamper.Da
{
    [T4TS.TypeScriptInterface]
    public class TimeSlot
    {
        public TimeSlot()
        {
            IsSessionSlot = true;
        }
        public virtual int Id { get; set; }
        public virtual Nullable<System.DateTime> Start { get; set; }
        public virtual bool IsSessionSlot { get; set; }

        /// <summary>Duration of session in minutes.</summary>
        public virtual int Duration { get; set; }
        
    }
}
