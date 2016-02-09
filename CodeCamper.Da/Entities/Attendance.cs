using System.ComponentModel.DataAnnotations;

namespace CodeCamper.Da
{
    /// <summary>
    /// A class representing a case of a <see cref="Person"/> attending a <see cref="Session"/>.
    /// A many-to-many link between <see cref="Person"/> and <see cref="Session"/>
    /// with a session evaluation payload.
    /// </summary>
    [T4TS.TypeScriptInterface]
    public class Attendance
    {
        public virtual int PersonId { get; set; }
        public virtual Person Person { get; set; }
        
        public virtual int SessionId { get; set; }
        public virtual Session Session { get; set; }

        /// <summary>Get and set the person's rating of the session from 1-5 (0=not rated).</summary>
        [Range(0,5)]
        public virtual int Rating { get; set; }

        /// <summary>Get and set the person's session evaluation text.</summary>
        public virtual string Text { get; set; }
        public override bool Equals(object obj)
        {
            if (obj != null)
            {
                var attendence = obj as Attendance;
                if (attendence != null)
                {
                    if (PersonId == attendence.PersonId && SessionId == attendence.SessionId)  return true;
                }
            }
            return false;
        }
        public override int GetHashCode()
        {
            return (PersonId.ToString() + "|" + SessionId.ToString()).GetHashCode();
        }
    }
}
